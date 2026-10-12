'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAccount } from '@/actions/accounts';
import { parseCurrency } from '@/lib/utils/formatters';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'checking' | 'savings' | 'wallet' | 'investment'>('checking');
  const [initialBalance, setInitialBalance] = useState('');
  const [color, setColor] = useState('#0ea5e9');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numBalance = initialBalance ? parseCurrency(initialBalance) : 0;
    if (isNaN(numBalance)) {
      setError('Insira um saldo inicial válido');
      return;
    }

    setIsLoading(true);

    try {
      const res = await createAccount({
        name,
        type,
        initial_balance: numBalance,
        color,
      });

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Conta ou Carteira"
      description="Cadastre seus bancos, carteiras físicas ou aplicações"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <Input
            label="Nome da Conta"
            placeholder="Ex: Nubank, Banco do Brasil, Carteira"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Tipo de Conta
          </label>
          <select
            value={type}
            onChange={(e: any) => setType(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="checking">Conta Corrente</option>
            <option value="savings">Poupança</option>
            <option value="wallet">Carteira Física / Dinheiro</option>
            <option value="investment">Investimentos / Corretora</option>
          </select>
        </div>

        <div>
          <Input
            label="Saldo Inicial (R$)"
            placeholder="0,00"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            onBlur={() => {
              if (initialBalance) {
                const parsed = parseCurrency(initialBalance);
                setInitialBalance(
                  parsed.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                );
              }
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Criar Conta
          </Button>
        </div>
      </form>
    </Modal>
  );
}
