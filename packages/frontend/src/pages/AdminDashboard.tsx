import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product { id: number; name: string; price: number; stock: number; }
interface Order { id: number; subtotal: number; gst: number; total: number; status: string; createdAt: string; user?: { name: string }; }

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, o]) => { setProducts(p); setOrders(o); }).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const cards = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'text-green-600 dark:text-green-400' },
    { label: 'Total Orders', value: orders.length, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Total Products', value: products.length, color: 'text-cyan-600 dark:text-cyan-400' },
    { label: 'Low / Out of Stock', value: `${lowStock} / ${outOfStock}`, color: 'text-red-600 dark:text-red-400' },
  ];

  const navItems = [
    { to: '/admin/products', label: 'Products', testId: 'admin-nav-products' },
    { to: '/admin/orders', label: 'Orders', testId: 'admin-nav-orders' },
    { to: '/admin/inventory', label: 'Inventory', testId: 'admin-nav-inventory' },
    { to: '/admin/influencers', label: 'Influencers', testId: 'admin-nav-influencers' },
    { to: '/admin/commissions', label: 'Commissions', testId: 'admin-nav-commissions', adminAOnly: true },
  ];

  if (loading) return <div className="text-white text-center mt-16">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 data-testid="admin-dashboard-title" className="text-2xl font-bold text-white drop-shadow">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          {navItems.map(n => {
            const disabled = n.adminAOnly && user?.role === 'admin_b';
            return (
              <Link key={n.to} to={disabled ? '#' : n.to} data-testid={n.testId}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${disabled ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-700 text-primary dark:text-white hover:shadow-lg'}`}
                onClick={e => disabled && e.preventDefault()}>
                {n.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{c.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">#{o.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{o.user?.name ?? '-'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">${o.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
                <th className="pb-2">ID</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th>
              </tr></thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    <td className="py-2">#{o.id}</td><td>{o.user?.name ?? '-'}</td><td>${o.total.toFixed(2)}</td><td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Low Stock Alert</h2>
          {products.filter(p => p.stock <= 5).map(p => (
            <div key={p.id} className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
              <p className={`text-xs font-semibold ${p.stock === 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                {p.stock === 0 ? 'Out of stock' : `${p.stock} remaining`}
              </p>
            </div>
          ))}
          {products.filter(p => p.stock <= 5).length === 0 && <p className="text-gray-400 text-sm">All products well stocked.</p>}
        </div>
      </div>
    </div>
  );
}
