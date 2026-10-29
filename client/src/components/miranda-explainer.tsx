import { useState } from "react";
import { useTranslation } from "react-i18next";

/** A paced illustration, not a questionnaire or an assessment of an encounter. */
export function MirandaExplainer() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const key = "rights.design.explainer";
  return (
    <section className="rights-explainer" aria-labelledby="miranda-explainer-title">
      <h2 id="miranda-explainer-title">{t(`${key}.title`)}</h2>
      <p>{t(`${key}.intro`)}</p>
      <div className="rights-explainer-stage">
        <div className="rights-explainer-art" data-step={step} aria-hidden="true">
          <span><b>{t(`${key}.custody`)}</b></span><span><b>{t(`${key}.interrogation`)}</b></span>
        </div>
        <div className="rights-explainer-panel" aria-live="polite" aria-atomic="true">
          <p className="rights-step-count">{t(`${key}.count`, { step: step + 1, total: 4 })}</p>
          <h3>{t(`${key}.steps.${step}.title`)}</h3>
          <p>{t(`${key}.steps.${step}.body`)}</p>
        </div>
      </div>
      <div className="rights-explainer-controls">
        <button type="button" disabled={step === 0} onClick={() => setStep(n => n - 1)}>{t(`${key}.back`)}</button>
        <button type="button" disabled={step === 3} onClick={() => setStep(n => n + 1)}>{t(`${key}.next`)}</button>
        <button type="button" onClick={() => setStep(0)}>{t(`${key}.replay`)}</button>
      </div>
      <p className="rights-explainer-note">{t(`${key}.note`)}</p>
      <details className="rights-disclosure rights-transcript">
        <summary>{t(`${key}.transcript`)}</summary>
        <div className="rights-disclosure-body">{[0, 1, 2, 3].map(n => <div key={n}><h3>{t(`${key}.steps.${n}.title`)}</h3><p>{t(`${key}.steps.${n}.body`)}</p></div>)}</div>
      </details>
      <div className="rights-explainer-sources">
        <a href="https://www.law.cornell.edu/constitution-conan/amendment-5/custodial-interrogation-standard" target="_blank" rel="noopener noreferrer">{t(`${key}.source`)}</a>
        <a href="https://www.law.cornell.edu/constitution-conan/amendment-5/exceptions-to-miranda" target="_blank" rel="noopener noreferrer">{t(`${key}.exceptions`)}</a>
      </div>
    </section>
  );
}
