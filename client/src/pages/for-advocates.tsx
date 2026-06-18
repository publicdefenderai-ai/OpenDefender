import { motion } from "framer-motion";
import {
  ArrowRight,
  Scale,
  Heart,
  Clock,
  BookOpen,
  Users,
  AlertTriangle,
  Shield,
  FileText,
  Search,
  Home,
  Brain,
  Globe2,
  Gavel,
  ClipboardList,
  Star,
  Lock,
} from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ToolCardProps {
  Icon: React.ElementType;
  title: string;
  desc: string;
  href?: string;
  color: string;
  bg: string;
  accent: string;
  comingSoon?: boolean;
  badge?: string;
}

function ToolCard({ Icon, title, desc, href, color, bg, accent, comingSoon, badge }: ToolCardProps) {
  const inner = (
    <div
      className={`flex flex-col h-full rounded-xl border border-l-4 p-5 transition-all
        ${comingSoon
          ? "opacity-60 cursor-default bg-muted/30 border-border"
          : `cursor-pointer hover:shadow-md hover:-translate-y-1 ${bg}`}
      `}
      style={{ borderLeftColor: comingSoon ? undefined : accent }}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon
          className={`h-5 w-5 flex-shrink-0 ${comingSoon ? "text-muted-foreground" : color}`}
          strokeWidth={1.75}
        />
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ml-2">
            {badge}
          </span>
        )}
        {comingSoon && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-2">
            Coming soon
          </span>
        )}
      </div>
      <p className={`font-semibold text-sm mb-1 leading-snug ${comingSoon ? "text-muted-foreground" : "text-foreground"}`}>
        {title}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">{desc}</p>
      {!comingSoon && (
        <p className={`text-xs font-semibold flex items-center gap-1 ${color}`}>
          Open <ArrowRight className="h-3 w-3" />
        </p>
      )}
    </div>
  );

  if (comingSoon || !href) return <div>{inner}</div>;

  return (
    <Link href={href}>
      {inner}
    </Link>
  );
}

interface SectionProps {
  id: string;
  label: string;
  headline: string;
  intro: string;
  children: React.ReactNode;
  cols?: 2 | 3;
}

