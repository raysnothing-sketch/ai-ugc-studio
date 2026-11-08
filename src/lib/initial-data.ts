import {
  UserProfile,
  Client,
  Project,
  Task,
  MarketingAnalysis,
  UgcScript,
  VirtualActor,
  VoiceProfile,
  CinematicVideoProject,
  CreativeAsset,
  BrandKit,
  SocialPost,
  Invoice,
  ServiceItem,
  PortfolioCase,
  DeliveryPackage
} from './types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Rayan',
  studioName: 'AI UGC Studio',
  title: 'Consultant Marketing Digital & Créateur de Contenu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  email: 'contact@ai-ugc.studio',
  taxNumber: 'FR 84 928 310 442',
  address: 'Studio Privé, France / International',
  currency: '€'
};

// Clean states: No fake/fictional clients or invoices pre-filled!
export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_MARKETING_ANALYSIS: MarketingAnalysis | null = null;

export const INITIAL_SCRIPTS: UgcScript[] = [
  {
    id: 'sc-template-1',
    title: 'Script Vendeur UGC — Format Problème / Solution',
    type: 'review',
    hook: "Voici l'erreur que 90% des gens font sans s'en rendre compte...",
    problem: "Pendant des mois, j'ai cherché une alternative efficace sans jamais trouver satisfaction.",
    productIntro: "Puis j'ai découvert ce produit qui a totalement changé ma routine.",
    demoOrArgument: "La prise en main est instantanée, les résultats sont visibles dès les premiers jours et la qualité est irréprochable.",
    proofOrBenefit: "Après 3 semaines d'utilisation quotidienne, le résultat a dépassé toutes mes attentes.",
    cta: "Cliquez sur le lien ci-dessous pour profiter de l'offre de lancement exclusive !",
    fullText: "Voici l'erreur que 90% des gens font sans s'en rendre compte... Si vous cherchez une vraie solution efficace et durable, ce produit change totalement la donne. Les résultats sont rapides, sans compromis sur la qualité. Cliquez sur le lien pour découvrir l'offre !",
    tone: 'Énergique & Authentique',
    wordCount: 52,
    estimatedDurationSec: 22
  }
];

export const VIRTUAL_ACTORS: VirtualActor[] = [
  {
    id: 'act-1',
    name: 'Emma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    style: 'Dynamique & Athlétique',
    gender: 'female',
    language: ['Français', 'Allemand', 'Anglais'],
    tone: 'Énergique, naturelle, convaincante',
    tag: 'Polyvalent UGC & Lifestyle',
    provider: 'HeyGen'
  },
  {
    id: 'act-2',
    name: 'Sophie',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    style: 'Raffinée & Soin',
    gender: 'female',
    language: ['Français', 'Anglais'],
    tone: 'Douce, experte, rassurante',
    tag: 'Cosmétiques, Beauté & Bien-être',
    provider: 'HeyGen'
  },
  {
    id: 'act-3',
    name: 'Lukas',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    style: 'Tech & B2B',
    gender: 'male',
    language: ['Allemand', 'Anglais', 'Français'],
    tone: 'Professionnel, moderne, précis',
    tag: 'SaaS, E-commerce & Produits',
    provider: 'Synthesia'
  },
  {
    id: 'act-4',
    name: 'Chloé',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    style: 'Tendance & Mode',
    gender: 'female',
    language: ['Français', 'Allemand'],
    tone: 'Créative, expressive, branchée',
    tag: 'Mode, Accessoires & Réseaux',
    provider: 'Custom'
  }
];

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'v-1', name: 'Léa (FR) - Voix Naturelle & Dynamique', gender: 'Femme', accent: 'Français neutre', tone: 'Énergique & Spontanée', provider: 'ElevenLabs' },
  { id: 'v-2', name: 'Klara (DE) - Moderne & Professionnelle', gender: 'Femme', accent: 'Allemand standard', tone: 'Claire & Confiante', provider: 'ElevenLabs' },
  { id: 'v-3', name: 'Sarah (EN) - Commercial & Friendly', gender: 'Femme', accent: 'Américain dynamique', tone: 'Confiant & Percutant', provider: 'ElevenLabs' },
  { id: 'v-4', name: 'Thomas (FR) - Posé & Rassurant', gender: 'Homme', accent: 'Français neutre', tone: 'Professionnel', provider: 'OpenAI' }
];

