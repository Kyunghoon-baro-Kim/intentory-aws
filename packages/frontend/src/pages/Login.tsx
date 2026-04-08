import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
      <h1 data-testid="login-title" className="mb-2 text-center text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Welcome Back</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Login to your Inventrix account</p>
      <form onSubmit={handleSubmit} data-testid="login-form" className="flex flex-col gap-5">
        <input data-testid="login-email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        <input data-testid="login-password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
        {error && <p className="text-red-500 text-center text-sm">❌ {error}</p>}
        <button data-testid="login-submit" type="submit" className="bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition">Login</button>
      </form>
      <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register</Link>
      </p>
    </div>
  );
}
