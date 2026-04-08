import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const referralCode = searchParams.get('ref');

  useEffect(() => {
    fetch(`/api/products/${id}`).then(r => r.json()).then(setProduct);
  }, [id]);

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return; }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: [{ productId: product?.id, quantity }], ...(referralCode && { referralCode }) })
    });
    if (res.ok) { setMessage('Order placed successfully!'); setTimeout(() => navigate('/orders'), 2000); }
    else setMessage('Order failed');
  };

  if (!product) return <div className="text-white text-center mt-16">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div data-testid="product-detail" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
        {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded-xl mb-6" />}
        <h1 data-testid="product-name" className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{product.description}</p>
        <div className="flex justify-between items-center mb-6">
          <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${product.price}</span>
          <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        {product.stock > 0 && (
          <div className="flex gap-4 items-center">
            <input data-testid="product-quantity" type="number" min={1} max={product.stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-24 px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-center" />
            <button data-testid="product-order-button" onClick={handleOrder} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition">Place Order</button>
          </div>
        )}
        {message && <p className={`mt-4 text-center font-semibold ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
      </div>

      <ReviewSection productId={Number(id)} />
    </div>
  );
}
