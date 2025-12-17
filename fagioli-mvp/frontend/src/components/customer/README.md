# Customer Tracking Components

React components for customer-facing repair tracking interface.

## Components

### TrackingStatus

Main component showing complete repair tracking view.

**Location:** `TrackingStatus.tsx`

**Props:**
```tsx
interface TrackingStatusProps {
  repair: Repair;
}
```

**Features:**
- Vehicle info header (brand, model, plate)
- Customer details (name, phone, email with clickable links)
- Visual timeline (via TrackingTimeline)
- Status banners (ready/delivered/waiting)
- Estimated completion date
- Contact button (phone link)
- Mobile-first responsive design
- Carrozzeria Fagioli branding

**Usage:**
```tsx
import TrackingStatus from '@/components/customer/TrackingStatus';

<TrackingStatus repair={repairData} />
```

### TrackingTimeline

Visual timeline showing repair progress steps.

**Location:** `TrackingTimeline.tsx`

**Props:**
```tsx
interface TrackingTimelineProps {
  steps: TrackingStep[];
}

interface TrackingStep {
  key: RepairStatus;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  timestamp?: string;
}
```

**Features:**
- Vertical timeline with connecting line
- Three states per step:
  - Completed: Green check icon, filled circle
  - Current: Blue pulsing icon, "In corso" badge
  - Future: Gray outline, no icon
- Timestamps for completed steps
- Smooth animations
- Accessible markup

**Usage:**
```tsx
import TrackingTimeline from '@/components/customer/TrackingTimeline';

const steps: TrackingStep[] = [
  {
    key: 'accepted',
    label: 'Accettazione',
    description: 'Veicolo ricevuto',
    completed: true,
    current: false,
    timestamp: '2025-12-10T09:00:00Z'
  },
  // ... more steps
];

<TrackingTimeline steps={steps} />
```

## Repair Status Flow

```
pre_checkin → confirmed → accepted → disassembly → bodywork →
painting → reassembly → quality_check → ready → delivered
```

### Status Mapping

| Status | Display | Timeline Step |
|--------|---------|--------------|
| `pre_checkin` | "In attesa di accettazione" | Not shown |
| `confirmed` | "In attesa di accettazione" | Not shown |
| `accepted` | Accettazione complete | ✓ |
| `disassembly` | Smontaggio in progress | ⚙ |
| `bodywork` | Carrozzeria in progress | ⚙ |
| `painting` | Verniciatura in progress | ⚙ |
| `reassembly` | Rimontaggio in progress | ⚙ |
| `quality_check` | Controllo in progress | ⚙ |
| `ready` | "Pronta per Ritiro!" banner | ✓ All |
| `delivered` | "Consegnata" with date | ✓ All |

## Styling

### Tailwind Classes

**Primary colors:**
- `primary-*` - Blue brand colors (500, 600, 700)
- `success-*` - Green for completed (500, 600)
- `warning-*` - Amber for waiting states

**Layout:**
- Mobile-first (default)
- Max-width: 768px (2xl breakpoint)
- Card-based with shadows
- 4-space padding on mobile

### Animations

**Pulsing current step:**
```css
animate-ping opacity-75
```

**Current step badge pulse:**
```css
animate-pulse
```

## Accessibility

### WCAG Compliance

- ✓ Semantic HTML (`<header>`, `<main>`, `<article>`)
- ✓ Proper heading hierarchy (`h1`, `h2`, `h3`)
- ✓ ARIA labels on decorative icons
- ✓ Color contrast ratios meet AA standard
- ✓ Keyboard navigation (all interactive elements)
- ✓ Time elements with datetime attributes
- ✓ Phone/email links for screen readers

### Keyboard Navigation

All interactive elements are keyboard accessible:
- Contact button: `Tab` to focus, `Enter` to activate
- Phone link: `Tab` to focus, `Enter` to call
- Email link: `Tab` to focus, `Enter` to compose

## Performance

### Optimizations

- Conditional rendering (timeline only when needed)
- Memoization-ready component structure
- No unnecessary re-renders
- Efficient date formatting (date-fns)

### Bundle Size

- TrackingStatus: ~8KB (gzipped)
- TrackingTimeline: ~3KB (gzipped)
- Dependencies: lucide-react, date-fns

### Performance Budget

- Initial load: < 3s (3G)
- Time to Interactive: < 5s
- First Contentful Paint: < 2s

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

## Testing

### Unit Tests

```tsx
// Example test structure
import { render, screen } from '@testing-library/react';
import TrackingStatus from './TrackingStatus';

test('displays vehicle info', () => {
  const mockRepair = { /* ... */ };
  render(<TrackingStatus repair={mockRepair} />);
  expect(screen.getByText('AB123CD')).toBeInTheDocument();
});
```

### E2E Tests

```tsx
// Cypress example
describe('Tracking Page', () => {
  it('shows tracking timeline for active repair', () => {
    cy.visit('/track/CF2024ABC');
    cy.contains('Carrozzeria Fagioli');
    cy.get('[data-testid="timeline"]').should('be.visible');
  });
});
```

## File Structure

```
src/components/customer/
├── TrackingStatus.tsx       # Main tracking component
├── TrackingTimeline.tsx     # Timeline visualization
├── index.ts                 # Barrel exports
└── README.md               # This file
```

## Related Files

- `src/pages/TrackingPage.tsx` - Page wrapper with data fetching
- `src/pages/TrackingDemoPage.tsx` - Demo/testing page
- `src/types/repair.ts` - TypeScript interfaces
- `src/lib/api.ts` - API functions

## Examples

### Complete Example

```tsx
import { useState, useEffect } from 'react';
import { TrackingStatus } from '@/components/customer';
import { getRepairByTrackingCode } from '@/lib/api';
import type { Repair } from '@/types/repair';

export default function MyTrackingPage() {
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRepairByTrackingCode('CF2024ABC')
      .then(data => {
        setRepair(data as Repair);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!repair) return <div>Not found</div>;

  return <TrackingStatus repair={repair} />;
}
```

### Demo Mode Example

Visit `/demo/tracking` to see all status states interactively.

## Support

For issues or questions:
- Check `TRACKING_COMPONENTS.md` in frontend root
- Review Tailwind config for color customization
- Test with demo page first
