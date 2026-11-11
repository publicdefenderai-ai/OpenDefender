import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { personalHealthDesignCopy } from "@/locales/personal-health-design";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ResourcePageTemplate,
  ActionItem,
  ExternalResource,
  FAQ,
} from "@/components/support/resource-page-template";
function TreatmentMessages() {
  const { t, i18n } = useTranslation();
  const prefix = "support.personalHealth.treatmentConnection";
  const messages = [
    { title: t(`${prefix}.scriptTitle`), label: t(`${prefix}.scriptTitle`), body: t(`${prefix}.scriptBody`) },
    { title: t(`${prefix}.letterTitle`), label: t(`${prefix}.letterLabel`), body: t(`${prefix}.letterBody`) },
    { title: t(`${prefix}.attorneyTitle`), label: t(`${prefix}.attorneyLabel`), body: t(`${prefix}.attorneyBody`) },
  ];
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const message = messages[index];
  const body = drafts[index] ?? message.body;

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
    } catch {
      const field = document.getElementById("health-message") as HTMLTextAreaElement;
      field.focus();
      field.select();
    }
  }

  function print() {
    const popup = window.open("", "_blank");
    if (!popup) return;
    const doc = popup.document;
    doc.documentElement.lang = i18n.language;
    doc.title = message.label;
    const style = doc.createElement("style");
    style.textContent = "body { max-width: 42rem; margin: 2rem auto; padding: 1rem; font: 12pt/1.6 Arial, sans-serif; } h1 { font-size: 16pt; } p { white-space: pre-wrap; overflow-wrap: anywhere; }";
    doc.head.append(style);
    const heading = doc.createElement("h1");
    heading.textContent = message.label;
    const text = doc.createElement("p");
    text.textContent = body;
    doc.body.append(heading, text);
    popup.print();
  }

  const locale = i18n.language.split("-")[0];
  const copyText = personalHealthDesignCopy[locale as keyof typeof personalHealthDesignCopy] ?? personalHealthDesignCopy.en;
  return (
    <section className="personal-health-section" id="health-messages">
      <h2>{copyText.messages}</h2>
      <div className="personal-health-editor">
        <label htmlFor="health-template">{copyText.choose}</label>
        <select id="health-template" value={index} onChange={event => { setIndex(Number(event.target.value)); setCopied(false); }}>
          {messages.map((item, value) => <option key={value} value={value}>{item.title}</option>)}
        </select>
        <label htmlFor="health-message">{message.label}</label>
        <textarea id="health-message" rows={10} value={body} onChange={event => {
          setDrafts({ ...drafts, [index]: event.target.value });
          setCopied(false);
        }} />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={copy}>{t(`${prefix}.${copied ? "copied" : "copyButton"}`)}</Button>
          <Button variant="outline" onClick={print}>{t(`${prefix}.printButton`)}</Button>
        </div>
      </div>
    </section>
  );
}

function CareSections() {
  const { t, i18n } = useTranslation();
  const med = "support.personalHealth.medicationSection";
  const care = "support.personalHealth.treatmentConnection";
  const items = t(`${care}.checklistItems`, { returnObjects: true }) as string[];
  const questions = t(`${care}.angerQuestions`, { returnObjects: true }) as string[];
  return (
    <>
      <section className="personal-health-section">
        <div><h2>{t(`${med}.title`)}</h2><p>{t(`${med}.description`)}</p></div>
        <ol className="personal-health-steps">{["step1", "step2", "step3"].map(step =>
          <li key={step}><h3>{t(`${med}.${step}.title`)}</h3><p>{t(`${med}.${step}.body`)}</p></li>
        )}</ol>
      </section>
      <section className="personal-health-section" id="treatment-connection">
        <div><h2>{t(`${care}.sectionTitle`)}</h2><p>{t(`${care}.sectionSubtitle`)}</p></div>
        <div className="personal-health-reading">
          <h3>{t(`${care}.whyTitle`)}</h3><p>{t(`${care}.whyBody`)}</p>
          <fieldset><legend>{t(`${care}.checklistTitle`)}</legend>
            {items.map((item, index) => <label key={index}><input type="checkbox" />{item}</label>)}
          </fieldset>
          <h3>{t(`${care}.findTitle`)}</h3>
          <a href="https://findtreatment.gov/">{t(`${care}.findSamhsaLabel`)}</a>
          <p>{t(`${care}.findSamhsa`)}</p><p>{t(`${care}.findSamhsaNote`)}</p>
          <a href="tel:211">211</a><p>{t(`${care}.find211`)}</p>
          <p>{t(`${care}.findAttorney`)}</p><aside>{t(`${care}.findCourt`)}</aside>
          <h3>{t(`${care}.angerTitle`)}</h3><p>{t(`${care}.angerBody`)}</p>
          <strong>{t(`${care}.angerQuestionsLabel`)}</strong>
          <ul className="list-disc pl-5">{questions.map(question => <li key={question}>{question}</li>)}</ul>
        </div>
      </section>
      <TreatmentMessages key={i18n.language} />
    </>
  );
}

