import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { ClickToCall } from "@/components/ui/click-to-call";
import { Button } from "@/components/ui/button";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { searchCourthouses, type CourtLocation } from "@/lib/court-services";

const federalFinder = "https://www.uscourts.gov/federal-court-finder/find";

function CourtRow({ court }: { court: CourtLocation }) {
  const { t } = useTranslation();
  const directions = new URL("https://maps.google.com/maps");
  directions.searchParams.set("daddr", `${court.lat},${court.lng}`);
  return (
    <li className="locator-result">
      <div>
        <h4>{court.name}</h4>
        <p>{t(`courtLocator.courtTypes.${court.type}`)} · {t("courtLocator.courtCard.milesAway", { distance: court.distance })}</p>
        {court.county && <p>{t("courtLocator.courtCard.county", { county: court.county })}</p>}
      </div>
      <div>
        {court.address && <p>{court.address}</p>}
        {court.hours && <p>{t("courtLocator.courtCard.hours")}: {court.hours}</p>}
        {court.services.length > 0 && <p>{t("courtLocator.courtCard.services")}: {court.services.join(", ")}</p>}
        <div className="locator-links">
          <a href={directions.href} target="_blank" rel="noopener noreferrer" data-testid={`button-directions-${court.id}`}>{t("courtLocator.courtCard.directions")}</a>
          {court.website && <a href={court.website} target="_blank" rel="noopener noreferrer" data-testid={`button-website-${court.id}`}>{t("courtLocator.design.website")}</a>}
          {court.phone && <ClickToCall phoneNumber={court.phone} size="sm" variant="link" data-testid={`button-call-${court.id}`} />}
        </div>
      </div>
    </li>
  );
}

export default function CourtLocator() {
  useScrollToTop();
  const { t } = useTranslation();
  const [zip, setZip] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [courts, setCourts] = useState<CourtLocation[]>([]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (zip.length !== 5 || status === "loading") return;
    setStatus("loading");
    try {
      setCourts(await searchCourthouses(zip));
      setStatus("success");
    } catch {
      setCourts([]);
      setStatus("error");
    }
  }

  const groups = [
    { label: "courtLocator.design.nearby", rows: courts.filter(c => c.type !== "federal" && c.type !== "bankruptcy") },
    { label: "courtLocator.sections.federalTitle", rows: courts.filter(c => c.type === "federal" || c.type === "bankruptcy") },
  ];

  return (
    <ScanFirstPageFrame mainClassName="locator-page">
      <h1>{t("courtLocator.hero.title")}</h1>
      <p className="locator-intro">{t("courtLocator.hero.subtitle")}</p>
      <form onSubmit={submit} className="locator-search">
        <label htmlFor="locator-postal">{t("courtLocator.design.zip")}</label>
        <div>
          <input id="locator-postal" autoComplete="postal-code" inputMode="numeric" maxLength={5}
            value={zip} disabled={status === "loading"} placeholder={t("courtLocator.search.inputPlaceholder")}
            data-testid="input-zip-code" onChange={event => {
              setZip(event.target.value.replace(/\D/g, "").slice(0, 5));
              setStatus("idle");
            }} />
          <Button type="submit" disabled={zip.length !== 5 || status === "loading"} data-testid="button-search-courts">
            {t(status === "loading" ? "courtLocator.search.searching" : "courtLocator.search.searchButton")}
          </Button>
        </div>
      </form>
      <p className="locator-notice">{t("courtLocator.design.notice")}</p>
      <p role="status">{status === "loading" && t("courtLocator.search.searching")}
        {status === "success" && (courts.length ? t("courtLocator.results.foundCourts", { count: courts.length, plural: courts.length === 1 ? "" : "s" })
          : t("courtLocator.results.noCourts") + ". " + t("courtLocator.results.tryDifferent"))}</p>
      {status === "error" && <p role="alert">{t("courtLocator.design.unavailable")}</p>}
      {status === "success" && courts.length > 0 && <section className="locator-section">
        <h2>{t("courtLocator.results.title")}</h2>
        {groups.filter(group => group.rows.length).map(group => <div key={group.label}>
          <h3>{t(group.label, { count: group.rows.length })}</h3>
          <ul>{group.rows.map(court => <CourtRow key={court.id} court={court} />)}</ul>
        </div>)}
      </section>}
      <section className="locator-section">
        <h2>{t("courtLocator.design.before")}</h2>
        {["courtTypesCard", "courtHoursCard", "dataSourcesCard"].map(key => <details key={key}>
          <summary>{t(`courtLocator.courtInformation.${key}.title`)}</summary>
          <p>{t(`courtLocator.courtInformation.${key}.description`)}</p>
        </details>)}
        <div className="locator-links">
          <a href={federalFinder}>{t("courtLocator.design.federal")}</a>
          <Link href="/support/court-logistics/court-date-guide">{t("courtLocator.design.prepare")}</Link>
          <Link href="/rights-info" data-testid="button-know-your-rights">{t("footer.knowYourRights")}</Link>
          <Link href="/case-guidance" data-testid="button-get-guidance">{t("footer.getCaseGuidance")}</Link>
        </div>
        <a className="locator-credit" href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>
      </section>
    </ScanFirstPageFrame>
  );
}
