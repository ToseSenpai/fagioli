# Carrozzeria Fagioli MVP - Backend API

Complete Express.js backend for the Carrozzeria Fagioli body shop management system.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5
- **Database**: SQLite with Prisma ORM 7
- **Authentication**: JWT (jsonwebtoken)
- **File Uploads**: Multer
- **SMS Notifications**: Twilio (with mock mode)
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── dev.db                 # SQLite database file
├── src/
│   ├── index.ts               # Express server entry point
│   ├── seed.ts                # Database seeder
│   ├── lib/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Staff authentication
│   │   ├── checkin.ts         # Customer pre-check-in
│   │   ├── tracking.ts        # Public tracking (no auth)
│   │   └── repairs.ts         # Repair management (protected)
│   ├── services/
│   │   └── sms.ts             # Twilio SMS service
│   └── utils/
│       └── trackingCode.ts    # Tracking code generator
├── uploads/                   # Photo uploads directory
├── .env                       # Environment variables
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production

# Optional - SMS will use mock mode if not configured
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Migrations (if not already done)

```bash
npm run db:migrate
```

### 5. Seed Database

```bash
npm run db:seed
```

This creates:
- 1 admin user: `admin@fagioli.it` / `password123`
- 1 operator user: `operatore@fagioli.it` / `password123`
- 5 sample customers
- 5 sample vehicles
- 5 sample repairs in different statuses

### 6. Start Development Server

```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Public Endpoints (No Auth Required)

#### Health Check
```
GET /health
```

Returns server status.

#### Track Repair Status
```
GET /api/track/:code
```

Get repair status by 6-character tracking code (e.g., `ABC123`).

**Response:**
```json
{
  "repair": {
    "id": "uuid",
    "trackingCode": "ABC123",
    "status": "bodywork",
    "repairType": "sinistro",
    "customer": {
      "name": "Mario Rossi"
    },
    "vehicle": {
      "plate": "AB123CD",
      "brand": "Fiat",
      "model": "500",
      "year": 2020
    },
    "dates": {
      "preferredDate": "2025-12-18T00:00:00.000Z",
      "confirmedDate": "2025-12-18T00:00:00.000Z",
      "confirmedTime": "10:00",
      "estimatedCompletion": "2025-12-25T00:00:00.000Z"
    },
    "notes": "Customer notes",
    "photos": [...],
    "statusHistory": [...]
  }
}
```

#### Submit Pre-Check-In
```
POST /api/checkin
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerName": "Mario Rossi",
  "customerPhone": "+393331234567",
  "customerEmail": "mario@example.com",
  "vehiclePlate": "AB123CD",
  "vehicleBrand": "Fiat",
  "vehicleModel": "500",
  "vehicleYear": 2020,
  "repairType": "sinistro",
  "insuranceCompany": "Generali",
  "policyNumber": "POL123456",
  "preferredDate": "2025-12-20",
  "preferredTime": "10:00",
  "notes": "Damage description"
}
```

**Response:**
```json
{
  "message": "Pre-check-in submitted successfully",
  "repair": {
    "id": "uuid",
    "trackingCode": "ABC123",
    "status": "pre_checkin",
    "customer": { ... },
    "vehicle": { ... }
  }
}
```

#### Upload Photos
```
POST /api/checkin/:repairId/photos
Content-Type: multipart/form-data
```

**Form Data:**
- `photos`: File[] (up to 10 images, max 10MB each)
- `photoType_0`: string (front/rear/left/right/detail/cai)

**Response:**
```json
{
  "message": "Photos uploaded successfully",
  "photos": [
    {
      "id": "uuid",
      "photoType": "front",
      "url": "/uploads/filename.jpg"
    }
  ]
}
```

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json
```

**Request:**
```json
{
  "email": "admin@fagioli.it",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "admin@fagioli.it",
    "name": "Admin Fagioli",
    "role": "admin"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "admin@fagioli.it",
    "name": "Admin Fagioli",
    "role": "admin",
    "createdAt": "2025-12-17T..."
  }
}
```

### Protected Endpoints (Require Authentication)

All repair management endpoints require `Authorization: Bearer {token}` header.

#### List Repairs
```
GET /api/repairs
Query Parameters:
  - status: string (optional) - Filter by status
  - startDate: string (optional) - Filter by date range
  - endDate: string (optional) - Filter by date range
  - search: string (optional) - Search by code/plate/customer
```

