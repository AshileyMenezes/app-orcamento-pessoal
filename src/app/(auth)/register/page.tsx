'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/actions/auth';
import { AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Crie sua conta
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comece a organizar suas receitas, gastos e metas hoje
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="fullName"
            type="text"
            label="Nome Completo"
            placeholder="Ex: Carlos Silva"
            required
            autoComplete="name"
          />
        </div>

        <div>
          <Input
            name="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <Input
            name="password"
            type="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            required
            autoComplete="new-password"
          />
        </div>

        <div>
          <Input
            name="confirmPassword"
            type="password"
            label="Confirmar Senha"
            placeholder="Repita a senha"
            required
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Cadastrar e Começar
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Já possui uma conta?{' '}
        <Link
          href="/login"
          className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline"
        >
          Faça login
        </Link>
      </div>
    </div>
  );
}
