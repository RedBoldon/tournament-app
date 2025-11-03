import { prisma } from '@/lib/prisma';
import { useAuth } from '@/components/AuthProvider';
import { redirect } from 'next/navigation';

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  const { user } = useAuth();

  if (!user) {
    redirect(`/auth/login?redirect=/tournaments/detail/join?id=${id}`);
  }

  const existing = await prisma.tournamentPlayer.findUnique({
    where: {
      tournamentId_playerId: {
        tournamentId: id,
        playerId: user.id,
      },
    },
  });

  if (existing) {
    return <p className="p-8">You are already in this tournament!</p>;
  }

  await prisma.tournamentPlayer.create({
    data: {
      tournamentId: id,
      playerId: user.id,
    },
  });

  redirect(`/tournaments/detail?id=${id}`);
}