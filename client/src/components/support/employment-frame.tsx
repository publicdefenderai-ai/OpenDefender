import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { PageSectionNav, ScanFirstPageFrame } from '@/components/layout/scan-first-page-frame';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import type { ResourcePageProps } from './resource-page-template';
import { employmentDesignCopy } from '@/locales/employment-design';

export function EmploymentFrame({overview,startHereItems,externalResources,faqs,tips,relatedLinks,customSections}:Pick<ResourcePageProps,'overview'|'startHereItems'|'externalResources'|'faqs'|'tips'|'relatedLinks'|'customSections'>){
 useScrollToTop();const {t,i18n}=useTranslation();
 const copy=employmentDesignCopy[i18n.language.startsWith('es')?'es':i18n.language.startsWith('zh')?'zh':'en'];
 return <ScanFirstPageFrame mainClassName="employment-page">
  <Link className="employment-back" href="/support">{t('support.backToSupport')}</Link>
  <section className="employment-hero"><div>
   <p>{t('legalGuidance.qaFlow.additionalDetails.concernsCategories.employment.label')}</p>
   <h1>{copy.heading}<br/><em>{copy.accent}</em></h1><p>{overview}</p>
   <a className="employment-action" href="#court-time-off">{copy.templates}</a>
   <a className="employment-action" data-testid="button-start-here" href="#section-start-here">{t('support.nextStep')}</a>
  </div><img src="/images/design/employment.svg" alt="" aria-hidden="true" width="240" height="220"/></section>
  <PageSectionNav ariaLabel={t('support.pageSections')} items={[
   {id:'section-start-here',label:t('support.startHere')},{id:'section-resources',label:t('support.helpfulResources')},
   {id:'section-faq',label:t('support.faqs')},{id:'section-tips',label:t('support.tips.title')},
  ]}/>
  <section id="section-start-here" className="employment-section"><h2>{t('support.startHere')}</h2>
   <div className="employment-actions">{startHereItems.map(item=><article key={item.id}>
    <p className={`employment-priority employment-priority-${item.priority}`}>
     {item.priority&&t(`support.priority.${item.priority}`)}{item.timeframe&&` · ${item.timeframe}`}</p>
    <h3>{item.title}</h3><p>{item.description}</p>
   </article>)}</div>
  </section>
  {customSections}
  <section id="section-resources" className="employment-section"><h2>{t('support.helpfulResources')}</h2>
   <div className="employment-resources">{externalResources.map(resource=><article key={resource.url}>
    <h3 lang="en"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name}</a></h3>
    <p className="employment-meta">{resource.free&&`${t('support.free')} · `}{t(`support.resourceType.${resource.type}`)}</p>
    <p lang={resource.name==='Partners for Justice'?'en':undefined}>{resource.description}</p>
    <div className="employment-resource-links"><a href={resource.url} target="_blank" rel="noopener noreferrer">{t('support.visitWebsite')}</a>
    {resource.phone&&<a href={`tel:${resource.phone}`}>{resource.phone}</a>}</div>
   </article>)}</div>
  </section>
  <section id="section-faq" className="employment-section"><h2>{t('support.faq.title')}</h2>
   {faqs?.map(faq=><details key={faq.question}><summary>{faq.question}<span aria-hidden="true"/></summary><p>{faq.answer}</p></details>)}
  </section>
  <section id="section-tips" className="employment-section"><h2>{t('support.tips.title')}</h2><ul>{tips?.map(tip=><li key={tip}>{tip}</li>)}</ul></section>
  <section className="employment-section"><h2>{t('support.relatedResources')}</h2><div className="employment-resource-links">{relatedLinks?.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</div></section>
  <p className="employment-disclaimer">{t('support.disclaimer')}</p>
 </ScanFirstPageFrame>;
}
