import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Profile { id: number; userId: number; channelUrl: string; subscribers: number; category: string; bio?: string; user?: { name: string; email: string }; }
interface Product { id: number; name: string; }

export default function AdminInfluencers() {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collab, setCollab] = useState({ influencerProfileId: 0, productId: 0, terms: '', compensation: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/influencer', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setProfiles).catch(() => {});
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, [token]);

  const createCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collab.influencerProfileId || !collab.productId) { setMsg('Please select influencer and product'); return; }
    const res = await fetch('/api/collaborations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(collab)
    });
    setMsg(res.ok ? 'Collaboration created!' : 'Failed');
    setCollab({ influencerProfileId: 0, productId: 0, terms: '', compensation: '' });
  };

  return (
    <div>
      <h1 data-testid="admin-influencers-title" className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Influencer Management</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create Collaboration</h2>
        <form onSubmit={createCollab} data-testid="collab-form" className="grid gap-4 sm:grid-cols-2">
          <select data-testid="collab-influencer" value={collab.influencerProfileId} onChange={e => setCollab({ ...collab, influencerProfileId: Number(e.target.value) })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
            <option value={0}>Select Influencer</option>
            {profiles.map(p => <option key={p.id} value={p.id}>{p.user?.name ?? `Profile #${p.id}`}</option>)}
          </select>
          <select data-testid="collab-product" value={collab.productId} onChange={e => setCollab({ ...collab, productId: Number(e.target.value) })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
            <option value={0}>Select Product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input data-testid="collab-terms" placeholder="Terms" value={collab.terms} onChange={e => setCollab({ ...collab, terms: e.target.value })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
          <input data-testid="collab-compensation" placeholder="Compensation" value={collab.compensation} onChange={e => setCollab({ ...collab, compensation: e.target.value })} className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
          <button data-testid="collab-submit" type="submit" className="sm:col-span-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">Create Collaboration</button>
        </form>
        {msg && <p className={`mt-3 text-sm ${msg.includes('created') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Influencer Profiles</h2>
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">Name</th><th className="pb-2">Channel</th><th className="pb-2">Subscribers</th><th className="pb-2">Category</th>
          </tr></thead>
          <tbody>
            {profiles.map(p => (
              <tr key={p.id} data-testid={`influencer-row-${p.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <td className="py-3">{p.user?.name ?? '-'}</td>
                <td><a href={p.channelUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{p.channelUrl}</a></td>
                <td>{p.subscribers.toLocaleString()}</td>
                <td>{p.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
