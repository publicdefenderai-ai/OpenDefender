import {getCaliforniaEvidenceStatus} from './california-freshness';

/** Bounded overview, not a charge-to-registration or tier determination. */
export function buildRegistrationContextBlock(jurisdiction: string, now = new Date()): string {
  const scope = 'REGISTRATION: Discuss only when relevant to the selected offense or the user\'s question. A charge alone does not establish a registration duty. Do not infer a duty, tier, duration, public disclosure or residence restriction from an offense label or felony/misdemeanor classification. Confirm the exact conviction, age, offense date, history and applicable orders with counsel before a plea.';
  if (jurisdiction.trim().toUpperCase() !== 'CA') {
    return scope + ' No reviewed state-specific registration determination is supplied here. Do not invent numeric deadlines or restrictions from the legacy research inventory.';
  }
  if (getCaliforniaEvidenceStatus(now, ['PEN:290']) !== 'current') {
    return scope + ' California registration evidence is unavailable or expired. Verify current official law; no numeric tier summary is supplied.';
  }
  return [scope,
    'California adult overview only: Penal Code 290(d) provides minimum registration periods of 10 years for tier one and 20 years for tier two, and lifetime registration for tier three, subject to statutory exceptions. This does not assign a tier to this user. Juvenile adjudications have separate rules.',
    'Completing a minimum period does not automatically end registration. Review termination eligibility and the court process under Penal Code 290.5. Do not promise removal, assume every registrant is publicly listed, or apply a blanket residential-distance limit.',
    'Sources: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=290. ; California DOJ overview: https://oag.ca.gov/system/files/media/sb384-registrant-faqs.pdf ; parole-specific restrictions: https://www.cdcr.ca.gov/parole/registration-requirements/ .',
    'Scope: general overview checked September 29, 2026, gated by retained PEN:290 evidence. Individual eligibility, exceptions, deadlines and supervision conditions require separate review.',
  ].join('\n');
}
