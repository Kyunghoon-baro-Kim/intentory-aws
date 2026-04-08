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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-secondary dark:from-gray-900 dark:to-gray-800">
      <nav data-testid="navbar" className="bg-gradient-to-r from-primary to-secondary dark:from-gray-900 dark:to-gray-800 text-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex gap-4 sm:gap-8 items-center">
          <Link to="/" data-testid="navbar-logo" className="text-xl sm:text-2xl font-bold tracking-tight hover:opacity-90 transition">✨ Inventrix</Link>
          <Link to="/" data-testid="navbar-store" className="text-sm sm:text-base opacity-90 hover:opacity-100 transition hidden sm:inline">Store</Link>
          {user && <Link to="/orders" data-testid="navbar-orders" className="text-sm sm:text-base opacity-90 hover:opacity-100 transition">My Orders</Link>}
          {user?.role === 'influencer' && <Link to="/influencer" data-testid="navbar-influencer" className="text-sm sm:text-base opacity-90 hover:opacity-100 transition">My Dashboard</Link>}
          {isAdmin && <Link to="/admin" data-testid="navbar-admin" className="text-sm sm:text-base opacity-90 hover:opacity-100 transition">Admin</Link>}
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <button onClick={toggleTheme} data-testid="dark-mode-toggle" className="p-2 rounded-full hover:bg-white/20 transition" aria-label="Toggle dark mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user ? (
            <>
              <span className="hidden sm:inline bg-white/20 px-3 py-1.5 rounded-full text-sm">👤 {user.name}</span>
              <button onClick={handleLogout} data-testid="navbar-logout" className="bg-white text-primary px-4 py-1.5 rounded-full text-sm font-semibold hover:shadow-lg transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="navbar-login" className="px-4 py-1.5 bg-white/20 rounded-full text-sm hover:bg-white/30 transition">Login</Link>
              <Link to="/register" data-testid="navbar-register" className="px-4 py-1.5 bg-white text-primary rounded-full text-sm font-semibold hover:scale-105 transition">Register</Link>
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
