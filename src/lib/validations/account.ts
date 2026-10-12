import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(2, 'O nome da conta é obrigatório'),
  type: z.enum(['checking', 'savings', 'wallet', 'investment'] as const),
  initial_balance: z.number().default(0),
  color: z.string().default('#0ea5e9'),
});

export type AccountInput = z.infer<typeof accountSchema>;
