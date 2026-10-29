import { useState, useEffect, useRef, useId } from "react";
import { useTranslation } from "react-i18next";
import {
  Scale, AlertTriangle, CheckCircle, XCircle,
  Gavel, MessageSquare, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
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
  { href: "/case-guidance",   title: "Get Guidance for Your Situation" },
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
    answer: "If a reasonable person in your situation would not feel free to leave, courts may treat this as 'custody,' which means your right to remain silent applies. Asking 'Am I free to go?' establishes whether you are being detained. If the answer is no, you can invoke your right to remain silent and your right to a lawyer at that point — before answering anything. Your 6th Amendment right to appointed counsel has not yet attached because no formal charges have been filed."
  },
  {
    title: "Police come to your home to 'talk'",
    description: "Officers knock, you let them in, and they start asking questions. You feel like you can't ask them to leave.",
    answer: "If you voluntarily agree to speak with officers in your home, courts have sometimes found this is not custody even if you felt pressure to cooperate. However, if officers block exits or the encounter turns coercive, the analysis changes. You always have the right to decline to answer questions. If you want to invoke this right, you can say clearly: 'I am not going to answer questions without a lawyer present.'"
  },
  {
    title: "You're in a squad car but told you're 'not under arrest'",
    description: "Officers ask you to sit in their car while they 'sort things out.' They say you're free to go but the doors don't open from inside.",
    answer: "Courts look at whether a reasonable person would feel free to leave — not at what officers say. Being in a locked police vehicle strongly suggests custody. Anything said here may be treated as a custodial statement. You can invoke your right to remain silent and your right to counsel at any point during this encounter."
  },
  {
    title: "Questioning in a workplace or school",
    description: "Police come to your workplace or school and question you in a private room.",
    answer: "Courts look at all the details of what happened. Generally, if you were free to leave and no one pressured you to stay, this may not count as custody. But if your employer or school required you to participate, or if officers made clear you could not leave, courts are more likely to treat it as custody. You can say you will not answer questions without a lawyer present."
  },
  {
    title: "Questioning after charges are filed but before indictment",
    description: "You've been charged with a crime, released on bail, and officers want to interview you again without your lawyer present.",
    answer: "Once formal charges are filed, your 6th Amendment right to an attorney applies to those specific charges. Police cannot initiate questioning about those charges without your attorney present — whether directly or through other people. If contacted, you can say you will speak only through your attorney."
  },
  {
    title: "You're a juvenile being questioned",
    description: "You are under 18 and police question you, with or without your parents present.",
    answer: "A minor's age matters when courts assess custody and whether a waiver was voluntary. Some states require parental notification or consultation with an attorney, but the rules differ. You can ask for a parent or guardian immediately; whether police must wait for them depends on the law and circumstances. Asking for a parent does not necessarily invoke the right to counsel. A clear request such as 'I want a lawyer' addresses that separate right."
  }
];

/* ── GreyAreaCard ──────────────────────────────────────────────── */

