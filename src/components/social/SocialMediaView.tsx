'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Share2,
  Calendar,
  Sparkles,
  Instagram,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Hash
} from 'lucide-react';
import { SocialPost } from '@/lib/types';

export const SocialMediaView: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: 'sp-1',
      platform: 'tiktok',
      title: 'TikTok UGC — Hook Vendeur & Problème / Solution',
      caption: "Voici l'erreur que 90% des utilisateurs font avec ce type de produit... Après 3 semaines de test réel sans filtre, voici mon retour d'expérience complet !",
      hashtags: ['#ugcvideo', '#creativestudio', '#ugcfrance', '#growthmarketing', '#fyp'],
      mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      mediaType: 'video',
      scheduledDate: 'Demain à 18h30',
      status: 'ready'
    },
    {
      id: 'sp-2',
      platform: 'instagram',
      title: 'Carrousel Instagram — 3 Conseils Clés pour Captiver',
      caption: 'Comment optimiser vos campagnes et capter l\'attention dès les 3 premières secondes ? Découvrez notre guide visuel pas-à-pas ✨',
      hashtags: ['#contentcreator', '#marketingstrategy', '#creativeads', '#growth'],
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      mediaType: 'carousel',
      scheduledDate: 'Vendredi à 12h00',
      status: 'to_validate'
    },
    {
      id: 'sp-3',
      platform: 'linkedin',
      title: 'Post LinkedIn — Comment l\'IA optimise les flux de production vidéo',
      caption: 'Retour d\'expérience studio : comment concevoir des déclinaisons UGC multilingues (FR / DE / EN) avec une direction artistique cohérente et un retour sur investissement maîtrisé.',
      hashtags: ['#marketingdigital', '#intelligenceartificielle', '#freelancebusiness', '#ugc'],
      mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      scheduledDate: 'Lundi prochain',
      status: 'draft'
    }
  ]);

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [targetPlatform, setTargetPlatform] = useState<'instagram' | 'tiktok' | 'linkedin'>('tiktok');

  const handleGeneratePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    const newPost: SocialPost = {
      id: `sp-${Date.now()}`,
      platform: targetPlatform,
      title: `Publication ${targetPlatform.toUpperCase()} — ${topic}`,
      caption: `🔥 Découvrez notre nouvelle approche sur : ${topic}. Des résultats concrets et mesurables dès la première semaine. Qu'en pensez-vous en commentaires ? 👇`,
      hashtags: ['#trend', '#growth', '#studio', '#marketing'],
      mediaUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      scheduledDate: 'Prévu dans 3 jours',
      status: 'ready'
    };

    setPosts([newPost, ...posts]);
    setIsGeneratorOpen(false);
    setTopic('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#f5f5f3] tracking-tight">Social Media Manager</h1>
          <p className="text-xs text-[#8e94a0] mt-1">
            Calendrier éditorial, génération de légendes virales et déclinaison multi-plateformes.
          </p>
        </div>

        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Générer un post IA</span>
        </button>
      </div>

      {/* Posts Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/50 rounded-xl overflow-hidden shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold uppercase text-gold-400">
                  {post.platform}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-medium">
                  {post.status}
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-[#f5f5f3] leading-snug">{post.title}</h4>
                <p className="text-xs text-[#8e94a0] leading-relaxed line-clamp-3">{post.caption}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {post.hashtags.map((h, i) => (
                    <span key={i} className="text-[10px] text-gold-400/90 font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#191c22] border-t border-[#232730] flex items-center justify-between text-xs text-[#8e94a0]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                {post.scheduledDate}
              </span>
              <button
                onClick={() => alert('Post copié pour publication officielle dans vos apps.')}
                className="text-gold-400 hover:text-gold-300 font-semibold"
              >
                Prêt à poster →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleGeneratePost}
            className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <h3 className="text-base font-bold text-[#f5f5f3]">Générateur de Post & Légende IA</h3>
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#8e94a0] block mb-1">Plateforme cible</label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value as any)}
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                >
                  <option value="tiktok">TikTok (Accroche courte & dynamique)</option>
                  <option value="instagram">Instagram (Esthétique & storytelling)</option>
                  <option value="linkedin">LinkedIn (B2B & chiffres d&apos;affaires)</option>
                </select>
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Sujet ou produit à mettre en avant</label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex : Lancement de la nouvelle formule bio sans conservateur..."
                  className="w-full p-2.5 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#22262e]">
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
              >
                Générer et Ajouter
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
