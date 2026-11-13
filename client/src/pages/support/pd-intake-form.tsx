import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Printer } from "lucide-react";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import "./pd-intake-form.css";

const sections = ["personal", "support", "housing", "financial", "legalHistory", "immigration", "additional"] as const;

function Sheet({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <article className="pd-intake-sheet">
      <div className="pd-intake-folio"><span>{title}</span><span>{number} / 4</span></div>
      {children}
    </article>
  );
}

function FieldRow({ label }: { label: string }) {
  return <div className="pd-intake-field">{label}<div className="pd-intake-line" /></div>;
}

function BlankLines({ count }: { count: number }) {
  return <div>{Array.from({ length: count }, (_, i) => <div className="pd-intake-line" key={i} />)}</div>;
}

function CheckboxRow({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="pd-intake-field">
      <p>{label}</p>
      <ul className="pd-intake-options">{options.map(option => <li key={option}>{option}</li>)}</ul>
    </div>
  );
}

export default function PdIntakeForm() {
  const { t } = useTranslation();
  useScrollToTop();
  const formTitle = t("pdIntakeForm.formTitle");
  return (
    <ScanFirstPageFrame mainClassName="pd-intake-page">
      <header>
        <p>{t("pdIntakeForm.badge")}</p>
        <h1>{t("pdIntakeForm.title")}</h1>
        <p>{t("pdIntakeForm.intro")}</p>
        <p className="pd-intake-privacy">{t("pdIntakeForm.privacyNote")}</p>
        <div className="pd-intake-actions">
          <Button type="button" onClick={() => window.print()}><Printer aria-hidden="true" />{t("pdIntakeForm.printButton")}</Button>
          <Link href="/support/court-logistics">{t("pdIntakeForm.backToCourtLogistics")}</Link>
        </div>
      </header>
      <details className="pd-intake-index">
        <summary>{t("pdIntakeForm.sectionIndex")}</summary>
        <nav aria-label={t("pdIntakeForm.sectionIndex")}>
          {sections.map((key, i) => <a key={key} href={"#intake-" + key}>{i + 1}. {t("pdIntakeForm.sections." + key + ".title")}</a>)}
        </nav>
      </details>
      <Sheet number={1} title={formTitle}>
        <p>{t("pdIntakeForm.printIntro")}</p>
        <section id="intake-personal">
          <h2>1. {t("pdIntakeForm.sections.personal.title")}</h2>
          <FieldRow label={t("pdIntakeForm.sections.personal.fullName")} />
          <FieldRow label={t("pdIntakeForm.sections.personal.preferredName")} />
          <div className="md:flex md:gap-4 print:flex print:gap-4">
            <div className="flex-1">
              <FieldRow label={t("pdIntakeForm.sections.personal.dob")} />
            </div>
            <div className="flex-1">
              <FieldRow label={t("pdIntakeForm.sections.personal.phone")} />
            </div>
          </div>
          <FieldRow label={t("pdIntakeForm.sections.personal.address")} />
          <FieldRow label={t("pdIntakeForm.sections.personal.email")} />
          <FieldRow label={t("pdIntakeForm.sections.personal.language")} />
        </section>
      </Sheet>
      <Sheet number={2} title={formTitle}>
        <section id="intake-support">
          <h2>2. {t("pdIntakeForm.sections.support.title")}</h2>
          <FieldRow label={t("pdIntakeForm.sections.support.emergencyContact")} />
          <FieldRow label={t("pdIntakeForm.sections.support.emergencyPhone")} />
          <CheckboxRow
            label={t("pdIntakeForm.sections.support.hasDependents")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <FieldRow label={t("pdIntakeForm.sections.support.howManyDependents")} />
          <CheckboxRow
            label={t("pdIntakeForm.sections.support.employed")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <FieldRow label={t("pdIntakeForm.sections.support.employerName")} />
          <FieldRow label={t("pdIntakeForm.sections.support.employerAddress")} />
          <CheckboxRow
            label={t("pdIntakeForm.sections.support.student")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.support.veteran")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
        </section>
        <section id="intake-housing">
          <h2>3. {t("pdIntakeForm.sections.housing.title")}</h2>
          <CheckboxRow
            label={t("pdIntakeForm.sections.housing.situation")}
            options={[
              t("pdIntakeForm.options.rent"),
              t("pdIntakeForm.options.own"),
              t("pdIntakeForm.options.stayingWith"),
              t("pdIntakeForm.options.shelter"),
              t("pdIntakeForm.options.other"),
            ]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.housing.stability")}
            options={[
              t("pdIntakeForm.options.stable"),
              t("pdIntakeForm.options.atRisk"),
              t("pdIntakeForm.options.noHousing"),
            ]}
          />
        </section>
      </Sheet>
      <Sheet number={3} title={formTitle}>
        <section id="intake-financial">
          <h2>4. {t("pdIntakeForm.sections.financial.title")}</h2>
          <FieldRow label={t("pdIntakeForm.sections.financial.monthlyIncome")} />
          <CheckboxRow
            label={t("pdIntakeForm.sections.financial.outstandingDebts")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.financial.healthInsurance")}
            options={[
              t("pdIntakeForm.options.yes"),
              t("pdIntakeForm.options.no"),
            ]}
          />
          <FieldRow label={t("pdIntakeForm.sections.financial.insuranceType")} />
        </section>
        <section id="intake-legalHistory">
          <h2>5. {t("pdIntakeForm.sections.legalHistory.title")}</h2>
          <p className="text-xs text-muted-foreground mb-4 italic print:text-gray-600">
            {t("pdIntakeForm.sections.legalHistory.note")}
          </p>
          <CheckboxRow
            label={t("pdIntakeForm.sections.legalHistory.everArrested")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.legalHistory.everConvicted")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.legalHistory.probationParole")}
            options={[
              t("pdIntakeForm.options.no"),
              t("pdIntakeForm.options.completed"),
              t("pdIntakeForm.options.currentlyOn"),
            ]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.legalHistory.expunged")}
            options={[t("pdIntakeForm.options.yes"), t("pdIntakeForm.options.no")]}
          />
        </section>
      </Sheet>
      <Sheet number={4} title={formTitle}>
        <section id="intake-immigration">
          <h2>6. {t("pdIntakeForm.sections.immigration.title")}</h2>
          <p className="text-xs text-muted-foreground mb-4 italic print:text-gray-600">
            {t("pdIntakeForm.sections.immigration.note")}
          </p>
          <CheckboxRow
            label={t("pdIntakeForm.sections.immigration.usCitizen")}
            options={[
              t("pdIntakeForm.options.yes"),
              t("pdIntakeForm.options.no"),
              t("pdIntakeForm.options.preferNotSay"),
            ]}
          />
          <CheckboxRow
            label={t("pdIntakeForm.sections.immigration.concerns")}
            options={[
              t("pdIntakeForm.options.yes"),
              t("pdIntakeForm.options.no"),
              t("pdIntakeForm.options.preferNotSay"),
            ]}
          />
        </section>
        <section id="intake-additional">
          <h2>7. {t("pdIntakeForm.sections.additional.title")}</h2>
          <p className="text-sm text-muted-foreground mb-2 print:text-black">
            {t("pdIntakeForm.sections.additional.anythingElse")}
          </p>
          <BlankLines count={4} />
          <p className="text-sm text-muted-foreground mb-2 print:text-black">
            {t("pdIntakeForm.sections.additional.medications")}
          </p>
          <BlankLines count={3} />
        </section>
        <p className="pd-intake-end">{t("pdIntakeForm.formFooter")}</p>
      </Sheet>
    </ScanFirstPageFrame>
  );
}
