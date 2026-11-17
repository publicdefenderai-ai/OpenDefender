import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { recordReliefCopy } from "@/locales/record-relief-design";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function RecordExpungement() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const copy = recordReliefCopy[lang.startsWith("es") ? "es" : lang.startsWith("zh") ? "zh" : "en"];
  const [checked, setChecked] = useState<number[]>([]);
  const screener = "/support/reputation/eligibility";
  return (
    <ScanFirstPageFrame>
      <PageBreadcrumb items={[{ label: t("breadcrumb.home"), href: "/" }]} currentPage={t("recordExpungement.hero.title")} />
      <div className="mx-auto max-w-4xl px-5 pb-16 sm:px-10">
        <header className="py-12" id="expungement-check">
          <h1 className="max-w-2xl text-4xl font-medium tracking-tight sm:text-6xl">{copy.title}</h1>
          <p className="my-5 max-w-prose leading-relaxed">{copy.intro}</p>
          <Link className="inline-block rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground" href={screener}>{copy.start}</Link>
        </header>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 border-y py-3 text-primary">
          {(["paths","gather","questions","help"] as const).map(key => <a key={key} href={`#${key}`}>{copy[key]}</a>)}
        </nav>
        <section id="paths" className="scroll-mt-24 py-8">
          <h2 className="mb-5 text-2xl">{copy.paths}</h2>
          {copy.topics.map(([title, body]) => <div key={title} className="grid gap-2 border-t py-4 sm:grid-cols-[1fr_2fr]"><h3 className="font-semibold">{title}</h3><p>{body}</p></div>)}
        </section>
        <section id="gather" className="scroll-mt-24 bg-muted p-6">
          <h2 className="text-2xl">{copy.gather}</h2><p className="my-4">{copy.materials}</p>
          {copy.items.map((item, index) => <label key={index} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(event.target.checked ? [...checked,index] : checked.filter(id => id !== index))} />{item}</label>)}
        </section>
        <section id="questions" className="scroll-mt-24 py-8">
          <h2 className="mb-4 text-2xl">{copy.questions}</h2>
          {copy.prompts.map(([title,body]) => <details className="group border-t" key={title}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">{title}<span aria-hidden="true" className="text-sm text-primary group-open:hidden">+</span><span aria-hidden="true" className="hidden text-sm text-primary group-open:inline">−</span></summary><p className="max-w-prose pb-4">{body}</p></details>)}
        </section>
        <section id="help" className="scroll-mt-24 border-t pt-6">
          <h2 className="text-2xl">{copy.help}</h2>
          <div className="my-4 flex flex-wrap gap-5 text-primary underline"><Link href="/legal-aid">{copy.legal}</Link><Link href="/support/reputation">{copy.reputation}</Link><Link href={screener}>{copy.start}</Link></div>
          <p className="text-sm text-muted-foreground">{copy.note}</p>
        </section>
      </div>
    </ScanFirstPageFrame>
  );
}
