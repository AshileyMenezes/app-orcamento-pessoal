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
