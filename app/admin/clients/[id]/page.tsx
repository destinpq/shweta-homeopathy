import { notFound } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ClientDetailClient from './ClientDetailClient';

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

async function fetchClient(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    const res  = await fetch(`${base}/api/admin/clients/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const { client } = await res.json();
    return client;
  } catch {
    return null;
  }
}

async function fetchClientNotes(clientId: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    const res  = await fetch(`${base}/api/admin/notes?clientId=${clientId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const { notes } = await res.json();
    return notes ?? [];
  } catch {
    return [];
  }
}

export default async function ClientDetailPage({ params }: PageProps) {
  const { id }  = await params;
  const [client, sessionNotes] = await Promise.all([fetchClient(id), fetchClientNotes(id)]);
  if (!client) notFound();

  return (
    <AdminLayout>
      <ClientDetailClient client={client} sessionNotes={sessionNotes} />
    </AdminLayout>
  );
}
