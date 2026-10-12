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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/actions/auth';

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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <WalletCards className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Finan<span className="text-emerald-600">Flow</span>
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400">
          Menu Principal
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
