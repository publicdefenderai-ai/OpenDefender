import "./quick-reference.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

function PrintableCard({ title, sections, testId }: {
  title: string;
  sections: { heading: string; items: string[] }[];
  testId?: string;
}) {
  const { t } = useTranslation();
  return (
    <article className="quick-ref-card" data-testid={testId}>
      <div className="reference-title">
        <h2>{title}</h2><span>OpenDefender</span>
      </div>
      <div className="reference-sections">
        {sections.map(({ heading, items }) => (
          <section key={heading}>
            <h3>{heading}</h3>
            <ul>{items.map(item => <li key={item}><LegalTextHighlighter text={item} /></li>)}</ul>
          </section>
        ))}
      </div>
      <p className="hidden print:block">{t("quickRef.disclaimer.text")}</p>
    </article>
  );
}

export default function QuickReference() {
  useScrollToTop();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("police");
  const [printAllPending, setPrintAllPending] = useState(false);

  const breadcrumbItems = [
    { label: t("breadcrumb.home", "Home"), href: "/" },
  ];

  const handlePrint = () => {
    setActiveTab("all");
    setPrintAllPending(true);
  };

  useEffect(() => {
    if (!printAllPending) return;

    const printTimer = window.setTimeout(() => {
      window.print();
      setPrintAllPending(false);
    }, 0);

    return () => window.clearTimeout(printTimer);
  }, [printAllPending]);

  return (
    <ScanFirstPageFrame mainClassName="reference-reader">
      <PageBreadcrumb items={breadcrumbItems} currentPage={t("quickRef.title")} />
      <div className="reference-width">
        <section className="reference-opening print:hidden">
          <div>
            <h1>{t("quickRef.reader.title")} <span>{t("quickRef.reader.accent")}</span></h1>
            <p>{t("quickRef.subtitle")}</p>
          </div>
          <Button onClick={handlePrint} data-testid="button-print-all-cards">
            <Printer aria-hidden="true" />{t("quickRef.printAll")}
          </Button>
        </section>
        <section id="quick-reference-cards" className="print-section" data-testid="section-quick-reference-cards">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
            <TabsList className="reference-tabs">
              <TabsTrigger value="police">{t("quickRef.tabs.police")}</TabsTrigger>
              <TabsTrigger value="court">{t("quickRef.tabs.court")}</TabsTrigger>
              <TabsTrigger value="all">{t("quickRef.tabs.all")}</TabsTrigger>
            </TabsList>
            <TabsContent value="police"><PoliceEncounterCard /></TabsContent>
            <TabsContent value="court"><CourtCards /></TabsContent>
            <TabsContent value="all"><AllCardsContent /></TabsContent>
          </Tabs>
          <div id="print-all-cards" className="hidden print:block" data-testid="print-all-cards">
            <AllCardsContent cardTestId="printable-card" />
          </div>
        </section>
        <aside className="reference-notes print:hidden">
          <p><strong>{t("quickRef.disclaimer.title")} </strong>{t("quickRef.disclaimer.text")}</p>
          <p>{t("quickRef.reader.pleaNote")} <Link href="/collateral-consequences">{t("quickRef.reader.consequences")}</Link></p>
          <nav aria-label={t("statutes.reader.related")}>
            <Link href="/rights-info">{t("quickRef.reader.rights")}</Link>
            <Link href="/case-timeline">{t("quickRef.reader.timeline")}</Link>
          </nav>
        </aside>
      </div>
    </ScanFirstPageFrame>
  );
}

function CourtCards({ cardTestId }: { cardTestId?: string }) {
  return (
    <>
      <ArraignmentCard testId={cardTestId} />
      <BailHearingCard testId={cardTestId} />
      <PretrialCard testId={cardTestId} />
      <PleaCard testId={cardTestId} />
      <SentencingCard testId={cardTestId} />
    </>
  );
}

function AllCardsContent({ cardTestId }: { cardTestId?: string }) {
  return (
    <>
      <PoliceEncounterCard testId={cardTestId} />
      <CourtCards cardTestId={cardTestId} />
    </>
  );
}

function PoliceEncounterCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.police.title", "If You Are Stopped by Police")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.police.stay", "Stay Calm & Remember"),
          items: [
            t("quickRef.police.stay1", "You have the right to remain silent. Say: \"I am exercising my right to remain silent.\""),
            t("quickRef.police.stay2", "You have the right to refuse searches. Say: \"I do not consent to a search.\""),
            t("quickRef.police.stay3", "Ask: \"Am I free to leave?\" If yes, walk away calmly."),
            t("quickRef.police.stay4", "You have the right to an attorney. Say: \"I want to speak to a lawyer.\""),
          ],
        },
        {
          heading: t("quickRef.police.doHeading", "Do"),
          items: [
            t("quickRef.police.do1", "Keep your hands visible at all times"),
            t("quickRef.police.do2", "Provide your name and ID if asked"),
            t("quickRef.police.do3", "Stay calm and speak clearly"),
            t("quickRef.police.do4", "Remember badge numbers and patrol car numbers"),
            t("quickRef.police.do5", "Write down everything immediately after"),
          ],
        },
        {
          heading: t("quickRef.police.dontHeading", "Don't"),
          items: [
            t("quickRef.police.dont1", "Don't resist arrest, even if you believe it's unfair"),
            t("quickRef.police.dont2", "Don't run, argue, or make sudden movements"),
            t("quickRef.police.dont3", "Don't consent to a search of your person, car, or home"),
            t("quickRef.police.dont4", "Don't answer questions without a lawyer present"),
            t("quickRef.police.dont5", "Don't sign anything without reading it and consulting an attorney"),
          ],
        },
        {
          heading: t("quickRef.police.ifArrested", "If You Are Arrested"),
          items: [
            t("quickRef.police.arrested1", "Say clearly: \"I want a lawyer\" — then stop talking"),
            t("quickRef.police.arrested2"),
            t("quickRef.police.arrested3", "Do not discuss your case with anyone except your attorney"),
            t("quickRef.police.arrested4"),
          ],
        },
      ]}
    />
  );
}

function ArraignmentCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.arraignment.title", "Arraignment")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.arraignment.expect", "What to Expect"),
          items: [
            t("quickRef.arraignment.expect1", "The judge reads the charges against you"),
            t("quickRef.arraignment.expect2"),
            t("quickRef.arraignment.expect3", "Bail amount may be set or modified"),
            t("quickRef.arraignment.expect4", "Your attorney can request a public defender if needed"),
          ],
        },
        {
          heading: t("quickRef.arraignment.say", "What to Say"),
          items: [
            t("quickRef.arraignment.say1"),
            t("quickRef.arraignment.say2", "\"I would like a court-appointed attorney\" — if you can't afford one"),
            t("quickRef.arraignment.say3", "\"Yes, Your Honor\" / \"No, Your Honor\" — when addressing the judge"),
          ],
        },
        {
          heading: t("quickRef.arraignment.dontSay", "Don't Say"),
          items: [
            t("quickRef.arraignment.dontSay1", "Don't discuss the facts of your case in open court"),
            t("quickRef.arraignment.dontSay2", "Don't plead guilty without talking to a lawyer first"),
            t("quickRef.arraignment.dontSay3", "Don't argue with the judge or prosecutor"),
          ],
        },
        {
          heading: t("quickRef.arraignment.rights", "Your Rights"),
          items: [
            t("quickRef.arraignment.right1", "Right to an attorney (free if you can't afford one)"),
            t("quickRef.arraignment.right2", "Right to know the charges against you"),
            t("quickRef.arraignment.right3", "Right to reasonable bail"),
            t("quickRef.arraignment.right4", "Right to a speedy trial"),
          ],
        },
      ]}
    />
  );
}

function BailHearingCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.bail.title", "Bail Hearing")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.bail.expect", "What to Expect"),
          items: [
            t("quickRef.bail.expect1", "Judge decides whether to grant bail and how much"),
            t("quickRef.bail.expect2", "Factors: severity of charge, flight risk, community ties, criminal history"),
            t("quickRef.bail.expect3", "You or your attorney can argue for lower bail or release"),
            t("quickRef.bail.expect4", "Conditions of release may be set (curfew, no contact orders, etc.)"),
          ],
        },
        {
          heading: t("quickRef.bail.say", "What to Say"),
          items: [
            t("quickRef.bail.say1", "Emphasize community ties: family, job, length of residence"),
            t("quickRef.bail.say2", "Mention you will comply with all court dates"),
            t("quickRef.bail.say3", "Offer alternatives if bail is too high (ankle monitor, check-ins)"),
          ],
        },
        {
          heading: t("quickRef.bail.dontSay", "Don't Say"),
          items: [
            t("quickRef.bail.dontSay1", "Don't discuss the details of your case"),
            t("quickRef.bail.dontSay2", "Don't make promises you can't keep"),
            t("quickRef.bail.dontSay3", "Don't show frustration or anger toward the court"),
          ],
        },
        {
          heading: t("quickRef.bail.rights", "Your Rights"),
          items: [
            t("quickRef.bail.right1", "Right to reasonable bail (8th Amendment)"),
            t("quickRef.bail.right2", "Right to a bail hearing"),
            t("quickRef.bail.right3", "Right to appeal a bail decision"),
          ],
        },
      ]}
    />
  );
}

function PretrialCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.pretrial.title", "Pretrial / Discovery")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.pretrial.expect", "What to Expect"),
          items: [
            t("quickRef.pretrial.expect1", "Both sides exchange evidence (discovery process)"),
            t("quickRef.pretrial.expect2", "Your attorney may file motions to suppress evidence or dismiss charges"),
            t("quickRef.pretrial.expect3", "Plea bargain negotiations often happen during this phase"),
            t("quickRef.pretrial.expect4", "This phase can take weeks to months"),
          ],
        },
        {
          heading: t("quickRef.pretrial.say", "What to Do"),
          items: [
            t("quickRef.pretrial.do1", "Stay in close contact with your attorney"),
            t("quickRef.pretrial.do2", "Attend every court date — missing one can result in a bench warrant"),
            t("quickRef.pretrial.do3", "Follow all bail conditions strictly"),
            t("quickRef.pretrial.do4", "Gather any evidence or witnesses that help your case"),
          ],
        },
        {
          heading: t("quickRef.pretrial.dontSay", "Don't Do"),
          items: [
            t("quickRef.pretrial.dont1", "Don't discuss your case on social media or with others"),
            t("quickRef.pretrial.dont2", "Don't contact witnesses or victims directly"),
            t("quickRef.pretrial.dont3", "Don't accept a plea deal without fully understanding the consequences"),
          ],
        },
        {
          heading: t("quickRef.pretrial.rights", "Your Rights"),
          items: [
            t("quickRef.pretrial.right1", "Right to see all evidence against you (Brady Rule)"),
            t("quickRef.pretrial.right2", "Right to a speedy trial"),
            t("quickRef.pretrial.right3", "Right to present your own evidence and witnesses"),
          ],
        },
      ]}
    />
  );
}

function PleaCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.plea.title", "Plea Hearing")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.plea.expect", "What to Expect"),
          items: [
            t("quickRef.plea.expect1", "The judge asks if you understand the plea and its consequences"),
            t("quickRef.plea.expect2", "You must confirm the plea is voluntary and not coerced"),
            t("quickRef.plea.expect3", "The judge explains the maximum possible sentence"),
            t("quickRef.plea.expect4", "Sentencing may happen immediately or be scheduled later"),
          ],
        },
        {
          heading: t("quickRef.plea.say", "What to Say"),
          items: [
            t("quickRef.plea.say1", "\"Yes, I understand\" — when the judge explains the plea terms"),
            t("quickRef.plea.say2", "\"Yes, this is my voluntary decision\" — confirm you were not forced"),
            t("quickRef.plea.say3", "Ask your lawyer to explain anything you don't understand"),
          ],
        },
        {
          heading: t("quickRef.plea.dontSay", "Don't Say"),
          items: [
            t("quickRef.plea.dontSay1", "Don't say \"I didn't do it\" while pleading guilty — the judge may reject the plea"),
            t("quickRef.plea.dontSay2", "Don't agree to a plea if you don't understand the collateral consequences (immigration, housing, employment)"),
            t("quickRef.plea.dontSay3", "Don't rush — you can ask for more time to decide"),
          ],
        },
        {
          heading: t("quickRef.plea.rights", "Your Rights"),
          items: [
            t("quickRef.plea.right1", "Right to withdraw a guilty plea in certain circumstances"),
            t("quickRef.plea.right2", "Right to know the full consequences before pleading"),
            t("quickRef.plea.right3", "Right to reject any plea deal and go to trial"),
          ],
        },
      ]}
    />
  );
}

function SentencingCard({ testId }: { testId?: string }) {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.sentencing.title", "Sentencing")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.sentencing.expect", "What to Expect"),
          items: [
            t("quickRef.sentencing.expect1", "The judge considers sentencing guidelines, victim impact statements, and your background"),
            t("quickRef.sentencing.expect2", "Your attorney can present mitigating factors (first offense, employment, family responsibilities)"),
            t("quickRef.sentencing.expect3", "Possible outcomes: fines, probation, community service, imprisonment, or combination"),
            t("quickRef.sentencing.expect4", "You may have the opportunity to address the court"),
          ],
        },
        {
          heading: t("quickRef.sentencing.say", "What to Say"),
          items: [
            t("quickRef.sentencing.say1", "Express genuine remorse if you have been found guilty"),
            t("quickRef.sentencing.say2", "Mention rehabilitation steps you've taken (counseling, classes, employment)"),
            t("quickRef.sentencing.say3", "Describe your responsibilities (children, family, community)"),
          ],
        },
        {
          heading: t("quickRef.sentencing.dontSay", "Don't Say"),
          items: [
            t("quickRef.sentencing.dontSay1", "Don't blame the victim or minimize the offense"),
            t("quickRef.sentencing.dontSay2", "Don't argue with the judge's questions"),
            t("quickRef.sentencing.dontSay3", "Don't make excuses — take responsibility where appropriate"),
          ],
        },
        {
          heading: t("quickRef.sentencing.rights", "Your Rights"),
          items: [
            t("quickRef.sentencing.right1", "Right to speak at your sentencing (allocution)"),
            t("quickRef.sentencing.right2", "Right to appeal the sentence"),
            t("quickRef.sentencing.right3", "Right to fair and proportional punishment (8th Amendment)"),
            t("quickRef.sentencing.right4", "Right to have your attorney present"),
          ],
        },
      ]}
    />
  );
}
