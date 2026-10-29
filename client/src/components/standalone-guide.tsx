import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useJurisdiction } from "@/hooks/use-jurisdiction";
import { JurisdictionSelector } from "@/components/ui/jurisdiction-selector";
import { JurisdictionCallout } from "@/components/ui/jurisdiction-callout";

export function StandaloneGuide({ kind }: { kind: "bail" | "plea" }) {
  useScrollToTop();
  const { t } = useTranslation();
  const { jurisdiction, setJurisdiction } = useJurisdiction();
  const sections: Record<string, JSX.Element> = {
    "bail-what": <AccordionItem value="bail-what" id="bail-what">
                        <AccordionTrigger >{t('process.guides.bail.whatIs.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.whatIs.description')}</p>
                          <ul >
                            {(t('process.guides.bail.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-set": <AccordionItem value="bail-set" id="bail-set">
                        <AccordionTrigger >{t('process.guides.bail.howSet.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.howSet.description')}</p>
                          <ul >
                            {(t('process.guides.bail.howSet.factors', { returnObjects: true }) as string[]).map((factor, idx) => <li key={idx}>{factor}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-options": <AccordionItem value="bail-options" id="bail-options">
                        <AccordionTrigger >{t('process.guides.bail.options.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          {(t('process.guides.bail.options.types', { returnObjects: true }) as { name: string; description: string }[]).map((option, idx) => (
                            <div key={idx} >
                              <strong >{option.name}</strong>
                              <p >{option.description}</p>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>,
    "bail-afford": <AccordionItem value="bail-afford" id="bail-afford">
                        <AccordionTrigger >{t('process.guides.bail.cantAfford.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.cantAfford.description')}</p>
                          <ul >
                            {(t('process.guides.bail.cantAfford.options', { returnObjects: true }) as string[]).map((opt, idx) => <li key={idx}>{opt}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-conditions": <AccordionItem value="bail-conditions" id="bail-conditions">
                        <AccordionTrigger >{t('process.guides.bail.conditions.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.conditions.description')}</p>
                          <ul >
                            {(t('process.guides.bail.conditions.examples', { returnObjects: true }) as string[]).map((ex, idx) => <li key={idx}>{ex}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-miss": <AccordionItem value="bail-miss" id="bail-miss">
                        <AccordionTrigger >{t('process.guides.bail.missCourt.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.missCourt.description')}</p>
                          <ul >
                            {(t('process.guides.bail.missCourt.consequences', { returnObjects: true }) as string[]).map((con, idx) => <li key={idx}>{con}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-deny": <AccordionItem value="bail-deny" id="bail-deny">
                        <AccordionTrigger >{t('process.guides.bail.preventiveDetention.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.preventiveDetention.description')}</p>
                          <ul >
                            {(t('process.guides.bail.preventiveDetention.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-schedule": <AccordionItem value="bail-schedule" id="bail-schedule">
                        <AccordionTrigger >{t('process.guides.bail.schedule.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.schedule.description')}</p>
                          <ul >
                            {(t('process.guides.bail.schedule.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-landscape": <AccordionItem value="bail-landscape" id="bail-landscape">
                        <AccordionTrigger >{t('process.guides.bail.landscape.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.landscape.description')}</p>
                          <ul >
                            {(t('process.guides.bail.landscape.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "bail-risk": <AccordionItem value="bail-risk" id="bail-risk">
                        <AccordionTrigger >{t('process.guides.bail.riskAssessment.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                        <AccordionContent >
                          <p>{t('process.guides.bail.riskAssessment.description')}</p>
                          <ul >
                            {(t('process.guides.bail.riskAssessment.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>,
    "plea-what": <AccordionItem value="plea-what" id="plea-what">
                      <AccordionTrigger >{t('process.guides.plea.whatIs.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                      <AccordionContent >
                        <p>{t('process.guides.plea.whatIs.description')}</p>
                        <ul >
                          {(t('process.guides.plea.whatIs.points', { returnObjects: true }) as string[]).map((point, idx) => <li key={idx}>{point}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>,
    "plea-types": <AccordionItem value="plea-types" id="plea-types">
                      <AccordionTrigger >{t('process.guides.plea.types.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                      <AccordionContent >
                        {(t('process.guides.plea.types.deals', { returnObjects: true }) as { name: string; description: string }[]).map((deal, idx) => (
                          <div key={idx} >
                            <strong >{deal.name}</strong>
                            <p >{deal.description}</p>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>,
    "plea-rights": <AccordionItem value="plea-rights" id="plea-rights">
                      <AccordionTrigger >{t('process.guides.plea.rights.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                      <AccordionContent >
                        <p>{t('process.guides.plea.rights.description')}</p>
                        <ul >
                          {(t('process.guides.plea.rights.list', { returnObjects: true }) as string[]).map((right, idx) => <li key={idx}>{right}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>,
    "plea-collateral": <AccordionItem value="plea-collateral" id="plea-collateral">
                      <AccordionTrigger >{t('process.guides.plea.collateral.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                      <AccordionContent >
                        <p>{t('process.guides.plea.collateral.description')}</p>
                        <ul >
                          {(t('process.guides.plea.collateral.consequences', { returnObjects: true }) as string[]).map((con, idx) => <li key={idx}>{con}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>,
    "plea-decide": <AccordionItem value="plea-decide" id="plea-decide">
                      <AccordionTrigger >{t('process.guides.plea.decide.title')}<span className="guide-toggle" aria-hidden="true" /></AccordionTrigger>
                      <AccordionContent >
                        <p>{t('process.guides.plea.decide.description')}</p>
                        <div >
                          <div >
                            <strong >{t('process.guides.plea.decide.acceptTitle')}</strong>
                            <ul >
                              {(t('process.guides.plea.decide.acceptReasons', { returnObjects: true }) as string[]).map((r, idx) => <li key={idx}>{r}</li>)}
                            </ul>
                          </div>
                          <div >
                            <strong >{t('process.guides.plea.decide.trialTitle')}</strong>
                            <ul >
                              {(t('process.guides.plea.decide.trialReasons', { returnObjects: true }) as string[]).map((r, idx) => <li key={idx}>{r}</li>)}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>,
  };
  const groups = kind === "bail"
    ? [{ title: "orientation", items: ["bail-what", "bail-options", "bail-set"] }, { title: "immediate", items: ["bail-afford", "bail-conditions", "bail-miss"] }, { title: "rules", items: ["bail-deny", "bail-schedule", "bail-risk", "bail-landscape"] }]
    : [{ title: "agreement", items: ["plea-what", "plea-types", "plea-rights"] }, { title: "effects", items: ["plea-collateral", "plea-decide"] }];
  return <ScanFirstPageFrame mainClassName={`standalone-guide ${kind}-standalone`}>
    <div className="guide-width guide-back"><Link href="/case-timeline">{t("caseTimeline.title")}</Link></div>
    <header className="guide-width guide-hero">
      <div><h1>{t(`standaloneGuides.${kind}.heading`)}{" "}<span>{t(`standaloneGuides.${kind}.accent`)}</span></h1><p>{t(`standaloneGuides.${kind}.subtitle`)}</p></div>
      {kind === "bail" && <div className="guide-doorway" aria-hidden="true"><span /></div>}
    </header>
    <aside className="guide-width guide-notice"><strong>{t("process.alert.important")}</strong>{" "}{t("process.alert.text")}</aside>
    {kind === "plea" && <section className="guide-questions" id="plea-questions">
      <div className="guide-width guide-section-grid"><div><h2>{t("process.guides.plea.questions.title")}</h2><p>{t("process.guides.plea.questions.description")}</p></div>
      <ol>{(t("process.guides.plea.questions.list", { returnObjects: true }) as string[]).map((q, i) => <li key={i}>{q}</li>)}</ol></div>
    </section>}
    {groups.map((group, index) => <section className="guide-width guide-section-grid guide-section" key={group.title}>
      <h2>{t(`standaloneGuides.${group.title}`)}</h2>
      <Accordion type="multiple" defaultValue={index === 0 ? [`${kind}-what`] : []} className="guide-disclosures">
        {group.items.map(key => <div key={key}>{sections[key]}</div>)}
      </Accordion>
    </section>)}
    <section className="guide-width guide-section-grid guide-section">
      <h2>{t("standaloneGuides.context")}</h2>
      <div><p>{t(`process.guides.${kind}.intro`)}</p>
        {kind === "bail" && <div className="guide-jurisdiction"><JurisdictionSelector label={t("caseTimeline.design.state")} value={jurisdiction} onChange={setJurisdiction} /><JurisdictionCallout jurisdiction={jurisdiction} topic="bail" /></div>}
        <nav className="guide-related" aria-label={t("standaloneGuides.related")}>
          <Link href={kind === "bail" ? "/support/finances" : "/immigration-guidance"}>{t(`standaloneGuides.${kind}.support`)}</Link>
          <Link href={kind === "bail" ? "/plea-agreements" : "/bail"}>{t(`process.guides.${kind === "bail" ? "plea" : "bail"}.title`)}</Link>
          <Link href="/data-sources">{t("standaloneGuides.sources")}</Link>
        </nav>
      </div>
    </section>
    <aside className="guide-width guide-legal-warning border-l-2 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 text-amber-800 dark:text-amber-200"><strong>{t("process.legalDisclaimer.title")}</strong>{" "}{t("process.legalDisclaimer.text")}</aside>
    <section className="guide-close"><div className="guide-width"><h2>{t("standaloneGuides.help")}</h2><Link href="/legal-aid">{t("standaloneGuides.findHelp")}</Link></div></section>
  </ScanFirstPageFrame>;
}
