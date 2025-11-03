// src/lib/validation.ts
import { z } from 'zod';

/**
 * Schema for creating a new tournament
 */
export const CreateTournamentSchema = z.object({
  name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name too long" })
    .trim(),
  rounds: z.coerce.number()
    .int()
    .min(1, { message: "At least 1 round" })
    .max(10, { message: "Max 10 rounds" }),
});

/**
 * Inferred TypeScript type
 */
export type CreateTournamentInput = z.infer<typeof CreateTournamentSchema>;