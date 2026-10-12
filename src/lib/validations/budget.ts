import { z } from 'zod';

export const budgetSchema = z.object({
  category_id: z.string().uuid('Selecione uma categoria válida'),
  amount_limit: z.number().positive('O limite deve ser maior que zero'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
