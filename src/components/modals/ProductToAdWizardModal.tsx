'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Download,
  ShieldAlert,
  Zap,
  DollarSign,
  Film,
  Layers,
  ChevronRight
} from 'lucide-react';
import { VIRTUAL_ACTORS, VOICE_PROFILES } from '@/lib/initial-data';

export const ProductToAdWizardModal: React.FC = () => {
  const { isProductToAdModalOpen, setIsProductToAdModalOpen, addVideoJob, addProject, userProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedScriptIdx, setSelectedScriptIdx] = useState<number>(0);
  const [selectedActor, setSelectedActor] = useState(VIRTUAL_ACTORS[0]);
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PROFILES[0]);
  const [videoFormat, setVideoFormat] = useState<'9:16' | '16:9'>('9:16');

  // Generation state
  const [isAssembling, setIsAssembling] = useState(false);
  const [substepIndex, setSubstepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  if (!isProductToAdModalOpen) return null;

  const currentProductName = productName.trim() || 'Votre Produit';

  const generatedScripts = [
    {
      title: 'Script 1 — Test UGC Direct & Énergique (Recommandé)',
      hook: `Voici la plus grande erreur que vous faites avec vos produits du quotidien...`,
      body: `Depuis que j'utilise ${currentProductName}, tout est devenu 10 fois plus simple et rapide. La qualité est incomparable et les résultats sont visibles immédiatement.`,
      cta: `Cliquez sur le lien ci-dessous pour profiter de l'offre exclusive !`
    },
    {
      title: 'Script 2 — Déballage & Découverte Sans Filtre',
      hook: `Regardez ce que je viens de recevoir aujourd'hui...`,
      body: `Voici ${currentProductName}. Dès l'ouverture, la finition est incroyable et l'efficacité est au rendez-vous. C'est exactement ce qu'il me fallait.`,
      cta: `Lien direct en bio avec livraison express garantie.`
    },
    {
      title: 'Script 3 — Storytelling & Témoignage Émotionnel',
      hook: `Si vous hésitez encore à passer le cap, écoutez bien ceci...`,
      body: `Après plusieurs semaines de test réel, ${currentProductName} a dépassé toutes mes attentes. C'est l'un de mes meilleurs investissements de l'année.`,
      cta: `Testez par vous-même avec la garantie satisfait ou remboursé.`
    }
  ];

  const assemblyPipelineSteps = [
    'Extraction des informations accessibles...',
    `Analyse des points forts de ${currentProductName}...`,
    'Identification de l\'audience cible et motivations...',
    'Positionnement & angles publicitaires...',
    'Génération des variantes de scripts...',
    'Sélection de l\'acteur virtuel & voix multilingue...',
    'Génération du flux vidéo de l\'avatar...',
    'Synthèse vocale neuronale ElevenLabs...',
    'Génération des plans B-Roll et produit...',
    'Assemblage audio et synchronisation labiale...',
    'Incrustation des sous-titres dynamiques...',
    'Ajout du logo de marque & CTA animé...',
    'Encodage FFmpeg MP4 H.264 optimisé...',
    'Vidéo prête pour diffusion !'
  ];

  const handleStartAssembly = () => {
    setIsAssembling(true);
    setSubstepIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setSubstepIndex(current);
      if (current >= assemblyPipelineSteps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAssembling(false);
          setIsCompleted(true);
          setStep(5);

          // Save completed video job into state
          addVideoJob({
            id: `p2a-${Date.now()}`,
            title: `Product-to-Ad : ${currentProductName}`,
            productName: currentProductName,
            videoType: 'review',
            format: videoFormat,
            actorId: selectedActor.id,
            actorName: selectedActor.name,
            voiceName: selectedVoice.name,
            scriptText: `${generatedScripts[selectedScriptIdx].hook} ${generatedScripts[selectedScriptIdx].body} ${generatedScripts[selectedScriptIdx].cta}`,
            videoUrl: selectedActor.avatarUrl,
            durationSec: 28,
            status: 'completed',
            estimatedCostEur: 1.45,
            createdAt: new Date().toISOString()
          });
        }, 600);
      }
    }, 450);
  };

  const handleClose = () => {
    setIsProductToAdModalOpen(false);
    setStep(1);
    setIsCompleted(false);
    setIsAssembling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Wizard Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22262e] bg-[#111317]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f5f5f3]">
                Workflow Product-to-Ad
              </h2>
              <p className="text-[11px] text-[#8e94a0]">
                De l&apos;URL produit à la vidéo publicitaire finale en 5 étapes guidées
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-[#8e94a0] hover:text-[#f5f5f3] p-1.5 rounded-lg hover:bg-[#1a1d24]"
          >
            ✕
          </button>
        </div>

        {/* Stepper Progress bar */}
        <div className="px-6 py-2.5 bg-[#0c0d0f] border-b border-[#22262e] flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Produit' },
            { num: 2, label: 'Stratégie' },
            { num: 3, label: 'Script' },
            { num: 4, label: 'Validation Coût' },
            { num: 5, label: 'Aperçu & Export' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-gold-500 text-[#0c0d0f]'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#232730] text-[#8e94a0]'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span
                className={`hidden sm:inline font-medium text-[11px] ${
                  step === s.num ? 'text-[#f5f5f3]' : 'text-[#656a76]'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* STEP 1: Product Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#191c22] border border-[#232730] space-y-2">
                <label className="text-xs font-semibold text-[#f5f5f3] uppercase tracking-wider block">
                  1. Saisissez l&apos;URL de votre produit ou fiche e-commerce
                </label>
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => {
                    setProductUrl(e.target.value);
                    if (!productName) {
                      const detected = e.target.value.split('/').filter(Boolean).pop()?.replace(/-/g, ' ');
                      if (detected) setProductName(detected.charAt(0).toUpperCase() + detected.slice(1));
                    }
                  }}
                  placeholder="https://votre-boutique.com/produit"
                  className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-xs text-[#f5f5f3] font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#191c22] rounded-lg border border-[#232730]">
                  <span className="text-[#8e94a0] block text-[11px]">Nom du produit :</span>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ex : Soin Botanique Naturel / Écouteurs Studio / Accessoire Mode"
                    className="w-full mt-1 p-1.5 bg-[#0c0d0f] border border-[#232730] rounded text-[#f5f5f3] font-semibold"
                  />
                </div>
                <div className="p-3 bg-[#191c22] rounded-lg border border-[#232730]">
                  <span className="text-[#8e94a0] block text-[11px]">Format de rendu :</span>
                  <select
                    value={videoFormat}
                    onChange={(e) => setVideoFormat(e.target.value as any)}
                    className="w-full mt-1 p-1.5 bg-[#0c0d0f] border border-[#232730] rounded text-[#f5f5f3] font-semibold"
                  >
                    <option value="9:16">9:16 — TikTok, Instagram Reels, Shorts</option>
                    <option value="16:9">16:9 — YouTube, Site web, Présentation</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Marketing Synthesis */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-[#191c22] border border-[#232730] space-y-2">
                <h3 className="font-bold text-sm text-[#f5f5f3] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Analyse IA prête pour {currentProductName}
                </h3>
                <p className="text-[#8e94a0] leading-relaxed">
                  L&apos;IA a identifié les bénéfices clés, le positionnement commercial et formulé 3 scripts publicitaires à fort impact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#14161a] border border-[#232730]">
                  <span className="text-gold-400 font-semibold block text-[11px]">Cible Prioritaire</span>
                  <p className="text-[#f5f5f3] font-medium mt-1">25-45 ans, consommateurs actifs</p>
                </div>
                <div className="p-3 rounded-lg bg-[#14161a] border border-[#232730]">
                  <span className="text-gold-400 font-semibold block text-[11px]">Bénéfice Clé</span>
                  <p className="text-[#f5f5f3] font-medium mt-1">Efficacité prouvée & gain de temps</p>
                </div>
                <div className="p-3 rounded-lg bg-[#14161a] border border-[#232730]">
                  <span className="text-gold-400 font-semibold block text-[11px]">Ton recommandé</span>
                  <p className="text-[#f5f5f3] font-medium mt-1">Authentique, crédible & direct</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Script Selection */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-[#8e94a0]">
                Choisissez le script généré pour la vidéo de {currentProductName} :
              </p>

              <div className="space-y-3">
                {generatedScripts.map((scr, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedScriptIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedScriptIdx === idx
                        ? 'bg-[#1c1f26] border-gold-500 shadow-gold'
                        : 'bg-[#191c22] border-[#232730] hover:border-[#363c48]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-[#f5f5f3]">{scr.title}</h4>
                      {selectedScriptIdx === idx && (
                        <span className="text-[10px] font-semibold text-gold-400 bg-gold-500/20 px-2 py-0.5 rounded-full">
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gold-300 font-medium mb-1">&quot;{scr.hook}&quot;</p>
                    <p className="text-xs text-[#8e94a0] leading-relaxed">{scr.body}</p>
                    <p className="text-xs text-emerald-400 font-medium mt-1">CTA : {scr.cta}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Actor & Cost Confirmation */}
          {step === 4 && !isAssembling && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  Contrôle Utilisateur & Maîtrise des Coûts (Section 13.2)
                </div>
                <p className="text-[#8e94a0] text-xs">
                  Aucune génération payante n&apos;est lancée sans votre validation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#191c22] border border-[#232730] space-y-2">
                  <span className="text-[11px] font-semibold text-gold-400 uppercase">Acteur & Voix</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedActor.avatarUrl}
                      alt={selectedActor.name}
                      className="w-10 h-10 rounded-full object-cover border border-gold-500/40"
                    />
                    <div>
                      <p className="font-bold text-[#f5f5f3]">{selectedActor.name}</p>
                      <p className="text-[#8e94a0] text-[11px]">{selectedVoice.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#191c22] border border-[#232730] space-y-2">
                  <span className="text-[11px] font-semibold text-gold-400 uppercase">Coût Estimé Transparent</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gold-400">1.45 €</span>
                    <span className="text-[#8e94a0] text-[11px]">(HeyGen Video + ElevenLabs Audio)</span>
                  </div>
                  <p className="text-[10px] text-[#656a76]">Temps estimé de rendu : ~45 secondes</p>
                </div>
              </div>
            </div>
          )}

          {/* Assembling Progress Screen */}
          {isAssembling && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-gold-500/30 border-t-gold-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-gold-400 absolute inset-0 m-auto animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#f5f5f3]">
                  Exécution du pipeline Product-to-Ad (14 étapes)
                </h3>
                <p className="text-xs text-gold-400 font-mono">
                  Étape {substepIndex + 1}/14 : {assemblyPipelineSteps[substepIndex]}
                </p>
              </div>

              <div className="w-full max-w-md bg-[#232730] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-gold-500 to-amber-300 h-full transition-all duration-300"
                  style={{ width: `${Math.round(((substepIndex + 1) / 14) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Final Preview & Export */}
          {step === 5 && isCompleted && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                Vidéo publicitaire assemblée avec succès ! Codec MP4 H.264 optimisé réseaux.
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* 9:16 Video Mockup Container */}
                <div className="w-48 aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-gold-500/40 relative shadow-2xl shrink-0">
                  <img
                    src={selectedActor.avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-2 right-2 text-center">
                    <span className="inline-block bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white border border-gold-400/50">
                      {generatedScripts[selectedScriptIdx].cta}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                    className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-gold-400 flex items-center justify-center text-white"
                  >
                    {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>

                {/* Details & Actions */}
                <div className="space-y-3 flex-1 text-xs">
                  <div>
                    <h3 className="text-sm font-bold text-[#f5f5f3]">
                      Campagne {currentProductName} — UGC Master
                    </h3>
                    <p className="text-[#8e94a0] mt-0.5">
                      Résolution 1080x1920 • 28 secondes • Débit 12 Mbps
                    </p>
                  </div>

                  <div className="p-3 bg-[#191c22] rounded-lg border border-[#232730] space-y-1 text-[#8e94a0]">
                    <p><strong className="text-[#f5f5f3]">Acteur :</strong> {selectedActor.name} ({selectedActor.style})</p>
                    <p><strong className="text-[#f5f5f3]">Voix :</strong> {selectedVoice.name}</p>
                    <p><strong className="text-[#f5f5f3]">Sous-titres :</strong> Intégrés et synchronisés</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => alert('Téléchargement de la vidéo MP4 haute définition démarré.')}
                      className="px-4 py-2 rounded-lg bg-gold-500 text-[#0c0d0f] font-bold text-xs hover:bg-gold-400 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Télécharger MP4
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 rounded-lg bg-[#232730] text-[#f5f5f3] font-semibold text-xs hover:bg-[#2b303c] transition-colors"
                    >
                      Enregistrer dans le studio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 py-4 border-t border-[#22262e] bg-[#111317] flex items-center justify-between">
          {step > 1 && step < 5 && !isAssembling ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 flex items-center gap-1.5 transition-colors"
            >
              <span>Continuer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && !isAssembling && (
            <button
              onClick={handleStartAssembly}
              className="px-6 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-gold-500 to-amber-400 text-[#0c0d0f] hover:from-gold-400 shadow-gold flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirmer & Lancer la production (1.45 €)</span>
            </button>
          )}

          {step === 5 && (
            <button
              onClick={handleClose}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
            >
              Terminer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
