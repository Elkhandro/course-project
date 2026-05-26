import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/buyer/CatalogPage';

import StaffBooksPage from './pages/staff/BooksPage';
import AuthorsPage from './pages/staff/AuthorsPage';
import GenresPage from './pages/staff/GenresPage';
import SalesPage from './pages/staff/SalesPage';
import OrdersPage from './pages/staff/OrdersPage';
import AnalyticsPage from './pages/staff/AnalyticsPage';

import './styles/global.scss';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/staff/books" element={<ProtectedRoute><StaffBooksPage /></ProtectedRoute>} />
                <Route path="/staff/authors" element={<ProtectedRoute><AuthorsPage /></ProtectedRoute>} />
                <Route path="/staff/genres" element={<ProtectedRoute><GenresPage /></ProtectedRoute>} />
                <Route path="/staff/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
                <Route path="/staff/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/staff/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
