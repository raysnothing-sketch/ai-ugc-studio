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

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-ai-ugc-studio-official',
    clientId: 'client-internal-studio',
    clientName: 'Production Interne Studio',
    name: 'Campagne Publicitaire Officielle — AI UGC Studio (0€ API)',
    description: 'Campagne publicitaire haute conversion présentant l\'architecture autonome et gratuite du studio.',
    objectives: 'Acquisition payante TikTok, Reels & Shorts sans coût d\'API.',
    estimatedBudget: 0,
    startDate: '2026-11-12',
    deadline: '2026-12-31',
    status: 'completed',
    progress: 100,
    deliverables: [
      '1x Master Vidéo Publicitaire 9:16',
      '1x Packshot Hero 16:9',
      'Sous-titres dynamiques Remotion'
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
    tags: ['AI UGC Studio', 'Campagne Officielle', 'Autonome 0€']
  }
];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_MARKETING_ANALYSIS: MarketingAnalysis | null = null;

export const INITIAL_SCRIPTS: UgcScript[] = [
  {
    id: 'sc-ai-ugc-studio-official',
    title: 'Spot Publicitaire Officiel — AI UGC Studio (0€ API)',
    type: 'review',
    hook: "Vous payez encore des centaines d'euros en abonnements IA chaque mois ? Arrêtez tout de suite.",
    problem: "Entre HeyGen, Runway et ElevenLabs, les crédits partent à une vitesse folle et vous êtes limités à chaque rendu.",
    productIntro: "Voici AI UGC Studio : le premier studio de création publicitaire 100% autonome et gratuit.",
    demoOrArgument: "Tout est réuni : acteurs virtuels ultra-réalistes, sous-titres karaoké Remotion animés et storyboards 4K... directement sur votre machine sans débourser un centime en API.",
    proofOrBenefit: "Plafond budgétaire verrouillé à 0.00 €, passerelle ComfyUI locale prête à l'emploi et rendu instantané.",
    cta: "Activez votre studio autonome dès aujourd'hui à 0€ et boostez vos conversions sans frais d'API !",
    fullText: "Vous payez encore des centaines d'euros en abonnements IA chaque mois ? Arrêtez tout de suite. Entre HeyGen, Runway et ElevenLabs, les crédits partent à toute vitesse. Voici AI UGC Studio : le premier studio publicitaire 100% autonome et gratuit. Acteurs virtuels, sous-titres karaoké Remotion et storyboards 4K à zéro frais d'API. Activez votre studio dès aujourd'hui à 0€ et boostez vos conversions !",
    tone: 'Énergique & Haute Conversion',
    wordCount: 68,
    estimatedDurationSec: 28
  },
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
    provider: 'Studio-Free-Avatar'
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
    provider: 'Studio-Free-Avatar'
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
    provider: 'Studio-Free-Avatar'
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
    provider: 'Studio-Free-Avatar'
  }
];

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'v-1', name: 'Léa (FR) — Voix Studio Naturelle', gender: 'Femme', accent: 'Français neutre', tone: 'Énergique & Spontanée', provider: 'Studio-Free-Voice' },
  { id: 'v-2', name: 'Thomas (FR) — Narration Posée & Pro', gender: 'Homme', accent: 'Français neutre', tone: 'Professionnel & Rassurant', provider: 'Studio-Free-Voice' },
  { id: 'v-3', name: 'Klara (DE) — Moderne & Dynamique', gender: 'Femme', accent: 'Allemand standard', tone: 'Claire & Confiante', provider: 'Studio-Free-Voice' },
  { id: 'v-4', name: 'Sarah (EN) — US Commercial Tone', gender: 'Femme', accent: 'Américain dynamique', tone: 'Confiant & Percutant', provider: 'Studio-Free-Voice' }
];

export const INITIAL_CINEMATIC_PROJECT: CinematicVideoProject = {
  id: 'cine-custom-1',
  title: 'Nouveau Spot Cinématique',
  description: '',
  productName: '',
  visualStyle: 'Cinématique Haute Couture',
  targetDuration: '15-30 sec',
  scenes: [],
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
