import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle, Info, Mail } from "lucide-react";

// States whose preliminary-hearing and discovery-deadline fields are estimates
// (arraignment, bail, and speedy-trial are fully verified for all 52 jurisdictions)
const ESTIMATE_JURISDICTIONS = [
  'MA', 'MO', 'LA', 'OK', 'CT', 'NM', 'NE', 'WV', 'ID', 'HI',
  'NH', 'ME', 'MT', 'RI', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC',
];

function ConfidenceBadge({ level }: { level: 'verified' | 'estimated' | 'partial' }) {
  if (level === 'verified') {
    return (
      <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950/20 gap-1">
        <CheckCircle className="h-3 w-3" />
        Verified
      </Badge>
    );
  }
  if (level === 'partial') {
    return (
      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-950/20 gap-1">
        <Info className="h-3 w-3" />
        Partially Estimated
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50 dark:text-orange-400 dark:border-orange-700 dark:bg-orange-950/20 gap-1">
      <AlertTriangle className="h-3 w-3" />
      Estimated
    </Badge>
  );
}

function SectionHeader({
  number,
  title,
  confidence,
}: {
  number: string;
  title: string;
  confidence: 'verified' | 'estimated' | 'partial';
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <ConfidenceBadge level={confidence} />
    </div>
  );
}

function ReportError() {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground flex items-start gap-2">
        <Mail className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <span>
          <strong className="text-foreground">Spotted an error?</strong>{" "}
          Email{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          with the state, the section, and what you believe the correct rule to be. We review all
          submissions and update the platform within 30 days of confirmed corrections.
        </span>
      </p>
    </div>
  );
}

export default function DataSources() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            Data Sources &amp; Methodology
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Where our legal content comes from, how confident we are in it, and what its limitations are.
          </p>
          <p className="text-sm text-white/60 mt-2">Last reviewed: July 2026</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Top Limitations Card */}
        <ScrollReveal>
          <Alert className="mb-12 border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-900 dark:text-amber-200 ml-2">
              <p className="font-semibold text-base mb-3">Three things every user should know before relying on this platform</p>
              <ol className="list-decimal pl-4 space-y-2 text-sm leading-relaxed">
                <li>
                  <strong>Most criminal charges were synthesized, not pulled from state statutes.</strong>{" "}
                  Our 7,155-charge database was built from Model Penal Code patterns. Statute codes in the
                  base set are generated placeholders — they are useful for organizing guidance but should
                  not be cited as authoritative without cross-checking against your state's official code.
                </li>
                <li>
                  <strong>Preliminary-hearing and discovery-deadline data for 20 states are estimates.</strong>{" "}
                  Arraignment timing, bail hearing timing, and speedy-trial windows are verified for all 52
                  jurisdictions. But for {ESTIMATE_JURISDICTIONS.join(', ')}, the specific preliminary-hearing
                  and discovery-deadline fields have not been verified against primary sources and are shown
                  as approximations.
                </li>
                <li>
                  <strong>This platform has not been formally reviewed by a licensed attorney.</strong>{" "}
                  Content is researched and written by the platform team and checked against primary legal
                  sources. It is not legal advice, and it has not undergone a full attorney review pass.
                  Always verify important deadlines and rights with a qualified attorney.
                </li>
              </ol>
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Section 1 — Jurisdiction Procedure Rules */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§1" title="Jurisdiction Procedure Rules" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source type</p>
                    <p>State statutes, court rules, and case law — one primary citation per jurisdiction</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>All 50 states + DC + Federal + 5 U.S. territories (57 total)</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Each jurisdiction's procedural rules — how quickly you must be brought before a judge, when bail is set,
                    how long the government has to bring your case to trial, and what phone-call rights you have — are stored
                    with a specific statute or court-rule citation. For example, California's arraignment deadline cites{" "}
                    <em>Cal. Penal Code § 825</em>; the federal speedy-trial window cites{" "}
                    <em>18 U.S.C. § 3161(c)(1)</em>.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What is verified vs. estimated</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Arraignment deadline, bail hearing timing, speedy-trial window, phone-call rights, and bail structure</strong>{" "}
                        are verified for all 52 jurisdictions (50 states + DC + Federal) with a specific cited source.
                        The 5 territories (AS, GU, MP, PR, VI) are verified at medium confidence from territory codes.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Preliminary hearing timing and discovery deadline</strong>{" "}
                        for the following 20 jurisdictions are estimates that have not been verified against a primary source:{" "}
                        {ESTIMATE_JURISDICTIONS.join(', ')}. These fields are shown to users with an "estimated" notice.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key reform notes</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Illinois eliminated cash bail statewide (SAFE-T Act, effective Sept. 18, 2023)</li>
                    <li>New Jersey eliminated cash bail for most defendants (Criminal Justice Reform Act, effective Jan. 1, 2017)</li>
                    <li>New York eliminated cash bail for most non-violent offenses (2019 bail reform, amended 2020 and 2022)</li>
                    <li>Florida changed its speedy-trial clock to run from filing of formal charges, not arrest (effective July 1, 2025)</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How data is kept current</p>
                  <p className="text-sm text-muted-foreground">
                    Each entry records the date it was last verified. Entries older than 12 months are flagged for re-verification
                    in our quarterly automated review. When a state legislature amends a speedy-trial statute or bail reform passes,
                    the entry is updated and dated.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 2 — Criminal Charges Database */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§2" title="Criminal Charges Database" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary source</p>
                    <p>Model Penal Code (ALI); individual state statutes for verified entries; FBI UCR for charge frequency ranking</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>7,155 charges across 57 jurisdiction codes (50 states + DC + 5 territories + Federal)</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Two accuracy tiers</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">Tier A — Base charges (~6,496 entries): synthesized</p>
                      <p>
                        The original charge set was built from Model Penal Code patterns, not by pulling each statute
                        individually from each state legislature. Statute codes in this tier (for example,{" "}
                        <code className="text-xs bg-muted px-1 rounded">Cal. Penal Code § X</code>) are generated
                        placeholders used for organizational consistency. Penalty ranges reflect common patterns.{" "}
                        <strong className="text-foreground">Do not cite these statute numbers as authoritative</strong>{" "}
                        without cross-referencing the actual state code. Since July 2026, major jurisdictions (CA, NY, FL,
                        IL, OH, GA, NC, NJ, VA, AZ, and others) have had their base charges spot-checked and corrected
                        against primary statute text.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">Tier B — Inchoate, derivative, and specialty charges (659 entries): doctrine-grounded</p>
                      <p>
                        Attempt, conspiracy, aiding and abetting, and accessory charges (Phases 1–2) cite actual MPC
                        doctrine (§§ 2.06, 2.07, 5.01, 5.03) and federal statutes (18 U.S.C. §§ 2, 3, 371).
                        Sentencing enhancements (Phase 3) and white-collar offenses (Phase 4) cite federal statutes directly.
                        Juvenile proceedings (Phase 5) cite 18 U.S.C. §§ 5031–5042 and landmark cases (<em>In re Gault</em>,{" "}
                        <em>Kent v. United States</em>, <em>Miller v. Alabama</em>).
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Jury instruction overlay</p>
                  <p className="text-sm text-muted-foreground">
                    A separate companion dataset annotates select charges in major jurisdictions with jury instruction
                    references — for example, CALCRIM 1600 for robbery in California, or NYPJI 155.25 for theft in
                    New York. These references include direct URLs to court-hosted instruction documents where publicly
                    available. Some instruction sets are paywalled (Westlaw, LexisNexis); those entries include the
                    instruction number but not a direct link. Coverage is concentrated in CA, NY, FL, TX, PA, OH, and IL.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Live citation validation</p>
                  <p className="text-sm text-muted-foreground">
                    When AI guidance cites a statute, it passes through a three-tier validator before being shown to users:{" "}
                    (1) local database check, (2) CourtListener case-law search, and (3) OpenLaws live statute lookup.
                    Any citation not confirmed by at least one tier is flagged as unverified in the guidance output.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 2b — Charge Explanations */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§2b" title="Charge Explanations" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary source</p>
                    <p>Statute text read directly from state legislature and government websites, one citation per verified entry</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>16 of 56 charge categories have real, state-specific detail so far; the rest use general, non-state-specific language</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    The "Understanding Your Charges" card and its PDF version explain what a charge means in plain
                    language. This content is a separate project from the citation database above, and started later:
                    it had no sourcing at all until August 2026. Closing that gap is ongoing, and coverage is
                    partial by design. We would rather show you accurate detail for the charges we have verified,
                    and a clearly general explanation for the ones we have not, than pretend every state has been checked.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What is verified vs. general</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">State-specific: 16 highest-frequency charges</p>
                      <p>
                        Murder (first degree, second degree, felony murder), manslaughter, assault (first degree,
                        aggravated, deadly weapon, second degree, third degree), battery, domestic violence, DUI,
                        drug possession, theft, robbery, and burglary have real detail for all 10 of our original
                        anchor states: California, New York, Florida, Virginia, Ohio, Illinois, Georgia, North
                        Carolina, New Jersey, and Arizona, plus Texas, Pennsylvania, Michigan, Washington,
                        Massachusetts, Tennessee, Indiana, Missouri, Maryland, Wisconsin, Colorado, Minnesota,
                        South Carolina, Alabama, Louisiana, Kentucky, Oregon, Oklahoma, Connecticut, Utah, Nevada, Iowa, Arkansas, Mississippi, Kansas, New Mexico, Puerto Rico, Nebraska, Idaho, West Virginia, Hawaii, New Hampshire, Maine, Montana, Rhode Island, Delaware, North Dakota, Vermont, the District of Columbia, Wyoming, and Alaska, the first forty-one jurisdictions added beyond that anchor set, including Puerto Rico as the first U.S. territory in this expansion. Some individual
                        charge terms do not exist in every state (for example, several states have no "first
                        degree assault" statute, and Indiana and Wisconsin have no "assault" concept separate from
                        battery at all); those gaps are noted directly rather than force-mapped to the wrong charge.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">State-specific: 20 additional charges (48 states so far)</p>
                      <p>
                        Weapons charges, financial fraud, sexual assault, resisting arrest, forgery, failure to
                        appear, shoplifting, criminal mischief, trespass, disorderly conduct, stalking, animal
                        cruelty, prostitution, receiving stolen property, criminal nonsupport, hate crime
                        enhancement, kidnapping, arson, carjacking, and vehicular homicide have real detail for
                        all 10 of our original anchor states (California, New York, Florida, Virginia, Ohio,
                        Illinois, Georgia, North Carolina, New Jersey, and Arizona) plus Texas, Pennsylvania,
                        Michigan, Washington, Massachusetts, Tennessee, Indiana, Missouri, Maryland, Wisconsin,
                        Colorado, Minnesota, South Carolina, Alabama, Louisiana, Kentucky, Oregon, Connecticut,
                        Utah, Nevada, Iowa, Arkansas, Mississippi, Kansas, Nebraska, Idaho, West Virginia, Hawaii,
                        New Hampshire, Maine, Montana, Rhode Island, Delaware, North Dakota, Vermont, the
                        District of Columbia, Wyoming, and Alaska. Expanding this coverage to the remaining jurisdictions is ongoing.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">General only: the remaining 24 charge categories</p>
                      <p>
                        Charges like sex offenses against minors, rape, indecent exposure, driving offenses, and
                        drug distribution still use general, non-state-specific language. This is the same content
                        that existed before this project started, not yet reviewed against any state's actual
                        statute text.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why some states are missing for a given charge</p>
                  <p className="text-sm text-muted-foreground">
                    Not every state uses the same legal terms. For example, California, Florida, and Ohio do not
                    have a charge called "first degree assault," so no entry is forced to fit that label; their
                    real equivalents (aggravated assault, felonious assault) are covered under those charges
                    instead. New Jersey does not grade murder into degrees at all. When a state genuinely does not
                    use a term, that is stated plainly rather than mapped to the wrong statute.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How data is kept current</p>
                  <p className="text-sm text-muted-foreground">
                    Each state-specific entry records the statute it was read from, a link to that source, and the
                    date it was last verified. As coverage expands to more states and charge categories, this
                    section will be updated to reflect the current state.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 3 — Collateral Consequences */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§3" title="Collateral Consequences" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary citations</p>
                    <p>
                      18 U.S.C. § 922(g) (federal firearms prohibition); <em>Padilla v. Kentucky</em>, 559 U.S. 356
                      (2010) (immigration consequences); 21 U.S.C. § 862a (federal SNAP/TANF drug felony ban);
                      34 U.S.C. § 20901 et seq. (SORNA)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>All 50 states + DC (51 entries), across 7 consequence categories</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Collateral consequences are the legal penalties that follow a conviction beyond the sentence itself —
                    things like loss of voting rights, firearms restrictions, public housing ineligibility, professional
                    license revocation, and immigration consequences. Our screener covers seven categories for each state:
                    voting rights restoration, ban-the-box / fair chance hiring, occupational licensing restrictions,
                    SNAP/TANF drug-felony bans, fair chance housing laws, driver's license suspension, and immigration
                    enforcement posture.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secondary sources</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Collateral Consequences Resource Center (CCRC) — state profiles and licensing tracker</li>
                    <li>NELP Fair Chance Hiring Tracker and NCSL Ban-the-Box state law survey</li>
                    <li>USDA FNS State Options Reports (SNAP drug-felony ban status)</li>
                    <li>ILRC Quick Reference Chart (2024) for immigration enforcement posture</li>
                    <li>NCSL sex offender registration law database</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Known limitations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Most entries are verified at "medium" confidence — checked against a secondary source but not always the primary statute text</li>
                    <li>Voting rights data reflects the law as of July 2026; executive-order-based policies (notably Virginia) can change without legislative action</li>
                    <li>Local ordinances and county-level policies are not captured; only statewide rules are shown</li>
                    <li>The <em>Padilla v. Kentucky</em> duty applies to defense counsel advising clients, not to platform users directly; individual immigration consequences depend on specific facts and immigration status</li>
                  </ul>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 4 — Constitutional Rights */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§4" title="Constitutional Rights" confidence="verified" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary citations</p>
                    <p>U.S. Const. Amends. IV, V, VI, VIII, XIV; landmark Supreme Court decisions</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last editorial review</p>
                    <p>May 2026</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Our constitutional rights content — Miranda rights, right to remain silent, right to counsel,
                    protection from unreasonable searches, and related rights — is authored by the platform team
                    and grounded in well-established Supreme Court precedent. The law in this area is stable;
                    the major cases have been settled for decades.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Landmark cases cited</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><em>Miranda v. Arizona</em>, 384 U.S. 436 (1966) — right to remain silent, right to counsel during interrogation</li>
                    <li><em>Gideon v. Wainwright</em>, 372 U.S. 335 (1963) — Sixth Amendment right to appointed counsel</li>
                    <li><em>Mapp v. Ohio</em>, 367 U.S. 643 (1961) — exclusionary rule applies to states via Fourteenth Amendment</li>
                    <li><em>Terry v. Ohio</em>, 392 U.S. 1 (1968) — reasonable suspicion standard for investigatory stops</li>
                    <li><em>Riley v. California</em>, 573 U.S. 373 (2014) — warrant required to search a cell phone incident to arrest</li>
                    <li><em>Brady v. Maryland</em>, 373 U.S. 83 (1963) — prosecution must disclose material exculpatory evidence</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Areas of genuine legal uncertainty noted on site</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Biometric device unlocking (fingerprint/face): unsettled law, significant circuit variation</li>
                    <li>Terry stop custody analysis: varies by circuit and state — not uniform nationally</li>
                  </ul>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 5 — Expungement Eligibility */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§5" title="Expungement Eligibility" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary sources</p>
                    <p>State legislature websites (statute text) and state court administrative websites; one citation per state entry</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>All 50 states + DC + Federal (52 entries total). Expanded to full national coverage in March 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Expungement (or record sealing, set-aside, or similar relief depending on the state) rules vary
                    enormously. Each state entry in our database lists: waiting periods by charge type, which offenses
                    are excluded, whether the state offers true expungement (record destruction) or only sealing,
                    and estimated filing fees where available.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secondary reference sources</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>NCSL Expungement/Sealing State Statutes Survey</li>
                    <li>Clean Slate Initiative state tracker</li>
                    <li>National Reentry Resource Center</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Known limitations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Filing fees change frequently and may not reflect current court schedules</li>
                    <li>Several states (AZ, NM) offer "set-aside" statutes rather than true expungement; this distinction is noted per entry</li>
                    <li>Wisconsin expungement is only available if a judge orders it at sentencing — no post-sentence petition pathway exists</li>
                    <li>Nebraska has no conviction expungement; only non-conviction records (arrests, acquittals) are eligible</li>
                    <li>Entries with last-verified dates older than 24 months should be treated with extra caution</li>
                  </ul>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 6 — Diversion Programs */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§6" title="Diversion Programs" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary sources</p>
                    <p>NADCP Find-a-Drug-Court locator; NDAA Prosecutor-Led Diversion Directory; individual state court system and prosecutor office websites</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>111 programs covering all 50 states + DC + Federal. Last link validation: April 10, 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Pre-trial diversion and alternative sentencing programs let eligible defendants avoid a criminal record
                    by completing conditions like treatment, community service, or education. Our database covers drug courts,
                    mental health courts, veterans courts, and prosecutor-led diversion programs. Metro-area programs include
                    specific court contact information; statewide entries link to the official state court system's
                    specialty courts portal.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Important limitation</p>
                  <p className="text-sm text-muted-foreground">
                    Diversion program eligibility criteria, operating status, phone numbers, and even program existence
                    change frequently — often without public notice. Our quarterly link check catches dead URLs, but
                    cannot verify whether program details are still accurate. Always contact the program or court directly
                    before relying on our data. Program entries are re-verified annually at minimum.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 7 — Legal Aid Organizations */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§7" title="Legal Aid Organizations" confidence="verified" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Primary sources</p>
                    <p>EOIR Pro Bono List; Legal Services Corporation (LSC) grantee directory; federal judiciary public defender directory; official state and county government websites</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>195+ organizations. Last manual verification: March 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Our directory covers four types of organizations: EOIR-approved immigration legal aid providers,
                    LSC-funded civil and criminal legal aid organizations, Federal Public Defender offices (one per
                    federal district), and local/county public defender offices and court-appointed attorney programs.
                    Each entry records the verification source (EOIR list, LSC directory, or official government website).
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How we keep it accurate</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Quarterly automated URL checks flag 404 errors and redirects</li>
                    <li>Entries with missing phone numbers are automatically flagged for manual lookup</li>
                    <li>March 2026 manual pass: 13 corrections applied (addresses, phone numbers, and website URLs)</li>
                  </ul>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 8 — Jury Instruction References */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§8" title="Jury Instruction References" confidence="partial" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Source type</p>
                    <p>Official court-published instruction sets; supplemented by commercially published sets where court PDFs are unavailable</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Coverage</p>
                    <p>Major jurisdictions: CA, NY, FL, TX, PA, OH, IL, and others. Not all charges in all states have instruction references.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Jury instruction references tell attorneys and defendants which standard instruction a jury would
                    receive for a given charge. We annotate charges with instruction series numbers (such as CALCRIM 1600
                    for robbery in California) and — where the instruction set is publicly available — a direct URL to
                    the court's PDF.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Instruction sets referenced</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-muted-foreground border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">State / Series</th>
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">Full Name</th>
                          <th className="text-left py-2 font-semibold text-foreground">Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          ['CALCRIM', 'California Criminal Jury Instructions (Judicial Council)', 'Free — Judicial Council website'],
                          ['CALJIC', 'California Jury Instructions — Criminal (older series)', 'Paywalled — West/LexisNexis'],
                          ['NYPJI', 'New York Pattern Jury Instructions — Criminal', 'Free — NY Courts website'],
                          ['FPJI', 'Florida Standard Jury Instructions in Criminal Cases', 'Free — Florida Supreme Court'],
                          ['CTJI', 'Connecticut Criminal Jury Instructions', 'Free — CT Judicial Branch'],
                          ['O\'Malley', 'Federal Jury Practice and Instructions (criminal)', 'Paywalled — Westlaw'],
                          ['Sand', 'Modern Federal Jury Instructions — Criminal', 'Paywalled — LexisNexis'],
                          ['TX CPJC', 'Texas Criminal Pattern Jury Charges', 'Partially free — State Bar of Texas'],
                          ['PA SSJI', 'Pennsylvania Suggested Standard Criminal Jury Instructions', 'Free — PA Courts website'],
                          ['OH OJI', 'Ohio Jury Instructions — Criminal', 'Paywalled — Baldwin\'s Ohio Practice'],
                          ['IL IPI-Crim', 'Illinois Pattern Jury Instructions — Criminal', 'Free — Illinois Courts website'],
                        ].map(([series, name, access]) => (
                          <tr key={series}>
                            <td className="py-2 pr-4 font-mono font-semibold text-foreground">{series}</td>
                            <td className="py-2 pr-4">{name}</td>
                            <td className="py-2">{access}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Limitation</p>
                  <p className="text-sm text-muted-foreground">
                    Instruction numbers in paywalled sets are included for reference but cannot be independently
                    verified without a subscription. Coverage is not uniform across all charges or all states.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 9 — External Validation APIs */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§9" title="External Validation APIs" confidence="verified" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  When AI guidance generates a statute citation, it passes through a three-tier live validation
                  system before being shown to users. Any citation not confirmed by at least one tier is
                  flagged as unverified in the output.
                </p>

                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">OpenLaws</p>
                      <Badge variant="outline" className="text-xs">Tier 3 fallback</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live statutory database covering 4.3M+ sections across all 50 states and federal law.
                      When a citation is not found in our local database, OpenLaws is queried as an
                      authoritative live source before the citation is flagged as unverified. Fails silently
                      if the API is unavailable.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://docs.openlaws.us/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">docs.openlaws.us</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">CourtListener / RECAP Archive</p>
                      <Badge variant="outline" className="text-xs">Tier 2 — case law confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Semantic case-law precedent search. When AI guidance cites a case, CourtListener is
                      queried to confirm the case exists and is relevant. A confirmed match boosts our
                      confidence in the guidance. CourtListener is a project of the Free Law Project,
                      a nonprofit dedicated to free access to legal information.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://www.courtlistener.com/api/rest/v4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">courtlistener.com</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">GovInfo (U.S. GPO)</p>
                      <Badge variant="outline" className="text-xs">Federal statute metadata</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      U.S. Government Publishing Office API. Used to search and retrieve federal statute
                      package metadata and document links. Covers the United States Code and Code of Federal
                      Regulations.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://api.govinfo.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">api.govinfo.gov</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">LOCUS-v1 (LocalLaws / UC Berkeley)</p>
                      <Badge variant="outline" className="text-xs shrink-0">Municipal ordinances — CC-BY-NC-4.0</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A public dataset of municipal and county ordinance text, used as a supplementary reference
                      for local-ordinance charges (loitering, trespass, disorderly conduct, noise violations,
                      and similar offenses). Not used for state felony or misdemeanor citations.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Citation: Peskoff, Barrow, Vu &amp; Davenport et al. (2026),{" "}
                      <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.{" "}
                      Dataset:{" "}
                      <a
                        href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                      >
                        huggingface.co/datasets/LocalLaws/LOCUS-v1
                      </a>.{" "}
                      Licensed under{" "}
                      <a
                        href="https://creativecommons.org/licenses/by-nc/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                      >
                        CC-BY-NC-4.0
                      </a>.
                    </p>
                  </div>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 10 — AI Guidance Disclosure */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§10" title="AI Guidance" confidence="verified" />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Provider</p>
                    <p>Anthropic — Claude Sonnet 4 (claude-sonnet-4-6) via API</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Features using AI</p>
                    <p>Case Roadmap, AI Chat, Document Summarizer, Letter Generator, Attorney Document Generation</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We use Anthropic's Claude API — not the consumer Claude.ai product — to generate personalized
                    case guidance and document summaries. The key privacy and accuracy properties of this integration are:
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">No training use</p>
                      <p className="text-muted-foreground">
                        Anthropic does not use prompts submitted via the API to train its AI models.
                        Your case details are not used to improve Claude.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">PII redacted before transmission</p>
                      <p className="text-muted-foreground">
                        Before your case details are sent to Anthropic, our servers automatically detect and
                        remove personal information — names, phone numbers, email addresses, Social Security
                        numbers, and similar identifiers. Redaction happens server-side; your personal details
                        never reach Anthropic's infrastructure.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">30-day retention by Anthropic</p>
                      <p className="text-muted-foreground">
                        Under Anthropic's standard API terms, prompts and responses may be retained by
                        Anthropic for up to 30 days for operational and safety purposes. We do not have a
                        zero-data-retention agreement. During this window, Anthropic may be required to
                        disclose conversation data in response to a valid legal process such as a subpoena
                        or court order.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Output is validated, not trusted raw</p>
                      <p className="text-muted-foreground">
                        Every piece of AI guidance passes through a three-tier legal accuracy validator
                        (local database, CourtListener, OpenLaws) before being shown to users. Citations not
                        confirmed by the validator are flagged as unverified. The AI is also given the verified
                        procedural rules for the user's jurisdiction as grounding context before it generates
                        any guidance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    For more details, see our{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Anthropic's Privacy Policy
                    </a>.
                  </p>
                </div>

                <ReportError />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Closing — How to report an error */}
        <ScrollReveal>
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-3">How to Report a Data Error</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                If you are an attorney, legal researcher, or anyone who has found an error in our data — an incorrect
                statute citation, an outdated deadline, a wrong penalty range — please report it. We take accuracy
                seriously and review all submissions.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                <li>Email <a href="mailto:legal-data@opendefender.io" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">legal-data@opendefender.io</a> with the state, the specific field or rule, and what you believe the correct information to be</li>
                <li>Include a citation to the primary source (statute number, court rule, or case citation) if possible</li>
                <li>We will review and respond within 30 days; confirmed corrections are applied and dated in the database</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This page corresponds to the internal <code className="text-xs bg-muted px-1 py-0.5 rounded">SOURCES.md</code> reference document
                maintained by the platform team. The public page omits internal file paths and implementation notes.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
