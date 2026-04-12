/**
 * import-all-google-reviews.mjs
 * Reads scripts/google-reviews-raw.json (downloaded by the browser extractor)
 * and pushes all reviews into the Testimonials Google Sheet.
 *
 * Usage:
 *   node scripts/import-all-google-reviews.mjs
 *
 * Prerequisites:
 *   • Place the downloaded  google-reviews.json  file at:
 *     scripts/google-reviews-raw.json
 *   • .env must have  GOOGLE_SERVICE_ACCOUNT_KEY  and
 *     GOOGLE_SHEETS_TESTIMONIALS_ID  set.
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const SHEET_ID = process.env.GOOGLE_SHEETS_TESTIMONIALS_ID;
const RANGE    = 'Testimonials!A:J';
const RAW_FILE = path.join(__dirname, 'google-reviews-raw.json');

if (!SHEET_ID) { console.error('❌  GOOGLE_SHEETS_TESTIMONIALS_ID not set'); process.exit(1); }
if (!fs.existsSync(RAW_FILE)) {
  console.error(`❌  File not found: ${RAW_FILE}`);
  console.error('   Run the browser extractor first and save the JSON there.');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'));
console.log(`📄  Loaded ${raw.length} reviews from ${RAW_FILE}`);

function getAuth() {
  const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function main() {
  const auth   = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // Fetch existing rows to avoid duplicates
  const resp     = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: RANGE });
  const existing = (resp.data.values || []);

  // Ensure header row
  if (existing.length === 0 || existing[0][0] !== 'id') {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Testimonials!A1:J1',
      valueInputOption: 'RAW',
      requestBody: { values: [['id','name','text','rating','condition','location','imageUrl','source','clinic','status']] },
    });
    console.log('  ✍️  Headers written');
  }

  // Build set of existing review texts to dedupe
  const existingTexts = new Set(existing.slice(1).map(r => (r[2] || '').slice(0, 60)));

  const toAdd = [];
  raw.forEach((r, i) => {
    const textKey = (r.text || '').slice(0, 60);
    if (existingTexts.has(textKey)) return;  // already in sheet

    const id        = `gr-auto-${String(i + 1).padStart(3, '0')}`;
    const name      = r.name      || 'Google Reviewer';
    const text      = r.text      || '';
    const rating    = String(r.rating ?? 5);
    const condition = r.condition || 'General';
    const location  = r.location  || 'Zirakpur';
    const imageUrl  = r.imageUrl  || '';
    const source    = 'Google';
    const clinic    = r.clinic    || 'Zirakpur';
    const status    = 'published';

    existingTexts.add(textKey);  // prevent re-adding within this batch
    toAdd.push([id, name, text, rating, condition, location, imageUrl, source, clinic, status]);
  });

  if (toAdd.length === 0) {
    console.log('✅  All reviews already exist in the sheet — nothing to add.');
    return;
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Testimonials!A:J',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: toAdd },
  });

  console.log(`\n✅  Imported ${toAdd.length} new reviews into the Testimonials sheet!`);
  toAdd.slice(0, 5).forEach(r => console.log(`   • ${r[1]} (${r[3]}★)`));
  if (toAdd.length > 5) console.log(`   … and ${toAdd.length - 5} more`);
}

main().catch(e => { console.error(e); process.exit(1); });
