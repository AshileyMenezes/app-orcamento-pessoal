import { z } from 'zod';

export const transactionSchema = z.object({
  description: z.string().min(2, 'Descrição é obrigatória (mínimo 2 caracteres)'),
  amount: z.number().positive('O valor deve ser maior que zero'),
  type: z.enum(['income', 'expense', 'transfer'] as const, {
    message: 'Selecione um tipo válido de transação',
  }),
  category_id: z.string().uuid('Selecione uma categoria válida').optional().nullable(),
  account_id: z.string().uuid('Selecione uma conta bancária/carteira'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato AAAA-MM-DD)'),
  status: z.enum(['completed', 'pending'] as const).default('completed'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
