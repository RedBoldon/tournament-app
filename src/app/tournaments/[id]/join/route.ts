// app/tournaments/[id]/join/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const tournamentId = params.id;
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set({ name, value, ...options }),
        remove: (name, options) => cookieStore.set({ name, value: '', ...options }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Login required' }, { status: 401 });
  }

  // 1. Check tournament is active
  const { data: tournament } = await supabase
    .from('Tournament')
    .select('status')
    .eq('id', tournamentId)
    .single();

  if (!tournament || tournament.status !== 'active') {
    return NextResponse.json({ success: false, message: 'Not active' }, { status: 400 });
  }

  // 2. Check not already joined
  const { data: already } = await supabase
    .from('TournamentPlayer')
    .select('id')
    .eq('tournament_id', tournamentId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (already) {
    return NextResponse.json({ success: false, message: 'Already joined' }, { status: 400 });
  }

  // 3. Join
  const { error } = await supabase
    .from('TournamentPlayer')
    .insert({ tournament_id: tournamentId, user_id: user.id });

  if (error) {
    return NextResponse.json({ success: false, message: 'Failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}