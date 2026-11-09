'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  FolderKanban,
  Video,
  Film,
  Palette,
  Share2,
  Briefcase,
  FolderHeart,
  Image as ImageIcon,
  Settings,
  Search,
  Globe,
  Plus
} from 'lucide-react';

interface SidebarProps {
  onOpenNewProject: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenNewProject, isMobileOpen, onCloseMobile }) => {
  const { activeModule, setActiveModule, language, setLanguage, searchQuery, setSearchQuery, userProfile, setIsProfileModalOpen } = useApp();
  const t = TRANSLATIONS[language].sidebar;

  const navItems = [
    { id: 'overview', label: t.overview, icon: LayoutDashboard },
    { id: 'marketing', label: t.marketing, icon: Sparkles },
    { id: 'clients', label: t.clients, icon: Users },
    { id: 'projects', label: t.projects, icon: FolderKanban },
    { id: 'ugc', label: t.ugcStudio, icon: Video },
    { id: 'cinematic', label: t.cinematicStudio, icon: Film },
    { id: 'creative', label: t.creativeStudio, icon: Palette },
    { id: 'social', label: t.socialMedia, icon: Share2 },
    { id: 'business', label: t.businessManager, icon: Briefcase },
    { id: 'portfolio', label: t.portfolio, icon: FolderHeart },
    { id: 'media', label: t.mediaLibrary, icon: ImageIcon },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#090b0e] border-r border-[#1a1e26] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with Official Metallic App Icon */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1a1e26]">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#d4af37]/40 shrink-0 bg-[#07080a]">
            <img
              src="/icon.jpg"
              alt="AI UGC Studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-xs tracking-tight text-[#f5f5f3] truncate">
              {userProfile.studioName}
            </h1>
            <span className="text-[10px] text-[#d4af37] font-mono tracking-wider block">
              Personal Edition
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#656a76]" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0f1116] border border-[#1e232d] rounded-lg text-[#f5f5f3] placeholder-[#656a76] focus:outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group cursor-pointer ${
                  isActive
                    ? 'bg-[#141820] text-[#f5f5f3] border-l-2 border-[#d4af37]'
                    : 'text-[#8e94a0] hover:text-[#f5f5f3] hover:bg-[#0f1217]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#d4af37]' : 'text-[#656a76] group-hover:text-[#9ba1ad]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'ugc' && (
                  <span className="ml-auto text-[9px] font-mono font-medium text-[#d4af37] bg-[#1a1f29] px-1.5 py-0.5 rounded border border-[#262e3d]">
                    UGC
                  </span>
                )}
                {item.id === 'cinematic' && (
                  <span className="ml-auto text-[9px] font-mono font-medium text-[#d4af37] bg-[#1a1f29] px-1.5 py-0.5 rounded border border-[#262e3d]">
                    16:9
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Language Toggle & Action */}
        <div className="px-4 py-2 border-t border-[#1a1e26] bg-[#07080a]">
          <div className="flex items-center justify-between text-xs text-[#8e94a0] mb-2">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Globe className="w-3.5 h-3.5 text-[#d4af37]" /> Langue :
            </span>
            <div className="flex items-center gap-1 bg-[#0f1116] p-0.5 rounded-md border border-[#1e232d]">
              {(['de', 'fr', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded uppercase transition-colors ${
                    language === lang
                      ? 'bg-[#d4af37] text-[#07080a]'
                      : 'text-[#8e94a0] hover:text-[#f5f5f3]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-[#1a1e26] bg-[#0c0e12]">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#13161c] transition-colors cursor-pointer group"
            title="Personnaliser votre profil"
          >
            <div className="relative">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/50"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0c0e12]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#f5f5f3] truncate group-hover:text-[#d4af37] transition-colors">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-[#8e94a0] truncate">
                {userProfile.title || t.ownerTitle}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
