'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  FolderPlus,
  ListTodo,
  Video,
  Film,
  Palette,
  Briefcase,
  LineChart,
  ShieldCheck,
  Check
} from 'lucide-react';

interface OverviewViewProps {
  onOpenNewProject: () => void;
}

/**
 * OverviewView — Unslopped Studio Command Center
 * 
 * Design Principles:
 * - World: Executive production suite (Matte obsidian #07080a, hairline borders #1e232d, satin gold #d4af37)
 * - Signature: Master panoramic banner embedded with architectural precision
 * - Typography: Sentence case, tabular figures, no emoji slop
 * - Motion: Clean surface hover steps, no bouncy zooms, no spinning glowing rings
 */
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
    .filter((i) => i.type === 'invoice' && (i.status === 'paid' || i.status === 'sent'))
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const modulesNav = [
    { id: 'ugc', label: 'UGC Videos', icon: Video, desc: 'Acteurs virtuels & scripts IA' },
    { id: 'cinematic', label: 'Cinematic Content', icon: Film, desc: 'Découpage & rushes 16:9' },
    { id: 'creative', label: 'Stunning Visuals', icon: Palette, desc: 'Packshots & assets produit' },
    { id: 'marketing', label: 'Smart Marketing', icon: LineChart, desc: 'Angles d\'accroche & personas' },
    { id: 'business', label: 'Freelance Business', icon: Briefcase, desc: 'Devis, factures & CRM' }
  ];

  return (
    <div className="space-y-6">
      {/* Master Panoramic Studio Showcase */}
      <section className="relative overflow-hidden rounded-2xl border border-[#212630] bg-[#090b0e]">
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-[300px] overflow-hidden bg-black">
          <img
            src="/banner.jpg"
            alt="AI UGC Studio — Personal Edition"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-transparent opacity-80" />
        </div>

        {/* Quick Navigation Rail */}
        <div className="bg-[#0c0e13] border-t border-[#1b1f27] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] py-0.5">
            {modulesNav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12151b] hover:bg-[#181d26] text-[#c7cbd4] hover:text-[#f5f5f3] border border-[#1e232d] hover:border-[#d4af37]/40 text-xs font-medium transition-colors shrink-0 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsProductToAdModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-[#07080a] text-xs font-semibold hover:bg-[#e0be48] active:bg-[#b89528] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Workflow Product-to-Ad</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Studio Header Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#1b1f27]">
        <div>
          <h1 className="text-xl font-semibold text-[#f5f5f3] tracking-tight">
            Vue d&apos;ensemble du Studio
          </h1>
          <p className="text-xs text-[#8e94a0] mt-0.5">
            Espace de production de {userProfile.name} • {userProfile.studioName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-mono text-[#8e94a0] bg-[#0e1116] border border-[#1e232d] px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#f5f5f3]">Mode 100% Autonome & Gratuit</span>
          <span className="text-[#656a76]">•</span>
          <span className="text-emerald-400">0.00 € coût d&apos;API</span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Clients */}
        <div
          onClick={() => setActiveModule('clients')}
          className="bg-[#0e1115] border border-[#1e232d] hover:border-[#2f3746] p-4 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="text-xs text-[#8e94a0] flex items-center justify-between">
            <span>{t.activeClients}</span>
            <span className="text-[11px] font-mono text-[#656a76]">CRM</span>
          </div>
          <div className="text-2xl font-medium text-[#f5f5f3] mt-2 font-mono tabular-nums">
            {clients.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Portefeuille actif</span>
          </div>
        </div>

        {/* Ongoing Projects */}
        <div
          onClick={() => setActiveModule('projects')}
          className="bg-[#0e1115] border border-[#1e232d] hover:border-[#2f3746] p-4 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="text-xs text-[#8e94a0] flex items-center justify-between">
            <span>{t.ongoingProjects}</span>
            <span className="text-[11px] font-mono text-[#656a76]">RUN</span>
          </div>
          <div className="text-2xl font-medium text-[#f5f5f3] mt-2 font-mono tabular-nums">
            {projects.length}
          </div>
          <div className="text-[11px] text-[#9ba1ad] mt-1 flex items-center gap-1 font-mono">
            <span>En cours de validation</span>
          </div>
        </div>

        {/* Campaigns / Videos Created */}
        <div
          onClick={() => setActiveModule('ugc')}
          className="bg-[#0e1115] border border-[#1e232d] hover:border-[#2f3746] p-4 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="text-xs text-[#8e94a0] flex items-center justify-between">
            <span>{t.campaignsCreated}</span>
            <span className="text-[11px] font-mono text-[#656a76]">UGC</span>
          </div>
          <div className="text-2xl font-medium text-[#f5f5f3] mt-2 font-mono tabular-nums">
            {videoJobs.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>Rendus générés</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div
          onClick={() => setActiveModule('business')}
          className="bg-[#0e1115] border border-[#1e232d] hover:border-[#2f3746] p-4 rounded-xl transition-colors cursor-pointer group"
        >
          <div className="text-xs text-[#8e94a0] flex items-center justify-between">
            <span>{t.revenueMonth}</span>
            <span className="text-[11px] font-mono text-[#656a76]">FIN</span>
          </div>
          <div className="text-2xl font-medium text-[#d4af37] mt-2 font-mono tabular-nums">
            {userProfile.currency || '€'}{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>Facturation validée</span>
          </div>
        </div>
      </div>

      {/* Hero Showcase Card: Product-to-Ad */}
      <section className="relative overflow-hidden rounded-xl bg-[#0e1115] border border-[#1e232d] p-6 lg:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#181d26] border border-[#272e3d] text-[#d4af37] text-[10px] font-mono tracking-wider">
              <span>PIPELINE AUTOMATISÉ</span>
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-[#f5f5f3] tracking-tight">
              {t.productToAdTitle}
            </h2>
            <p className="text-xs text-[#8e94a0] leading-relaxed">
              {t.productToAdDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsProductToAdModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#d4af37] text-[#07080a] hover:bg-[#e0be48] active:bg-[#b89528] transition-colors cursor-pointer"
              >
                <span>{t.launchWorkflow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Clean product preview frame without spinning halos */}
          <div className="w-full md:w-auto flex items-center justify-center shrink-0">
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-xl overflow-hidden border border-[#212630] bg-[#07080a]">
              <img
                src="https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=400&auto=format&fit=crop&q=80"
                alt="Product visual"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-[#07080a]/80 backdrop-blur border border-[#1e232d] text-[10px] font-mono text-[#c7cbd4] flex items-center justify-between">
                <span>PACKSHOT</span>
                <span className="text-[#d4af37]">4K RES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Bottom row (Recent Projects, Priority Tasks, Studio Log) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projets récents */}
        <div className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-[#f5f5f3]">
              {t.recentProjects}
            </h3>
            {projects.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-[#d4af37] hover:underline font-medium"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            {projects.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#07080a] border border-[#1e232d] space-y-2.5">
                <FolderPlus className="w-7 h-7 text-[#656a76] mx-auto" />
                <p className="text-xs text-[#8e94a0]">Aucun projet en cours</p>
                <button
                  onClick={onOpenNewProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14181f] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] transition-colors"
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
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#07080a] border border-[#1c2028] hover:border-[#2f3746] transition-colors cursor-pointer group"
                >
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.name}
                    className="w-11 h-11 rounded-lg object-cover border border-[#1e232d] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-[#f5f5f3] truncate">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-[#8e94a0] mt-0.5 flex items-center gap-1.5 font-mono">
                      <span>{proj.clientName}</span>
                      <span>•</span>
                      <span className="text-[#d4af37]">{proj.progress}%</span>
                    </p>
                    <div className="w-full bg-[#181d26] h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-[#d4af37] h-full rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#656a76] group-hover:text-[#f5f5f3] transition-colors" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tâches prioritaires */}
        <div className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-[#f5f5f3]">
              {t.priorityTasks}
            </h3>
            {tasks.length > 0 && (
              <button
                onClick={() => setActiveModule('projects')}
                className="text-[11px] text-[#d4af37] hover:underline font-medium"
              >
                {t.viewAll}
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            {tasks.length === 0 ? (
              <div className="py-6 px-4 text-center rounded-lg bg-[#07080a] border border-[#1e232d] space-y-2.5">
                <ListTodo className="w-7 h-7 text-[#656a76] mx-auto" />
                <p className="text-xs text-[#8e94a0]">Toutes les tâches sont traitées</p>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#14181f] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] transition-colors"
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
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    task.status === 'done'
                      ? 'bg-[#07080a] border-[#181a20] opacity-50'
                      : 'bg-[#07080a] border-[#1c2028] hover:border-[#2f3746]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        task.status === 'done'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[#282d39]'
                      }`}
                    >
                      {task.status === 'done' && <Check className="w-3 h-3" />}
                    </div>
                    <span
                      className={`text-xs truncate ${
                        task.status === 'done'
                          ? 'line-through text-[#656a76]'
                          : 'text-[#f5f5f3]'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap bg-[#13161c] text-[#8e94a0]">
                    {task.deadline}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-[#f5f5f3]">
              {t.recentActivity}
            </h3>
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#07080a] border border-[#1c2028]">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-[#8e94a0]">Système vérifié</p>
                <p className="text-xs font-medium text-[#f5f5f3] truncate">
                  Architecture durcie • Next.js 15
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#07080a] border border-[#1c2028]">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-[#8e94a0]">Direction Artistique</p>
                <p className="text-xs font-medium text-[#f5f5f3] truncate">
                  Noir Obsidienne & Or Satiné actif
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
