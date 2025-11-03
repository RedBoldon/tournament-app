// src/app/tournament/detail/page.tsx
import { prisma } from '@/lib/prisma';
import TournamentActions from '@/components/TournamentActions';

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

  const players = tournament.players || [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{tournament.name}</h1>
      <p className="text-lg">Rounds: <strong>{tournament.rounds}</strong></p>
      <p className="text-lg">Status: <strong>{tournament.status}</strong></p>
      <p className="text-lg">Admin: <strong>{tournament.admin.email}</strong></p>

      <h2 className="text-xl font-semibold mt-8 mb-4">
        Players ({players.length})
      </h2>
      <ul className="space-y-2">
        {players.map((tp: any) => (
          <li key={tp.playerId} className="border p-3 rounded bg-gray-50">
            Player ID: {tp.playerId}
          </li>
        ))}
      </ul>

      <TournamentActions
        tournament={tournament}
        isAdmin={false}
      />
    </div>
  );
}