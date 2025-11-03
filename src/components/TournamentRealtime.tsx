// src/components/TournamentRealtime.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase/client';

export default function TournamentRealtime({ 
  initialPlayers, 
  tournamentId 
}: { 
  initialPlayers: any[]; 
  tournamentId: string;
}) {
  const [players, setPlayers] = useState(initialPlayers);

  useEffect(() => {
    const channel = supabaseClient
      .channel(`tournament-${tournamentId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'TournamentPlayer',
        filter: `tournamentId=eq.${tournamentId}`,
      }, (payload) => {
        setPlayers(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [tournamentId]);

  return (
    <ul className="space-y-2">
      {players.map((tp: any) => (
        <li key={tp.playerId} className="border p-3 rounded bg-gray-50">
          Player ID: {tp.playerId}
        </li>
      ))}
    </ul>
  );
}