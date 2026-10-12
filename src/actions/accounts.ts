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
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (accountsError) {
    if (accountsError.code === '401' || accountsError.code === '403') return [];
    return [];
  }

  if (!accounts) return [];

  // Buscar transações ativas para computar o saldo atual com precisão decimal (Regras 1 & 3)
  const { data: transactions } = await supabase
    .from('transactions')
    .select('account_id, amount, type, status')
    .eq('user_id', user.id)
    .is('deleted_at', null)
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

  // Regra 3 (Source-Level Security): Verificar transações ativas vinculadas
  const { count, error: countError } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (countError) return { error: countError.message };

  if (count && count > 0) {
    return { error: 'Não é possível excluir uma conta que possui transações ativas vinculadas.' };
  }

  // Regra 1 (Salvaguarda Não-Destrutiva): Soft Delete com deleted_at
  const { error } = await supabase
    .from('accounts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', accountId)
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/accounts');
  revalidatePath('/transactions');
  return { success: true };
}
