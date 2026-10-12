import React from 'react';
import { WalletCards } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2.5 mb-2 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <WalletCards className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Finan<span className="text-emerald-600">Flow</span>
            </span>
          </Link>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Controle financeiro inteligente e orçamento pessoal
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {children}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Dados protegidos com criptografia e isolamento por usuário (RLS).
        </p>
      </div>
    </div>
  );
}
