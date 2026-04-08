import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Commission { id: number; referralLinkId: number; orderId: number; amount: number; status: string; createdAt: string; }

export default function AdminCommissions() {
  const { token, user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    if (user?.role !== 'admin_a') return;
    fetch('/api/referrals/commissions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCommissions).catch(() => {});
  }, [token, user]);

  if (user?.role === 'admin_b') {
    return (
      <div>
        <h1 data-testid="admin-commissions-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Commissions</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">🔒 Access restricted to Admin-A only</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 data-testid="admin-commissions-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Commissions</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">ID</th><th className="pb-2">Referral Link</th><th className="pb-2">Order</th><th className="pb-2">Amount</th><th className="pb-2">Status</th><th className="pb-2">Date</th>
          </tr></thead>
          <tbody>
            {commissions.map(c => (
              <tr key={c.id} data-testid={`commission-row-${c.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <td className="py-3">#{c.id}</td>
                <td>Link #{c.referralLinkId}</td>
                <td>Order #{c.orderId}</td>
                <td className="font-bold text-green-600 dark:text-green-400">${c.amount.toFixed(2)}</td>
                <td>{c.status}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {commissions.length === 0 && <p className="text-gray-400 mt-4 text-center">No commissions yet.</p>}
      </div>
    </div>
  );
}
