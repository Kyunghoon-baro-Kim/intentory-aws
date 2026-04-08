import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin_a' || user?.role === 'admin_b';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav data-testid="navbar" className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-4 sm:px-8 py-4 flex justify-between items-center">
        <div className="flex gap-4 sm:gap-8 items-center">
          <Link to="/" data-testid="navbar-logo" className="text-xl sm:text-2xl font-bold tracking-tight text-primary hover:opacity-90 transition">✨ Inventrix</Link>
          <Link to="/" data-testid="navbar-store" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-primary transition hidden sm:inline">Store</Link>
          {user && <Link to="/orders" data-testid="navbar-orders" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-primary transition">My Orders</Link>}
          {user?.role === 'influencer' && <Link to="/influencer" data-testid="navbar-influencer" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-primary transition">My Dashboard</Link>}
          {isAdmin && <Link to="/admin" data-testid="navbar-admin" className="text-sm sm:text-base text-gray-600 dark:text-gray-300 hover:text-primary transition">Admin</Link>}
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <button onClick={toggleTheme} data-testid="dark-mode-toggle" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition" aria-label="Toggle dark mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <span className="hidden sm:inline bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm text-gray-700 dark:text-gray-300">👤 {user.name}</span>
              <button onClick={handleLogout} data-testid="navbar-logout" className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="navbar-login" className="px-4 py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary rounded-full text-sm transition">Login</Link>
              <Link to="/register" data-testid="navbar-register" className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary-dark transition">Register</Link>
            </>
          )}
        </div>
      </nav>
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
