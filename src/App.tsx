import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout, AdminLayout } from './components/layout';
import { HomePage } from './pages/HomePage';
import { BookingPage } from './pages/BookingPage';
import { ServicesPage } from './pages/ServicesPage';
import { AdminPage } from './pages/admin/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/agendar" element={<BookingPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
        </Route>

        {/* Admin routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;