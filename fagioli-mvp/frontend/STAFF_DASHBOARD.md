# Staff Dashboard Documentation

## Overview

The staff dashboard is a comprehensive internal tool for Carrozzeria Fagioli staff to manage repair workflows, track customer vehicles, and update repair statuses in real-time.

## Features

### Authentication
- **Login System**: Secure email/password authentication
- **Protected Routes**: All staff pages require authentication
- **Auto-redirect**: Logged-in users are automatically redirected to dashboard

### Dashboard Overview (`/staff`)
- **Key Metrics Cards**:
  - Total repairs today
  - Pre-check-ins pending confirmation
  - Ready for pickup count
  - Average days in shop

- **Kanban Pipeline View**:
  - Pre-Checkin: Pending confirmation
  - Bodywork: Carrozzeria work in progress
  - Painting: Verniciatura stage
  - Ready: Vehicles ready for customer pickup

- **Auto-refresh**: Updates every 30 seconds
- **Manual refresh**: Button to force immediate update

### Repairs Management (`/staff/repairs`)
- **Full Repairs List**: Table view of all repairs
- **Search**: By license plate or customer name
- **Filter**: By status
- **Sort**: By creation date (ascending/descending)
- **Pagination**: 20 repairs per page

### Repair Detail Modal
Clicking any repair card or table row opens a detailed modal with:

**Information Display**:
- Vehicle details (plate, brand, model, year)
- Customer contact info (name, phone, email)
- Repair description
- Photo gallery (if available)
- Status history timeline

**Actions**:
- Confirm appointment (for pre_checkin status)
- Update status via dropdown
- Set/update estimated completion date
- Add internal notes

## File Structure

```
frontend/src/
├── lib/
│   └── auth.ts                          # Auth utilities (token storage, headers)
├── hooks/
│   └── useAuth.ts                       # Auth hook (login, logout, user state)
├── components/staff/
│   ├── LoginForm.tsx                    # Login form with validation
│   ├── Sidebar.tsx                      # Navigation sidebar (collapsible on mobile)
│   ├── DashboardLayout.tsx              # Layout wrapper with sidebar
│   ├── ProtectedRoute.tsx               # Route guard for authentication
│   ├── StatsCards.tsx                   # Dashboard metrics cards
│   ├── RepairPipeline.tsx               # Kanban-style pipeline view
│   ├── RepairCard.tsx                   # Individual repair card
│   └── RepairDetail.tsx                 # Detailed repair modal
├── pages/staff/
│   ├── LoginPage.tsx                    # Login page wrapper
│   ├── DashboardPage.tsx                # Main dashboard with stats & pipeline
│   └── RepairsPage.tsx                  # Full repairs list with filters
└── types/
    └── repair.ts                        # TypeScript interfaces and types
```

## Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/staff/login` | `LoginPage` | Public | Staff authentication |
| `/staff` | `DashboardPage` | Protected | Dashboard overview |
| `/staff/repairs` | `RepairsPage` | Protected | Full repairs list |

## API Integration

The dashboard expects the following API endpoints (configured via `VITE_API_URL`):

### Authentication
- `POST /api/staff/login` - Login with email/password
  - Request: `{ email: string, password: string }`
  - Response: `{ token: string, user: User }`

### Repairs
- `GET /api/staff/repairs` - Get all repairs
  - Headers: `Authorization: Bearer <token>`
  - Response: `Repair[]`

- `PATCH /api/staff/repairs/:id/status` - Update repair status
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ status: RepairStatus }`

- `POST /api/staff/repairs/:id/confirm` - Confirm pre-checkin appointment
  - Headers: `Authorization: Bearer <token>`

- `PATCH /api/staff/repairs/:id/estimated-completion` - Set estimated completion
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ estimated_completion: string }`

- `POST /api/staff/repairs/:id/notes` - Add internal note
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ note: string }`

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## Running Locally

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support throughout
- **ARIA Labels**: Proper semantic HTML and ARIA attributes
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Descriptive labels and announcements
- **Color Contrast**: WCAG AA compliant color combinations

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive computations cached
- **Client-side Filtering**: Instant search/filter feedback
- **Optimistic UI**: Immediate feedback for user actions

## Responsive Design

- **Desktop-first**: Optimized for staff workstation use
- **Mobile Support**: Collapsible sidebar with hamburger menu
- **Tablet Compatible**: Adapts to various screen sizes
- **Touch-friendly**: Adequate touch targets for mobile devices

## Status Workflow

The repair workflow follows these statuses:

1. **pre_checkin** - Customer submitted repair request, awaiting confirmation
2. **confirmed** - Appointment confirmed by staff
3. **accepted** - Vehicle accepted into shop
4. **disassembly** - Vehicle disassembly in progress
5. **bodywork** - Carrozzeria/body work in progress
6. **painting** - Verniciatura/painting stage
7. **reassembly** - Reassembly in progress
8. **quality_check** - Final quality inspection
9. **ready** - Ready for customer pickup
10. **delivered** - Completed and delivered to customer
11. **cancelled** - Repair cancelled

## Future Enhancements

The following features are marked as "Coming Soon":
- Clienti (Customers management)
- Impostazioni (Settings)
- SMS notifications
- Drag-and-drop in pipeline
- Advanced reporting
- Invoice generation

## Troubleshooting

### Login Issues
- Verify API URL is correct in `.env`
- Check network tab for API errors
- Ensure backend is running and accessible

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check TypeScript errors: `npm run build`

### Authentication Persistence
- Auth token is stored in localStorage
- Clear localStorage to force re-login: `localStorage.clear()`

## Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Protected routes check authentication on mount
- API calls include Authorization header
- No sensitive data in client-side code
- HTTPS recommended for production deployment
