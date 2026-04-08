import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Storefront from './pages/Storefront';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import AdminInfluencers from './pages/AdminInfluencers';
import AdminCommissions from './pages/AdminCommissions';
import InfluencerDashboard from './pages/InfluencerDashboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Storefront />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="influencer" element={<ProtectedRoute roles={['influencer']}><InfluencerDashboard /></ProtectedRoute>} />
              <Route path="admin" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="admin/products" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminProducts /></ProtectedRoute>} />
              <Route path="admin/orders" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminOrders /></ProtectedRoute>} />
              <Route path="admin/inventory" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminInventory /></ProtectedRoute>} />
              <Route path="admin/influencers" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminInfluencers /></ProtectedRoute>} />
              <Route path="admin/commissions" element={<ProtectedRoute roles={['admin_a', 'admin_b']}><AdminCommissions /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
