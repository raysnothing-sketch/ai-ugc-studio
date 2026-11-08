'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, Video, Music, FileText, Download, HardDrive, Upload, Filter } from 'lucide-react';

export const MediaLibraryView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'audio'>('all');

  const mediaFiles = [
    {
      id: 'm-1',
      name: 'packshot-hero-minimalist-studio.jpg',
      type: 'image',
      size: '2.4 Mo',
      date: 'Récemment synchronisé',
      r2Key: 'studio/assets/images/hero-packshot.jpg',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'm-2',
      name: 'rendu-cinematique-macro-produit-4k.mp4',
      type: 'video',
      size: '48.2 Mo',
      date: 'Récemment synchronisé',
      r2Key: 'studio/projects/cinematic/scene-2-macro.mp4',
      url: 'https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'm-3',
      name: 'synthese-vocale-elevenlabs-klara-de.mp3',
      type: 'audio',
      size: '1.1 Mo',
      date: 'Récemment synchronisé',
      r2Key: 'studio/audio/vo-klara-de.mp3',
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'm-4',
      name: 'visuel-direction-artistique-lifestyle.jpg',
      type: 'image',
      size: '3.8 Mo',
      date: 'Récemment synchronisé',
      r2Key: 'studio/portfolio/lifestyle-shot.jpg',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const filtered = mediaFiles.filter((m) => {
    if (filter === 'all') return true;
    return m.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Médiathèque Cloudflare R2</h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            Stockage objet sécurisé pour l&apos;ensemble de vos vidéos 4K, voix synthétiques, visuels HD et masters.
          </p>
        </div>

        <button
          onClick={() => alert('Sélectionnez un fichier local à téléverser vers votre bucket Cloudflare R2.')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Téléverser un média</span>
        </button>
      </div>

      {/* Storage stats */}
      <div className="bg-[#14161a] border border-[#232730] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gold-500/15 text-gold-400 border border-gold-500/20">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-[#f5f5f3]">Bucket Cloudflare R2 : ai-ugc-studio-prod</p>
            <p className="text-[#8e94a0]">14.8 Go utilisés sur 50 Go (Formule R2 Pro)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'video', 'image', 'audio'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium uppercase transition-colors ${
                filter === f ? 'bg-gold-500 text-[#0c0d0f]' : 'bg-[#191c22] text-[#8e94a0] hover:text-[#f5f5f3]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/40 rounded-xl overflow-hidden shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
              {item.type === 'audio' ? (
                <div className="flex flex-col items-center gap-2 text-gold-400">
                  <Music className="w-8 h-8" />
                  <span className="text-[10px] font-mono">Fichier Audio Master</span>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-bold uppercase text-gold-400">
                {item.type}
              </div>
            </div>

            <div className="p-3 space-y-1.5">
              <h4 className="text-xs font-bold text-[#f5f5f3] truncate font-mono">{item.name}</h4>
              <p className="text-[10px] text-[#656a76] truncate font-mono">{item.r2Key}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#22262e] text-[11px] text-[#8e94a0]">
                <span>{item.size} • {item.date}</span>
                <button
                  onClick={() => alert(`Téléchargement de ${item.name} démarré via URL signée R2.`)}
                  className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
