import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

/**
 * Turso / LibSQL Database connection.
 * Automatically falls back to a local embedded file SQLite database ('file:studio.db')
 * when TURSO_DATABASE_URL is not provided, allowing zero-config local operation
 * and seamless cloud Turso scale in production.
 */

const databaseUrl = process.env.TURSO_DATABASE_URL || 'file:studio.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

export const rawDbClient = createClient({
  url: databaseUrl,
  authToken: authToken || undefined
});

export const db = drizzle(rawDbClient, { schema });

/**
 * Auto-initializes tables if they do not exist.
 * Ensures the database is instantly ready upon deployment without manual migration steps.
 */
let isInitialized = false;

export async function ensureDatabaseTables(): Promise<void> {
  if (isInitialized) return;

  try {
    await rawDbClient.executeMultiple(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        website TEXT,
        address TEXT,
        sector TEXT NOT NULL DEFAULT 'Marketing & E-commerce',
        avatar_url TEXT,
        notes TEXT,
        total_billed REAL NOT NULL DEFAULT 0,
        active_projects_count INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        client_id TEXT REFERENCES clients(id),
        client_name TEXT NOT NULL,
        description TEXT NOT NULL,
        objectives TEXT NOT NULL,
        estimated_budget REAL NOT NULL DEFAULT 0,
        start_date TEXT NOT NULL,
        deadline TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'to_plan',
        progress INTEGER NOT NULL DEFAULT 0,
        deliverables_json TEXT NOT NULL DEFAULT '[]',
        thumbnail_url TEXT,
        tags_json TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        project_id TEXT REFERENCES projects(id),
        deadline TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'todo',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        number TEXT NOT NULL UNIQUE,
        client_id TEXT REFERENCES clients(id),
        client_name TEXT NOT NULL,
        client_address TEXT,
        type TEXT NOT NULL DEFAULT 'quote',
        issue_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        items_json TEXT NOT NULL DEFAULT '[]',
        subtotal REAL NOT NULL DEFAULT 0,
        tax_rate REAL NOT NULL DEFAULT 20,
        tax_amount REAL NOT NULL DEFAULT 0,
        total_amount REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'draft',
        paid_amount REAL NOT NULL DEFAULT 0,
        pdf_url TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ugc_scripts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'review',
        hook TEXT NOT NULL,
        problem TEXT,
        product_intro TEXT,
        demo_or_argument TEXT,
        proof_or_benefit TEXT,
        cta TEXT NOT NULL,
        full_text TEXT NOT NULL,
        tone TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        estimated_duration_sec INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS media_assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        size_bytes INTEGER NOT NULL DEFAULT 0,
        size_formatted TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        r2_key TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS studio_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL
      );
    `);
    isInitialized = true;
  } catch (err) {
    console.error('Database initialization notice:', err);
  }
}
