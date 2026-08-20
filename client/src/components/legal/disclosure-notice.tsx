import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

type DisclosureNoticeProps = {
  className?: string;
  compact?: boolean;
};

export function DisclosureNotice({ className = "", compact = false }: DisclosureNoticeProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={`border-y border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100 ${className}`}
      aria-label={t("disclosure.label")}
      data-testid="legal-disclosure"
    >
      <div className={`mx-auto flex max-w-7xl items-start gap-2 px-4 ${compact ? "py-2" : "py-3"}`}>
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed sm:text-sm">
          {t("disclosure.summary")}
        </p>
      </div>
    </aside>
  );
}