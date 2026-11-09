import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { projectsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import crypto from 'crypto';

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

    const name = (body.name || body.title || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Nom du projet requis' }, { status: 400 });
    }

    const newProject = {
      id: body.id || `proj-${crypto.randomUUID()}`,
      name,
      clientId: body.clientId || null,
      clientName: (body.clientName || 'Client Studio').trim(),
      description: body.description || '',
      objectives: body.objectives || '',
      estimatedBudget: Number(body.estimatedBudget || body.budgetEur) || 0,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      deadline: body.deadline || new Date().toISOString().split('T')[0],
      status: body.status || 'to_plan',
      progress: Number(body.progress) || 0,
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

export async function PATCH(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const body = await req.json();
    const { id, status, progress, estimatedBudget } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Identifiant du projet requis' }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (status !== undefined) updates.status = status;
    if (progress !== undefined) updates.progress = Number(progress);
    if (estimatedBudget !== undefined) updates.estimatedBudget = Number(estimatedBudget);

    await db.update(projectsTable).set(updates).where(eq(projectsTable.id, id));

    return NextResponse.json({ success: true, id, updates });
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

    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

    await db.delete(projectsTable).where(eq(projectsTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
