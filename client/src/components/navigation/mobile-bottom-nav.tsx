import { useLocation, Link } from "wouter";
import { Home, MessageCircle, BookOpen, Scale, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
  href: string;
  icon: typeof Home;
  labelKey: string;
  defaultLabel: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, labelKey: "nav.home", defaultLabel: "Home" },
  { href: "/chat", icon: MessageCircle, labelKey: "nav.chat", defaultLabel: "Chat" },
  { href: "/document-library", icon: BookOpen, labelKey: "nav.documents", defaultLabel: "Docs" },
  { href: "/rights-info", icon: Scale, labelKey: "nav.rights", defaultLabel: "Rights" },
];

const moreMenuItems = [
  { href: "/court-locator", labelKey: "nav.courtLocator", defaultLabel: "Court Locator" },
  { href: "/legal-glossary", labelKey: "nav.glossary", defaultLabel: "Legal Glossary" },
  { href: "/diversion-programs", labelKey: "nav.diversion", defaultLabel: "Diversion Programs" },
  { href: "/immigration-guidance", labelKey: "nav.immigration", defaultLabel: "Immigration" },
  { href: "/statutes", labelKey: "nav.statutes", defaultLabel: "Statutes" },
];

export function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border md:hidden safe-area-bottom"
      role="navigation"
      aria-label={t("nav.mobileNavigation", "Mobile navigation")}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`nav-${item.defaultLabel.toLowerCase().replace(/\s/g, "-")}`}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-1 transition-transform",
                  active && "scale-110"
                )}
              />
              <span className="text-xs font-medium truncate">
                {t(item.labelKey, item.defaultLabel)}
              </span>
            </Link>
          );
        })}

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-2 px-1 transition-colors",
                "text-muted-foreground hover:text-foreground"
              )}
              data-testid="nav-more-menu"
            >
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">
                {t("nav.more", "More")}
              </span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[60vh]">
            <SheetHeader>
              <SheetTitle>{t("nav.moreOptions", "More Options")}</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {moreMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg transition-colors touch-target",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  data-testid={`link-more-${item.defaultLabel.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <span className="text-sm font-medium">
                    {t(item.labelKey, item.defaultLabel)}
                  </span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
