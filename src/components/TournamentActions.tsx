// src/components/TournamentActions.tsx
'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { startTournament } from '@/actions/tournamentActions';
import { supabaseClient } from '@/lib/supabase/client';

export default function TournamentActions({
  tournament,
  isAdmin,
}: {
  tournament: any;
  isAdmin: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  /* ---------- JOIN (client → triggers realtime) ---------- */
  const handleJoin = async () => {
    if (!user) return;

    // 1. Secure server-side insert
    const res = await fetch('/api/join', {
      method: 'POST',
      body: JSON.stringify({
        tournamentId: tournament.id,
        playerId: user.id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!data.success) {
      console.error('Server join failed:', data.message);
      return;
    }

    // 2. Client-side insert → fires realtime event
    const { error } = await supabaseClient
      .from('TournamentPlayer')
      .insert({
        tournamentId: tournament.id,
        playerId: user.id,
      });

    if (error) {
      console.error('Realtime insert failed:', error);
      return;
    }

    router.refresh();
  };

  /* ---------- START TOURNAMENT (unchanged) ---------- */
  const handleStart = async () => {
    await startTournament(tournament.id);
    router.refresh();
  };

  if (isAdmin && tournament.status === 'draft') {
    return (
      <form action={handleStart} className="mt-6">
        <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
          Start Tournament
        </button>
      </form>
    );
  }

  if (!isAdmin && tournament.status === 'active') {
    return (
      <form action={handleJoin} className="mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          Join Tournament
        </button>
      </form>
    );
  }

  return null;
}