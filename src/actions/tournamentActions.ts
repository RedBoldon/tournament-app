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

export async function joinTournament(formData: FormData) {
  'use server';

  const tournamentId = formData.get('tournamentId') as string;
  const playerId = formData.get('playerId') as string;

  const existing = await prisma.tournamentPlayer.findUnique({
    where: {
      tournamentId_playerId: {
        tournamentId,
        playerId,
      },
    },
  });

  if (existing) return;

  await prisma.tournamentPlayer.create({
    data: {
      tournamentId,
      playerId,
    },
  });

  revalidatePath(`/tournaments/detail?id=${tournamentId}`);
}