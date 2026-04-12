import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet, ensureSheetTab } from '@/lib/google/sheets';
import { sendEmail, appointmentAckEmail, adminNotificationEmail } from '@/lib/google/gmail';

const SHEET_ID = process.env.GOOGLE_SHEETS_BOOKINGS_ID || '';
const ADMIN_EMAIL = process.env.GOOGLE_GMAIL_FROM || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, age, concern, preferredTime, consultationType, message } = body;

    // Basic validation
    if (!name || !email || !phone || !concern) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();

    // Save to Google Sheets — best-effort, don't let Sheets issues block the response
    if (SHEET_ID) {
      try {
        // Auto-create the Leads tab + header row if the sheet is fresh
        await ensureSheetTab(SHEET_ID, 'Leads', [
          'Timestamp', 'Name', 'Email', 'Phone', 'Age',
          'Concern', 'PreferredTime', 'ConsultationType', 'Status', 'Message',
        ]);
        await appendToSheet(SHEET_ID, 'Leads!A:J', [[
          timestamp, name, email, phone, age || '',
          concern, preferredTime || '', consultationType, 'New', message || '',
        ]]);
      } catch (sheetErr) {
        console.error('[appointment API] Sheets write failed (appointment still processed):', (sheetErr as Error).message);
      }
    }

    // Best-effort email — don't let email failures block the appointment
    if (ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: ADMIN_EMAIL,
          subject: `New Appointment Request — ${name} (${concern})`,
          html: adminNotificationEmail({ Name: name, Email: email, Phone: phone, Age: age || 'N/A', Concern: concern, 'Preferred Time': preferredTime || 'Any', 'Consultation Type': consultationType, Message: message || 'N/A', Timestamp: timestamp }),
        });
        await sendEmail({
          to: email,
          subject: "We've received your appointment request — Dr. Shweta's Homoeopathy",
          html: appointmentAckEmail(name),
        });
      } catch (emailErr) {
        console.warn('[appointment API] Email send failed (appointment still saved):', (emailErr as Error).message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[appointment API]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
