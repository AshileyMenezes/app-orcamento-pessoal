'use server';

import { createClient } from '@/lib/supabase/server';
import { Category } from '@/lib/types/database';
import { revalidatePath } from 'next/cache';

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) {
    return [];
  }

  return data as Category[];
}

export async function createCategory(input: {
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: user.id,
      name: input.name,
      type: input.type,
      icon: input.icon || 'tag',
      color: input.color || '#6366f1',
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath('/transactions');
  revalidatePath('/budgets');
  return { success: true, category: data };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Não autorizado' };

  // Regra 3 (Source-Level Security): Verificar transações ativas vinculadas
  const { count, error: countError } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (countError) return { error: countError.message };

  if (count && count > 0) {
    return { error: 'Não é possível excluir uma categoria vinculada a transações ativas.' };
  }

  // Regra 1 (Salvaguarda Não-Destrutiva): Soft Delete com deleted_at
  const { error } = await supabase
    .from('categories')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('deleted_at', null);

  if (error) return { error: error.message };

  revalidatePath('/transactions');
  revalidatePath('/budgets');
  return { success: true };
}
