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
      .channel(`tournament-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'TournamentPlayer',
          filter: `tournamentId=eq.${tournamentId}`,
        },
        (payload) => {
          const newRow = payload.new as { playerId: string };
          console.log('Realtime INSERT:', newRow); // DEBUG
          setPlayers((prev) => {
            if (prev.some((p) => p.playerId === newRow.playerId)) return prev;
            return [...prev, { playerId: newRow.playerId }];
          });
        }
      )
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