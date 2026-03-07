import { useState } from "react";
import { useTranslation } from "react-i18next";
import financesHero from "@assets/stock_images/finances.jpg";
import { DollarSign, CheckCircle, CheckCircle2, Calendar, ExternalLink } from "lucide-react";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCourtFeesForState, courtFeesByState, ALL_STATE_CODES, NATIONAL_ASSISTANCE_ORGS } from "@shared/court-fees-data";

const FEE_TYPE_IDS = ["filing", "probation", "publicDefender", "restitution", "labFees", "surcharges"] as const;

function CourtFeesSection() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('');
  const feeData = selectedState ? getCourtFeesForState(selectedState) : null;

  return (
    <section className="py-10 md:py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6 max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
            {t('support.finances.courtFees.sectionTitle')}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="max-w-3xl mx-auto space-y-8">

          {/* 1. Types of court fees — Accordion */}
          <Accordion type="single" collapsible>
            {FEE_TYPE_IDS.map(id => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger>{t(`support.finances.courtFees.types.${id}.title`)}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    {t(`support.finances.courtFees.types.${id}.description`)}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1 italic">
                    {t(`support.finances.courtFees.types.${id}.note`)}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* 2. State selector */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t('support.finances.courtFees.stateSelector.label')}
            </label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder={t('support.finances.courtFees.stateSelector.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATE_CODES.map(code => (
                  <SelectItem key={code} value={code}>{courtFeesByState[code].stateName}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {feeData && (
              <Card className="mt-4 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold mb-3">{feeData.stateName} — Typical Court Costs</h4>
                  <div className="divide-y divide-border text-sm mb-4">
                    {([
                      ['Court filing fee', feeData.filingFee],
                      ['Probation supervision', feeData.probationFee],
                      ['Public defender fee', feeData.publicDefenderFee],
                      ['Fines', feeData.fineRange],
                      ['Surcharges / assessments', feeData.surcharges],
                    ] as [string, string][]).map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right ml-4">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm mb-4">
                    <p className="font-medium mb-1">Fee Waiver in {feeData.stateName}</p>
                    <p className="text-muted-foreground">
                      Form: <strong>{feeData.waiverForm}</strong> · Threshold: {feeData.waiverIncome}
                    </p>
                  </div>
                  {feeData.assistanceOrgs.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {feeData.stateName} Assistance Programs
                      </p>
                      {feeData.assistanceOrgs.map(org => (
                        <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
                           className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-400 hover:underline">
                          <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span><strong>{org.name}</strong> — {org.description}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {t('support.finances.courtFees.stateSelector.disclaimer')}
            </p>
          </div>

          {/* 3. Fee waivers + payment plans — 2-column cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  {t('support.finances.courtFees.waiver.title')}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('support.finances.courtFees.waiver.description')}
                </p>
                <ol className="space-y-1.5">
                  {(t('support.finances.courtFees.waiver.steps', { returnObjects: true }) as string[])
                    .map((step, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-muted-foreground font-medium">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  {t('support.finances.courtFees.paymentPlan.title')}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('support.finances.courtFees.paymentPlan.description')}
                </p>
                <ul className="space-y-1.5">
                  {(t('support.finances.courtFees.paymentPlan.tips', { returnObjects: true }) as string[])
                    .map((tip, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 4. National assistance orgs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              National Resources
            </p>
            <div className="space-y-3">
              {NATIONAL_ASSISTANCE_ORGS.map(org => (
                <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
                   className="flex items-start gap-2 text-sm hover:underline">
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span><strong>{org.name}</strong> — {org.description}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function FinancesSupport() {
  const { t } = useTranslation();

  const startHereItems: ActionItem[] = [
    {
      id: "assess-costs",
      title: t('support.finances.actions.assessCosts.title'),
      description: t('support.finances.actions.assessCosts.description'),
      priority: "high",
      timeframe: t('support.finances.actions.assessCosts.timeframe'),
    },
    {
      id: "explore-pd",
      title: t('support.finances.actions.explorePD.title'),
      description: t('support.finances.actions.explorePD.description'),
      priority: "high",
      timeframe: t('support.finances.actions.explorePD.timeframe'),
    },
    {
      id: "fee-waiver",
      title: t('support.finances.actions.feeWaiver.title'),
      description: t('support.finances.actions.feeWaiver.description'),
      priority: "medium",
    },
    {
      id: "payment-plan",
      title: t('support.finances.actions.paymentPlan.title'),
      description: t('support.finances.actions.paymentPlan.description'),
      priority: "medium",
    },
    {
      id: "emergency-aid",
      title: t('support.finances.actions.emergencyAid.title'),
      description: t('support.finances.actions.emergencyAid.description'),
      priority: "medium",
    },
    {
      id: "income-loss",
      title: t('support.finances.actions.incomeLoss.title'),
      description: t('support.finances.actions.incomeLoss.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: "FindLaw Free Legal Aid Directory",
      description: t('support.finances.resources.findLaw.description'),
      url: "https://www.findlaw.com/",
      type: "national",
      free: true,
    },
    {
      name: "LawHelp.org",
      description: t('support.finances.resources.lawHelp.description'),
      url: "https://www.lawhelp.org/",
      type: "national",
      free: true,
    },
    {
      name: "Benefits.gov",
      description: t('support.finances.resources.benefits.description'),
      url: "https://www.benefits.gov/",
      type: "national",
      free: true,
    },
    {
      name: "211 United Way",
      description: t('support.finances.resources.unitedWay.description'),
      url: "https://www.211.org/",
      phone: "211",
      type: "local",
      free: true,
    },
    {
      name: "Modest Means Program (State Bar)",
      description: t('support.finances.resources.modestMeans.description'),
      url: "https://www.americanbar.org/groups/probono_public_service/resources/directory_of_law_school_public_interest_pro_bono_programs/",
      type: "state",
      free: false,
    },
    {
      name: "Consumer Financial Protection Bureau (CFPB)",
      description: t('support.finances.resources.cfpb.description'),
      url: "https://www.consumerfinance.gov/",
      type: "national",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.finances.faq.q1.question'),
      answer: t('support.finances.faq.q1.answer'),
    },
    {
      question: t('support.finances.faq.q2.question'),
      answer: t('support.finances.faq.q2.answer'),
    },
    {
      question: t('support.finances.faq.q3.question'),
      answer: t('support.finances.faq.q3.answer'),
    },
    {
      question: t('support.finances.faq.q4.question'),
      answer: t('support.finances.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.finances.tips.tip1'),
    t('support.finances.tips.tip2'),
    t('support.finances.tips.tip3'),
    t('support.finances.tips.tip4'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="finances"
      heroImage={financesHero}
      icon={DollarSign}
      iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
      heroGradient="bg-gradient-to-br from-green-500/5 via-background to-background"
      overview={t('support.finances.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      relatedLinks={[
        { label: t('support.relatedLinks.employment'), href: "/support/employment" },
        { label: t('support.relatedLinks.publicDefender'), href: "/resources" },
      ]}
      customSections={<CourtFeesSection />}
    />
  );
}
