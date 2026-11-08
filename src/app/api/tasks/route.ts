import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { tasksTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const tasks = await db.select().from(tasksTable);
    return NextResponse.json({ success: true, tasks });
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

    if (!body.title) {
      return NextResponse.json({ error: 'Titre de la tâche requis' }, { status: 400 });
    }

    const newTask = {
      id: body.id || `task-${Date.now()}`,
      title: body.title.trim(),
      projectId: body.projectId || null,
      deadline: body.deadline || "Aujourd'hui",
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    };

    await db.insert(tasksTable).values(newTask);
    return NextResponse.json({ success: true, task: newTask });
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
    const { id, status } = body;

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    await db.update(tasksTable).set({ status }).where(eq(tasksTable.id, id));
    return NextResponse.json({ success: true, id, status });
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

    await db.delete(tasksTable).where(eq(tasksTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
