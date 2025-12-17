# Carrozzeria Fagioli Backend - Architecture Documentation

## Overview

The Carrozzeria Fagioli backend is a scalable Express.js REST API built with TypeScript, designed to handle body shop workflow management from customer pre-check-in through vehicle delivery.

**Total Lines of Code**: ~1,360 lines of TypeScript

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐     │
│  │  Customer  │  │   Staff    │  │  Public Tracking │     │
│  │  Web App   │  │ Dashboard  │  │     Page         │     │
│  └────────────┘  └────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js API Server                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     Middleware                       │  │
│  │  • CORS           • Body Parser    • Error Handler  │  │
│  │  • JWT Auth       • File Upload    • Request Logger │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Route Handlers                     │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │  Auth   │ │ Check-in │ │ Tracking │ │ Repairs │ │  │
│  │  │ Routes  │ │  Routes  │ │  Routes  │ │ Routes  │ │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └─────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Business Logic                      │  │
│  │  • Tracking Code Generation                          │  │
│  │  • Status Workflow Management                        │  │
│  │  • File Upload Processing                            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 External Services                    │  │
│  │  • SMS Service (Twilio) - Notifications             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data Layer (Prisma ORM)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • Query Builder                                     │  │
│  │  • Type Safety                                       │  │
│  │  • Connection Pooling                                │  │
│  │  • Migrations                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                          │
│  Tables: Customer, Vehicle, Repair, Photo,                 │
│          StatusHistory, Staff                              │
└─────────────────────────────────────────────────────────────┘
```

## Service Boundaries

### 1. Authentication Service (`/api/auth`)
**Responsibility**: Staff user authentication and session management

**Endpoints**:
- `POST /login` - Staff login with email/password
- `GET /me` - Get current authenticated user

**Dependencies**:
- Staff table
- JWT generation (jsonwebtoken)
- Password hashing (bcryptjs)

**Scalability**: Stateless JWT tokens allow horizontal scaling

### 2. Check-in Service (`/api/checkin`)
**Responsibility**: Customer pre-check-in and photo upload

**Endpoints**:
- `POST /` - Submit pre-check-in form
- `POST /:repairId/photos` - Upload photos

**Dependencies**:
- Customer, Vehicle, Repair, Photo tables
- File system for photo storage
- Tracking code generation

**Business Rules**:
- Creates customer if doesn't exist (phone lookup)
- Creates vehicle if doesn't exist (plate lookup)
- Generates unique 6-character tracking code
- Initializes repair in `pre_checkin` status

**Scalability Considerations**:
- File uploads should be moved to S3/CloudFront in production
- Consider async processing for large photo batches
- Add queue system for handling concurrent uploads

### 3. Tracking Service (`/api/track`)
**Responsibility**: Public repair status tracking

**Endpoints**:
- `GET /:code` - Get repair status by tracking code

**Dependencies**:
- Repair, Customer, Vehicle, Photo, StatusHistory tables

**Business Rules**:
- No authentication required (public endpoint)
- Returns limited customer data (name only, no sensitive info)
- Includes full status history for transparency

**Scalability Considerations**:
- High read volume expected - excellent caching candidate
- Consider Redis cache with 5-minute TTL
- Add rate limiting per IP (100 requests/minute)

### 4. Repair Management Service (`/api/repairs`)
**Responsibility**: Staff repair workflow management

**Endpoints**:
- `GET /` - List repairs with filtering
- `GET /:id` - Get repair details
- `PATCH /:id` - Update repair
- `POST /:id/confirm` - Confirm appointment
- `POST /:id/status` - Update status

**Dependencies**:
- All tables
- SMS service for notifications
- JWT authentication

**Business Rules**:
- Status workflow enforcement
- SMS notifications on status changes
- Audit trail via StatusHistory
- Date validation

**Scalability Considerations**:
- Pagination needed for large datasets
- Consider separating read/write models (CQRS)
- Background jobs for SMS sending
- Add search indexing for fast filtering

## Data Model

### Entity Relationships

```
Customer (1) ──────< (N) Vehicle
    │                      │
    │                      │
    │                      │
    └──────< (N) Repair <──┘
                  │
                  │
                  ├──────< (N) Photo
                  │
                  └──────< (N) StatusHistory

