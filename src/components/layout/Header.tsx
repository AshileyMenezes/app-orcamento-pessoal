'use client';

import React from 'react';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { useSidebar } from '@/components/providers/SidebarProvider';
import { useTheme } from '@/components/providers/ThemeProvider';

interface HeaderProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function Header({ userName, userEmail }: HeaderProps) {
  const { openMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  const displayName = userName || userEmail?.split('@')[0] || 'Usuário';

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Botão Hamburger para Mobile/Tablet */}
        <button
          onClick={openMobile}
          type="button"
          aria-label="Abrir menu de navegação"
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span>Olá, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{displayName}</span></span>
            <span className="inline-block animate-bounce text-xs">👋</span>
          </h1>
          <p className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-400">
            Painel financeiro inteligente & controle em tempo real
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Alternador de Tema no Header (Claro / Escuro) */}
        <button
          onClick={toggleTheme}
          type="button"
          title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          aria-label="Alternar entre modo claro e escuro"
          className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500 animate-in spin-in-180 duration-300" />
              <span className="text-xs font-medium hidden md:inline">Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600 animate-in spin-in-180 duration-300" />
              <span className="text-xs font-medium hidden md:inline">Escuro</span>
            </>
          )}
        </button>

        {/* Badge de Status / Perfil Rápido */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/30">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
