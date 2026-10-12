'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/types/database';
import { createOrUpdateBudget } from '@/actions/budgets';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentMonth: number;
  currentYear: number;
}

export function BudgetModal({
  isOpen,
  onClose,
  categories,
  currentMonth,
  currentYear,
}: BudgetModalProps) {
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apenas categorias de despesa podem ter orçamento
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numLimit = parseFloat(limit.replace(',', '.'));
    if (isNaN(numLimit) || numLimit <= 0) {
      setError('Insira um valor limite válido.');
      return;
    }

    if (!categoryId) {
      setError('Selecione uma categoria.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await createOrUpdateBudget({
        category_id: categoryId,
        amount_limit: numLimit,
        month: currentMonth,
        year: currentYear,
      });

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Definir Orçamento de Categoria"
      description="Estipule um valor máximo de despesa para o mês selecionado"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Categoria de Despesa
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            required
          >
            <option value="" disabled>Selecione a categoria</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Limite Mensal (R$)"
            placeholder="Ex: 800,00"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Salvar Teto
          </Button>
        </div>
      </form>
    </Modal>
  );
}
