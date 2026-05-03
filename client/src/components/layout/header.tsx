import { useState } from "react";
import { HelpCircle, Menu, MessageSquare, Shield, MapPin, Languages, Moon, Sun, FileText, Users, Clock, Heart } from "lucide-react";
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const { attemptNavigation } = useNavigationGuard();
  const isHomePage = location === "/";
  const isHowToPage = location === "/how-to";

  const handleNavigate = (href: string, closeMobileMenu = false) => {
    const wasBlocked = !attemptNavigation(() => {
      if (closeMobileMenu) {
        setMobileMenuOpen(false);
      }
      setLocation(href);
    });
    if (wasBlocked && closeMobileMenu) {
      setMobileMenuOpen(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Primary nav — the three core resources + immigration
  const desktopNavLinks = [
    { href: "/first-24-hours", label: t('header.nav.first24Hours', 'First 24 Hours') },
    { href: "/support",        label: t('header.nav.support',      'Life Support') },
    { href: "/case-guidance",  label: t('header.nav.caseGuidance', 'Case Guidance') },
    { href: "/immigration-guidance", label: t('header.nav.immigration', 'Immigration') },
  ];

  // Secondary menu — Friends & Family featured first, attorney tools removed
  const menuItems = [
    {
      title: t('header.menu.friendsFamily', 'For Families & Friends'),
      href: "/friends-family",
      icon: Users,
      description: t('header.menu.friendsFamilyDesc', 'Start here if someone you know was arrested. Find them, understand the process, and get practical help.'),
      testId: "menu-friends-family",
      featured: true,
    },
    {
      title: t('header.menu.getHelp', 'AI Guidance Chat'),
      href: "/chat",
      icon: MessageSquare,
      description: t('header.menu.getHelpDesc', 'Chat with our AI for personalized case support'),
      testId: "menu-get-help",
      featured: false,
    },
    {
      title: t('header.menu.knowRights', 'Know Your Rights'),
      href: "/rights-info",
      icon: Shield,
      description: t('header.menu.knowRightsDesc', 'Constitutional rights and legal protections explained in plain language'),
      testId: "menu-know-rights",
      featured: false,
    },
    {
      title: t('header.menu.documentLibrary', 'Document Library'),
      href: "/document-library",
      icon: FileText,
      description: t('header.menu.documentLibraryDesc', 'Understand the legal documents in your case'),
      testId: "menu-document-library",
      featured: false,
    },
    {
      title: t('header.menu.findResources', 'Find Legal Help'),
      href: "/resources",
      icon: MapPin,
      description: t('header.menu.findResourcesDesc', 'Locate public defenders, legal aid, and courts near you'),
      testId: "menu-find-resources",
      featured: false,
    },
  ];

  return (
    <header className="bg-background shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">

          {/* Left: Logo + Desktop nav */}
          <div className="flex items-center gap-5">
            {isHomePage ? (
              <Link href="/" className="flex items-center gap-3" aria-label="OpenDefender home">
                <BrandLogo size="md" />
                <div className="hidden lg:flex items-center gap-3">
                  <div className="h-6 border-l border-slate-300 dark:border-slate-600" />
                  <span className="text-xs text-muted-foreground font-medium leading-snug max-w-[160px]">
                    Free Case Support &amp; Legal Rights Information
                  </span>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => handleNavigate("/")}
                className="hover:opacity-75 transition-opacity"
                aria-label="Go to home page"
                data-testid="button-home"
              >
                <BrandLogo size="sm" />
              </button>
            )}

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-0.5 ml-2" aria-label="Section navigation">
              {desktopNavLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    location === link.href || location.startsWith(link.href + "/")
                      ? "text-foreground bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
            {/* Site Search */}
            <SearchButton />

            {/* Language Selector - Desktop */}
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

            {/* Theme Toggle - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground hidden md:flex"
              data-testid="button-theme-toggle"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {!isHowToPage && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-help"
                onClick={() => handleNavigate("/how-to")}
                aria-label="How to use this site"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground md:hidden"
                  data-testid="button-menu"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90%] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>{t('header.mobileMenu')}</SheetTitle>
                </SheetHeader>

                {/* Language Selector - Mobile */}
                <div className="mt-4 mb-4">
                  <label className="text-sm font-medium mb-2 block">{t('header.language')}</label>
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

                {/* Theme Toggle - Mobile */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">{t('header.theme')}</label>
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="w-full justify-start"
                    data-testid="button-theme-toggle-mobile"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        {t('header.lightMode')}
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        {t('header.darkMode')}
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-6 flex flex-col space-y-2">
                  {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isFeatured = item.featured;
                    return (
                      <div key={item.href}>
                        {isFeatured && (
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-1">
                            {t('header.menu.familySection', 'For Families & Friends')}
                          </p>
                        )}
                        {!isFeatured && idx === 1 && (
                          <div className="border-t border-border/60 my-2" />
                        )}
                        <Button
                          variant={isFeatured ? "outline" : "ghost"}
                          className={`w-full justify-start h-auto py-4 px-4 ${isFeatured ? "border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10 hover:bg-teal-100/60 dark:hover:bg-teal-900/20" : ""}`}
                          data-testid={item.testId}
                          onClick={() => handleNavigate(item.href, true)}
                        >
                          <div className="flex items-start space-x-3 w-full">
                            <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isFeatured ? "text-teal-600 dark:text-teal-400" : "text-blue-600"}`} />
                            <div className="text-left flex-1 min-w-0">
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-sm text-muted-foreground font-normal whitespace-normal break-words">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
