import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { projectsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const rows = await db.select().from(projectsTable);
    const projects = rows.map((p: any) => ({
      ...p,
      deliverables: JSON.parse(p.deliverablesJson || '[]'),
      tags: JSON.parse(p.tagsJson || '[]')
    }));
    return NextResponse.json({ success: true, projects });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Nom du projet requis' }, { status: 400 });
    }

    const newProject = {
      id: body.id || `proj-${Date.now()}`,
      name: body.name.trim(),
      clientId: body.clientId || null,
      clientName: (body.clientName || 'Client Studio').trim(),
      description: body.description || '',
      objectives: body.objectives || '',
      estimatedBudget: body.estimatedBudget || 0,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      deadline: body.deadline || new Date().toISOString().split('T')[0],
      status: body.status || 'to_plan',
      progress: body.progress || 0,
      deliverablesJson: JSON.stringify(body.deliverables || []),
      thumbnailUrl: body.thumbnailUrl || null,
      tagsJson: JSON.stringify(body.tags || []),
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    };

    await db.insert(projectsTable).values(newProject);

    return NextResponse.json({
      success: true,
      project: {
        ...newProject,
        deliverables: body.deliverables || [],
        tags: body.tags || []
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
