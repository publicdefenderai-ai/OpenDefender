import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, AlertTriangle, ChevronDown, CheckCircle, XCircle,
  Info, Gavel, MessageSquare, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useJurisdiction } from "@/hooks/use-jurisdiction";
import { JurisdictionSelector } from "@/components/ui/jurisdiction-selector";
import { JurisdictionCallout } from "@/components/ui/jurisdiction-callout";

/* ── Section map ───────────────────────────────────────────────── */

const SECTIONS = [
  { id: "constitutional-sources", label: "Two Amendments",          shortLabel: "Two Amendments",        Icon: Scale         },
  { id: "custody-levels",         label: "Custody & Detention",     shortLabel: "Custody & Detention",   Icon: Shield        },
  { id: "interrogation-vs-trial", label: "Interrogation vs. Trial", shortLabel: "Interrogation vs. Trial",Icon: MessageSquare },
  { id: "when-not-apply",         label: "When Rights Don't Apply", shortLabel: "When Rights Don't Apply",Icon: XCircle       },
  { id: "unclear-situations",     label: "Unclear Situations",      shortLabel: "Unclear Situations",    Icon: AlertTriangle },
  { id: "what-happens",           label: "When You Invoke",         shortLabel: "When You Invoke",       Icon: CheckCircle   },
  { id: "quick-reference",        label: "Quick Reference Table",   shortLabel: "Quick Reference",       Icon: Gavel         },
];

const QUICK_LINKS = [
  { href: "/rights-info",     title: "Your Constitutional Rights" },
  { href: "/first-24-hours",  title: "First 24 Hours After Arrest" },
  { href: "/search-seizure",  title: "Rights During a Search" },
  { href: "/warrants",        title: "Warrants & Your Rights" },
  { href: "/case-guidance",   title: "Get Personalized Guidance" },
];

/* ── Grey area data ────────────────────────────────────────────── */

interface GreyAreaItem {
  title: string;
  description: string;
  answer: string;
}

const greyAreas: GreyAreaItem[] = [
  {
    title: "You're detained but not formally arrested",
    description: "Police stop you on the street, tell you not to leave, and begin questioning — but haven't said you're under arrest.",
    answer: "If a reasonable person in your situation would not feel free to leave, courts may treat this as 'custody', which means your right to remain silent applies. However, your 6th Amendment right to counsel has not kicked in yet because no formal charges have been filed. Ask clearly: 'Am I free to go?' If the answer is no, invoke your right to remain silent and your right to a lawyer before answering anything."
  },
  {
    title: "Police come to your home to 'talk'",
    description: "Officers knock, you let them in, and they start asking questions. You feel like you can't ask them to leave.",
    answer: "If you voluntarily agree to speak with officers in your home, courts have sometimes found this is not custody even if you felt pressure to cooperate. However, if officers block exits or the encounter turns coercive, the analysis changes. You always have the right to say: 'I am not going to answer questions without a lawyer present.'"
  },
  {
    title: "You're in a squad car but told you're 'not under arrest'",
    description: "Officers ask you to sit in their car while they 'sort things out.' They say you're free to go but the doors don't open from inside.",
    answer: "Courts look at whether a reasonable person would feel free to leave — not at what officers say. Being in a locked police vehicle strongly suggests custody. Anything said here may be treated as a custodial statement. Invoke your rights immediately."
  },
  {
    title: "Questioning in a workplace or school",
    description: "Police come to your workplace or school and question you in a private room.",
    answer: "Courts look at all the details of what happened. Generally, if you were free to leave and no one pressured you to stay, this may not count as custody. But if your employer or school required you to participate, or if officers made clear you could not leave, it becomes more likely courts would call it custody. When in doubt, clearly say you will not answer questions without a lawyer."
  },
  {
    title: "Questioning after charges are filed but before indictment",
    description: "You've been charged with a crime, released on bail, and officers want to interview you again without your lawyer present.",
    answer: "Once formal charges are filed, your 6th Amendment right to an attorney applies to those specific charges. Police cannot try to get statements from you about those charges without your lawyer present, whether directly or through other people. This is a firm right. Tell them to contact your attorney."
  },
  {
    title: "You're a juvenile being questioned",
    description: "You are under 18 and police question you, with or without your parents present.",
    answer: "Courts look more closely at whether a young person was truly free to leave. Many states require police to notify parents before questioning someone under 18. A minor's age is an important factor in deciding whether they felt free to go. Juveniles should always clearly ask for a parent and a lawyer before answering any questions."
  }
];

