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
      title={t("quickRef.police.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.police.stay"),
          items: [
            t("quickRef.police.stay1"),
            t("quickRef.police.stay2"),
            t("quickRef.police.stay3"),
            t("quickRef.police.stay4"),
          ],
        },
        {
          heading: t("quickRef.police.doHeading"),
          items: [
            t("quickRef.police.do1"),
            t("quickRef.police.do2"),
            t("quickRef.police.do3"),
            t("quickRef.police.do4"),
            t("quickRef.police.do5"),
          ],
        },
        {
          heading: t("quickRef.police.dontHeading"),
          items: [
            t("quickRef.police.dont1"),
            t("quickRef.police.dont2"),
            t("quickRef.police.dont3"),
            t("quickRef.police.dont4"),
            t("quickRef.police.dont5"),
          ],
        },
        {
          heading: t("quickRef.police.ifArrested"),
          items: [
            t("quickRef.police.arrested1"),
            t("quickRef.police.arrested2"),
            t("quickRef.police.arrested3"),
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
      title={t("quickRef.arraignment.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.arraignment.expect"),
          items: [
            t("quickRef.arraignment.expect1"),
            t("quickRef.arraignment.expect2"),
            t("quickRef.arraignment.expect3"),
            t("quickRef.arraignment.expect4"),
          ],
        },
        {
          heading: t("quickRef.arraignment.say"),
          items: [
            t("quickRef.arraignment.say1"),
            t("quickRef.arraignment.say2"),
            t("quickRef.arraignment.say3"),
          ],
        },
        {
          heading: t("quickRef.arraignment.dontSay"),
          items: [
            t("quickRef.arraignment.dontSay1"),
            t("quickRef.arraignment.dontSay2"),
            t("quickRef.arraignment.dontSay3"),
          ],
        },
        {
          heading: t("quickRef.arraignment.rights"),
          items: [
            t("quickRef.arraignment.right1"),
            t("quickRef.arraignment.right2"),
            t("quickRef.arraignment.right3"),
            t("quickRef.arraignment.right4"),
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
      title={t("quickRef.bail.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.bail.expect"),
          items: [
            t("quickRef.bail.expect1"),
            t("quickRef.bail.expect2"),
            t("quickRef.bail.expect3"),
            t("quickRef.bail.expect4"),
          ],
        },
        {
          heading: t("quickRef.bail.say"),
          items: [
            t("quickRef.bail.say1"),
            t("quickRef.bail.say2"),
            t("quickRef.bail.say3"),
          ],
        },
        {
          heading: t("quickRef.bail.dontSay"),
          items: [
            t("quickRef.bail.dontSay1"),
            t("quickRef.bail.dontSay2"),
            t("quickRef.bail.dontSay3"),
          ],
        },
        {
          heading: t("quickRef.bail.rights"),
          items: [
            t("quickRef.bail.right1"),
            t("quickRef.bail.right2"),
            t("quickRef.bail.right3"),
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
      title={t("quickRef.pretrial.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.pretrial.expect"),
          items: [
            t("quickRef.pretrial.expect1"),
            t("quickRef.pretrial.expect2"),
            t("quickRef.pretrial.expect3"),
            t("quickRef.pretrial.expect4"),
          ],
        },
        {
          heading: t("quickRef.pretrial.say"),
          items: [
            t("quickRef.pretrial.do1"),
            t("quickRef.pretrial.do2"),
            t("quickRef.pretrial.do3"),
            t("quickRef.pretrial.do4"),
          ],
        },
        {
          heading: t("quickRef.pretrial.dontSay"),
          items: [
            t("quickRef.pretrial.dont1"),
            t("quickRef.pretrial.dont2"),
            t("quickRef.pretrial.dont3"),
          ],
        },
        {
          heading: t("quickRef.pretrial.rights"),
          items: [
            t("quickRef.pretrial.right1"),
            t("quickRef.pretrial.right2"),
            t("quickRef.pretrial.right3"),
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
      title={t("quickRef.plea.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.plea.expect"),
          items: [
            t("quickRef.plea.expect1"),
            t("quickRef.plea.expect2"),
            t("quickRef.plea.expect3"),
            t("quickRef.plea.expect4"),
          ],
        },
        {
          heading: t("quickRef.plea.say"),
          items: [
            t("quickRef.plea.say1"),
            t("quickRef.plea.say2"),
            t("quickRef.plea.say3"),
          ],
        },
        {
          heading: t("quickRef.plea.dontSay"),
          items: [
            t("quickRef.plea.dontSay1"),
            t("quickRef.plea.dontSay2"),
            t("quickRef.plea.dontSay3"),
          ],
        },
        {
          heading: t("quickRef.plea.rights"),
          items: [
            t("quickRef.plea.right1"),
            t("quickRef.plea.right2"),
            t("quickRef.plea.right3"),
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
      title={t("quickRef.sentencing.title")}
      testId={testId}
      sections={[
        {
          heading: t("quickRef.sentencing.expect"),
          items: [
            t("quickRef.sentencing.expect1"),
            t("quickRef.sentencing.expect2"),
            t("quickRef.sentencing.expect3"),
            t("quickRef.sentencing.expect4"),
          ],
        },
        {
          heading: t("quickRef.sentencing.say"),
          items: [
            t("quickRef.sentencing.say1"),
            t("quickRef.sentencing.say2"),
            t("quickRef.sentencing.say3"),
          ],
        },
        {
          heading: t("quickRef.sentencing.dontSay"),
          items: [
            t("quickRef.sentencing.dontSay1"),
            t("quickRef.sentencing.dontSay2"),
            t("quickRef.sentencing.dontSay3"),
          ],
        },
        {
          heading: t("quickRef.sentencing.rights"),
          items: [
            t("quickRef.sentencing.right1"),
            t("quickRef.sentencing.right2"),
            t("quickRef.sentencing.right3"),
            t("quickRef.sentencing.right4"),
          ],
        },
      ]}
    />
  );
}
