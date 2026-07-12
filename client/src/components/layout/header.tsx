import { useState, useEffect, useRef, Fragment } from "react";
import { Menu, MessageSquare, Shield, MapPin, Languages, Moon, Sun, FileText, Users, ChevronDown, Globe2, Compass, AlertCircle, Scale, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { SearchButton } from "@/components/search/site-search";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/ui/theme-provider";

interface DropdownItem {
  href: string;
  label: string;
  desc: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
}

interface NavLink {
  href: string;
  label: string;
  dropdown?: DropdownItem[];
  megaMenu?: boolean;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const { attemptNavigation } = useNavigationGuard();
  const isHomePage = location === "/";
  const navRef = useRef<HTMLDivElement>(null);
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdown) return;
    const handle = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openDropdown]);

  // Close dropdown on Escape and restore focus to the trigger that opened it
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openDropdown) {
        setOpenDropdown(null);
        activeTriggerRef.current?.focus();
        activeTriggerRef.current = null;
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [openDropdown]);

  // Clean up hover timers on unmount
  useEffect(() => {
    return () => {
      if (hoverOpenTimer.current) clearTimeout(hoverOpenTimer.current);
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  const handleNavigate = (href: string, closeMobileMenu = false) => {
    setOpenDropdown(null);
    const wasBlocked = !attemptNavigation(() => {
      if (closeMobileMenu) {
        setMobileMenuOpen(false);
        setMobileExpanded(null);
      }
      setLocation(href);
    });
    if (wasBlocked && closeMobileMenu) {
      setMobileMenuOpen(false);
    }
  };

  const handleDropdownMouseEnter = (href: string) => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    hoverOpenTimer.current = setTimeout(() => setOpenDropdown(href), 80);
  };

  const handleDropdownMouseLeave = () => {
    if (hoverOpenTimer.current) {
      clearTimeout(hoverOpenTimer.current);
      hoverOpenTimer.current = null;
    }
    hoverCloseTimer.current = setTimeout(() => setOpenDropdown(null), 280);
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const navLinks: NavLink[] = [
    { href: "/first-24-hours", label: t('header.nav.first24Hours', 'First 24 Hours') },
    {
      href: "/support",
      label: t('header.nav.support', 'Life & Family'),
      megaMenu: true,
      dropdown: [
        { href: "/support",         label: t('header.dropdown.support.resources',        'Support Resources'), desc: t('header.dropdown.support.resourcesDesc',        'Housing, employment, finances, mental health, and more'), icon: Heart, iconBg: '#f8eef3', iconColor: '#8b2252' },
        { href: "/friends-family",  label: t('header.dropdown.support.friendsFamily',    'Friends & Family'),  desc: t('header.dropdown.support.friendsFamilyDesc',    'Help someone who was arrested'),                          icon: Users, iconBg: '#f8eef3', iconColor: '#8b2252' },
      ],
    },
    {
      href: "/case-guidance",
      label: t('header.nav.caseGuidance', 'Get Guidance'),
      megaMenu: true,
      dropdown: [
        { href: "/case-guidance",       label: t('header.dropdown.guidance.personalized', 'Case Roadmap'), desc: t('header.dropdown.guidance.personalizedDesc', 'Plain-language overview of what to expect for your charges and state'),       icon: Compass,      iconBg: '#eef9f8', iconColor: '#0f766e' },
        { href: "/chat",                label: t('header.dropdown.guidance.chat', 'AI Chat'),                        desc: t('header.dropdown.guidance.chatDesc', 'Open conversation with our AI assistant'),               icon: MessageSquare, iconBg: '#eef9f8', iconColor: '#0f766e' },
        { href: "/document-summarizer", label: t('header.dropdown.guidance.summarizer', 'Document Summarizer'),      desc: t('header.dropdown.guidance.summarizerDesc', 'Understand the legal documents in your case'),       icon: FileText,      iconBg: '#eef9f8', iconColor: '#0f766e' },
      ],
    },
    {
      href: "/immigration-guidance",
      label: t('header.nav.immigration', 'Immigration'),
      megaMenu: true,
      dropdown: [
        { href: "/immigration-guidance",                   label: t('header.dropdown.immigration.general', 'General Information'),      desc: t('header.dropdown.immigration.generalDesc', 'Overview of immigration rights and resources'), icon: Globe2,       iconBg: '#fef3e2', iconColor: '#92400e' },
        { href: "/immigration-guidance#detailed-guides",   label: t('header.dropdown.immigration.situational', 'Situational Guides'),    desc: t('header.dropdown.immigration.situationalDesc', 'ICE encounters, raids, detention, and more'), icon: AlertCircle,  iconBg: '#fef3e2', iconColor: '#92400e' },
        { href: "/immigration-guidance/know-your-rights",  label: t('header.dropdown.immigration.rights', 'Know Your Rights'),          desc: t('header.dropdown.immigration.rightsDesc', 'Your rights regardless of status'),              icon: Shield,       iconBg: '#fef3e2', iconColor: '#92400e' },
        { href: "/immigration-guidance/find-detained",     label: t('header.dropdown.immigration.detained', 'Find a Detained Person'),  desc: t('header.dropdown.immigration.detainedDesc', 'Locate someone in ICE custody'),               icon: MapPin,       iconBg: '#fef3e2', iconColor: '#92400e' },
        { href: "/immigration-guidance/find-attorney",     label: t('header.dropdown.immigration.lawyer', 'Find a Lawyer'),             desc: t('header.dropdown.immigration.lawyerDesc', 'Immigration legal representation'),             icon: Scale,        iconBg: '#fef3e2', iconColor: '#92400e' },
        { href: "/immigration-guidance/after-deportation", label: t('header.dropdown.immigration.afterDeportation', 'After Deportation'),  desc: t('header.dropdown.immigration.afterDeportationDesc', 'Help for families on both sides of a removal'), icon: Users, iconBg: '#fef3e2', iconColor: '#92400e' },
      ],
    },
    { href: "/directory", label: t('header.nav.explore', 'Explore') },
  ];

  const menuItems = [
    { title: t('header.menu.friendsFamily', 'For Families & Friends'), href: "/friends-family",  icon: Users,    description: t('header.menu.friendsFamilyDesc', 'Start here if someone you know was arrested.'),              testId: "menu-friends-family",   featured: true  },
    { title: t('header.menu.knowRights', 'Know Your Rights'),          href: "/rights-info",     icon: Shield,   description: t('header.menu.knowRightsDesc', 'Constitutional rights in plain language'),                     testId: "menu-know-rights",      featured: false },
    { title: t('header.menu.documentLibrary', 'Document Library'),     href: "/document-library", icon: FileText, description: t('header.menu.documentLibraryDesc', 'Understand the legal documents in your case'),          testId: "menu-document-library", featured: false },
    { title: t('header.menu.findResources', 'Find Legal Help'),        href: "/legal-aid",        icon: MapPin,   description: t('header.menu.findResourcesDesc', 'Locate public defenders, legal aid, and courts'),         testId: "menu-find-resources",   featured: false },
  ];

  return (
    <header className="bg-background shadow-sm border-b sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 py-3.5" aria-label="Main navigation">
        <div className="flex items-center justify-between">

          {/* Left: Logo + Desktop nav */}
          <div className="flex items-center gap-5" ref={navRef}>
            {isHomePage ? (
              <Link href="/" className="flex items-center" aria-label="OpenDefender home">
                <BrandLogo size="md" />
              </Link>
            ) : (
              <button onClick={() => handleNavigate("/")} className="hover:opacity-75 transition-opacity" aria-label="Go to home page" data-testid="button-home">
                <BrandLogo size="sm" />
              </button>
            )}

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0 ml-3" aria-label="Section navigation">
              {navLinks.map((link, idx) => {
                const isActive = location === link.href || location.startsWith(link.href + "/");
                const isOpen = openDropdown === link.href;
                const isLast = idx === navLinks.length - 1;

                const separator = !isLast ? (
                  <span aria-hidden="true" className="text-border select-none px-0.5 text-base leading-none">·</span>
                ) : null;

                if (!link.dropdown) {
                  return (
                    <Fragment key={link.href}>
                      <button
                        onClick={() => { setOpenDropdown(null); handleNavigate(link.href); }}
                        className={cn(
                          "relative px-3 py-2 text-sm rounded-sm transition-colors duration-150 group",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                          isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                        <span aria-hidden="true" className="absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full bg-primary opacity-[0.12]" />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-transparent via-primary to-transparent opacity-100"
                              : "bg-primary opacity-0 group-hover:opacity-50"
                          )}
                        />
                      </button>
                      {separator}
                    </Fragment>
                  );
                }

                // Dropdown item — hover-enabled with grace period
                const isMegaMenu = link.megaMenu;
                const panelAlign = link.href === '/immigration-guidance' ? 'right-0' : 'left-0';
                const panelWidth = link.href === '/immigration-guidance' ? 'w-[460px]' : 'w-72';

                return (
                  <Fragment key={link.href}>
                    <div
                      className="relative"
                      onMouseEnter={() => handleDropdownMouseEnter(link.href)}
                      onMouseLeave={handleDropdownMouseLeave}
                      onBlurCapture={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setOpenDropdown(null);
                        }
                      }}
                    >
                      <button
                        onClick={(e) => {
                          activeTriggerRef.current = e.currentTarget;
                          setOpenDropdown(isOpen ? null : link.href);
                        }}
                        onFocus={(e) => {
                          activeTriggerRef.current = e.currentTarget;
                          setOpenDropdown(link.href);
                        }}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        aria-label={link.label}
                        className={cn(
                          "relative flex items-center gap-1 px-3 py-2 text-sm rounded-sm transition-colors duration-150 group",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                          isActive || isOpen ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-150", isOpen && "rotate-180")} />
                        <span aria-hidden="true" className="absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full bg-primary opacity-[0.12]" />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-200",
                            isActive || isOpen
                              ? "bg-gradient-to-r from-transparent via-primary to-transparent opacity-100"
                              : "bg-primary opacity-0 group-hover:opacity-50"
                          )}
                        />
                      </button>

                      {isOpen && (
                        <>
                          {isMegaMenu ? (
                            <div className={cn(
                              "absolute top-full mt-2 bg-background border border-border rounded-xl shadow-xl z-50 p-2",
                              panelAlign,
                              panelWidth
                            )}>
                              <div className={link.href === '/immigration-guidance' ? 'grid grid-cols-2 gap-1' : 'flex flex-col'}>
                                {link.dropdown!.map((item, itemIdx) => {
                                  const Icon = item.icon;
                                  const isLastOdd = link.dropdown!.length % 2 !== 0 && itemIdx === link.dropdown!.length - 1;
                                  return (
                                    <button
                                      key={item.href}
                                      onClick={() => handleNavigate(item.href)}
                                      className={cn(
                                        "flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-colors group text-left",
                                        isLastOdd && "col-span-2"
                                      )}
                                    >
                                      {Icon && (
                                        <div
                                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{ background: item.iconBg }}
                                        >
                                          <Icon className="w-4 h-4" style={{ color: item.iconColor }} />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">{item.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="absolute top-full left-0 mt-1.5 w-64 bg-background border border-border rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                              {link.dropdown!.map((item) => (
                                <button
                                  key={item.href}
                                  onClick={() => handleNavigate(item.href)}
                                  className="w-full text-left px-4 py-2.5 hover:bg-muted/60 transition-colors group"
                                >
                                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {separator}
                  </Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            <SearchButton />

            <div className="hidden md:block">
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[140px] h-9 border-0 bg-transparent hover:bg-accent" data-testid="select-language">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" data-testid="option-english">English</SelectItem>
                  <SelectItem value="es" data-testid="option-spanish">Español</SelectItem>
                  <SelectItem value="zh" data-testid="option-chinese">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="sm" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground hidden md:flex" data-testid="button-theme-toggle" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground md:hidden" data-testid="button-menu" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85vw] sm:w-[360px] flex flex-col overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t('header.mobileMenu', 'Menu')}</SheetTitle>
                </SheetHeader>

                <div className="mt-5 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">{t('header.mobile.navigate', 'Navigate')}</p>
                  <div className="space-y-0.5">
                    {navLinks.map((link) => {
                      const isExpanded = mobileExpanded === link.href;

                      if (!link.dropdown) {
                        return (
                          <button
                            key={link.href}
                            onClick={() => handleNavigate(link.href, true)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                              location === link.href ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                          >
                            <span className="flex-1">{link.label}</span>
                          </button>
                        );
                      }

                      return (
                        <div key={link.href}>
                          <button
                            onClick={() => setMobileExpanded(isExpanded ? null : link.href)}
                            aria-expanded={isExpanded}
                            className={cn(
                              "w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                              location.startsWith(link.href) ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                          >
                            <span>{link.label}</span>
                            <ChevronDown className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform duration-150", isExpanded && "rotate-180")} />
                          </button>

                          {isExpanded && (
                            <div className="ml-3 pl-3 border-l border-border/60 mt-0.5 mb-1 space-y-0.5">
                              {link.dropdown.map((item) => {
                                const ItemIcon = item.icon;
                                return (
                                  <button
                                    key={item.href}
                                    onClick={() => handleNavigate(item.href, true)}
                                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-muted/60 transition-colors group"
                                  >
                                    <div className="flex items-start gap-2.5">
                                      {ItemIcon && (
                                        <div
                                          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{ background: item.iconBg }}
                                        >
                                          <ItemIcon className="w-3.5 h-3.5" style={{ color: item.iconColor }} />
                                        </div>
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4 mb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1 mb-2">{t('header.mobile.more', 'More')}</p>
                  <div className="space-y-1">
                    {menuItems.map((item, idx) => {
                      const Icon = item.icon;
                      const isFeatured = item.featured;
                      return (
                        <div key={item.href}>
                          {isFeatured && idx === 0 && (
                            <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider px-3 mb-1">
                              {t('header.menu.familySection', 'For Families & Friends')}
                            </p>
                          )}
                          <Button
                            variant={isFeatured ? "outline" : "ghost"}
                            className={`w-full justify-start h-auto py-3 px-3 ${isFeatured ? "border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10 hover:bg-teal-100/60 dark:hover:bg-teal-900/20" : ""}`}
                            data-testid={item.testId}
                            onClick={() => handleNavigate(item.href, true)}
                          >
                            <div className="flex items-start space-x-3 w-full">
                              <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isFeatured ? "text-teal-600 dark:text-teal-400" : "text-blue-600"}`} />
                              <div className="text-left flex-1 min-w-0">
                                <div className="font-semibold text-sm">{item.title}</div>
                                <div className="text-xs text-muted-foreground font-normal whitespace-normal break-words mt-0.5">{item.description}</div>
                              </div>
                            </div>
                          </Button>
                          {isFeatured && <div className="border-t border-border/60 my-2" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border/60 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-2">{t('header.language', 'Language')}</label>
                    <Select value={i18n.language} onValueChange={changeLanguage}>
                      <SelectTrigger className="w-full" data-testid="select-language-mobile">
                        <div className="flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en" data-testid="option-english-mobile">English</SelectItem>
                        <SelectItem value="es" data-testid="option-spanish-mobile">Español</SelectItem>
                        <SelectItem value="zh" data-testid="option-chinese-mobile">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={toggleTheme} className="w-full justify-start" data-testid="button-theme-toggle-mobile">
                    {theme === "dark" ? <><Sun className="h-4 w-4 mr-2" />{t('header.lightMode', 'Light Mode')}</> : <><Moon className="h-4 w-4 mr-2" />{t('header.darkMode', 'Dark Mode')}</>}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
