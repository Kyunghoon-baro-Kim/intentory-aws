import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: number;
  rating: number;
  comment: string;
  imageUrls: string[];
  createdAt: string;
  user?: { name: string };
}

export default function ReviewSection({ productId }: { productId: number }) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      fetch(`/api/reviews/product/${productId}`).then(r => r.json()),
      fetch(`/api/reviews/product/${productId}/rating`).then(r => r.json()),
    ]).then(([r, a]) => { setReviews(r?.reviews ?? []); setAvg(a.average ?? 0); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, rating, comment })
      });
      if (res.ok) { setComment(''); setRating(5); setMsg('Review submitted!'); load(); }
      else {
        const err = await res.json().catch(() => null);
        setMsg(err?.message ?? 'You can only review products you have received.');
      }
    } catch { setMsg('Failed to submit review'); }
  };

  if (loading) return <div className="mt-8 text-gray-400">Loading reviews...</div>;

  return (
    <div data-testid="review-section" className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Reviews {avg > 0 && <span className="text-yellow-500">★ {avg.toFixed(1)}</span>}
      </h2>

      {user?.role === 'customer' && (
        <form onSubmit={submit} data-testid="review-form" className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" data-testid={`review-star-${s}`} onClick={() => setRating(s)} className={`text-2xl ${s <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`}>★</button>
            ))}
          </div>
          <textarea data-testid="review-comment" value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." required className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:border-primary outline-none transition mb-3" rows={3} />
          {msg && <p className={`text-sm mb-2 ${msg.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
          <button data-testid="review-submit" type="submit" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition">Submit Review</button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} data-testid={`review-item-${r.id}`} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">{r.user?.name ?? 'User'}</span>
              <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{r.comment}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-400 dark:text-gray-500">No reviews yet.</p>}
      </div>
    </div>
  );
}
