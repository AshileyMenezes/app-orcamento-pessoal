'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAction } from '@/actions/auth';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Acessar conta
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Informe seu e-mail e senha para gerenciar suas finanças
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Entrar no FinanFlow
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Não tem uma conta?{' '}
        <Link
          href="/register"
          className="font-semibold text-emerald-600 hover:text-emerald-500 hover:underline"
        >
          Criar conta gratuitamente
        </Link>
      </div>
    </div>
  );
}
