import { useEffect, useRef, useState } from "react";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { SearchButton } from "@/components/search/site-search";
import { Link, useLocation } from "wouter";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/ui/theme-provider";

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const { attemptNavigation } = useNavigationGuard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const menuButton = useRef<HTMLButtonElement>(null);
  const resourcesButton = useRef<HTMLButtonElement>(null);
  const resourcesPanel = useRef<HTMLDivElement>(null);
  const dark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (resourcesOpen) { setResourcesOpen(false); resourcesButton.current?.focus(); }
      else if (mobileOpen) { setMobileOpen(false); menuButton.current?.focus(); }
    };
    const outside = (event: MouseEvent) => {
      if (!resourcesPanel.current?.contains(event.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("mousedown", outside); };
  }, [mobileOpen, resourcesOpen]);
  useEffect(() => { setMobileOpen(false); setResourcesOpen(false); }, [location]);

  // Keep the existing unsaved-guidance navigation guard on every header destination.
  const navigate = (href: string) => {
    setMobileOpen(false);
    setResourcesOpen(false);
    attemptNavigation(() => setLocation(href));
  };
  const navLink = (href: string, label: string) => <Link key={href} href={href}
    onClick={(event) => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigate(href); } }}
    aria-current={location === href ? "page" : undefined}>{label}</Link>;
  const primary = [
    ["/first-24-hours", t("navigation.intents.urgent.label", "First 24 Hours")],
    ["/case-guidance", t("design.caseNav")], ["/immigration-guidance", t("design.immigrationNav")],
  ];
  const resources = [["/how-to", t("design.how")], ["/directory", t("design.all")],
    ["/legal-aid", t("design.help")], ["/support", t("design.life")]];
  const groups = [
    { label: t("design.helpGroup"), links: [["/legal-aid", t("design.help")], ["/right-to-counsel", t("footer.rightToCounsel")], ["/friends-family", t("header.dropdown.support.friendsFamily")], ["/support", t("design.life")]] },
    { label: t("design.toolsGroup"), links: [["/rights-info", t("header.menu.knowRights")], ["/case-timeline", t("design.timelineNav")], ["/court-locator", t("footer.findLocalCourts")], ["/document-library", t("design.documentsNav")], ["/chat", t("header.menu.getHelp")], ["/document-summarizer", t("design.summarizerNav")], ["/letter-generator", t("design.letterNav")]] },
    { label: t("design.advocatesGroup"), links: [["/for-advocates", t("design.advocateNav")], ["/attorney", t("design.attorneyNav")]] },
  ];
  const language = (id: string) => <label className="design-language" htmlFor={id}><span>{t("design.language")}</span><select id={id} data-testid={id}
    value={(i18n.resolvedLanguage || i18n.language).split("-")[0]} onChange={(event) => i18n.changeLanguage(event.target.value)}>
    <option value="en">English</option><option value="es">Español</option><option value="zh">中文</option>
  </select></label>;
  return <header className="design-header">
    <div className="design-header-row">
      <button className="design-brand-home" onClick={() => navigate("/")} aria-label="OpenDefender home" data-testid="button-home"><BrandLogo size="md" /></button>
      <nav className="design-desktop-nav" aria-label="Main navigation">
        {primary.map(([href, label]) => navLink(href, label))}
        <div className="design-resources" ref={resourcesPanel} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setResourcesOpen(false); }}>
          <button ref={resourcesButton} aria-expanded={resourcesOpen} aria-controls="design-resources-menu" onClick={() => setResourcesOpen(!resourcesOpen)}>{t("design.resources")}<ChevronDown size={15} aria-hidden="true" /></button>
          {resourcesOpen && <div id="design-resources-menu" className="design-resources-menu">{resources.map(([href, label]) => navLink(href, label))}</div>}
        </div>
      </nav>
      <div className="design-header-utilities">
        <div className="design-desktop-language">{language("select-language-desktop")}</div>
        <div className="design-desktop-search"><SearchButton /></div>
        <button className="design-icon-button" data-testid="button-theme" aria-label={t(dark ? "design.light" : "design.dark")} onClick={() => setTheme(dark ? "light" : "dark")}>{dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
        <button ref={menuButton} className="design-menu-button" data-testid="button-menu" aria-expanded={mobileOpen} aria-controls="design-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}<span>{t("design.menu")}</span></button>
      </div>
    </div>
    {mobileOpen && <nav id="design-mobile-menu" className="design-mobile-menu" aria-label="Site menu">
      <div className="design-mobile-primary">{primary.map(([href, label]) => navLink(href, label))}</div>
      <div className="design-mobile-start">{resources.slice(0, 2).map(([href, label]) => navLink(href, label))}</div>
      {groups.map(group => <details key={group.label}><summary>{group.label}</summary><div>{group.links.map(([href, label]) => navLink(href, label))}</div></details>)}
      {language("select-language-mobile")}
      <SearchButton />
    </nav>}
  </header>;
}
