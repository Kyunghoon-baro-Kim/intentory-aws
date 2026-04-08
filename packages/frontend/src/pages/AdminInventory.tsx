import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface InventoryItem { id: number; name: string; stock: number; price: number; status: string; }

const statusStyle: Record<string, string> = {
  out_of_stock: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  low_stock: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  in_stock: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};
const statusLabel: Record<string, string> = { out_of_stock: 'Out of Stock', low_stock: 'Low Stock', in_stock: 'In Stock' };

export default function AdminInventory() {
  const { token } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    fetch('/api/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setItems).catch(() => {});
  }, [token]);

  return (
    <div>
      <h1 data-testid="admin-inventory-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Inventory Management</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">Product</th><th className="pb-2">Stock</th><th className="pb-2">Price</th><th className="pb-2">Status</th>
          </tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} data-testid={`inventory-row-${i.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <td className="py-3">{i.name}</td>
                <td className="font-bold">{i.stock}</td>
                <td>${i.price.toFixed(2)}</td>
                <td><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[i.status] ?? ''}`}>{statusLabel[i.status] ?? i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
