import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckinPage } from './pages/CheckinPage';
import TrackingPage from './pages/TrackingPage';
import TrackingDemoPage from './pages/TrackingDemoPage';

// Staff imports
import { LoginPage } from './pages/staff/LoginPage';
import { DashboardPage } from './pages/staff/DashboardPage';
import { RepairsPage } from './pages/staff/RepairsPage';
import { DashboardLayout } from './components/staff/DashboardLayout';
import { ProtectedRoute } from './components/staff/ProtectedRoute';

/**
 * Main App Component
 *
 * Routes:
 * - / - Customer check-in wizard
 * - /track/:code - Customer tracking page
 * - /demo/tracking - Demo page for tracking component
 * - /staff/login - Staff login
 * - /staff - Staff dashboard (protected)
 * - /staff/repairs - Repairs management (protected)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer check-in wizard */}
        <Route path="/" element={<CheckinPage />} />

        {/* Customer tracking route */}
        <Route path="/track/:code" element={<TrackingPage />} />

        {/* Demo/development pages */}
        <Route path="/demo/tracking" element={<TrackingDemoPage />} />

        {/* Staff login - public */}
        <Route path="/staff/login" element={<LoginPage />} />

        {/* Staff routes - protected */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="repairs" element={<RepairsPage />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
