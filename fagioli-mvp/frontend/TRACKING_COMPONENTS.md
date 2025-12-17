# Customer Tracking Components

Amazon-style package tracking interface for Carrozzeria Fagioli repairs. Mobile-first responsive design showing repair progress with visual timeline.

## Files Created

### Components

1. **`src/components/customer/TrackingTimeline.tsx`**
   - Visual timeline with status steps
   - Vertical layout with connecting line
   - Completed: green check icon
   - Current: blue pulsing icon
   - Future: gray outline icon
   - Shows timestamps for completed steps

2. **`src/components/customer/TrackingStatus.tsx`**
   - Main tracking component
   - Vehicle info header
   - Customer details (name, phone, email)
   - Visual timeline integration
   - Status banners (ready, delivered, waiting)
   - Estimated completion date
   - Contact button

### Pages

3. **`src/pages/TrackingPage.tsx`**
   - Route: `/track/:code`
   - Fetches repair by tracking code
   - Loading spinner
   - Error handling (404, network errors)
   - Auto-refresh every 30 seconds
   - Renders TrackingStatus component

4. **`src/pages/TrackingDemoPage.tsx`**
   - Route: `/demo/tracking`
   - Development/testing page
   - Dropdown to simulate different statuses
   - Mock data generator
   - Useful for UI development

### Types

5. **`src/types/repair.ts`**
   - TypeScript interfaces for repair tracking
   - `Repair`, `Vehicle`, `Customer`, `StatusHistoryItem`
   - `RepairStatus` type (all possible statuses)
   - `TrackingStep` interface for timeline

### API

6. **`src/lib/api.ts`** (updated)
   - Added `getRepairByTrackingCode()` function
   - Calls `/api/repairs/track/:code` endpoint
   - Error handling with ApiError class

## Status Flow

Repairs progress through these statuses:

1. **pre_checkin** - Customer submitted request, not yet accepted
2. **confirmed** - Appointment confirmed, waiting for acceptance
3. **accepted** - Vehicle accepted, repair started ✅
4. **disassembly** - Removing damaged parts 🔧
5. **bodywork** - Repairing body structure 🛠️
6. **painting** - Preparation and painting 🎨
7. **reassembly** - Installing parts and components 🔩
8. **quality_check** - Final verification and checks ✔️
9. **ready** - Ready for customer pickup 🎉
10. **delivered** - Vehicle delivered to customer ✅

### Status Display Logic

- **pre_checkin / confirmed**: Shows "In attesa di accettazione" banner
- **accepted through quality_check**: Shows visual timeline with progress
- **ready**: Shows green "Pronta per il Ritiro!" banner
- **delivered**: Shows gray "Consegnata" banner with completion date

## Component Props

### TrackingStatus

```tsx
interface TrackingStatusProps {
  repair: Repair;
}
```

### TrackingTimeline

```tsx
interface TrackingTimelineProps {
  steps: TrackingStep[];
}
```

## Usage Examples

### Basic Usage (Production)

Navigate to tracking URL:
```
https://yoursite.com/track/CF2024ABC
```

### Demo Mode (Development)

Navigate to demo page:
```
http://localhost:5173/demo/tracking
```

Use dropdown to test different statuses.

### Programmatic Usage

```tsx
import { TrackingStatus } from '@/components/customer';
import type { Repair } from '@/types/repair';

function MyComponent() {
  const [repair, setRepair] = useState<Repair | null>(null);

  useEffect(() => {
    // Fetch repair data
    getRepairByTrackingCode('CF2024ABC')
      .then(data => setRepair(data as Repair));
  }, []);

  if (!repair) return <div>Loading...</div>;

  return <TrackingStatus repair={repair} />;
}
```

## Design Features

### Mobile-First
- Optimized for smartphone screens
- Touch-friendly buttons
- Large, readable text
- Single column layout

### Responsive
- Max-width container (768px) on larger screens
- Centered content on desktop
- Cards with shadow and borders

### Branding
- Carrozzeria Fagioli blue primary color
- Green for success/completion
- Professional card-based layout
- Consistent spacing and typography

