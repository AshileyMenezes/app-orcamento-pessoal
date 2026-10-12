'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, Account, TransactionWithDetails } from '@/lib/types/database';
import { createTransaction, updateTransaction } from '@/actions/transactions';
import { ArrowUpRight, ArrowDownRight, ArrowLeftRight } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  accounts: Account[];
  transactionToEdit?: TransactionWithDetails | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  categories,
  accounts,
  transactionToEdit,
}: TransactionModalProps) {
  const isEditing = Boolean(transactionToEdit);
  const [type, setType] = useState<'income' | 'expense' | 'transfer'>(
    transactionToEdit?.type || 'expense'
  );
  const [description, setDescription] = useState(transactionToEdit?.description || '');
  const [amount, setAmount] = useState<string>(
    transactionToEdit ? String(transactionToEdit.amount) : ''
  );
  const [accountId, setAccountId] = useState(
    transactionToEdit?.account_id || accounts[0]?.id || ''
  );
  const [categoryId, setCategoryId] = useState(
    transactionToEdit?.category_id || ''
  );
  const [date, setDate] = useState(
    transactionToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtrar categorias pelo tipo selecionado
  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Insira um valor válido maior que zero.');
      return;
    }

    if (!accountId) {
      setError('Selecione uma conta ou carteira.');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && transactionToEdit) {
        const res = await updateTransaction(transactionToEdit.id, {
          description,
          amount: numAmount,
          type,
          account_id: accountId,
          category_id: categoryId || null,
          date,
        });

        if (res.error) {
          setError(res.error);
          setIsLoading(false);
          return;
        }
      } else {
        const res = await createTransaction({
          description,
          amount: numAmount,
          type,
          account_id: accountId,
          category_id: categoryId || null,
          date,
          status: 'completed',
        });

        if (res.error) {
          setError(res.error);
          setIsLoading(false);
          return;
        }
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao salvar transação');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Transação' : 'Nova Movimentação'}
      description="Preencha os detalhes para atualizar suas finanças"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
            {error}
          </div>
        )}

        {/* Seletor de Tipo */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              type === 'expense'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              type === 'income'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Receita
          </button>
          <button
            type="button"
            onClick={() => setType('transfer')}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              type === 'transfer'
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transf.
          </button>
        </div>

        {/* Valor */}
        <div>
          <Input
            label="Valor (R$)"
            type="text"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Descrição */}
        <div>
          <Input
            label="Descrição"
            placeholder="Ex: Compras no Supermercado"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Conta e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Conta / Carteira
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              required
            >
              <option value="" disabled>Selecione uma conta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Categoria
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="">Sem Categoria</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data */}
        <div>
          <Input
            label="Data da Operação"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar Transação'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
