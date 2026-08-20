import { useTranslation } from "react-i18next";

type DisclosureNoticeProps = {
  className?: string;
  compact?: boolean;
};

export function DisclosureNotice({ className = "", compact = false }: DisclosureNoticeProps) {
  const { t } = useTranslation();

  return (
    <aside
      className={`text-muted-foreground ${className}`}
      aria-label={t("disclosure.label")}
      data-testid="legal-disclosure"
    >
      <div className={`mx-auto max-w-7xl px-4 text-center ${compact ? "py-2" : "py-3"}`}>
        <p className="text-xs font-medium leading-relaxed sm:text-sm">
          {t("disclosure.summary")}
        </p>
      </div>
    </aside>
  );
}