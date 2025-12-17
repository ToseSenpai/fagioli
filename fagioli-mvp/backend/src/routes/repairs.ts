import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendAppointmentConfirmation, sendStatusUpdate, sendReadyForPickup } from '../services/sms';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/repairs
 * List all repairs with optional filters
 */
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, startDate, endDate, search } = req.query;

    // Build filter conditions
    const where: any = {};

    if (status && typeof status === 'string') {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { trackingCode: { contains: search.toUpperCase() } },
        { vehicle: { plate: { contains: search.toUpperCase() } } },
        { customer: { name: { contains: search } } },
        { customer: { phone: { contains: search } } },
      ];
    }

    const repairs = await prisma.repair.findMany({
      where,
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
        vehicle: {
          select: {
            plate: true,
            brand: true,
            model: true,
            year: true,
          },
        },
        photos: {
          select: {
            id: true,
            photoType: true,
            url: true,
          },
          take: 1,
        },
        _count: {
          select: {
            photos: true,
            statusHistory: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      repairs: repairs.map((repair) => ({
        id: repair.id,
        trackingCode: repair.trackingCode,
        status: repair.status,
        repairType: repair.repairType,
        customer: repair.customer,
        vehicle: repair.vehicle,
        dates: {
          preferredDate: repair.preferredDate,
          preferredTime: repair.preferredTime,
          confirmedDate: repair.confirmedDate,
          confirmedTime: repair.confirmedTime,
          estimatedCompletion: repair.estimatedCompletion,
        },
        photoCount: repair._count.photos,
        thumbnail: repair.photos[0]?.url || null,
        createdAt: repair.createdAt,
        updatedAt: repair.updatedAt,
      })),
    });
  } catch (error) {
    console.error('List repairs error:', error);
    res.status(500).json({ error: 'Failed to fetch repairs' });
  }
});

/**
 * GET /api/repairs/:id
 * Get detailed repair information
 */
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const repair = await prisma.repair.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        photos: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        statusHistory: {
          orderBy: {
            changedAt: 'desc',
          },
        },
      },
    });

    if (!repair) {
      res.status(404).json({ error: 'Repair not found' });
      return;
    }

    res.json({ repair });
  } catch (error) {
    console.error('Get repair error:', error);
    res.status(500).json({ error: 'Failed to fetch repair' });
  }
});

/**
 * PATCH /api/repairs/:id
 * Update repair information
 */
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      status,
      confirmedDate,
      confirmedTime,
      estimatedCompletion,
      actualCompletion,
      notes,
      staffNotes,
    } = req.body;

    // Build update data
    const updateData: any = {};

    if (status) updateData.status = status;
    if (confirmedDate !== undefined) updateData.confirmedDate = confirmedDate ? new Date(confirmedDate) : null;
    if (confirmedTime !== undefined) updateData.confirmedTime = confirmedTime;
    if (estimatedCompletion !== undefined) updateData.estimatedCompletion = estimatedCompletion ? new Date(estimatedCompletion) : null;
    if (actualCompletion !== undefined) updateData.actualCompletion = actualCompletion ? new Date(actualCompletion) : null;
    if (notes !== undefined) updateData.notes = notes;
    if (staffNotes !== undefined) updateData.staffNotes = staffNotes;

    const repair = await prisma.repair.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        vehicle: true,
      },
    });

    res.json({
      message: 'Repair updated successfully',
      repair,
    });
  } catch (error) {
    console.error('Update repair error:', error);
    res.status(500).json({ error: 'Failed to update repair' });
  }
});

/**
 * POST /api/repairs/:id/confirm
 * Confirm appointment and send SMS
 */
router.post('/:id/confirm', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { confirmedDate, confirmedTime } = req.body;

    if (!confirmedDate || !confirmedTime) {
      res.status(400).json({ error: 'confirmedDate and confirmedTime are required' });
      return;
    }

    const repair = await prisma.repair.update({
      where: { id },
      data: {
        status: 'confirmed',
        confirmedDate: new Date(confirmedDate),
        confirmedTime,
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    // Add to status history
    await prisma.statusHistory.create({
      data: {
        repairId: id,
        status: 'confirmed',
        changedBy: req.user?.id,
        note: `Appointment confirmed for ${confirmedTime}`,
      },
    });

    // Send SMS notification
    if (repair.customer?.phone) {
      await sendAppointmentConfirmation(
        repair.customer.phone,
        new Date(confirmedDate),
        confirmedTime,
        repair.trackingCode
      );
    }

    res.json({
      message: 'Appointment confirmed and SMS sent',
      repair,
    });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({ error: 'Failed to confirm appointment' });
  }
});

/**
 * POST /api/repairs/:id/status
 * Update repair status and send SMS notification
 */
router.post('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      res.status(400).json({ error: 'status is required' });
      return;
    }

    // Valid status transitions
    const validStatuses = [
      'pre_checkin',
      'confirmed',
      'accepted',
      'disassembly',
      'bodywork',
      'painting',
      'reassembly',
      'quality_check',
      'ready',
      'delivered',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const repair = await prisma.repair.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    // Add to status history
    await prisma.statusHistory.create({
      data: {
        repairId: id,
        status,
        changedBy: req.user?.id,
        note: note || null,
      },
    });

    // Send appropriate SMS notification
    if (repair.customer?.phone && repair.vehicle?.plate) {
      if (status === 'ready') {
        await sendReadyForPickup(repair.customer.phone, repair.vehicle.plate);
      } else if (status !== 'pre_checkin' && status !== 'confirmed') {
        await sendStatusUpdate(repair.customer.phone, status, repair.vehicle.plate);
      }
    }

    res.json({
      message: 'Status updated successfully',
      repair,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
