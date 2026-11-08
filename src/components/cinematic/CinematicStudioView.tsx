'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Film,
  Sparkles,
  Camera,
  Play,
  RotateCw,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
  Check,
  Plus
} from 'lucide-react';
import { StoryboardScene } from '@/lib/types';

export const CinematicStudioView: React.FC = () => {
  const { language, cinematicProject, updateCinematicProject } = useApp();
  const t = TRANSLATIONS[language].cinematic;

  const [activeStep, setActiveStep] = useState<number>(2);
  const [description, setDescription] = useState(cinematicProject.description);
  const [visualStyle, setVisualStyle] = useState(cinematicProject.visualStyle);
  const [targetDuration, setTargetDuration] = useState(cinematicProject.targetDuration);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [selectedScene, setSelectedScene] = useState<StoryboardScene | null>(null);

  const handleGenerateStoryboard = () => {
    setIsGeneratingStoryboard(true);
    setTimeout(() => {
      setIsGeneratingStoryboard(false);
      setActiveStep(2);
    }, 1200);
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

        <button
          onClick={() => {
            setDescription('');
            setActiveStep(1);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all"
        >
          <span>{t.newProject}</span>
        </button>
      </div>

      {/* Stepper (Concept -> Préproduction -> Génération -> Montage) */}
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
                    ? 'bg-[#d4af37] text-[#0c0d0f] ring-4 ring-[#d4af37]/20 shadow-gold'
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

      {/* Main Layout: Form (Left) & Storyboard Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Description & Settings (4 cols) */}
        <div className="lg:col-span-4 bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
              {t.descriptionLabel}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] leading-relaxed focus:outline-none focus:border-[#d4af37] transition-all resize-none font-sans"
              placeholder="Décrivez l'ambiance, les plans et l'émotion..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
              {t.visualStyleLabel}
            </label>
            <select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
            >
              <option value="Cinématique">Cinématique Haute Couture</option>
              <option value="Warm Grain">Pellicule 35mm Grain Chaud</option>
              <option value="Moody Luxury">Luxe Épuré & Ombres Profondes</option>
              <option value="Commercial High Speed">Ralenti Commercial 120fps</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] block">
              {t.targetDurationLabel}
            </label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
            >
              <option value="15-30 sec">15-30 sec (Idéal Réseaux & Teaser)</option>
              <option value="30-60 sec">30-60 sec (Spot Marque / Site Web)</option>
              <option value="60-90 sec">60-90 sec (Brand Movie Long)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateStoryboard}
              disabled={isGeneratingStoryboard}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:from-[#e5c05d] transition-all disabled:opacity-50"
            >
              {isGeneratingStoryboard ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Génération de la direction artistique...</span>
                </>
              ) : (
                <>
                  <span>{t.generateStoryboard}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Storyboard Scene Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.storyboard}
            </h3>
            <span className="text-[11px] text-[#8e94a0]">
              4 scènes • 16 secondes au total
            </span>
          </div>

          {/* 4 Scene Cards Grid (Exactly as seen in Mockup 4) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cinematicProject.scenes.map((scene) => (
              <div
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/60 rounded-xl overflow-hidden transition-all group cursor-pointer shadow-card flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/5] bg-black/60 overflow-hidden">
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>

                {/* Scene Meta */}
                <div className="p-2.5">
                  <h4 className="text-xs font-bold text-[#f5f5f3] group-hover:text-gold-400 transition-colors">
                    {scene.title}
                  </h4>
                  <p className="text-[10px] text-[#8e94a0] mt-0.5 font-medium">
                    {scene.shotType}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Assemble / Export Bar */}
          <div className="bg-[#14161a] border border-[#232730] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#191c22] border border-[#2b2f3a] flex items-center justify-center text-gold-400">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#f5f5f3]">
                  Montage FFmpeg & Rendu 4K
                </p>
                <p className="text-[11px] text-[#8e94a0]">
                  Transitions fondues, color grading cinéma et bande-son intégrée
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#1e222a] border border-[#d4af37]/40 text-gold-400 hover:bg-[#252a34] hover:border-[#d4af37] transition-all"
            >
              <span>Lancer l&apos;assemblage final</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scene Detail Modal */}
      {selectedScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <h3 className="text-base font-bold text-[#f5f5f3]">
                {selectedScene.title} — {selectedScene.shotType}
              </h3>
              <button
                onClick={() => setSelectedScene(null)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#232730]">
              <img
                src={selectedScene.imageUrl}
                alt={selectedScene.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#f5f5f3]">
                <strong className="text-gold-400">Description :</strong> {selectedScene.description}
              </p>
              <p className="text-[#8e94a0]">
                <strong className="text-[#f5f5f3]">Mouvement caméra :</strong> {selectedScene.cameraMovement}
              </p>
              <p className="text-[#8e94a0]">
                <strong className="text-[#f5f5f3]">Éclairage & Mood :</strong> {selectedScene.lighting}
              </p>
              <div className="bg-[#0c0d0f] p-2.5 rounded-lg border border-[#232730] font-mono text-[10px] text-gold-300">
                Prompt IA : {selectedScene.prompt}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#22262e]">
              <button
                onClick={() => setSelectedScene(null)}
                className="px-4 py-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  alert("Régénération du plan lancée avec Runway / Luma AI.");
                  setSelectedScene(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
              >
                Régénérer ce plan (Runway / Luma)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
