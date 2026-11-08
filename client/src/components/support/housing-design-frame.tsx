import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { PageSectionNav, ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import type { ResourcePageProps } from "./resource-page-template";
import { housingDesignCopy } from "@/locales/housing-design";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import type { ReactNode } from "react";

export function HousingDesignFrame({overview, startHereItems, externalResources, faqs, tips, relatedLinks, customSections, urgentSection}: ResourcePageProps & {urgentSection: ReactNode}) {
 useScrollToTop();
 const {t, i18n}=useTranslation();
 const copy=housingDesignCopy[i18n.language.startsWith('es')?'es':i18n.language.startsWith('zh')?'zh':'en'];
 return <ScanFirstPageFrame mainClassName="housing-page">
  <Link className="housing-back" href="/support">{t('support.backToSupport')}</Link>
  <section className="housing-hero"><div><h1>{copy.heading}<br/><em>{copy.accent}</em></h1><p>{overview}</p></div>
   <picture><source media="(min-width: 701px)" srcSet="/images/design/housing.webp"/><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" aria-hidden="true" width="640" height="565"/></picture>
  </section>
  <nav className="housing-paths" aria-label={t('support.startHere')}>
   {[["section-start-here",copy.renters,copy.rentersHint],["housing-homeowner",copy.owners,copy.ownersHint],["housing-urgent",copy.urgent,copy.urgentHint]].map(([id,title,hint])=><a href={`#${id}`} key={id}><strong>{title}</strong><span>{hint}</span></a>)}
  </nav>
  <PageSectionNav ariaLabel={t('support.pageSections')} items={[
   {id:'section-start-here',label:t('support.startHere')},{id:'section-resources',label:t('support.helpfulResources')},{id:'section-faq',label:t('support.faqs')},{id:'section-tips',label:t('support.tips.title')}
  ]}/>
  {urgentSection}
  <section id="section-start-here" className="housing-section"><h2>{copy.renters}</h2><div className="housing-grid">
   {startHereItems.map(item=><article className="housing-row" key={item.id}><div className="housing-row-heading"><h3>{item.title}</h3>{item.priority&&<span className={`housing-priority housing-priority-${item.priority}`}>{t(`support.priority.${item.priority}`)}</span>}{item.timeframe&&<span>{item.timeframe}</span>}</div><p>{item.description}</p>{item.url&&<a href={item.url}>{t('support.visitWebsite')}</a>}</article>)}
  </div></section>
  {customSections}
  <section id="section-resources" className="housing-section"><h2>{t('support.helpfulResources')}</h2><div className="housing-grid">
   {externalResources.map(resource=><article className="housing-row" key={resource.url}><h3 lang="en"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a></h3><p>{resource.description}</p><div className="housing-resource-meta">{resource.free&&<span>{t('support.free')}</span>}<span>{t(`support.resourceType.${resource.type}`)}</span>{resource.phone&&<a href={`tel:${resource.phone}`}>{resource.phone}</a>}</div></article>)}
  </div></section>
  <section id="section-faq" className="housing-section"><h2>{t('support.faq.title')}</h2>{faqs?.map(faq=><details className="housing-faq" key={faq.question}><summary>{faq.question}<span aria-hidden="true"/></summary><p>{faq.answer}</p></details>)}</section>
  <section id="section-tips" className="housing-section"><h2>{t('support.tips.title')}</h2><ul className="housing-tips">{tips?.map(tip=><li key={tip}>{tip}</li>)}</ul></section>
  <nav className="housing-related" aria-label={t('support.relatedResources')}>{relatedLinks?.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
  <p className="housing-disclaimer">{t('support.disclaimer')}</p>
 </ScanFirstPageFrame>;
}
