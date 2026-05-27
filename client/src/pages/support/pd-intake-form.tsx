import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Printer, FileText, Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// A blank line component used throughout the form
function BlankLine({ wide = false }: { wide?: boolean }) {
  return (
    <div
      className={`border-b border-gray-400 dark:border-gray-600 print:border-gray-700 mt-1 mb-4 ${wide ? "w-full" : "w-full"}`}
      style={{ minHeight: "1.5rem" }}
    />
  );
}

function BlankLines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <BlankLine key={i} />
      ))}
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mt-8 mb-4 pb-2 border-b-2 border-amber-400 print:border-gray-700">
      <h2 className="text-base font-bold text-foreground print:text-black">
        {number}. {title}
      </h2>
    </div>
  );
}

function FieldRow({ label, halfWidth = false }: { label: string; halfWidth?: boolean }) {
  return (
    <div className={`mb-4 ${halfWidth ? "inline-block w-full md:w-1/2 pr-4 print:w-1/2" : "block"}`}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 print:text-black print:text-xs">
        {label}
      </p>
      <BlankLine />
    </div>
  );
}

function CheckboxRow({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-foreground mb-2 print:text-black">{label}</p>
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <span key={opt} className="flex items-center gap-2 text-sm text-muted-foreground print:text-black">
            <span className="inline-block w-4 h-4 border border-gray-400 print:border-gray-700 rounded-sm shrink-0" />
            {opt}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PdIntakeForm() {
  const { t } = useTranslation();
  useScrollToTop();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Screen-only intro section */}
        <div className="print:hidden bg-gradient-to-br from-amber-500/5 via-background to-background border-b border-border/40">
          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge
                  variant="outline"
                  className="border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40"
                >
                  {t("pdIntakeForm.badge")}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {t("pdIntakeForm.title")}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("pdIntakeForm.intro")}
              </p>

              <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 mb-6">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                  {t("pdIntakeForm.privacyNote")}
                </AlertDescription>
              </Alert>

              <Button
                onClick={handlePrint}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Printer className="h-4 w-4" />
                {t("pdIntakeForm.printButton")}
              </Button>

              <div className="mt-4">
                <Link href="/support/court-logistics" className="text-sm text-primary hover:underline">
                  {t("pdIntakeForm.backToCourtLogistics")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 py-10 print:px-0 print:py-0 print:max-w-none">
          {/* Print-only header */}
          <div className="hidden print:block mb-6">
            <h1 className="text-2xl font-bold text-black border-b-2 border-gray-700 pb-3 mb-2">
              {t("pdIntakeForm.formTitle")}
            </h1>
            <p className="text-xs text-gray-600 italic">{t("pdIntakeForm.printIntro")}</p>
          </div>

          {/* Section 1: Personal Information */}
          <SectionHeader number="1" title={t("pdIntakeForm.sections.personal.title")} />
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

          {/* Section 2: Support System */}
          <SectionHeader number="2" title={t("pdIntakeForm.sections.support.title")} />
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

          {/* Section 3: Housing */}
          <SectionHeader number="3" title={t("pdIntakeForm.sections.housing.title")} />
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

          {/* Section 4: Financial Information */}
          <SectionHeader number="4" title={t("pdIntakeForm.sections.financial.title")} />
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

          {/* Section 5: Prior Legal History */}
          <SectionHeader number="5" title={t("pdIntakeForm.sections.legalHistory.title")} />
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

          {/* Section 6: Immigration */}
          <SectionHeader number="6" title={t("pdIntakeForm.sections.immigration.title")} />
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

          {/* Section 7: Additional Information */}
          <SectionHeader number="7" title={t("pdIntakeForm.sections.additional.title")} />
          <p className="text-sm text-muted-foreground mb-2 print:text-black">
            {t("pdIntakeForm.sections.additional.anythingElse")}
          </p>
          <BlankLines count={4} />
          <p className="text-sm text-muted-foreground mb-2 print:text-black">
            {t("pdIntakeForm.sections.additional.medications")}
          </p>
          <BlankLines count={3} />

          {/* Footer note */}
          <div className="mt-10 pt-4 border-t border-gray-300 dark:border-gray-700 print:border-gray-500">
            <p className="text-xs text-muted-foreground italic print:text-gray-600 print:text-xs">
              {t("pdIntakeForm.formFooter")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
