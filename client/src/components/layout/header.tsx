import { useState } from "react";
import { Scale, HelpCircle, Menu, MessageSquare, Info, Globe, FileSearch, Download, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    {
      title: t('header.menu.getGuidance'),
      href: "/case-guidance",
      icon: MessageSquare,
      description: t('header.menu.getGuidanceDesc'),
      testId: "menu-case-guidance"
    },
    {
      title: t('header.menu.learnRights'),
      href: "/rights-info",
      icon: Info,
      description: t('header.menu.learnRightsDesc'),
      testId: "menu-rights-info"
    },
    {
      title: t('header.menu.immigration'),
      href: "/immigration-guidance",
      icon: Globe,
      description: t('header.menu.immigrationDesc'),
      testId: "menu-immigration-guidance"
    },
    {
      title: t('header.menu.courtRecords'),
      href: "/court-records",
      icon: FileSearch,
      description: t('header.menu.courtRecordsDesc'),
      testId: "menu-court-records"
    },
    {
      title: t('header.menu.recapExtensions'),
      href: "/recap-extensions",
      icon: Download,
      description: t('header.menu.recapExtensionsDesc'),
      testId: "menu-recap-extensions"
    }
  ];

  return (
    <header className="bg-background shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 legal-blue rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('header.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
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
            
            <Link href="/mission-statement">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-help"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>
            
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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
                
                <div className="mt-6 flex flex-col space-y-3">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto py-4 px-4"
                          data-testid={item.testId}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon className="h-5 w-5 mt-0.5 text-blue-600" />
                            <div className="text-left">
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-sm text-muted-foreground font-normal">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </Link>
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
