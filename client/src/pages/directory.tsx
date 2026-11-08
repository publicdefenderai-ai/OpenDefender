import { useRef, useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { directoryDesignCopy } from "@/locales/directory-design";

import { getNrrcResources } from "@/lib/nrrc-resources";

interface ResourceItem { title: string; description: string; link: string; }
interface CategorySection { title: string; description: string; resources: ResourceItem[]; }

export default function Directory() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const copy = directoryDesignCopy[i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en"];
  const nrrc = getNrrcResources(i18n.language);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const inventoryCategories: CategorySection[] = [
    {
      title: t("howTo.sections.getHelp.title"),
      description: t("howTo.sections.getHelp.description"),
      resources: [
        { title: t("howTo.sections.getHelp.caseGuidance.title"),       description: t("howTo.sections.getHelp.caseGuidance.description"),       link: "/case-guidance" },
        { title: t("howTo.sections.getHelp.aiChat.title"),             description: t("howTo.sections.getHelp.aiChat.description"),             link: "/chat" },
        { title: t("howTo.sections.getHelp.documentSummarizer.title"), description: t("howTo.sections.getHelp.documentSummarizer.description"), link: "/document-summarizer" },
        { title: t("howTo.sections.getHelp.letterGenerator.title"),    description: t("howTo.sections.getHelp.letterGenerator.description"),    link: "/letter-generator" },
        { title: t("howTo.sections.getHelp.first24Hours.title"),       description: t("howTo.sections.getHelp.first24Hours.description"),       link: "/first-24-hours" },
        { title: t("collateralConsequences.pageTitle"),                 description: t("collateralConsequences.pageDesc"),                       link: "/collateral-consequences" },
      ],
    },
    {
      title: t("howTo.sections.knowYourRights.title"),
      description: t("howTo.sections.knowYourRights.description"),
      resources: [
        { title: t("howTo.sections.knowYourRights.constitutionalRights.title"), description: t("howTo.sections.knowYourRights.constitutionalRights.description"), link: "/rights-info" },
        { title: t("howTo.rightToCounsel"),                                      description: t("howTo.rightToCounselDesc"),                                       link: "/right-to-counsel" },
        { title: t("howTo.warrants"),                                            description: t("howTo.warrantsDesc"),                                             link: "/warrants" },
        { title: t("howTo.sections.knowYourRights.caseTimeline.title"),         description: t("howTo.sections.knowYourRights.caseTimeline.description"),         link: "/case-timeline" },
        { title: copy.bail, description: t("standaloneGuides.bail.subtitle"), link: "/bail" },
        { title: copy.plea, description: t("standaloneGuides.plea.subtitle"), link: "/plea-agreements" },
        { title: t("howTo.sections.knowYourRights.friendsFamily.title"),        description: t("howTo.sections.knowYourRights.friendsFamily.description"),        link: "/friends-family" },
        { title: t("howTo.sections.knowYourRights.familyToolkit.title"),        description: t("howTo.sections.knowYourRights.familyToolkit.description"),        link: "/friends-family/toolkit" },
      ],
    },
    {
      title: t("howTo.sections.findResources.title"),
      description: t("howTo.sections.findResources.description"),
      resources: [
        ...nrrc.resources.map(resource => ({ ...resource, description: `${resource.description} ${nrrc.copy.note}` })),
        { title: t("howTo.sections.findResources.legalAid.title"),                description: t("howTo.sections.findResources.legalAid.description"),                link: "/legal-aid" },
        { title: t("howTo.sections.findResources.diversionPrograms.title"),       description: t("howTo.sections.findResources.diversionPrograms.description"),       link: "/diversion-programs" },
        { title: t("howTo.sections.findResources.recordExpungement.title"),       description: t("howTo.sections.findResources.recordExpungement.description"),       link: "/support/reputation" },
        { title: t("howTo.sections.findResources.recordClearanceScreener.title"), description: t("howTo.sections.findResources.recordClearanceScreener.description"), link: "/support/reputation/eligibility" },
      ],
    },
    {
      title: t("howTo.sections.lifeSupport.title"),
      description: t("howTo.sections.lifeSupport.description"),
      resources: [
        { title: t("howTo.sections.lifeSupport.supportHub.title"),      description: t("howTo.sections.lifeSupport.supportHub.description"),      link: "/support" },
        { title: t("howTo.sections.lifeSupport.employment.title"),      description: t("howTo.sections.lifeSupport.employment.description"),      link: "/support/employment" },
        { title: t("howTo.sections.lifeSupport.finances.title"),        description: t("howTo.sections.lifeSupport.finances.description"),        link: "/support/finances" },
        { title: t("howTo.sections.lifeSupport.mentalHealth.title"),    description: t("howTo.sections.lifeSupport.mentalHealth.description"),    link: "/support/mental-health" },
        { title: t("howTo.sections.lifeSupport.transportation.title"),  description: t("howTo.sections.lifeSupport.transportation.description"),  link: "/support/transportation" },
        { title: t("howTo.sections.lifeSupport.childcare.title"),       description: t("howTo.sections.lifeSupport.childcare.description"),       link: "/support/childcare" },
        { title: t("howTo.sections.lifeSupport.courtLogistics.title"),  description: t("howTo.sections.lifeSupport.courtLogistics.description"),  link: "/support/court-logistics" },
        { title: t("howTo.sections.lifeSupport.pdIntakeForm.title"),    description: t("howTo.sections.lifeSupport.pdIntakeForm.description"),    link: "/support/court-logistics/intake-form" },
        { title: t("howTo.sections.lifeSupport.courtDateGuide.title"),  description: t("howTo.sections.lifeSupport.courtDateGuide.description"),  link: "/support/court-logistics/court-date-guide" },
        { title: t("howTo.sections.lifeSupport.bailPreparation.title"), description: t("howTo.sections.lifeSupport.bailPreparation.description"), link: "/support/court-logistics/bail-preparation" },
        { title: t("howTo.housing"),                                     description: t("howTo.housingDesc"),                                      link: "/support/housing" },
        { title: t("howTo.familyCare"),                                  description: t("howTo.familyCareDesc"),                                   link: "/support/family-care" },
        { title: t("howTo.personalHealth"),                              description: t("howTo.personalHealthDesc"),                               link: "/support/personal-health" },
        { title: t("howTo.reputation"),                                  description: t("howTo.reputationDesc"),                                   link: "/support/reputation" },
        { title: t("howTo.reentry"),                                     description: t("howTo.reentryDesc"),                                      link: "/support/reentry" },
      ],
    },
    {
      title: t("howTo.sections.immigration.title"),
      description: t("howTo.sections.immigration.description"),
      resources: [
        { title: t("howTo.sections.immigration.overview.title"),        description: t("howTo.sections.immigration.overview.description"),        link: "/immigration-guidance" },
        { title: t("howTo.sections.immigration.knowYourRights.title"),  description: t("howTo.sections.immigration.knowYourRights.description"),  link: "/immigration-guidance/know-your-rights" },
        { title: t("howTo.sections.immigration.findAttorney.title"),    description: t("howTo.sections.immigration.findAttorney.description"),    link: "/immigration-guidance/find-attorney" },
        { title: t("howTo.sections.immigration.findDetained.title"),    description: t("howTo.sections.immigration.findDetained.description"),    link: "/immigration-guidance/find-detained" },
        { title: t("howTo.sections.immigration.afterDeportation.title"), description: t("howTo.sections.immigration.afterDeportation.description"), link: "/immigration-guidance/after-deportation" },
        { title: t("howTo.sections.immigration.workplaceRaids.title"),  description: t("howTo.sections.immigration.workplaceRaids.description"),  link: "/immigration-guidance/workplace-raids" },
        { title: t("howTo.sections.immigration.raidsToolkit.title"),    description: t("howTo.sections.immigration.raidsToolkit.description"),    link: "/immigration-guidance/raids-toolkit" },
        { title: t("howTo.sections.immigration.bondHearings.title"),    description: t("howTo.sections.immigration.bondHearings.description"),    link: "/immigration-guidance/bond-hearings" },
        { title: t("howTo.sections.immigration.dacaTps.title"),         description: t("howTo.sections.immigration.dacaTps.description"),         link: "/immigration-guidance/daca-tps" },
        { title: t("howTo.sections.immigration.familyPlanning.title"),  description: t("howTo.sections.immigration.familyPlanning.description"),  link: "/immigration-guidance/family-planning" },
      ],
    },
    {
      title: t("howTo.sections.reference.title"),
      description: t("howTo.sections.reference.description"),
      resources: [
        { title: t("howTo.sections.reference.legalGlossary.title"),  description: t("howTo.sections.reference.legalGlossary.description"),  link: "/legal-glossary" },
        { title: t("howTo.sections.reference.courtLocator.title"),   description: t("howTo.sections.reference.courtLocator.description"),   link: "/court-locator" },
        { title: t("howTo.sections.reference.documentLibrary.title"), description: t("howTo.sections.reference.documentLibrary.description"), link: "/document-library" },
        { title: t("howTo.sections.reference.howItWorks.title"),     description: t("howTo.sections.reference.howItWorks.description"),     link: "/how-to" },
        { title: t("howTo.sections.reference.dataSources.title"),    description: t("howTo.sections.reference.dataSources.description"),    link: "/data-sources" },
      ],
    },
    {
      title: t("howTo.sections.attorneyTools.title"),
      description: t("howTo.sections.attorneyTools.description"),
      resources: [
        { title: t("howTo.sections.reference.statuteLookup.title"),         description: t("howTo.sections.reference.statuteLookup.description"),         link: "/statutes" },
        { title: t("howTo.sections.attorneyTools.courtRecords.title"),      description: t("howTo.sections.attorneyTools.courtRecords.description"),      link: "/court-records" },
        { title: t("howTo.sections.attorneyTools.forAdvocates.title"),      description: t("howTo.sections.attorneyTools.forAdvocates.description"),      link: "/for-advocates" },
        { title: t("howTo.sections.attorneyTools.mitigationBuilder.title"), description: t("howTo.sections.attorneyTools.mitigationBuilder.description"), link: "/for-advocates/mitigation-builder" },
        { title: t("howTo.sections.attorneyTools.intakeChecklist.title"),   description: t("howTo.sections.attorneyTools.intakeChecklist.description"),   link: "/for-advocates/intake-checklist" },
      ],
    },
  ];

  const total = inventoryCategories.reduce((n, cat) => n + cat.resources.length, 0);
  const term = query.trim().toLocaleLowerCase(i18n.language);
  const groups = inventoryCategories.map((cat, index) => ({ ...cat, index, resources: cat.resources.filter(resource =>
    `${resource.title} ${resource.description} ${cat.title}`.toLocaleLowerCase(i18n.language).includes(term)
  ) })).filter(cat => (category === -1 || cat.index === category) && cat.resources.length > 0);
  const found = groups.reduce((n, cat) => n + cat.resources.length, 0);
  const number = (n: number) => new Intl.NumberFormat(i18n.language).format(n);
  function reset() { setQuery(""); setCategory(-1); searchRef.current?.focus(); }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="resource-directory" data-testid="resource-directory">
        <section className="directory-hero" aria-labelledby="directory-heading">
          <div>
            <p className="text-sm text-muted-foreground">{t("directory.hero.title")}</p>
            <h1 id="directory-heading">{copy.heading}<br /><em>{copy.accent}</em></h1>
            <p>{t("directory.hero.subtitle")}</p>
            <Link className="directory-help" href="/how-to">{copy.help}</Link>
          </div>
          <aside className="directory-volume" aria-label={copy.size}>
            <strong>{number(total)}</strong>
            <p>{copy.listings}</p>
            <small>{copy.areas.replace("{count}", number(inventoryCategories.length))}</small>
          </aside>
        </section>
        <div className="directory-search" role="search">
          <label htmlFor="directory-query">{copy.search}</label>
          <div><input id="directory-query" type="search" ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} autoComplete="off" placeholder={copy.placeholder} /><button onClick={reset}>{copy.clear}</button></div>
        </div>
        <nav className="directory-categories" aria-label={copy.categories}>
          {[{title:copy.all, count:total, index:-1}, ...inventoryCategories.map((cat,index)=>({title:cat.title,count:cat.resources.length,index}))].map(cat=>(
            <button key={cat.index} data-category={cat.index} aria-pressed={category===cat.index} aria-controls="directory-results" onClick={()=>setCategory(cat.index)}>
              <span aria-hidden="true">{number(cat.count)}</span>{cat.title}
            </button>
          ))}
        </nav>
        <p className="directory-count" role="status">{copy.results.replace("{count}",number(found)).replace("{total}",number(total))}</p>
        <div id="directory-results">
          {groups.map(cat=>(<section className="directory-group" key={cat.index} aria-labelledby={`directory-category-${cat.index}`}>
            <h2 id={`directory-category-${cat.index}`}>{cat.title}<span>{number(cat.resources.length)}</span></h2>
            <p>{cat.description}</p>
            {cat.resources.map(resource=>{ const ResourceLink = resource.link.startsWith("https://") ? "a" : Link; return <ResourceLink className="directory-resource" key={resource.link} href={resource.link} {...(resource.link.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <h3>{resource.title}</h3><p>{resource.description}</p>
            </ResourceLink>; })}
          </section>))}
          {found===0 && <div className="directory-empty"><h2>{copy.empty}</h2><p>{copy.emptyHint}</p><button onClick={reset}>{copy.reset}</button></div>}
        </div>
      </div>
      <Footer />
    </div>
  );
}
