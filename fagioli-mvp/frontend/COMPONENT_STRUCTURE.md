# Customer Tracking - Component Structure

## Visual Hierarchy

```
TrackingPage (/track/:code)
│
├─ Loading State
│  └─ Spinner + "Caricamento dati..."
│
├─ Error State
│  └─ Alert + "Riparazione Non Trovata"
│     ├─ Error message
│     ├─ "Riprova" button
│     ├─ "Torna alla Home" button
│     └─ Tracking code display
│
└─ Success State → TrackingStatus
   │
   ├─ Header (blue bg, white text)
   │  ├─ "Carrozzeria Fagioli" title
   │  └─ "Tracking Riparazione" subtitle
   │
   └─ Main Content (gray bg, max-w-2xl, centered)
      │
      ├─ Tracking Code Card (white, shadow)
      │  ├─ "Codice Tracking" label
      │  └─ Large tracking code (e.g., "CF2024ABC")
      │
      ├─ Vehicle Info Card (white, shadow)
      │  ├─ Vehicle display (brand, model, plate)
      │  └─ Customer details
      │     ├─ Name
      │     ├─ Phone (clickable tel: link)
      │     └─ Email (clickable mailto: link)
      │
      ├─ Status Banners (conditional)
      │  │
      │  ├─ Ready Banner (green, if status === 'ready')
      │  │  ├─ CheckCircle icon
      │  │  ├─ "Pronta per il Ritiro!" title
      │  │  └─ Message
      │  │
      │  ├─ Delivered Banner (gray, if status === 'delivered')
      │  │  ├─ CheckCircle icon
      │  │  ├─ "Consegnata" title
      │  │  └─ Completion date
      │  │
      │  └─ Waiting Banner (yellow, if status === 'pre_checkin' | 'confirmed')
      │     ├─ "In Attesa di Accettazione" title
      │     └─ Message
      │
      ├─ Timeline Card (white, shadow, if not waiting)
      │  ├─ "Stato Riparazione" title
      │  └─ TrackingTimeline
      │     │
      │     └─ For each step:
      │        ├─ Icon (left)
      │        │  ├─ Completed: green circle + check icon
      │        │  ├─ Current: blue pulsing circle + dot
      │        │  └─ Future: gray outline circle
      │        │
      │        ├─ Connector Line (between steps)
      │        │  ├─ Green if step completed
      │        │  └─ Gray if step pending
      │        │
      │        └─ Content (right)
      │           ├─ Label (e.g., "Accettazione")
      │           ├─ Description
      │           ├─ Timestamp (if completed/current)
      │           └─ "In corso" badge (if current)
      │
      ├─ Estimated Completion Card (white, shadow, if applicable)
      │  ├─ Calendar icon
      │  ├─ "Completamento stimato" label
      │  └─ Date display
      │
      └─ Contact Card (white, shadow)
         ├─ "Hai domande?" title
         ├─ Contact button (blue, phone link)
         │  ├─ Phone icon
         │  └─ "Contattaci" text
         └─ Hours text ("Lun-Ven 8:00-18:00")
```

## State Diagram

```
┌──────────────┐
│ TrackingPage │
└──────┬───────┘
       │
       ├─ loading: true
       │  └─> Show spinner
       │
       ├─ error: string
       │  └─> Show error state
       │
       └─ repair: Repair
          └─> Show TrackingStatus
             │
             ├─ status: 'pre_checkin' | 'confirmed'
             │  └─> Show waiting banner, hide timeline
             │
             ├─ status: 'accepted' ... 'quality_check'
             │  └─> Show timeline with current step
             │
             ├─ status: 'ready'
             │  └─> Show ready banner + complete timeline
             │
             └─ status: 'delivered'
                └─> Show delivered banner + complete timeline
```

## Timeline Step States

```
Timeline Step Visualization:

┌─────────────────────────────────────┐
│ ✓  Accettazione              DONE  │  <- Completed
│ ○─ Veicolo ricevuto                │     (green check, green line)
│    10 Dic 2025 alle 09:00          │
├─────────────────────────────────────┤
│ ⚙  Smontaggio               NOW   │  <- Current
│ ○─ Rimozione parti danneggiate     │     (blue pulsing, blue badge)
│    [In corso]                       │
├─────────────────────────────────────┤
│ ○  Carrozzeria              FUTURE │  <- Future
│ ○─ Riparazione struttura           │     (gray outline, no date)
│                                     │
└─────────────────────────────────────┘
```

## Responsive Breakpoints

```
Mobile (< 640px):
┌────────────────┐
│  Full Width    │  <- Cards span full width
│  16px padding  │  <- Edge padding
│  Single column │
└────────────────┘

Tablet/Desktop (640px+):
┌──────────────────────────────┐
│    ┌──────────────┐         │
│    │  Max 768px   │         │  <- Centered with max-width
│    │  Cards       │         │
│    └──────────────┘         │
└──────────────────────────────┘
```

## Color Scheme

```css
/* Header */
background: primary-700 (#1d4ed8)
text: white

/* Body */
background: gray-50 (#f9fafb)

/* Cards */
background: white
border: gray-200
shadow: sm

/* Timeline States */
completed: success-500 (#22c55e)
current: primary-500 (#3b82f6)
future: gray-300 (#d1d5db)

/* Banners */
ready: success-50 bg, success-500 border
delivered: gray-100 bg, gray-300 border
waiting: warning-50 bg, warning-500 border
```

## Component Props Flow

