// OpenAI OCR wrapper for handwritten doctor notes
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface OcrResult {
  rawTranscription: string;
  cleanedNote: string;
  uncertainItems: { text: string; reason: string }[];
}

const SYSTEM_PROMPT = `You are a medical transcription assistant specializing in extracting text from handwritten doctor notes.

Rules:
- Prioritize faithful transcription over guessing
- Preserve line breaks where useful
- Mark uncertain words as [unclear: <your best guess>]
- Do NOT invent diagnoses, medicines, or dosages
- Separate output into three sections
- Output strict JSON only, no markdown fences

Output format:
{
  "raw_transcription": "...",
  "cleaned_note": "...",
  "uncertain_items": [
    { "text": "...", "reason": "illegible handwriting" }
  ]
}`;

export async function extractTextFromImage(imageBase64: string, mimeType: string): Promise<OcrResult> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${imageBase64}`, detail: 'high' },
          },
          { type: 'text', text: 'Please transcribe this handwritten medical note.' },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || '{}';
  return parseOcrResponse(raw);
}

export function parseOcrResponse(raw: string): OcrResult {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      rawTranscription: parsed.raw_transcription || '',
      cleanedNote: parsed.cleaned_note || '',
      uncertainItems: parsed.uncertain_items || [],
    };
  } catch {
    return {
      rawTranscription: raw,
      cleanedNote: raw,
      uncertainItems: [{ text: 'entire response', reason: 'JSON parse failed' }],
    };
  }
}
