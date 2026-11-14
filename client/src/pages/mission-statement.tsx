import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import "./mission-statement.css";

const goals = ["expandAccess", "supportDefenders", "empowerDecisions", "increaseFairness"] as const;

export default function MissionStatement() {
  useScrollToTop();
  const { t } = useTranslation();
  return (
    <>
      <Header />
      <article className="mission-page" data-skip-content tabIndex={-1}>
        <header className="mission-hero">
          <div>
            <p>{t("missionStatement.hero.title")}</p>
            <h1>{t("missionStatement.reader.title")} <span>{t("missionStatement.reader.accent")}</span></h1>
            <p>{t("missionStatement.reader.intro")}</p>
          </div>
          <div className="mission-book" aria-hidden="true"><span /></div>
        </header>
        <p className="mission-promise">{t("missionStatement.publicGood.text")}</p>
        <section className="mission-section">
          <h2>{t("missionStatement.philosophy.title")}</h2>
          <div><p>{t("missionStatement.hero.subtitle1")}</p><p>{t("missionStatement.hero.subtitle2")}</p></div>
        </section>
        <p className="mission-statement">{t("missionStatement.philosophy.opening")}</p>
        <section className="mission-section">
          <h2>{t("missionStatement.reader.technology")}</h2>
          <p>{t("missionStatement.philosophy.body")}</p>
        </section>
        <section className="mission-section">
          <h2>{t("missionStatement.goals.title")}</h2>
          <ol>{goals.map(goal => (
            <li key={goal}>
              <h3>{t(`missionStatement.goals.${goal}.title`)}</h3>
              <p>{t(`missionStatement.goals.${goal}.description`)}</p>
            </li>
          ))}</ol>
        </section>
        <section className="mission-section">
          <h2>{t("missionStatement.principles.title")}</h2>
          <div>
            <p>{t("missionStatement.principles.description")}</p>
            <div className="mission-links">
              <Link href="/privacy-policy">{t("missionStatement.reader.privacy")}</Link>
              <Link href="/data-sources">{t("missionStatement.reader.sources")}</Link>
            </div>
          </div>
        </section>
        <section className="mission-section">
          <h2>{t("missionStatement.reader.role")}</h2>
          <div className="mission-role">
            <p>{t("missionStatement.principles.disclaimer")}</p>
            <Link href="/disclaimers">{t("missionStatement.reader.notice")}</Link>
          </div>
        </section>
        <section className="mission-close">
          <h2>{t("missionStatement.reader.explore")}</h2>
          <Link href="/directory">{t("missionStatement.reader.directory")}</Link>
        </section>
      </article>
      <Footer />
    </>
  );
}