```typescript
// TrackingPage
const { code } = useParams();
const [repair, setRepair] = useState<Repair | null>(null);

// Fetches from API
getRepairByTrackingCode(code)
  .then(data => setRepair(data));

// Passes to TrackingStatus
<TrackingStatus repair={repair} />

// TrackingStatus builds steps
const trackingSteps: TrackingStep[] = allSteps.map(step => ({
  key: step.key,
  label: step.label,
  description: step.description,
  completed: stepIndex < currentIndex,
  current: stepIndex === currentIndex,
  timestamp: historyItem?.changedAt,
}));

// Passes to TrackingTimeline
<TrackingTimeline steps={trackingSteps} />

// TrackingTimeline renders each step
{steps.map((step, index) => (
  <div key={step.key}>
    {/* Icon based on state */}
    {/* Content with label, description, timestamp */}
  </div>
))}
```

## Data Flow

```
API (/api/repairs/track/:code)
  │
  ├─> Repair object
  │   ├─ id, trackingCode, status
  │   ├─ vehicle { plate, brand, model }
  │   ├─ customer { name, phone, email }
  │   ├─ estimatedCompletion
  │   └─ statusHistory [ {status, changedAt} ]
  │
  └─> TrackingPage (fetch + state)
      │
      └─> TrackingStatus (process data)
          │
          ├─> Calculate current step index
          ├─> Build tracking steps array
          ├─> Determine banner to show
          │
          └─> TrackingTimeline (render timeline)
              │
              └─> Map each step to visual element
```

## File Dependencies

```
pages/TrackingPage.tsx
├─ import TrackingStatus from '../components/customer/TrackingStatus'
├─ import { getRepairByTrackingCode } from '../lib/api'
└─ import type { Repair } from '../types/repair'

components/customer/TrackingStatus.tsx
├─ import TrackingTimeline from './TrackingTimeline'
├─ import type { Repair, RepairStatus, TrackingStep } from '../../types/repair'
├─ import { format } from 'date-fns'
├─ import { it } from 'date-fns/locale'
└─ import { Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react'

components/customer/TrackingTimeline.tsx
├─ import { Check, Clock, Circle } from 'lucide-react'
├─ import { format } from 'date-fns'
├─ import { it } from 'date-fns/locale'
└─ import type { TrackingStep } from '../../types/repair'

lib/api.ts
└─ export async function getRepairByTrackingCode(code: string)

types/repair.ts
├─ export type RepairStatus = 'pre_checkin' | 'confirmed' | ...
├─ export interface Repair { ... }
├─ export interface Vehicle { ... }
├─ export interface Customer { ... }
├─ export interface StatusHistoryItem { ... }
└─ export interface TrackingStep { ... }
```

## CSS Classes Reference

### Layout
- `min-h-screen` - Full viewport height
- `bg-gray-50` - Light gray background
- `max-w-2xl` - Max width 672px
- `mx-auto` - Center horizontally
- `px-4` - Horizontal padding 16px
- `py-6` - Vertical padding 24px
- `space-y-4` - 16px gap between children

### Cards
- `bg-white` - White background
- `rounded-lg` - Large rounded corners (8px)
- `shadow-sm` - Small shadow
- `border border-gray-200` - 1px gray border
- `p-4` - 16px padding all sides
- `p-6` - 24px padding all sides

### Typography
- `text-2xl` - 24px font size
- `text-lg` - 18px font size
- `text-base` - 16px font size
- `text-sm` - 14px font size
- `text-xs` - 12px font size
- `font-bold` - 700 weight
- `font-semibold` - 600 weight
- `font-medium` - 500 weight

### Colors
- `text-primary-600` - Blue text
- `text-success-600` - Green text
- `text-gray-900` - Dark gray text
- `text-gray-600` - Medium gray text
- `text-gray-500` - Light gray text
- `bg-primary-700` - Dark blue bg
- `bg-success-50` - Light green bg
- `bg-warning-50` - Light yellow bg

### Interactive
- `hover:bg-primary-700` - Darker on hover
- `hover:text-primary-600` - Blue text on hover
- `transition-colors` - Smooth color transitions
- `cursor-pointer` - Pointer cursor

### Animations
- `animate-ping` - Pulsing ping animation
- `animate-pulse` - Fade pulse animation
- `opacity-75` - 75% opacity

## Accessibility Features

### Semantic HTML
```html
<header>        <!-- Page header -->
<main>          <!-- Main content -->
<h1>, <h2>, <h3> <!-- Heading hierarchy -->
<time datetime=""> <!-- Dates -->
<a href="tel:">  <!-- Phone links -->
<a href="mailto:"> <!-- Email links -->
```

### ARIA Attributes
```html
aria-hidden="true"  <!-- Decorative icons -->
aria-label="..."    <!-- Accessible labels -->
```

### Keyboard Navigation
- All buttons: `Tab` to focus, `Enter` to activate
- All links: `Tab` to focus, `Enter` to follow
- Focus visible states with browser defaults

### Screen Reader Announcements
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text
- Time elements with machine-readable datetime
- Status changes announced via text

## Performance Considerations

### Bundle Size
- TrackingStatus: ~8KB gzipped
- TrackingTimeline: ~3KB gzipped
- Total components: ~11KB

### Render Optimization
- Conditional rendering (timeline only when needed)
- Memoization-ready structure
- No unnecessary re-renders
- Efficient date formatting

### Network Optimization
- Auto-refresh with 30s interval
- Cleanup on unmount
- Error retry logic
- Type-safe API calls

### Loading Strategy
- Show spinner immediately
- Fetch data in background
- Update UI when ready
- Handle errors gracefully

This structure provides a clean, maintainable, and performant customer tracking experience.
