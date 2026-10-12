'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Account } from '@/lib/types/database';
import { Search, X } from 'lucide-react';

interface TransactionFiltersProps {
  categories: Category[];
  accounts: Account[];
}

export function TransactionFilters({
  categories,
  accounts,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || 'all';
  const currentCategory = searchParams.get('categoryId') || 'all';
  const currentAccount = searchParams.get('accountId') || 'all';

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`/transactions?${params.toString()}`);
    });
  }

  function handleReset() {
    startTransition(() => {
      router.push('/transactions');
    });
  }

  const hasFilters =
    Boolean(currentSearch) ||
    currentType !== 'all' ||
    currentCategory !== 'all' ||
    currentAccount !== 'all';

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      {/* Busca textual */}
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar pela descrição..."
          defaultValue={currentSearch}
          onChange={(e) => updateQuery('search', e.target.value)}
          className="h-10 w-full pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Tipo */}
      <select
        value={currentType}
        onChange={(e) => updateQuery('type', e.target.value)}
        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Todos os tipos</option>
        <option value="income">Receitas (+)</option>
        <option value="expense">Despesas (-)</option>
        <option value="transfer">Transferências</option>
      </select>

      {/* Categoria */}
      <select
        value={currentCategory}
        onChange={(e) => updateQuery('categoryId', e.target.value)}
        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Conta */}
      <select
        value={currentAccount}
        onChange={(e) => updateQuery('accountId', e.target.value)}
        className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="all">Todas as contas</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* Limpar Filtros */}
      {hasFilters && (
        <button
          onClick={handleReset}
          className="flex items-center gap-1 h-10 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Limpar
        </button>
      )}
    </div>
  );
}
