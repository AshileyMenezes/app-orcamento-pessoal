'use client';

import React, { useState } from 'react';
import { TransactionWithDetails, Category, Account } from '@/lib/types/database';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { deleteTransaction } from '@/actions/transactions';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  Trash2,
  Pencil,
  Loader2,
} from 'lucide-react';

interface TransactionTableProps {
  transactions: TransactionWithDetails[];
  categories: Category[];
  accounts: Account[];
}

export function TransactionTable({
  transactions,
  categories,
  accounts,
}: TransactionTableProps) {
  const [editingTx, setEditingTx] = useState<TransactionWithDetails | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir esta transação?')) return;
    setDeletingId(id);
    try {
      await deleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Nenhuma transação encontrada
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Tente ajustar os filtros ou clique em &quot;Nova Movimentação&quot; para registrar uma operação.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4">Descrição</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Conta / Carteira</th>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4 text-right">Valor</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Tipo */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isIncome && (
                      <Badge variant="income">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Receita
                      </Badge>
                    )}
                    {!isIncome && !isTransfer && (
                      <Badge variant="expense">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        Despesa
                      </Badge>
                    )}
                    {isTransfer && (
                      <Badge variant="transfer">
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        Transf.
                      </Badge>
                    )}
                  </td>

                  {/* Descrição */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                    {tx.description}
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    {tx.category ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: tx.category.color }}
                        />
                        {tx.category.name}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Conta */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    {tx.account?.name || 'Conta Padrão'}
                  </td>

                  {/* Data */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500">
                    {formatDate(tx.date)}
                  </td>

                  {/* Valor */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold">
                    <span
                      className={
                        isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingTx(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deletingId === tx.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                        title="Excluir"
                      >
                        {deletingId === tx.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingTx && (
        <TransactionModal
          isOpen={Boolean(editingTx)}
          onClose={() => setEditingTx(null)}
          categories={categories}
          accounts={accounts}
          transactionToEdit={editingTx}
        />
      )}
    </>
  );
}
