// src/app/api/join/route.ts
import { NextRequest } from 'next/server';
import { joinTournament } from '@/actions/tournamentActions';

export async function POST(req: NextRequest) {
  const { tournamentId, playerId } = await req.json();

  const result = await joinTournament(tournamentId, playerId);

  // FIXED: Always return JSON
  return Response.json(result || { success: true });
}