/* ── GreyAreaCard ──────────────────────────────────────────────── */

function GreyAreaCard({ item }: { item: GreyAreaItem }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full text-left">
          <Card className="hover:shadow-md transition-all duration-200 hover:border-amber-300 cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1">
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mx-1 mb-2 rounded-b-lg border border-t-0 border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10 p-4">
          <p className="text-sm text-foreground/85 leading-relaxed">{item.answer}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── SectionPanel ──────────────────────────────────────────────── */

interface SectionPanelProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SectionPanel({ id, title, icon, isOpen, onToggle, children }: SectionPanelProps) {
  return (
    <div
      id={id}
      className={`rounded-xl border overflow-hidden scroll-mt-20 transition-colors duration-200 ${
        isOpen ? "border-primary/25 dark:border-primary/20" : "border-border"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full text-left flex items-center justify-between px-5 py-4 gap-3 transition-colors ${
          isOpen ? "bg-primary/5 dark:bg-primary/10" : "bg-background hover:bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <h2 className="text-base font-bold text-foreground leading-snug">{title}</h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-6 pt-4 border-t border-border/50 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sidebar ───────────────────────────────────────────────────── */

function PageSidebar({
  openId,
  onOpen,
  jurisdiction,
}: {
  openId: string;
  onOpen: (id: string) => void;
  jurisdiction: string;
}) {
  return (
    <nav aria-label="Page sections">
      {/* Jurisdiction selector */}
      <div className="mb-5 pb-5 border-b border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">
          Your State
        </p>
        <JurisdictionSelector label="" />
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
        On this page
      </p>
      <div className="space-y-0.5">
        {SECTIONS.map(({ id, shortLabel, Icon }) => {
          const active = openId === id;
          return (
            <button
              key={id}
              onClick={() => onOpen(id)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-sm ${
                active
                  ? "bg-primary/8 text-primary dark:text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
              <span className="leading-snug text-xs">{shortLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border/50">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
          Related
        </p>
        <div className="space-y-0.5">
          {QUICK_LINKS.map(({ href, title }) => (
            <Link key={href} href={href}>
              <span className="block px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors leading-snug">
                {title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function RightToCounsel() {
  useScrollToTop();
  const { jurisdiction } = useJurisdiction();
  const [openId, setOpenId] = useState("constitutional-sources");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top: Math.max(0, top) });
    }
  };

  const openAndScroll = (id: string) => {
    scrollToSection(id);
    setOpenId(id);
  };

  const toggleSection = (id: string) => {
    if (openId === id) {
      setOpenId("");
    } else {
      setOpenId(id);
    }
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Know Your Rights", href: "/rights-info" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb items={breadcrumbItems} currentPage="Right to an Attorney" />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 vivid-header-content text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-6">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-5 text-white">
              Right to an Attorney
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Learn when your right to an attorney begins, what it covers, and how to protect it — including the key difference between having a lawyer during questioning versus at trial.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mobile pill nav */}
      <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {SECTIONS.map(({ id, shortLabel }) => (
              <button
                key={id}
                onClick={() => openAndScroll(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex-shrink-0 transition-colors ${
                  id === openId
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border hover:bg-muted hover:border-foreground/20 text-muted-foreground"
                }`}
              >
                {shortLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout: sidebar + content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex gap-10">

          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24">
              <PageSidebar openId={openId} onOpen={openAndScroll} jurisdiction={jurisdiction} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* Mobile jurisdiction selector */}
            <div className="lg:hidden">
              <JurisdictionSelector label="See rules for your state (optional)" />
            </div>

            {/* ── CONSTITUTIONAL SOURCES ──────────────────────────── */}
            <SectionPanel
              id="constitutional-sources"
              title="Two Constitutional Sources, Two Different Triggers"
              icon={<Scale className="h-4 w-4" />}
              isOpen={openId === "constitutional-sources"}
              onToggle={() => toggleSection("constitutional-sources")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                The right to an attorney in criminal cases comes from two different parts of the Constitution. They protect you at different times and in different situations. Using one does not automatically give you the other.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 5th Amendment */}
                <Card className="border-blue-200 dark:border-blue-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1 border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">5th Amendment</Badge>
                        <CardTitle className="text-base">Right Against Self-Incrimination</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">When it applies:</p>
                      <p className="text-muted-foreground">During <strong>custodial interrogation</strong> — you must be both (1) in custody and (2) being questioned. Both conditions must be present.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">What "custody" means:</p>
                      <p className="text-muted-foreground">A reasonable person in your situation would not feel free to end the encounter and leave. This is an objective test. It doesn't matter what you personally felt or what police told you.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">What it protects:</p>
                      <p className="text-muted-foreground">Being forced to say things that hurt your own case. The Miranda warning is how police are required to tell you about this right before they start questioning you in custody.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">The key case:</p>
                      <p className="text-muted-foreground font-mono text-xs">Miranda v. Arizona (1966)</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 6th Amendment */}
                <Card className="border-green-200 dark:border-green-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Gavel className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs mb-1 border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">6th Amendment</Badge>
                        <CardTitle className="text-base">Right to Counsel at Trial</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground mb-1">When it applies:</p>
                      <p className="text-muted-foreground">Once formal criminal proceedings begin — meaning after arrest <strong>and</strong> the filing of formal charges (indictment, information, or arraignment). Not before.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">What "kicks in" means:</p>
                      <p className="text-muted-foreground">Once this right kicks in, police and government agents cannot try to get statements from you about those charges without your lawyer present, even if they use an informant to do it.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">What it protects:</p>
                      <p className="text-muted-foreground">Your right to an attorney at every important step of your case: arraignment, preliminary hearings, plea bargaining, sentencing, and trial.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">The key cases:</p>
                      <p className="text-muted-foreground font-mono text-xs">Gideon v. Wainwright (1963) · Brewer v. Williams (1977)</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-slate-300 dark:border-slate-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>The critical gap:</strong> Between arrest and formal charges, only the 5th Amendment applies. You have the right to remain silent and to refuse questioning, but the 6th Amendment's broader protections haven't begun yet. This is why invoking your right to counsel immediately upon arrest is essential.
                </AlertDescription>
              </Alert>
            </SectionPanel>

            {/* ── CUSTODY LEVELS ──────────────────────────────────── */}
            <SectionPanel
              id="custody-levels"
              title="Detention, Custody, and Arrest — They're Not the Same"
              icon={<Shield className="h-4 w-4" />}
              isOpen={openId === "custody-levels"}
              onToggle={() => toggleSection("custody-levels")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                Police interactions exist on a spectrum. Where you fall on that spectrum determines what rights are triggered. Many people believe their rights only begin when they are "under arrest." This is a dangerous misunderstanding.
              </p>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">Voluntary Encounter</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 text-xs">Low restriction</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Police approach you and ask questions. You are free to leave. You have not been told to stop.</p>
                        <p className="text-sm text-foreground/80"><strong>Rights triggered:</strong> No Miranda rights are required because you're not in custody. However, you always have the right to refuse to answer questions (except basic ID in some states) and the right to walk away. Voluntarily provided statements can still be used against you.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">Investigative Detention (Terry Stop)</h3>
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-xs">Limited restriction</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Police have reasonable suspicion you're involved in criminal activity and briefly detain you to investigate. You are not free to leave but you have not been arrested.</p>
                        <p className="text-sm text-foreground/80"><strong>Rights triggered:</strong> Courts are divided on whether a Terry stop alone constitutes "custody" for Miranda purposes. Most courts say no, but there is significant variation by circuit and state. You still have the right to refuse to answer questions beyond basic identification. Ask: "Am I under arrest?" If no, ask: "Am I free to go?" If neither, you are being detained.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">Custodial Interrogation</h3>
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-xs">Significant restriction</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">You are in custody (not free to leave) and police are questioning you. This is the trigger point for your 5th Amendment right to counsel under Miranda.</p>
                        <p className="text-sm text-foreground/80"><strong>Rights triggered:</strong> Police must advise you of your Miranda rights before questioning. If they don't and question you anyway, statements may be suppressed. You can invoke your right to remain silent and your right to an attorney; all questioning must stop immediately.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">Formal Arrest + Charges Filed</h3>
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-xs">Full restriction</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">You have been arrested and the government has filed formal charges (indictment, arraignment, or information).</p>
                        <p className="text-sm text-foreground/80"><strong>Rights triggered:</strong> Both 5th and 6th Amendment rights now apply. The 6th Amendment right to counsel attaches to the specific charged offense. Government cannot question you on those charges outside your lawyer's presence. You are entitled to an attorney at every critical stage from this point forward.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <JurisdictionCallout jurisdiction={jurisdiction} topic="arraignment" />
              </div>
            </SectionPanel>

            {/* ── INTERROGATION VS TRIAL ──────────────────────────── */}
            <SectionPanel
              id="interrogation-vs-trial"
              title="Interrogation Counsel vs. Trial Counsel"
              icon={<MessageSquare className="h-4 w-4" />}
              isOpen={openId === "interrogation-vs-trial"}
              onToggle={() => toggleSection("interrogation-vs-trial")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                The right to an attorney during interrogation and the right to an attorney at trial serve different functions and carry different protections. For most people charged with a crime, both will ultimately apply, but understanding the distinction helps you protect yourself at each stage.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <CardTitle className="text-base">During Interrogation</CardTitle>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">5th Amendment</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Applies whenever you are in custody and being questioned, even before any charges are filed</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">If you invoke it, all questioning must stop immediately. Police cannot send in a different officer or try again later</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Does not require the government to appoint a lawyer on the spot, but they must stop all questioning until you have one</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Cannot be "reinitiated" by police: if you invoked, only you can restart the conversation, and even then cautiously</p>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <p className="font-semibold text-blue-800 dark:text-blue-300 text-xs mb-1">How to invoke:</p>
                      <p className="text-blue-700 dark:text-blue-400 text-xs italic">"I am invoking my right to remain silent and my right to an attorney. I will not answer any questions without a lawyer present."</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Gavel className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <CardTitle className="text-base">At Trial & Critical Stages</CardTitle>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">6th Amendment</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Covers arraignment, preliminary hearings, plea bargaining, sentencing, and all trial proceedings</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">If you cannot afford an attorney, the court must appoint one. This is the Gideon guarantee</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Applies to any offense punishable by imprisonment — not just felonies</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">Covers the specific crimes you were charged with. Police can still question you about other matters you have not been formally charged with</p>
                    </div>
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <p className="font-semibold text-green-800 dark:text-green-300 text-xs mb-1">How to invoke:</p>
                      <p className="text-green-700 dark:text-green-400 text-xs italic">At your first court appearance: "I am requesting appointed counsel." Or directly: "I want my attorney present."</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </SectionPanel>

            {/* ── WHEN NOT APPLY ──────────────────────────────────── */}
            <SectionPanel
              id="when-not-apply"
              title="When the Right to Counsel May Not Apply"
              icon={<XCircle className="h-4 w-4" />}
              isOpen={openId === "when-not-apply"}
              onToggle={() => toggleSection("when-not-apply")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                The right to counsel is broad, but it has limits. Being aware of these situations helps you understand where you stand.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Civil proceedings",
                    body: "The 6th Amendment right to counsel applies only to criminal cases. In civil court — including immigration removal proceedings — there is no constitutional right to a government-appointed attorney, though you may retain one at your own expense."
                  },
                  {
                    title: "Purely voluntary encounters",
                    body: "If you are not in custody and police are not interrogating you, Miranda does not apply. Anything you say voluntarily — before custody begins — can be used against you without Miranda warnings having been given."
                  },
                  {
                    title: "Minor offenses with no jail time",
                    body: "If you are charged with an offense for which no imprisonment is actually imposed (even if possible), the 6th Amendment right to appointed counsel may not require the court to provide one. This is narrow but real — Scott v. Illinois (1979)."
                  },
                  {
                    title: "Pre-charge lineups",
                    body: "Before formal charges are filed, you generally do not have a 6th Amendment right to have a lawyer present at a lineup. After charges are filed, you do. The 5th Amendment doesn't apply to lineups because you aren't being asked to say anything."
                  },
                  {
                    title: "Post-conviction proceedings",
                    body: "In most optional appeals and post-conviction hearings (such as parole hearings or requests to reopen a case), there is no automatic right to a court-appointed attorney under the 6th Amendment, though some laws do provide one."
                  },
                  {
                    title: "Grand jury testimony",
                    body: "You do not have the right to have your attorney present inside the grand jury room during questioning, though you can step outside to consult with counsel between questions. You retain your 5th Amendment right to remain silent."
                  }
                ].map((item, i) => (
                  <Card key={i} className="border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <XCircle className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionPanel>

            {/* ── UNCLEAR SITUATIONS ──────────────────────────────── */}
            <SectionPanel
              id="unclear-situations"
              title="Unclear Situations — When It's Hard to Tell"
              icon={<AlertTriangle className="h-4 w-4" />}
              isOpen={openId === "unclear-situations"}
              onToggle={() => toggleSection("unclear-situations")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                Whether you were in "custody" — and whether your 5th Amendment rights kicked in — is often the hardest question. Courts look at the full picture of what happened. These are the most common situations that cause confusion.
              </p>
              <div className="space-y-3">
                {greyAreas.map((item, i) => (
                  <GreyAreaCard key={i} item={item} />
                ))}
              </div>
            </SectionPanel>

            {/* ── WHAT HAPPENS ────────────────────────────────────── */}
            <SectionPanel
              id="what-happens"
              title="What Happens When You Ask for a Lawyer"
              icon={<CheckCircle className="h-4 w-4" />}
              isOpen={openId === "what-happens"}
              onToggle={() => toggleSection("what-happens")}
            >
              <div className="space-y-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">All questioning must stop right away</h3>
                    <p className="text-sm text-muted-foreground">Once you clearly ask for a lawyer, police must stop all questioning — not just the current question, but all questioning. They cannot try again later, send in a different officer, or strike up a "friendly" conversation to get you talking. This protection lasts until you have a lawyer or you choose to restart the conversation yourself.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">You must invoke clearly</h3>
                    <p className="text-sm text-muted-foreground">Saying "maybe I should get a lawyer" or "do you think I need an attorney?" is not enough. Courts have ruled that a vague or unclear request does not give you the full protection. You must say it directly: "I want a lawyer. I am not answering any questions without a lawyer present."</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">You stay in custody — asking for a lawyer does not release you</h3>
                    <p className="text-sm text-muted-foreground">Asking for a lawyer does not end your detention or get you released. You will remain in custody until arraignment or bail. But you will no longer be questioned, which protects you from saying something that could hurt your case.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">Do not take it back</h3>
                    <p className="text-sm text-muted-foreground">After invoking, officers may come back hours later, act friendly, or suggest that talking would help your case. Do not engage. Once you have asked for a lawyer, anything you say can still be used against you. The safest thing to do is stay quiet until your attorney is there.</p>
                  </CardContent>
                </Card>
              </div>
            </SectionPanel>

            {/* ── QUICK REFERENCE ─────────────────────────────────── */}
            <SectionPanel
              id="quick-reference"
              title="Quick Reference: Which Right Applies?"
              icon={<Gavel className="h-4 w-4" />}
              isOpen={openId === "quick-reference"}
              onToggle={() => toggleSection("quick-reference")}
            >
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground text-xs">Situation</th>
                        <th className="text-center py-2 px-3 font-semibold text-blue-600 dark:text-blue-400 text-xs">5th Amend.</th>
                        <th className="text-center py-2 px-3 font-semibold text-green-600 dark:text-green-400 text-xs">6th Amend.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {[
                        ["Voluntary police conversation",      "No",       "No" ],
                        ["Brief police stop (not arrested)",   "Disputed", "No" ],
                        ["Custodial interrogation (pre-charge)","Yes",     "No" ],
                        ["After formal charges filed",         "Yes",      "Yes"],
                        ["At arraignment / bail hearing",      "Yes",      "Yes"],
                        ["Trial / plea / sentencing",          "Yes",      "Yes"],
                        ["Civil / immigration removal",        "No",       "No" ],
                      ].map(([situation, fifth, sixth], i) => (
                        <tr key={i} className="hover:bg-muted/20">
                          <td className="py-2 pr-4 text-muted-foreground text-xs">{situation}</td>
                          <td className="py-2 px-3 text-center text-xs">
                            <span className={`font-semibold ${fifth === "Yes" ? "text-green-600 dark:text-green-400" : fifth === "No" ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>{fifth}</span>
                          </td>
                          <td className="py-2 px-3 text-center text-xs">
                            <span className={`font-semibold ${sixth === "Yes" ? "text-green-600 dark:text-green-400" : sixth === "No" ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>{sixth}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SectionPanel>

            {/* ── RELATED GUIDES ──────────────────────────────────── */}
            <div className="border-t border-border pt-8 mt-4">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Related Guides</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { href: "/rights-info",    Icon: Shield,        title: "Your Constitutional Rights" },
                  { href: "/first-24-hours", Icon: Scale,         title: "The First 24 Hours After Arrest" },
                  { href: "/search-seizure", Icon: Gavel,         title: "Rights During a Search" },
                  { href: "/case-guidance",  Icon: MessageSquare, title: "Get Personalized Guidance" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                      <item.Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── DISCLAIMER ──────────────────────────────────────── */}
            <Alert className="border-slate-200 dark:border-slate-700">
              <AlertDescription className="text-muted-foreground text-sm">
                This page provides general legal information, not legal advice. Constitutional law is highly fact-specific and varies by jurisdiction. The cases cited represent federal constitutional minimums. Your state may provide broader protections. Always consult a licensed criminal defense attorney about your specific situation.
              </AlertDescription>
            </Alert>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
