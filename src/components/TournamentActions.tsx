// src/components/TournamentActions.tsx
'use client';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { startTournament } from '@/actions/tournamentActions';

export default function TournamentActions({
  tournament,
  isAdmin,
}: {
  tournament: any;
  isAdmin: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  // ---------- JOIN ----------
  const handleJoin = async (tournamentId: string) => {
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Join failed:', res.status, txt);
        alert(`Join failed (${res.status})`);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        alert(`Join failed: ${data.message}`);
        return;
      }

      alert('Joined successfully!');
      router.refresh(); // optional: update UI via realtime or refetch
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error');
    }
  };

  // ---------- START ----------
  const handleStart = async (tournamentId: string) => {
    try {
      await startTournament(tournamentId);
      router.refresh();
    } catch (err) {
      console.error('Start failed:', err);
      alert('Failed to start');
    }
  };

  // ---------- ADMIN: START ----------
  if (isAdmin && tournament.status === 'draft') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleStart(tournament.id);
        }}
        className="mt-6"
      >
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Start Tournament
        </button>
      </form>
    );
  }

  // ---------- PLAYER: JOIN ----------
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