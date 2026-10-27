import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type UrgentSituation = "arrested" | "charged" | "family";

// One source for the existing guidance in both the dialog and shareable pages.
export function UrgentGuidance({ situation, onBack, onNavigate, standalone = false }: {
  situation: UrgentSituation;
  onBack?: () => void;
  onNavigate?: () => void;
  standalone?: boolean;
}) {
  const { t } = useTranslation();
  const SectionHeading = standalone ? "h2" : "h3";
  const StepHeading = standalone ? "h3" : "h4";
  return <>
            {/* Just arrested */}
            {situation === "arrested" && (
              <div className="urgent-detail">
                {onBack && <button onClick={onBack} className="urgent-back">{t("home.urgentHelp.back")}</button>}
                <Alert className="urgent-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="urgent-warning-text">
                    <strong>{t("home.urgentHelp.arrestWarning")}</strong> {t("home.urgentHelp.arrestWarningText")}
                  </AlertDescription>
                </Alert>
                <div className="urgent-section">
                  <div>
                    <SectionHeading tabIndex={-1}>{t("home.urgentHelp.immediateActions")}</SectionHeading>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.stayCalmTitle"), body: t("home.urgentHelp.stayCalmText") },
                        { title: t("home.urgentHelp.assertRightsTitle"), body: `${t("home.urgentHelp.assertRightsText1")} ${t("home.urgentHelp.assertRightsText2")}` },
                        { title: t("home.urgentHelp.noConsentTitle"), body: t("home.urgentHelp.noConsentText") },
                        { title: t("home.urgentHelp.publicDefenderTitle"), body: t("home.urgentHelp.publicDefenderText") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <StepHeading className="font-semibold text-sm">{step.title.replace(/^\d+[.)]\s*/, '')}</StepHeading>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/first-24-hours" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.full24HourGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.full24HourGuideSub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.jailPhoneCallGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.jailPhoneCallGuideSub")}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Charged and released */}
            {situation === "charged" && (
              <div className="urgent-detail">
                {onBack && <button onClick={onBack} className="urgent-back">{t("home.urgentHelp.back")}</button>}
                <div className="urgent-section">
                  <div>
                    <SectionHeading tabIndex={-1}>{t("home.urgentHelp.chargedSectionTitle")}</SectionHeading>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.chargedStep1Title"), body: t("home.urgentHelp.chargedStep1Body") },
                        { title: t("home.urgentHelp.chargedStep2Title"), body: t("home.urgentHelp.chargedStep2Body") },
                        { title: t("home.urgentHelp.chargedStep3Title"), body: t("home.urgentHelp.chargedStep3Body") },
                        { title: t("home.urgentHelp.chargedStep4Title"), body: t("home.urgentHelp.chargedStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <StepHeading className="font-semibold text-sm">{step.title.replace(/^\d+[.)]\s*/, '')}</StepHeading>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/case-guidance" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.chargedLinkLabel")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.chargedLinkSub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/support/court-logistics/bail-preparation" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">Bail Preparation Checklist</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">Gather documentation before the bail hearing</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Helping family */}
            {situation === "family" && (
              <div className="urgent-detail">
                {onBack && <button onClick={onBack} className="urgent-back">{t("home.urgentHelp.back")}</button>}
                <div className="urgent-section">
                  <div>
                    <SectionHeading tabIndex={-1}>{t("home.urgentHelp.familySectionTitle")}</SectionHeading>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.familyStep1Title"), body: t("home.urgentHelp.familyStep1Body") },
                        { title: t("home.urgentHelp.familyStep2Title"), body: t("home.urgentHelp.familyStep2Body") },
                        { title: t("home.urgentHelp.familyStep3Title"), body: t("home.urgentHelp.familyStep3Body") },
                        { title: t("home.urgentHelp.familyStep4Title"), body: t("home.urgentHelp.familyStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <StepHeading className="font-semibold text-sm">{step.title.replace(/^\d+[.)]\s*/, '')}</StepHeading>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/friends-family" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink1Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink1Sub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={onNavigate}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink2Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink2Sub")}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

  </>;
}
