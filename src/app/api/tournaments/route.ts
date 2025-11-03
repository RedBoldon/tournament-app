// src/app/api/tournaments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateTournamentSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admins only' }, { status: 403 });
    }

    const body = await request.json();
    const result = CreateTournamentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.format() },
        { status: 400 }
      );
    }

    const { name, rounds } = result.data;

    const tournament = await prisma.tournament.create({
      data: {
        name,
        rounds,
        adminId: user.id,
        status: 'draft',
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}