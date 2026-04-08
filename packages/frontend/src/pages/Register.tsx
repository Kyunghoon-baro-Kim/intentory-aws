import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RoleTab = 'customer' | 'influencer';

export default function Register() {
  const [activeTab, setActiveTab] = useState<RoleTab>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name, activeTab);
      navigate('/');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
      <h1 data-testid="register-title" className="mb-2 text-center text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Join Inventrix</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Create your account to get started</p>

      <div data-testid="register-role-tabs" className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {(['customer', 'influencer'] as RoleTab[]).map(tab => (
          <button key={tab} data-testid={`register-tab-${tab}`} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${activeTab === tab ? 'bg-white dark:bg-gray-600 text-primary dark:text-white shadow' : 'text-gray-500 dark:text-gray-400'}`}>
            {tab === 'customer' ? '🛒 Customer' : '📢 Influencer'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} data-testid="register-form" className="flex flex-col gap-5">
        <input data-testid="register-name" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        <input data-testid="register-email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        <input data-testid="register-password" type="password" placeholder="Password (min 8 chars)" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        {error && <p className="text-red-500 text-center text-sm">❌ {error}</p>}
        <button data-testid="register-submit" type="submit" className="bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition">
          Register as {activeTab === 'customer' ? 'Customer' : 'Influencer'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
      </p>
    </div>
  );
}
