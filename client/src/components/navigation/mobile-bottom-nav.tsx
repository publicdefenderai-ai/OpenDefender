import { useLocation, Link } from "wouter";
import { Home, MessageCircle, BookOpen, Scale, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
  { href: "/how-to", icon: MoreHorizontal, labelKey: "nav.more", defaultLabel: "More" },
];

export function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();

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
      </div>
    </nav>
  );
}
