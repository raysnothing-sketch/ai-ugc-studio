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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#0c0d0f]/90 backdrop-blur-md border-b border-[#22262e]">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-[#8e94a0] hover:text-[#f5f5f3] hover:bg-[#14161a] rounded-lg lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#14161a] border border-[#232730] text-[11px] text-[#8e94a0]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#f5f5f3] font-medium">{t.header.systemOnline}</span>
          <span className="text-[#656a76]">|</span>
          <span className="text-gold-400 font-medium">Turso DB & R2 Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Product-to-Ad quick launcher */}
        <button
          onClick={() => setIsProductToAdModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#191c22] border border-[#d4af37]/40 text-[#f5f5f3] hover:bg-[#20242c] hover:border-[#d4af37] transition-all group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-12 transition-transform" />
          <span>Product-to-Ad Wizard</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setActiveModule('overview')}
            className="p-2 text-[#8e94a0] hover:text-[#f5f5f3] hover:bg-[#14161a] rounded-lg relative transition-colors"
            title={`${pendingTasksCount} tâches en attente`}
          >
            <Bell className="w-4 h-4" />
            {pendingTasksCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37] ring-2 ring-[#0c0d0f]" />
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={btnConfig.action}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] hover:to-[#c59b27] shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{btnConfig.label}</span>
        </button>
      </div>
    </header>
  );
};
