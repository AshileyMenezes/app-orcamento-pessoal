import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { TransactionWithDetails } from '@/lib/types/database';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: TransactionWithDetails[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Últimas Movimentações</CardTitle>
        <Link
          href="/transactions"
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
        >
          Ver todas
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Nenhuma transação cadastrada ainda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{tx.category?.name || 'Geral'}</span>
                        <span>•</span>
                        <span>{tx.account?.name || 'Conta Principal'}</span>
                        <span>•</span>
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold ${
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
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
