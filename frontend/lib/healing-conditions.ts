import { readSheet, appendToSheet, updateSheetRow, deleteSheetRow } from './google/sheets';

const SHEET_ID = () => process.env.GOOGLE_SHEETS_CONDITIONS_ID || '';
const TAB      = 'Conditions';
const RANGE    = `${TAB}!A:H`;
// Columns: slug | name | shortDesc | intro | symptoms | howHomeopathyHelps | icon | status
const HEADERS  = ['slug','name','shortDesc','intro','symptoms','howHomeopathyHelps','icon','status'];

export interface HealingCondition {
  slug: string;
  name: string;
  shortDesc: string;
  intro: string;
  symptoms: string[];          // stored as pipe-separated in sheet
  howHomeopathyHelps: string;
  icon: string;
  status: 'published' | 'draft';
}

function rowToCondition(row: string[]): HealingCondition {
  return {
    slug:               row[0] ?? '',
    name:               row[1] ?? '',
    shortDesc:          row[2] ?? '',
    intro:              row[3] ?? '',
    symptoms:           (row[4] ?? '').split('|').map(s => s.trim()).filter(Boolean),
    howHomeopathyHelps: row[5] ?? '',
    icon:               row[6] ?? '',
    status:             row[7] === 'draft' ? 'draft' : 'published',
  };
}

function conditionToRow(c: HealingCondition): string[] {
  return [
    c.slug, c.name, c.shortDesc, c.intro,
    c.symptoms.join('|'), c.howHomeopathyHelps, c.icon, c.status,
  ];
}

async function ensureHeaders() {
  const rows = await readSheet(SHEET_ID(), RANGE);
  if (!rows || rows.length === 0) await appendToSheet(SHEET_ID(), RANGE, [HEADERS]);
}

export async function getAllConditions(includeDraft = false): Promise<HealingCondition[]> {
  const rows = await readSheet(SHEET_ID(), RANGE);
  if (!rows || rows.length <= 1) return [];
  const all = rows.slice(1).filter(r => r[0]).map(rowToCondition);
  return includeDraft ? all : all.filter(c => c.status === 'published');
}

export async function getConditionBySlug(slug: string): Promise<{ condition: HealingCondition; rowIndex: number } | null> {
  const rows = await readSheet(SHEET_ID(), RANGE);
  if (!rows || rows.length <= 1) return null;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === slug) return { condition: rowToCondition(rows[i]), rowIndex: i };
  }
  return null;
}

export async function createCondition(data: HealingCondition): Promise<HealingCondition> {
  await ensureHeaders();
  await appendToSheet(SHEET_ID(), RANGE, [conditionToRow(data)]);
  return data;
}

export async function updateCondition(slug: string, data: Partial<HealingCondition>): Promise<HealingCondition | null> {
  const found = await getConditionBySlug(slug);
  if (!found) return null;
  const updated: HealingCondition = { ...found.condition, ...data };
  const sheetRow = found.rowIndex + 1;
  await updateSheetRow(SHEET_ID(), `${TAB}!A${sheetRow}:H${sheetRow}`, [conditionToRow(updated)]);
  return updated;
}

export async function deleteCondition(slug: string): Promise<boolean> {
  const found = await getConditionBySlug(slug);
  if (!found) return false;
  await deleteSheetRow(SHEET_ID(), 0, found.rowIndex);
  return true;
}
