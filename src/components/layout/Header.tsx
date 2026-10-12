'use client';

import React from 'react';
import { User, Bell } from 'lucide-react';

interface HeaderProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function Header({ userName, userEmail }: HeaderProps) {
  const displayName = userName || userEmail?.split('@')[0] || 'Usuário';

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Olá, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{displayName}</span> 👋
        </h1>
        <p className="text-[11px] text-slate-400">
          Bem-vindo ao seu painel de controle financeiro
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
