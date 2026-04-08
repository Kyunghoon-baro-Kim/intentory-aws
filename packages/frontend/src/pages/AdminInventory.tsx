import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface InventoryItem { id: number; name: string; stock: number; price: number; }

export default function AdminInventory() {
  const { token } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setItems).catch(() => {
        // fallback: use products endpoint
        fetch('/api/products').then(r => r.json()).then(setItems).catch(() => {});
      }).finally(() => setLoading(false));
  }, [token]);

  const getStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', style: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' };
    if (stock <= 5) return { label: 'Low Stock', style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' };
    return { label: 'In Stock', style: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
  };

  if (loading) return <div className="text-gray-500 dark:text-gray-400 text-center mt-16">Loading...</div>;

  return (
    <div>
      <h1 data-testid="admin-inventory-title" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>

      {/* Mobile: card layout */}
      <div className="space-y-4 sm:hidden">
        {items.map(i => {
          const s = getStatus(i.stock);
          return (
            <div key={i.id} data-testid={`inventory-card-${i.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{i.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">${i.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white mb-1">{i.stock}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.style}`}>{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">Product</th><th className="pb-2">Stock</th><th className="pb-2">Price</th><th className="pb-2">Status</th>
          </tr></thead>
          <tbody>
            {items.map(i => {
              const s = getStatus(i.stock);
              return (
                <tr key={i.id} data-testid={`inventory-row-${i.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <td className="py-3">{i.name}</td>
                  <td className="font-bold">{i.stock}</td>
                  <td>${i.price.toFixed(2)}</td>
                  <td><span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.style}`}>{s.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
