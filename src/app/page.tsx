import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { WalletCards, ArrowRight, ShieldCheck, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20 flex flex-col">
      {/* Navbar */}
      <header className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <WalletCards className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Finan<span className="text-emerald-600">Flow</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 flex flex-col items-center justify-center text-center py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gestão financeira simplificada com Next.js & Supabase</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-3xl leading-[1.1]">
          Controle suas finanças sem complicação, com{' '}
          <span className="text-emerald-600 bg-clip-text">precisão total.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Registre entradas e despesas, estipule metas de teto por categoria,
          acompanhe a evolução do seu patrimônio e garanta privacidade total com
          segurança em nível de banco de dados (RLS).
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/register">
            <Button size="lg" className="gap-2 px-8 shadow-xl shadow-emerald-600/25">
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="px-8">
              Já possuo uma conta
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Saldos em Tempo Real
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Cálculo contínuo baseado nas transações e contas bancárias, eliminando qualquer discrepância.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <PieChart className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Tetos & Orçamentos
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Defina limites mensais por categoria e receba alertas visuais antes de estourar o orçamento.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Isolamento RLS Supabase
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Row Level Security habilitado em cada tabela do PostgreSQL. Seus dados são 100% privados.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400">
        FinanFlow © 2026 • Gestor de Orçamento Pessoal com Next.js & Supabase
      </footer>
    </div>
  );
}
