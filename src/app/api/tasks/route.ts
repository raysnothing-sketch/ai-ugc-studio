import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { tasksTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { taskInputSchema } from '@/server/validation/schemas';
import crypto from 'crypto';

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

    const title = (body.title || '').trim();
    if (!title) {
      return NextResponse.json({ success: false, error: 'Titre de la tâche requis' }, { status: 400 });
    }

    const newTask = {
      id: body.id || `task-${crypto.randomUUID()}`,
      title,
      projectId: body.projectId || null,
      deadline: body.deadline || body.dueDate || "Aujourd'hui",
      status: body.status || (body.completed ? 'done' : 'todo'),
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

    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

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

    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

    await db.delete(tasksTable).where(eq(tasksTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
