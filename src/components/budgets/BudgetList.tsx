'use client';

import React, { useState } from 'react';
import { BudgetWithCategory } from '@/lib/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { deleteBudget } from '@/actions/budgets';
import { Trash2, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

interface BudgetListProps {
  budgets: BudgetWithCategory[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este orçamento?')) return;
    setDeletingId(id);
    try {
      await deleteBudget(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (budgets.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Nenhum orçamento definido para este mês
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Clique no botão acima para estipular metas de teto para suas categorias de gastos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((b) => {
        const isOver = b.spent_amount > b.amount_limit;
        const isNear = b.percentage_used >= 80 && !isOver;

        let statusColor = 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200';
        let barColor = 'bg-emerald-500';

        if (isNear) {
          statusColor = 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200';
          barColor = 'bg-amber-500';
        }
        if (isOver) {
          statusColor = 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200';
          barColor = 'bg-rose-500';
        }

        const remaining = b.amount_limit - b.spent_amount;

        return (
          <Card key={b.id} className="relative overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: b.category?.color || '#6366f1' }}
                  />
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {b.category?.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(b.id)}
                  disabled={deletingId === b.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                  title="Excluir orçamento"
                >
                  {deletingId === b.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Valores */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {formatCurrency(b.spent_amount)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium ml-1.5">
                    de {formatCurrency(b.amount_limit)}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {formatPercentage(b.percentage_used)}
                </span>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${Math.min(100, b.percentage_used)}%` }}
                />
              </div>

              {/* Status footer */}
              <div className="pt-2 flex items-center justify-between text-xs">
                {isOver ? (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Estourou em {formatCurrency(Math.abs(remaining))}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Disponível: {formatCurrency(remaining)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
