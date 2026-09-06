import { useLocation, Link } from "wouter";
import { Home, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { getIntentDestinations } from "@/components/navigation/intent-navigation";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  mobileLabel: string;
}

export function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const intents = getIntentDestinations(t);
  const byId = Object.fromEntries(intents.map((destination) => [destination.id, destination])) as Record<string, typeof intents[number]>;
  const navItems: NavItem[] = [
    {
      href: "/",
      icon: Home,
      label: t("nav.home", "Home"),
      mobileLabel: t("nav.home", "Home"),
    },
    {
      href: byId.urgent.href,
      icon: byId.urgent.icon,
      label: byId.urgent.label,
      mobileLabel: t("navigation.mobile.urgent", "First 24h"),
    },
    {
      href: byId.roadmap.href,
      icon: byId.roadmap.icon,
      label: byId.roadmap.label,
      mobileLabel: t("navigation.mobile.roadmap", "Roadmap"),
    },
    {
      href: byId.stage.href,
      icon: byId.stage.icon,
      label: byId.stage.label,
      mobileLabel: t("navigation.mobile.stage", "Case stage"),
    },
    {
      href: byId.legalHelp.href,
      icon: byId.legalHelp.icon,
      label: t("navigation.mobile.legalHelp", "Legal help"),
      mobileLabel: t("navigation.mobile.legalHelp", "Legal help"),
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav
      className="editorial-mobile-nav fixed bottom-0 left-0 right-0 z-40 border-t md:hidden safe-area-bottom"
      role="navigation"
      aria-label={t("nav.mobileNavigation", "Mobile navigation")}
    >
      <div className="flex items-center justify-around h-16 px-1 sm:px-2 gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
               aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 min-w-0 h-full py-1 px-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                 active
                   ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
               data-testid={`nav-${item.href === "/" ? "home" : item.href.split("/").filter(Boolean)[0]}`}
            >
              <Icon
                className={cn(
                   "h-5 w-5 mb-1"
                )}
              />
               <span className="text-[10px] leading-tight font-medium text-center whitespace-normal break-words line-clamp-2">
                  {item.mobileLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
