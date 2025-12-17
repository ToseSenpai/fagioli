# Testing Guide - Customer Check-in Wizard

## Quick Start

### 1. Start Development Server
```bash
cd C:\Users\itose\fagioli\fagioli-mvp\frontend
npm run dev
```

The app will be available at `http://localhost:5173/`

### 2. Test the Wizard Flow

#### Step 1: Welcome Screen
- Click "Inizia" to start the wizard

#### Step 2: Vehicle Information
- Enter license plate: `AB123CD` (required, format validated)
- Enter brand: `Fiat` (optional)
- Enter model: `500` (optional)
- Click "Avanti"

#### Step 3: Repair Type Selection
- Select one of:
  - **Sinistro** - Will require insurance info in next step
  - **Estetica** - Will skip insurance step
  - **Meccanica** - Will skip insurance step
- Click "Avanti"

#### Step 4: Insurance Information (Only if Sinistro selected)
- Enter insurance company: `Generali`
- Enter policy number: `123456789`
- Click "Avanti"

#### Step 5: Photo Upload
- Click the upload area to select photos
- Upload at least 1 photo (required)
- Can upload multiple photos
- Can remove photos by clicking the X button
- Click "Avanti"

#### Step 6: Customer Information
- Enter name: `Mario Rossi` (required)
- Enter phone: `+39 333 1234567` (required)
- Enter email: `mario@example.com` (optional)
- Click "Avanti"

#### Step 7: Preferred Date & Time
- Select a date (today or later)
- Select a time slot from available options
- Click "Avanti"

#### Step 8: Review
- Review all entered information
- Click "Indietro" to go back and edit
- Click "Invia" to submit

#### Step 9: Confirmation
- View tracking code (e.g., `CFXXXXXXXXX`)
- Click "Traccia il tuo veicolo" to go to tracking page
- Click "Nuovo Check-in" to start over

## Validation Testing

### Test Invalid Inputs

1. **Invalid License Plate**
   - Try: `123` → Error: "Formato targa non valido"
   - Try: `ABCD123` → Error: "Formato targa non valido"
   - Valid: `AB123CD` or `ab123cd` (auto-capitalized)

2. **Missing Required Fields**
   - Leave plate empty → Error: "Targa obbligatoria"
   - Don't select repair type → Error: "Seleziona il tipo di intervento"
   - Don't upload photo → Error: "Carica almeno una foto"

3. **Invalid Phone**
   - Try: `abc123` → Error: "Numero di telefono non valido"
   - Valid: `+39 333 1234567` or `3331234567`

4. **Invalid Email**
   - Try: `notanemail` → Error: "Email non valida"
   - Valid: `user@example.com`

## Mobile Testing

### Responsive Breakpoints
- **Mobile**: < 768px - Full width with padding
- **Desktop**: >= 768px - Max width 448px (max-w-md), centered

### Touch Target Testing
All buttons and inputs should be minimum 44px height:
- Buttons: 44-52px depending on size
- Inputs: 44px
- Time slot buttons: 48px
- Card tap areas: Adequate spacing

### Test on Mobile Devices
1. Open Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro, Samsung Galaxy S20, etc.
4. Test:
   - Touch interactions
   - Form input with mobile keyboard
   - Photo upload from camera
   - Scrolling behavior
   - Progress bar visibility

## Accessibility Testing

### Keyboard Navigation
1. Tab through all form fields
2. Press Enter to submit buttons
3. Use arrow keys in time selection
4. Verify focus rings are visible

### Screen Reader Testing (Optional)
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through wizard
3. Verify:
   - Labels are announced
   - Errors are announced
   - Progress is communicated
   - Required fields are indicated

## Performance Testing

### Load Time
- Initial page load should be < 2 seconds
- Step transitions should be instant
- Photo upload should show progress

### Network Throttling
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Test wizard flow
4. Verify loading states are shown

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Common Issues & Solutions

### Photos Not Uploading
- Check browser console for errors
- Verify file size is reasonable (< 10MB)
- Ensure file type is image/* (jpg, png, etc.)

### Form Not Submitting
- Check console for validation errors
- Verify all required fields are filled
- Check network tab for API errors

### Styling Issues
- Clear browser cache
- Rebuild: `npm run build`
- Check Tailwind is configured correctly

### TypeScript Errors
- Run: `npm run build` to see all errors
- Errors in staff components are expected (not part of this implementation)
- Our files should have zero errors

## API Integration Testing

Currently using mock APIs. To test with real backend:

1. Update `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

2. Replace mock functions in wizard:
```tsx
// Change this:
import { submitCheckinMock, uploadPhotosMock } from '../../lib/api';

// To this:
import { submitCheckin, uploadPhotos } from '../../lib/api';

// Update function calls:
const response = await submitCheckin(formData);
const uploadedPhotos = await uploadPhotos(files);
```

3. Ensure backend is running:
```bash
cd C:\Users\itose\fagioli\fagioli-mvp\backend
npm run dev
```

## Test Data

### Valid Test Data Set
```
Vehicle:
- Plate: AB123CD
- Brand: Fiat
- Model: 500

Repair Type: Sinistro

Insurance:
- Company: Generali
- Policy: 123456789

Photos: At least 1 image file

Customer:
- Name: Mario Rossi
- Phone: +39 333 1234567
- Email: mario.rossi@example.com

Date/Time:
- Date: Tomorrow
- Time: 09:00
```

## Automated Testing (Future)

### Unit Tests Structure
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with correct variant classes', () => {});
  it('shows loading spinner when isLoading', () => {});
  it('is disabled when disabled prop is true', () => {});
});

// CheckinWizard.test.tsx
describe('CheckinWizard', () => {
  it('starts at step 1', () => {});
  it('validates plate format', () => {});
  it('skips insurance step for non-sinistro', () => {});
  it('requires at least one photo', () => {});
  it('submits form with valid data', () => {});
});
```

### Integration Tests
- Test full wizard flow end-to-end
- Test API integration
- Test error handling

### E2E Tests with Playwright
```typescript
test('complete check-in flow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Inizia');
  await page.fill('input[name="plate"]', 'AB123CD');
  // ... etc
});
```

## Performance Benchmarks

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90
- Bundle Size: < 500KB

Check with:
```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse
```

## Troubleshooting

### Dev Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Fails
```bash
# Check for TypeScript errors
npm run build

# If errors in staff components, that's expected
# Focus on errors in:
# - src/components/customer/CheckinWizard.tsx
# - src/components/ui/*.tsx
# - src/lib/api.ts
# - src/types/index.ts
```

### Styles Not Working
```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```
