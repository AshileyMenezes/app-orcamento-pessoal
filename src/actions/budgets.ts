'use server';

import { createClient } from '@/lib/supabase/server';
import { BudgetWithCategory } from '@/lib/types/database';
import { budgetSchema, BudgetInput } from '@/lib/validations/budget';
import { revalidatePath } from 'next/cache';

export async function getBudgetsWithSpent(month?: number, year?: number): Promise<BudgetWithCategory[]> {
  const currentMonth = month || new Date().getMonth() + 1;
  const currentYear = year || new Date().getFullYear();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  // Buscar orçamentos do mês/ano com a categoria relacionada
  const { data: budgets, error: budgetError } = await supabase
    .from('budgets')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('month', currentMonth)
    .eq('year', currentYear);

  if (budgetError || !budgets) {
    console.error('Error fetching budgets:', budgetError);
    return [];
  }

  // Buscar transações de despesa do mês para calcular o gasto real por categoria
  const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const endDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data: expenses } = await supabase
    .from('transactions')
    .select('category_id, amount')
    .eq('type', 'expense')
    .eq('status', 'completed')
    .gte('date', startDate)
    .lte('date', endDate);

  const spentByCategory = (expenses || []).reduce<Record<string, number>>((acc, tx) => {
    if (tx.category_id) {
      acc[tx.category_id] = (acc[tx.category_id] || 0) + Number(tx.amount);
    }
    return acc;
  }, {});

  return budgets.map((b) => {
    const limit = Number(b.amount_limit);
    const spent = spentByCategory[b.category_id] || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      ...b,
      amount_limit: limit,
      spent_amount: spent,
      percentage_used: percentage,
      category: b.category,
    };
  });
}

export async function createOrUpdateBudget(input: BudgetInput) {
  const parsed = budgetSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Dados inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { error } = await supabase
    .from('budgets')
    .upsert(
      {
        user_id: user.id,
        category_id: parsed.data.category_id,
        month: parsed.data.month,
        year: parsed.data.year,
        amount_limit: parsed.data.amount_limit,
      },
      { onConflict: 'user_id, category_id, month, year' }
    );

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/budgets');
  return { success: true };
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/budgets');
  return { success: true };
}
