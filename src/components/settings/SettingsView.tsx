'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  User,
  Check,
  ShieldCheck,
  Trash2,
  Cpu,
  Sparkles,
  Zap,
  Globe,
  Radio,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, clearAllStudioData } = useApp();
  const [saved, setSaved] = useState(false);

  // Studio Operating Mode (Autonomous Free vs Cloud Paid)
  const [studioMode, setStudioMode] = useState<'autonomous_free' | 'cloud_paid'>('autonomous_free');
  const [isComfyChecking, setIsComfyChecking] = useState(false);
  const [comfyStatus, setComfyStatus] = useState<'idle' | 'online' | 'offline'>('idle');
  const [comfyUrl, setComfyUrl] = useState('http://127.0.0.1:8188');

  // Profile fields
  const [name, setName] = useState(userProfile.name);
  const [studioName, setStudioName] = useState(userProfile.studioName);
  const [title, setTitle] = useState(userProfile.title);
  const [taxNumber, setTaxNumber] = useState(userProfile.taxNumber || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [currency, setCurrency] = useState(userProfile.currency || '€');

  useEffect(() => {
    setName(userProfile.name);
    setStudioName(userProfile.studioName);
    setTitle(userProfile.title);
    setTaxNumber(userProfile.taxNumber || '');
    setAddress(userProfile.address || '');
    setCurrency(userProfile.currency || '€');

    // Fetch active studio mode from server
    fetch('/api/studio/mode')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mode) {
          setStudioMode(data.mode);
        }
      })
      .catch(() => {});
  }, [userProfile]);

  const handleModeSwitch = async (targetMode: 'autonomous_free' | 'cloud_paid') => {
    setStudioMode(targetMode);
    try {
      await fetch('/api/studio/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: targetMode })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // local toggle fallback
    }
  };

  const handleTestComfyUI = async () => {
    setIsComfyChecking(true);
    try {
      const res = await fetch(`${comfyUrl}/system_stats`, {
        signal: AbortSignal.timeout(2000)
      });
      setComfyStatus(res.ok ? 'online' : 'offline');
    } catch {
      setComfyStatus('offline');
    } finally {
      setIsComfyChecking(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      studioName,
      title,
      taxNumber,
      address,
      currency
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Confirmez-vous la réinitialisation de toutes les données locales du Studio ?')) {
      clearAllStudioData();
      alert('Toutes les données ont été remises à zéro.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1b1f27]">
        <div>
          <h1 className="text-xl font-semibold text-[#f5f5f3] tracking-tight">
            Paramètres du Studio
          </h1>
          <p className="text-xs text-[#8e94a0] mt-0.5">
            Architecture d&apos;exécution, profil créatif et moteurs de génération vidéo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Enregistré
            </span>
          )}
        </div>
      </div>

      {/* 1. Master Mode Selector: 100% Autonome & Gratuit vs Cloud Payant */}
      <section className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              Mode d&apos;Exécution & Coûts de Production
            </h2>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181d26] text-[#d4af37] border border-[#272e3d]">
            Inspiré de Velorn & OpenMontage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Mode 100% Autonome & Gratuit */}
          <div
            onClick={() => handleModeSwitch('autonomous_free')}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
              studioMode === 'autonomous_free'
                ? 'bg-[#12161f] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.08)]'
                : 'bg-[#07080a] border-[#1e232d] hover:border-[#2f3746]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f5f5f3] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
                  Mode 100% Autonome & Gratuit
                </span>
                {studioMode === 'autonomous_free' && (
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                )}
              </div>
              <p className="text-[11px] text-[#8e94a0] leading-relaxed">
                Supprime les abonnements payants. Les voix, vidéos et montages sont générés sans aucun débit bancaire via les moteurs locaux et bibliothèques ouvertes.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e232d] flex items-center justify-between text-[10px] font-mono">
              <span className="text-emerald-400 font-semibold">0.00 € / mois garanti</span>
              <span className="text-[#646a78]">Zéro clé requise</span>
            </div>
          </div>

          {/* Card 2: Mode Cloud Payant */}
          <div
            onClick={() => handleModeSwitch('cloud_paid')}
            className={`p-4 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between ${
              studioMode === 'cloud_paid'
                ? 'bg-[#12161f] border-[#d4af37]'
                : 'bg-[#07080a] border-[#1e232d] hover:border-[#2f3746]'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#f5f5f3] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#8e94a0]" />
                  Mode Cloud Externe (Payant)
                </span>
                {studioMode === 'cloud_paid' && (
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                )}
              </div>
              <p className="text-[11px] text-[#8e94a0] leading-relaxed">
                Permet d&apos;utiliser vos propres comptes d&apos;API tierces payantes (Runway Gen-3, HeyGen, ElevenLabs) si vous préférez déléguer le calcul au cloud.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1e232d] flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#8e94a0]">Facturation à l&apos;usage</span>
              <span className="text-[#646a78]">Clés API nécessaires</span>
            </div>
          </div>
        </div>

        {/* Velorn ComfyUI Local Bridge Settings */}
        <div className="p-3.5 rounded-lg bg-[#07080a] border border-[#1e232d] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#f5f5f3] flex items-center gap-1.5 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-[#d4af37]" />
              Pont ComfyUI Local (Style Velorn)
            </span>
            <span className="text-[10px] font-mono text-[#646a78]">
              Wan 2.1 / CogVideoX / Hunyuan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={comfyUrl}
              onChange={(e) => setComfyUrl(e.target.value)}
              placeholder="http://127.0.0.1:8188"
              className="flex-1 w-full p-2 bg-[#0e1115] border border-[#1e232d] rounded-lg text-[#f5f5f3] font-mono text-xs focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="button"
              onClick={handleTestComfyUI}
              disabled={isComfyChecking}
              className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#14181f] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              {isComfyChecking ? 'Vérification...' : 'Tester la connexion'}
            </button>
          </div>

          <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono">
            {comfyStatus === 'online' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Instance ComfyUI détectée en ligne (Rendu GPU local prêt)
              </span>
            )}
            {comfyStatus === 'offline' && (
              <span className="text-[#8e94a0] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-[#d4af37]" /> Instance ComfyUI non détectée. Repli automatique sur les rushes haute définition libres (OpenMontage Engine).
              </span>
            )}
            {comfyStatus === 'idle' && (
              <span className="text-[#646a78]">
                Détecte automatiquement si ComfyUI tourne sur votre machine pour les rendus vidéo sans coût.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 2. User Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] flex items-center gap-2">
            <User className="w-4 h-4 text-[#d4af37]" />
            Profil & Identité du Studio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#8e94a0] block mb-1">Votre Nom & Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] font-medium focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Nom du Studio</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] font-medium focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Titre Professionnel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Devise Principale</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]"
              >
                <option value="€">EUR (€)</option>
                <option value="$">USD ($)</option>
                <option value="CHF">CHF (Franc Suisse)</option>
                <option value="£">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Identifiant Fiscal / SIRET (Optionnel)</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="Ex: FR 84 928 310 442"
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] font-mono text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="text-[#8e94a0] block mb-1">Adresse de Facturation (Optionnel)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Studio Privé, France / International"
                className="w-full p-2.5 bg-[#07080a] border border-[#1e232d] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-[#07080a] text-xs font-semibold hover:bg-[#e0be48] active:bg-[#b89528] transition-colors cursor-pointer"
            >
              Enregistrer le profil
            </button>
          </div>
        </div>
      </form>

      {/* 3. Maintenance & Studio Reset */}
      <section className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
            Zone de Réinitialisation
          </h2>
        </div>
        <p className="text-xs text-[#8e94a0] leading-relaxed">
          Supprime l&apos;ensemble des données locales (projets, clients, factures et fichiers temporaires) enregistrées sur votre navigateur.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="px-3 py-1.5 rounded-lg bg-[#14181f] text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
        >
          Remettre à zéro toutes les données du studio
        </button>
      </section>
    </div>
  );
};
