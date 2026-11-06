import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { PageSectionNav, ScanFirstPageFrame } from '@/components/layout/scan-first-page-frame';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { supportHubDesignCopy } from '@/locales/support-hub-design';

const destinations: Record<string,string> = {
 employment:'/support/employment', finances:'/support/finances', housing:'/support/housing',
 transportation:'/support/transportation', childcare:'/support/childcare',
 courtLogistics:'/support/court-logistics', reputation:'/support/reputation', diversionPrograms:'/diversion-programs',
 immigration:'/immigration-guidance', reentry:'/support/reentry', mentalHealth:'/support/mental-health',
 personalHealth:'/support/personal-health', familyCare:'/support/family-care',
};
const groups = [
 {id:'support-daily', key:'dailyLife', description:'daily', topics:['housing','employment','finances','transportation','childcare']},
 {id:'support-care', key:'health', description:'care', topics:['mentalHealth','personalHealth','familyCare']},
 {id:'support-court', key:'legalCourt', description:'court', topics:['courtLogistics','reputation','diversionPrograms','immigration','reentry']},
] as const;

export default function SupportHub() {
 useScrollToTop();
 const {t,i18n}=useTranslation();
 const copy=supportHubDesignCopy[i18n.language.startsWith('es')?'es':i18n.language.startsWith('zh')?'zh':'en'];
 return <ScanFirstPageFrame mainClassName="support-hub">
  <Link className="support-home" href="/">{t('common.backToHome')}</Link>
  <section className="support-hero">
   <div><p className="support-label">{t('support.title')}</p>
    <h1>{copy.heading}<br/><em>{copy.accent}</em></h1>
    <p>{t('support.description')}</p>
    <Link className="support-action" href="/friends-family">{copy.family}</Link>
   </div>
   <picture className="support-art"><source media="(min-width: 701px)" srcSet="/images/design/support-oak.webp"/><img className="support-oak" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" aria-hidden="true" width="640" height="640"/></picture>
  </section>
  <PageSectionNav ariaLabel={t('support.pageSections')} items={[
   {id:'support-start',label:t('support.startHereCard.heading')},
   {id:'support-topics',label:t('support.topicDirectory')},
   {id:'support-screener',label:t('support.screenerCallout.heading')},
   {id:'support-partners',label:t('support.partners')},
  ]}/>
  <section id="support-start" className="support-local">
   <div><h2>{t('support.startHereCard.heading')}</h2>
    <p>{t('support.startHereCard.calloutDesc')}</p>
    <p className="support-eligibility"><Info size={16} aria-hidden="true"/>{t('support.startHereCard.eligibilityNote')}</p>
   </div>
   <a className="support-action" href="tel:211">{t('support.startHereCard.callout')}</a>
  </section>
  <section id="support-topics" aria-label={t('support.topicDirectory')}>
   <nav className="support-jumps" aria-label={t('support.topicDirectory')}>
    {groups.map(group=><a key={group.id} href={`#${group.id}`} onClick={()=>requestAnimationFrame(()=>document.getElementById(group.id)?.scrollIntoView({block:'start'}))}>{t(`support.groups.${group.key}`)}</a>)}
   </nav>
   {groups.map((group,index)=><div key={group.id}>
    {index===2&&<section id="support-screener" className="support-impact">
     <AlertTriangle size={24} aria-hidden="true"/>
     <div><h2>{t('support.screenerCallout.heading')}</h2><p>{t('support.screenerCallout.body')}</p>
     <Link className="support-action" href="/collateral-consequences">{copy.explore}</Link></div>
    </section>}
    <section id={group.id} className="support-group">
     <div><h2>{t(`support.groups.${group.key}`)}</h2><p>{copy[group.description]}</p></div>
     <ul>{group.topics.map(id=><li key={id}><Link className="support-resource" href={destinations[id]}>
      <span><h3>{t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.label`)}</h3>
      <span>{t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.description`)}</span></span>
      <ChevronRight size={20} aria-hidden="true"/>
     </Link></li>)}</ul>
    </section>
   </div>)}
  </section>
  <section id="support-partners" className="support-bottom">
   <div lang="en"><h2>Partners for Justice</h2><p>A national nonprofit that embeds trained advocates inside public defender offices, helping clients connect with housing, employment, health care, and other services as part of their legal representation — operating in 20+ states and connecting over 29,000 people with services.</p>
    <a className="support-action" href="https://www.partnersforjustice.org/" target="_blank" rel="noopener noreferrer">partnersforjustice.org</a>
   </div>
   <div><h2>{copy.more}</h2><p>{copy.inventory}</p><Link className="support-action" href="/directory">{copy.directory}</Link></div>
  </section>
 </ScanFirstPageFrame>;
}