Staff (manages Repairs)
```

### Key Design Decisions

1. **Soft Relationships**: Vehicle-Customer relationship is optional (allows anonymous check-ins)

2. **Tracking Code**: Separate from primary key for security and usability
   - 6 characters: alphanumeric
   - ~2.1 billion combinations
   - Uniqueness enforced at database level

3. **Status History**: Immutable audit log
   - Never update, only append
   - Captures who made change and when
   - Supports compliance and customer transparency

4. **Photo Storage**:
   - File system for MVP
   - Metadata in database with URLs
   - Easy migration to object storage later

## Authentication & Security

### JWT Token Structure
```json
{
  "id": "staff-uuid",
  "email": "staff@email.com",
  "name": "Staff Name",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Security Layers

1. **Authentication Middleware** (`authenticateToken`)
   - Validates JWT signature
   - Checks expiration
   - Attaches user to request

2. **Password Security**
   - Bcrypt hashing with 10 rounds
   - No plain text passwords stored
   - Salting handled automatically

3. **File Upload Security**
   - Type validation (images only)
   - Size limits (10MB per file)
   - UUID filenames prevent directory traversal

4. **SQL Injection Protection**
   - Prisma ORM with parameterized queries
   - No raw SQL queries

### Missing Security (TODO for Production)

- Rate limiting
- Request validation (input sanitization)
- CSRF protection
- API key rotation
- Account lockout after failed attempts
- 2FA for admin accounts
- Audit logging
- PII encryption at rest

## API Design Patterns

### 1. Contract-First Design
All endpoints return consistent JSON structure:

**Success Response**:
```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "error": "Human-readable error message"
}
```

### 2. RESTful Resource Naming
- Plural nouns for collections: `/repairs`
- Resource ID in path: `/repairs/:id`
- Actions as sub-resources: `/repairs/:id/confirm`

### 3. HTTP Status Codes
- `200` - Success (read/update)
- `201` - Created (new resource)
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing auth)
- `403` - Forbidden (insufficient permission)
- `404` - Not found
- `500` - Internal server error

### 4. Filtering & Pagination
Query parameters for filtering:
```
GET /api/repairs?status=bodywork&startDate=2025-12-01&search=AB123
```

**TODO**: Add pagination
```
GET /api/repairs?page=2&limit=20
```

## Performance Considerations

### Current Bottlenecks

1. **Photo Uploads**
   - Synchronous file writes
   - No compression
   - Solution: Background jobs + image optimization

2. **List Repairs Query**
   - Fetches all related data eagerly
   - No pagination
   - Solution: Add cursor-based pagination

3. **SMS Sending**
   - Blocking API calls
   - Solution: Queue system (Bull/BullMQ)

4. **Tracking Lookup**
   - Database hit on every request
   - Solution: Redis cache with TTL

### Caching Strategy (Future)

```
┌──────────────┐
│   Request    │
└──────┬───────┘
       │
       ▼
┌──────────────┐     Cache Hit    ┌────────────┐
│    Redis     │ ────────────────>│  Response  │
│    Cache     │                  └────────────┘
└──────┬───────┘
       │ Cache Miss
       ▼
┌──────────────┐     Update     ┌──────────────┐
│   Database   │ <───────────── │    Redis     │
└──────┬───────┘                └──────────────┘
       │
       ▼
┌──────────────┐
│   Response   │
└──────────────┘
```

**Cache Keys**:
- `repair:code:{TRACKING_CODE}` - TTL: 5 minutes
- `repair:list:{filters}` - TTL: 1 minute
- `repair:detail:{ID}` - TTL: 5 minutes

**Cache Invalidation**:
- On repair update: invalidate specific repair keys
- On status change: invalidate list keys

## Scaling Strategy

### Phase 1 (Current - MVP)
- Single server deployment
- SQLite database
- File system storage
- Synchronous processing

**Capacity**: ~100 concurrent users, ~1000 repairs/month

### Phase 2 (Growth - 6 months)
- Horizontal scaling with load balancer
- PostgreSQL database (migrating from SQLite)
- S3 for file storage
- Redis for caching
- Background job queue

**Capacity**: ~1000 concurrent users, ~10,000 repairs/month

```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
       ├──> [API Server 1]
       ├──> [API Server 2]
       └──> [API Server N]
            │
            ├──> [PostgreSQL]
            ├──> [Redis Cache]
            ├──> [S3 Storage]
            └──> [Job Queue]
```

### Phase 3 (Scale - 1 year)
- Microservices architecture
- Event-driven communication
- Dedicated services:
  - Auth Service
  - Repair Service
  - Notification Service
  - File Service
- API Gateway
- Message broker (RabbitMQ/Kafka)

**Capacity**: ~10,000 concurrent users, ~100,000 repairs/month

## Technology Recommendations

### Database Migration Path

**Current**: SQLite
- ✅ Zero configuration
- ✅ Perfect for MVP
- ❌ No horizontal scaling
- ❌ Limited concurrent writes

**Next**: PostgreSQL
- ✅ ACID compliance
- ✅ Excellent Prisma support
- ✅ Rich extension ecosystem
- ✅ Read replicas for scaling

**Migration**: Prisma makes this trivial - just update datasource URL

### File Storage Migration

**Current**: Local file system
- ✅ Simple implementation
- ✅ No external dependencies
- ❌ Not scalable
- ❌ No CDN

**Next**: AWS S3 + CloudFront
- ✅ Unlimited storage
- ✅ Global CDN
- ✅ Automatic backups
- ✅ Pay per use

