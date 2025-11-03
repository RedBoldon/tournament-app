// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
  const { data: { user }, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: 'http://localhost:3000' }
  });
  if (error) throw error;

  // Create User in DB
  await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      id: user.id,
      email: user.email,
      role: 'admin' 
    }),
  });
  // Create Player in DB
  await fetch('/api/players', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      id: user.id,
    }),
  });

  alert('Check your email!');
} else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
        <h2 className="text-3xl font-bold text-center">
          {isSignup ? 'Sign Up' : 'Log In'}
        </h2>
        <form onSubmit={handleAuth} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <p className="text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}