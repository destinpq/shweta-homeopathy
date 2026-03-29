import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config({ path: '/Users/pratik/Dev Zone/Shweta-Homeopathy/frontend/.env' });

const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
if (!raw) { console.error('NO KEY'); process.exit(1); }
const creds = JSON.parse(raw);
console.log('SA email:', creds.client_email);

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents']
});

// Test 1: Drive list
try {
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.list({ pageSize: 1, fields: 'files(id,name)' });
  console.log('Drive API OK:', JSON.stringify(res.data.files));
} catch(err) {
  console.error('Drive LIST error:', err.message);
  if (err.response) console.error('  status:', err.response.status, JSON.stringify(err.response.data));
}

// Test 2: Docs API create
try {
  const docs = google.docs({ version: 'v1', auth });
  const doc = await docs.documents.create({ requestBody: { title: 'TEST DELETE ME' } });
  console.log('Docs API OK — docId:', doc.data.documentId);
  const drive = google.drive({ version: 'v3', auth });
  await drive.files.delete({ fileId: doc.data.documentId });
  console.log('Cleanup done');
} catch(err) {
  console.error('Docs CREATE error:', err.message);
  if (err.response) console.error('  status:', err.response.status, JSON.stringify(err.response.data?.error));
}

// Test 3: Drive blog doc (HTML conversion)
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
console.log('GOOGLE_DRIVE_FOLDER_ID set:', !!folderId);
try {
  const drive = google.drive({ version: 'v3', auth });
  const { Readable } = await import('stream');
  const stream = Readable.from(Buffer.from('<h1>Test delete me</h1>', 'utf8'));
  const res = await drive.files.create({
    requestBody: { name: 'Test Blog Doc DELETE ME', mimeType: 'application/vnd.google-apps.document', parents: [folderId] },
    media: { mimeType: 'text/html', body: stream },
    fields: 'id',
  });
  console.log('Drive Blog Doc OK — id:', res.data.id);
  await drive.files.delete({ fileId: res.data.id });
  console.log('Cleanup done');
} catch(err) {
  console.error('Drive Blog Doc error:', err.message);
  if (err.response) console.error('  status:', err.response.status, JSON.stringify(err.response.data?.error));
}
