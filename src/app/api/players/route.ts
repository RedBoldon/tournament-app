// src/app/api/players/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { id, email } = await request.json();

  const player = await prisma.player.upsert({
    where: { id },
    update: {},
    create: {
      id,
      user: {
        connect: { id }, // ← CONNECT TO EXISTING USER
      },
    },
  });

  return NextResponse.json(player, { status: 201 });
}