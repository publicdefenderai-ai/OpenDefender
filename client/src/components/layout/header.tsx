import { useState } from "react";
import { Scale, HelpCircle, Menu, MessageSquare, Shield, MapPin, Languages, Home, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useNavigationGuard } from "@/contexts/navigation-guard";
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
    // If blocked, we still need to close the menu (user will see warning dialog)
    // But they can reopen menu after dismissing the dialog
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

  const menuItems = [
    {
      title: t('header.menu.getHelp'),
      href: "/chat",
      icon: MessageSquare,
      description: t('header.menu.getHelpDesc'),
      testId: "menu-get-help"
    },
    {
      title: t('header.menu.knowRights'),
      href: "/rights-info",
      icon: Shield,
      description: t('header.menu.knowRightsDesc'),
      testId: "menu-know-rights"
    },
    {
      title: t('header.menu.findResources'),
      href: "/court-locator",
      icon: MapPin,
      description: t('header.menu.findResourcesDesc'),
      testId: "menu-find-resources"
    }
  ];

  return (
    <header className="bg-background shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {isHomePage ? (
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 legal-blue rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{t('header.title')}</h1>
                <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
              </div>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-home"
              onClick={() => handleNavigate("/")}
            >
              <Home className="h-6 w-6" />
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 mr-4">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className={`text-muted-foreground hover:text-foreground hover:bg-accent ${
                    location === item.href ? "bg-accent text-foreground" : ""
                  }`}
                  data-testid={item.testId}
                  onClick={() => handleNavigate(item.href)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Button>
              ))}
            </nav>
            
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
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[90%] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
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
                
                <div className="mt-6 flex flex-col space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="w-full justify-start h-auto py-4 px-4"
                        data-testid={item.testId}
                        onClick={() => handleNavigate(item.href, true)}
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <Icon className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div className="text-left flex-1 min-w-0">
                            <div className="font-semibold">{item.title}</div>
                            <div className="text-sm text-muted-foreground font-normal whitespace-normal break-words">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </Button>
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