function Section({ id, label, headline, intro, children, cols = 2 }: SectionProps) {
  return (
    <section id={id} className="py-12 border-t border-border/30">
      <div className="max-w-4xl mx-auto px-4">
        <ScrollReveal>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
          <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">{headline}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-2xl">{intro}</p>
        </ScrollReveal>
        <div className={`grid gap-4 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function ForAdvocates() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-purple py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">
              Advocate Hub
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-5 leading-tight">
              Tools for Public Defenders,{" "}
              <br className="hidden sm:block" />
              Social Workers & Case Advocates
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-6">
              Organized around how you actually work with clients, from first contact through resolution and beyond.
            </p>
            {/* Jump nav */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              {[
                { label: "Before the Plea", href: "#before-plea" },
                { label: "Life Stabilization", href: "#life-stabilization" },
                { label: "Reputation & History", href: "#reputation" },
                { label: "Client Education", href: "#client-education" },
                { label: "Find Help", href: "#find-help" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Before the Plea */}
      <Section
        id="before-plea"
        label="Section 1"
        headline="Before the Plea: Early Intervention"
        intro="The decisions made in the first days after arrest have the longest reach. Collateral consequences, pretrial detention status, and diversion eligibility all need to be evaluated before any plea discussion. Advocates working at this stage can change outcomes more than at any other point in the process."
        cols={3}
      >
        <ScrollReveal delay={0}>
          <ToolCard
            Icon={AlertTriangle}
            title="Collateral Consequences Screening"
            desc="Before any plea discussion: screen for immigration status impact, housing eligibility, professional licensing bars, public benefits loss, parental rights, and sex offender registration requirements. Padilla v. Kentucky makes this a constitutional obligation for defense counsel."
            href="/support/reputation"
            color="text-red-600 dark:text-red-400"
            bg="bg-red-50 dark:bg-red-900/10"
            accent="#dc2626"
            badge="Do first"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07}>
          <ToolCard
            Icon={Gavel}
            title="Bail & Pretrial Release Preparation"
            desc="Pretrial detention status is the single strongest predictor of case outcome — detained clients are more likely to accept unfavorable pleas regardless of the underlying facts. Preparation checklist, documentation guide, and jurisdiction-specific bail factors."
            href="/support/court-logistics/bail-preparation"
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-50 dark:bg-amber-900/10"
            accent="#d97706"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <ToolCard
            Icon={Scale}
            title="Diversion Programs"
            desc="111 programs across all 50 states + DC + Federal. When a client is eligible, diversion is the upstream intervention that makes every other resource unnecessary — no conviction, no record, no collateral consequences. Filter by state, charge type, and program type."
            href="/diversion-programs"
            color="text-teal-600 dark:text-teal-400"
            bg="bg-teal-50 dark:bg-teal-900/10"
            accent="#0f766e"
          />
        </ScrollReveal>
      </Section>

      {/* Section 2 — Life Stabilization */}
      <Section
        id="life-stabilization"
        label="Section 2"
        headline="Life Stabilization"
        intro="Clients with stable housing, income, and family support show up to hearings, follow through on conditions, and receive better outcomes. Life stabilization is not separate from legal strategy — it is legal strategy. Resolving a civil issue (eviction, benefits denial, child support arrears) can remove the instability driving the legal problem."
      >
        <ScrollReveal delay={0}>
          <ToolCard
            Icon={Heart}
            title="Life & Family Support Hub"
            desc="Housing, employment, childcare, mental health, transportation, finances, and re-entry resources — organized by life area. Designed to be shared directly with clients or referred to family members who are coordinating support."
            href="/support"
            color="text-rose-600 dark:text-rose-400"
            bg="bg-rose-50 dark:bg-rose-900/10"
            accent="#be185d"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07}>
          <ToolCard
            Icon={Home}
            title="Court Logistics & Hearing Preparation"
            desc="What to bring to court, court etiquette guidance, bail preparation checklist, and court locator. Clients who are prepared and present well make better impressions — and judges notice."
            href="/support/court-logistics"
            color="text-slate-600 dark:text-slate-400"
            bg="bg-slate-50 dark:bg-slate-900/10"
            accent="#475569"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <ToolCard
            Icon={Brain}
            title="Mental Health & Crisis Resources"
            desc="Crisis lines, substance use programs, and community mental health resources by issue type. For clients who need stabilization before court dates, and for documenting treatment participation as part of a mitigation narrative."
            href="/support/mental-health"
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-50 dark:bg-blue-900/10"
            accent="#1d4ed8"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.21}>
          <ToolCard
            Icon={Globe2}
            title="Immigration Guidance"
            desc="Rights during ICE encounters, detainer explained, and civil immigration resources. For clients with unresolved immigration status, this affects both the plea calculation and the collateral consequence screen."
            href="/immigration-guidance"
            color="text-orange-600 dark:text-orange-400"
            bg="bg-orange-50 dark:bg-orange-900/10"
            accent="#c2410c"
          />
        </ScrollReveal>
      </Section>

      {/* Section 3 — Reputation & Social History */}
      <Section
        id="reputation"
        label="Section 3"
        headline="Reputation & Social History"
        intro="Judges and prosecutors respond to the whole person, not just the charge sheet. Presenting a client's community ties, treatment history, housing stability, employment record, and character can shift bail decisions, diversion eligibility rulings, and sentencing outcomes. These tools support both pre-plea mitigation work and post-resolution record relief."
      >
        <ScrollReveal delay={0}>
          <ToolCard
            Icon={FileText}
            title="Mitigation Builder"
            desc="A structured form that walks through the social history domains courts respond to: community ties, housing, employment, treatment participation, family responsibilities, character references, and trauma history. Output is a formatted summary ready for bail hearings, diversion eligibility, and sentencing."
            color="text-violet-600 dark:text-violet-400"
            bg="bg-violet-50 dark:bg-violet-900/10"
            accent="#7c3aed"
            comingSoon
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07}>
          <ToolCard
            Icon={ClipboardList}
            title="First Contact Intake Checklist"
            desc="A printable screening checklist for first client meetings: immigration status, housing stability, employment, open warrants, prior record, active supervision (probation/parole), and mental health history. Operationalizes the Bronx Defenders early interdisciplinary model."
            color="text-indigo-600 dark:text-indigo-400"
            bg="bg-indigo-50 dark:bg-indigo-900/10"
            accent="#4338ca"
            comingSoon
          />
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <ToolCard
            Icon={Search}
            title="Expungement Eligibility Screener"
            desc="State-specific eligibility for expungement and record sealing — covering clean slate laws in 11 states, waiting periods, and charge-type exclusions. Useful for post-resolution planning and for advising clients on long-term record strategy before they accept a plea."
            href="/support/reputation/eligibility"
            color="text-green-600 dark:text-green-400"
            bg="bg-green-50 dark:bg-green-900/10"
            accent="#16a34a"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.21}>
          <ToolCard
            Icon={Shield}
            title="Background Check Rights & Record Repair"
            desc="FCRA adverse action rights, dispute procedures, and rap sheet review steps. Includes employer and landlord communication templates clients can use directly — especially useful while a case is pending and before an expungement clears."
            href="/support/reputation"
            color="text-cyan-600 dark:text-cyan-400"
            bg="bg-cyan-50 dark:bg-cyan-900/10"
            accent="#0891b2"
          />
        </ScrollReveal>
      </Section>

      {/* Section 4 — Client Education */}
      <Section
        id="client-education"
        label="Section 4"
        headline="Client Education"
        intro="Clients who understand what's happening to them participate more effectively in their own defense. These plain-language resources are designed to be shared directly — all available in English, Spanish, and Chinese."
      >
        <ScrollReveal delay={0}>
          <ToolCard
            Icon={Clock}
            title="First 24 Hours: Arrest to Arraignment"
            desc="Step-by-step guide from moment of arrest through booking, the jail phone call, bail, right to counsel, and arraignment. Includes a state-by-state inmate locator and full jail phone call script. Shareable with family members during the critical window."
            href="/first-24-hours"
            color="text-red-600 dark:text-red-400"
            bg="bg-red-50 dark:bg-red-900/10"
            accent="#dc2626"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07}>
          <ToolCard
            Icon={BookOpen}
            title="Full Case Timeline"
            desc="7-stage visual guide from arrest through sentencing — arrest, booking, arraignment, pretrial, discovery, trial, sentencing. Covers client rights and key decisions at each stage. Useful at any point in the process for orienting clients to where they are."
            href="/case-timeline"
            color="text-slate-600 dark:text-slate-400"
            bg="bg-slate-50 dark:bg-slate-900/10"
            accent="#475569"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.14}>
          <ToolCard
            Icon={Shield}
            title="Know Your Rights"
            desc="Core rights during police encounters, traffic stops, searches, and interrogations. Includes search and seizure scenarios and quick-reference cards. Available in English, Spanish, and Chinese — printable for distribution."
            href="/rights-info"
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-50 dark:bg-blue-900/10"
            accent="#1d4ed8"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.21}>
          <ToolCard
            Icon={Users}
            title="Friends & Family Guide"
            desc="For clients whose family members are the ones coordinating — what to do when a loved one is arrested, how to locate a detained person, how to support someone through the process. Available in English, Spanish, and Chinese."
            href="/friends-family"
            color="text-pink-600 dark:text-pink-400"
            bg="bg-pink-50 dark:bg-pink-900/10"
            accent="#db2777"
          />
        </ScrollReveal>
      </Section>

      {/* Section 5 — Find Help */}
      <Section
        id="find-help"
        label="Section 5"
        headline="Find Additional Help"
        intro="When your client needs representation they don't have, or when you need to generate jurisdiction-specific legal documents, these resources extend what you can offer."
        cols={2}
      >
        <ScrollReveal delay={0}>
          <ToolCard
            Icon={Users}
            title="Legal Aid Directory"
            desc="Find legal aid organizations near any ZIP code. Includes LSC-funded offices, pro bono programs, and law school clinics — searchable by location and practice area."
            href="/legal-aid"
            color="text-teal-600 dark:text-teal-400"
            bg="bg-teal-50 dark:bg-teal-900/10"
            accent="#0f766e"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07}>
          <ToolCard
            Icon={Lock}
            title="Attorney Portal — Document Generation"
            desc="For verified attorneys: generate jurisdiction-specific criminal and immigration motions. Over 25 templates covering all 50 states + DC, plus EOIR-format immigration motions. Requires attorney verification."
            href="/attorney-portal"
            color="text-violet-600 dark:text-violet-400"
            bg="bg-violet-50 dark:bg-violet-900/10"
            accent="#7c3aed"
          />
        </ScrollReveal>
      </Section>

      {/* Coming soon footer strip */}
      <section className="py-10 border-t border-border/30 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">In development</p>
            <p className="text-sm font-semibold text-foreground mb-5">Tools being built specifically for advocates</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  Icon: FileText,
                  title: "Mitigation Builder",
                  desc: "Structured social history form → formatted court-ready summary for bail, diversion, and sentencing.",
                },
                {
                  Icon: ClipboardList,
                  title: "First Contact Intake Checklist",
                  desc: "Standardized intake screening to surface risks and resources at first client meeting.",
                },
                {
                  Icon: Gavel,
                  title: "Pretrial Release Arguments",
                  desc: "Jurisdiction-specific bail factors, statutory alternatives to cash bail, and release argument language.",
                },
                {
                  Icon: Globe2,
                  title: "Immigration Intersection Screen",
                  desc: "Padilla-compliant tool: does this charge trigger deportation or inadmissibility in this jurisdiction?",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-lg border border-dashed border-border p-4 bg-background">
                  <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-8 border-t border-border/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            OpenDefender is built around the holistic defense model. If you work in public defense, social work, or community advocacy and want to shape what gets built next,{" "}
            <Link href="/mission-statement" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
              learn more about the project
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
