import { db } from '../server/db';
import { statutes } from '../shared/schema';
import { verifiedStatuteCodes } from './verified-statute-codes';
import { eq, and } from 'drizzle-orm';

const STATE_CITATION_PATTERNS: Record<string, (code: string) => string> = {
  AL: (code) => `Ala. Code § ${code}`,
  AK: (code) => `Alaska Stat. § ${code}`,
  AZ: (code) => `Ariz. Rev. Stat. § ${code}`,
  AR: (code) => `Ark. Code Ann. § ${code}`,
  CA: (code) => `Cal. Penal Code § ${code}`,
  CO: (code) => `Colo. Rev. Stat. § ${code}`,
  CT: (code) => `Conn. Gen. Stat. § ${code}`,
  DE: (code) => `Del. Code Ann. tit. 11, § ${code}`,
  FL: (code) => `Fla. Stat. § ${code}`,
  GA: (code) => `Ga. Code Ann. § ${code}`,
  HI: (code) => `Haw. Rev. Stat. § ${code}`,
  ID: (code) => `Idaho Code § ${code}`,
  IL: (code) => `720 ILCS ${code}`,
  IN: (code) => `Ind. Code § ${code}`,
  IA: (code) => `Iowa Code § ${code}`,
  KS: (code) => `Kan. Stat. Ann. § ${code}`,
  KY: (code) => `Ky. Rev. Stat. Ann. § ${code}`,
  LA: (code) => `La. Rev. Stat. Ann. § ${code}`,
  ME: (code) => `Me. Rev. Stat. Ann. tit. 17-A, § ${code}`,
  MD: (code) => `Md. Code Ann., Crim. Law § ${code}`,
  MA: (code) => `Mass. Gen. Laws ch. ${code}`,
  MI: (code) => `Mich. Comp. Laws § ${code}`,
  MN: (code) => `Minn. Stat. § ${code}`,
  MS: (code) => `Miss. Code Ann. § ${code}`,
  MO: (code) => `Mo. Rev. Stat. § ${code}`,
  MT: (code) => `Mont. Code Ann. § ${code}`,
  NE: (code) => `Neb. Rev. Stat. § ${code}`,
  NV: (code) => `Nev. Rev. Stat. § ${code}`,
  NH: (code) => `N.H. Rev. Stat. Ann. § ${code}`,
  NJ: (code) => `N.J. Stat. Ann. § ${code}`,
  NM: (code) => `N.M. Stat. Ann. § ${code}`,
  NY: (code) => `N.Y. Penal Law § ${code}`,
  NC: (code) => `N.C. Gen. Stat. § ${code}`,
  ND: (code) => `N.D. Cent. Code § ${code}`,
  OH: (code) => `Ohio Rev. Code Ann. § ${code}`,
  OK: (code) => `Okla. Stat. tit. 21, § ${code}`,
  OR: (code) => `Or. Rev. Stat. § ${code}`,
  PA: (code) => `18 Pa.C.S. § ${code}`,
  RI: (code) => `R.I. Gen. Laws § ${code}`,
  SC: (code) => `S.C. Code Ann. § ${code}`,
  SD: (code) => `S.D. Codified Laws § ${code}`,
  TN: (code) => `Tenn. Code Ann. § ${code}`,
  TX: (code) => `Tex. Penal Code § ${code}`,
  UT: (code) => `Utah Code Ann. § ${code}`,
  VT: (code) => `Vt. Stat. Ann. tit. 13, § ${code}`,
  VA: (code) => `Va. Code Ann. § ${code}`,
  WA: (code) => `Wash. Rev. Code § ${code}`,
  WV: (code) => `W. Va. Code § ${code}`,
  WI: (code) => `Wis. Stat. § ${code}`,
  WY: (code) => `Wyo. Stat. Ann. § ${code}`,
  DC: (code) => `D.C. Code § ${code}`,
};

interface ChargeInfo {
  title: string;
  category: string;
  relatedCharges: string[];
  penalties: string;
  summary: string;
}

