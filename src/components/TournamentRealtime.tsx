// src/components/TournamentRealtime.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

type PlayerJoin = {
  playerId: string;
};

type Props = {
  initialPlayers: PlayerJoin[];
  tournamentId: string;
};

export default function TournamentRealtime({ initialPlayers, tournamentId }: Props) {
  const [players, setPlayers] = useState<PlayerJoin[]>(initialPlayers);

  useEffect(() => {
    const channel = supabaseClient
      .channel(`tournament:${tournamentId}:players`)
      .on('broadcast', { event: 'INSERT' }, (payload) => {
        const newJoin = payload.payload as { playerId: string };
        console.log('Realtime: Received broadcast INSERT', newJoin);
        setPlayers((prev) => {
          if (prev.some((p) => p.playerId === newJoin.playerId)) return prev;
          return [...prev, newJoin];
        });
      })
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [tournamentId]);

  return (
    <ul className="space-y-2">
      {players.map((tp) => (
        <li key={tp.playerId} className="border p-3 rounded bg-gray-50">
          Player ID: {tp.playerId}
        </li>
      ))}
    </ul>
  );
}