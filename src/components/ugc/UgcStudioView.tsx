'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Play,
  RotateCcw,
  Volume2,
  Check,
  Star,
  Users,
  Package,
  Layers,
  BookOpen,
  Coffee,
  ChevronRight,
  Sparkles,
  Zap,
  Radio,
  FileCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { UgcVideoType } from '@/lib/types';
import { VIRTUAL_ACTORS, VOICE_PROFILES } from '@/lib/initial-data';

const RemotionUgcPlayer = dynamic(
  () => import('./RemotionUgcPlayer').then((mod) => mod.RemotionUgcPlayer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-[#d4af37] text-xs p-6 gap-3">
        <div className="w-7 h-7 border-2 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
        <span className="font-mono text-[11px] text-[#9ba1ad]">Initialisation Remotion Player...</span>
      </div>
    ),
  }
);

/**
 * UgcStudioView — Unslopped & 100% Free Autonomous Creator
 * 
 * Features:
 * - 0.00 € production costs (Zero-Key architecture inspired by OpenMontage)
 * - Local-First Remotion Player with kinetic subtitles
 * - Free speech synthesis test audition via Web Speech API
 */
export const UgcStudioView: React.FC = () => {
  const { language, scripts, updateScript, addVideoJob, setIsProductToAdModalOpen, userProfile } = useApp();
  const t = TRANSLATIONS[language].ugc;

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<UgcVideoType>('review');
  const [selectedActor, setSelectedActor] = useState(VIRTUAL_ACTORS[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0]);
  const [tone, setTone] = useState<string>('Énergique');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  const activeScript = scripts[0];
  const [scriptContent, setScriptContent] = useState<string>(activeScript ? activeScript.fullText : '');

  const videoTypes: { id: UgcVideoType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'review', label: 'Product Review', icon: Star },
    { id: 'testimonial', label: 'Témoignage', icon: Users },
    { id: 'unboxing', label: 'Unboxing', icon: Package },
    { id: 'demonstration', label: 'Démonstration', icon: Layers },
    { id: 'storytelling', label: 'Storytelling', icon: BookOpen },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
  ];

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setScriptContent(val);
    if (activeScript) {
      updateScript(activeScript.id, val);
    }
  };

  // Test Voice Synthesis via native browser speech engine (100% free, 0 API key)
  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = scriptContent.slice(0, 140) || 'Bonjour, ceci est un test de synthèse vocale autonome.';
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = selectedVoice.accent.includes('Allemand') ? 'de-DE' : selectedVoice.accent.includes('Américain') ? 'en-US' : 'fr-FR';
    utterance.rate = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    setGenerationProgress(15);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setActiveStep(4);
            const scriptLabel = activeScript?.title || 'Campagne UGC';
            addVideoJob({
              id: `job-${Date.now()}`,
              title: `UGC ${selectedType.toUpperCase()} — ${scriptLabel}`,
              productName: userProfile.studioName || 'Votre Produit',
              videoType: selectedType,
              format: '9:16',
              actorId: selectedActor.id,
              actorName: selectedActor.name,
              voiceName: selectedVoice.name,
              scriptText: scriptContent,
              videoUrl: selectedActor.avatarUrl,
              durationSec: 24,
              status: 'completed',
              estimatedCostEur: 0.0, // 100% Free
              createdAt: new Date().toISOString()
            });
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const stepsList = [
    { num: 1, label: 'Format UGC' },
    { num: 2, label: 'Script & Accroche' },
    { num: 3, label: 'Acteur & Voix' },
    { num: 4, label: 'Rendu Final 9:16' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Autonomous Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1b1f27]">
        <div>
          <h1 className="text-xl font-semibold text-[#f5f5f3] tracking-tight">
            UGC Video Studio
          </h1>
          <p className="text-xs text-[#8e94a0] mt-0.5">
            Création de vidéos publicitaires verticales 9:16 avec acteurs virtuels et sous-titres animés
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12161f] border border-[#d4af37]/30 text-[11px] font-mono text-[#d4af37]">
            <Zap className="w-3 h-3 text-[#d4af37]" />
            <span>Mode 100% Gratuit & Autonome (0.00 €)</span>
          </div>
        </div>
      </div>

      {/* Connected Stepper Rail */}
      <div className="relative flex items-center justify-between max-w-xl mx-auto py-2">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-[#1e232d] -z-0" />
        {stepsList.map((step) => {
          const isCurrent = activeStep === step.num;
          const isDone = activeStep > step.num;

          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className="relative z-10 flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-colors ${
                  isCurrent
                    ? 'bg-[#d4af37] text-[#07080a] ring-2 ring-[#d4af37]/30'
                    : isDone
                    ? 'bg-[#18211b] text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#0f1217] text-[#646a78] border border-[#212630] group-hover:border-[#353c4c] group-hover:text-[#9ba1ad]'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span
                className={`text-[11px] font-medium hidden sm:inline transition-colors ${
                  isCurrent ? 'text-[#f5f5f3]' : 'text-[#646a78] group-hover:text-[#9ba1ad]'
                }`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Video Type Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-[#f5f5f3] block">
              Format publicitaire
            </label>

            <div className="grid grid-cols-3 gap-2">
              {videoTypes.map((vt) => {
                const Icon = vt.icon;
                const isSelected = selectedType === vt.id;
                return (
                  <button
                    key={vt.id}
                    onClick={() => setSelectedType(vt.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#141820] border-[#d4af37] text-[#f5f5f3]'
                        : 'bg-[#0e1115] border-[#1e232d] text-[#8e94a0] hover:border-[#2f3746] hover:text-[#f5f5f3]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#d4af37]' : 'text-[#646a78]'}`} />
                    <span className="text-xs font-medium leading-tight">{vt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Script Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#f5f5f3]">
                Script parlé de l&apos;acteur
              </label>
              <span className="text-[11px] font-mono text-[#646a78] tabular-nums">
                {scriptContent.length} caractères • ~24s
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={scriptContent}
                onChange={handleScriptChange}
                className="w-full p-3.5 text-xs bg-[#0e1115] border border-[#1e232d] rounded-xl text-[#f5f5f3] leading-relaxed focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                placeholder="Rédigez votre script UGC ici..."
              />
            </div>
          </div>

          {/* Voice & Virtual Actor Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice Profile */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#f5f5f3]">
                  Voix de narration
                </label>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{isSpeaking ? 'Arrêter' : 'Auditionner (0€)'}</span>
                </button>
              </div>

              <select
                value={selectedVoice.id}
                onChange={(e) => {
                  const v = VOICE_PROFILES.find((p) => p.id === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
                className="w-full px-3 py-2 text-xs bg-[#0e1115] border border-[#1e232d] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
              >
                {VOICE_PROFILES.map((vp) => (
                  <option key={vp.id} value={vp.id}>
                    {vp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#f5f5f3]">
                Intonation
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#0e1115] border border-[#1e232d] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-colors cursor-pointer"
              >
                <option value="Énergique">Énergique & Dynamique</option>
                <option value="Authentique">Authentique & Spontané</option>
                <option value="Rassurant">Posé & Rassurant</option>
                <option value="Storytelling">Storytelling Émotionnel</option>
              </select>
            </div>
          </div>

          {/* Virtual Actors Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#f5f5f3]">
                Acteur virtuel (Avatar Studio)
              </label>
              <span className="text-[10px] font-mono text-[#d4af37]">
                Inclus • 0.00 €
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {VIRTUAL_ACTORS.map((act) => {
                const isSelected = selectedActor.id === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActor(act)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-colors text-center cursor-pointer ${
                      isSelected
                        ? 'bg-[#141820] border-[#d4af37]'
                        : 'bg-[#0e1115] border-[#1e232d] hover:border-[#2f3746]'
                    }`}
                  >
                    <img
                      src={act.avatarUrl}
                      alt={act.name}
                      className="w-12 h-12 rounded-full object-cover mb-1.5 border border-[#1e232d]"
                    />
                    <span className="text-xs font-medium text-[#f5f5f3] truncate w-full">
                      {act.name}
                    </span>
                    <span className="text-[9px] text-[#8e94a0] truncate w-full">{act.style}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 9:16 Video Player Container (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Smartphone Frame */}
          <div className="relative w-full max-w-[290px] aspect-[9/16] bg-[#000] rounded-[28px] p-2 border border-[#212630] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Screen Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-[#0e1014] rounded-full z-20 border border-[#1c2028]" />

            {/* Remotion Player Canvas with Kinetic Subtitles & Controls */}
            <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-black flex items-center justify-center">
              <RemotionUgcPlayer
                avatarUrl={selectedActor.avatarUrl}
                scriptText={scriptContent}
                ctaText="Découvrir l'offre 👉"
                brandName={userProfile.studioName}
              />

              {/* Generating overlay animation */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 space-y-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
                  <div>
                    <p className="text-xs font-medium text-[#f5f5f3]">Génération vidéo autonome</p>
                    <p className="text-[10px] text-[#8e94a0] mt-0.5 font-mono">
                      Assemblage Remotion & Sous-titres...
                    </p>
                  </div>
                  <div className="w-full bg-[#1c2028] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#d4af37] h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#d4af37] font-mono tabular-nums">
                    {generationProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button Below Phone */}
          <div className="w-full max-w-[290px] mt-4 space-y-2">
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#d4af37] text-[#07080a] font-semibold text-xs hover:bg-[#e0be48] active:bg-[#b89528] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{t.generateVideoBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] font-mono text-center text-[#646a78]">
              Coût estimé : <span className="text-emerald-400 font-semibold">0.00 €</span> (Mode 100% Autonome & Gratuit)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