const chargeInfo: Record<string, ChargeInfo> = {
  'failure-to-appear': {
    title: 'Failure to Appear',
    category: 'public_order',
    relatedCharges: ['Failure to Appear', 'Bail Jumping', 'FTA'],
    penalties: 'Misdemeanor: Up to 1 year jail and/or fine; Felony bail jumping possible',
    summary: 'Failure to appear in court as required after being released on bail or personal recognizance'
  },
  'probation-violation': {
    title: 'Probation Violation',
    category: 'public_order',
    relatedCharges: ['Probation Violation', 'Violation of Probation', 'VOP'],
    penalties: 'Revocation of probation and imposition of original sentence; additional jail time',
    summary: 'Violation of conditions of probation including failing to report, failing drug tests, or new arrests'
  },
  'resisting-arrest': {
    title: 'Resisting Arrest / Obstruction',
    category: 'public_order',
    relatedCharges: ['Resisting Arrest', 'Obstruction', 'Resisting Officer'],
    penalties: 'Misdemeanor: Up to 1 year jail and/or $1,000 fine',
    summary: 'Intentionally resisting, obstructing, or delaying a peace officer in the performance of official duties'
  },
  'protective-order-violation': {
    title: 'Violation of Protective Order',
    category: 'domestic_violence',
    relatedCharges: ['Protective Order Violation', 'Restraining Order Violation', 'DVPO Violation'],
    penalties: 'Misdemeanor: Up to 1 year jail; felony for repeat violations',
    summary: 'Knowingly violating a protective order, restraining order, or order of protection'
  },
  'noise-violation': {
    title: 'Noise Violation / Disturbing the Peace',
    category: 'public_order',
    relatedCharges: ['Noise Violation', 'Disturbing the Peace', 'Noise Ordinance Violation'],
    penalties: 'Fine up to $500; possible 30 days jail for repeat offenses',
    summary: 'Creating excessive or unreasonable noise that disturbs the peace and quiet of a community'
  },
  'indecent-exposure': {
    title: 'Indecent Exposure / Public Urination',
    category: 'public_order',
    relatedCharges: ['Indecent Exposure', 'Public Urination', 'Exposure of Person'],
    penalties: 'Misdemeanor: Up to 6 months jail and/or $1,000 fine; possible sex offender registration',
    summary: 'Exposing private body parts in public or urinating in public view'
  },
  'fake-id': {
    title: 'Possession of Fake/Fraudulent ID',
    category: 'fraud',
    relatedCharges: ['Fake ID', 'Fraudulent Identification', 'False Identification'],
    penalties: 'Misdemeanor: Up to 1 year jail and/or $1,000 fine; license suspension',
    summary: 'Possessing, displaying, or using a fraudulent, altered, or counterfeit identification document'
  },
  'failure-to-pay-child-support': {
    title: 'Criminal Nonsupport / Failure to Pay Child Support',
    category: 'domestic_violence',
    relatedCharges: ['Criminal Nonsupport', 'Failure to Pay Child Support', 'Nonsupport'],
    penalties: 'Up to 1 year jail, wage garnishment, license suspension',
    summary: 'Willful failure to provide court-ordered financial support for a child or dependent'
  },
  'animal-cruelty-misdemeanor': {
    title: 'Animal Cruelty',
    category: 'public_order',
    relatedCharges: ['Animal Cruelty', 'Animal Abuse', 'Animal Neglect'],
    penalties: 'Misdemeanor: Up to 1 year jail and/or $5,000 fine; animal forfeiture',
    summary: 'Negligent or intentional mistreatment, neglect, or abuse of an animal'
  },
  'truancy': {
    title: 'Truancy / Chronic Absenteeism',
    category: 'public_order',
    relatedCharges: ['Truancy', 'School Attendance Violation', 'Compulsory Education Violation'],
    penalties: 'Up to $500 fine for parents; community service; truancy court supervision',
    summary: 'A minor failing to attend school as required by compulsory education laws'
  },
  'littering': {
    title: 'Littering / Illegal Dumping',
    category: 'public_order',
    relatedCharges: ['Littering', 'Illegal Dumping', 'Waste Disposal Violation'],
    penalties: 'Up to $1,000 fine for littering; up to $25,000 for illegal dumping',
    summary: 'Disposing of trash or debris on public or private property without authorization'
  },
  'driving-without-insurance': {
    title: 'Driving Without Insurance',
    category: 'dui',
    relatedCharges: ['Driving Without Insurance', 'No Insurance', 'Uninsured Motorist'],
    penalties: 'Fine up to $1,000; license/registration suspension; vehicle impoundment',
    summary: 'Operating a motor vehicle without the minimum required liability insurance'
  },
  'expired-registration': {
    title: 'Driving with Expired Registration',
    category: 'dui',
    relatedCharges: ['Expired Registration', 'No Registration', 'Registration Violation'],
    penalties: 'Up to $500 fine; possible vehicle impoundment',
    summary: 'Operating a motor vehicle with an expired registration or without valid registration tags'
  },
  'reckless-driving-criminal': {
    title: 'Reckless/Careless Driving',
    category: 'dui',
    relatedCharges: ['Reckless Driving', 'Careless Driving', 'Dangerous Driving'],
    penalties: 'Up to 90 days jail and/or $1,000 fine; license points; possible suspension',
    summary: 'Operating a motor vehicle with willful or wanton disregard for safety'
  },
  'hunting-fishing-no-license': {
    title: 'Fishing / Hunting Without a License',
    category: 'public_order',
    relatedCharges: ['Hunting Without License', 'Fishing Without License', 'Poaching'],
    penalties: 'Up to $500 fine for fishing; up to $1,000+ for hunting; equipment confiscation',
    summary: 'Fishing, hunting, or trapping wildlife without the required state license'
  },
};

const top20States = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'
];

async function addStatuteSeeds() {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [chargeSuffix, jurisdictionCodes] of Object.entries(verifiedStatuteCodes)) {
    const info = chargeInfo[chargeSuffix];
    if (!info) continue;

    for (const jur of top20States) {
      const verified = jurisdictionCodes[jur];
      if (!verified) continue;

      const citationFn = STATE_CITATION_PATTERNS[jur];
      if (!citationFn) continue;

      const citation = citationFn(verified.code);
      const section = verified.code;
      const chapter = section.split('-')[0] || section.split('.')[0] || '';

      try {
        const existing = await db.query.statutes.findFirst({
          where: and(
            eq(statutes.citation, citation),
            eq(statutes.jurisdiction, jur)
          )
        });

        if (existing) {
          skipped++;
          continue;
        }

        await db.insert(statutes).values({
          title: info.title,
          citation: citation,
          jurisdiction: jur,
          level: 'state',
          chapter: chapter,
          section: section,
          content: info.summary,
          summary: info.summary,
          category: info.category,
          relatedCharges: info.relatedCharges,
          penalties: info.penalties,
          url: '',
          sourceApi: 'verified_codes',
          isActive: true,
        });
        inserted++;
      } catch (err: any) {
        if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
          skipped++;
        } else {
          errors++;
          if (errors <= 5) {
            console.error(`Error for ${jur} ${chargeSuffix}: ${err.message}`);
          }
        }
      }
    }
  }

  console.log(`Statute seed results:`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (already exist): ${skipped}`);
  console.log(`  Errors: ${errors}`);

  process.exit(0);
}

addStatuteSeeds().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
