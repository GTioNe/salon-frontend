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

        {/* Admin routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/agenda" element={<AdminAgenda />} />
          <Route path="/admin/financeiro" element={<AdminFinancial />} />
          <Route path="/admin/clientes" element={<AdminClients />} />
          <Route path="/admin/servicos" element={<AdminServices />} />
          <Route path="/admin/ajustes" element={<AdminSettings />} />
          {/* Fallback for admin */}
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
