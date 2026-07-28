/**
 * Pure plain-text export builder for the Collateral Consequences screener.
 *
 * Extracted from CollateralConsequences component so it can be unit-tested
 * independently of React / i18next.
 *
 * @param t         - i18next translation function (or a stub for testing)
 * @param activeRisks - sorted list of active risk objects; only `id` is used
 * @param lang      - BCP-47 language tag (e.g. "en", "es", "zh-TW")
 * @param now       - optional Date override for deterministic tests
 */
export function buildPlainText(
  t: (key: string, vars?: Record<string, unknown>) => string,
  activeRisks: { id: string }[],
  lang: string,
  now: Date = new Date(),
): string {
  const locale = lang.startsWith("zh")
    ? "zh-CN"
    : lang.startsWith("es")
    ? "es-ES"
    : "en-US";

  const dateStr = now.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [
    t("collateralConsequences.printHeading"),
    t("collateralConsequences.printDate", { date: dateStr }),
    "",
  ];

  if (activeRisks.length === 0) {
    lines.push(t("collateralConsequences.printNoRisk"));
  } else {
    for (const r of activeRisks) {
      lines.push(`** ${t(`collateralConsequences.risks.${r.id}.title`)} **`);
      lines.push(t(`collateralConsequences.risks.${r.id}.what`));
      lines.push("");
      lines.push(
        `${t("collateralConsequences.printTimeline")} ${t(`collateralConsequences.risks.${r.id}.clock`)}`,
      );
      lines.push(
        `${t("collateralConsequences.printAction")} ${t(`collateralConsequences.risks.${r.id}.action`)}`,
      );
      lines.push("");
    }
  }

  lines.push("---");
  lines.push(t("collateralConsequences.printDisclaimer"));
  return lines.join("\n");
}
