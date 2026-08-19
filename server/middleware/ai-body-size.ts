import type { RequestHandler } from 'express';
import { MAX_AI_PROMPT_BYTES } from '../config/ai-input-limits';

export const TEN_KB = MAX_AI_PROMPT_BYTES;

/**
 * Reject an AI request whose complete parsed JSON/form body exceeds its
 * route-specific allowance. This complements field limits so many individually
 * valid fields cannot be combined into an oversized Claude prompt.
 */
export function aiBodySizeLimit(maxBytes: number): RequestHandler {
  return (req, res, next) => {
    const serializedBody = JSON.stringify(req.body ?? {});
    const bodyBytes = Buffer.byteLength(serializedBody ?? '{}', 'utf8');

    if (bodyBytes > maxBytes) {
      return res.status(413).json({
        success: false,
        error: `Request body too large (${bodyBytes} bytes). Maximum allowed is ${maxBytes} bytes.`,
      });
    }

    next();
  };
}