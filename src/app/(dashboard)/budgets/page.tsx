import React from 'react';
import { getBudgetsWithSpent } from '@/actions/budgets';
import { getCategories } from '@/actions/categories';
import { BudgetList } from '@/components/budgets/BudgetList';
import { BudgetHeaderAction } from '@/components/budgets/BudgetHeaderAction';
import { MONTH_NAMES } from '@/lib/utils/formatters';

export const dynamic = 'force-dynamic';

export default async function BudgetsPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [budgets, categories] = await Promise.all([
    getBudgetsWithSpent(currentMonth, currentYear),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Orçamentos & Metas
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Planejamento de gastos para {MONTH_NAMES[currentMonth - 1]} de {currentYear}
          </p>
        </div>

        <BudgetHeaderAction
          categories={categories}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>

      {/* Lista de Orçamentos */}
      <BudgetList budgets={budgets} />
    </div>
  );
}
