import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { clientsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const clients = await db.select().from(clientsTable);
    return NextResponse.json({ success: true, clients });
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

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Nom et e-mail requis' }, { status: 400 });
    }

    const newClient = {
      id: body.id || `cli-${Date.now()}`,
      name: body.name.trim(),
      contactName: (body.contactName || body.name).trim(),
      email: body.email.trim(),
      phone: body.phone || null,
      website: body.website || null,
      address: body.address || null,
      sector: body.sector || 'Marketing & E-commerce',
      avatarUrl: body.avatarUrl || null,
      notes: body.notes || null,
      totalBilled: body.totalBilled || 0,
      activeProjectsCount: body.activeProjectsCount || 0,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    };

    await db.insert(clientsTable).values(newClient);

    return NextResponse.json({ success: true, client: newClient });
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

    await db.delete(clientsTable).where(eq(clientsTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
