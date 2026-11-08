'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  FolderHeart,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Download,
  Calendar,
  Sparkles,
  Plus,
  Maximize2,
  FolderPlus,
  Trash2
} from 'lucide-react';
import { PortfolioCase, DeliveryPackage } from '@/lib/types';

export const PortfolioView: React.FC = () => {
  const {
    language,
    portfolioCases,
    addPortfolioCase,
    deletePortfolioCase,
    deliveryPackages,
    addDeliveryPackage,
    userProfile,
    isNewCaseModalOpen,
    setIsNewCaseModalOpen
  } = useApp();
  const t = TRANSLATIONS[language].portfolio;

  const [activeTab, setActiveTab] = useState<'portfolio' | 'delivery'>('portfolio');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCase, setSelectedCase] = useState<PortfolioCase | null>(null);

  // New Case Form
  const [caseTitle, setCaseTitle] = useState('');
  const [caseClient, setCaseClient] = useState('');
  const [caseSector, setCaseSector] = useState('');
  const [caseImageUrl, setCaseImageUrl] = useState('');

  const publicPortfolioUrl = `https://ai-ugc.studio/portfolio/${userProfile.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseTitle) return;

    const newCase: PortfolioCase = {
      id: `port-${Date.now()}`,
      title: caseTitle,
      clientName: caseClient || 'Client Privé',
      sector: caseSector || 'Marketing & E-commerce',
      problem: 'Campagne de visibilité et d\'acquisition de nouveaux clients.',
      objective: 'Production de vidéos UGC et formats courts publicitaires.',
      concept: 'Mise en valeur authentique et storytelling centré sur l\'utilisateur.',
      results: '+35% d\'engagement sur les réseaux sociaux.',
      coverImageUrl:
        caseImageUrl ||
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      mediaUrls: [
        caseImageUrl ||
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
      ],
      tags: ['UGC', 'Social Media', 'Campagne'],
      featured: true
    };

    addPortfolioCase(newCase);
    setIsNewCaseModalOpen(false);
    setCaseTitle('');
    setCaseClient('');
    setCaseSector('');
    setCaseImageUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
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
          onClick={() => setIsNewCaseModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all shadow-[0_0_15px_rgba(212,175,55,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addCase}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#22262e] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'portfolio'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.publicPortfolio}
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'delivery'
              ? 'bg-[#191c22] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
              : 'text-[#8e94a0] hover:text-[#f5f5f3]'
          }`}
        >
          {t.deliveryLinks}
        </button>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'portfolio' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Grid: Showcase Cards */}
          <div className="lg:col-span-8">
            {portfolioCases.length === 0 ? (
              <div className="bg-[#14161a] border border-[#232730] rounded-2xl p-10 text-center space-y-3">
                <FolderHeart className="w-10 h-10 text-gold-400/60 mx-auto" />
                <h3 className="text-sm font-bold text-[#f5f5f3]">Votre portfolio public est prêt</h3>
                <p className="text-xs text-[#8e94a0] max-w-sm mx-auto">
                  Ajoutez vos réalisations, vidéos et études de cas pour présenter votre expertise à vos futurs clients.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsNewCaseModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une réalisation</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {portfolioCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="bg-[#14161a] border border-[#232730] hover:border-[#d4af37]/60 rounded-xl overflow-hidden transition-all group cursor-pointer shadow-card flex flex-col"
                  >
                    <div className="relative aspect-[4/5] bg-black/60 overflow-hidden">
                      <img
                        src={c.coverImageUrl}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 backdrop-blur-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-3 h-3" />
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5">
                        <p className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
                          {c.clientName}
                        </p>
                        <p className="text-xs font-bold text-[#f5f5f3] truncate">
                          {c.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Box: Share Link & Status */}
          <div className="lg:col-span-4 bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              {t.shareLink}
            </h3>

            {/* Link Box */}
            <div className="p-2.5 rounded-lg bg-[#0c0d0f] border border-[#232730] font-mono text-[11px] text-[#f5f5f3] flex items-center justify-between">
              <span className="truncate pr-2">{publicPortfolioUrl}</span>
              <button
                onClick={() => handleCopyLink(publicPortfolioUrl)}
                className="p-1.5 rounded-md hover:bg-[#1f232b] text-gold-400 transition-colors"
                title="Copier le lien"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Customize Link Button */}
            <button
              onClick={() => alert('Votre lien public est actif. Vous pouvez le partager dans vos emails et propositions.')}
              className="w-full py-2 px-3 rounded-lg bg-[#191c22] border border-[#2b2f3a] text-xs font-medium text-[#f5f5f3] hover:border-[#d4af37]/50 hover:bg-[#20242c] transition-all"
            >
              {t.customizeLink}
            </button>

            {/* Active Status Badge */}
            <div className="pt-2 border-t border-[#22262e] text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span>{t.activeNotice}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Delivery Packages View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
              Packs de Livraison Client Sécurisés
            </h3>
            <button
              onClick={() => {
                const pkgTitle = prompt('Titre du pack de livraison :');
                if (pkgTitle) {
                  addDeliveryPackage({
                    title: pkgTitle,
                    clientName: 'Client',
                    shareUrl: `https://ai-ugc.studio/delivery/${Date.now().toString(36)}`,
                    filesCount: 4,
                    totalSizeMb: 120,
                    expiryDate: '30 jours',
                    passwordProtected: true,
                    status: 'active'
                  });
                }
              }}
              className="text-xs text-gold-400 hover:text-gold-300 font-medium"
            >
              + Nouveau lien de livraison
            </button>
          </div>

          {deliveryPackages.length === 0 ? (
            <div className="bg-[#14161a] border border-[#232730] rounded-2xl p-8 text-center text-[#8e94a0] space-y-2">
              <Download className="w-8 h-8 text-[#656a76] mx-auto" />
              <p className="text-xs">Aucun lien de livraison créé pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#14161a] border border-[#232730] rounded-xl p-4 shadow-card space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#f5f5f3]">{pkg.title}</h4>
                      <p className="text-xs text-gold-400">{pkg.clientName}</p>
                    </div>
                    {pkg.passwordProtected && (
                      <span className="p-1.5 rounded-lg bg-[#191c22] text-[#8e94a0] border border-[#232730]">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0c0d0f] border border-[#232730] font-mono text-[11px] text-[#8e94a0] flex items-center justify-between">
                    <span className="truncate pr-2">{pkg.shareUrl}</span>
                    <button
                      onClick={() => handleCopyLink(pkg.shareUrl)}
                      className="text-gold-400 hover:text-gold-300"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8e94a0] pt-1">
                    <span>{pkg.filesCount} fichiers ({pkg.totalSizeMb} Mo)</span>
                    <span>Expire dans {pkg.expiryDate}</span>
                    <span className="text-emerald-400">{pkg.downloadCount} téléchargements</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Case Study Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#f5f5f3]">{selectedCase.title}</h3>
                <p className="text-xs text-gold-400">{selectedCase.clientName} • {selectedCase.sector}</p>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#232730]">
              <img
                src={selectedCase.coverImageUrl}
                alt={selectedCase.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-[#f5f5f3]">
                <strong className="text-gold-400">Concept Créatif :</strong> {selectedCase.concept}
              </p>
              <p className="text-[#8e94a0]">
                <strong className="text-[#f5f5f3]">Objectif :</strong> {selectedCase.objective}
              </p>
              {selectedCase.results && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  Résultats mesurés : {selectedCase.results}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#22262e]">
              <button
                onClick={() => {
                  deletePortfolioCase(selectedCase.id);
                  setSelectedCase(null);
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleCopyLink(publicPortfolioUrl)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
                >
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Case Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCase}
            className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#22262e] pb-3">
              <h3 className="text-base font-bold text-[#f5f5f3]">Ajouter au Portfolio</h3>
              <button
                type="button"
                onClick={() => setIsNewCaseModalOpen(false)}
                className="text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#8e94a0] block mb-1">Titre de la réalisation</label>
                <input
                  type="text"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Ex : Spot Publicitaire Lancement Produit"
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                  required
                />
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Nom du client (ou confidentiel)</label>
                <input
                  type="text"
                  value={caseClient}
                  onChange={(e) => setCaseClient(e.target.value)}
                  placeholder="Ex : Marque Partenaire"
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                />
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">Secteur d&apos;activité</label>
                <input
                  type="text"
                  value={caseSector}
                  onChange={(e) => setCaseSector(e.target.value)}
                  placeholder="Ex : Beauté, E-commerce, Sport..."
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                />
              </div>

              <div>
                <label className="text-[#8e94a0] block mb-1">URL de l&apos;image de couverture (Unsplash ou R2)</label>
                <input
                  type="text"
                  value={caseImageUrl}
                  onChange={(e) => setCaseImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2 bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#22262e]">
              <button
                type="button"
                onClick={() => setIsNewCaseModalOpen(false)}
                className="px-4 py-2 text-xs text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400"
              >
                Enregistrer la réalisation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
