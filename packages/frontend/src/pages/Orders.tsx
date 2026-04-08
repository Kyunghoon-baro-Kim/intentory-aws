import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Order {
  id: number;
  subtotal: number;
  gst: number;
  total: number;
  status: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500 dark:text-gray-400 text-center mt-16">Loading...</div>;

  return (
    <div>
      <h1 data-testid="orders-title" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} data-testid={`order-card-${o.id}`} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Order #{o.id}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal: ${o.subtotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">GST (10%): ${o.gst.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">${o.total.toFixed(2)}</p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColor[o.status] ?? ''}`}>{o.status}</span>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-300">No orders yet.</p>}
      </div>
    </div>
  );
}
