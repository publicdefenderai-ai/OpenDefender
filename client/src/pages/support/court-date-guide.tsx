import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import {
  Calendar,
  Bell,
  Car,
  AlertTriangle,
  CheckSquare,
  ExternalLink,
  FileText,
  Info,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourtDateGuide() {
  const { t } = useTranslation();
  useScrollToTop();

  const sections = [
    {
      id: "why-matters",
      icon: Info,
      iconClass: "text-amber-600 dark:text-amber-400",
      titleKey: "courtDateGuide.sections.whyMatters.title",
    },
    {
      id: "confirm-writing",
      icon: FileText,
      iconClass: "text-teal-600 dark:text-teal-400",
      titleKey: "courtDateGuide.sections.confirmWriting.title",
    },
    {
      id: "reminders",
      icon: Bell,
      iconClass: "text-amber-600 dark:text-amber-400",
      titleKey: "courtDateGuide.sections.reminders.title",
    },
    {
      id: "third-party",
      icon: Calendar,
      iconClass: "text-teal-600 dark:text-teal-400",
      titleKey: "courtDateGuide.sections.thirdParty.title",
    },
    {
      id: "transportation",
      icon: Car,
      iconClass: "text-amber-600 dark:text-amber-400",
      titleKey: "courtDateGuide.sections.transportation.title",
    },
    {
      id: "missed",
      icon: AlertTriangle,
      iconClass: "text-red-600 dark:text-red-400",
      titleKey: "courtDateGuide.sections.missed.title",
    },
    {
      id: "day-of",
      icon: CheckSquare,
      iconClass: "text-teal-600 dark:text-teal-400",
      titleKey: "courtDateGuide.sections.dayOf.title",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-500/5 via-background to-background border-b border-border/40">
          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-teal-500/10">
                  <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <Badge
                  variant="outline"
                  className="border-teal-400 text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/40"
                >
                  {t("courtDateGuide.badge")}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {t("courtDateGuide.title")}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {t("courtDateGuide.subtitle")}
              </p>
              <div className="mt-3">
                <Link href="/support/court-logistics" className="text-sm text-primary hover:underline">
                  {t("courtDateGuide.backToCourtLogistics")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Accordion type="multiple" defaultValue={["why-matters", "confirm-writing"]} className="space-y-3">
            {/* Section 1: Why This Matters */}
            <ScrollReveal>
              <AccordionItem value="why-matters" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-amber-500/10 shrink-0">
                      <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.whyMatters.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t("courtDateGuide.sections.whyMatters.body")}
                  </p>
                  <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                    <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                      {t("courtDateGuide.sections.whyMatters.warrantNote")}
                    </AlertDescription>
                  </Alert>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 2: Confirm in Writing */}
            <ScrollReveal>
              <AccordionItem value="confirm-writing" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-teal-500/10 shrink-0">
                      <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.confirmWriting.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t("courtDateGuide.sections.confirmWriting.intro")}
                  </p>
                  <ol className="space-y-2 mb-4">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground shrink-0">{n}.</span>
                        <span>{t(`courtDateGuide.sections.confirmWriting.step${n}`)}</span>
                      </li>
                    ))}
                  </ol>
                  <Card className="border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20">
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {t("courtDateGuide.sections.confirmWriting.saveTitle")}
                      </p>
                      <ul className="space-y-1">
                        {["caseNumber", "courtroom", "judgeName", "time"].map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-teal-500 shrink-0">-</span>
                            {t(`courtDateGuide.sections.confirmWriting.saveItems.${item}`)}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 3: Redundant Reminders */}
            <ScrollReveal>
              <AccordionItem value="reminders" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-amber-500/10 shrink-0">
                      <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.reminders.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t("courtDateGuide.sections.reminders.intro")}
                  </p>
                  <ul className="space-y-2">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-amber-500 mt-1 shrink-0">-</span>
                        {t(`courtDateGuide.sections.reminders.tip${n}`)}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 4: Third-Party Reminder Services */}
            <ScrollReveal>
              <AccordionItem value="third-party" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-teal-500/10 shrink-0">
                      <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.thirdParty.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <div className="space-y-4">
                    <Card className="border border-border/60">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">
                          <a
                            href="https://bailproject.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            {t("courtDateGuide.sections.thirdParty.bailProject.name")}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {t("courtDateGuide.sections.thirdParty.bailProject.description")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border border-border/60">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">
                          {t("courtDateGuide.sections.thirdParty.courtPortals.name")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {t("courtDateGuide.sections.thirdParty.courtPortals.description")}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border border-border/60">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold">
                          {t("courtDateGuide.sections.thirdParty.pdOffice.name")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {t("courtDateGuide.sections.thirdParty.pdOffice.description")}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 5: Transportation */}
            <ScrollReveal>
              <AccordionItem value="transportation" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-amber-500/10 shrink-0">
                      <Car className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.transportation.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <ul className="space-y-3">
                    <li>
                      <a
                        href="https://bailproject.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0 mt-0.5" />
                        {t("courtDateGuide.sections.transportation.bailProject")}
                      </a>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-1 shrink-0">-</span>
                      {t("courtDateGuide.sections.transportation.twoEleven")}
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-1 shrink-0">-</span>
                      {t("courtDateGuide.sections.transportation.pdOffice")}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 6: Missed Date */}
            <ScrollReveal>
              <AccordionItem value="missed" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-red-500/10 shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.missed.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30 mb-4">
                    <AlertDescription className="text-sm text-red-800 dark:text-red-300">
                      {t("courtDateGuide.sections.missed.warning")}
                    </AlertDescription>
                  </Alert>
                  <ul className="space-y-2">
                    {[1, 2, 3, 4].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground shrink-0">{n}.</span>
                        {t(`courtDateGuide.sections.missed.step${n}`)}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    {t("courtDateGuide.sections.missed.disclaimer")}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>

            {/* Section 7: Day of Court */}
            <ScrollReveal>
              <AccordionItem value="day-of" className="border border-border/60 rounded-lg px-0 shadow-sm">
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-1.5 rounded-md bg-teal-500/10 shrink-0">
                      <CheckSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-semibold">{t("courtDateGuide.sections.dayOf.title")}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t("courtDateGuide.sections.dayOf.intro")}
                  </p>
                  <ul className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <li key={n} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-teal-500 mt-1 shrink-0">-</span>
                        {t(`courtDateGuide.sections.dayOf.item${n}`)}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>
          </Accordion>

          {/* Related links */}
          <ScrollReveal>
            <div className="mt-10 pt-6 border-t border-border/40">
              <p className="text-sm font-semibold text-foreground mb-3">{t("courtDateGuide.relatedTitle")}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/support/court-logistics"
                  className="text-sm text-primary hover:underline"
                >
                  {t("courtDateGuide.relatedLinks.courtLogistics")}
                </Link>
                <Link
                  href="/support/transportation"
                  className="text-sm text-primary hover:underline"
                >
                  {t("courtDateGuide.relatedLinks.transportation")}
                </Link>
                <Link
                  href="/support/court-logistics/intake-form"
                  className="text-sm text-primary hover:underline"
                >
                  {t("courtDateGuide.relatedLinks.intakeForm")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </div>
  );
}
