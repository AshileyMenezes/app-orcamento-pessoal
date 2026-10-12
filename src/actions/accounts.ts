'use server';

import { createClient } from '@/lib/supabase/server';
import { Account } from '@/lib/types/database';
import { accountSchema } from '@/lib/validations/account';
import { calculateAccountBalance, roundCurrency } from '@/lib/utils/finance';
import { revalidatePath } from 'next/cache';

export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: true });

  if (accountsError) {
    if (accountsError.code === '401' || accountsError.code === '403') return [];
    return [];
  }

  if (!accounts) return [];

  // Buscar transações para computar o saldo atual com precisão decimal
  const { data: transactions } = await supabase
    .from('transactions')
    .select('account_id, amount, type, status')
    .eq('status', 'completed');

  const accountsWithBalance: Account[] = accounts.map((account) => {
    const accountTx = (transactions || []).filter(
      (tx) => tx.account_id === account.id
    );

    const initial = roundCurrency(account.initial_balance);
    const current = calculateAccountBalance(initial, accountTx);

    return {
      ...account,
      initial_balance: initial,
      current_balance: current,
    };
  });

  return accountsWithBalance;
}

export async function createAccount(input: {
  name: string;
  type: 'checking' | 'savings' | 'wallet' | 'investment';
  initial_balance: number;
  color?: string;
}) {
  const parsed = accountSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Dados inválidos' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      type: parsed.data.type,
      initial_balance: parsed.data.initial_balance,
      color: parsed.data.color || '#0ea5e9',
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/dashboard');
  revalidatePath('/accounts');
  revalidatePath('/transactions');
  return { success: true, account: data };
}

export async function deleteAccount(accountId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId)
    .eq('user_id', user.id);

  if (error) {
    if (error.code === '23503') {
      return { error: 'Não é possível excluir uma conta que possui transações vinculadas.' };
    }
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/accounts');
  revalidatePath('/transactions');
  return { success: true };
}
