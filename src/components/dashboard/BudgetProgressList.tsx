import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { BudgetWithCategory } from '@/lib/types/database';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface BudgetProgressListProps {
  budgets: BudgetWithCategory[];
}

export function BudgetProgressList({ budgets }: BudgetProgressListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Limites do Mês</CardTitle>
        <Link
          href="/budgets"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
        >
          Gerenciar
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhum teto de gastos definido para este mês.{' '}
            <Link href="/budgets" className="text-emerald-600 hover:underline">
              Definir agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((b) => {
              const isOverBudget = b.spent_amount > b.amount_limit;
              const isNearLimit = b.percentage_used >= 80 && !isOverBudget;

              let barColor = 'bg-emerald-500';
              if (isNearLimit) barColor = 'bg-amber-500';
              if (isOverBudget) barColor = 'bg-rose-500';

              return (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {b.category?.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isOverBudget && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500">
                          <AlertTriangle className="w-3 h-3" />
                          Estourado
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {formatCurrency(b.spent_amount)} / {formatCurrency(b.amount_limit)}
                      </span>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{
                        width: `${Math.min(100, b.percentage_used)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
