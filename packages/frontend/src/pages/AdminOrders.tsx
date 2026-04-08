import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Order {
  id: number;
  userId: number;
  subtotal: number;
  gst: number;
  total: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => { fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setOrders); };
  useEffect(load, [token]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    load();
  };

  return (
    <div>
      <h1 data-testid="admin-orders-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Manage Orders</h1>

      {/* Mobile: card layout */}
      <div className="space-y-4 sm:hidden">
        {orders.map(o => (
          <div key={o.id} data-testid={`admin-order-card-${o.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-900 dark:text-white">#{o.id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{o.user?.name ?? '-'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal: ${o.subtotal.toFixed(2)} | GST: ${o.gst.toFixed(2)}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-gray-900 dark:text-white">${o.total.toFixed(2)}</span>
              <select data-testid={`admin-order-status-${o.id}`} value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white text-xs">
                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">ID</th><th className="pb-2">Customer</th><th className="pb-2">Subtotal</th><th className="pb-2">GST</th><th className="pb-2">Total</th><th className="pb-2">Status</th><th className="pb-2">Date</th><th className="pb-2">Actions</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} data-testid={`admin-order-row-${o.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <td className="py-3">#{o.id}</td>
                <td>{o.user?.name ?? '-'}</td>
                <td>${o.subtotal.toFixed(2)}</td>
                <td>${o.gst.toFixed(2)}</td>
                <td className="font-bold">${o.total.toFixed(2)}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <select data-testid={`admin-order-status-desktop-${o.id}`} value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white text-xs">
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
