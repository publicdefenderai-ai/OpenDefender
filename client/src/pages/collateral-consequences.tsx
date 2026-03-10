import { BrandShieldIcon } from "@/components/brand-logo";
import { useRef } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Shield, Scale, Clock, FileText } from "lucide-react";

const SECTIONS = [
  { id: "immigration", label: "Immigration" },
  { id: "housing", label: "Housing" },
  { id: "employment", label: "Employment" },
  { id: "benefits", label: "Public Benefits" },
  { id: "family", label: "Family & Custody" },
  { id: "civil-rights", label: "Civil Rights" },
  { id: "sex-offender", label: "Sex Offender Registry" },
  { id: "gang-designation", label: "Gang Designation" },
];

function SectionHeader({ id, label, children }: {
  id: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-4">{label}</h2>
      {children}
    </div>
  );
}

function Impact({ text }: { text: string; critical?: boolean }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <span className="flex-shrink-0 mt-0.5">–</span>
      <span>{text}</span>
    </li>
  );
}

function BeforePlea({ children }: { children: React.ReactNode }) {
  return (
    <Alert className="mt-5 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
      <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
        <strong>Before accepting any plea deal: </strong>{children}
      </AlertDescription>
    </Alert>
  );
}

export default function CollateralConsequences() {
  useScrollToTop();
  const { t } = useTranslation();
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            {t('collateralConsequences.title')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('collateralConsequences.subtitle')}
          </p>
        </div>
      </section>

      {/* Sticky section nav */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 scrollbar-hide no-scrollbar">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-border hover:bg-muted hover:border-foreground/20 transition-colors flex-shrink-0"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main ref={mainRef} className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-16">

        {/* Intro alert */}
        <ScrollReveal>
          <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertDescription className="text-red-800 dark:text-red-200">
              <strong>This matters before any plea.</strong> Collateral consequences are often permanent and apply immediately upon conviction. Many defendants only learn about them after they've already pleaded guilty. Review this page — and consult an attorney — before making any decisions about your case.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* ── IMMIGRATION ─────────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="immigration" label="Immigration">
            <Card className="border-red-200 dark:border-red-900">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  For non-citizens — including lawful permanent residents with green cards — certain criminal convictions can result in mandatory deportation, bars to reentry, and denial of citizenship. These consequences apply regardless of how long you've lived in the United States or your family ties here.
                </p>
                <ul className="space-y-3">
                  <Impact critical text="Aggravated felonies (a federal category that includes many state misdemeanors and felonies) trigger mandatory deportation with a permanent bar to reentry — there is no discretion for an immigration judge." />
                  <Impact critical text="Crimes Involving Moral Turpitude (CIMT), controlled substance offenses, domestic violence, and firearms offenses can all make a non-citizen deportable even with a green card." />
                  <Impact text="A conviction for a deportable offense may bar you from applying for asylum, cancellation of removal, or adjustment of status — even if you would otherwise qualify." />
                  <Impact text="A single drug possession conviction (other than a first offense for marijuana under 30g) can result in permanent inadmissibility — meaning you cannot return to the U.S. if you leave." />
                  <Impact text="Even deferred adjudication, diversion programs, and expunged convictions may be treated as convictions under federal immigration law." />
                  <Impact text="A sentence of one year or more (even if suspended) on a qualifying offense can convert a misdemeanor into a deportable aggravated felony." />
                </ul>
                <BeforePlea>
                  Ask your attorney specifically: "Will this plea make me deportable, inadmissible, or ineligible for any immigration benefit?" If they are not an immigration attorney, request a consultation with one before signing anything.
                </BeforePlea>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── HOUSING ─────────────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="housing" label="Housing">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Criminal records affect access to both public housing and the private rental market. These consequences can begin before sentencing and persist long after a sentence is completed.
                </p>
                <ul className="space-y-3">
                  <Impact critical text='Federal law requires public housing authorities to deny admission to anyone convicted of certain drug offenses and sex offenses requiring registration. Many PHAs apply additional "one-strike" policies for other convictions.' />
                  <Impact text="Existing public housing tenants can be evicted — along with their household — if a family member is convicted of drug activity or certain other crimes, even if the activity occurred off-site." />
                  <Impact text="Section 8 Housing Choice Vouchers can be terminated based on criminal history. Recipients who lose their voucher due to a criminal conviction face long waiting lists with no path to reinstatement." />
                  <Impact text="Private landlords in most states can use background checks to screen tenants. Many automatically reject applicants with felony convictions, and some reject any criminal record." />
                  <Impact text="Several states and cities (including California, New York, and Illinois) have enacted laws limiting landlords' use of criminal history — but these protections vary widely and do not apply everywhere." />
                  <Impact text="Transitional and supportive housing programs also screen for criminal history; certain conviction types disqualify applicants from programs specifically designed to help people reenter society." />
                </ul>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── EMPLOYMENT ──────────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="employment" label="Employment">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  A criminal record affects employment at two levels: the private job market and licensed professions. The consequences vary significantly by industry, conviction type, and state.
                </p>
                <ul className="space-y-3">
                  <Impact text="Private employers can conduct background checks and in most states can deny employment based on any criminal conviction. No federal law prohibits this in the private sector." />
                  <Impact text='"Ban the box" laws in California, Illinois, New York, Texas, and other states delay when employers can ask about criminal history, but most still permit disqualification after a conditional offer is made.' />
                  <Impact critical text="Many licensed professions — including nursing, teaching, social work, pharmacy, law, financial advising, and security — have mandatory disqualification or enhanced review for certain convictions. A conviction can permanently end a career in these fields." />
                  <Impact text="Federal contractor positions and jobs requiring security clearances apply strict disqualification standards; most felony convictions permanently bar federal employment in sensitive roles." />
                  <Impact text="Driving-related convictions (DUI, reckless driving) can affect commercial driver's license eligibility, permanently disqualifying individuals from trucking and transportation careers." />
                  <Impact text="Conviction records appear on background checks for years — sometimes indefinitely. Expungement may remove the record from public access but may not remove it from all employer databases or FBI records." />
                </ul>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── PUBLIC BENEFITS ──────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="benefits" label="Public Benefits">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Several federal benefit programs have statutory restrictions tied to criminal convictions. State-level restrictions vary.
                </p>
                <ul className="space-y-3">
                  <Impact text="Federal law imposes a lifetime ban on SNAP (food stamps) and TANF (cash assistance) for individuals convicted of a drug felony — though many states (including California, New York, and Illinois) have opted out of this ban and restored eligibility." />
                  <Impact text="Texas retains the federal drug felony ban on SNAP benefits for individuals who have not completed their sentence, including probation." />
                  <Impact critical text="Federal student loans and Pell Grants are suspended for students convicted of drug offenses that occurred while receiving financial aid. Eligibility is restored after completing a drug rehabilitation program or after two years, depending on the offense." />
                  <Impact text="Individuals with drug felony convictions may be ineligible for subsidized federally-assisted housing (see Housing section)." />
                  <Impact text="Social Security Disability (SSDI) and Supplemental Security Income (SSI) benefits are suspended while an individual is incarcerated, and eligibility review is required upon release." />
                  <Impact text="Conviction of certain crimes can affect eligibility for veterans' benefits, including VA healthcare and disability compensation — particularly for dishonorable discharges related to criminal conduct." />
                </ul>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── FAMILY & CUSTODY ─────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="family" label="Family & Custody">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  A criminal case — even one that does not result in incarceration — can significantly affect child custody and parental rights.
                </p>
                <ul className="space-y-3">
                  <Impact critical text="An arrest or conviction (especially for domestic violence, child abuse, drug offenses, or sex offenses) can be used as grounds to modify an existing custody order — sometimes resulting in supervised visitation or loss of custody." />
                  <Impact text="Incarceration during a case or after conviction can be used by the other parent to seek primary custody, citing the child's need for stability." />
                  <Impact text="Child Protective Services (CPS) may open an investigation when a parent is arrested, particularly for offenses involving violence, substance abuse, or minors." />
                  <Impact text="A termination of parental rights (TPR) proceeding can be initiated if incarceration lasts long enough that the state determines the parent cannot provide care." />
                  <Impact text="Adoption eligibility is affected by criminal history; many agencies and courts apply heightened scrutiny or outright bars for certain conviction types." />
                  <Impact text="Foster care licensing applications are denied based on certain convictions; existing foster care placements can be removed from the home of a licensed caregiver who is charged." />
                </ul>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── CIVIL RIGHTS ─────────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="civil-rights" label="Civil Rights">
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Felony convictions result in the loss of several civil rights. The extent and duration of these losses depends heavily on state law.
                </p>
                <ul className="space-y-3">
                  <Impact text="Voting rights: Felony convictions result in disenfranchisement in most states. California, Illinois, and New York restore voting rights upon completion of the sentence (including parole). Texas restores rights only after completing the full sentence plus any probation or parole. Laws in this area change frequently — check current state law." />
                  <Impact critical text="Firearms rights: Federal law (18 U.S.C. § 922(g)) permanently prohibits felons from possessing firearms or ammunition. Some states extend this prohibition to certain misdemeanors (including domestic violence). This prohibition cannot be restored by state expungement alone." />
                  <Impact text="Jury service: Felony conviction disqualifies individuals from federal jury service permanently and from state jury service under most state laws, either permanently or until rights are restored." />
                  <Impact text="Public office: Individuals with felony convictions are ineligible for certain elected and appointed government positions, including law enforcement roles, at the federal and state level." />
                  <Impact text="Notary public, real estate licenses, and other government-issued authorizations frequently have statutory disqualification provisions for felony convictions." />
                </ul>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── SEX OFFENDER REGISTRY ────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="sex-offender" label="Sex Offender Registration">
            <Card className="border-orange-200 dark:border-orange-900">
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sex offender registration requirements are among the most sweeping collateral consequences, imposing ongoing obligations that persist for years or decades after a sentence is completed.
                </p>
                <ul className="space-y-3">
                  <Impact critical text="SORNA (Sex Offender Registration and Notification Act) establishes a federal framework requiring registration for covered offenses. Failure to register is itself a federal felony." />
                  <Impact text="Most states use a tiered system (Tier I, II, III) based on offense severity. Tier III offenders typically must register for life; lower tiers require registration for 15-25 years with periodic in-person verification." />
                  <Impact critical text="Registration requirements restrict where registrants can live (not near schools, parks, or daycare centers), where they can work, and in some jurisdictions, where they can be present at any given time." />
                  <Impact text="Registrants are listed on publicly searchable online databases that include name, photograph, address, and offense information — visible to neighbors, employers, landlords, and schools." />
                  <Impact text="Travel is significantly restricted. International travel requires advance notice to authorities, and many countries deny entry to registered sex offenders." />
                  <Impact text="Some offenses trigger registration even without incarceration — including certain misdemeanors involving minors. This consequence is often not anticipated at the time of a plea." />
                  <Impact text="California operates a three-tier system; New York requires registration for life for the most serious offenses; Texas requires annual verification and community notification for high-risk offenders." />
                </ul>
                <BeforePlea>
                  Ask your attorney specifically whether the charge or plea will trigger registration requirements. Registration is triggered by the conviction itself — not the sentence imposed — and cannot be avoided by negotiating a reduced sentence.
                </BeforePlea>
              </CardContent>
            </Card>
          </SectionHeader>
        </ScrollReveal>

        {/* ── GANG DESIGNATION ─────────────────────────────────── */}
        <ScrollReveal>
          <SectionHeader id="gang-designation" label="Gang Designation">
            <div className="space-y-5">
              <Alert className="border-purple-300 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                <AlertDescription className="text-purple-800 dark:text-purple-200 text-sm">
                  Being labeled a gang member by law enforcement is not a criminal conviction — but it carries serious legal consequences regardless. In many states, designation can happen without notice, without a hearing, and without any requirement of criminal activity.
                </AlertDescription>
              </Alert>

              {/* How it happens */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">How Gang Designation Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Law enforcement agencies in California, Texas, New York, Illinois, and most other major states maintain gang databases. Entry criteria vary but typically require meeting two or more of the following: self-admission; being observed associating with known gang members; wearing gang-affiliated clothing, colors, or tattoos; or being identified by a reliable informant.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    California's CalGang database is one of the largest; a 2016 audit found significant errors, including minors and individuals with no gang ties being listed. Similar concerns have been raised about Chicago's database and New York's gang database. Many states do not require notification when someone is added, making it difficult to challenge the designation.
                  </p>
                </CardContent>
              </Card>

              {/* Consequences for you */}
              <Card className="border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="text-base">Consequences for You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-3">
                    <Impact
                      critical
                      text="Sentence enhancements: In California (Penal Code §186.22), Texas (Penal Code Ch. 71), New York, and Illinois, any crime found to be gang-related carries mandatory additional prison time — often 2 to 10 additional years depending on the offense. These enhancements are on top of the base sentence and are not subject to judicial discretion in many circumstances."
                    />
                    <Impact
                      critical
                      text="Gang database listing: Being placed in a law enforcement gang database is not publicly visible in most states, but it is accessible to prosecutors, probation officers, immigration authorities, and law enforcement nationwide. It can affect how you are charged, how bail is set, and how you are classified within the correctional system."
                    />
                    <Impact
                      text="Supervision conditions: Probation and parole conditions for individuals with gang designations routinely prohibit associating with anyone else in the database — even if those individuals are childhood friends or neighbors. Violation of these conditions, even incidental contact, is grounds for immediate revocation."
                    />
                    <Impact
                      text="Gang injunctions (primarily California, but also other states): Civil injunctions may restrict where you can go, who you can be with, what you can wear, and what time you can be outside in designated areas — regardless of whether you have been charged with any crime."
                    />
                    <Impact
                      critical
                      text="Immigration: Federal immigration authorities treat gang membership as a basis for removal, denial of asylum, and expedited deportation — even without a criminal conviction. The DHS maintains its own gang designation process. A gang designation can permanently bar a non-citizen from obtaining legal status."
                    />
                    <Impact
                      text="Prosecution strategy: Gang designation is frequently used by prosecutors to introduce evidence of prior bad acts, to support conspiracy charges against multiple defendants, and to seek higher bail. Cases involving gang allegations are statistically more likely to go to trial and more likely to result in maximum sentences."
                    />
                    <Impact
                      text="Correctional classification: Within jails and prisons, gang designation affects housing assignments, programming eligibility, and visitation restrictions. Designated gang members may be placed in administrative segregation."
                    />
                  </ul>
                </CardContent>
              </Card>

              {/* Consequences for associates */}
              <Card className="border-purple-200 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="text-base">Consequences for People Who Associate With You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Gang designation creates legal risk for the people around you — including family members who are not involved in any criminal activity.
                  </p>
                  <ul className="space-y-3">
                    <Impact
                      critical
                      text="Association-based designation: In most states, being repeatedly observed with a known gang member is itself sufficient grounds for being added to a gang database. Family members, roommates, and friends who have regular contact with a designated individual may be documented and eventually listed themselves — without any criminal record."
                    />
                    <Impact
                      text="Gang injunctions apply to named individuals but the geographic restrictions affect everyone in the area. Family members who live in an injunction zone may face scrutiny for interacting with injunction subjects, including within their own homes in some circumstances."
                    />
                    <Impact
                      critical
                      text="Conspiracy exposure: Providing assistance — housing, money, transportation, use of a phone — to someone you know is involved in gang-related criminal activity can expose friends and family to conspiracy or aiding-and-abetting charges. Courts have applied these theories broadly in gang cases."
                    />
                    <Impact
                      text="Surveillance: Law enforcement monitoring of gang-designated individuals routinely extends to their known associates. Phone calls, social media, vehicles, and physical movements of family members and friends may be documented."
                    />
                    <Impact
                      text="Public housing: If you live in public housing and are designated as a gang member, your household — including family members who share your unit — may face eviction proceedings. Family members who remain in the unit may be required to exclude you as a condition of keeping their housing."
                    />
                    <Impact
                      text="Immigration impact on family: Non-citizen family members with pending applications (green card, asylum, citizenship) may find that their relationship to a gang-designated person is raised by immigration authorities in their own proceedings, potentially delaying or jeopardizing their cases."
                    />
                    <Impact
                      text="School-based consequences: Siblings and children of gang-designated individuals may face enhanced scrutiny in schools that share information with law enforcement, particularly in states with active gang interdiction programs."
                    />
                  </ul>
                </CardContent>
              </Card>

              {/* Challenging designation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Challenging a Gang Designation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Processes for challenging gang designations vary significantly by jurisdiction, but options generally include:
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Requesting access to your gang file and the documentation used to designate you — this is not always available but should be requested through your attorney.",
                      "Challenging designation as part of a criminal case in which a gang enhancement has been alleged — this is the most common forum for contesting gang evidence.",
                      "Petitioning for removal from the database in states that have created formal processes (California has a limited removal process).",
                      "Raising constitutional challenges to designation (due process, First Amendment association) — these have had mixed success but have resulted in significant database reforms in several jurisdictions.",
                    ].map((text, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 mt-0.5">–</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </SectionHeader>
        </ScrollReveal>

        {/* Cross-links */}
        <ScrollReveal>
          <div className="mt-4 border-t border-border pt-10">
            <h2 className="text-lg font-semibold mb-3">{t('collateralConsequences.relatedGuides')}</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/process", icon: Scale, title: "Plea Bargains" },
                { href: "/immigration-guidance", icon: FileText, title: "Immigration Guidance" },
                { href: "/record-expungement", icon: Shield, title: "Record Expungement" },
                { href: "/first-24-hours", icon: Clock, title: "Your First 24 Hours" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <item.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal>
          <Alert className="mt-8 border-slate-200 dark:border-slate-700">
            <BrandShieldIcon size={16} />
            <AlertDescription className="text-muted-foreground text-sm">
              This page provides general information about collateral consequences and does not constitute legal advice. Laws vary significantly by state, offense type, and individual circumstances. Consult a licensed attorney — and an immigration attorney if you are a non-citizen — before making any decisions about your case.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
