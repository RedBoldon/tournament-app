// src/components/TournamentRealtime.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type PlayerJoin = {
  playerId: string;
};

type Props = {
  initialPlayers: PlayerJoin[];
  tournamentId: string;
};

export default function TournamentRealtime({ initialPlayers, tournamentId }: Props) {
  const [players, setPlayers] = useState<PlayerJoin[]>(initialPlayers);
  const router = useRouter();

  const refresh = () => {
    router.refresh();  // Re-fetches from server, updates all tabs
  };

  return (
    <div>
      <ul className="space-y-2">
        {players.map((tp) => (
          <li key={tp.playerId} className="border p-3 rounded bg-gray-50">
            Player ID: {tp.playerId}
          </li>
        ))}
      </ul>
      <button onClick={refresh} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
        Refresh Players
      </button>
    </div>
  );
}