### Caching Layer

**Recommended**: Redis
- Fast in-memory storage
- Supports TTL
- Pub/sub for cache invalidation
- Easy clustering

### Background Jobs

**Recommended**: BullMQ
- Redis-based queue
- Job prioritization
- Retry logic
- Progress tracking
- Excellent TypeScript support

### Monitoring

**Recommended Stack**:
- **APM**: New Relic or DataDog
- **Logging**: Winston + ELK Stack
- **Metrics**: Prometheus + Grafana
- **Alerts**: PagerDuty

## Deployment Architecture

### Development
```
Local Machine
├── npm run dev (nodemon)
├── SQLite (./prisma/dev.db)
└── File uploads (./uploads)
```

### Production (Recommended)

```
┌─────────────────────────────────────────┐
│              AWS/Azure/GCP              │
│  ┌────────────────────────────────┐    │
│  │  Application Load Balancer     │    │
│  └────────────┬───────────────────┘    │
│               │                         │
│  ┌────────────┴───────────────────┐    │
│  │   ECS/Kubernetes Cluster       │    │
│  │  ┌──────────┐  ┌──────────┐   │    │
│  │  │ Container│  │ Container│   │    │
│  │  │  Node 1  │  │  Node 2  │   │    │
│  │  └──────────┘  └──────────┘   │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────┐  ┌────────────┐       │
│  │ PostgreSQL │  │   Redis    │       │
│  │    RDS     │  │ ElastiCache│       │
│  └────────────┘  └────────────┘       │
│                                         │
│  ┌────────────┐  ┌────────────┐       │
│  │     S3     │  │ CloudWatch │       │
│  │   Bucket   │  │   Logs     │       │
│  └────────────┘  └────────────┘       │
└─────────────────────────────────────────┘
```

### Environment Variables

**Required**:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret for token signing
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

**Optional**:
- `FRONTEND_URL` - CORS origin
- `TWILIO_*` - SMS credentials
- `REDIS_URL` - Cache connection
- `S3_BUCKET` - File storage
- `LOG_LEVEL` - Logging verbosity

## Testing Strategy (TODO)

### Unit Tests
- Service functions
- Utility functions (tracking code generator)
- Middleware (authentication)

### Integration Tests
- API endpoints
- Database operations
- SMS service mocking

### E2E Tests
- Complete user workflows
- Pre-check-in to delivery

**Recommended Tools**:
- **Test Framework**: Jest
- **API Testing**: Supertest
- **Mocking**: Sinon
- **Coverage**: Istanbul

## Code Quality

### Current Practices
- ✅ TypeScript strict mode
- ✅ ESLint configuration (basic)
- ✅ Consistent error handling
- ✅ Modular structure

### Recommended Additions
- Pre-commit hooks (Husky)
- Code formatting (Prettier)
- Import organization (ESLint plugin)
- Dependency auditing (npm audit)
- Automated testing (CI/CD)

## Maintenance & Operations

### Backup Strategy

**Database**:
- Daily full backups
- Point-in-time recovery
- Backup retention: 30 days

**Files**:
- S3 versioning enabled
- Cross-region replication

### Monitoring Checklist

- [ ] API response times
- [ ] Error rates by endpoint
- [ ] Database query performance
- [ ] SMS delivery success rate
- [ ] File upload success rate
- [ ] Disk space usage
- [ ] Memory usage
- [ ] CPU usage
- [ ] Active connections

### Logging Strategy

**Log Levels**:
- ERROR: All errors with stack traces
- WARN: Validation failures, retry attempts
- INFO: Status changes, SMS sent, logins
- DEBUG: Query details, request/response

**Log Aggregation**: Send to centralized logging service

## Future Enhancements

### Priority 1 (Next 3 months)
- Add pagination to repair list
- Implement Redis caching
- Add rate limiting
- Migrate to PostgreSQL
- Add background job queue for SMS

### Priority 2 (Next 6 months)
- Move file storage to S3
- Add comprehensive test suite
- Implement WebSocket for real-time updates
- Add email notifications
- Customer portal with authentication

### Priority 3 (Next 12 months)
- Microservices architecture
- GraphQL API alongside REST
- Mobile app API optimization
- Analytics and reporting engine
- Multi-tenant support

## Conclusion

The current architecture provides a solid foundation for the MVP with clear paths for scaling. The modular design and use of industry-standard tools (Express, Prisma, TypeScript) ensure maintainability and developer productivity.

**Key Strengths**:
- Clean separation of concerns
- Type-safe database access
- Stateless authentication (scalable)
- Clear API contracts

**Key Limitations**:
- No caching layer
- Synchronous processing
- Single point of failure (SQLite)
- No pagination

**Immediate Next Steps**:
1. Add comprehensive error handling
2. Implement rate limiting
3. Add request validation
4. Set up CI/CD pipeline
5. Configure production environment
