import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { clientsTable, projectsTable, tasksTable, invoicesTable } from '@/server/db/schema';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();

    const [clients, projects, tasks, invoices] = await Promise.all([
      db.select().from(clientsTable),
      db.select().from(projectsTable),
      db.select().from(tasksTable),
      db.select().from(invoicesTable)
    ]);

    // Parse JSON subfields safely
    const formattedProjects = projects.map((p: any) => ({
      ...p,
      deliverables: JSON.parse(p.deliverablesJson || '[]'),
      tags: JSON.parse(p.tagsJson || '[]')
    }));

    const formattedInvoices = invoices.map((i: any) => ({
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
