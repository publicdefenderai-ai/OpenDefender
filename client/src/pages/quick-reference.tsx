import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Shield,
  Printer,
  AlertTriangle,
  Gavel,
  Scale,
  FileText,
  Users,
  HandMetal,
  Phone,
  ChevronDown,
  ChevronUp,
  MessageCircleOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

function PrintableCard({
  title,
  icon,
  color,
  bgColor,
  borderColor,
  sections,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  sections: {
    heading: string;
    headingIcon?: React.ReactNode;
    items: string[];
    type?: "do" | "dont" | "info";
  }[];
}) {
  const { t } = useTranslation();

  return (
    <div className="quick-ref-card break-inside-avoid">
      <Card className={`border-2 ${borderColor} overflow-hidden`}>
        <CardHeader className={`${bgColor} py-4`}>
          <CardTitle className={`flex items-center gap-2 text-lg ${color}`}>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 space-y-4">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1.5">
                {section.headingIcon}
                {section.heading}
              </h4>
              <ul className="space-y-1.5">
                {section.items.map((item, iIdx) => (
                  <li
                    key={iIdx}
                    className={`text-sm flex items-start gap-2 ${
                      section.type === "do"
                        ? "text-green-700 dark:text-green-300"
                        : section.type === "dont"
                          ? "text-red-700 dark:text-red-300"
                          : "text-muted-foreground"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {section.type === "do" ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : section.type === "dont" ? (
                        <XCircle className="h-3.5 w-3.5" />
                      ) : (
                        "•"
                      )}
                    </span>
                    <LegalTextHighlighter text={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function QuickReference() {
  useScrollToTop();
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const breadcrumbItems = [
    { label: t("breadcrumb.home", "Home"), href: "/" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={t("quickRef.title", "Quick-Reference Cards")}
      />

      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {t("quickRef.title", "Quick-Reference Cards")}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-6">
                {t("quickRef.subtitle", "Compact, printable guides for your rights at every stage. Save them to your phone or print them out.")}
              </p>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                aria-label={t("quickRef.printAll", "Print all cards")}
              >
                <Printer className="h-4 w-4 mr-2" />
                {t("quickRef.printAll", "Print All Cards")}
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background print-section" ref={printRef}>
        <div className="max-w-6xl mx-auto px-4">
          <Tabs defaultValue="police" className="w-full">
            <ScrollReveal>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 mb-10 bg-background border border-border print:hidden">
                <TabsTrigger
                  value="police"
                  className="gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                >
                  <HandMetal className="h-4 w-4" />
                  {t("quickRef.tabs.police", "Police Encounters")}
                </TabsTrigger>
                <TabsTrigger
                  value="court"
                  className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Gavel className="h-4 w-4" />
                  {t("quickRef.tabs.court", "Court Stages")}
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="gap-2 data-[state=active]:bg-slate-600 data-[state=active]:text-white col-span-2 lg:col-span-1"
                >
                  <Printer className="h-4 w-4" />
                  {t("quickRef.tabs.all", "All Cards")}
                </TabsTrigger>
              </TabsList>
            </ScrollReveal>

            <TabsContent value="police">
              <ScrollReveal>
                <PoliceEncounterCard />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="court">
              <div className="grid md:grid-cols-2 gap-6">
                <ScrollReveal delay={0}><ArraignmentCard /></ScrollReveal>
                <ScrollReveal delay={0.1}><BailHearingCard /></ScrollReveal>
                <ScrollReveal delay={0.2}><PretrialCard /></ScrollReveal>
                <ScrollReveal delay={0.3}><PleaCard /></ScrollReveal>
                <ScrollReveal delay={0.4}><SentencingCard /></ScrollReveal>
              </div>
            </TabsContent>

            <TabsContent value="all">
              <div className="space-y-6 print:space-y-4">
                <PoliceEncounterCard />
                <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                  <ArraignmentCard />
                  <BailHearingCard />
                  <PretrialCard />
                  <PleaCard />
                  <SentencingCard />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-10 border-border print:hidden">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-muted-foreground">
                <strong>{t("quickRef.disclaimer.title", "Important:")}</strong>{" "}
                {t("quickRef.disclaimer.text", "These cards provide general information about your rights. Laws vary by state and situation. This is not legal advice. Always consult with an attorney about your specific case.")}
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PoliceEncounterCard() {
  const { t } = useTranslation();
  return (
    <div className="max-w-2xl mx-auto">
      <PrintableCard
        title={t("quickRef.police.title", "If You Are Stopped by Police")}
        icon={<HandMetal className="h-5 w-5" />}
        color="text-red-700 dark:text-red-300"
        bgColor="bg-red-50 dark:bg-red-950/40"
        borderColor="border-red-300 dark:border-red-700"
        sections={[
          {
            heading: t("quickRef.police.stay", "Stay Calm & Remember"),
            headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
            items: [
              t("quickRef.police.stay1", "You have the right to remain silent. Say: \"I am exercising my right to remain silent.\""),
              t("quickRef.police.stay2", "You have the right to refuse searches. Say: \"I do not consent to a search.\""),
              t("quickRef.police.stay3", "Ask: \"Am I free to leave?\" If yes, walk away calmly."),
              t("quickRef.police.stay4", "You have the right to an attorney. Say: \"I want to speak to a lawyer.\""),
            ],
            type: "info",
          },
          {
            heading: t("quickRef.police.doHeading", "Do"),
            headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
            items: [
              t("quickRef.police.do1", "Keep your hands visible at all times"),
              t("quickRef.police.do2", "Provide your name and ID if asked"),
              t("quickRef.police.do3", "Stay calm and speak clearly"),
              t("quickRef.police.do4", "Remember badge numbers and patrol car numbers"),
              t("quickRef.police.do5", "Write down everything immediately after"),
            ],
            type: "do",
          },
          {
            heading: t("quickRef.police.dontHeading", "Don't"),
            headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
            items: [
              t("quickRef.police.dont1", "Don't resist arrest, even if you believe it's unfair"),
              t("quickRef.police.dont2", "Don't run, argue, or make sudden movements"),
              t("quickRef.police.dont3", "Don't consent to a search of your person, car, or home"),
              t("quickRef.police.dont4", "Don't answer questions without a lawyer present"),
              t("quickRef.police.dont5", "Don't sign anything without reading it and consulting an attorney"),
            ],
            type: "dont",
          },
          {
            heading: t("quickRef.police.ifArrested", "If You Are Arrested"),
            headingIcon: <AlertTriangle className="h-4 w-4 text-amber-600" />,
            items: [
              t("quickRef.police.arrested1", "Say clearly: \"I want a lawyer\" — then stop talking"),
              t("quickRef.police.arrested2", "You get at least one phone call — use it to call a lawyer or family"),
              t("quickRef.police.arrested3", "Do not discuss your case with anyone except your attorney"),
              t("quickRef.police.arrested4", "You must be brought before a judge within 48-72 hours"),
            ],
            type: "info",
          },
        ]}
      />
    </div>
  );
}

function ArraignmentCard() {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.arraignment.title", "Arraignment")}
      icon={<Gavel className="h-5 w-5" />}
      color="text-amber-700 dark:text-amber-300"
      bgColor="bg-amber-50 dark:bg-amber-950/40"
      borderColor="border-amber-300 dark:border-amber-700"
      sections={[
        {
          heading: t("quickRef.arraignment.expect", "What to Expect"),
          items: [
            t("quickRef.arraignment.expect1", "The judge reads the charges against you"),
            t("quickRef.arraignment.expect2", "You enter a plea: guilty, not guilty, or no contest"),
            t("quickRef.arraignment.expect3", "Bail amount may be set or modified"),
            t("quickRef.arraignment.expect4", "Your attorney can request a public defender if needed"),
          ],
          type: "info",
        },
        {
          heading: t("quickRef.arraignment.say", "What to Say"),
          headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
          items: [
            t("quickRef.arraignment.say1", "\"Not guilty\" — this is almost always the best initial plea"),
            t("quickRef.arraignment.say2", "\"I would like a court-appointed attorney\" — if you can't afford one"),
            t("quickRef.arraignment.say3", "\"Yes, Your Honor\" / \"No, Your Honor\" — when addressing the judge"),
          ],
          type: "do",
        },
        {
          heading: t("quickRef.arraignment.dontSay", "Don't Say"),
          headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
          items: [
            t("quickRef.arraignment.dontSay1", "Don't discuss the facts of your case in open court"),
            t("quickRef.arraignment.dontSay2", "Don't plead guilty without talking to a lawyer first"),
            t("quickRef.arraignment.dontSay3", "Don't argue with the judge or prosecutor"),
          ],
          type: "dont",
        },
        {
          heading: t("quickRef.arraignment.rights", "Your Rights"),
          headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
          items: [
            t("quickRef.arraignment.right1", "Right to an attorney (free if you can't afford one)"),
            t("quickRef.arraignment.right2", "Right to know the charges against you"),
            t("quickRef.arraignment.right3", "Right to reasonable bail"),
            t("quickRef.arraignment.right4", "Right to a speedy trial"),
          ],
          type: "info",
        },
      ]}
    />
  );
}

function BailHearingCard() {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.bail.title", "Bail Hearing")}
      icon={<Scale className="h-5 w-5" />}
      color="text-green-700 dark:text-green-300"
      bgColor="bg-green-50 dark:bg-green-950/40"
      borderColor="border-green-300 dark:border-green-700"
      sections={[
        {
          heading: t("quickRef.bail.expect", "What to Expect"),
          items: [
            t("quickRef.bail.expect1", "Judge decides whether to grant bail and how much"),
            t("quickRef.bail.expect2", "Factors: severity of charge, flight risk, community ties, criminal history"),
            t("quickRef.bail.expect3", "You or your attorney can argue for lower bail or release"),
            t("quickRef.bail.expect4", "Conditions of release may be set (curfew, no contact orders, etc.)"),
          ],
          type: "info",
        },
        {
          heading: t("quickRef.bail.say", "What to Say"),
          headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
          items: [
            t("quickRef.bail.say1", "Emphasize community ties: family, job, length of residence"),
            t("quickRef.bail.say2", "Mention you will comply with all court dates"),
            t("quickRef.bail.say3", "Offer alternatives if bail is too high (ankle monitor, check-ins)"),
          ],
          type: "do",
        },
        {
          heading: t("quickRef.bail.dontSay", "Don't Say"),
          headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
          items: [
            t("quickRef.bail.dontSay1", "Don't discuss the details of your case"),
            t("quickRef.bail.dontSay2", "Don't make promises you can't keep"),
            t("quickRef.bail.dontSay3", "Don't show frustration or anger toward the court"),
          ],
          type: "dont",
        },
        {
          heading: t("quickRef.bail.rights", "Your Rights"),
          headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
          items: [
            t("quickRef.bail.right1", "Right to reasonable bail (8th Amendment)"),
            t("quickRef.bail.right2", "Right to a bail hearing"),
            t("quickRef.bail.right3", "Right to appeal a bail decision"),
          ],
          type: "info",
        },
      ]}
    />
  );
}

function PretrialCard() {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.pretrial.title", "Pretrial / Discovery")}
      icon={<FileText className="h-5 w-5" />}
      color="text-blue-700 dark:text-blue-300"
      bgColor="bg-blue-50 dark:bg-blue-950/40"
      borderColor="border-blue-300 dark:border-blue-700"
      sections={[
        {
          heading: t("quickRef.pretrial.expect", "What to Expect"),
          items: [
            t("quickRef.pretrial.expect1", "Both sides exchange evidence (discovery process)"),
            t("quickRef.pretrial.expect2", "Your attorney may file motions to suppress evidence or dismiss charges"),
            t("quickRef.pretrial.expect3", "Plea bargain negotiations often happen during this phase"),
            t("quickRef.pretrial.expect4", "This phase can take weeks to months"),
          ],
          type: "info",
        },
        {
          heading: t("quickRef.pretrial.say", "What to Do"),
          headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
          items: [
            t("quickRef.pretrial.do1", "Stay in close contact with your attorney"),
            t("quickRef.pretrial.do2", "Attend every court date — missing one can result in a bench warrant"),
            t("quickRef.pretrial.do3", "Follow all bail conditions strictly"),
            t("quickRef.pretrial.do4", "Gather any evidence or witnesses that help your case"),
          ],
          type: "do",
        },
        {
          heading: t("quickRef.pretrial.dontSay", "Don't Do"),
          headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
          items: [
            t("quickRef.pretrial.dont1", "Don't discuss your case on social media or with others"),
            t("quickRef.pretrial.dont2", "Don't contact witnesses or victims directly"),
            t("quickRef.pretrial.dont3", "Don't accept a plea deal without fully understanding the consequences"),
          ],
          type: "dont",
        },
        {
          heading: t("quickRef.pretrial.rights", "Your Rights"),
          headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
          items: [
            t("quickRef.pretrial.right1", "Right to see all evidence against you (Brady Rule)"),
            t("quickRef.pretrial.right2", "Right to a speedy trial"),
            t("quickRef.pretrial.right3", "Right to present your own evidence and witnesses"),
          ],
          type: "info",
        },
      ]}
    />
  );
}

function PleaCard() {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.plea.title", "Plea Hearing")}
      icon={<Users className="h-5 w-5" />}
      color="text-purple-700 dark:text-purple-300"
      bgColor="bg-purple-50 dark:bg-purple-950/40"
      borderColor="border-purple-300 dark:border-purple-700"
      sections={[
        {
          heading: t("quickRef.plea.expect", "What to Expect"),
          items: [
            t("quickRef.plea.expect1", "The judge asks if you understand the plea and its consequences"),
            t("quickRef.plea.expect2", "You must confirm the plea is voluntary and not coerced"),
            t("quickRef.plea.expect3", "The judge explains the maximum possible sentence"),
            t("quickRef.plea.expect4", "Sentencing may happen immediately or be scheduled later"),
          ],
          type: "info",
        },
        {
          heading: t("quickRef.plea.say", "What to Say"),
          headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
          items: [
            t("quickRef.plea.say1", "\"Yes, I understand\" — when the judge explains the plea terms"),
            t("quickRef.plea.say2", "\"Yes, this is my voluntary decision\" — confirm you were not forced"),
            t("quickRef.plea.say3", "Ask your lawyer to explain anything you don't understand"),
          ],
          type: "do",
        },
        {
          heading: t("quickRef.plea.dontSay", "Don't Say"),
          headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
          items: [
            t("quickRef.plea.dontSay1", "Don't say \"I didn't do it\" while pleading guilty — the judge may reject the plea"),
            t("quickRef.plea.dontSay2", "Don't agree to a plea if you don't understand the collateral consequences (immigration, housing, employment)"),
            t("quickRef.plea.dontSay3", "Don't rush — you can ask for more time to decide"),
          ],
          type: "dont",
        },
        {
          heading: t("quickRef.plea.rights", "Your Rights"),
          headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
          items: [
            t("quickRef.plea.right1", "Right to withdraw a guilty plea in certain circumstances"),
            t("quickRef.plea.right2", "Right to know the full consequences before pleading"),
            t("quickRef.plea.right3", "Right to reject any plea deal and go to trial"),
          ],
          type: "info",
        },
      ]}
    />
  );
}

function SentencingCard() {
  const { t } = useTranslation();
  return (
    <PrintableCard
      title={t("quickRef.sentencing.title", "Sentencing")}
      icon={<Gavel className="h-5 w-5" />}
      color="text-slate-700 dark:text-slate-300"
      bgColor="bg-slate-50 dark:bg-slate-800/60"
      borderColor="border-slate-300 dark:border-slate-700"
      sections={[
        {
          heading: t("quickRef.sentencing.expect", "What to Expect"),
          items: [
            t("quickRef.sentencing.expect1", "The judge considers sentencing guidelines, victim impact statements, and your background"),
            t("quickRef.sentencing.expect2", "Your attorney can present mitigating factors (first offense, employment, family responsibilities)"),
            t("quickRef.sentencing.expect3", "Possible outcomes: fines, probation, community service, imprisonment, or combination"),
            t("quickRef.sentencing.expect4", "You may have the opportunity to address the court"),
          ],
          type: "info",
        },
        {
          heading: t("quickRef.sentencing.say", "What to Say"),
          headingIcon: <CheckCircle className="h-4 w-4 text-green-600" />,
          items: [
            t("quickRef.sentencing.say1", "Express genuine remorse if you have been found guilty"),
            t("quickRef.sentencing.say2", "Mention rehabilitation steps you've taken (counseling, classes, employment)"),
            t("quickRef.sentencing.say3", "Describe your responsibilities (children, family, community)"),
          ],
          type: "do",
        },
        {
          heading: t("quickRef.sentencing.dontSay", "Don't Say"),
          headingIcon: <XCircle className="h-4 w-4 text-red-600" />,
          items: [
            t("quickRef.sentencing.dontSay1", "Don't blame the victim or minimize the offense"),
            t("quickRef.sentencing.dontSay2", "Don't argue with the judge's questions"),
            t("quickRef.sentencing.dontSay3", "Don't make excuses — take responsibility where appropriate"),
          ],
          type: "dont",
        },
        {
          heading: t("quickRef.sentencing.rights", "Your Rights"),
          headingIcon: <Shield className="h-4 w-4 text-blue-600" />,
          items: [
            t("quickRef.sentencing.right1", "Right to speak at your sentencing (allocution)"),
            t("quickRef.sentencing.right2", "Right to appeal the sentence"),
            t("quickRef.sentencing.right3", "Right to fair and proportional punishment (8th Amendment)"),
            t("quickRef.sentencing.right4", "Right to have your attorney present"),
          ],
          type: "info",
        },
      ]}
    />
  );
}
