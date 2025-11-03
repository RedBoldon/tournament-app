// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { id, email, role } = await request.json();

  const user = await prisma.user.upsert({
    where: { id },
    update: { email, role },
    create: { id, email, role: role || 'player' },
  });

  return NextResponse.json(user, { status: 201 });
}