import React from 'react';
import { getTransactions } from '@/actions/transactions';
import { getCategories } from '@/actions/categories';
import { getAccounts } from '@/actions/accounts';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { DashboardHeaderAction } from '@/components/dashboard/DashboardHeaderAction';

export const dynamic = 'force-dynamic';

interface TransactionsPageProps {
  searchParams: Promise<{
    type?: string;
    categoryId?: string;
    accountId?: string;
    search?: string;
  }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const resolvedParams = await searchParams;

  const [transactions, categories, accounts] = await Promise.all([
    getTransactions({
      type: resolvedParams.type,
      categoryId: resolvedParams.categoryId,
      accountId: resolvedParams.accountId,
      search: resolvedParams.search,
    }),
    getCategories(),
    getAccounts(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Transações
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Histórico completo de entradas, saídas e transferências
          </p>
        </div>

        <DashboardHeaderAction
          categories={categories}
          accounts={accounts}
        />
      </div>

      {/* Filtros */}
      <TransactionFilters
        categories={categories}
        accounts={accounts}
      />

      {/* Tabela de Transações */}
      <TransactionTable
        transactions={transactions}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
