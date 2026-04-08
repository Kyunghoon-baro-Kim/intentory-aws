import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Profile { id: number; channelUrl: string; subscribers: number; category: string; bio?: string; }
interface Collaboration { id: number; productId: number; terms: string; compensation?: string; status: string; createdAt: string; product?: { name: string }; }
interface ReferralLink { id: number; productId: number; code: string; product?: { name: string }; }
interface Commission { id: number; orderId: number; amount: number; status: string; createdAt: string; }
interface Product { id: number; name: string; }

type Tab = 'profile' | 'collaborations' | 'referrals' | 'commissions';

export default function InfluencerDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({ channelUrl: '', subscribers: 0, category: '', bio: '' });
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [msg, setMsg] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('/api/influencer/profile', { headers }).then(r => r.ok ? r.json() : null).then(p => {
      if (p) { setProfile(p); setProfileForm({ channelUrl: p.channelUrl, subscribers: p.subscribers, category: p.category, bio: p.bio ?? '' }); }
    }).catch(() => {});
    fetch('/api/collaborations/my', { headers }).then(r => r.ok ? r.json() : []).then(d => setCollabs(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/referrals/my-links', { headers }).then(r => r.ok ? r.json() : []).then(d => setLinks(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/referrals/commissions/my', { headers }).then(r => r.ok ? r.json() : []).then(d => setCommissions(Array.isArray(d) ? d : [])).catch(() => {});
    fetch('/api/products').then(r => r.ok ? r.json() : []).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
  }, [token]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = profile ? 'PUT' : 'POST';
    const res = await fetch('/api/influencer/profile', { method, headers, body: JSON.stringify(profileForm) });
    if (res.ok) { const p = await res.json(); setProfile(p); setMsg('Profile saved!'); } else setMsg('Failed');
  };

  const genLink = async () => {
    if (!selectedProduct) return;
    const res = await fetch(`/api/referrals/link/${selectedProduct}`, { method: 'POST', headers });
    if (res.ok) {
      const link = await res.json();
      setLinks(prev => [...prev, link]);
      setMsg('Link created!');
    }
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'collaborations', label: 'Collaborations', icon: '🤝' },
    { key: 'referrals', label: 'Referral Links', icon: '🔗' },
    { key: 'commissions', label: 'Commissions', icon: '💰' },
  ];

  return (
    <div>
      <h1 data-testid="influencer-dashboard-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Influencer Dashboard</h1>

      <div data-testid="influencer-tabs" className="flex gap-1 mb-6 bg-white/20 dark:bg-gray-800/50 rounded-xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} data-testid={`influencer-tab-${t.key}`} onClick={() => { setTab(t.key); setMsg(''); }}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-sm font-semibold transition whitespace-nowrap ${tab === t.key ? 'bg-white dark:bg-gray-700 text-primary dark:text-white shadow' : 'text-white/80 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {msg && <p className={`mb-4 text-sm font-semibold ${msg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}

        {tab === 'profile' && (
          <form onSubmit={saveProfile} data-testid="influencer-profile-form" className="grid gap-4">
            <input data-testid="influencer-channel" placeholder="Channel URL" value={profileForm.channelUrl} onChange={e => setProfileForm({ ...profileForm, channelUrl: e.target.value })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
            <div className="grid grid-cols-2 gap-4">
              <input data-testid="influencer-subscribers" type="number" placeholder="Subscribers" value={profileForm.subscribers} onChange={e => setProfileForm({ ...profileForm, subscribers: Number(e.target.value) })} className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
              <input data-testid="influencer-category" placeholder="Category" value={profileForm.category} onChange={e => setProfileForm({ ...profileForm, category: e.target.value })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
            </div>
            <textarea data-testid="influencer-bio" placeholder="Bio" value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} rows={3} className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
            <button data-testid="influencer-profile-submit" type="submit" className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">{profile ? 'Update' : 'Create'} Profile</button>
          </form>
        )}

        {tab === 'collaborations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
                <th className="pb-2">Product</th><th className="pb-2">Terms</th><th className="pb-2">Compensation</th><th className="pb-2">Status</th><th className="pb-2">Date</th>
              </tr></thead>
              <tbody>
                {collabs.map(c => (
                  <tr key={c.id} data-testid={`collab-row-${c.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    <td className="py-3">{c.product?.name ?? `#${c.productId}`}</td>
                    <td>{c.terms}</td><td>{c.compensation ?? '-'}</td>
                    <td><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {collabs.length === 0 && <p className="text-gray-400 mt-4 text-center">No collaborations yet.</p>}
          </div>
        )}

        {tab === 'referrals' && (
          <div>
            <div className="flex gap-3 mb-6">
              <select data-testid="referral-product-select" value={selectedProduct} onChange={e => setSelectedProduct(Number(e.target.value))} className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                <option value={0}>Select Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button data-testid="referral-generate" onClick={genLink} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition">Generate Link</button>
            </div>
            <div className="space-y-3">
              {links.map(l => (
                <div key={l.id} data-testid={`referral-link-${l.id}`} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{l.product?.name ?? `Product #${l.productId}`}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Code: {l.code}</p>
                  </div>
                  <code className="text-xs bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded self-start">{`${window.location.origin}/products/${l.productId}?ref=${l.code}`}</code>
                </div>
              ))}
              {links.length === 0 && <p className="text-gray-400 text-center">No referral links yet.</p>}
            </div>
          </div>
        )}

        {tab === 'commissions' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
                <th className="pb-2">ID</th><th className="pb-2">Order</th><th className="pb-2">Amount</th><th className="pb-2">Status</th><th className="pb-2">Date</th>
              </tr></thead>
              <tbody>
                {commissions.map(c => (
                  <tr key={c.id} data-testid={`my-commission-${c.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    <td className="py-3">#{c.id}</td><td>Order #{c.orderId}</td>
                    <td className="font-bold text-green-600 dark:text-green-400">${c.amount.toFixed(2)}</td>
                    <td>{c.status}</td><td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {commissions.length === 0 && <p className="text-gray-400 mt-4 text-center">No commissions yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
