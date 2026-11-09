'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import { Menu, Bell, Sparkles, Plus, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onOpenNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, onOpenNewProject }) => {
  const {
    language,
    activeModule,
    setActiveModule,
    setIsProductToAdModalOpen,
    setIsNewDocModalOpen,
    setIsNewClientModalOpen,
    setIsNewCaseModalOpen,
    tasks
  } = useApp();
  const t = TRANSLATIONS[language];

  // Dynamic button label and action depending on current module
  const getContextButton = () => {
    switch (activeModule) {
      case 'marketing':
        return {
          label: t.marketing.newAnalysis,
          action: () => {
            const input = document.getElementById('product-url-input');
            if (input) input.focus();
          }
        };
      case 'clients':
        return {
          label: '+ Nouveau client',
          action: () => setIsNewClientModalOpen(true)
        };
      case 'ugc':
        return {
          label: t.ugc.generateVideo,
          action: () => setIsProductToAdModalOpen(true)
        };
      case 'cinematic':
        return {
          label: t.cinematic.newProject,
          action: onOpenNewProject
        };
      case 'business':
        return {
          label: t.business.newQuote,
          action: () => setIsNewDocModalOpen(true)
        };
      case 'portfolio':
        return {
          label: t.portfolio.addCase,
          action: () => setIsNewCaseModalOpen(true)
        };
      case 'projects':
      default:
        return {
          label: t.header.newProject,
          action: onOpenNewProject
        };
    }
  };

  const btnConfig = getContextButton();
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#07080a]/90 backdrop-blur-md border-b border-[#1a1e26]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-[#8e94a0] hover:text-[#f5f5f3] hover:bg-[#12141a] rounded-lg lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0e1014] border border-[#1e232d] text-[11px] text-[#8e94a0]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[#f5f5f3] font-medium">{t.header.systemOnline}</span>
          <span className="text-[#3b4252]">|</span>
          <span className="text-[#d4af37] font-medium font-mono">Engine & R2 Ready</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Product-to-Ad quick launcher */}
        <button
          onClick={() => setIsProductToAdModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#11141a] border border-[#1e232d] text-[#c7cbd4] hover:text-[#f5f5f3] hover:border-[#d4af37]/40 transition-colors"
        >
          <span>Product-to-Ad</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setActiveModule('overview')}
            className="p-2 text-[#8e94a0] hover:text-[#f5f5f3] hover:bg-[#12141a] rounded-lg relative transition-colors"
            title={`${pendingTasksCount} tâches en attente`}
          >
            <Bell className="w-4 h-4" />
            {pendingTasksCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={btnConfig.action}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#d4af37] text-[#07080a] hover:bg-[#e0be48] active:bg-[#b89528] transition-colors"
        >
          <span>{btnConfig.label}</span>
        </button>
      </div>
    </header>
  );
};
