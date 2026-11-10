import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { PageSectionNav, ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import type { ResourcePageProps } from "./resource-page-template";
import { childcareDesignCopy } from "@/locales/childcare-design";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export function ChildcareDesignFrame({overview, startHereItems, externalResources, faqs, tips, relatedLinks, customSections}: ResourcePageProps) {
 useScrollToTop();
 const {t, i18n}=useTranslation();
 const copy=childcareDesignCopy[i18n.language.startsWith('es')?'es':i18n.language.startsWith('zh')?'zh':'en'];
 return <ScanFirstPageFrame mainClassName="childcare-page">
  <Link className="childcare-back" href="/support">{t('support.backToSupport')}</Link>
  <section className="childcare-hero"><div><h1>{copy.heading}<br/><em>{copy.accent}</em></h1><p>{overview}</p></div>
   <img src="/images/design/childcare.svg" alt="" aria-hidden="true" width="240" height="220"/>
  </section>
  <PageSectionNav ariaLabel={t('support.pageSections')} items={[
   {id:'section-start-here',label:t('support.startHere')},{id:'section-resources',label:t('support.helpfulResources')},{id:'section-faq',label:t('support.faqs')},{id:'section-tips',label:t('support.tips.title')}
  ]}/>
  <section id="section-start-here" className="childcare-section"><h2>{copy.actions}</h2><div className="childcare-grid">
   {startHereItems.map(item=><article className="childcare-row" key={item.id}><div className="childcare-row-heading"><h3>{item.title}</h3>{item.priority&&<span className={`childcare-priority childcare-priority-${item.priority}`}>{t(`support.priority.${item.priority}`)}</span>}{item.timeframe&&<span>{item.timeframe}</span>}</div><p>{item.description}</p>{item.url&&<a href={item.url}>{t('support.visitWebsite')}</a>}</article>)}
  </div></section>
  {customSections}
  <section id="section-resources" className="childcare-section"><h2>{t('support.helpfulResources')}</h2><div className="childcare-grid">
   {externalResources.map(resource=><article className="childcare-row" key={resource.url}><h3 lang="en"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a></h3><p>{resource.description}</p><div className="childcare-resource-meta">{resource.free&&<span>{t('support.free')}</span>}<span>{t(`support.resourceType.${resource.type}`)}</span>{resource.phone&&<a href={`tel:${resource.phone}`}>{resource.phone}</a>}</div></article>)}
  </div></section>
  <section id="section-faq" className="childcare-section"><h2>{t('support.faq.title')}</h2>{faqs?.map(faq=><details className="childcare-faq" key={faq.question}><summary>{faq.question}<span aria-hidden="true"/></summary><p>{faq.answer}</p></details>)}</section>
  <section id="section-tips" className="childcare-section"><h2>{t('support.tips.title')}</h2><ul className="childcare-tips">{tips?.map(tip=><li key={tip}>{tip}</li>)}</ul></section>
  <nav className="childcare-related" aria-label={t('support.relatedResources')}>{relatedLinks?.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
  <p className="childcare-disclaimer">{t('support.disclaimer')}</p>
 </ScanFirstPageFrame>;
}
