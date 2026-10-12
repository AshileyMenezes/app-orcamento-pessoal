'use client';

import React, { useEffect } from 'react';
import { X, PanelRightClose } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Drawer Lateral (Lateral Modal)
 * Permite ao usuário abrir o formulário em uma gaveta lateral deslizante pela direita,
 * mantendo a visualização e contexto das informações já realizadas anteriormente na tela.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop semi-transparente que permite visualizar os dados do painel ao fundo */}
      <div
        className="fixed inset-0 bg-slate-900/35 dark:bg-slate-950/60 backdrop-blur-[1.5px] transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        {/* Painel do Drawer Lateral */}
        <div
          className={cn(
            'w-screen max-w-md sm:max-w-lg md:max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300 ease-out',
            className
          )}
        >
          {/* Cabeçalho do Drawer */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 shrink-0 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {title}
                </h2>
              </div>
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              type="button"
              className="rounded-xl p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all focus:outline-hidden"
              title="Fechar gaveta (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo com rolagem independente */}
          <div className="flex-1 overflow-y-auto px-6 py-6 overscroll-contain">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export Drawer alias para clareza semântica
export const Drawer = Modal;
