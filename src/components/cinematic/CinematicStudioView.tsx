'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Film,
  Camera,
  Play,
  Clock,
  Layers,
  ChevronRight,
  Maximize2,
  Check,
  Plus,
  SlidersHorizontal,
  Video,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';
import { StoryboardScene } from '@/lib/types';

/**
 * Cinematic Studio View — Unslopped & Director-Grade Edition
 * 
 * Design Principles:
 * - World: Production monitor / Editing suite (Graphite & matte black, hairline borders, calm neutrals)
 * - Signature: Real camera metadata HUD (Timecodes, focal lengths, 24fps)
 * - Typography: Sentence case, tabular numbers, weights 400 & 500
 * - Motion: Zero zoom scaling; intentional hairline and opacity transitions
 */

export const CinematicStudioView: React.FC = () => {
  const { language, cinematicProject, updateCinematicProject } = useApp();
  const t = TRANSLATIONS[language].cinematic;

  const [activeStep, setActiveStep] = useState<number>(2);
  const [description, setDescription] = useState(cinematicProject.description);
  const [visualStyle, setVisualStyle] = useState(cinematicProject.visualStyle);
  const [targetDuration, setTargetDuration] = useState(cinematicProject.targetDuration);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [selectedScene, setSelectedScene] = useState<StoryboardScene | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const handleGenerateStoryboard = () => {
    setIsGeneratingStoryboard(true);
    setTimeout(() => {
      setIsGeneratingStoryboard(false);
      const generatedScenes: StoryboardScene[] = [
        {
          id: `sc-${Date.now()}-1`,
          sceneNumber: 1,
          title: '1. Accroche Visuelle',
          shotType: 'Plan large • 3s',
          durationSec: 3,
          description: description || 'Ouverture contemplative créant l\'attente et l\'atmosphère.',
          cameraMovement: 'Travelling lent vers l\'avant.',
          lighting: 'Golden hour douce avec lumière volumétrique.',
          prompt: `Cinematic wide establishing shot, ${visualStyle}, 8k film aesthetic, arri alexa`,
          imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: `sc-${Date.now()}-2`,
          sceneNumber: 2,
          title: '2. Focus Produit',
          shotType: 'Gros plan • 5s',
          durationSec: 5,
          description: 'Mise en valeur macro des détails, des textures et du design.',
          cameraMovement: 'Macro tilt fluide à 60fps.',
          lighting: 'Lumière studio douce avec reflets dorés épurés.',
          prompt: `Macro luxury product cinematography, ${visualStyle}, 8k, soft golden backlighting`,
          imageUrl: 'https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: `sc-${Date.now()}-3`,
          sceneNumber: 3,
          title: '3. Mise en Situation',
          shotType: 'Plan moyen • 5s',
          durationSec: 5,
          description: 'Expérience immersive et sensations d\'utilisation en situation réelle.',
          cameraMovement: 'Arc rotatif subtil.',
          lighting: 'Éclairage naturel immersif.',
          prompt: `Medium close-up of luxury aesthetic commercial usage, 35mm film grain, bokeh`,
          imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
        },
        {
          id: `sc-${Date.now()}-4`,
          sceneNumber: 4,
          title: '4. Hero Shot & CTA',
          shotType: 'Plan final • 3s',
          durationSec: 3,
          description: 'Packshot héroïque final avec identité de marque et appel à l\'action.',
          cameraMovement: 'Plan fixe héroïque.',
          lighting: 'Lumière zénithale épurée.',
          prompt: `Hero packshot of product on podium, 8k commercial finish`,
          imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
        }
      ];
      updateCinematicProject({
        ...cinematicProject,
        description,
        visualStyle,
        targetDuration,
        scenes: generatedScenes
      });
      setActiveStep(2);
    }, 1200);
  };

  const stepsList = [
    { num: 1, label: 'Concept & Brief' },
    { num: 2, label: 'Préproduction & Storyboard' },
    { num: 3, label: 'Génération Rushes' },
    { num: 4, label: 'Montage & Export 4K' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1b1f27]">
        <div>
          <h1 className="text-xl font-semibold text-[#f5f5f3] tracking-tight">
            Cinematic Studio
          </h1>
          <p className="text-xs text-[#9ba1ad] mt-0.5">
            Direction artistique et découpage technique de spots publicitaires de prestige
          </p>
        </div>

        <button
          onClick={() => {
            setDescription('');
            setActiveStep(1);
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#14181f] text-[#d4af37] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#191f28] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau projet</span>
        </button>
      </div>

      {/* Director Stepper with Connected Progress Rail */}
      <div className="relative flex items-center justify-between max-w-2xl mx-auto py-2">
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

      {/* Main Studio Workspace: Form (Left 4 cols) & Storyboard (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Camera & Concept Configuration */}
        <div className="lg:col-span-4 bg-[#0e1115] border border-[#1e232d] rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1b1f27]">
            <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
            <h2 className="text-xs font-semibold text-[#f5f5f3]">
              Paramètres de réalisation
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#9ba1ad] block">
              Description de la scène et intentions
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-[#07080a] border border-[#212630] rounded-lg text-[#f5f5f3] leading-relaxed focus:outline-none focus:border-[#d4af37]/60 transition-colors resize-none placeholder:text-[#454c5a]"
              placeholder="Décrivez l'ambiance, les mouvements de caméra et la composition des plans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#9ba1ad] block">
              Style visuel & optiques
            </label>
            <select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#07080a] border border-[#212630] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]/60 transition-colors cursor-pointer"
            >
              <option value="Cinématique">Cinématique Haute Couture (Arri Alexa LF)</option>
              <option value="Warm Grain">Pellicule 35mm grain chaud (Kodak Vision3)</option>
              <option value="Moody Luxury">Luxe épuré & ombres profondes (Cooke S4/i)</option>
              <option value="Commercial High Speed">Ralenti commercial 120fps (Phantom Flex)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#9ba1ad] block">
              Format et durée cible
            </label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-[#07080a] border border-[#212630] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]/60 transition-colors cursor-pointer"
            >
              <option value="15-30 sec">15-30 secondes (Teaser réseaux sociaux)</option>
              <option value="30-60 sec">30-60 secondes (Spot publicitaire principal)</option>
              <option value="60-90 sec">60-90 secondes (Film de marque narratif)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateStoryboard}
              disabled={isGeneratingStoryboard}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#d4af37] text-[#07080a] font-medium text-xs hover:bg-[#e0bc45] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isGeneratingStoryboard ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calcul du découpage technique...</span>
                </>
              ) : (
                <>
                  <span>Générer le storyboard technique</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Storyboard Rushes (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#d4af37]" />
              <h2 className="text-xs font-semibold text-[#f5f5f3]">
                Découpage storyboard
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[#646a78] tabular-nums">
              {cinematicProject.scenes.length > 0
                ? `${cinematicProject.scenes.length} plans • 00:00:${String(cinematicProject.scenes.reduce((acc, s) => acc + s.durationSec, 0)).padStart(2, '0')}:00 au total`
                : 'En attente de brief'}
            </span>
          </div>

          {cinematicProject.scenes.length === 0 ? (
            <div className="py-12 px-6 rounded-xl bg-[#0e1115] border border-dashed border-[#1e232d] text-center space-y-2.5">
              <Film className="w-8 h-8 text-[#656a76] mx-auto" />
              <h3 className="text-xs font-medium text-[#f5f5f3]">Aucun storyboard actif pour le moment</h3>
              <p className="text-[11px] text-[#8e94a0] max-w-sm mx-auto">
                Renseignez votre description et vos optiques ci-contre, puis cliquez sur &quot;Générer le storyboard&quot; pour créer vos plans 16:9.
              </p>
            </div>
          ) : (
            /* 4 Cinematic Scene Cards Grid (16:9 Widescreen Aspect) */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cinematicProject.scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                  className="bg-[#0e1115] border border-[#1e232d] hover:border-[#384152] rounded-xl overflow-hidden group cursor-pointer transition-colors flex flex-col"
                >
                  {/* 16:9 Cinematic Video Viewport */}
                  <div className="relative aspect-video bg-[#050608] overflow-hidden">
                    <img
                      src={scene.imageUrl}
                      alt={scene.title}
                      className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                    />
                    
                    {/* Subtle Camera HUD Elements (Signature) */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 border border-white/10 font-mono text-[10px] text-[#d4af37] tabular-nums">
                      PLAN 0{idx + 1}
                    </div>

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 border border-white/10 font-mono text-[10px] text-[#9ba1ad] tabular-nums">
                      {`00:00:0${(idx + 1) * 4}:00`}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 p-1.5 rounded bg-black/70 border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Technical Meta Footer */}
                  <div className="p-3.5 flex items-center justify-between border-t border-[#181c24] bg-[#0c0e12]">
                    <div>
                      <h3 className="text-xs font-medium text-[#f5f5f3] group-hover:text-[#d4af37] transition-colors">
                        {scene.title}
                      </h3>
                      <p className="text-[11px] text-[#646a78] mt-0.5">
                        {scene.shotType}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-[#4d5464]">
                      35mm • 2.39:1
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assembly & Timeline Ribbon */}
          <div className="bg-[#0e1115] border border-[#1e232d] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#14181f] border border-[#212630] flex items-center justify-center text-[#d4af37]">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#f5f5f3]">
                  Montage FFmpeg & Rendu Master 4K
                </p>
                <p className="text-[11px] text-[#646a78]">
                  Transitions fondues, color grading cinéma et bande-son Dolby intégrée
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-[#14181f] border border-[#d4af37]/40 text-[#d4af37] hover:border-[#d4af37] hover:bg-[#191f28] transition-colors shrink-0"
            >
              <span>Lancer l&apos;assemblage final</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scene Detail & Technical Inspection Modal */}
      {selectedScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1115] border border-[#212630] rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1b1f27] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[#f5f5f3]">
                  {selectedScene.title}
                </h3>
                <p className="font-mono text-[11px] text-[#646a78] mt-0.5">
                  {selectedScene.shotType} • Optique 35mm T1.5 • 24fps
                </p>
              </div>
              <button
                onClick={() => setSelectedScene(null)}
                className="text-[#646a78] hover:text-[#f5f5f3] p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cinematic Frame Viewport */}
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#212630] bg-black">
              <img
                src={selectedScene.imageUrl}
                alt={selectedScene.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Technical Specifications */}
            <div className="space-y-2 text-xs">
              <p className="text-[#f5f5f3]">
                <span className="text-[#9ba1ad]">Description :</span> {selectedScene.description}
              </p>
              <p className="text-[#9ba1ad]">
                <span className="text-[#f5f5f3]">Mouvement caméra :</span> {selectedScene.cameraMovement}
              </p>
              <p className="text-[#9ba1ad]">
                <span className="text-[#f5f5f3]">Éclairage & Mood :</span> {selectedScene.lighting}
              </p>
              <div className="bg-[#07080a] p-3 rounded-lg border border-[#1b1f27] font-mono text-[11px] text-[#9ba1ad] leading-relaxed">
                <span className="text-[#d4af37]">Prompt IA :</span> {selectedScene.prompt}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1b1f27]">
              <button
                onClick={() => setSelectedScene(null)}
                className="px-4 py-2 text-xs text-[#9ba1ad] hover:text-[#f5f5f3] font-medium transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setSelectedScene(null);
                }}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-[#d4af37] text-[#07080a] hover:bg-[#e0bc45] transition-colors"
              >
                Régénérer ce plan (ComfyUI / Rushes Libres 0€)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
