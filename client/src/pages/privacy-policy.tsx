import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./policy-document.css";
import "./privacy-policy.css";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { privacySupplementCopy } from "./privacy-supplement-copy";

const ANTHROPIC_COMMERCIAL_TERMS_URL = "https://www.anthropic.com/legal/commercial-terms";

export default function PrivacyPolicy() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = privacySupplementCopy[language];

  const sections = [
    {
      id: "principles",
      title: t('privacyPolicy.principles.title'),
      body: (
        <>
          <h3>
            {t('privacyPolicy.principles.noPersonalData.title')}
          </h3>
          <p>
            {t('privacyPolicy.principles.noPersonalData.description')}
          </p>
          <h3>
            {t('privacyPolicy.principles.anonymizedData.title')}
          </h3>
          <p>
            {t('privacyPolicy.principles.anonymizedData.description')}
          </p>
          <ul>
            <li>{t('privacyPolicy.principles.anonymizedData.usage.metrics')}</li>
            <li>{t('privacyPolicy.principles.anonymizedData.usage.improvements')}</li>
            <li>{t('privacyPolicy.principles.anonymizedData.usage.integrations')}</li>
          </ul>
          <h3>
            {t('privacyPolicy.principles.noSharing.title')}
          </h3>
          <p>
            {t('privacyPolicy.principles.noSharing.description')}
          </p>
        </>
      ),
    },
    {
      id: "case-data",
      title: t('privacyPolicy.caseData.title', 'How We Protect Your Case Information'),
      body: (
        <>
          <p>
            {t('privacyPolicy.caseData.summary', 'When you use our legal guidance tool, your case information receives multiple layers of protection. Here\'s exactly what happens to your data:')}
          </p>
          <h3>
            {t('privacyPolicy.caseData.memoryOnly.title', 'Memory-Only Storage')}
          </h3>
          <p>
            {t('privacyPolicy.caseData.memoryOnly.description', 'Case inputs are held in temporary server memory rather than a persistent case database and generally expire within 24 hours or on service restart.')}
          </p>
          <h3>
            {t('privacyPolicy.caseData.piiRedaction.title', 'Automated Redaction Safeguard')}
          </h3>
          <p>
            {t('privacyPolicy.caseData.piiRedaction.description', 'Before AI processing, we attempt to redact common identifiers. Automated redaction may miss sensitive details, and AI inputs are processed by Anthropic.')}
          </p>
          <h3>
            {t('privacyPolicy.caseData.autoDelete.title', 'Automatic 24-Hour Deletion')}
          </h3>
          <p>
            {t('privacyPolicy.caseData.autoDelete.description', 'Case and feedback records generally expire from server memory within 24 hours. Some consent, audit, security, and provider records follow separate disclosed retention periods.')}
          </p>
          <h3>
            {t('privacyPolicy.caseData.serverRestart.title', 'Cleared on Server Restart')}
          </h3>
          <p>
            {t('privacyPolicy.caseData.serverRestart.description', 'A service restart clears OpenDefender case records held in that process. Provider logs and some operational records can follow separate retention periods.')}
          </p>
        </>
      ),
    },
    {
      id: "document-privacy",
      title: t('privacyPolicy.documentSummarizer.title', 'Document Summarizer Privacy'),
      body: (
        <>
          <p>
            {t('privacyPolicy.documentSummarizer.summary', 'The Document Summarizer sends extracted document text to Anthropic for summaries and question answering. The safeguards and limits below apply.')}
          </p>
          <h3>
            {t('privacyPolicy.documentSummarizer.noStorage.title', 'Temporary Document Processing')}
          </h3>
          <p>
            {t('privacyPolicy.documentSummarizer.noStorage.description', 'Uploaded document bytes and extracted text are processed in temporary server memory rather than saved to a persistent document database.')}
          </p>
          <h3>
            {t('privacyPolicy.documentSummarizer.summaryNotStored.title', 'Your Copy Remains Under Your Control')}
          </h3>
          <p>
            {t('privacyPolicy.documentSummarizer.summaryNotStored.description', 'OpenDefender does not create a permanent document or summary library. Copies you download, print, or save remain on your device or with services you choose.')}
          </p>
          <h3>
            {t('privacyPolicy.documentSummarizer.aiProcessing.title', 'AI Processing by Anthropic')}
          </h3>
          <p>
            {t('privacyPolicy.documentSummarizer.aiProcessing.description', 'Document text and questions are sent to Anthropic. Automated redaction may miss sensitive details, and Anthropic may retain API data for up to 30 days under its standard terms.')}
          </p>
          <h3>
            {t('privacyPolicy.documentSummarizer.supportedFiles.title', 'What You Can Upload')}
          </h3>
          <p>
            {t('privacyPolicy.documentSummarizer.supportedFiles.description', 'We support PDF, DOCX, TXT, and image files (PNG, JPEG) up to 10MB. For your privacy, we recommend removing any unnecessary personal information from documents before uploading.')}
          </p>
        </>
      ),
    },
    {
      id: "government-requests",
      title: copy.government.title,
      body: (
        <>
          <p>{copy.government.body}</p>
        </>
      ),
    },
    {
      id: "privilege",
      title: copy.privilege.title,
      body: (
        <>
          <p>{copy.privilege.body}</p>
        </>
      ),
    },
    {
      id: "ai-use",
      title: copy.aiUse.title,
      body: (
        <>
          <p>
            {copy.aiUse.intro}
          </p>
          <ul>
            {copy.aiUse.bullets.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p>
            {copy.aiUse.callout}
          </p>
        </>
      ),
    },
    {
      id: "technical-details",
      title: t('privacyPolicy.technical.title'),
      body: (
        <>
          <h3>
            {t('privacyPolicy.technical.sessions.title')}
          </h3>
          <p>
            {t('privacyPolicy.technical.sessions.description')}
          </p>
          <h3>
            {t('privacyPolicy.technical.logs.title')}
          </h3>
          <p>
            {t('privacyPolicy.technical.logs.description')}
          </p>
          <h3>
            {t('privacyPolicy.technical.external.title')}
          </h3>
          <p>
            {t('privacyPolicy.technical.external.description')}
          </p>
          <ul>
            <li>
              {t('privacyPolicy.technical.external.services.anthropic')}
              <a
                href={ANTHROPIC_COMMERCIAL_TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('privacyPolicy.technical.external.services.anthropicTermsLink')}
              </a>
              {t('privacyPolicy.technical.external.services.anthropicTermsSuffix')}
            </li>
            <li>{t('privacyPolicy.technical.external.services.govInfo')}</li>
            <li>{t('privacyPolicy.technical.external.services.courtListener')}</li>
            <li>{t('privacyPolicy.technical.external.services.recap')}</li>
            <li>{t('privacyPolicy.technical.external.services.cornell')}</li>
            <li>{t('privacyPolicy.technical.external.services.openLaws')}</li>
            <li>{t('privacyPolicy.technical.external.services.legiScan')}</li>
            <li>{t('privacyPolicy.technical.external.services.bjs')}</li>
            <li>{t('privacyPolicy.technical.external.services.lsc')}</li>
            <li>{t('privacyPolicy.technical.external.services.eoir')}</li>
            <li>{t('privacyPolicy.technical.external.services.nominatim')}</li>
          </ul>
          <p>
            {t('privacyPolicy.technical.external.note')}
          </p>
          <h3>
            {t('privacyPolicy.technical.captcha.title')}
          </h3>
          <p>
            {t('privacyPolicy.technical.captcha.description')}
          </p>
        </>
      ),
    },
    {
      id: "public-api",
      title: copy.api.title,
      body: (
        <>
          <p>{copy.api.body}</p>
        </>
      ),
    },
    {
      id: "privacy-rights",
      title: t('privacyPolicy.rights.title'),
      body: (
        <>
          <p>
            {t('privacyPolicy.rights.description')}
          </p>
          <ul>
            <li>{t('privacyPolicy.rights.list.noDataStored')}</li>
            <li>{t('privacyPolicy.rights.list.sessionControl')}</li>
            <li>{t('privacyPolicy.rights.list.noTracking')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "policy-changes",
      title: t('privacyPolicy.changes.title'),
      body: (
        <>
          <p>
            {t('privacyPolicy.changes.description')}
          </p>
        </>
      ),
    },
    {
      id: "ai-data-inventory",
      title: copy.inventory.title,
      body: (
        <>
          <p>{copy.inventory.subtitle}</p>
          <table aria-label={copy.inventory.title} role="table">
            <thead role="rowgroup">
              <tr role="row">
                {copy.inventory.headers.map(header => <th key={header} scope="col" role="columnheader">{header}</th>)}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {copy.inventory.rows.map(([feature, sent, retention]) => (
                <tr key={feature} role="row">
                  <th scope="row" role="rowheader">{feature}</th>
                  <td role="cell"><span aria-hidden="true">{copy.inventory.headers[1]}</span>{sent}</td>
                  <td role="cell"><span aria-hidden="true">{copy.inventory.headers[2]}</span>{retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            {copy.inventory.termsBeforeLink}
            <a
              href={ANTHROPIC_COMMERCIAL_TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {copy.inventory.termsLink}
            </a>
            {copy.inventory.termsAfterLink}
          </p>
        </>
      ),
    },
    {
      id: "privacy-contact",
      title: t('privacyPolicy.contact.title'),
      body: (
        <>
          <p>
            {t('privacyPolicy.contact.description')}
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <article className="privacy-reader policy-document" data-skip-content tabIndex={-1}>
        <header>
          <h1>{t("privacyPolicy.hero.title")}</h1>
          <p>{t("privacyPolicy.hero.subtitle")}</p>
          <small>{t("privacyPolicy.hero.lastUpdated")}</small>
        </header>
        <details className="policy-index">
          <summary>{t("privacyPolicy.reader.contents", { count: sections.length })}<span aria-hidden="true" /></summary>
          <nav aria-label={t("privacyPolicy.reader.index")}>
            {sections.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}
          </nav>
        </details>
        {sections.map(({ id, title, body }) => (
          <section key={id} aria-labelledby={id}>
            <h2 id={id} tabIndex={-1}>{title}</h2>
            {body}
          </section>
        ))}
        <div className="policy-related">
          <Link href="/disclaimers">{t("disclaimers.hero.title")}</Link>
          <Link href="/data-sources">{t("privacyPolicy.reader.sources")}</Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
