import { z } from 'zod';

export const transactionSchema = z
  .object({
    description: z.string().min(2, 'Descrição é obrigatória (mínimo 2 caracteres)'),
    amount: z.number().positive('O valor deve ser maior que zero'),
    type: z.enum(['income', 'expense', 'transfer'] as const, {
      message: 'Selecione um tipo válido de transação',
    }),
    category_id: z.string().uuid('Selecione uma categoria válida').optional().nullable(),
    account_id: z.string().uuid('Selecione uma conta bancária/carteira'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato AAAA-MM-DD)'),
    status: z.enum(['completed', 'pending'] as const).default('completed'),
  })
  .refine(
    (data) => {
      // Rejeita qualquer entrada inconsistente com o domínio financeiro
      if (data.type === 'income' && data.amount <= 0) return false;
      if (data.type === 'expense' && data.amount <= 0) return false;
      return true;
    },
    {
      message: 'Valores financeiros devem ser estritamente positivos.',
      path: ['amount'],
    }
  );

export type TransactionInput = z.infer<typeof transactionSchema>;
