import { NextResponse } from 'next/server';
import { getAllClients, createClient } from '@/lib/clients';

function checkEnv() {
  const missing = [
    'GOOGLE_SERVICE_ACCOUNT_KEY',
    'GOOGLE_SHEETS_CLIENTS_ID',
  ].filter(k => !process.env[k]);
  return missing.length ? `Missing env vars: ${missing.join(', ')}` : null;
}

export async function GET() {
  const envErr = checkEnv();
  if (envErr) return NextResponse.json({ error: envErr }, { status: 503 });
  try {
    const clients = await getAllClients();
    return NextResponse.json({ clients });
  } catch (err) {
    console.error('GET /api/admin/clients', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to load clients' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const envErr = checkEnv();
  if (envErr) return NextResponse.json({ error: envErr }, { status: 503 });
  try {
    const body = await req.json();
    const { name, email, phone, dob, address, firstConsultationDate, concern, notes, status } = body;
    if (!name || !firstConsultationDate) {
      return NextResponse.json({ error: 'name and firstConsultationDate are required' }, { status: 400 });
    }
    const client = await createClient({
      name, email: email || '', phone: phone || '', dob: dob || '',
      address: address || '', firstConsultationDate, concern: concern || '',
      notes: notes || '', status: status || 'active',
    });
    return NextResponse.json({ client }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/clients', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to create client' }, { status: 500 });
  }
}
