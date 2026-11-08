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
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">
          Bienvenue, {userProfile.name} ! 👋
        </h1>
        <p className="text-xs text-[#8e94a0] mt-1">
          {t.subtitle}
        </p>
      </div>

      {/* 4 Dynamic Stats Cards based on Real Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Clients */}
        <div
          onClick={() => setActiveModule('clients')}
          className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/40 p-4 rounded-xl transition-all cursor-pointer group shadow-card"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-[#d4af37] transition-colors">
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
          className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/40 p-4 rounded-xl transition-all cursor-pointer group shadow-card"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-[#d4af37] transition-colors">
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
          className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/40 p-4 rounded-xl transition-all cursor-pointer group shadow-card"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-[#d4af37] transition-colors">
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
          className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/40 p-4 rounded-xl transition-all cursor-pointer group shadow-card"
        >
          <div className="text-2xl font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors">
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

      {/* Hero Banner: Product-to-Ad */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14161a] via-[#1a1c22] to-[#121417] border border-[#2b2f3a] p-6 lg:p-8 shadow-gold">
        {/* Glow backdrop behind bottle */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="max-w-md space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-gold-400 text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
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
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] hover:to-[#c59b27] shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:scale-[1.02]"
              >
                <span>{t.launchWorkflow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Showcase: Bottle with Glowing Gold Ring */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#d4af37]/50 shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-dashed border-[#d4af37]/30" />
            <img
              src="https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=400&auto=format&fit=crop&q=80"
              alt="Studio Product Visual"
              className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-2xl shadow-2xl relative z-10 border border-[#d4af37]/40 ring-4 ring-[#14161a]"
            />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Bottom row (Recent Projects, Priority Tasks, Activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projets récents */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.recentProjects}
            </h3>
            {projects.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-medium"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {projects.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#191c22]/60 border border-dashed border-[#2b2f3a] space-y-2.5">
                <FolderPlus className="w-8 h-8 text-[#656a76] mx-auto" />
                <p className="text-xs text-[#8e94a0]">Aucun projet en cours pour l&apos;instant</p>
                <button
                  onClick={onOpenNewProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-gold-400 border border-[#d4af37]/30 transition-colors"
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
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#191c22] border border-[#232730] hover:border-[#d4af37]/50 transition-all cursor-pointer group"
                >
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#2b2f3a]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#f5f5f3] group-hover:text-[#d4af37] transition-colors truncate">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-[#8e94a0] mt-0.5 flex items-center gap-1.5">
                      <span>{proj.clientName}</span>
                      <span>•</span>
                      <span className="font-semibold text-gold-400">{proj.progress}%</span>
                    </p>
                    <div className="w-full bg-[#232730] h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#d4af37] to-[#e5c05d] h-full rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#656a76] group-hover:text-[#d4af37] group-hover:translate-x-0.5 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tâches prioritaires */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.priorityTasks}
            </h3>
            {tasks.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-medium"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            {tasks.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#191c22]/60 border border-dashed border-[#2b2f3a] space-y-2.5">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-gold-400 border border-[#d4af37]/30 transition-colors"
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
                      ? 'bg-[#121417] border-[#1e222a] opacity-60'
                      : 'bg-[#191c22] border-[#232730] hover:border-[#d4af37]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'done'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[#363c48] group-hover:border-[#d4af37]'
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

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap bg-[#232730] text-[#8e94a0]">
                    {task.deadline}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.recentActivity}
            </h3>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#191c22] border border-[#232730]">
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

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#191c22] border border-[#232730]">
              <div className="w-9 h-9 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-gold-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#8e94a0]">Fournisseurs IA</p>
                <p className="text-xs font-medium text-[#f5f5f3] truncate">
                  HeyGen, ElevenLabs, Runway connectés
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
