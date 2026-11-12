import { z } from 'zod';

/**
 * AI UGC Studio — Centralized Zod Schemas for Enterprise Validation
 */

export const passcodeSchema = z.object({
  passcode: z.string().min(4, 'Le code PIN doit comporter au moins 4 caractères.').max(64)
});

export const clientInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, 'Le nom du client est requis (min 2 caractères).').max(120),
  company: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().email('Adresse email invalide.').or(z.literal('')).optional().default(''),
  phone: z.string().trim().max(30).optional().default(''),
  status: z.enum(['active', 'prospect', 'inactive']).optional().default('active'),
  totalBilledEur: z.number().nonnegative().optional().default(0),
  notes: z.string().max(2000).optional().default('')
});

export const projectInputSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().trim().optional().default(''),
  title: z.string().trim().min(2, 'Le titre du projet est requis.').max(200),
  type: z.enum(['ugc_pack', 'cinematic_ad', 'full_campaign', 'custom']).optional().default('ugc_pack'),
  status: z.enum(['draft', 'in_progress', 'review', 'completed']).optional().default('draft'),
  budgetEur: z.number().nonnegative().optional().default(0),
  deadline: z.string().optional().default(''),
  ugcScriptCount: z.number().int().nonnegative().optional().default(0),
  videoCount: z.number().int().nonnegative().optional().default(0),
  notes: z.string().max(4000).optional().default('')
});

export const taskInputSchema = z.object({
  id: z.string().optional(),
  projectId: z.string().trim().optional().default(''),
  title: z.string().trim().min(1, 'Le titre de la tâche est requis.').max(300),
  dueDate: z.string().optional().default(''),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  completed: z.boolean().optional().default(false)
});

export const invoiceInputSchema = z.object({
  id: z.string().optional(),
  clientId: z.string().trim().min(1, 'L\'identifiant client est requis.'),
  type: z.enum(['invoice', 'quote']).optional().default('invoice'),
  number: z.string().trim().min(1, 'Le numéro de pièce est requis.').max(50),
  status: z.enum(['draft', 'sent', 'paid', 'cancelled']).optional().default('draft'),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  totalEur: z.number().nonnegative('Le montant total doit être positif.'),
  vatEur: z.number().nonnegative().optional().default(0),
  itemsJson: z.string().optional().default('[]'),
  notes: z.string().max(2000).optional().default('')
});

export const voiceGenerationSchema = z.object({
  text: z.string().trim().min(3, 'Le texte à synthétiser doit comporter au moins 3 caractères.').max(5000),
  voiceId: z.string().trim().max(100).optional(),
  provider: z.enum(['elevenlabs', 'openai']).optional().default('elevenlabs'),
  language: z.string().max(10).optional().default('fr')
});

export const videoGenerationSchema = z.object({
  prompt: z.string().trim().min(3, 'Le script ou prompt vidéo est requis.').max(3000),
  avatarId: z.string().trim().max(100).optional().default('default'),
  voiceId: z.string().trim().max(100).optional(),
  aspectRatio: z.enum(['9:16', '16:9', '1:1']).optional().default('9:16'),
  provider: z.string().max(50).optional().default('heygen')
});

export const imageGenerationSchema = z.object({
  prompt: z.string().trim().min(3, 'Le prompt image est requis (min 3 caractères).').max(2000),
  aspectRatio: z.enum(['1:1', '9:16', '16:9']).optional().default('16:9'),
  style: z.string().max(200).optional()
});

export const productToAdSchema = z.object({
  productName: z.string().trim().min(2, 'Le nom du produit est requis.').max(150),
  productUrl: z.string().trim().url('URL produit invalide.').or(z.literal('')).optional().default(''),
  actorId: z.string().trim().min(1).default('clara-fr'),
  voiceId: z.string().trim().min(1).default('21m00Tcm4TlvDq8ikWAM'),
  aspectRatio: z.enum(['9:16', '16:9']).default('9:16'),
  targetAudience: z.string().trim().max(200).optional().default('Acheteurs e-commerce / Réseaux sociaux'),
  scriptAngle: z.enum(['hook_problem_solution', 'unboxing_discovery', 'emotional_testimonial']).default('hook_problem_solution')
});
