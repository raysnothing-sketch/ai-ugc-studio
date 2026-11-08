export type Language = 'de' | 'fr' | 'en';

export interface UserProfile {
  name: string;
  studioName: string;
  title: string;
  avatarUrl: string;
  email: string;
  taxNumber: string;
  address: string;
  currency: string;
}

export interface Client {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  sector: string;
  socialHandles?: string;
  notes?: string;
  activeProjectsCount: number;
  totalBilled: number;
  avatarUrl: string;
  createdAt: string;
}

export type ProjectStatus = 
  | 'prospect'
  | 'to_plan'
  | 'in_progress'
  | 'validation'
  | 'revision'
  | 'completed'
  | 'archived';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  description: string;
  objectives: string;
  estimatedBudget: number;
  startDate: string;
  deadline: string;
  status: ProjectStatus;
  progress: number;
  deliverables: string[];
  thumbnailUrl: string;
  tags: string[];
}

export interface Task {
  id: string;
  projectId?: string;
  projectName?: string;
  title: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done';
  assignedTo?: string;
  notes?: string;
}

export interface MarketingAnalysis {
  id: string;
  productId: string;
  productName: string;
  category: string;
  sourceUrl?: string;
  brand: string;
  images: string[];
  keyFeatures: string[];
  advantages: string[];
  commercialArguments: string[];
  positioning: string;
  differentiators: string[];
  targetAudience: {
    segment: string;
    ageRange: string;
    painPoints: string[];
    motivations: string[];
    recommendedChannels: string[];
  };
  strategy: {
    mainAngle: string;
    subAngles: string[];
    recommendedFormats: string[];
    callToAction: string;
    keyThemes: string[];
  };
  competitors: {
    name: string;
    positioning: string;
    overlapPoints: string;
  }[];
  createdAt: string;
}

export type UgcVideoType = 
  | 'review'
  | 'testimonial'
  | 'unboxing'
  | 'demonstration'
  | 'storytelling'
  | 'lifestyle';

export interface UgcScript {
  id: string;
  title: string;
  type: UgcVideoType;
  hook: string;
  problem: string;
  productIntro: string;
  demoOrArgument: string;
  proofOrBenefit: string;
  cta: string;
  fullText: string;
  tone: string;
  wordCount: number;
  estimatedDurationSec: number;
}

export interface VirtualActor {
  id: string;
  name: string;
  avatarUrl: string;
  style: string;
  gender: 'female' | 'male' | 'neutral';
  language: string[];
  tone: string;
  tag: string;
  provider: 'HeyGen' | 'Synthesia' | 'Custom';
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: string;
  accent: string;
  tone: string;
  provider: 'ElevenLabs' | 'OpenAI' | 'PlayHT';
}

export interface UgcVideoJob {
  id: string;
  title: string;
  productName: string;
  videoType: UgcVideoType;
  format: '9:16' | '16:9' | '1:1';
  actorId: string;
  actorName: string;
  voiceName: string;
  scriptText: string;
  videoUrl: string;
  subtitlesUrl?: string;
  durationSec: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCostEur: number;
  createdAt: string;
}

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  title: string;
  shotType: string;
  durationSec: number;
  description: string;
  cameraMovement: string;
  lighting: string;
  prompt: string;
  imageUrl: string;
}

export interface CinematicVideoProject {
  id: string;
  title: string;
  description: string;
  productName: string;
  visualStyle: string;
  targetDuration: string;
  scenes: StoryboardScene[];
  status: 'concept' | 'preproduction' | 'generation' | 'editing' | 'completed';
  finalVideoUrl?: string;
  createdAt: string;
}

export interface BrandKit {
  id: string;
  clientId: string;
  brandName: string;
  logoUrl: string;
  palette: string[];
  headingFont: string;
  bodyFont: string;
  brandVoice: string;
  slogans: string[];
  guidelines: string;
}

export interface CreativeAsset {
  id: string;
  title: string;
  type: 'instagram_post' | 'carousel' | 'story' | 'banner' | 'thumbnail' | 'ad';
  format: string;
  imageUrl: string;
  brandName: string;
  tags: string[];
  createdAt: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'youtube';
  title: string;
  caption: string;
  hashtags: string[];
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'carousel';
  scheduledDate: string;
  status: 'idea' | 'draft' | 'to_validate' | 'ready' | 'scheduled' | 'published';
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  type: 'invoice' | 'quote';
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 19 for German MwSt or 20 for French TVA
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'accepted';
  paymentMethod?: string;
  notes?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  deliverables: string[];
}

export interface PortfolioCase {
  id: string;
  title: string;
  clientName: string;
  sector: string;
  problem: string;
  objective: string;
  concept: string;
  results?: string;
  coverImageUrl: string;
  mediaUrls: string[];
  tags: string[];
  featured: boolean;
}

export interface DeliveryPackage {
  id: string;
  title: string;
  clientName: string;
  shareUrl: string;
  filesCount: number;
  totalSizeMb: number;
  expiryDate: string;
  passwordProtected: boolean;
  status: 'active' | 'expired' | 'revoked';
  downloadCount: number;
}
