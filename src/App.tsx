import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AdminLayout } from './components/layout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminAgenda } from './pages/admin/AdminAgenda';
import { AdminFinancial } from './pages/admin/AdminFinancial';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminGuard } from './components/auth/AdminGuard';
import { ProfileSettings } from './pages/ProfileSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/agendar" element={<BookingPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/perfil" element={<ProfileSettings />} />
        </Route>

        {/* Admin routes - guard first, then layout */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="agenda" element={<AdminAgenda />} />
            <Route path="financeiro" element={<AdminFinancial />} />
            <Route path="clientes" element={<AdminClients />} />
            <Route path="servicos" element={<AdminServices />} />
            <Route path="ajustes" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;