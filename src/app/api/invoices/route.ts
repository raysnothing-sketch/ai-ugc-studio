import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { invoicesTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuthOrReject } from '@/server/auth/studio-auth';
import { invoiceInputSchema } from '@/server/validation/schemas';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authErr = verifyAuthOrReject(req);
  if (authErr) return authErr;

  try {
    await ensureDatabaseTables();
    const rows = await db.select().from(invoicesTable);
    const invoices = rows.map((i: any) => ({
      ...i,
      items: JSON.parse(i.itemsJson || '[]')
    }));
    return NextResponse.json({ success: true, invoices });
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

    const invoiceNumber = (body.number || body.invoiceNumber || '').trim();
    const clientName = (body.clientName || 'Client Studio').trim();

    if (!invoiceNumber) {
      return NextResponse.json({ success: false, error: 'Numéro de facture ou devis requis' }, { status: 400 });
    }

    const newInvoice = {
      id: body.id || `inv-${crypto.randomUUID()}`,
      number: invoiceNumber,
      clientId: body.clientId || null,
      clientName,
      clientAddress: body.clientAddress || null,
      type: body.type || 'quote',
      issueDate: body.issueDate || body.date || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      itemsJson: JSON.stringify(body.items || []),
      subtotal: Number(body.subtotal || body.totalEur) || 0,
      taxRate: Number(body.taxRate) || 20,
      taxAmount: Number(body.taxAmount || body.vatEur) || 0,
      totalAmount: Number(body.totalAmount || body.totalEur) || 0,
      status: body.status || 'draft',
      paidAmount: Number(body.paidAmount) || 0,
      pdfUrl: body.pdfUrl || null,
      notes: body.notes || null,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0]
    };

    await db.insert(invoicesTable).values(newInvoice);

    return NextResponse.json({
      success: true,
      invoice: {
        ...newInvoice,
        items: body.items || []
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

    if (!id) return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });

    await db.delete(invoicesTable).where(eq(invoicesTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
