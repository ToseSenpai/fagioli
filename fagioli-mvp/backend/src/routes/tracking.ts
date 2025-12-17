import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { isValidTrackingCode } from '../utils/trackingCode';

const router = Router();

/**
 * GET /api/track/:code
 * Get repair status by tracking code (public, no auth required)
 */
router.get('/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    // Validate tracking code format
    if (!isValidTrackingCode(code.toUpperCase())) {
      res.status(400).json({ error: 'Invalid tracking code format' });
      return;
    }

    // Find repair by tracking code
    const repair = await prisma.repair.findUnique({
      where: { trackingCode: code.toUpperCase() },
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
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
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        statusHistory: {
          select: {
            id: true,
            status: true,
            note: true,
            changedAt: true,
          },
          orderBy: {
            changedAt: 'desc',
          },
        },
      },
    });

    if (!repair) {
      res.status(404).json({ error: 'Repair not found with this tracking code' });
      return;
    }

    // Format response (flat structure matching frontend expectations)
    res.json({
      repair: {
        id: repair.id,
        trackingCode: repair.trackingCode,
        status: repair.status,
        repairType: repair.repairType,
        customer: {
          name: repair.customer?.name,
          phone: repair.customer?.phone,
        },
        vehicle: {
          plate: repair.vehicle?.plate,
          brand: repair.vehicle?.brand,
          model: repair.vehicle?.model,
          year: repair.vehicle?.year,
        },
        preferredDate: repair.preferredDate,
        preferredTime: repair.preferredTime,
        confirmedDate: repair.confirmedDate,
        confirmedTime: repair.confirmedTime,
        estimatedCompletion: repair.estimatedCompletion,
        actualCompletion: repair.actualCompletion,
        notes: repair.notes,
        photos: repair.photos,
        statusHistory: repair.statusHistory,
        createdAt: repair.createdAt,
        updatedAt: repair.updatedAt,
      },
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Failed to fetch repair status' });
  }
});

export default router;
