import type { Request, Response } from 'express';
import { OpenLawsLookupError, type OpenLawsClient } from './services/openlaws-client';

export function createOpenLawsCitationHandler(client: Pick<OpenLawsClient, 'searchByCitation'>) {
  return async (req: Request, res: Response) => {
    // Express has already decoded the path parameter.
    const citation = req.params.citation;
    if (!/^[A-Za-z0-9\s§.()\-:,/]+$/.test(citation) || citation.length > 120) {
      return res.status(400).json({ success: false, error: 'Invalid citation format' });
    }
    try {
      const statute = await client.searchByCitation(citation);
      return statute
        ? res.json({ success: true, statute })
        : res.status(404).json({ success: false, error: 'Statute not found' });
    } catch (error) {
      const invalid = error instanceof OpenLawsLookupError && error.status === 400;
      return res.status(invalid ? 400 : 503).json({
        success: false, error: invalid ? 'Invalid citation format' : 'Statute lookup temporarily unavailable',
      });
    }
  };
}
