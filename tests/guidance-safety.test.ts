import { describe, expect, it } from 'vitest';
import { stripDangerousItems } from '../server/services/guidance-safety';

describe('stripDangerousItems', () => {
  it('preserves explicit practical treatment for safe items', () => {
    const result = stripDangerousItems([
      {
        action: 'Write down your booking number and where you are',
        urgency: 'high',
        treatment: 'practical',
      },
    ], []);

    expect(result.immediateActions).toEqual([{
      action: 'Write down your booking number and where you are',
      urgency: 'high',
      treatment: 'practical',
    }]);
  });
});