// src/actions/tournamentActions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/* ---------- START TOURNAMENT (unchanged) ---------- */
export async function startTournament(tournamentId: string) {
  const supabase = await import('@/lib/supabase/server').then(m => m.supabaseServer)();
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

/* ---------- JOIN TOURNAMENT (secure server-side) ---------- */
export async function joinTournament(tournamentId: string, playerId: string) {
  const existing = await prisma.tournamentPlayer.findUnique({
    where: {
      tournamentId_playerId: { tournamentId, playerId },
    },
  });

  if (existing) {
    return { success: false, message: 'Already joined' };
  }

  await prisma.tournamentPlayer.create({
    data: { tournamentId, playerId },
  });

  revalidatePath(`/tournaments/detail?id=${tournamentId}`);
  return { success: true };
}