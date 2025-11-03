// src/app/tournaments/detail/page.tsx
import { prisma } from '@/lib/prisma';
import TournamentActions from '@/components/TournamentActions';
import TournamentRealtime from '@/components/TournamentRealtime';

export const revalidate = 0;

export default async function TournamentPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  if (!id) return <p className="p-8">No tournament ID</p>;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      admin: { select: { email: true } },
      players: {
        include: { player: { select: { id: true } } },
      },
    },
  });

  if (!tournament) return <p className="p-8">Tournament not found</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
      <p className="text-lg">Rounds: <strong>{tournament.rounds}</strong></p>
      <p className="text-lg">Status: <strong>{tournament.status}</strong></p>
      <p className="text-lg">Admin: <strong>{tournament.admin.email}</strong></p>

      <h2 className="text-xl font-semibold mt-8 mb-4">
        Players ({tournament.players.length})
      </h2>
      <TournamentRealtime 
  initialPlayers={tournament.players} 
  tournamentId={id} 
/>
      

      <TournamentActions
        tournament={tournament}
        isAdmin={false}
      />
    </div>
  );
}