import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { immigrationSituationsCopy } from '@/locales/immigration-situations';

const guides = [["find-detained", "findDetainedCard"], ["workplace-raids", "raidsCard"], ["bond-hearings", "bondCard"], ["family-planning", "familyCard"], ["know-your-rights", "kyrCard"], ["raids-toolkit", "raidsToolkitCard"], ["daca-tps", "dacaCard"], ["find-attorney", "attorneyCard"], ["after-deportation", null]] as const;

export function ImmigrationSituations() {
  const { t, i18n } = useTranslation();
  const copy = immigrationSituationsCopy[i18n.language.startsWith('es') ? 'es' : i18n.language.startsWith('zh') ? 'zh' : 'en'];
  const [selected, setSelected] = useState(0);
  const readerHeading = useRef<HTMLHeadingElement>(null);
  const choices = useRef<(HTMLButtonElement | null)[]>([]);
  const title = (index: number) => t(guides[index][1] ? `immigration.hub.detailedGuides.${guides[index][1]}.title` : 'header.dropdown.immigration.afterDeportation');
  const description = (index: number) => t(guides[index][1] ? `immigration.hub.detailedGuides.${guides[index][1]}.description` : 'header.dropdown.immigration.afterDeportationDesc');
  function choose(index: number) {
    setSelected(index);
    // The reader is below the collection on small screens. Move focus with the
    // deliberate selection so the result is available without searching for it.
    requestAnimationFrame(() => readerHeading.current?.focus());
  }
  return (
    <section id="detailed-guides" className="immigration-situations" aria-labelledby="situations-title">
      <div className="situations-intro">
        <div>
          <p className="situations-context">{t('immigration.hub.detailedGuides.title')}</p>
          <h2 id="situations-title" data-testid="text-detailed-guides-title">{copy.title1}<span>{copy.title2}</span></h2>
          <p>{copy.intro}</p>
          <a className="situations-text-link" href="#rapid-response">{copy.urgent}</a>
        </div>
        <div className="situations-art" aria-hidden="true"><span /><span /><span /></div>
      </div>
      <div className="situations-choose"><h3>{copy.choose}</h3><p>{copy.hint}</p></div>
      <div className="situations-collection" role="group" aria-label={copy.choose}>
        {copy.groups.map((group, groupIndex) => (
          <section className="situations-group" key={groupIndex} aria-labelledby={`situation-group-${groupIndex}`}>
            <h4 id={`situation-group-${groupIndex}`}>{group}</h4>
            {guides.slice(groupIndex * 3, groupIndex * 3 + 3).map(([slug], offset) => {
              const index = groupIndex * 3 + offset;
              return <button key={slug} type="button" ref={node => { choices.current[index] = node; }}
                id={`situation-choice-${slug}`} data-testid={`link-${slug}`}
                aria-pressed={selected === index} aria-controls="situation-reader" onClick={() => choose(index)}>
                <span className="situations-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{title(index)}</strong><small>{description(index)}</small></span>
                <span className="situations-marker" aria-hidden="true">{selected === index ? '−' : '+'}</span>
              </button>;
            })}
          </section>
        ))}
      </div>
      <section id="situation-reader" className="situations-reader" aria-labelledby="situation-reader-title">
        <p className="situations-context">{copy.selected}</p>
        <h3 id="situation-reader-title" ref={readerHeading} tabIndex={-1}>{title(selected)}</h3>
        <p>{description(selected)}</p>
        <div className="situations-reader-body">
          <div><h4>{copy.inside}</h4><p>{copy.note}</p></div>
          <ul>{copy.topics[selected].map(topic => <li key={topic}>{topic}</li>)}</ul>
        </div>
        <div className="situations-actions">
          <Link className="situations-text-link" data-testid="open-situation-guide" href={`/immigration-guidance/${guides[selected][0]}`}>{copy.open}</Link>
          <button type="button" onClick={() => choices.current[selected]?.focus()}>{copy.back}</button>
        </div>
      </section>
    </section>
  );
}
