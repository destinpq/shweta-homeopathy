'use client';
import { useState } from 'react';
import Link from 'next/link';
import s from './leads.module.css';

type Row = Record<string, string>;

interface Props {
  appointments: Row[];
  contacts: Row[];
  error?: string;
}

const APPT_COLS  = ['timestamp','name','email','phone','age','concern','preferredTime','consultationType','status'];
const CTACT_COLS = ['timestamp','name','email','phone','subject','message'];
const STATUSES   = ['New', 'Contacted', 'Confirmed', 'Cancelled', 'Completed'];

interface ModalProps {
  row: Row;
  rowIndex: number;
  onSuccess: (clientId: string) => void;
  onCancel: () => void;
}

function NewClientModal({ row, rowIndex, onSuccess, onCancel }: ModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [form, setForm] = useState({
    name:                  row.name    || '',
    email:                 row.email   || '',
    phone:                 row.phone   || '',
    dob:                   '',
    address:               '',
    firstConsultationDate: today,
    concern:               row.concern || '',
    notes:                 '',
    status:                'active',
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.firstConsultationDate) {
      setError('Name and first consultation date are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const clientRes = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!clientRes.ok) {
        const d = await clientRes.json();
        setError(d.error || 'Failed to create client');
        return;
      }
      const { client } = await clientRes.json();
      await fetch(`/api/admin/leads/${rowIndex}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      });
      onSuccess(client.id);
    } catch {
      setError('Network error, please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalCard}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>Create New Client</h2>
          <p className={s.modalSubtitle}>Converting lead <strong>{row.name || 'Unknown'}</strong> — fill in the details below.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={s.modalGrid}>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>Full Name *</label>
              <input className={s.modalInput} value={form.name} onChange={e => update('name', e.target.value)} required />
            </div>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>First Consultation Date *</label>
              <input type="date" className={s.modalInput} value={form.firstConsultationDate} onChange={e => update('firstConsultationDate', e.target.value)} required />
            </div>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>Phone</label>
              <input className={s.modalInput} value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>Email</label>
              <input type="email" className={s.modalInput} value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>Date of Birth</label>
              <input type="date" className={s.modalInput} value={form.dob} onChange={e => update('dob', e.target.value)} />
            </div>
            <div className={s.modalGroup}>
              <label className={s.modalLabel}>Client Status</label>
              <select className={s.modalInput} value={form.status} onChange={e => update('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className={s.modalGroupFull}>
              <label className={s.modalLabel}>Address</label>
              <input className={s.modalInput} value={form.address} onChange={e => update('address', e.target.value)} />
            </div>
            <div className={s.modalGroupFull}>
              <label className={s.modalLabel}>Chief Concern</label>
              <textarea className={s.modalTextarea} value={form.concern} onChange={e => update('concern', e.target.value)} />
            </div>
            <div className={s.modalGroupFull}>
              <label className={s.modalLabel}>Internal Notes</label>
              <textarea className={s.modalTextarea} value={form.notes} onChange={e => update('notes', e.target.value)} />
            </div>
          </div>
          {error && <p className={s.modalError}>{error}</p>}
          <div className={s.modalActions}>
            <button type="submit" disabled={saving} className={s.modalBtnPrimary}>
              {saving ? 'Creating…' : 'Create Client & Complete Lead'}
            </button>
            <button type="button" onClick={onCancel} className={s.modalBtnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusCell({ value, rowIndex, row }: { value: string; rowIndex: number; row: Row }) {
  const [status,     setStatus]     = useState(value || 'New');
  const [prevStatus, setPrevStatus] = useState(value || 'New');
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [clientId,   setClientId]   = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);

  async function handleChange(next: string) {
    if (next === 'Completed') {
      setPrevStatus(status);
      setStatus('Completed');
      setShowModal(true);
      return;
    }
    setStatus(next);
    setSaving(true);
    setSaved(false);
    try {
      const res  = await fetch(`/api/admin/leads/${rowIndex}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      setSaved(true);
      if (data.clientId) setClientId(data.clientId);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function handleModalSuccess(newClientId: string) {
    setShowModal(false);
    setClientId(newClientId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleModalCancel() {
    setShowModal(false);
    setStatus(prevStatus);
  }

  return (
    <>
      {showModal && (
        <NewClientModal
          row={row}
          rowIndex={rowIndex}
          onSuccess={handleModalSuccess}
          onCancel={handleModalCancel}
        />
      )}
      <span className={s.statusCell}>
        <select
          value={status}
          onChange={e => handleChange(e.target.value)}
          disabled={saving}
          className={`${s.statusSelect} ${s[`status_${status.toLowerCase()}`] ?? ''}`}
        >
          {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
        {saved && <span className={s.savedBadge}>✓</span>}
        {clientId && (
          <Link href={`/admin/clients/${clientId}`} className={s.clientLink}>
            View Client →
          </Link>
        )}
      </span>
    </>
  );
}

function ApptTable({ rows }: { rows: Row[] }) {
  const cols = APPT_COLS.filter(c => c !== 'status' && rows.some(r => r[c]));
  if (rows.length === 0) return <p className={s.empty}>No appointments yet.</p>;
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead>
          <tr>
            {cols.map(c => <th key={c}>{c}</th>)}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cols.map(c => <td key={c}>{row[c] || '—'}</td>)}
              <td><StatusCell value={row.status || 'New'} rowIndex={i} row={row} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactTable({ rows }: { rows: Row[] }) {
  const cols = CTACT_COLS.filter(c => rows.some(r => r[c]));
  if (rows.length === 0) return <p className={s.empty}>No contact messages yet.</p>;
  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{cols.map(c => <td key={c}>{row[c] || '—'}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeadsClient({ appointments, contacts, error }: Props) {
  const [tab, setTab] = useState<'appt'|'contact'>('appt');

  return (
    <>
      {error && <p className={s.error}>{error}</p>}
      <div className={s.tabs}>
        <button className={`${s.tab} ${tab === 'appt' ? s.tabActive : ''}`} onClick={() => setTab('appt')}>
          Appointments ({appointments.length})
        </button>
        <button className={`${s.tab} ${tab === 'contact' ? s.tabActive : ''}`} onClick={() => setTab('contact')}>
          Contact Messages ({contacts.length})
        </button>
      </div>
      {tab === 'appt'    && <ApptTable    rows={appointments} />}
      {tab === 'contact' && <ContactTable rows={contacts} />}
    </>
  );
}
