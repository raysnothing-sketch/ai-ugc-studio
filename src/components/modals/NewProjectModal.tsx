'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { FolderKanban, Plus } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose }) => {
  const { clients, addProject, setActiveModule, userProfile } = useApp();

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [customClientName, setCustomClientName] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [budget, setBudget] = useState('2500');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const selectedClient = clients.find(c => c.id === clientId);
    const resolvedClientName = selectedClient?.name || customClientName || 'Client Studio';

    addProject({
      name,
      clientId: selectedClient?.id || `cli-${Date.now()}`,
      clientName: resolvedClientName,
      description,
      objectives: objectives || 'Production et diffusion de contenus publicitaires IA.',
      estimatedBudget: parseFloat(budget) || 2000,
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      status: 'to_plan',
      deliverables: ['3 Vidéos UGC 9:16', '1 Vidéo cinématique', 'Déclinaisons réseaux'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      tags: ['UGC', 'Campagne']
    });

    onClose();
    setActiveModule('projects');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
          <h3 className="text-base font-bold text-[#f5f5f3] flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-gold-400" />
            Créer un nouveau projet
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8e94a0] hover:text-[#f5f5f3]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[#8e94a0] block mb-1">Nom du projet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Campagne Lancement Produit Printemps"
              className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              required
            />
          </div>

          <div>
            <label className="text-[#8e94a0] block mb-1">Client associé</label>
            {clients.length > 0 ? (
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.sector})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customClientName}
                onChange={(e) => setCustomClientName(e.target.value)}
                placeholder="Ex : BioCosmetics Studio / Marque Client"
                className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                required
              />
            )}
          </div>

          <div>
            <label className="text-[#8e94a0] block mb-1">Description & Enjeux</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objectifs de la campagne, cibles et formats requis..."
              className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8e94a0] block mb-1">Budget estimé (€)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Date limite de livraison</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#22262e]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors"
          >
            Créer le projet
          </button>
        </div>
      </form>
    </div>
  );
};
