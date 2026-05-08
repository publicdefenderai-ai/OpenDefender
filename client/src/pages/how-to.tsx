import { ChevronRight, Clock, MessageSquare, Heart, Globe, ArrowRight, Shield, Scale, FileText, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// ─── Mini page-preview illustrations ────────────────────────────────────────

function PreviewChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-100 border-b border-slate-200">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 mx-2 py-0.5 px-2.5 rounded bg-white border border-slate-200 text-[10px] text-muted-foreground font-mono truncate">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

function First24Preview() {
  return (
    <PreviewChrome url="opendefender.org/first-24-hours">
      <div className="bg-[#1e3a5f] px-4 py-3.5">
        <div className="text-white/50 text-[10px] uppercase tracking-widest mb-0.5">BEGIN YOUR DEFENSE HERE</div>
        <div className="text-white text-base font-bold leading-tight">Your First 24 Hours</div>
        <div className="text-white/60 text-[11px] mt-0.5">From arrest through your first court appearance</div>
      </div>
      <div className="bg-slate-50 px-4 py-3 space-y-1.5">
        {[
          { n: "1", label: "At the Moment of Arrest", t: "Immediately", c: "#e74c3c" },
          { n: "2", label: "Booking & Processing",     t: "1–4 hours",  c: "#e67e22" },
          { n: "3", label: "Your Phone Call Rights",   t: "Right away", c: "#f39c12" },
          { n: "4", label: "Bail & Release Options",   t: "1–24 hours", c: "#27ae60" },
        ].map(({ n, label, t, c }) => (
          <div key={n} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white border border-slate-100 shadow-sm">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0" style={{ background: c }}>{n}</div>
            <div className="flex-1 min-w-0 text-[11px] font-semibold text-slate-700 truncate">{label}</div>
            <div className="text-[10px] text-slate-400 flex-shrink-0">{t}</div>
          </div>
        ))}
        <div className="text-center text-[10px] text-slate-400 py-0.5">+ 3 more steps</div>
      </div>
    </PreviewChrome>
  );
}

function GuidancePreview() {
  return (
    <PreviewChrome url="opendefender.org/chat">
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Step 1 of 5 — Safety Check
        </div>
        <div className="flex gap-0.5 mt-1.5">
          {["Safety","Location","Charges","Situation","Details"].map((s, i) => (
            <div key={s} className={`flex-1 text-center py-0.5 rounded text-[9px] font-medium ${i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{s}</div>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 p-3 space-y-2">
        <div className="bg-white rounded-lg p-2.5 shadow-sm border border-slate-100">
          <div className="text-[10px] text-slate-600 leading-relaxed">Hi! I'm an AI assistant here to help you understand your legal situation. Everything stays private and is deleted after your session.</div>
          <div className="text-[10px] font-semibold text-slate-700 mt-1.5">Are you in an urgent situation right now?</div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="py-1.5 rounded text-center text-[10px] font-medium text-red-700 bg-red-50 border border-red-200">Yes, help now</div>
          <div className="py-1.5 rounded text-center text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200">No, time to talk</div>
        </div>
        <div className="text-center text-[10px] text-slate-400">Your information is private</div>
      </div>
    </PreviewChrome>
  );
}

function SupportPreview() {
  return (
    <PreviewChrome url="opendefender.org/support">
      <div className="bg-[#8b2252] px-4 py-3.5">
        <div className="text-white text-base font-bold">Support Resources</div>
        <div className="text-white/70 text-[11px] mt-0.5">Facing legal challenges affects every part of your life</div>
      </div>
      <div className="bg-slate-50 px-3 py-3 space-y-1.5">
        <div className="px-2.5 py-2 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center gap-2">
          <span className="text-xs">📞</span>
          <div><div className="text-[10px] font-semibold text-slate-700">Not sure where to start?</div><div className="text-[10px] text-blue-600">Call or text 211</div></div>
        </div>
        {[["💼","Employment Help"],["💰","Financial Assistance"],["🧠","Mental Health Support"],["🏠","Housing Stability"]].map(([icon, label]) => (
          <div key={label} className="px-2.5 py-2 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-xs">{icon}</span><div className="text-[10px] font-semibold text-slate-700">{label}</div></div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </div>
        ))}
      </div>
    </PreviewChrome>
  );
}

function ImmigrationPreview() {
  return (
    <PreviewChrome url="opendefender.org/immigration-guidance">
      <div className="px-4 py-4 text-center" style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)" }}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-1.5">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div className="text-white text-sm font-bold leading-tight">Immigration Enforcement</div>
        <div className="text-amber-200 text-[11px] font-semibold">Know Your Rights</div>
        <div className="text-white/70 text-[10px] mt-0.5">For everyone in the US, regardless of status</div>
      </div>
      <div className="bg-slate-50 px-3 py-3 space-y-1.5">
        <div className="px-2.5 py-2 rounded-lg bg-red-50 border border-red-200 shadow-sm">
          <div className="text-[10px] text-red-700 leading-relaxed"><span className="font-bold">CRITICAL:</span> These rights apply to ALL persons in the US, no matter your citizenship.</div>
        </div>
        {[["ICE Encounter Rights","What to do if stopped"],["Deportation Defense","Your right to a hearing"],["Mixed-Status Families","Protecting your family"]].map(([label, sub]) => (
          <div key={label} className="px-2.5 py-2 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div><div className="text-[10px] font-semibold text-slate-700">{label}</div><div className="text-[10px] text-slate-400">{sub}</div></div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </div>
        ))}
      </div>
    </PreviewChrome>
  );
}

// ─── Path card (alternating layout) ─────────────────────────────────────────

interface PathCardProps {
  number: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  subhead: string;
  bullets: string[];
  link: string;
  cta: string;
  preview: React.ReactNode;
  flip?: boolean;
  accent: string;
  accentBg: string;
}

function PathCard({ number, icon: Icon, badge, headline, subhead, bullets, link, cta, preview, flip, accent, accentBg }: PathCardProps) {
  const textCol = (
    <div className="flex-1 flex flex-col justify-center py-8 px-6 lg:px-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: accent }}>
          {number}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: accentBg, color: accent }}>
          <Icon className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground leading-snug mb-3">{headline}</h2>
      <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">{subhead}</p>
      <ul className="space-y-2.5 mb-7">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: accentBg }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            </div>
            {b}
          </li>
        ))}
      </ul>
      <Link href={link}>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: accent }}>
          {cta} <ArrowRight className="w-4 h-4" />
        </button>
      </Link>
    </div>
  );

  const previewCol = (
    <div className="flex-1 flex items-center py-8 px-6 lg:px-10 bg-muted/30">
      <div className="w-full max-w-sm mx-auto">
        {preview}
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col ${flip ? "lg:flex-row-reverse" : "lg:flex-row"} rounded-2xl border border-border overflow-hidden bg-background shadow-sm`}>
      {textCol}
      {previewCol}
    </div>
  );
}

// ─── Example flow ────────────────────────────────────────────────────────────

interface FlowStep {
  time: string;
  path: string;
  accent: string;
  accentBg: string;
  icon: React.ElementType;
  action: string;
  detail: string;
}

function ExampleFlow({ steps, label, title, subtitle }: { steps: FlowStep[]; label: string; title: string; subtitle: string }) {
  return (
    <div className="py-14 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-background border border-border mb-4">
              {label}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">{subtitle}</p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-[99px] top-8 bottom-8 w-px bg-border hidden sm:block" />
          <div className="space-y-5">
            {steps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-16 sm:w-20 text-right flex-shrink-0 pt-2.5">
                    <span className="text-xs font-bold text-muted-foreground">{step.time}</span>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm"
                    style={{ background: step.accent }}
                  >
                    <step.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 bg-background rounded-xl border border-border p-4 shadow-sm">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2" style={{ background: step.accentBg, color: step.accent }}>
                      {step.path}
                    </span>
                    <p className="text-sm font-semibold text-foreground mb-1">{step.action}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Site inventory ──────────────────────────────────────────────────────────

interface ResourceItem {
  title: string;
  description: string;
  link: string;
}

interface CategorySection {
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  title: string;
  description: string;
  resources: ResourceItem[];
}

function ResourceLink({ resource, index = 0 }: { resource: ResourceItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={resource.link}>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer group card-press">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
              {resource.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{resource.description}</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-active:translate-x-1 transition-all flex-shrink-0 ml-3" />
        </div>
      </Link>
    </motion.div>
  );
}

function InventoryCategory({ cat, idx }: { cat: CategorySection; idx: number }) {
  return (
    <ScrollReveal delay={idx * 0.05}>
      <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border" style={{ background: cat.accentBg }}>
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: cat.accent }}>
            <cat.icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: cat.accent }}>{cat.title}</div>
            <div className="text-[10px] text-muted-foreground">{cat.description}</div>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {cat.resources.map((r, i) => (
            <ResourceLink key={r.title} resource={r} index={i} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HowTo() {
  useScrollToTop();
  const { t } = useTranslation();

  const flowSteps: FlowStep[] = [
    {
      time: t("howTo.flow.step1.time"),
      path: t("howTo.flow.step1.path"),
      accent: "#1e3a5f", accentBg: "#eef2f8", icon: Clock,
      action: t("howTo.flow.step1.action"),
      detail: t("howTo.flow.step1.detail"),
    },
    {
      time: t("howTo.flow.step2.time"),
      path: t("howTo.flow.step2.path"),
      accent: "#0f766e", accentBg: "#eef9f8", icon: MessageSquare,
      action: t("howTo.flow.step2.action"),
      detail: t("howTo.flow.step2.detail"),
    },
    {
      time: t("howTo.flow.step3.time"),
      path: t("howTo.flow.step3.path"),
      accent: "#8b2252", accentBg: "#f8eef3", icon: Heart,
      action: t("howTo.flow.step3.action"),
      detail: t("howTo.flow.step3.detail"),
    },
    {
      time: t("howTo.flow.step4.time"),
      path: t("howTo.flow.step4.path"),
      accent: "#0f766e", accentBg: "#eef9f8", icon: MessageSquare,
      action: t("howTo.flow.step4.action"),
      detail: t("howTo.flow.step4.detail"),
    },
  ];

  const paths: PathCardProps[] = [
    {
      number: "1", icon: Clock,
      badge: t("howTo.paths.path1.badge"),
      headline: t("howTo.paths.path1.headline"),
      subhead: t("howTo.paths.path1.subhead"),
      bullets: [
        t("howTo.paths.path1.bullet1"),
        t("howTo.paths.path1.bullet2"),
        t("howTo.paths.path1.bullet3"),
        t("howTo.paths.path1.bullet4"),
      ],
      link: "/first-24-hours",
      cta: t("howTo.paths.path1.cta"),
      preview: <First24Preview />,
      flip: false,
      accent: "#1e3a5f",
      accentBg: "#eef2f8",
    },
    {
      number: "2", icon: MessageSquare,
      badge: t("howTo.paths.path2.badge"),
      headline: t("howTo.paths.path2.headline"),
      subhead: t("howTo.paths.path2.subhead"),
      bullets: [
        t("howTo.paths.path2.bullet1"),
        t("howTo.paths.path2.bullet2"),
        t("howTo.paths.path2.bullet3"),
        t("howTo.paths.path2.bullet4"),
      ],
      link: "/case-guidance",
      cta: t("howTo.paths.path2.cta"),
      preview: <GuidancePreview />,
      flip: true,
      accent: "#0f766e",
      accentBg: "#eef9f8",
    },
    {
      number: "3", icon: Heart,
      badge: t("howTo.paths.path3.badge"),
      headline: t("howTo.paths.path3.headline"),
      subhead: t("howTo.paths.path3.subhead"),
      bullets: [
        t("howTo.paths.path3.bullet1"),
        t("howTo.paths.path3.bullet2"),
        t("howTo.paths.path3.bullet3"),
        t("howTo.paths.path3.bullet4"),
      ],
      link: "/support",
      cta: t("howTo.paths.path3.cta"),
      preview: <SupportPreview />,
      flip: false,
      accent: "#8b2252",
      accentBg: "#f8eef3",
    },
    {
      number: "4", icon: Globe,
      badge: t("howTo.paths.path4.badge"),
      headline: t("howTo.paths.path4.headline"),
      subhead: t("howTo.paths.path4.subhead"),
      bullets: [
        t("howTo.paths.path4.bullet1"),
        t("howTo.paths.path4.bullet2"),
        t("howTo.paths.path4.bullet3"),
        t("howTo.paths.path4.bullet4"),
      ],
      link: "/immigration-guidance",
      cta: t("howTo.paths.path4.cta"),
      preview: <ImmigrationPreview />,
      flip: true,
      accent: "#92400e",
      accentBg: "#fef3e2",
    },
  ];

  const inventoryCategories: CategorySection[] = [
    {
      icon: MessageSquare, accent: "#0f766e", accentBg: "#eef9f8",
      title: t("howTo.sections.getHelp.title"),
      description: t("howTo.sections.getHelp.description"),
      resources: [
        { title: t("howTo.sections.getHelp.caseGuidance.title"), description: t("howTo.sections.getHelp.caseGuidance.description"), link: "/case-guidance" },
        { title: t("howTo.sections.getHelp.aiChat.title"), description: t("howTo.sections.getHelp.aiChat.description"), link: "/chat" },
        { title: t("howTo.sections.getHelp.documentSummarizer.title"), description: t("howTo.sections.getHelp.documentSummarizer.description"), link: "/document-summarizer" },
        { title: t("howTo.sections.getHelp.letterGenerator.title"), description: t("howTo.sections.getHelp.letterGenerator.description"), link: "/letter-generator" },
        { title: t("howTo.sections.getHelp.first24Hours.title"), description: t("howTo.sections.getHelp.first24Hours.description"), link: "/first-24-hours" },
      ],
    },
    {
      icon: Scale, accent: "#1e3a5f", accentBg: "#eef2f8",
      title: t("howTo.sections.knowYourRights.title"),
      description: t("howTo.sections.knowYourRights.description"),
      resources: [
        { title: t("howTo.sections.knowYourRights.constitutionalRights.title"), description: t("howTo.sections.knowYourRights.constitutionalRights.description"), link: "/rights-info" },
        { title: t("howTo.sections.knowYourRights.caseTimeline.title"), description: t("howTo.sections.knowYourRights.caseTimeline.description"), link: "/case-timeline" },
        { title: t("howTo.sections.knowYourRights.quickReference.title"), description: t("howTo.sections.knowYourRights.quickReference.description"), link: "/quick-reference" },
        { title: t("howTo.sections.knowYourRights.searchSeizure.title"), description: t("howTo.sections.knowYourRights.searchSeizure.description"), link: "/search-seizure" },
        { title: t("howTo.sections.knowYourRights.friendsFamily.title"), description: t("howTo.sections.knowYourRights.friendsFamily.description"), link: "/friends-family" },
        { title: t("howTo.collateralConsequences"), description: t("howTo.collateralConsequencesDesc"), link: "/collateral-consequences" },
        { title: t("howTo.sections.knowYourRights.mockQA.title"), description: t("howTo.sections.knowYourRights.mockQA.description"), link: "/resources" },
      ],
    },
    {
      icon: Users, accent: "#5b21b6", accentBg: "#f3effe",
      title: t("howTo.sections.findResources.title"),
      description: t("howTo.sections.findResources.description"),
      resources: [
        { title: t("howTo.sections.findResources.publicDefenders.title"), description: t("howTo.sections.findResources.publicDefenders.description"), link: "/legal-aid" },
        { title: t("howTo.sections.findResources.legalAid.title"), description: t("howTo.sections.findResources.legalAid.description"), link: "/legal-aid" },
        { title: t("howTo.sections.findResources.diversionPrograms.title"), description: t("howTo.sections.findResources.diversionPrograms.description"), link: "/diversion-programs" },
        { title: t("howTo.sections.findResources.recordExpungement.title"), description: t("howTo.sections.findResources.recordExpungement.description"), link: "/record-expungement" },
      ],
    },
    {
      icon: Heart, accent: "#8b2252", accentBg: "#f8eef3",
      title: t("howTo.sections.lifeSupport.title"),
      description: t("howTo.sections.lifeSupport.description"),
      resources: [
        { title: t("howTo.sections.lifeSupport.supportHub.title"), description: t("howTo.sections.lifeSupport.supportHub.description"), link: "/support" },
        { title: t("howTo.sections.lifeSupport.employment.title"), description: t("howTo.sections.lifeSupport.employment.description"), link: "/support/employment" },
        { title: t("howTo.sections.lifeSupport.finances.title"), description: t("howTo.sections.lifeSupport.finances.description"), link: "/support/finances" },
        { title: t("howTo.sections.lifeSupport.mentalHealth.title"), description: t("howTo.sections.lifeSupport.mentalHealth.description"), link: "/support/mental-health" },
        { title: t("howTo.sections.lifeSupport.transportation.title"), description: t("howTo.sections.lifeSupport.transportation.description"), link: "/support/transportation" },
        { title: t("howTo.sections.lifeSupport.childcare.title"), description: t("howTo.sections.lifeSupport.childcare.description"), link: "/support/childcare" },
        { title: t("howTo.sections.lifeSupport.courtLogistics.title"), description: t("howTo.sections.lifeSupport.courtLogistics.description"), link: "/support/court-logistics" },
        { title: t("howTo.reputation"), description: t("howTo.reputationDesc"), link: "/support/reputation" },
        { title: t("howTo.reentry"), description: t("howTo.reentryDesc"), link: "/support/reentry" },
        { title: t("howTo.sections.getHelp.letterGenerator.title"), description: t("howTo.sections.getHelp.letterGenerator.description"), link: "/letter-generator" },
      ],
    },
    {
      icon: BookOpen, accent: "#374151", accentBg: "#f3f4f6",
      title: t("howTo.sections.reference.title"),
      description: t("howTo.sections.reference.description"),
      resources: [
        { title: t("howTo.sections.reference.legalGlossary.title"), description: t("howTo.sections.reference.legalGlossary.description"), link: "/legal-glossary" },
        { title: t("howTo.sections.reference.courtLocator.title"), description: t("howTo.sections.reference.courtLocator.description"), link: "/court-locator" },
        { title: t("howTo.sections.reference.statuteLookup.title"), description: t("howTo.sections.reference.statuteLookup.description"), link: "/statutes" },
        { title: t("howTo.sections.reference.documentLibrary.title"), description: t("howTo.sections.reference.documentLibrary.description"), link: "/document-library" },
      ],
    },
    {
      icon: FileText, accent: "#92400e", accentBg: "#fef3e2",
      title: t("howTo.sections.attorneyTools.title"),
      description: t("howTo.sections.attorneyTools.description"),
      resources: [
        { title: t("howTo.sections.attorneyTools.attorneyPortal.title"), description: t("howTo.sections.attorneyTools.attorneyPortal.description"), link: "/attorney" },
        { title: t("howTo.sections.attorneyTools.courtRecords.title"), description: t("howTo.sections.attorneyTools.courtRecords.description"), link: "/court-records" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-alt py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-blue-300" />
                <span className="text-blue-200 text-sm font-semibold tracking-wide uppercase">OpenDefender</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white leading-tight">
                {t("howTo.hero.title")}
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
                {t("howTo.hero.subtitle")}
              </p>
              {/* Quick-jump pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[
                  { label: t("howTo.hero.pills.first24"),      id: "path-1" },
                  { label: t("howTo.hero.pills.caseGuidance"), id: "path-2" },
                  { label: t("howTo.hero.pills.lifeSupport"),  id: "path-3" },
                  { label: t("howTo.hero.pills.immigration"),  id: "path-4" },
                  { label: t("howTo.hero.pills.directory", "Directory"), id: "full-directory" },
                ].map(({ label, id }) => (
                  <button
                    key={label}
                    onClick={() => {
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="px-4 py-1.5 rounded-full text-sm font-medium text-white/90 transition-colors hover:text-white"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Four paths */}
      <section className="py-8 md:py-10">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          {paths.map((path, i) => (
            <ScrollReveal key={path.number} delay={i * 0.07}>
              <div id={`path-${path.number}`}>
                <PathCard {...path} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Full site inventory */}
      <section id="full-directory" className="py-12 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">{t("howTo.inventory.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("howTo.inventory.subtitle")}</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryCategories.map((cat, i) => (
              <InventoryCategory key={cat.title} cat={cat} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
