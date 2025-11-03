// src/components/TournamentActions.tsx
'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { startTournament, joinTournament } from '@/actions/tournamentActions';

export default function TournamentActions({ 
  tournament, 
  isAdmin 
}: { 
  tournament: any; 
  isAdmin: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const handleJoin = async () => {
    if (!user) return;
    await joinTournament(tournament.id, user.id);
    router.refresh();
  };

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