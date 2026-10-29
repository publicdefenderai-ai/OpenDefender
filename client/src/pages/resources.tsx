import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Scale,
  Phone,
  Mail,
  Navigation,
  Clock,
  BookOpen,
  Info,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

function PublicDefenderOfficeCard({ office }: { office: PublicDefenderOffice }) {
  const { t } = useTranslation();

  return (
    <Card className="legal-result">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{office.name}</h4>
            <div className="flex flex-wrap gap-2">
              {office.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {office.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              {office.distanceAvailable !== false && (<span className="text-xs text-primary font-medium">
                {office.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium">{office.address}</div>
            </div>
          </div>

          {office.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${office.phone}`} className="text-sm font-medium hover:text-primary">
                  {office.phone}
                </a>
              </div>
            </div>
          )}

          {office.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${office.email}`} className="text-sm font-medium hover:text-primary">
                  {office.email}
                </a>
              </div>
            </div>
          )}

          {office.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{office.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.publicDefenderSearch.services')}</div>
            <div className="flex flex-wrap gap-1">
              {office.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(office.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegalAidOrganizationCard({ organization }: { organization: LegalAidOrganization }) {
  const { t } = useTranslation();

  return (
    <Card className="legal-result">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{organization.name}</h4>
            <div className="flex flex-wrap gap-2">
              {organization.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {organization.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              {organization.distanceAvailable !== false && (<span className="text-xs text-primary font-medium">
                {organization.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>)}
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {organization.organizationType}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium">{organization.address}</div>
            </div>
          </div>

          {organization.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${organization.phone}`} className="text-sm font-medium hover:text-primary">
                  {organization.phone}
                </a>
              </div>
            </div>
          )}

          {organization.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${organization.email}`} className="text-sm font-medium hover:text-primary">
                  {organization.email}
                </a>
              </div>
            </div>
          )}

          {organization.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{organization.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.legalAidSearch.servicesOffered')}</div>
            <div className="flex flex-wrap gap-1">
              {organization.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(organization.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Resources() {
  useScrollToTop();
  const { t } = useTranslation();
  const [kind, setKind] = useState<"pd" | "la">("pd");
  const [pdZipCode, setPdZipCode] = useState("");
  const [laZipCode, setLaZipCode] = useState("");
  const [pdSearching, setPdSearching] = useState(false);
  const [laSearching, setLaSearching] = useState(false);
  const [pdOffices, setPdOffices] = useState<PublicDefenderOffice[]>([]);
  const [laOrganizations, setLaOrganizations] = useState<LegalAidOrganization[]>([]);
  const [pdError, setPdError] = useState("");
  const [laError, setLaError] = useState("");
  const [pdHasSearched, setPdHasSearched] = useState(false);
  const [laHasSearched, setLaHasSearched] = useState(false);
  const searching = kind === "pd" ? pdSearching : laSearching;
  const zip = kind === "pd" ? pdZipCode : laZipCode;
  const error = kind === "pd" ? pdError : laError;
  const hasSearched = kind === "pd" ? pdHasSearched : laHasSearched;
  const searchKey = kind === "pd" ? "home.publicDefenderSearch" : "home.legalAidSearch";

  const search = async () => {
    if (searching) return;
    const isPd = kind === "pd";
    const setError = isPd ? setPdError : setLaError;
    if (!/^\d{5}$/.test(zip)) { setError(t(`${searchKey}.error`)); return; }
    const setSearching = isPd ? setPdSearching : setLaSearching;
    setSearching(true);
    setError("");
    if (isPd) { setPdOffices([]); setPdHasSearched(true); }
    else { setLaOrganizations([]); setLaHasSearched(true); }
    try {
      if (isPd) setPdOffices(await searchPublicDefenderOffices(zip, { propagateErrors: true }));
      else setLaOrganizations(await searchLegalAidOrganizations(zip, { propagateErrors: true }));
    } catch {
      setError(t(`${searchKey}.errorGeneral`));
    } finally { setSearching(false); }
  };
  const changeZip = (value: string) => {
    const clean = value.replace(/\D/g, "").slice(0, 5);
    if (kind === "pd") { setPdZipCode(clean); setPdError(""); setPdHasSearched(false); setPdOffices([]); }
    else { setLaZipCode(clean); setLaError(""); setLaHasSearched(false); setLaOrganizations([]); }
  };

  return (
    <ScanFirstPageFrame mainClassName="legal-resources-page">
      <header className="legal-width legal-intro">
        <h1>{t("resources.design.heading")}</h1>
        <p>{t('resources.hero.subtitle', { defaultValue: 'Free and low-cost legal representation near you. Search by ZIP code.' })}</p>
        <a href="#resource-finders" className="legal-link" data-testid="button-start-resources">{t('resources.hero.nextStep', 'Search for help by ZIP code')}</a>
      </header>
      <section id="resource-finders" className="legal-width legal-workspace">
        <div>
          <form className="legal-finder" noValidate onSubmit={event => { event.preventDefault(); void search(); }}>
            <fieldset>
              <legend>{t("resources.design.kind")}</legend>
              {(["pd", "la"] as const).map(value => <label className="legal-choice" key={value}>
                <input type="radio" name="legal-help-kind" value={value} checked={kind === value} onChange={() => setKind(value)} data-testid={value === "pd" ? "card-public-defender" : "card-legal-aid"} />
                <span>{t(value === "pd" ? "resources.publicDefender.title" : "resources.legalAid.title")}<small>{t(value === "pd" ? "resources.publicDefender.description" : "resources.legalAid.description")}</small></span>
              </label>)}
            </fieldset>
            <label className="legal-zip-label" htmlFor="legal-help-zip">{t("resources.design.zip")}</label>
            <div className="legal-fields">
              <Input id="legal-help-zip" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} onChange={event => changeZip(event.target.value)} disabled={searching} aria-invalid={!!error && zip.length !== 5} aria-describedby={error ? "legal-finder-error" : undefined} placeholder={t(`${searchKey}.inputPlaceholder`)} data-testid={`input-${kind}-zip-code-resources`} />
              <Button type="submit" disabled={searching} data-testid={`button-search-${kind}-resources`}>{searching ? t(`${searchKey}.searching`) : t(`${searchKey}.searchButton`)}</Button>
            </div>
            {error && <p id="legal-finder-error" className="legal-search-error" role="alert">{error}</p>}
            <p className="legal-search-status" role="status" aria-live="polite">{searching ? t(`${searchKey}.searching`) : hasSearched && !error ? kind === "pd" ? pdOffices.length ? t('home.searchResults.foundOffices', { count: pdOffices.length, plural: pdOffices.length !== 1 ? 's' : '' }) : t(`${searchKey}.noResults`) : laOrganizations.length ? t('home.legalAidSearch.resultsFound', { count: laOrganizations.length, plural: laOrganizations.length !== 1 ? 's' : '' }) : t(`${searchKey}.noResults`) : ""}</p>
          </form>
          <div className="legal-results" aria-busy={searching}>
            {!searching && !error && (kind === "pd" ? pdOffices.map(office => <PublicDefenderOfficeCard key={office.id} office={office} />) : laOrganizations.map(organization => <LegalAidOrganizationCard key={organization.id} organization={organization} />))}
          </div>
        </div>
        <aside className="legal-help-notes">
          <h2>{t("resources.design.beforeTitle")}</h2>
          <p>{t("resources.design.beforeText")}</p>
          <Link href="/right-to-counsel" className="legal-link">{t("howTo.rightToCounsel")}</Link>
          <div><h3>{t("resources.design.immigration")}</h3><Link href="/immigration-guidance" className="legal-link">{t("design.immigrationNav")}</Link></div>
          <div><h3>{t("design.life")}</h3><Link href="/support" className="legal-link">{t("design.life")}</Link>
            <p><strong>Call or text 211</strong>. Free, 24/7 social services hotline that can also connect you to local legal aid organizations in your area.</p>
          </div>
        </aside>
      </section>
      <section className="legal-width legal-tools">
        <h2>{t("resources.design.tools")}</h2>
        <div>{[
          { href: "/court-locator", key: "court" }, { href: "/legal-glossary", key: "glossary" },
          { href: "/court-records", key: "records" }, { href: "/diversion-programs", key: "diversion" },
          { href: "/support/reputation", key: "recordRelief" }, { href: "/document-summarizer", key: "summarizer" },
        ].map(item => <Link className="legal-link" key={item.href} href={item.href}>{t(`resources.design.${item.key}`)}</Link>)}</div>
      </section>
      {/* Court-Appointed Counsel section */}
      <section className="legal-counsel">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Beyond the Public Defender: Court-Appointed Attorneys</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              When a public defender's office has a conflict of interest, is unavailable, or has reached capacity, courts appoint private attorneys from a local panel instead. Requesting court-appointed counsel works the same way as requesting a public defender — tell the judge at your first appearance that you cannot afford an attorney.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            <ScrollReveal>
              <Card className="legal-counsel-sheet">
                <CardContent className="pt-5">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">How to find the assigned counsel program near you</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          Search the court's website for an "assigned counsel," "appointment panel," or "indigent defense" section — many courts publish their appointed attorney lists there.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          Ask the court clerk directly — they administer the appointment panel and can tell you who is on it and how the process works in that court.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          At your arraignment or first appearance, tell the judge you cannot afford an attorney. The court is required to appoint one. You do not need to identify a specific attorney yourself.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.07}>
              <Card className="legal-counsel-sheet">
                <CardContent className="pt-5">
                  <div className="flex gap-3">
                    <BookOpen className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">National resources on indigent defense</p>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a
                            href="https://www.nlada.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                          >
                            National Legal Aid & Defender Association (NLADA) <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-muted-foreground mt-0.5">The principal national organization for public defense. Covers both public defender offices and assigned counsel programs.</p>
                        </li>
                        <li>
                          <a
                            href="https://www.americanbar.org/groups/legal_services/flh-home/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                          >
                            ABA Free Legal Help Directory <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-muted-foreground mt-0.5">Search for free and low-cost legal help by state, including criminal defense resources.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

    </ScanFirstPageFrame>
  );
}
