// src/app/tournaments/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateTournamentSchema } from '@/lib/validation';
import { useAuth } from '@/components/AuthProvider';

export default function CreateTournamentPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [loading, isAdmin, router]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const result = CreateTournamentSchema.safeParse(data);

    if (!result.success) {
      setErrors(result.error.format());
      return;
    }

    const res = await fetch('/api/tournaments', {
      method: 'POST',
      body: JSON.stringify(result.data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/tournaments/detail?id=${data.id}`);
    } else {
      const error = await res.json();
      setErrors(error.errors || { _errors: ['Server error'] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create Tournament</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              type="text"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Summer Swiss 2025"
            />
            {errors.name?._errors?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.name._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Rounds</label>
            <input
              name="rounds"
              type="number"
              min="1"
              max="10"
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="5"
            />
            {errors.rounds?._errors?.[0] && (
              <p className="text-red-500 text-sm mt-1">{errors.rounds._errors[0]}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create Tournament
          </button>
        </form>
      </div>
    </div>
  );
}