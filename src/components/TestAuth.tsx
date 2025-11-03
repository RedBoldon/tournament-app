// src/components/TestAuth.tsx
'use client';

import { useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

export default function TestAuth() {
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data, error }) => {
      console.log('Supabase Session:', data.session);
      console.log('Supabase Error:', error);
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Supabase Auth Test</h1>
      <p>Open DevTools Console to see session</p>
    </div>
  );
}