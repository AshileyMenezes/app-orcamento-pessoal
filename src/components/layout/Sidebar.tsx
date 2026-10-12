'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Landmark,
  WalletCards,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/actions/auth';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
}

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/transactions',
    label: 'Transações',
    icon: ArrowLeftRight,
  },
  {
    href: '/budgets',
    label: 'Orçamentos',
    icon: Target,
  },
  {
    href: '/accounts',
    label: 'Contas & Carteiras',
    icon: Landmark,
  },
];

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const { isExpanded, toggleExpanded, isMobileOpen, closeMobile } = useSidebar();
  const { theme, setTheme, toggleTheme } = useTheme();

  const displayName = userName || userEmail?.split('@')[0] || 'Usuário';

  const NavContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand & Collapse Button Header */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-slate-100 dark:border-slate-800/80 px-4 transition-all duration-300',
          isExpanded ? 'justify-between' : 'justify-center'
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group overflow-hidden"
          onClick={closeMobile}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 shrink-0 transition-transform group-hover:scale-105">
            <WalletCards className="w-5 h-5" />
          </div>
          {isExpanded && (
            <div className="flex flex-col leading-none transition-opacity duration-200">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Finan<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase mt-0.5">
                Finanças Pessoais
              </span>
            </div>
          )}
        </Link>

        {/* Botão de Orientação para Recolher/Expandir o Menu (Desktop) */}
        <button
          onClick={toggleExpanded}
          type="button"
          aria-label={isExpanded ? 'Recolher menu principal' : 'Expandir menu principal'}
          className={cn(
            'hidden md:flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all',
            !isExpanded && 'hidden'
          )}
          title="Recolher menu principal"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Botão Fechar no Mobile */}
        <button
          onClick={closeMobile}
          type="button"
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Botão de Expandir quando a sidebar desktop estiver recolhida */}
      {!isExpanded && (
        <div className="hidden md:flex justify-center py-3 border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={toggleExpanded}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title="Expandir menu principal"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Menu Principal de Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {isExpanded && (
          <p className="px-3 pb-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Menu Principal
          </p>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-all group relative',
                isExpanded ? 'px-3.5 py-2.5' : 'p-3 justify-center',
                isActive
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              {isActive && (
                <span
                  className={cn(
                    'absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-600 dark:bg-emerald-400',
                    !isExpanded && 'left-1'
                  )}
                />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 transition-colors shrink-0',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />
              {isExpanded && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Alternador de Tema Rápido (Claro / Escuro) */}
      <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80">
        {isExpanded ? (
          <div className="flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Claro</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Escuro</span>
            </button>
          </div>
        ) : (
          <button
            onClick={toggleTheme}
            type="button"
            title={theme === 'dark' ? 'Tema: Escuro (Mudar para Claro)' : 'Tema: Claro (Mudar para Escuro)'}
            className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        )}
      </div>

      {/* Canto Inferior da Tela: Nome, Email e Ícone de Sair da Conta */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        {isExpanded ? (
          <div className="flex items-center justify-between gap-2.5 p-2 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                  {userEmail || 'Sessão ativa'}
                </p>
              </div>
            </div>

            {/* Ícone de Sair ao Lado */}
            <form action={logoutAction} className="shrink-0">
              <button
                type="submit"
                title="Sair da conta"
                aria-label="Sair da conta"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs cursor-default"
              title={`${displayName} (${userEmail})`}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Sair da conta"
                aria-label="Sair da conta"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop (Fixa com largura dinâmica) */}
      <aside
        className={cn(
          'hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out z-20',
          isExpanded ? 'w-64' : 'w-20'
        )}
      >
        {NavContent}
      </aside>

      {/* Drawer Retrátil Mobile / Tablet */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in"
            onClick={closeMobile}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {NavContent}
          </div>
        </div>
      )}
    </>
  );
}
