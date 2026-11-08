import { NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { clientsTable, projectsTable, tasksTable, invoicesTable } from '@/server/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ensureDatabaseTables();

    const [clients, projects, tasks, invoices] = await Promise.all([
      db.select().from(clientsTable),
      db.select().from(projectsTable),
      db.select().from(tasksTable),
      db.select().from(invoicesTable)
    ]);

    // Parse JSON subfields safely
    const formattedProjects = projects.map(p => ({
      ...p,
      deliverables: JSON.parse(p.deliverablesJson || '[]'),
      tags: JSON.parse(p.tagsJson || '[]')
    }));

    const formattedInvoices = invoices.map(i => ({
      ...i,
      items: JSON.parse(i.itemsJson || '[]')
    }));

    return NextResponse.json({
      success: true,
      clients,
      projects: formattedProjects,
      tasks,
      invoices: formattedInvoices
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      clients: [],
      projects: [],
      tasks: [],
      invoices: []
    }, { status: 500 });
  }
}
