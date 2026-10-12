import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
} from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  savingsRate: number;
}

export function SummaryCards({
  totalBalance,
  totalIncomeMonth,
  totalExpenseMonth,
  savingsRate,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Saldo Geral Atual',
      value: formatCurrency(totalBalance),
      icon: Wallet,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      description: 'Soma de todas as suas contas',
    },
    {
      title: 'Receitas no Mês',
      value: formatCurrency(totalIncomeMonth),
      icon: ArrowUpRight,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      description: 'Total de entradas no período',
    },
    {
      title: 'Despesas no Mês',
      value: formatCurrency(totalExpenseMonth),
      icon: ArrowDownRight,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      description: 'Total de saídas no período',
    },
    {
      title: 'Taxa de Poupança',
      value: formatPercentage(savingsRate),
      icon: PiggyBank,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      description: 'Economia líquida gerada',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {c.title}
                </span>
                <div className={`p-2.5 rounded-xl ${c.bgColor} ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {c.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