export const INITIAL_CINEMATIC_PROJECT: CinematicVideoProject = {
  id: 'cine-custom-1',
  title: 'Spot Publicitaire Cinématique',
  description: 'Une ambiance cinématographique haut de gamme mettant en valeur les détails et l\'émotion du produit.',
  productName: 'Votre Produit',
  visualStyle: 'Cinématique Haute Couture',
  targetDuration: '15-30 sec',
  scenes: [
    {
      id: 'sc-c1',
      sceneNumber: 1,
      title: '1. Introduction',
      shotType: 'Plan large • 3s',
      durationSec: 3,
      description: 'Accroche visuelle contemplative créant l\'attente et l\'atmosphère.',
      cameraMovement: 'Travelling lent vers l\'avant.',
      lighting: 'Golden hour douce avec lumière volumétrique.',
      prompt: 'Cinematic wide establishing shot, minimalist luxury architecture, golden hour light, 8k film aesthetic, arri alexa',
      imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sc-c2',
      sceneNumber: 2,
      title: '2. Produit',
      shotType: 'Gros plan • 5s',
      durationSec: 5,
      description: 'Mise en valeur macro des détails, des textures et de la qualité du produit.',
      cameraMovement: 'Macro tilt fluide à 60fps.',
      lighting: 'Lumière studio douce avec reflets dorés épurés.',
      prompt: 'Macro luxury product cinematography, ultra realistic 8k, marble surface, soft golden backlighting, cinema commercial',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-33534d08ee7a?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sc-c3',
      sceneNumber: 3,
      title: '3. Bénéfices',
      shotType: 'Plan moyen • 5s',
      durationSec: 5,
      description: 'Scène d\'usage démontrant les sensations et l\'expérience utilisateur.',
      cameraMovement: 'Arc rotatif subtil.',
      lighting: 'Éclairage naturel immersif.',
      prompt: 'Medium close-up of a person experiencing the premium product with satisfaction, 35mm film grain, aesthetic bokeh',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'sc-c4',
      sceneNumber: 4,
      title: '4. CTA & Hero Shot',
      shotType: 'Plan final • 3s',
      durationSec: 3,
      description: 'Packshot héroïque final avec logo et appel à l\'action.',
      cameraMovement: 'Plan fixe héroïque.',
      lighting: 'Lumière zénithale épurée.',
      prompt: 'Hero packshot of product on podium, subtle floating light particles, clean luxury branding space, 8k commercial finish',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80'
    }
  ],
  status: 'concept',
  createdAt: new Date().toISOString().split('T')[0]
};

export const INITIAL_BRAND_KIT: BrandKit = {
  id: 'bk-default',
  clientId: '',
  brandName: 'Votre Marque Studio',
  logoUrl: '',
  palette: ['#0c0d0f', '#d4af37', '#f5f5f3', '#1e222a', '#e5c05d'],
  headingFont: 'Playfair Display / Serif',
  bodyFont: 'Inter / Sans-serif',
  brandVoice: 'Professionnel, authentique, inspirant et percutant',
  slogans: [
    'L\'excellence au service de votre image.',
    'Des créations qui captivent et convertissent.'
  ],
  guidelines: 'Privilégier la clarté, les contrastes élégants et l\'authenticité visuelle.'
};

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Pack Vidéos UGC Performance (3 vidéos 9:16)',
    description: '3 scripts percutants, acteurs virtuels haute fidélité, voix off multilingue, sous-titres animés et formats adaptés TikTok/Reels.',
    category: 'Production Vidéo',
    price: 1800,
    duration: '5 jours ouvrés',
    deliverables: ['3 vidéos MP4 9:16', 'Fichiers sous-titres .SRT', '3 variantes de hooks']
  },
  {
    id: 'srv-2',
    name: 'Vidéo Publicitaire Cinématique (15-30s)',
    description: 'Scénario complet, storyboard IA, génération de plans 4K avec éclairage cinématographique, montage audio et habillage sonore.',
    category: 'Production Vidéo',
    price: 2400,
    duration: '7 jours ouvrés',
    deliverables: ['Vidéo master 16:9 et déclinaison 9:16', 'Storyboard détaillé', 'Musique libre de droits']
  },
  {
    id: 'srv-3',
    name: 'Audit Marketing & Stratégie Publicitaire',
    description: 'Analyse approfondie de la marque, étude des concurrents, segmentation d\'audience et proposition d\'angles publicitaires.',
    category: 'Conseil Stratégique',
    price: 950,
    duration: '3 jours ouvrés',
    deliverables: ['Dossier complet PDF', 'Matrice concurrentielle', '10 scripts prêts à tourner']
  },
  {
    id: 'srv-4',
    name: 'Gestion Mensuelle Réseaux Sociaux & Visuels',
    description: 'Calendrier éditorial de 12 publications, légendes optimisées SEO, hashtags ciblés et carrousels graphiques sur mesure.',
    category: 'Social Media',
    price: 1600,
    duration: 'Mensuel récurrent',
    deliverables: ['12 publications prêtes à poster', 'Planning interactif', 'Rapport mensuel']
  }
];

export const INITIAL_PORTFOLIO_CASES: PortfolioCase[] = [];

export const INITIAL_DELIVERY_PACKAGES: DeliveryPackage[] = [];
