'use client';

import React, { useState } from 'react';
import { Account } from '@/lib/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/formatters';
import { deleteAccount } from '@/actions/accounts';
import { Landmark, Wallet, PiggyBank, TrendingUp, Trash2, Loader2 } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente remover esta conta? (Não é possível se houver transações vinculadas)')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await deleteAccount(id);
      if (res.error) {
        alert(res.error);
      }
    } finally {
      setDeletingId(null);
    }
  }

  const typeConfig: Record<string, { label: string; icon: any }> = {
    checking: { label: 'Conta Corrente', icon: Landmark },
    savings: { label: 'Poupança', icon: PiggyBank },
    wallet: { label: 'Carteira Física', icon: Wallet },
    investment: { label: 'Investimentos', icon: TrendingUp },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((acc) => {
        const config = typeConfig[acc.type] || typeConfig.checking;
        const Icon = config.icon;

        return (
          <Card key={acc.id} className="relative overflow-hidden group">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: acc.color || '#0ea5e9' }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {acc.name}
                    </h3>
                    <p className="text-xs text-slate-400">{config.label}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(acc.id)}
                  disabled={deletingId === acc.id}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                  title="Excluir conta"
                >
                  {deletingId === acc.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">Saldo Atual Estimado</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  {formatCurrency(acc.current_balance ?? acc.initial_balance)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Saldo inicial: {formatCurrency(acc.initial_balance)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
