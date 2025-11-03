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
  const handleJoin = async (tournamentId: string) => {
  try {
    const res = await fetch(`/api/tournaments/${tournamentId}/join`, {
      method: 'POST',
      credentials: 'include', // important if using auth
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // DEBUG: Check status
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Join failed:', res.status, errorText);
      return;
    }

    // DEBUG: Get raw text
    const text = await res.text();
    if (!text) {
      console.error('Empty response from server');
      return;
    }

    // Now parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON received:', text);
      return;
    }

    if (!data.success) {
      console.error('Join failed:', data.message);
      return;
    }

    alert('Joined successfully!');
    // refresh tournament or update UI

  } catch (err) {
    console.error('Network error:', err);
  }
};

  /* ---------- START TOURNAMENT (unchanged) ---------- */
  if (isAdmin && tournament.status === 'draft') {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTournament(tournament.id);
        router.refresh();
      }}
      className="mt-6"
    >
      <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
        Start Tournament
      </button>
    </form>
  );
}

  if (!isAdmin && tournament.status === 'active') {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const id = (e.currentTarget as HTMLFormElement).dataset.tournamentId;
        if (id) handleJoin(id);
      }}
      data-tournament-id={tournament.id}
      className="mt-6"
    >
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Join Tournament
      </button>
    </form>
  );
}

  return null;
}