'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FolderKanban,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Sparkles,
  FolderPlus,
  Trash2
} from 'lucide-react';
import { Project, ProjectStatus } from '@/lib/types';

interface ProjectsViewProps {
  onOpenNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenNewProject }) => {
  const { projects, updateProjectStatus, deleteProject, setActiveModule, setIsProductToAdModalOpen, userProfile } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">En cours</span>;
      case 'to_plan':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">À planifier</span>;
      case 'validation':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">En validation</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">Terminé</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#232730] text-[#8e94a0]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Projets & Campagnes</h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            Suivi de vos productions publicitaires, livrables contractuels et échéances clients.
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Filter Tabs */}
      {projects.length > 0 && (
        <div className="flex items-center gap-2 border-b border-[#22262e] pb-3 text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'Tous les projets' },
            { id: 'in_progress', label: 'En cours' },
            { id: 'to_plan', label: 'À planifier' },
            { id: 'validation', label: 'Validation' },
            { id: 'completed', label: 'Terminés' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                  : 'text-[#8e94a0] hover:text-[#f5f5f3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid or Empty State */}
      {projects.length === 0 ? (
        <div className="bg-[#14161a] border border-[#232730] rounded-2xl p-10 text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-gold-400/60 mx-auto" />
          <h3 className="text-sm font-bold text-[#f5f5f3]">Aucun projet pour le moment</h3>
          <p className="text-xs text-[#8e94a0] max-w-sm mx-auto">
            Créez votre première campagne marketing ou lancez le workflow automatisé Product-to-Ad.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <button
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer un projet</span>
            </button>
            <button
              onClick={() => setIsProductToAdModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-[#232730] text-[#f5f5f3] hover:bg-[#2e3340] border border-[#d4af37]/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Product-to-Ad Wizard</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/50 rounded-xl overflow-hidden shadow-card transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                <img
                  src={proj.thumbnailUrl}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14161a] via-transparent to-black/30" />
                <div className="absolute top-3 right-3">{getStatusBadge(proj.status)}</div>
                <div className="absolute bottom-2.5 left-3">
                  <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
                    {proj.clientName}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#f5f5f3] group-hover:text-gold-300 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-[#8e94a0] mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#22262e] text-xs">
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#8e94a0]">Progression</span>
                      <span className="text-gold-400 font-semibold">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-[#232730] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#d4af37] to-[#e5c05d] h-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8e94a0] pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#656a76]" />
                      Échéance : {proj.deadline}
                    </span>
                    <span className="font-semibold text-[#f5f5f3]">
                      Budget : {userProfile.currency || '€'}{proj.estimatedBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#191c22] border-t border-[#232730] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8e94a0]">
                  {proj.deliverables.length} livrables
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModule('ugc');
                  }}
                  className="text-gold-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  Ouvrir studio <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#f5f5f3]">{selectedProject.name}</h3>
                <p className="text-xs text-gold-400">Client : {selectedProject.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#8e94a0]">
              <p><strong className="text-[#f5f5f3]">Description :</strong> {selectedProject.description}</p>
              <p><strong className="text-[#f5f5f3]">Objectifs chiffrés :</strong> {selectedProject.objectives}</p>
              <div className="bg-[#191c22] p-3 rounded-lg border border-[#232730]">
                <strong className="text-gold-400 block mb-1">Livrables contractuels :</strong>
                <ul className="space-y-1">
                  {selectedProject.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-[#f5f5f3]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#22262e]">
              <button
                onClick={() => {
                  deleteProject(selectedProject.id);
                  setSelectedProject(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer ce projet
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setActiveModule('ugc');
                  }}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
                >
                  Aller au UGC Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
