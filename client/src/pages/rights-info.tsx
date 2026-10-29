import { BrandShieldIcon } from "@/components/brand-logo";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, AlertTriangle, Scale, Gavel, UserCheck, FileX, Search, Home, Car, Smartphone, CheckCircle, ChevronDown, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { ShareButton } from "@/components/ui/share-button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";
import { MirandaExplainer } from "@/components/miranda-explainer";

export default function RightsInfo() {
  useScrollToTop();
  const { t } = useTranslation();
  // Native disclosures preserve independent open states and keyboard behavior.
  useEffect(() => {
    const openHash = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target instanceof HTMLDetailsElement) target.open = true;
    };
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, []);
  const topics = [
    { id: "miranda", label: t("rights.detailedRights.tabs.miranda"), content: <MirandaRightsSection /> },
    { id: "arrest", label: t("rights.detailedRights.tabs.arrest"), content: <ArrestRightsSection /> },
    { id: "court", label: t("rights.detailedRights.tabs.court"), content: <CourtRightsSection /> },
    { id: "prison", label: t("rights.detailedRights.tabs.prison"), content: <PrisonRightsSection /> },
    { id: "search", label: t("rights.design.search"), content: <SearchSeizureSection /> },
  ];
  return (
    <ScanFirstPageFrame mainClassName="rights-page">
      <PageBreadcrumb items={[{ label: t("breadcrumb.home", "Home"), href: "/" }]} currentPage={t("rights.hero.title")} />
      <header className="rights-width rights-intro">
        <h1 data-testid="heading-rights-title">{t("rights.hero.title")}</h1>
        <p data-testid="text-rights-subtitle">{t("rights.hero.subtitle")}</p>
        <p>{t("rights.hero.nextStepDescription", "Start with the quick reference, then open the detail that fits your situation.")}</p>
        <div className="rights-intro-actions">
          <a className="rights-link" href="#quick-rights" data-testid="button-start-rights">{t("rights.hero.nextStep", "See the quick rights reference")}</a>
          <ShareButton title={t("rights.hero.title")} text={t("share.rightsDescription", "Learn about your constitutional rights - important information everyone should know.")} variant="outline" data-testid="button-share-rights" />
        </div>
        <Link href="/immigration-guidance" className="rights-link">{t("rights.design.immigration")}</Link>
      </header>
      <section className="rights-width rights-topic-layout" id="quick-rights" aria-labelledby="quick-rights-title">
        <h2 id="quick-rights-title" data-testid="heading-quick-rights">{t("rights.quickRights.title")}</h2>
        <div>
          {["silent", "attorney", "phoneCall", "knowCharges"].map(right => (
            <details className="rights-disclosure" key={right} id={`right-${right}`}>
              <summary data-testid={`card-right-${t(`rights.quickRights.${right}.title`).toLowerCase().replace(/\s+/g, '-')}`}>{t(`rights.quickRights.${right}.title`)}</summary>
              <div className="rights-disclosure-body">
                <p>{t(`rights.quickRights.${right}.description`)}</p>
                <p>{t(`rights.quickRights.${right}.detailedExplanation`)}</p>
                {right === "attorney" && <>
                  <p>There's an important distinction between when your right to counsel begins during interrogation (5th Amendment) versus when it covers your full prosecution (6th Amendment). Many people don't know the right applies before formal charges are filed.</p>
                  <Link href="/right-to-counsel" className="rights-link">Right to an Attorney: Full Guide</Link>
                </>}
              </div>
            </details>
          ))}
        </div>
      </section>
      <div className="rights-width"><MirandaExplainer /></div>
      <section id="quick-reference-cards" className="rights-width rights-print" data-testid="section-printable-rights-cards">
        <div><h2 data-testid="heading-printable-rights-cards">{t("rights.printableCards.title")}</h2><p>{t("rights.printableCards.description")}</p></div>
        <Link href="/quick-reference-cards" className="rights-link" data-testid="button-open-printable-rights-cards">{t("rights.printableCards.button")}</Link>
      </section>
      <section className="rights-width rights-topic-layout" id="constitutional-rights" aria-labelledby="detailed-rights-title">
        <h2 id="detailed-rights-title" data-testid="heading-detailed-rights">{t("rights.detailedRights.title")}</h2>
        <div>{topics.map(topic => <details className="rights-disclosure" id={`rights-${topic.id}`} key={topic.id}>
          <summary data-testid={`tab-${topic.id}`}>{topic.label}</summary>
          <div className="rights-detail-panel">{topic.content}</div>
        </details>)}</div>
      </section>
      <section className="rights-width rights-deeper" id="deep-dives">
        <h2>Go deeper into your rights</h2>
        <p>Each of these pages covers a specific area in full detail.</p>
        <div className="rights-deeper-links">
          {[
            { href: "/right-to-counsel", title: "Right to an Attorney", desc: "When it begins, how to invoke it, and the dangerous gap before arraignment.", testId: "button-right-to-counsel" },
            { href: "/warrants", title: "Warrants & Your Rights", desc: "Arrest warrants, search warrants, how to check if one exists, and what to do.", testId: "button-warrants" },
            { href: "/support/reputation", title: "Hidden Consequences", desc: "What happens to housing, jobs, benefits, and family after a charge or conviction.", testId: "button-collateral-consequences" },
          ].map(item => <div key={item.href}><Link href={item.href} className="rights-link" data-testid={item.testId}>{item.title}</Link><p>{item.desc}</p></div>)}
        </div>
      </section>
      <section className="rights-width rights-closing">
        <Alert><AlertDescription><strong>{t("rights.disclaimer.title")}</strong> {t("rights.disclaimer.text")}</AlertDescription></Alert>
        <h2 data-testid="heading-need-help">{t("rights.disclaimer.needHelp")}</h2>
        <Link href="/case-guidance" className="rights-link" data-testid="button-case-guidance">{t("rights.disclaimer.caseGuidance")}</Link>
      </section>
    </ScanFirstPageFrame>
  );
}

function MirandaRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <BrandShieldIcon size={20} />
          <span>{t('rights.detailedRights.miranda.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.miranda.completeWarning')}</h4>
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p>"{t('rights.detailedRights.miranda.warning1')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning2')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning3')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning4')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning5')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning6')}"</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.miranda.whenApply')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply4')} /></li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.miranda.alertTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.miranda.alertText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ArrestRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.arrest.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.arrest.keyPoints')}</h4>
          <ul className="space-y-3 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.c1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.c2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.c3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.c4')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.c5')} /></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.arrest.policePowers')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power4')} /></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function CourtRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <Gavel className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.court.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.court.constitutional')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right4')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right5')} /></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.court.burdenProof')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden4')} /></li>
            </ul>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.court.etiquetteTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.court.etiquetteText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function PrisonRightsSection() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <FileX className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.prison.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.prison.continuing')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right4')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right5')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right6')} /></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.prison.afterRelease')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after4')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after5')} /></li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.prison.collateralTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.prison.collateralText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

interface SearchScenario {
  icon: React.ReactNode;
  title: string;
  description: string;
  yourRights: string[];
  whatToDo: string[];
  whatNotToDo: string[];
}

const searchScenarios: SearchScenario[] = [
  {
    icon: <User className="h-6 w-6 text-primary" />,
    title: "Stop and Frisk",
    description: "When police stop you on the street and pat you down for weapons",
    yourRights: [
      "You can ask if you're free to leave",
      "You can refuse to answer questions (except giving your name in some states)",
      "Officer needs a good reason to stop you",
      "Pat-down should only check for weapons unless they see something illegal in plain view",
    ],
    whatToDo: [
      "Stay calm and keep hands visible",
      "Ask 'Am I free to go?'",
      "State clearly: 'I do not consent to this search'",
      "Remember the officer's name and badge number",
      "Note any witnesses present",
    ],
    whatNotToDo: [
      "Don't resist physically",
      "Don't run away",
      "Don't put hands in pockets",
      "Don't make sudden movements",
      "Don't consent to searches beyond what's legally required",
    ],
  },
  {
    icon: <Car className="h-6 w-6 text-primary" />,
    title: "Vehicle Search",
    description: "When police want to search your car during a traffic stop",
    yourRights: [
      "Vehicles have fewer warrant protections than homes. Under the automobile exception, probable cause to believe a vehicle contains evidence or contraband can permit a search without a warrant or consent. This does not lower the probable-cause standard.",
      "You can say no to a search of your vehicle",
      "Officer can see items that are out in the open",
      "Arrest alone does not authorize every vehicle search. A search incident to arrest is limited to situations where you can reach the passenger compartment or officers reasonably believe it contains evidence of the offense of arrest. Other exceptions may apply.",
    ],
    whatToDo: [
      "Pull over safely when signaled",
      "Keep hands on steering wheel",
      "Provide license, registration, and insurance when asked",
      "Clearly state: 'I do not consent to a search'",
      "Ask if you're free to go",
    ],
    whatNotToDo: [
      "Don't exit vehicle unless instructed",
      "Don't reach for documents until asked",
      "Don't consent to searches",
      "Don't volunteer information",
      "Don't argue or become confrontational",
    ],
  },
  {
    icon: <Home className="h-6 w-6 text-primary" />,
    title: "Home Search",
    description: "When law enforcement wants to enter or search your home",
    yourRights: [
      "Police usually need a warrant (court order) to enter your home",
      "You can say no if they don't have a warrant",
      "The warrant must name exactly what they can search",
      "You can ask to see the warrant, and officers typically provide a copy. They are not always required to show it before entry or the search. Supporting papers may be sealed, and lawful no-knock entry can occur.",
      "Police can enter without a warrant in emergencies (such as hearing screams)",
      "You can speak through the closed door. If you choose to step outside, do so calmly and close the door behind you. This does not prevent entry when officers have lawful authority.",
    ],
    whatToDo: [
      "Ask to see the warrant before opening the door",
      "Read the warrant carefully",
      "You can speak through the closed door. If you choose to step outside, do so calmly and close the door behind you. This does not prevent entry when officers have lawful authority.",
      "Clearly state: 'I do not consent to a search'",
      "Ask for a lawyer immediately if they insist on searching",
    ],
    whatNotToDo: [
      "Don't open the door fully",
      "Do not physically block entry or a search because officers have not yet shown you a warrant",
      "Don't physically resist",
      "Don't interfere with the search",
      "Don't answer questions beyond identifying yourself",
    ],
  },
  {
    icon: <BrandShieldIcon size={24} light />,
    title: "Search of Your Person",
    description: "When police want to conduct a body search",
    yourRights: [
      "Police need a good reason to pat you down",
      "Full body search requires arrest or a very good reason",
      "Strip searches must satisfy the Fourth Amendment reasonableness standard; a warrant is not always required. Rules depend on the jurisdiction and setting. In the Third Circuit, strip searches incident to arrest outside jails or prisons generally require a warrant or exigent circumstances supported by probable cause. Other courts apply different standards.",
      "You can state that you don't agree to the search",
      "You have privacy rights under the law",
    ],
    whatToDo: [
      "Keep hands visible at all times",
      "Clearly state: 'I do not consent to this search'",
      "Ask what the search is for",
      "Remain calm and cooperative despite your objection",
      "Document what happened as soon as you can",
    ],
    whatNotToDo: [
      "Don't physically resist",
      "Don't reach into your own pockets",
      "Don't make sudden movements",
      "Don't touch the officer",
      "Don't run or attempt to flee",
    ],
  },
  {
    icon: <Smartphone className="h-6 w-6 text-primary" />,
    title: "Phone Search",
    description: "When police ask to see or unlock your phone",
    yourRights: [
      "Police usually need a warrant (court order) to search your phone",
      "You can decline to consent to unlocking your phone. Whether you can be compelled to unlock it depends on the law and circumstances; a lawyer can assess any warrant or order.",
      "You have the right not to help them build a case against you",
      "Compelled fingerprint or facial unlocking can implicate the Fifth Amendment when the act communicates knowledge of or control over the device. Courts are split on when this is testimonial; having a search warrant does not by itself resolve that question.",
      "Disclosing a memorized passcode is more likely to be treated as testimonial. Courts disagree about compelled unlocking and the foregone-conclusion doctrine, which may allow compulsion when the government already knows the facts the act would communicate. Protection is not absolute.",
    ],
    whatToDo: [
      "Clearly state: 'I do not consent to a search of my phone'",
      "Ask if they have a warrant",
      "Request to speak with an attorney",
      "Keep phone locked and password-protected",
      "Consider disabling biometric unlock in sensitive situations",
    ],
    whatNotToDo: [
      "A warrant to search a phone and authority to compel you to unlock it are separate legal questions",
      "A lawyer can explain the consequences of disclosing a passcode or responding to a court order",
      "Do not physically resist an attempted biometric unlock; tell your attorney what occurred",
      "Don't let officers look through your phone to 'prove' something",
      "Don't delete anything (this could be obstruction of justice)",
    ],
  },
];

