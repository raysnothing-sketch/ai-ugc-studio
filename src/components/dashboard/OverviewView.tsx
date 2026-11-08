'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  FolderPlus,
  ListTodo
} from 'lucide-react';

interface OverviewViewProps {
  onOpenNewProject: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenNewProject }) => {
  const {
    language,
    setActiveModule,
    setIsProductToAdModalOpen,
    userProfile,
    clients,
    projects,
    tasks,
    addTask,
    toggleTaskStatus,
    invoices,
    videoJobs
  } = useApp();

  const t = TRANSLATIONS[language].overview;

  const totalRevenue = invoices
    .filter(i => i.type === 'invoice' && (i.status === 'paid' || i.status === 'sent'))
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const activeProjects = projects.filter(p => p.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Official Master Panoramic Banner Showcase */}
      <div className="relative overflow-hidden rounded-2xl border border-[#d4af37]/35 shadow-[0_4px_35px_rgba(212,175,55,0.18)] bg-[#090b0e] group">
        <div className="relative">
          <img
            src="/banner.jpg"
            alt="AI UGC Studio — Personal Edition"
            className="w-full h-auto object-cover max-h-[280px] lg:max-h-[320px] transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-transparent opacity-70" />
        </div>

        {/* Interactive Quick-Action Ribbon matching Banner Categories */}
        <div className="bg-[#0e1014] border-t border-[#1c2028] px-4 py-3 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-semibold py-0.5">
            <button
              onClick={() => setActiveModule('ugc')}
              className="gold-pill px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>🎬</span>
              <span>UGC Videos</span>
            </button>
            <button
              onClick={() => setActiveModule('cinematic')}
              className="gold-pill px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>🎥</span>
              <span>Cinematic Content</span>
            </button>
            <button
              onClick={() => setActiveModule('creative')}
              className="gold-pill px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>🎨</span>
              <span>Stunning Visuals</span>
            </button>
            <button
              onClick={() => setActiveModule('marketing')}
              className="gold-pill px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>📈</span>
              <span>Smart Marketing</span>
            </button>
            <button
              onClick={() => setActiveModule('business')}
              className="gold-pill px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>💼</span>
              <span>Freelance Business</span>
            </button>
          </div>

          <button
            onClick={() => setIsProductToAdModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#e5b869] via-[#d4af37] to-[#aa7c11] text-[#07080a] text-xs font-extrabold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lancer un workflow IA</span>
          </button>
        </div>
      </div>

      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f5f5f3] tracking-tight flex items-center gap-2">
            <span>Bienvenue dans votre Studio, {userProfile.name} !</span>
            <span className="text-sm">👋</span>
          </h1>
          <p className="text-xs text-[#8e94a0] mt-0.5">
            {t.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-medium text-[#8e94a0] bg-[#0e1014] border border-[#1c2028] px-3 py-1 rounded-lg">
            Direction Artistique : <span className="text-gold-400 font-semibold">Noir Obsidienne & Or Métallisé</span>
          </span>
        </div>
      </div>

      {/* 4 Dynamic Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Clients */}
        <div
          onClick={() => setActiveModule('clients')}
          className="bg-[#0e1014] border border-[#1c2028] hover:border-[#d4af37]/50 p-4 rounded-xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)]"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors">
            {clients.length}
          </div>
          <div className="text-xs text-[#8e94a0] mt-1 flex items-center justify-between">
            <span>{t.activeClients}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
              <TrendingUp className="w-3 h-3" /> Actif
            </span>
          </div>
        </div>

        {/* Ongoing Projects */}
        <div
          onClick={() => setActiveModule('projects')}
          className="bg-[#0e1014] border border-[#1c2028] hover:border-[#d4af37]/50 p-4 rounded-xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)]"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors">
            {projects.length}
          </div>
          <div className="text-xs text-[#8e94a0] mt-1 flex items-center justify-between">
            <span>{t.ongoingProjects}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
              <TrendingUp className="w-3 h-3" /> Suivi
            </span>
          </div>
        </div>

        {/* Campaigns / Videos Created */}
        <div
          onClick={() => setActiveModule('ugc')}
          className="bg-[#0e1014] border border-[#1c2028] hover:border-[#d4af37]/50 p-4 rounded-xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)]"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors">
            {videoJobs.length}
          </div>
          <div className="text-xs text-[#8e94a0] mt-1 flex items-center justify-between">
            <span>{t.campaignsCreated}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
              <TrendingUp className="w-3 h-3" /> UGC
            </span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          onClick={() => setActiveModule('business')}
          className="bg-[#0e1014] border border-[#1c2028] hover:border-[#d4af37]/50 p-4 rounded-xl transition-all cursor-pointer group shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)]"
        >
          <div className="text-2xl font-bold text-gold-400 group-hover:text-gold-300 transition-colors">
            {userProfile.currency || '€'}{totalRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-[#8e94a0] mt-1 flex items-center justify-between">
            <span>{t.revenueMonth}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5 text-[11px]">
              <TrendingUp className="w-3 h-3" /> Réel
            </span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Card: Product-to-Ad */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0e1014] via-[#14171e] to-[#0a0c10] border border-[#d4af37]/25 p-6 lg:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        {/* Glow backdrop */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-md space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Workflow Différenciant
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-[#f5f5f3] tracking-tight">
              {t.productToAdTitle}
            </h2>
            <p className="text-xs lg:text-sm text-[#8e94a0] leading-relaxed">
              {t.productToAdDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsProductToAdModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-[#e5b869] via-[#d4af37] to-[#aa7c11] text-[#07080a] hover:from-[#f0c776] hover:to-[#bd8a16] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <span>{t.launchWorkflow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Showcase: Luxury Product Visual with Glowing Gold Rim */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/30" />
            <img
              src="https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=400&auto=format&fit=crop&q=80"
              alt="Studio Product Visual"
              className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-2xl relative z-10 border border-[#d4af37]/50 ring-4 ring-[#0e1014]"
            />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Bottom row (Recent Projects, Priority Tasks, Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projets récents */}
        <div className="bg-[#0e1014] border border-[#1c2028] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.recentProjects}
            </h3>
            {projects.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {projects.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#13161c]/60 border border-dashed border-[#1c2028] space-y-2.5">
                <FolderPlus className="w-8 h-8 text-[#656a76] mx-auto" />
                <p className="text-xs text-[#8e94a0]">Aucun projet en cours pour l&apos;instant</p>
                <button
                  onClick={onOpenNewProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1c2028] hover:bg-[#282d39] text-gold-400 border border-[#d4af37]/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouveau projet</span>
                </button>
              </div>
            ) : (
              projects.slice(0, 2).map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setActiveModule('projects')}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#13161c] border border-[#1c2028] hover:border-[#d4af37]/50 transition-all cursor-pointer group"
                >
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#282d39]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#f5f5f3] group-hover:text-gold-400 transition-colors truncate">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-[#8e94a0] mt-0.5 flex items-center gap-1.5">
                      <span>{proj.clientName}</span>
                      <span>•</span>
                      <span className="font-semibold text-gold-400">{proj.progress}%</span>
                    </p>
                    <div className="w-full bg-[#1c2028] h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#e5b869] to-[#d4af37] h-full rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#656a76] group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tâches prioritaires */}
        <div className="bg-[#0e1014] border border-[#1c2028] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.priorityTasks}
            </h3>
            {tasks.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-semibold"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            {tasks.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#13161c]/60 border border-dashed border-[#1c2028] space-y-2.5">
                <ListTodo className="w-8 h-8 text-[#656a76] mx-auto" />
                <p className="text-xs text-[#8e94a0]">Toutes vos tâches sont à jour</p>
                <button
                  onClick={() => {
                    const taskName = prompt('Nom de votre tâche :');
                    if (taskName && taskName.trim()) {
                      addTask({
                        title: taskName.trim(),
                        deadline: "Aujourd'hui",
                        status: 'todo',
                        priority: 'high'
                      });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1c2028] hover:bg-[#282d39] text-gold-400 border border-[#d4af37]/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une tâche</span>
                </button>
              </div>
            ) : (
              tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer group ${
                    task.status === 'done'
                      ? 'bg-[#0a0c0f] border-[#181a20] opacity-60'
                      : 'bg-[#13161c] border-[#1c2028] hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'done'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[#282d39] group-hover:border-[#d4af37]'
                      }`}
                    >
                      {task.status === 'done' && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-xs truncate ${
                        task.status === 'done'
                          ? 'line-through text-[#656a76]'
                          : 'text-[#f5f5f3] group-hover:text-gold-300'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap bg-[#1c2028] text-[#8e94a0]">
                    {task.deadline}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-[#0e1014] border border-[#1c2028] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.recentActivity}
            </h3>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#13161c] border border-[#1c2028]">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#8e94a0]">À l&apos;instant</p>
                <p className="text-xs font-medium text-[#f5f5f3] truncate">
                  Studio initialisé et prêt pour la production
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#13161c] border border-[#1c2028]">
              <div className="w-9 h-9 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#8e94a0]">Identité Visuelle</p>
                <p className="text-xs font-medium text-[#f5f5f3] truncate">
                  Direction Noir Obsidienne & Or Métallisé active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