### Accessibility
- Semantic HTML structure
- ARIA labels on icons
- Proper heading hierarchy
- Color contrast compliance
- Keyboard navigation support
- Time elements with datetime attributes

### Performance
- Lazy component loading ready
- Memoization potential for timeline steps
- Auto-refresh with cleanup
- Efficient re-renders

## Customization

### Colors

Tailwind config defines brand colors:
- `primary-*` - Blue (Fagioli brand)
- `success-*` - Green (completed states)
- `warning-*` - Amber (waiting states)

### Contact Info

Update phone number in TrackingStatus.tsx:
```tsx
<a href="tel:+390123456789">
```

### Timeline Steps

Modify steps in TrackingStatus.tsx `allSteps` array:
```tsx
const allSteps = [
  { key: 'accepted', label: 'Accettazione', description: '...' },
  // Add/remove/reorder steps
];
```

### Auto-Refresh Interval

Change refresh rate in TrackingPage.tsx:
```tsx
const interval = setInterval(fetchRepair, 30000); // 30 seconds
```

## API Requirements

Backend must provide endpoint:

```
GET /api/repairs/track/:code
```

Response schema:
```json
{
  "id": "uuid",
  "trackingCode": "CF2024ABC",
  "status": "bodywork",
  "repairType": "sinistro",
  "estimatedCompletion": "2025-12-25T18:00:00Z",
  "actualCompletion": null,
  "notes": "...",
  "vehicle": {
    "id": "uuid",
    "plate": "AB123CD",
    "brand": "Fiat",
    "model": "500",
    "year": 2020
  },
  "customer": {
    "id": "uuid",
    "name": "Mario Rossi",
    "phone": "+39 333 1234567",
    "email": "mario.rossi@example.com"
  },
  "statusHistory": [
    {
      "id": "uuid",
      "status": "accepted",
      "changedAt": "2025-12-10T09:00:00Z"
    }
  ],
  "createdAt": "2025-12-10T08:00:00Z",
  "updatedAt": "2025-12-15T14:30:00Z"
}
```

## Testing Checklist

- [ ] All status states render correctly
- [ ] Timeline shows proper progression
- [ ] Timestamps formatted correctly (Italian locale)
- [ ] Loading spinner appears during fetch
- [ ] Error states display properly
- [ ] 404 handling works
- [ ] Auto-refresh updates data
- [ ] Contact button links to phone
- [ ] Vehicle info displays correctly
- [ ] Customer info displays correctly
- [ ] Responsive on mobile (320px-480px)
- [ ] Responsive on tablet (768px-1024px)
- [ ] Responsive on desktop (1280px+)
- [ ] Pulsing animation on current step
- [ ] Ready banner shows for 'ready' status
- [ ] Delivered banner shows completion date
- [ ] Waiting banner shows for pre-acceptance

## Performance Optimizations

### Implemented
- Auto-refresh with cleanup (prevent memory leaks)
- Error boundaries ready
- Conditional rendering (no unnecessary timeline)
- Type-safe API calls

### Potential Enhancements
- React Query for caching and background updates
- Memoize timeline step calculations
- Virtual scrolling for long status histories
- Service worker for offline support
- Push notifications for status changes
- Skeleton loaders instead of spinner

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Mobile 90+

## Dependencies

- react 19+
- react-router-dom 7+
- lucide-react 0.56+
- date-fns 4+
- tailwindcss 4+

## Future Enhancements

- [ ] Push notifications on status change
- [ ] SMS alerts integration
- [ ] Photo gallery of repair progress
- [ ] Chat support widget
- [ ] Estimated time remaining indicator
- [ ] Share tracking link button
- [ ] Print-friendly view
- [ ] QR code for easy sharing
- [ ] Multi-language support
- [ ] Dark mode toggle

## File Paths Reference

All file paths mentioned are absolute:

- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\components\customer\TrackingTimeline.tsx`
- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\components\customer\TrackingStatus.tsx`
- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\pages\TrackingPage.tsx`
- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\pages\TrackingDemoPage.tsx`
- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\types\repair.ts`
- `C:\Users\itose\fagioli\fagioli-mvp\frontend\src\lib\api.ts`
