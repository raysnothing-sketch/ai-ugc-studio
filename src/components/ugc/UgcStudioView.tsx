'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Check,
  Star,
  Users,
  Package,
  Layers,
  BookOpen,
  Coffee,
  ChevronRight,
  Sliders,
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-gold-400 text-xs p-6 gap-3">
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" />
        <span className="font-mono tracking-wider">Chargement du moteur Remotion...</span>
      </div>
    ),
  }
);

export const UgcStudioView: React.FC = () => {
  const { language, scripts, updateScript, addVideoJob, setIsProductToAdModalOpen, userProfile } = useApp();
  const t = TRANSLATIONS[language].ugc;

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<UgcVideoType>('review');
  const [selectedActor, setSelectedActor] = useState(VIRTUAL_ACTORS[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0]);
  const [tone, setTone] = useState<string>('Énergique');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [videoGenerated, setVideoGenerated] = useState<boolean>(false);

  const activeScript = scripts[0];
  const [scriptContent, setScriptContent] = useState<string>(activeScript.fullText);

  const videoTypes: { id: UgcVideoType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'review', label: 'Product Review', icon: Star },
    { id: 'testimonial', label: 'Testimonial', icon: Users },
    { id: 'unboxing', label: 'Unboxing', icon: Package },
    { id: 'demonstration', label: 'Démonstration', icon: Layers },
    { id: 'storytelling', label: 'Storytelling', icon: BookOpen },
    { id: 'lifestyle', label: 'Lifestyle', icon: Coffee },
  ];

  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setScriptContent(val);
    updateScript(activeScript.id, val);
  };

  const handleGenerateVideo = () => {
    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setVideoGenerated(true);
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
              durationSec: 28,
              status: 'completed',
              estimatedCostEur: 1.45,
              createdAt: new Date().toISOString()
            });
          }, 800);
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">
            {t.title}
          </h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStep(4)}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#14161a] border border-[#232730] text-[#f5f5f3] hover:border-[#d4af37]/40 transition-colors"
          >
            {t.myCreations}
          </button>
          <button
            onClick={() => setIsProductToAdModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all"
          >
            {t.generateVideo}
          </button>
        </div>
      </div>

      {/* Stepper (Script -> Acteur -> Personnalisation -> Aperçu) */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 py-3 border-y border-[#22262e] text-xs">
        {t.steps.map((stepName, idx) => {
          const stepNum = idx + 1;
          const isCurrent = activeStep === stepNum;
          const isDone = activeStep > stepNum;

          return (
            <button
              key={stepName}
              onClick={() => setActiveStep(stepNum)}
              className="flex items-center gap-2 group transition-colors"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                  isCurrent
                    ? 'bg-[#d4af37] text-[#0c0d0f] ring-4 ring-[#d4af37]/20 shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#191c22] text-[#8e94a0] border border-[#232730]'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span
                className={`font-medium hidden sm:inline ${
                  isCurrent ? 'text-[#f5f5f3]' : 'text-[#8e94a0] group-hover:text-[#f5f5f3]'
                }`}
              >
                {stepName}
              </span>
              {idx < t.steps.length - 1 && (
                <span className="text-[#363c48] ml-2 hidden sm:inline">→</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Video Type Selection */}
          {activeStep >= 1 && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
                {t.videoType}
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {videoTypes.map((vt) => {
                  const Icon = vt.icon;
                  const isSelected = selectedType === vt.id;
                  return (
                    <button
                      key={vt.id}
                      onClick={() => setSelectedType(vt.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all group ${
                        isSelected
                          ? 'bg-[#1c1f26] border-[#d4af37] text-[#f5f5f3] shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-[#d4af37]/40'
                          : 'bg-[#14161a] border-[#232730] text-[#8e94a0] hover:border-[#363c48] hover:text-[#f5f5f3]'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg mb-1.5 transition-colors ${
                          isSelected ? 'bg-[#d4af37]/20 text-gold-400' : 'bg-[#191c22] text-[#656a76]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium leading-tight">{vt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Script Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
                {t.yourScript}
              </label>
              <span className="text-[11px] text-[#8e94a0]">
                {scriptContent.length} caractères • ~28s
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                value={scriptContent}
                onChange={handleScriptChange}
                className="w-full p-4 text-xs bg-[#14161a] border border-[#232730] rounded-xl text-[#f5f5f3] leading-relaxed focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition-all resize-none shadow-card"
                placeholder="Rédigez votre script UGC ici..."
              />
              <button
                onClick={() => {
                  setScriptContent(
                    "Vous ne croirez jamais ce que ce produit a changé dans mon quotidien. Après 3 semaines de test sans filtre, les résultats dépassent largement mes attentes. Cliquez sur le lien pour en savoir plus !"
                  );
                }}
                className="absolute right-3 bottom-3 px-2 py-1 text-[10px] font-medium bg-[#1e222a] border border-[#2b2f3a] text-gold-400 hover:border-[#d4af37] rounded flex items-center gap-1 transition-colors"
                title="Régénérer avec l'IA"
              >
                <Sparkles className="w-3 h-3" />
                Variante IA
              </button>
            </div>
          </div>

          {/* STEP 2: Actor & Voice Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tone selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
                {t.voiceTone}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-[#14161a] border border-[#232730] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
              >
                <option value="Énergique">Énergique & Motivante</option>
                <option value="Chaleureux">Chaleureux & Spontané</option>
                <option value="Professionnel">Professionnel & Expert</option>
                <option value="Inspirant">Inspirant & Storytelling</option>
                <option value="Doux">Doux & Sensoriel</option>
              </select>
            </div>

            {/* Voice Provider selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
                Voix Synthétique (TTS)
              </label>
              <select
                value={selectedVoice.id}
                onChange={(e) => {
                  const v = VOICE_PROFILES.find((p) => p.id === e.target.value);
                  if (v) setSelectedVoice(v);
                }}
                className="w-full px-3.5 py-2 text-xs bg-[#14161a] border border-[#232730] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
              >
                {VOICE_PROFILES.map((vp) => (
                  <option key={vp.id} value={vp.id}>
                    {vp.name} ({vp.provider})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Virtual Actors Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
                Acteur Virtuel (Avatar)
              </label>
              <span className="text-[11px] text-[#8e94a0]">HeyGen / Custom</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {VIRTUAL_ACTORS.map((act) => {
                const isSelected = selectedActor.id === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => setSelectedActor(act)}
                    className={`flex flex-col items-center p-2 rounded-xl border transition-all text-center ${
                      isSelected
                        ? 'bg-[#1c1f26] border-[#d4af37] ring-2 ring-[#d4af37]/30 shadow-gold'
                        : 'bg-[#14161a] border-[#232730] hover:border-[#363c48]'
                    }`}
                  >
                    <img
                      src={act.avatarUrl}
                      alt={act.name}
                      className="w-12 h-12 rounded-full object-cover mb-1 border border-[#2b2f3a]"
                    />
                    <span className="text-xs font-semibold text-[#f5f5f3] truncate w-full">
                      {act.name}
                    </span>
                    <span className="text-[9px] text-gold-400 truncate w-full">{act.style}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 9:16 Video Player Container (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Smartphone Frame */}
          <div className="relative w-full max-w-[290px] aspect-[9/16] bg-[#000] rounded-[32px] p-2.5 shadow-2xl border-4 border-[#232730] flex flex-col justify-between overflow-hidden">
            {/* Screen Notch / Speaker bar */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-[#14161a] rounded-full z-20" />

            {/* Remotion Player Canvas with Kinetic Subtitles & Controls */}
            <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-black flex items-center justify-center">
              <RemotionUgcPlayer
                avatarUrl={selectedActor.avatarUrl}
                scriptText={scriptContent}
                ctaText="Découvrir l'offre 👉"
                brandName={userProfile.studioName}
              />

              {/* Generating overlay animation */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-40 space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin" />
                  <div>
                    <p className="text-xs font-bold text-[#f5f5f3]">Génération vidéo IA en cours</p>
                    <p className="text-[11px] text-[#8e94a0] mt-1">
                      Synthèse vocale & Synchronisation labiale...
                    </p>
                  </div>
                  <div className="w-full bg-[#232730] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#d4af37] to-[#e5c05d] h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gold-400 font-mono font-semibold">
                    {generationProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button Below Phone: "Générer la vidéo ->" */}
          <div className="w-full max-w-[290px] mt-4 space-y-2">
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:from-[#e5c05d] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span>{t.generateVideoBtn}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-[#656a76]">
              Coût estimé : <span className="text-gold-400 font-medium">~1.45 €</span> (HeyGen API + ElevenLabs)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
