import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Product { id: number; name: string; description?: string; price: number; stock: number; imageUrl?: string; }

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
  const [generating, setGenerating] = useState(false);

  const load = () => { fetch('/api/products').then(r => r.json()).then(setProducts); };
  useEffect(load, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/products/${editing.id}` : '/api/products';
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setForm({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
    setEditing(null);
    load();
  };

  const handleGenerateImage = async () => {
    if (!form.name) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/products/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: `Product photo of ${form.name}. ${form.description || ''}`.trim() })
      });
      const base64 = await res.json();
      setForm(f => ({ ...f, imageUrl: `data:image/png;base64,${base64}` }));
    } catch {
      alert('Image generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? '', price: p.price, stock: p.stock, imageUrl: p.imageUrl ?? '' });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
  };

  return (
    <div>
      <h1 data-testid="admin-products-title" className="mb-6 text-2xl font-bold text-white drop-shadow">Manage Products</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} data-testid="admin-product-form" className="grid gap-4">
          <input data-testid="admin-product-name" placeholder="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
          <textarea data-testid="admin-product-desc" placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <input data-testid="admin-product-price" type="number" step="0.01" placeholder="Price" value={form.price ?? ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
            <input data-testid="admin-product-stock" type="number" placeholder="Stock" value={form.stock ?? ''} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
          </div>
          <div className="flex gap-2">
            <input data-testid="admin-product-image" placeholder="Image URL" value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary outline-none" />
            <button type="button" onClick={handleGenerateImage} disabled={generating || !form.name} className="bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 whitespace-nowrap">
              {generating ? 'Generating...' : '🎨 AI Generate'}
            </button>
          </div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />}
          <div className="flex gap-3">
            <button data-testid="admin-product-submit" type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">{editing ? 'Update' : 'Add'} Product</button>
            {editing && <button type="button" onClick={cancelEdit} className="bg-gray-500 text-white px-6 py-3 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Mobile: card layout */}
      <div className="space-y-4 sm:hidden">
        {products.map(p => (
          <div key={p.id} data-testid={`admin-product-card-${p.id}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
              <span className="text-lg font-bold text-primary">${p.price}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Stock: {p.stock}</p>
            <div className="flex gap-2">
              <button data-testid={`admin-product-edit-${p.id}`} onClick={() => { setEditing(p); setForm({ name: p.name, description: p.description ?? '', price: p.price, stock: p.stock, imageUrl: p.imageUrl ?? '' }); }} className="flex-1 bg-yellow-400 text-gray-900 py-2 rounded-lg text-sm font-semibold">Edit</button>
              <button data-testid={`admin-product-delete-${p.id}`} onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b-2 border-gray-200 dark:border-gray-600 text-left text-gray-500 dark:text-gray-400">
            <th className="pb-2">Name</th><th className="pb-2">Price</th><th className="pb-2">Stock</th><th className="pb-2">Actions</th>
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} data-testid={`admin-product-row-${p.id}`} className="border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                <td className="py-3">{p.name}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td className="flex gap-2 py-3">
                  <button data-testid={`admin-product-edit-desktop-${p.id}`} onClick={() => startEdit(p)} className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs font-semibold">Edit</button>
                  <button data-testid={`admin-product-delete-desktop-${p.id}`} onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