export default function PersonalHealthSupport() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split("-")[0];
  const copy = personalHealthDesignCopy[lang as keyof typeof personalHealthDesignCopy] ?? personalHealthDesignCopy.en;

  const startHereItems: ActionItem[] = [
    {
      id: "list-medications",
      title: t('support.personalHealth.actions.listMedications.title'),
      description: t('support.personalHealth.actions.listMedications.description'),
      priority: "high",
      timeframe: t('support.personalHealth.actions.listMedications.timeframe'),
    },
    {
      id: "contact-doctor",
      title: t('support.personalHealth.actions.contactDoctor.title'),
      description: t('support.personalHealth.actions.contactDoctor.description'),
      priority: "high",
      timeframe: t('support.personalHealth.actions.contactDoctor.timeframe'),
    },
    {
      id: "notify-jail-health",
      title: t('support.personalHealth.actions.notifyJailHealth.title'),
      description: t('support.personalHealth.actions.notifyJailHealth.description'),
      priority: "high",
    },
    {
      id: "get-refills",
      title: t('support.personalHealth.actions.getRefills.title'),
      description: t('support.personalHealth.actions.getRefills.description'),
      priority: "medium",
      timeframe: t('support.personalHealth.actions.getRefills.timeframe'),
    },
    {
      id: "substance-support",
      title: t('support.personalHealth.actions.substanceSupport.title'),
      description: t('support.personalHealth.actions.substanceSupport.description'),
      priority: "medium",
    },
    {
      id: "medication-storage",
      title: t('support.personalHealth.actions.medicationStorage.title'),
      description: t('support.personalHealth.actions.medicationStorage.description'),
      priority: "medium",
    },
    {
      id: "emergency-phone",
      title: t('support.personalHealth.actions.emergencyPhone.title'),
      description: t('support.personalHealth.actions.emergencyPhone.description'),
      priority: "low",
    },
  ];

  const externalResources: ExternalResource[] = [
    {
      name: t('support.personalHealth.resources.lifeline.name'),
      description: t('support.personalHealth.resources.lifeline.description'),
      url: "https://www.lifelinesupport.org/",
      phone: "1-800-234-9473",
      type: "national",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.samhsa.name'),
      description: t('support.personalHealth.resources.samhsa.description'),
      url: "https://www.samhsa.gov/find-help/national-helpline",
      phone: "1-800-662-4357",
      type: "national",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.partnership.name'),
      description: t('support.personalHealth.resources.partnership.description'),
      url: "https://drugfree.org/help/",
      phone: "1-855-378-4373",
      type: "national",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.smartRecovery.name'),
      description: t('support.personalHealth.resources.smartRecovery.description'),
      url: "https://www.smartrecovery.org/",
      type: "online",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.nar.name'),
      description: t('support.personalHealth.resources.nar.description'),
      url: "https://www.nar-anon.org/",
      type: "national",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.nami.name'),
      description: t('support.personalHealth.resources.nami.description'),
      url: "https://www.nami.org/",
      phone: "1-800-950-6264",
      type: "national",
      free: true,
    },
    {
      name: t('support.personalHealth.resources.goodRx.name'),
      description: t('support.personalHealth.resources.goodRx.description'),
      url: "https://www.goodrx.com/",
      type: "online",
      free: true,
    },
  ];

  const faqs: FAQ[] = [
    {
      question: t('support.personalHealth.faq.q1.question'),
      answer: t('support.personalHealth.faq.q1.answer'),
    },
    {
      question: t('support.personalHealth.faq.q2.question'),
      answer: t('support.personalHealth.faq.q2.answer'),
    },
    {
      question: t('support.personalHealth.faq.q3.question'),
      answer: t('support.personalHealth.faq.q3.answer'),
    },
    {
      question: t('support.personalHealth.faq.q4.question'),
      answer: t('support.personalHealth.faq.q4.answer'),
    },
  ];

  const tips: string[] = [
    t('support.personalHealth.tips.tip1'),
    t('support.personalHealth.tips.tip2'),
    t('support.personalHealth.tips.tip3'),
    t('support.personalHealth.tips.tip4'),
    t('support.personalHealth.tips.tip5'),
  ];

  return (
    <ResourcePageTemplate
      categoryId="personalHealth"
      mainClassName="personal-health-page"
      actionHeading={copy.plan}
      introduction={<>
        <Link href="/support">{t("support.backToSupport")}</Link>
        <section className="personal-health-hero">
          <div>
            <h1><small>{t("legalGuidance.qaFlow.additionalDetails.concernsCategories.personalHealth.label")}</small>{copy.title}<br /><em>{copy.accent}</em></h1>
            <p>{t("support.personalHealth.overview")}</p>
            <nav aria-label={t("support.startHere")}>
              <a data-testid="button-start-here" href="#section-start-here">{copy.plan}</a>
              <a href="#health-messages">{copy.messages}</a>
            </nav>
          </div>
          <img src="/images/design/personal-health.svg" width="240" height="220" alt="" aria-hidden="true" />
        </section>
      </>}
      icon={Activity}
      iconColor="bg-green-500/10 text-green-600 dark:text-green-400"
      heroGradient="bg-gradient-to-br from-green-500/5 via-background to-background"
      overview={t('support.personalHealth.overview')}
      startHereItems={startHereItems}
      externalResources={externalResources}
      faqs={faqs}
      tips={tips}
      customSections={<CareSections />}
      relatedLinks={[
        { label: t('support.relatedLinks.mentalHealth'), href: "/support/mental-health" },
        { label: t('support.relatedLinks.finances'), href: "/support/finances" },
      ]}
    />
  );
}
