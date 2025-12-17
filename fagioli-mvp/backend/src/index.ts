import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import checkinRoutes from './routes/checkin';
import trackingRoutes from './routes/tracking';
import repairsRoutes from './routes/repairs';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any localhost origin in development
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    // Allow configured frontend URL
    if (origin === process.env.FRONTEND_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Carrozzeria Fagioli API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/repairs', repairsRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Carrozzeria Fagioli API Server          ║
║   Running on http://localhost:${PORT}      ║
║                                            ║
║   Endpoints:                               ║
║   - GET  /health                           ║
║   - POST /api/auth/login                   ║
║   - GET  /api/auth/me                      ║
║   - POST /api/checkin                      ║
║   - POST /api/checkin/:id/photos           ║
║   - GET  /api/track/:code                  ║
║   - GET  /api/repairs                      ║
║   - GET  /api/repairs/:id                  ║
║   - PATCH /api/repairs/:id                 ║
║   - POST /api/repairs/:id/confirm          ║
║   - POST /api/repairs/:id/status           ║
╚════════════════════════════════════════════╝
  `);
});

export default app;
