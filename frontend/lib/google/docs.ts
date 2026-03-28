// Google Docs — create and update session notes + blog content
import { google } from 'googleapis';

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive'],
  });
}

export async function createSessionNoteDoc(opts: {
  title: string;
  content: string;
  folderId: string;
}): Promise<{ docId: string; url: string }> {
  const auth = getAuth();
  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });

  const doc = await docs.documents.create({ requestBody: { title: opts.title } });
  const docId = doc.data.documentId as string;

  // Move to target folder
  const file = await drive.files.get({ fileId: docId, fields: 'parents' });
  const prevParents = (file.data.parents || []).join(',');
  await drive.files.update({
    fileId: docId,
    addParents: opts.folderId,
    removeParents: prevParents,
    fields: 'id,parents',
  });

  // Insert content
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: opts.content,
          },
        },
      ],
    },
  });

  return { docId, url: `https://docs.google.com/document/d/${docId}/edit` };
}

export async function updateSessionNoteDoc(docId: string, content: string) {
  const auth = getAuth();
  const docs = google.docs({ version: 'v1', auth });

  // Get current doc length
  const doc = await docs.documents.get({ documentId: docId });
  const endIndex = doc.data.body?.content?.at(-1)?.endIndex ?? 2;

  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [
        {
          deleteContentRange: {
            range: { startIndex: 1, endIndex: endIndex - 1 },
          },
        },
        {
          insertText: { location: { index: 1 }, text: content },
        },
      ],
    },
  });
}

// ─── Blog Doc functions ────────────────────────────────────────────────────────

const DEFAULT_FOLDER_ID = () => process.env.GOOGLE_DRIVE_FOLDER_ID || '';

/**
 * Create a Google Doc from HTML content for a blog post.
 * Uses Drive API to upload HTML and convert it to a Google Doc in-place.
 */
export async function createBlogDoc(opts: {
  title: string;
  htmlContent: string;
  folderId?: string;
}): Promise<{ docId: string; url: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });
  const { Readable } = await import('stream');
  const stream = Readable.from(Buffer.from(opts.htmlContent, 'utf8'));

  const res = await drive.files.create({
    requestBody: {
      name: opts.title,
      mimeType: 'application/vnd.google-apps.document',
      parents: [opts.folderId || DEFAULT_FOLDER_ID()],
    },
    media: { mimeType: 'text/html', body: stream },
    fields: 'id',
  });

  const docId = res.data.id as string;
  return { docId, url: `https://docs.google.com/document/d/${docId}/edit` };
}

/**
 * Replace the entire content of an existing blog Doc with new HTML.
 */
export async function updateBlogDoc(docId: string, htmlContent: string): Promise<void> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });
  const { Readable } = await import('stream');
  const stream = Readable.from(Buffer.from(htmlContent, 'utf8'));

  await drive.files.update({
    fileId: docId,
    media: { mimeType: 'text/html', body: stream },
  });
}

/**
 * Export a Google Doc as HTML for rendering on public blog pages.
 */
export async function getBlogDocHtml(docId: string): Promise<string> {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.export(
    { fileId: docId, mimeType: 'text/html' },
    { responseType: 'text' },
  );

  return res.data as string;
}
