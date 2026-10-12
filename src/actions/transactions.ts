'use server';

import { createClient } from '@/lib/supabase/server';
import { TransactionWithDetails } from '@/lib/types/database';
import { transactionSchema, TransactionInput } from '@/lib/validations/transaction';
import { revalidatePath } from 'next/cache';

export async function getTransactions(filters?: {
  type?: string;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
}): Promise<TransactionWithDetails[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  if (filters?.categoryId && filters.categoryId !== 'all') {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.accountId && filters.accountId !== 'all') {
    query = query.eq('account_id', filters.accountId);
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }

  if (filters?.search && filters.search.trim() !== '') {
    query = query.ilike('description', `%${filters.search.trim()}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return (data || []).map((item) => ({
    ...item,
    amount: Number(item.amount),
  })) as TransactionWithDetails[];
}

export async function createTransaction(input: TransactionInput) {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Dados inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      account_id: parsed.data.account_id,
      category_id: parsed.data.category_id || null,
      amount: parsed.data.amount,
      type: parsed.data.type,
      description: parsed.data.description,
      date: parsed.data.date,
      status: parsed.data.status,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/budgets');
  revalidatePath('/accounts');

  return { success: true, transaction: data };
}

export async function updateTransaction(
  id: string,
  input: Partial<TransactionInput>
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { error } = await supabase
    .from('transactions')
    .update({
      ...input,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/budgets');
  revalidatePath('/accounts');

  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  revalidatePath('/budgets');
  revalidatePath('/accounts');

  return { success: true };
}
