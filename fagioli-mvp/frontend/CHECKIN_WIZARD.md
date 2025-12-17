# Customer Pre-Check-in Wizard - Implementation Guide

## Overview
A mobile-first PWA wizard for customer vehicle pre-check-in at Carrozzeria Fagioli. Built with React, TypeScript, Vite, and TailwindCSS.

## Files Created

### 1. Type Definitions
**File:** `src/types/index.ts`
- Customer, Vehicle, Repair, Photo interfaces
- CheckinFormData, CheckinResponse, TrackingStatus types
- RepairType: 'sinistro' | 'estetica' | 'meccanica'
- RepairStatus: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'completed' | 'cancelled'

### 2. API Client
**File:** `src/lib/api.ts`
- Base URL configuration from env or /api
- `submitCheckin()` - Submit check-in form data
- `uploadPhotos()` - Upload vehicle photos
- `getTrackingStatus()` - Get repair tracking status
- Mock implementations for development (submitCheckinMock, uploadPhotosMock, getTrackingStatusMock)

### 3. UI Components

#### Button Component
**File:** `src/components/ui/Button.tsx`
- Variants: primary, secondary, outline, ghost
- Sizes: sm (36px), md (44px), lg (52px)
- Loading state with spinner
- Full-width option
- Accessible with focus rings and ARIA attributes

#### Input Component
**File:** `src/components/ui/Input.tsx`
- Label support with required indicator
- Error state with validation messages
- Helper text support
- Min-height 44px for touch targets
- Accessible with proper ARIA attributes

#### Card Component
**File:** `src/components/ui/Card.tsx`
- Variants: default (shadow), bordered, elevated
- Padding options: none, sm, md, lg
- CardHeader, CardTitle, CardContent sub-components

### 4. Main Wizard Component
**File:** `src/components/customer/CheckinWizard.tsx`

#### Features:
- 9-step progressive disclosure wizard
- Mobile-first responsive design (max-w-md on desktop)
- Progress bar showing current step
- Form validation with inline errors
- Photo upload with preview and removal
- Conditional steps (insurance only for 'sinistro')

#### Wizard Steps:
1. **Welcome** - Introduction with start button
2. **Vehicle Info** - License plate (required), brand, model (optional)
3. **Repair Type Selection** - Sinistro, Estetica, Meccanica
4. **Insurance Info** - Company, policy number (only if sinistro)
5. **Photo Upload** - Minimum 1 photo required, multiple uploads supported
6. **Customer Info** - Name, phone (required), email (optional)
7. **Preferred DateTime** - Date picker and time slot selection
8. **Review** - Summary of all entered data
9. **Confirmation** - Success message with tracking code

#### Validation Rules:
- License plate: Required, format AB123CD
- Repair type: Required
- Insurance: Required fields if type is 'sinistro'
- Photos: At least 1 required
- Customer name: Required
- Phone: Required, basic format validation
- Email: Optional, email format validation
- Date/Time: Both required

### 5. Pages
**File:** `src/pages/CheckinPage.tsx`
- Simple wrapper for CheckinWizard component

### 6. App Router
**File:** `src/App.tsx` (updated)
Routes:
- `/` - CheckinPage (customer wizard)
- `/track/:code` - TrackingPage
- `/staff/*` - Staff routes (placeholder)

### 7. Styles
**File:** `src/index.css` (updated)
- Tailwind directives
- Base styles for light theme
- Mobile-first responsive utilities

## Design System

### Colors
- Primary: blue-600/blue-700
- Success: green-600
- Error: red-600
- Neutral: gray-50 to gray-900

### Touch Targets
- Minimum height: 44px (iOS guidelines)
- Buttons: 44-52px depending on size
- Inputs: 44px minimum

### Typography
- System font stack for performance
- Font sizes: sm (14px), base (16px), lg (18px), xl (20px)

### Spacing
- Consistent padding: 4px increments
- Cards: p-6 (24px) default
- Sections: space-y-4 or space-y-6

## Accessibility Checklist

### Implemented:
- [x] Semantic HTML (button, input, label)
- [x] ARIA labels and descriptions
- [x] Keyboard navigation support
- [x] Focus rings on all interactive elements
- [x] Required field indicators
- [x] Error messages with role="alert"
- [x] Touch targets minimum 44px
- [x] Color contrast ratios meet WCAG AA
- [x] Loading states communicated
- [x] Form validation feedback

### Future Enhancements:
- [ ] Screen reader testing
- [ ] Keyboard shortcuts for navigation
- [ ] Skip to content link
- [ ] Live region updates for dynamic content

## Performance Considerations

### Implemented:
- React hooks for state management (no heavy libraries)
- Image URL.createObjectURL for preview (no base64)
- Progressive form disclosure (less DOM at once)
- Optimistic UI updates

### Future Optimizations:
- Lazy load photo upload component
- Image compression before upload
- Service worker caching
- Code splitting by route

## Usage

### Development
```bash
cd C:\Users\itose\fagioli\fagioli-mvp\frontend
npm run dev
```

### Build
```bash
npm run build
```

### Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

## Testing the Wizard

1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5173/`
3. Complete wizard steps:
   - Enter plate: AB123CD
   - Select repair type
   - Upload at least 1 photo
   - Fill customer info
   - Select date/time
   - Review and submit
4. Receive tracking code on success

## Component Usage Examples

### Button
```tsx
<Button variant="primary" size="lg" fullWidth>
  Submit
</Button>

<Button variant="outline" isLoading disabled>
  Loading...
</Button>
```

### Input
```tsx
<Input
  label="Nome"
  required
  error={errors.name}
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Card
```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>
```

## Known Limitations

1. Photo upload uses mock API (uploadPhotosMock) - replace with real API
2. Submit uses mock API (submitCheckinMock) - replace with real API
3. No image compression implemented yet
4. No offline support yet (PWA capabilities not fully configured)
5. Insurance step skipping logic could be improved with animation
6. Date picker uses native browser control (consider custom solution)

## Next Steps

1. Integrate with backend API
2. Add image compression
3. Implement full PWA features (manifest, service worker)
4. Add analytics tracking
5. Implement photo type tagging (front, rear, detail)
6. Add vehicle brand/model auto-detection
7. Add insurance company dropdown with autocomplete
8. Implement file upload progress indicators
9. Add form state persistence (localStorage)
10. Comprehensive testing (unit, integration, E2E)
