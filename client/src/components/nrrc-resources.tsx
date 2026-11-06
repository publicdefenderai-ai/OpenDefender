import { useTranslation } from "react-i18next";
import { getNrrcResources, type NrrcResourceId } from "@/lib/nrrc-resources";
export function NrrcResources({ ids }: { ids: NrrcResourceId[] }) {
  const { i18n } = useTranslation();
  const { copy, resources } = getNrrcResources(i18n.language);
  return <section data-testid="nrrc-resources" className="my-8 border-t border-border pt-6">
    <h2 className="text-xl font-semibold">{copy.heading}</h2>
    <p className="mt-2 text-sm text-muted-foreground">{copy.note}</p>
    <ul className="mt-4 space-y-4">{resources.filter(resource => ids.includes(resource.id)).map(resource =>
      <li key={resource.id}>
        <a className="font-semibold underline decoration-1 underline-offset-4" href={resource.link}>{resource.title}</a>
        <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
      </li>)}
    </ul>
  </section>;
}
