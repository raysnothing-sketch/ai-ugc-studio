import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

/**
 * AI UGC Studio — Production SQLite / Turso Schema
 * Fully typed, compliant with French & European freelance accounting regulations.
 */

export const clientsTable = sqliteTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  website: text('website'),
  address: text('address'),
  sector: text('sector').notNull().default('Marketing & E-commerce'),
  avatarUrl: text('avatar_url'),
  notes: text('notes'),
  totalBilled: real('total_billed').notNull().default(0),
  activeProjectsCount: integer('active_projects_count').notNull().default(0),
  createdAt: text('created_at').notNull()
});

export const projectsTable = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  clientId: text('client_id').references(() => clientsTable.id),
  clientName: text('client_name').notNull(),
  description: text('description').notNull(),
  objectives: text('objectives').notNull(),
  estimatedBudget: real('estimated_budget').notNull().default(0),
  startDate: text('start_date').notNull(),
  deadline: text('deadline').notNull(),
  status: text('status').notNull().default('to_plan'), // 'to_plan' | 'in_progress' | 'validation' | 'completed'
  progress: integer('progress').notNull().default(0),
  deliverablesJson: text('deliverables_json').notNull().default('[]'),
  thumbnailUrl: text('thumbnail_url'),
  tagsJson: text('tags_json').notNull().default('[]'),
  createdAt: text('created_at').notNull()
});

export const tasksTable = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  projectId: text('project_id').references(() => projectsTable.id),
  deadline: text('deadline').notNull(),
  status: text('status').notNull().default('todo'), // 'todo' | 'done'
  priority: text('priority').notNull().default('medium'), // 'low' | 'medium' | 'high'
  createdAt: text('created_at').notNull()
});

export const invoicesTable = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  number: text('number').notNull().unique(), // e.g. '#2026-001'
  clientId: text('client_id').references(() => clientsTable.id),
  clientName: text('client_name').notNull(),
  clientAddress: text('client_address'),
  type: text('type').notNull().default('quote'), // 'quote' | 'invoice'
  issueDate: text('issue_date').notNull(),
  dueDate: text('due_date').notNull(),
  itemsJson: text('items_json').notNull().default('[]'),
  subtotal: real('subtotal').notNull().default(0),
  taxRate: real('tax_rate').notNull().default(20),
  taxAmount: real('tax_amount').notNull().default(0),
  totalAmount: real('total_amount').notNull().default(0),
  status: text('status').notNull().default('draft'), // 'draft' | 'sent' | 'paid' | 'overdue'
  paidAmount: real('paid_amount').notNull().default(0),
  pdfUrl: text('pdf_url'),
  notes: text('notes'),
  createdAt: text('created_at').notNull()
});

export const ugcScriptsTable = sqliteTable('ugc_scripts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull().default('review'),
  hook: text('hook').notNull(),
  problem: text('problem'),
  productIntro: text('product_intro'),
  demoOrArgument: text('demo_or_argument'),
  proofOrBenefit: text('proof_or_benefit'),
  cta: text('cta').notNull(),
  fullText: text('full_text').notNull(),
  tone: text('tone').notNull(),
  wordCount: integer('word_count').notNull(),
  estimatedDurationSec: integer('estimated_duration_sec').notNull(),
  createdAt: text('created_at').notNull()
});

export const mediaAssetsTable = sqliteTable('media_assets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'video' | 'image' | 'audio' | 'document'
  sizeBytes: integer('size_bytes').notNull().default(0),
  sizeFormatted: text('size_formatted').notNull(),
  mimeType: text('mime_type').notNull(),
  r2Key: text('r2_key').notNull(),
  url: text('url').notNull(),
  createdAt: text('created_at').notNull()
});

export const studioSettingsTable = sqliteTable('studio_settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull()
});
