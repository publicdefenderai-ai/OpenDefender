import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import "./disclaimers.css";

export default function Disclaimers() {
  useScrollToTop();
  const { t } = useTranslation();
  const sections = [
    {
      id: "about-project",
      title: t("disclaimers.aboutProject.title"),
      body: (
        <>
          <p>
            {t('disclaimers.aboutProject.p1')}
          </p>
          <p>
            {t('disclaimers.aboutProject.p2')}
          </p>
        </>
      ),
    },
    {
      id: "not-legal-advice",
      title: t("disclaimers.notLegalAdvice.title"),
      body: (
        <>
          <p>
            {t('disclaimers.notLegalAdvice.body')}
          </p>
        </>
      ),
    },
    {
      id: "no-guarantees",
      title: t("disclaimers.noGuarantees.title"),
      body: (
        <>
          <p>
            {t('disclaimers.noGuarantees.body')}
          </p>
        </>
      ),
    },
    {
      id: "updates-availability",
      title: t("disclaimers.updatesAvailability.title"),
      body: (
        <>
          <p>
            {t('disclaimers.updatesAvailability.body')}
          </p>
        </>
      ),
    },
    {
      id: "limitation-of-liability",
      title: t("disclaimers.limitationOfLiability.title"),
      body: (
        <>
          <p>
            {t('disclaimers.limitationOfLiability.body')}
          </p>
        </>
      ),
    },
    {
      id: "ai-disclosure",
      title: t("disclaimers.aiDisclosure.title"),
      body: (
        <>
          <p>
            {t('disclaimers.aiDisclosure.p1')}
          </p>
          <p>
            {t('disclaimers.aiDisclosure.p2')}
          </p>
          <p>
            {t('disclaimers.aiDisclosure.p3')}
          </p>
          <p>
            {t('disclaimers.aiDisclosure.p4')}
          </p>
          <p>
            {t('disclaimers.aiDisclosure.p5')}
          </p>
          <p>
            {t('disclaimers.aiDisclosure.p6_pre')}{' '}
            <Link href="/privacy-policy">
              {t('footer.privacyPolicy')}
            </Link>{' '}
            {t('disclaimers.aiDisclosure.p6_post')}
          </p>
        </>
      ),
    },
    {
      id: "screening-tools",
      title: t("disclaimers.screeningTools.title"),
      body: (
        <>
          <p>
            {t('disclaimers.screeningTools.p1')}
          </p>
          <p>
            {t('disclaimers.screeningTools.p2')}
          </p>
          <p>
            {t('disclaimers.screeningTools.p3')}
          </p>
          <p>
            {t('disclaimers.screeningTools.p4')}
          </p>
          <p>
            {t('disclaimers.screeningTools.p5')}
          </p>
        </>
      ),
    },
    {
      id: "immigration-guidance",
      title: t("disclaimers.immigrationGuidance.title"),
      body: (
        <>
          <p>
            {t('disclaimers.immigrationGuidance.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.immigrationGuidance.item1')}</li>
            <li>{t('disclaimers.immigrationGuidance.item2')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "multilingual-content",
      title: t("disclaimers.multilingualContent.title"),
      body: (
        <>
          <p>
            {t('disclaimers.multilingualContent.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.multilingualContent.item1')}</li>
            <li>{t('disclaimers.multilingualContent.item2')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "document-summarizer",
      title: t("disclaimers.documentSummarizer.title"),
      body: (
        <>
          <p>
            {t('disclaimers.documentSummarizer.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.documentSummarizer.item1')}</li>
            <li>{t('disclaimers.documentSummarizer.item2')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "court-records",
      title: t("disclaimers.courtRecords.title"),
      body: (
        <>
          <p>
            {t('disclaimers.courtRecords.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.courtRecords.item1')}</li>
            <li>{t('disclaimers.courtRecords.item2')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "legal-data-sources",
      title: t("disclaimers.legalDataSources.title"),
      body: (
        <>
          <p>
            {t('disclaimers.legalDataSources.intro')}
          </p>
          <ul>
            <li>
              <strong>OpenLaws:</strong> {t('disclaimers.legalDataSources.openlaws')}
            </li>
            <li>
              <strong>GovInfo.gov (GPO):</strong> {t('disclaimers.legalDataSources.govinfo')}
            </li>
            <li>
              <strong>CourtListener / RECAP Archive:</strong> {t('disclaimers.legalDataSources.courtlistener')}
            </li>
            <li>
              <strong>LOCUS-v1 (LocalLaws / UC Berkeley):</strong>{" "}
              {t('disclaimers.legalDataSources.locusDesc')}{" "}
              <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.
              Dataset:{" "}
              <a
                href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                target="_blank"
                rel="noopener noreferrer"
              >
                huggingface.co/datasets/LocalLaws/LOCUS-v1
              </a>.{" "}
              {t('disclaimers.legalDataSources.locusLicensed')}{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC-BY-NC-4.0
              </a>.
            </li>
            <li>
              <strong>Bureau of Justice Statistics (BJS):</strong> {t('disclaimers.legalDataSources.bjs')}
            </li>
            <li>
              <strong>LegiScan:</strong> {t('disclaimers.legalDataSources.legiscan')}
            </li>
          </ul>
          <p>
            {t('disclaimers.legalDataSources.footer')}
          </p>
        </>
      ),
    },
    {
      id: "attorney-tools",
      title: t("disclaimers.attorneyTools.title"),
      body: (
        <>
          <p>
            {t('disclaimers.attorneyTools.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.attorneyTools.item1')}</li>
            <li>{t('disclaimers.attorneyTools.item2')}</li>
            <li>{t('disclaimers.attorneyTools.item3')}</li>
          </ul>
        </>
      ),
    },
    {
      id: "public-api",
      title: t("disclaimers.publicApi.title"),
      body: (
        <>
          <p>
            {t('disclaimers.publicApi.intro')}
          </p>
          <ul>
            <li>{t('disclaimers.publicApi.item1')}</li>
            <li>{t('disclaimers.publicApi.item2')}</li>
            <li>{t('disclaimers.publicApi.item3')}</li>
            <li>{t('disclaimers.publicApi.item4')}</li>
            <li>{t('disclaimers.publicApi.item5')}</li>
          </ul>
          <p>
            {t('disclaimers.publicApi.footer')}
          </p>
        </>
      ),
    },
    {
      id: "third-party-tools",
      title: t("disclaimers.thirdPartyTools.title"),
      body: (
        <>
          <p>
            {t('disclaimers.thirdPartyTools.bodyPre')}{" "}
            <Link href="/privacy-policy">
              {t('disclaimers.thirdPartyTools.bodyLink')}
            </Link>{" "}
            {t('disclaimers.thirdPartyTools.bodyPost')}
          </p>
        </>
      ),
    },
    {
      id: "open-source-licensing",
      title: t("disclaimers.openSourceLicensing.title"),
      body: (
        <>
          <p>
            {t('disclaimers.openSourceLicensing.intro')}
          </p>
          <ul>
            <li><strong>{t('disclaimers.openSourceLicensing.codeLicenseLabel')}</strong> {t('disclaimers.openSourceLicensing.codeLicenseBody')}</li>
            <li><strong>{t('disclaimers.openSourceLicensing.contentLicenseLabel')}</strong> {t('disclaimers.openSourceLicensing.contentLicenseBody')}</li>
          </ul>
          <p>
            {t('disclaimers.openSourceLicensing.githubPre')}{" "}
            <a
              href="https://github.com/publicdefenderai-ai/OpenDefender"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('disclaimers.openSourceLicensing.githubLink')}
            </a>{t('disclaimers.openSourceLicensing.githubPost')}
          </p>
        </>
      ),
    },
    {
      id: "trademark",
      title: t("disclaimers.trademark.title"),
      body: (
        <>
          <p>
            {t('disclaimers.trademark.body')}
          </p>
        </>
      ),
    },
    {
      id: "no-endorsement",
      title: t("disclaimers.noEndorsement.title"),
      body: (
        <>
          <p>
            {t('disclaimers.noEndorsement.body')}
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <Header />
      <article className="notice-page" data-skip-content tabIndex={-1}>
        <header>
          <h1>{t("disclaimers.hero.title")}</h1>
          <p>{t("disclaimers.hero.subtitle")}</p>
          <small>{t("disclaimers.hero.lastUpdated")}</small>
        </header>
        <details className="notice-contents">
          <summary>{t("disclaimers.reader.contents", { count: sections.length })}<span aria-hidden="true" /></summary>
          <nav aria-label={t("disclaimers.reader.index")}>
            {sections.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}
          </nav>
        </details>
        {sections.map(({ id, title, body }) => (
          <section key={id}>
            <h2 id={id} tabIndex={-1}>{title}</h2>
            {body}
          </section>
        ))}
        <aside>
          <strong>{t("disclaimers.acknowledgement.label")}</strong>{" "}
          {t("disclaimers.acknowledgement.body")}
        </aside>
        <div className="notice-related">
          <Link href="/privacy-policy">{t("footer.privacyPolicy")}</Link>
          <Link href="/data-sources">{t("disclaimers.reader.sources")}</Link>
        </div>
      </article>
      <Footer />
    </>
  );
}
