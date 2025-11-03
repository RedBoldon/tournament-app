// src/actions/tournamentActions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function startTournament(tournamentId: string) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    return;
  }

  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: 'active' },
  });

  revalidatePath(`/tournaments/detail?id=${tournamentId}`);
}

// src/actions/tournamentActions.ts
export async function joinTournament(tournamentId: string, authUserId: string) {
  console.log('Join attempt:', { tournamentId, authUserId });
  // Find Player by authUserId
  const player = await prisma.player.findUnique({
    where: { id: authUserId },
  });

  if (!player) return;

  console.log('Player found:', player.id);

  const existing = await prisma.tournamentPlayer.findUnique({
    where: {
      tournamentId_playerId: {
        tournamentId,
        playerId: player.id,
      },
    },
  });

  if (existing) return;

  console.log('Creating join record');

  await prisma.tournamentPlayer.create({
    data: {
      tournamentId,
      playerId: player.id,
    },
  });

  console.log('Join successful');

  revalidatePath(`/tournaments/detail?id=${tournamentId}`);
}