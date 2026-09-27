/** Consistent localized notice for English legal content shown in another locale. */
export function translationUnavailableNotice(language: string): string {
  const locale = language.split("-")[0].toLowerCase();
  if (locale === "es") return "Esta explicación aún no está disponible en español. Se muestra en inglés.";
  if (locale === "zh") return "此说明尚无中文版本，现显示英文内容。";
  return "This explanation is not yet available in your language. Showing English.";
}
