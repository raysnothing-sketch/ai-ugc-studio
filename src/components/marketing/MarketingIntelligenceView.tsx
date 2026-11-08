'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/translations';
import {
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Target,
  Zap,
  Copy,
  Check,
  Search,
  Globe
} from 'lucide-react';
import { MarketingAnalysis } from '@/lib/types';

export const MarketingIntelligenceView: React.FC = () => {
  const { language, marketingAnalyses, addMarketingAnalysis, setActiveModule } = useApp();
  const t = TRANSLATIONS[language].marketing;

  const [activeTab, setActiveTab] = useState<'url' | 'description' | 'image' | 'doc'>('url');
  const [productUrl, setProductUrl] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [copiedAngle, setCopiedAngle] = useState(false);

  const currentAnalysis = marketingAnalyses.length > 0 ? marketingAnalyses[0] : null;

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const query = activeTab === 'url' ? productUrl : descriptionInput;
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      // Intelligently parse domain or keywords from user input
      let detectedName = 'Nouveau Produit';
      let detectedCategory = 'E-commerce & Consommation';

      if (activeTab === 'url') {
        const cleaned = query.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
        const path = query.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || '';
        detectedName = path ? path.charAt(0).toUpperCase() + path.slice(1) : cleaned;
        if (query.includes('cosmetic') || query.includes('beauty') || query.includes('soin')) {
          detectedCategory = 'Beauté & Cosmétiques';
        } else if (query.includes('shoe') || query.includes('sport') || query.includes('run')) {
          detectedCategory = 'Sport & Équipement';
        } else if (query.includes('tech') || query.includes('gadget')) {
          detectedCategory = 'High-Tech & Accessoires';
        }
      } else {
        detectedName = query.slice(0, 30).trim() + '...';
      }

      const generatedAnalysis: MarketingAnalysis = {
        id: `mkt-${Date.now()}`,
        productId: `prod-${Date.now()}`,
        productName: detectedName,
        category: detectedCategory,
        sourceUrl: activeTab === 'url' ? productUrl : undefined,
        brand: 'Marque Client',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
        ],
        keyFeatures: [
          'Conception ergonomique & matériaux durables',
          'Efficacité prouvée dès la première utilisation',
          'Prise en main intuitive sans courbe d\'apprentissage',
          'Rapport qualité-prix optimisé'
        ],
        advantages: [
          'Gain de temps estimé à plus de 40%',
          'Fiabilité et satisfaction client supérieure à 95%',
          'Alternative moderne et responsable'
        ],
        commercialArguments: [
          'Solution testée et plébiscitée par les premiers utilisateurs.',
          'Garantie satisfait ou remboursé sous 30 jours.',
          'Expédition rapide et service client dédié.'
        ],
        positioning: 'Positionnement premium accessible, valorisant la qualité, la simplicité et l\'authenticité.',
        differentiators: [
          'Transparence totale sur la fabrication',
          'Accompagnement et garantie de satisfaction',
          'Design épuré et moderne'
        ],
        targetAudience: {
          segment: 'Consommateurs actifs & acheteurs en ligne',
          ageRange: '25-45 ans, urbains et connectés',
          painPoints: [
            'Manque de solutions fiables et durables',
            'Produits concurrents trop complexes ou de basse qualité'
          ],
          motivations: [
            'Améliorer leur quotidien avec une valeur sûre',
            'Bénéficier d\'une recommandation authentique'
          ],
          recommendedChannels: ['TikTok (format UGC Testimonial)', 'Instagram Reels', 'Meta Ads']
        },
        strategy: {
          mainAngle: 'L\'efficacité concrète au quotidien',
          subAngles: [
            'Pourquoi ce produit remplace tous les autres',
            'Mon expérience sans filtre après 2 semaines',
            'L\'investissement le plus rentable de la saison'
          ],
          recommendedFormats: [
            'Vidéo courte UGC 9:16 (accroche directe)',
            'Démonstration produit face caméra',
            'Comparatif avant / après sans artifice'
          ],
          callToAction: 'Découvrez l\'offre exclusive dès aujourd\'hui',
          keyThemes: ['Efficacité', 'Simplicité', 'Confiance', 'Qualité']
        },
        competitors: [
          {
            name: 'Alternatives de masse',
            positioning: 'Entrée de gamme générique',
            overlapPoints: 'Prix attractif mais durée de vie limitée et faible satisfaction client.'
          }
        ],
        createdAt: new Date().toISOString().split('T')[0]
      };

      addMarketingAnalysis(generatedAnalysis);
      setIsAnalyzing(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAngle(true);
    setTimeout(() => setCopiedAngle(false), 2000);
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
            setProductUrl('');
            setDescriptionInput('');
            const input = document.getElementById('product-url-input');
            if (input) input.focus();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#191c22] border border-[#2b2f3a] text-gold-400 hover:border-[#d4af37] transition-all"
        >
          <span>{t.newAnalysis}</span>
        </button>
      </div>

      {/* Input Tabs & Search Box */}
      <div className="bg-[#14161a] border border-[#232730] rounded-xl p-5 shadow-card space-y-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#22262e] pb-3">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'url'
                ? 'bg-[#1e222a] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{t.tabProductUrl}</span>
          </button>

          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'description'
                ? 'bg-[#1e222a] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabDescription}</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'image'
                ? 'bg-[#1e222a] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.tabImage}</span>
          </button>

          <button
            onClick={() => setActiveTab('doc')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'doc'
                ? 'bg-[#1e222a] text-[#f5f5f3] border border-[#d4af37]/40 text-gold-400'
                : 'text-[#8e94a0] hover:text-[#f5f5f3]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t.tabDocument}</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            {activeTab === 'url' ? (
              <input
                id="product-url-input"
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://votre-boutique.com/produit-a-analyser"
                className="w-full px-4 py-2.5 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] placeholder-[#656a76] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition-all font-mono"
                required
              />
            ) : (
              <input
                id="product-desc-input"
                type="text"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Décrivez votre produit, ses points forts et son audience cible..."
                className="w-full px-4 py-2.5 text-xs bg-[#0c0d0f] border border-[#232730] rounded-lg text-[#f5f5f3] placeholder-[#656a76] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/40 transition-all font-sans"
                required
              />
            )}
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] hover:to-[#c59b27] shadow-[0_0_15px_rgba(212,175,55,0.25)] transition-all disabled:opacity-50 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Extraction & Analyse IA...</span>
              </>
            ) : (
              <>
                <span>{t.analyzeButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results or Clean Empty State */}
      {!currentAnalysis ? (
        <div className="bg-[#14161a] border border-[#232730] rounded-2xl p-10 text-center space-y-4 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto">
            <Globe className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-[#f5f5f3]">
              Prêt pour votre première analyse produit
            </h3>
            <p className="text-xs text-[#8e94a0] leading-relaxed">
              Saisissez l&apos;URL de la fiche produit d&apos;un client ou décrivez-le ci-dessus. L&apos;intelligence marketing extrait automatiquement ses bénéfices et génère des angles publicitaires exploitables.
            </p>
          </div>
        </div>
      ) : (
        /* Results Two Columns */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card: Analyse du produit */}
          <div className="bg-[#14161a] border border-[#232730] rounded-xl p-6 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3] mb-4">
                {t.productAnalysis}
              </h3>

              <div className="flex flex-col sm:flex-row gap-5">
                {/* Product Thumbnails */}
                <div className="flex sm:flex-col gap-2.5 shrink-0">
                  <img
                    src={currentAnalysis.images[0]}
                    alt={currentAnalysis.productName}
                    className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg object-cover border border-[#2b2f3a] shadow-md"
                  />
                  {currentAnalysis.images[1] && (
                    <img
                      src={currentAnalysis.images[1]}
                      alt={currentAnalysis.productName}
                      className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg object-cover border border-[#2b2f3a] shadow-md"
                    />
                  )}
                </div>

                {/* Product Info & Strengths */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-[#f5f5f3]">
                      {currentAnalysis.productName}
                    </h4>
                    <p className="text-xs text-[#8e94a0] mt-0.5">
                      Catégorie : <span className="text-[#f5f5f3]">{currentAnalysis.category}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-xs font-semibold text-[#f5f5f3]">{t.keyStrengths}</p>
                    <ul className="space-y-1 text-xs text-[#b8bcc8]">
                      {currentAnalysis.keyFeatures.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-[#22262e] mt-6">
              <span className="text-[11px] text-[#656a76]">
                Analyse IA • Données structurées
              </span>
              <button
                onClick={() => setIsDetailModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-medium text-gold-400 hover:text-gold-300 transition-colors"
              >
                <span>{t.viewMore}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Card: Stratégie marketing */}
          <div className="bg-[#14161a] border border-[#232730] rounded-xl p-6 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#f5f5f3]">
                  {t.marketingStrategy}
                </h3>

                <div className="w-16 h-6">
                  <svg viewBox="0 0 60 20" className="w-full h-full text-[#d4af37]" fill="none">
                    <path
                      d="M 2 16 Q 15 4, 30 11 T 58 3"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-3.5">
                <p className="text-xs font-semibold text-[#f5f5f3]">
                  {t.keyRecommendations}
                </p>

                <div className="space-y-2.5 text-xs">
                  {/* Angle principal */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191c22] border border-[#232730]">
                    <span className="p-1 rounded bg-[#d4af37]/15 text-gold-400 mt-0.5">
                      <Zap className="w-3 h-3" />
                    </span>
                    <div className="flex-1">
                      <span className="text-[#8e94a0] block text-[11px]">{t.mainAngle}</span>
                      <span className="font-medium text-[#f5f5f3]">
                        {currentAnalysis.strategy.mainAngle}
                      </span>
                    </div>
                  </div>

                  {/* Audience */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191c22] border border-[#232730]">
                    <span className="p-1 rounded bg-blue-500/15 text-blue-400 mt-0.5">
                      <Target className="w-3 h-3" />
                    </span>
                    <div className="flex-1">
                      <span className="text-[#8e94a0] block text-[11px]">{t.audience}</span>
                      <span className="font-medium text-[#f5f5f3]">
                        {currentAnalysis.targetAudience.ageRange}
                      </span>
                    </div>
                  </div>

                  {/* Formats */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191c22] border border-[#232730]">
                    <span className="p-1 rounded bg-purple-500/15 text-purple-400 mt-0.5">
                      <FileText className="w-3 h-3" />
                    </span>
                    <div className="flex-1">
                      <span className="text-[#8e94a0] block text-[11px]">{t.formats}</span>
                      <span className="font-medium text-[#f5f5f3]">
                        {currentAnalysis.strategy.recommendedFormats.join(' • ')}
                      </span>
                    </div>
                  </div>

                  {/* Call To Action */}
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#191c22] border border-[#232730]">
                    <span className="p-1 rounded bg-emerald-500/15 text-emerald-400 mt-0.5">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <div className="flex-1">
                      <span className="text-[#8e94a0] block text-[11px]">{t.cta}</span>
                      <span className="font-medium text-gold-400">
                        &quot;{currentAnalysis.strategy.callToAction}&quot;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-[#22262e] mt-6">
              <button
                onClick={() => copyToClipboard(currentAnalysis.strategy.mainAngle)}
                className="inline-flex items-center gap-1.5 text-xs text-[#8e94a0] hover:text-[#f5f5f3] transition-colors"
              >
                {copiedAngle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAngle ? 'Copié !' : 'Copier l\'angle'}</span>
              </button>

              <button
                onClick={() => setActiveModule('ugc')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#d4af37] to-[#b89528] text-[#0c0d0f] hover:from-[#e5c05d] transition-all"
              >
                <span>Créer la vidéo UGC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Modal */}
      {isDetailModalOpen && currentAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#14161a] border border-[#2b2f3a] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22262e] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#f5f5f3]">
                  Dossier Marketing Complet : {currentAnalysis.productName}
                </h3>
                <p className="text-xs text-[#8e94a0]">
                  Généré par AI UGC Studio — Module Marketing Intelligence
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-[#8e94a0] hover:text-[#f5f5f3] p-1.5 rounded-lg hover:bg-[#1f232b]"
              >
                ✕
              </button>
            </div>

            {/* Content Sections */}
            <div className="space-y-5 text-xs">
              <div>
                <h4 className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] mb-2">
                  1. Caractéristiques & Arguments Commerciaux
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#191c22] p-3 rounded-lg border border-[#232730]">
                    <p className="font-medium text-[#f5f5f3] mb-1.5">Caractéristiques clés :</p>
                    <ul className="space-y-1 text-[#8e94a0]">
                      {currentAnalysis.keyFeatures.map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#191c22] p-3 rounded-lg border border-[#232730]">
                    <p className="font-medium text-[#f5f5f3] mb-1.5">Arguments de vente :</p>
                    <ul className="space-y-1 text-[#8e94a0]">
                      {currentAnalysis.commercialArguments.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gold-400 uppercase tracking-wider text-[11px] mb-2">
                  2. Segmentation d&apos;Audience & Canaux
                </h4>
                <div className="bg-[#191c22] p-3.5 rounded-lg border border-[#232730] space-y-2">
                  <p className="text-[#f5f5f3]">
                    <strong className="text-gold-400">Cœur de cible :</strong> {currentAnalysis.targetAudience.segment} ({currentAnalysis.targetAudience.ageRange})
                  </p>
                  <p className="text-[#8e94a0]">
                    <strong className="text-[#f5f5f3]">Points de douleur résolus :</strong> {currentAnalysis.targetAudience.painPoints.join(' • ')}
                  </p>
                  <p className="text-[#8e94a0]">
                    <strong className="text-[#f5f5f3]">Canaux prioritaires :</strong> {currentAnalysis.targetAudience.recommendedChannels.join(' • ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#22262e]">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg text-[#8e94a0] hover:text-[#f5f5f3]"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setActiveModule('ugc');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-gold-500 text-[#0c0d0f] hover:bg-gold-400 transition-colors"
              >
                Ouvrir dans UGC Studio →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
