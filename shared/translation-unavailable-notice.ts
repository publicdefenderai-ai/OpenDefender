/** Consistent localized notice for English legal content shown in another locale. */
export function translationUnavailableNotice(language: string): string {
  const locale = language.split("-")[0].toLowerCase();
  if (locale === "es") return "Esta explicación aún no está disponible en español. Se muestra en inglés.";
  if (locale === "zh") return "此说明尚无中文版本，现显示英文内容。";
  return "This explanation is not yet available in your language. Showing English.";
}

/** Applies only to a separate English addition, never to the translated base. */
export function translationSupplementNotice(language: string): string {
  const locale = language.split("-")[0].toLowerCase();
  if (locale === "es") return "Información adicional disponible solo en inglés. El resumen anterior sigue disponible en español.";
  if (locale === "zh") return "补充说明目前仅提供英文版本。上方的中文摘要仍可阅读。";
  return "Additional detail is available only in English. The translated summary remains available above.";
}
