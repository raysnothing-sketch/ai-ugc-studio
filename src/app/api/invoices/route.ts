import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDatabaseTables } from '@/server/db';
import { invoicesTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
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
  try {
    await ensureDatabaseTables();
    const body = await req.json();

    const newInvoice = {
      id: body.id || `inv-${Date.now()}`,
      number: body.number,
      clientId: body.clientId || null,
      clientName: body.clientName,
      clientAddress: body.clientAddress || null,
      type: body.type || 'quote',
      issueDate: body.issueDate,
      dueDate: body.dueDate,
      itemsJson: JSON.stringify(body.items || []),
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || 20,
      taxAmount: body.taxAmount || 0,
      totalAmount: body.totalAmount || 0,
      status: body.status || 'draft',
      paidAmount: body.paidAmount || 0,
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
  try {
    await ensureDatabaseTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    await db.delete(invoicesTable).where(eq(invoicesTable.id, id));
    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
