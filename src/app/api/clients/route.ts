import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { clientsTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { clientInputSchema } from '@/server/validation/schemas';
import crypto from 'crypto';

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

    const parsed = clientInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: parsed.error.issues.map(i => i.message).join(' | ')
      }, { status: 400 });
    }

    const validData = parsed.data;
    const newClient = {
      id: validData.id || `cli-${crypto.randomUUID()}`,
      name: validData.name,
      contactName: (body.contactName || validData.name).trim(),
      email: validData.email || 'contact@client.studio',
      phone: validData.phone || null,
      website: body.website || null,
      address: body.address || null,
      sector: body.sector || 'Marketing & E-commerce',
      avatarUrl: body.avatarUrl || null,
      notes: validData.notes || null,
      totalBilled: validData.totalBilledEur || 0,
      activeProjectsCount: Number(body.activeProjectsCount) || 0,
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

    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

    await db.delete(clientsTable).where(eq(clientsTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
