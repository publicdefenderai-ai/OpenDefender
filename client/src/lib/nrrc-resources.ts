import { nrrcCopy } from "@/locales/nrrc-resources";
export type NrrcResourceId = "home" | "consequences" | "housing";
export const NRRC_URLS: Record<NrrcResourceId, string> = {
  home: "https://nationalreentryresourcecenter.org/",
  consequences: "https://niccc.nationalreentryresourcecenter.org/",
  housing: "https://nationalreentryresourcecenter.org/events/homeless-services-101-what-reentry-service-providers-need-know",
};
export function getNrrcResources(language: string) {
  const copy = nrrcCopy[language.startsWith("es") ? "es" : language.startsWith("zh") ? "zh" : "en"];
  return { copy, resources: (Object.keys(NRRC_URLS) as NrrcResourceId[]).map(id => ({
    id, title: copy[id], description: copy[`${id}Description`], link: NRRC_URLS[id],
  })) };
}