function SearchScenarioCard({ scenario }: { scenario: SearchScenario }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="rights-search-scenario">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-12 h-12 bg-muted text-primary rounded-lg flex items-center justify-center`}>
                  {scenario.icon}
                </div>
                <div className="text-left min-w-0">
                  <CardTitle className="text-base">{scenario.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 flex-shrink-0 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2 text-sm">
                <BrandShieldIcon size={14} />
                Your Rights:
              </h4>
              <ul className="space-y-2">
                {scenario.yourRights.map((right, i) => (
                  <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {right}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function SearchSeizureSection() {
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Search &amp; Seizure Rights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <AlertDescription className="text-blue-800 dark:text-blue-200 flex items-start gap-3">
            <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span><strong>Key Principle:</strong> Police usually need a warrant or your permission to search you. You have the right to say no, even if it doesn't stop the search. Refusing is not an admission of guilt. It protects your rights in court.</span>
          </AlertDescription>
        </Alert>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>On probation or parole?</strong> Your search rights may be significantly reduced. Most supervision agreements include a search condition that allows your PO or law enforcement to search you or your home with little or no warning and without a warrant. Know your supervision conditions before assuming you can refuse a search.
          </AlertDescription>
        </Alert>

        <div>
          <h4 className="font-semibold text-foreground mb-4">General Guidelines</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">Stay Calm</p>
              <p className="text-sm text-muted-foreground">Remain polite and calm, even if you believe your rights are being violated. Arguments escalate situations.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">State Your Rights</p>
              <p className="text-sm text-muted-foreground">Clearly say "I do not consent to this search" and "I want to speak to an attorney." Silence alone may not be enough.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">Document Everything</p>
              <p className="text-sm text-muted-foreground">Note badge numbers, officer names, and witnesses. Write down what happened as soon as possible.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Common Search Scenarios</h4>
          <p className="text-sm text-muted-foreground mb-4">Tap each scenario to see your rights and what to do.</p>
          <div className="space-y-3">
            {searchScenarios.map((scenario) => (
              <SearchScenarioCard key={scenario.title} scenario={scenario} />
            ))}
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Laws vary by state and situation. This is general information, not legal advice. If your rights were violated during a search, tell your attorney immediately. Evidence obtained illegally may be excluded from your case.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

