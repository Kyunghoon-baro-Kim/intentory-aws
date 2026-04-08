import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 data-testid="storefront-title" className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Featured Products</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Discover our curated collection</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} data-testid={`product-card-${p.id}`} className="group block">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="relative pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">📦</div>
                )}
                {/* Stock badge overlay */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${p.stock > 0 ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {p.stock > 0 ? 'In Stock' : 'Sold Out'}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 line-clamp-1">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">${p.price.toFixed(2)}</span>
                  <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
