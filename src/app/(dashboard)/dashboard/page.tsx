import React from 'react';
import { getDashboardMetrics } from '@/actions/dashboard';
import { getBudgetsWithSpent } from '@/actions/budgets';
import { getCategories } from '@/actions/categories';
import { getAccounts } from '@/actions/accounts';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { EvolutionChart } from '@/components/dashboard/EvolutionChart';
import { ExpensesPieChart } from '@/components/dashboard/ExpensesPieChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { BudgetProgressList } from '@/components/dashboard/BudgetProgressList';
import { DashboardHeaderAction } from '@/components/dashboard/DashboardHeaderAction';
import { MONTH_NAMES } from '@/lib/utils/formatters';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const now = new Date();
  const currentMonthName = MONTH_NAMES[now.getMonth()];
  const currentYear = now.getFullYear();

  // Buscar dados em paralelo para performance ótima no servidor
  const [metrics, budgets, categories, accounts] = await Promise.all([
    getDashboardMetrics(),
    getBudgetsWithSpent(now.getMonth() + 1, currentYear),
    getCategories(),
    getAccounts(),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resumo analítico de {currentMonthName} de {currentYear}
          </p>
        </div>

        <DashboardHeaderAction
          categories={categories}
          accounts={accounts}
        />
      </div>

      {/* Cards de Resumo */}
      <SummaryCards
        totalBalance={metrics.totalBalance}
        totalIncomeMonth={metrics.totalIncomeMonth}
        totalExpenseMonth={metrics.totalExpenseMonth}
        savingsRate={metrics.savingsRate}
      />

      {/* Seção de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EvolutionChart data={metrics.monthlyEvolution} />
        <ExpensesPieChart data={metrics.expensesByCategory} />
      </div>

      {/* Seção Inferior: Últimas Transações e Limites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions transactions={metrics.recentTransactions} />
        <BudgetProgressList budgets={budgets} />
      </div>
    </div>
  );
}
