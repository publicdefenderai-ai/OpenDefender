import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { aiBodySizeLimit, TEN_KB } from '../server/middleware/ai-body-size';
import {
  buildBoundedDocumentTextContent,
  buildBoundedVisionContent,
  claudeContentBytes,
  MAX_CLAUDE_USER_CONTENT_BYTES,
  MAX_CLAUDE_DOCUMENT_TEXT_BYTES,
  MAX_VISION_IMAGE_BYTES,
  redactDocumentPII,
  truncateUtf8,
  validateFile,
} from '../server/services/document-summarizer';

function createTestApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));
  app.post('/ai', aiBodySizeLimit(TEN_KB), (_req, res) => {
    res.json({ success: true });
  });
  return app;
}

describe('aiBodySizeLimit', () => {
  it('rejects an oversized combined body before an AI handler runs', async () => {
    const response = await request(createTestApp())
      .post('/ai')
      .send({ first: 'a'.repeat(5_500), second: 'b'.repeat(5_500) })
      .expect(413);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toMatch(/request body too large/i);
  });

  it('measures UTF-8 bytes rather than JavaScript character count', async () => {
    const response = await request(createTestApp())
      .post('/ai')
      .send({ text: '界'.repeat(4_000) })
      .expect(413);

    expect(response.body.error).toContain('bytes');
  });

  it('allows a body within the configured combined limit', async () => {
    const response = await request(createTestApp())
      .post('/ai')
      .send({ text: 'a'.repeat(1_000) })
      .expect(200);

    expect(response.body).toEqual({ success: true });
  });

  it('truncates document text by UTF-8 bytes before it reaches Claude', () => {
    const text = truncateUtf8('界'.repeat(4_000), MAX_CLAUDE_DOCUMENT_TEXT_BYTES);

    expect(Buffer.byteLength(text, 'utf8')).toBeLessThanOrEqual(MAX_CLAUDE_DOCUMENT_TEXT_BYTES);
    expect(text.length).toBeLessThan('界'.repeat(4_000).length);
  });

  it('rejects vision files that would exceed the shared Claude input budget after base64 encoding', () => {
    const error = validateFile('image/png', MAX_VISION_IMAGE_BYTES + 1);

    expect(error?.code).toBe('FILE_TOO_LARGE');
  });

  it('truncates after PII redaction so expanded markers cannot exceed Claude’s prompt budget', () => {
    const rawText = 'a@b.co '.repeat(2_000);
    const redactedText = redactDocumentPII(rawText);
    const content = buildBoundedDocumentTextContent(redactedText, 'evidence.txt');

    expect(Buffer.byteLength(redactedText, 'utf8')).toBeGreaterThan(Buffer.byteLength(rawText, 'utf8'));
    expect(claudeContentBytes(content)).toBeLessThanOrEqual(MAX_CLAUDE_USER_CONTENT_BYTES);
  });

  it('measures base64 image data and prompt text together before Claude receives vision content', () => {
    const content = buildBoundedVisionContent(
      Buffer.alloc(MAX_VISION_IMAGE_BYTES),
      'image/png',
      'evidence.png',
    );

    expect(claudeContentBytes(content)).toBeLessThanOrEqual(MAX_CLAUDE_USER_CONTENT_BYTES);
    expect(() => buildBoundedVisionContent(
      Buffer.alloc(MAX_VISION_IMAGE_BYTES + 512),
      'image/png',
      'evidence.png',
    )).toThrow(/10 KB AI prompt limit/i);
  });
});