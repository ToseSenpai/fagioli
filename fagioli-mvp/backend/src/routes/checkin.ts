import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/prisma';
import { generateTrackingCode } from '../utils/trackingCode';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|heic|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/checkin
 * Create pre-check-in submission (customer, vehicle, repair)
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      vehiclePlate,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      repairType,
      insuranceCompany,
      policyNumber,
      preferredDate,
      preferredTime,
      notes,
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !vehiclePlate || !repairType) {
      res.status(400).json({
        error: 'Missing required fields: customerName, customerPhone, vehiclePlate, repairType',
      });
      return;
    }

    // Generate unique tracking code
    let trackingCode: string;
    let isUnique = false;

    while (!isUnique) {
      trackingCode = generateTrackingCode();
      const existing = await prisma.repair.findUnique({
        where: { trackingCode },
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || null,
        },
      });
    }

    // Create or find vehicle
    let vehicle = await prisma.vehicle.findUnique({
      where: { plate: vehiclePlate.toUpperCase() },
    });

    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: {
          plate: vehiclePlate.toUpperCase(),
          brand: vehicleBrand || null,
          model: vehicleModel || null,
          year: vehicleYear ? parseInt(vehicleYear) : null,
          customerId: customer.id,
        },
      });
    }

    // Create repair
    const repair = await prisma.repair.create({
      data: {
        trackingCode: trackingCode!,
        customerId: customer.id,
        vehicleId: vehicle.id,
        repairType,
        insuranceCompany: insuranceCompany || null,
        policyNumber: policyNumber || null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime: preferredTime || null,
        notes: notes || null,
        status: 'pre_checkin',
      },
      include: {
        customer: true,
        vehicle: true,
      },
    });

    // Create initial status history entry
    await prisma.statusHistory.create({
      data: {
        repairId: repair.id,
        status: 'pre_checkin',
        note: 'Pre-check-in form submitted',
      },
    });

    res.status(201).json({
      message: 'Pre-check-in submitted successfully',
      repair: {
        id: repair.id,
        trackingCode: repair.trackingCode,
        status: repair.status,
        customer: {
          name: repair.customer?.name || '',
          phone: repair.customer?.phone || '',
        },
        vehicle: {
          plate: repair.vehicle?.plate || '',
          brand: repair.vehicle?.brand || null,
          model: repair.vehicle?.model || null,
        },
      },
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

/**
 * POST /api/checkin/:repairId/photos
 * Upload photos for a repair
 */
router.post(
  '/:repairId/photos',
  upload.array('photos', 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { repairId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: 'No photos uploaded' });
        return;
      }

      // Verify repair exists
      const repair = await prisma.repair.findUnique({
        where: { id: repairId },
      });

      if (!repair) {
        res.status(404).json({ error: 'Repair not found' });
        return;
      }

      // Create photo records
      const photos = await Promise.all(
        files.map((file, index) => {
          const photoType = req.body[`photoType_${index}`] || 'detail';
          const url = `/uploads/${file.filename}`;

          return prisma.photo.create({
            data: {
              repairId,
              photoType,
              filename: file.filename,
              url,
            },
          });
        })
      );

      res.status(201).json({
        message: 'Photos uploaded successfully',
        photos: photos.map((photo) => ({
          id: photo.id,
          photoType: photo.photoType,
          url: photo.url,
        })),
      });
    } catch (error) {
      console.error('Photo upload error:', error);
      res.status(500).json({ error: 'Failed to upload photos' });
    }
  }
);

export default router;
