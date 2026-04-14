import { NextRequest, NextResponse } from 'next/server';
import { readSheet, updateSheetRow } from '@/lib/google/sheets';
import { createClient, getClientById, buildClientId } from '@/lib/clients';

const BOOKINGS_ID = () => process.env.GOOGLE_SHEETS_BOOKINGS_ID || '';
const VALID_STATUSES = ['New', 'Contacted', 'Confirmed', 'Cancelled', 'Completed'];

// PATCH /api/admin/leads/[rowIndex]  body: { status }
// rowIndex is 0-based data row index (excludes header row)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ rowIndex: string }> },
) {
  try {
    const { rowIndex: rowIndexStr } = await params;
    const rowIndex = parseInt(rowIndexStr, 10);
    if (isNaN(rowIndex) || rowIndex < 0) {
      return NextResponse.json({ error: 'Invalid row index' }, { status: 400 });
    }

    const body = await req.json();
    const status: string = String(body?.status ?? '').trim();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Sheet row = rowIndex + 2 (row 1 = header, row 2 = first data row)
    const sheetRow = rowIndex + 2;
    // Column I = status (9th column)
    await updateSheetRow(BOOKINGS_ID(), `Leads!I${sheetRow}`, [[status]]);

    // Auto-convert lead to client when status is set to Completed
    let clientId: string | null = null;
    if (status === 'Completed') {
      try {
        // Read the full lead row: A=timestamp B=name C=email D=phone E=age F=concern G=preferredTime H=consultationType I=status
        const rows = await readSheet(BOOKINGS_ID(), `Leads!A${sheetRow}:I${sheetRow}`);
        const row  = rows?.[0];
        if (row && row[1]?.trim()) {
          const name  = row[1].trim();
          const today = new Date().toISOString().slice(0, 10);
          const id    = buildClientId(name, today);
          const existing = await getClientById(id);
          if (existing) {
            clientId = existing.client.id;
          } else {
            const client = await createClient({
              name,
              email:                 row[2] || '',
              phone:                 row[3] || '',
              dob:                   '',
              address:               '',
              firstConsultationDate: today,
              concern:               row[5] || '',
              notes:                 '',
              status:                'active',
            });
            clientId = client.id;
          }
        }
      } catch (e) {
        console.warn('[leads PATCH] auto-create client failed:', e);
      }
    }

    return NextResponse.json({ ok: true, rowIndex, status, clientId });
  } catch (err: unknown) {
    console.error('[leads PATCH]', err);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
