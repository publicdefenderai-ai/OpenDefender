import { Image } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const paths = [
  { id: 1, pill: "first24", href: "/first-24-hours" },
  { id: 2, pill: "caseGuidance", href: "/case-guidance" },
  { id: 3, pill: "lifeSupport", href: "/support" },
  { id: 4, pill: "immigration", href: "/immigration-guidance" },
  { id: 5, pill: "familySupport", href: "/friends-family" },
];

function Journey({ family = false }: { family?: boolean }) {
  const { t } = useTranslation();
  const key = family ? "howTo.familyNote" : "howTo.flow";
  const id = family ? "how-to-family" : "how-to-journey";
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="how-journey">
      <p className="how-label">{t(`${key}.label`)}</p>
      <h2 id={`${id}-title`}>{t(`${key}.title`)}</h2>
      <p>{t(`${key}.subtitle`)}</p>
      <ol className="how-story">
        {Array.from({ length: family ? 2 : 4 }, (_, i) => i + 1).map(step => (
          <li key={step}>
            <span className="how-time">{t(`${key}.step${step}.time`)}</span>
            <div>
              <p className="how-label">{t(`${key}.step${step}.path`)}</p>
              <h3>{t(`${key}.step${step}.action`)}</h3>
              <p>{t(`${key}.step${step}.detail`)}</p>
            </div>
          </li>
        ))}
      </ol>
      {family && <Link className="how-link" href="/friends-family">{t("howTo.paths.path5.cta")}</Link>}
    </section>
  );
}

export default function HowTo() {
  useScrollToTop();
  const { t } = useTranslation();
  return (
    <ScanFirstPageFrame mainClassName="how-page">
      <div className="how-width">
        <header className="how-intro">
          <p className="how-label">{t("design.how")}</p>
          <h1>{t("howTo.design.title")}</h1>
          <p>{t("howTo.hero.subtitle")}</p>
          <Link href="/directory" className="how-link">{t("howTo.inventory.title")}</Link>
        </header>
        <nav aria-label={t("howTo.hero.title")} className="how-nav">
          {paths.map(path => <a key={path.id} href={`#path-${path.id}`}>{t(`howTo.hero.pills.${path.pill}`)}</a>)}
        </nav>
        <section id="how-to-paths" aria-label={t("howTo.hero.title")}>
          {paths.map(path => {
            const key = `howTo.paths.path${path.id}`;
            return (
              <article id={`path-${path.id}`} key={path.id} aria-labelledby={`path-${path.id}-title`} className="how-path" tabIndex={-1}>
                <span className="how-number" aria-hidden="true">{String(path.id).padStart(2, "0")}</span>
                <div className="how-path-copy">
                  <p className="how-label">{t(`${key}.badge`)}</p>
                  <h2 id={`path-${path.id}-title`}>{t(`${key}.headline`)}</h2>
                  <p>{t(`${key}.subhead`)}</p>
                  <ul>{[1, 2, 3, 4].map(n => <li key={n}>{t(`${key}.bullet${n}`)}</li>)}</ul>
                  <Link href={path.href} className="how-link">{t(`${key}.cta`)}</Link>
                </div>
                {/* Replace with current page captures after the remaining designs are final. */}
                <figure className="how-shot">
                  <Image size={32} strokeWidth={1.25} aria-hidden="true" />
                  <figcaption>{t(`${key}.headline`)}<small>{t("howTo.design.screenshot")}</small></figcaption>
                </figure>
              </article>
            );
          })}
        </section>
      </div>
      <div className="how-journey-band">
        <div className="how-width how-journey-pair"><Journey /><Journey family /></div>
      </div>
      <section className="how-width how-directory">
        <h2>{t("howTo.inventory.title")}</h2>
        <p>{t("howTo.inventory.subtitle")}</p>
        <Link className="how-link" href="/directory">{t("howTo.inventory.title")}</Link>
      </section>
    </ScanFirstPageFrame>
  );
}
