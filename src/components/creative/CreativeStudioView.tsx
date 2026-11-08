'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Palette,
  Sparkles,
  Download,
  Image as ImageIcon,
  Layers,
  Wand2,
  Copy,
  Check,
  Plus
} from 'lucide-react';

export const CreativeStudioView: React.FC = () => {
  const { brandKit, updateBrandKit } = useApp();
  const [activeTab, setActiveTab] = useState<'visuals' | 'brandkit'>('visuals');
  const [prompt, setPrompt] = useState('Flacon de sérum cosmétique posé sur marbre blanc et pétales de rose séchés, éclairage studio doré, 8k');
  const [format, setFormat] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);

  const creativeAssets = [
    {
      id: 'cr-1',
      title: 'Publication Instagram — Actifs Botaniques',
      type: '1:1 Carré',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cr-2',
      title: 'Story / Reel — Routine Éclat Matinale',
      type: '9:16 Vertical',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cr-3',
      title: 'Bannière E-commerce — Offre de Lancement',
      type: '16:9 Paysage',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'cr-4',
      title: 'Carrousel Pédagogique — 3 Ingrédients Révolutionnaires',
      type: '1:1 Carré',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert('Visuel publicitaire généré avec succès ! Sauvegardé dans votre bibliothèque.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Creative Studio & Brand Kit</h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            Création de visuels publicitaires, carrousels réseaux sociaux et gestion des identités visuelles.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('visuals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'visuals'
                ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            Visuels & Déclinaisons
          </button>
          <button
            onClick={() => setActiveTab('brandkit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'brandkit'
                ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            Brand Kit ({brandKit.brandName})
          </button>
        </div>
      </div>

      {activeTab === 'visuals' ? (
        <>
          {/* AI Visual Generator Form */}
          <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-gold-400" />
              Générateur d&apos;Images Publicitaires IA
            </h3>

            <form onSubmit={handleGenerate} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Décrivez le visuel à générer..."
                  className="flex-1 px-4 py-2.5 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] focus:outline-none focus:border-[#d4af37]"
                />

                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] cursor-pointer"
                >
                  <option value="1:1">Format 1:1 Carré (Instagram Post)</option>
                  <option value="9:16">Format 9:16 Vertical (Story / TikTok)</option>
                  <option value="16:9">Format 16:9 Bannière (Web & Ads)</option>
                </select>

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all disabled:opacity-50 shrink-0"
                >
                  {isGenerating ? 'Génération...' : 'Générer le visuel'}
                </button>
              </div>
            </form>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creativeAssets.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/50 rounded-xl overflow-hidden shadow-card transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-black overflow-hidden">
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-gold-400">
                    {asset.type}
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-semibold text-[#f5f5f3] truncate">{asset.title}</h4>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#22262e] text-[11px]">
                    <span className="text-[#8e94a0]">PNG Haute Définition</span>
                    <button
                      onClick={() => alert('Téléchargement du visuel HD lancé.')}
                      className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium"
                    >
                      <Download className="w-3 h-3" /> Exporter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Brand Kit Manager */
        <div className="bg-[#14161a] border border-[#232730] rounded-xl p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-[#22262e] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#f5f5f3]">
                Charte Graphique & Identité : {brandKit.brandName}
              </h3>
              <p className="text-xs text-[#8e94a0]">
                Ces éléments sont automatiquement injectés dans les prompts d&apos;images, vidéos et scripts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Palette */}
            <div className="space-y-3">
              <label className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] block">
                Palette de Couleurs Officielles
              </label>
              <div className="flex items-center gap-3">
                {brandKit.palette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20 shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[10px] text-[#8e94a0]">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <label className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] block">
                Typographies de Marque
              </label>
              <div className="bg-[#191c22] p-3 rounded-lg border border-[#232730] space-y-1.5">
                <p className="text-[#f5f5f3]">
                  <strong>Titres & Accroches :</strong> {brandKit.headingFont}
                </p>
                <p className="text-[#8e94a0]">
                  <strong>Corps de texte :</strong> {brandKit.bodyFont}
                </p>
              </div>
            </div>

            {/* Brand Voice */}
            <div className="space-y-2">
              <label className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] block">
                Ton de Communication (Brand Voice)
              </label>
              <div className="p-3 bg-[#191c22] rounded-lg border border-[#232730] text-[#f5f5f3]">
                {brandKit.brandVoice}
              </div>
            </div>

            {/* Slogans */}
            <div className="space-y-2">
              <label className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] block">
                Slogans & Punchlines Autorisés
              </label>
              <ul className="space-y-1 p-3 bg-[#191c22] rounded-lg border border-[#232730] text-[#f5f5f3]">
                {brandKit.slogans.map((s, idx) => (
                  <li key={idx}>• &quot;{s}&quot;</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