function GreyAreaCard({ item }: { item: GreyAreaItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  return <div className="counsel-scenario">
    <h3><button type="button" id={`${id}-trigger`} aria-expanded={isOpen} aria-controls={`${id}-answer`} onClick={() => setIsOpen(value => !value)}>
      {item.title}<span className="counsel-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
    </button></h3>
    <p>{item.description}</p>
    <div id={`${id}-answer`} hidden={!isOpen} aria-labelledby={`${id}-trigger`} className="counsel-scenario-answer"><p>{item.answer}</p></div>
  </div>;
}

interface SectionPanelProps {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
function SectionPanel({ id, title, isOpen, onToggle, children }: SectionPanelProps) {
  const overview = id === "constitutional-sources";
  return <section id={id} className="counsel-section">
    <h2>{overview ? <span tabIndex={-1} id={`${id}-trigger`}>{title}</span> : <button type="button" id={`${id}-trigger`} onClick={onToggle} aria-expanded={isOpen} aria-controls={`${id}-content`}>
      {title}<span className="counsel-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
    </button>}</h2>
    <div id={`${id}-content`} hidden={!overview && !isOpen} className="counsel-section-content">{children}</div>
  </section>;
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function RightToCounsel() {
  const { t } = useTranslation();
  const { jurisdiction, setJurisdiction } = useJurisdiction();
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["constitutional-sources"]));

  const pendingSection = useRef<string | null>(null);
  const openAndScroll = (id: string) => {
    pendingSection.current = id;
    setOpenIds(prev => new Set([...prev, id]));
  };
  useEffect(() => {
    const followHash = () => {
      const id = window.location.hash.slice(1);
      if (SECTIONS.some(section => section.id === id)) openAndScroll(id);
    };
    if (window.location.hash) followHash();
    else window.scrollTo({ top: 0, behavior: "instant" });
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, []);
  useEffect(() => {
    const id = pendingSection.current;
    if (!id) return;
    pendingSection.current = null;
    document.getElementById(`${id}-trigger`)?.focus({ preventScroll: true });
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [openIds]);

  const toggleSection = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Know Your Rights", href: "/rights-info" }
  ];

  return (
    <ScanFirstPageFrame mainClassName="counsel-page">
      <PageBreadcrumb items={breadcrumbItems} currentPage="Right to an Attorney" />
      <header className="counsel-width counsel-hero">
        <div><p className="counsel-label">{t("counselDesign.label")}</p><h1>{t("counselDesign.heading")}<span>{t("counselDesign.accent")}</span></h1>
        <p>{t("counselDesign.subtitle")}</p></div>
        <Scale className="counsel-art" strokeWidth={1.1} aria-hidden="true" />
      </header>
      <div className="counsel-width counsel-comparison" lang="en">
            {/* ── CONSTITUTIONAL SOURCES ──────────────────────────── */}
            <SectionPanel
              id="constitutional-sources"
              title="Two Constitutional Sources, Two Different Triggers"
              isOpen={openIds.has("constitutional-sources")}
              onToggle={() => toggleSection("constitutional-sources")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                The right to an attorney in criminal cases comes from two different parts of the Constitution. They protect you at different times and in different situations. Using one does not automatically give you the other.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 5th Amendment */}
                <Card className="counsel-amendment counsel-fifth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="hidden">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="counsel-amendment-label">5th Amendment</Badge>
                        <h3>Right Against Self-Incrimination</h3>
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
                <Card className="counsel-amendment counsel-sixth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="hidden">
                        <Gavel className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="counsel-amendment-label">6th Amendment</Badge>
                        <h3>Right to Counsel at Trial</h3>
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


      </div>
      <div className="counsel-width counsel-layout">
        <aside className="counsel-contents">
          <h2>{t("counselDesign.explore")}</h2>
          <JurisdictionSelector label={t("caseTimeline.design.state")} value={jurisdiction} onChange={setJurisdiction} />
          <nav lang="en" aria-label={t("counselDesign.sectionsLabel")}>
            {SECTIONS.map(({ id, shortLabel }) => <button type="button" key={id} onClick={() => openAndScroll(id)} aria-controls={id}>{shortLabel}</button>)}
          </nav>
          <nav lang="en" className="counsel-quick-links" aria-label={t("counselDesign.related")}>
            {QUICK_LINKS.map(({ href, title }) => <Link href={href} key={href}>{title}</Link>)}
          </nav>
        </aside>
        <div className="counsel-reading" lang="en">
            {/* ── CUSTODY LEVELS ──────────────────────────────────── */}
            <SectionPanel
              id="custody-levels"
              title="Detention, Custody, and Arrest — They're Not the Same"
              isOpen={openIds.has("custody-levels")}
              onToggle={() => toggleSection("custody-levels")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                Police interactions exist on a spectrum. Where you fall on that spectrum determines what rights are triggered. Many people believe their rights only begin when they are "under arrest." This is a dangerous misunderstanding.
              </p>

              <div className="space-y-4">
                <Card className="counsel-reading-row">
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

                <Card className="counsel-reading-row">
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

                <Card className="counsel-reading-row">
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

                <Card className="counsel-reading-row">
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
              isOpen={openIds.has("interrogation-vs-trial")}
              onToggle={() => toggleSection("interrogation-vs-trial")}
            >
              <p className="text-muted-foreground text-sm leading-relaxed">
                The right to an attorney during interrogation and the right to an attorney at trial serve different functions and carry different protections. For most people charged with a crime, both will ultimately apply, but understanding the distinction helps you protect yourself at each stage.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="counsel-amendment counsel-fifth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3>During Interrogation</h3>
                    </div>
                    <Badge variant="outline" className="counsel-amendment-label">5th Amendment</Badge>
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
                      <p className="font-semibold text-blue-800 dark:text-blue-300 text-xs mb-1">If you want to invoke these rights, courts recognize clear statements like:</p>
                      <p className="text-blue-700 dark:text-blue-400 text-xs italic">"I am invoking my right to remain silent and my right to an attorney. I will not answer any questions without a lawyer present."</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="counsel-amendment counsel-sixth">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Gavel className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3>At Trial & Critical Stages</h3>
                    </div>
                    <Badge variant="outline" className="counsel-amendment-label">6th Amendment</Badge>
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
                      <p className="font-semibold text-green-800 dark:text-green-300 text-xs mb-1">If you want to invoke this right, courts recognize clear statements like:</p>
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
              isOpen={openIds.has("when-not-apply")}
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
                  <Card key={i} className="counsel-reading-row">
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
              isOpen={openIds.has("unclear-situations")}
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
              isOpen={openIds.has("what-happens")}
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
                    <h3 className="font-semibold text-foreground mb-2 text-sm">Clear invocation is required</h3>
                    <p className="text-sm text-muted-foreground">Phrases like "maybe I should get a lawyer" or "do you think I need an attorney?" have not been recognized by courts as valid invocation. Courts require a clear, unambiguous statement. Language like this is recognized: "I want a lawyer. I am not answering any questions without a lawyer present."</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">Invoking does not end your detention</h3>
                    <p className="text-sm text-muted-foreground">Asking for a lawyer does not end your detention or get you released. You will remain in custody until arraignment or bail. Questioning, however, must stop — and anything you say after invoking can still be used against you.</p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 text-sm">After you invoke</h3>
                    <p className="text-sm text-muted-foreground">Once invoked, officers are legally required to stop all questioning — not just the current question. They may not send in a different officer or try again later. Engaging in conversation after invoking can create legal complications for any future challenge to statements made.</p>
                  </CardContent>
                </Card>
              </div>
            </SectionPanel>

            {/* ── QUICK REFERENCE ─────────────────────────────────── */}
            <SectionPanel
              id="quick-reference"
              title="Quick Reference: Which Right Applies?"
              isOpen={openIds.has("quick-reference")}
              onToggle={() => toggleSection("quick-reference")}
            >
              <div className="counsel-table">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse"><caption className="sr-only">Quick Reference: Which Right Applies?</caption>
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
            <div className="counsel-related">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Related Guides</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { href: "/rights-info",    Icon: Shield,        title: "Your Constitutional Rights" },
                  { href: "/first-24-hours", Icon: Scale,         title: "The First 24 Hours After Arrest" },
                  { href: "/search-seizure", Icon: Gavel,         title: "Rights During a Search" },
                  { href: "/case-guidance",  Icon: MessageSquare, title: "Get Guidance for Your Situation" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="counsel-related-link">
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
      <div className="counsel-width counsel-help"><h2>{t("counselDesign.help")}</h2><Link href="/legal-aid">{t("counselDesign.findHelp")}</Link><Link href="/data-sources">{t("standaloneGuides.sources")}</Link></div>
    </ScanFirstPageFrame>
  );
}