**Response:**
```json
{
  "repairs": [
    {
      "id": "uuid",
      "trackingCode": "ABC123",
      "status": "bodywork",
      "repairType": "sinistro",
      "customer": { ... },
      "vehicle": { ... },
      "dates": { ... },
      "photoCount": 5,
      "thumbnail": "/uploads/...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

#### Get Repair Details
```
GET /api/repairs/:id
```

Returns full repair details including all photos and status history.

#### Update Repair
```
PATCH /api/repairs/:id
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "status": "bodywork",
  "confirmedDate": "2025-12-20",
  "confirmedTime": "10:00",
  "estimatedCompletion": "2025-12-27",
  "actualCompletion": null,
  "notes": "Customer notes",
  "staffNotes": "Internal notes"
}
```

#### Confirm Appointment
```
POST /api/repairs/:id/confirm
Content-Type: application/json
```

**Request:**
```json
{
  "confirmedDate": "2025-12-20",
  "confirmedTime": "10:00"
}
```

Updates status to "confirmed" and sends SMS confirmation to customer.

#### Update Status
```
POST /api/repairs/:id/status
Content-Type: application/json
```

**Request:**
```json
{
  "status": "bodywork",
  "note": "Starting bodywork repairs"
}
```

Updates repair status, adds to history, and sends SMS notification to customer.

## Status Workflow

1. **pre_checkin** - Customer submitted pre-check-in form
2. **confirmed** - Appointment confirmed by staff
3. **accepted** - Vehicle accepted, work started
4. **disassembly** - Disassembly in progress
5. **bodywork** - Bodywork repairs in progress
6. **painting** - Painting in progress
7. **reassembly** - Reassembly in progress
8. **quality_check** - Final quality check
9. **ready** - Ready for customer pickup
10. **delivered** - Vehicle delivered to customer

## Database Schema

### Main Tables

- **Customer**: Customer information (name, phone, email)
- **Vehicle**: Vehicle details (plate, brand, model, year)
- **Repair**: Core repair entity with status and dates
- **Photo**: Photos uploaded during pre-check-in
- **StatusHistory**: Audit trail of status changes
- **Staff**: Staff users for dashboard access

### Relationships

- Customer → Vehicles (1:many)
- Customer → Repairs (1:many)
- Vehicle → Repairs (1:many)
- Repair → Photos (1:many)
- Repair → StatusHistory (1:many)

## SMS Notifications

The system sends SMS notifications via Twilio for:

1. **Appointment Confirmation** - When staff confirms appointment
2. **Status Updates** - When repair moves through workflow stages
3. **Ready for Pickup** - When vehicle is ready

If Twilio credentials are not configured, the system operates in mock mode, printing SMS content to console.

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad request (validation error)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found
- **500** - Internal server error

Error responses:
```json
{
  "error": "Error message description"
}
```

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio (database GUI)
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client.

### Example: Login and List Repairs

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fagioli.it","password":"password123"}'

# Save the token and use it
TOKEN="your-jwt-token"

# List repairs
curl http://localhost:3001/api/repairs \
  -H "Authorization: Bearer $TOKEN"
```

### Example: Track Repair (Public)

```bash
# Use tracking codes from seed output
curl http://localhost:3001/api/track/B410VC
```

## Security Considerations

### Production Deployment

1. **Change JWT Secret**: Use a strong, random secret in production
2. **Enable HTTPS**: All API calls should use HTTPS
3. **Rate Limiting**: Add rate limiting middleware (express-rate-limit)
4. **CORS Configuration**: Restrict CORS to your production frontend domain
5. **Input Validation**: Consider adding validation library (joi, zod)
6. **SQL Injection**: Prisma handles this automatically
7. **File Upload Security**: Validate file types and sizes
8. **Environment Variables**: Never commit .env file

### Current Security Features

- JWT authentication with 7-day expiration
- Bcrypt password hashing (10 rounds)
- CORS enabled for specific origin
- File upload restrictions (type, size)
- SQL injection protection via Prisma

## Troubleshooting

### Database Issues

```bash
# Reset database
rm prisma/dev.db
npm run db:migrate
npm run db:seed
```

### Prisma Client Issues

```bash
# Regenerate client
npm run db:generate
```

### Port Already in Use

Change PORT in .env file or:
```bash
PORT=3002 npm run dev
```

## License

Proprietary - Carrozzeria Fagioli
