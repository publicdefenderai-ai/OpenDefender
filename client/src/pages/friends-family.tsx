import { BrandShieldIcon } from "@/components/brand-logo";
import { useEffect } from "react";
import { friendsFamilyDesignCopy } from "@/locales/friends-family-design";
import { Users, Phone, FileText, Clock, Heart, MessageSquare, AlertCircle, AlertTriangle, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function FriendsFamily() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('es') ? 'es' : i18n.language.startsWith('zh') ? 'zh' : 'en';
  const copy = friendsFamilyDesignCopy[language];
  useEffect(() => {
    const reveal = () => {
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      const details = target.closest('details') ?? (target.matches('.family-step') ? target.querySelector('details') : null);
      if (details) details.open = true;
      requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
    };
    reveal(); window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

<div className="family-page">
<section className="family-hero"><div>
  <p className="family-eyebrow">{t('friendsFamily.hero.title')}</p>
  <h1>{copy.title1}<br/><em>{copy.title2}</em></h1>
  <p>{t('friendsFamily.hero.subtitle')}</p>
  <div className="family-links"><a href="#ff-actions">{copy.start}</a><Link href="/friends-family/toolkit">{copy.toolkit}</Link></div>
</div><img className="family-art" src="/images/design/friends-family-helping-hands.png" alt="" aria-hidden="true" width="480" height="480" /></section>
<nav className="family-nav" aria-label={copy.navigation}>
{copy.sections.map((label,index)=><a key={label} href={'#'+['ff-actions','ff-supervision','ff-tracking','ff-impacts','ff-warnings','ff-long-term'][index]}>{label}</a>)}
</nav>
      {/* Immediate Actions */}
      <section className="family-section" id="ff-actions">
        <div className="max-w-5xl mx-auto px-4">

            <Alert className="mb-12 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>{t('friendsFamily.criticalAlert.title')}</strong> {t('friendsFamily.criticalAlert.text')}
              </AlertDescription>
            </Alert>



            <h2 className="family-section-title">
              {t('friendsFamily.sectionTitle')}
            </h2>


          <div className="space-y-6">
            {/* Step 1 */}

              <article className="family-step" id="ff-step-1"><span className="family-step-number" aria-hidden="true">1</span><div><h3>{t('friendsFamily.step1.title')}</h3><p className="text-muted-foreground">
                    {t('friendsFamily.step1.description')}
                  </p><details open><summary>{copy.details}</summary><div className="family-step-body">


                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="family-panel">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('friendsFamily.step1.howToFindTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-foreground">
                        <li>• {t('friendsFamily.step1.howToFind1')}</li>
                        <li>• {t('friendsFamily.step1.howToFind2')}</li>
                        <li>• {t('friendsFamily.step1.howToFind3')}</li>
                        <li>• {t('friendsFamily.step1.howToFind4')}</li>
                      </ul>
                    </div>

                    <div className="family-panel">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('friendsFamily.step1.infoToProvideTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-foreground">
                        <li>• {t('friendsFamily.step1.infoToProvide1')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide2')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide3')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide4')}</li>
                      </ul>
                    </div>
                  </div>
                </div></details></div></article>


            {/* Step 2 */}

              <article className="family-step" id="ff-step-2"><span className="family-step-number" aria-hidden="true">2</span><div><h3>{t('friendsFamily.step2.title')}</h3><p className="text-muted-foreground">
                    {t('friendsFamily.step2.description')}
                  </p><details><summary>{copy.details}</summary><div className="family-step-body">


                  <div className="space-y-3">
                    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <strong>{t('friendsFamily.step2.alertTitle')}</strong> {t('friendsFamily.step2.alertText')}
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg flex flex-col">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.publicDefenderTitle')}</h4>
                        <p className="text-sm text-muted-foreground flex-1">
                          {t('friendsFamily.step2.publicDefenderDesc')}
                        </p>
                        <Link
                          href="/right-to-counsel"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {t('friendsFamily.step2.publicDefenderLink')}

                        </Link>
                      </div>

                      <div className="bg-muted p-4 rounded-lg flex flex-col">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.legalAidTitle')}</h4>
                        <p className="text-sm text-muted-foreground flex-1">
                          {t('friendsFamily.step2.legalAidDesc')}
                        </p>
                        <Link
                          href="/legal-aid"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {t('friendsFamily.step2.legalAidLink')}

                        </Link>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.privateAttorneyTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('friendsFamily.step2.privateAttorneyDesc')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-border bg-background p-4">
                      <h4 className="font-semibold text-sm mb-2">{t('friendsFamily.step2.alternativeCounselTitle')}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('friendsFamily.step2.alternativeCounselText')}
                      </p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          {t('friendsFamily.step2.alternativeCounselCheck')}
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          {t('friendsFamily.step2.alternativeCounselAsk')}
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                      <h4 className="font-semibold text-sm mb-2">{t('friendsFamily.step2.bailPreparationTitle')}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('friendsFamily.step2.bailPreparationText')}
                      </p>
                      <Link
                        href="/support/court-logistics/bail-preparation"
                        className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        {t('friendsFamily.step2.bailPreparationLink')}
                      </Link>
                    </div>

                    <div className="mt-4 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 p-4">
                      <h4 className="font-semibold text-sm mb-2">{t('friendsFamily.step2.drugCaseTitle')}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t('friendsFamily.step2.drugCaseText')}
                      </p>
                      <Link
                        href="/support/mental-health#treatment-connection"
                        className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                      >
                        {t('friendsFamily.step2.drugCaseLink')}
                      </Link>
                    </div>
                  </div>
                </div></details></div></article>


            {/* Step 3 */}

              <article className="family-step" id="ff-step-3"><span className="family-step-number" aria-hidden="true">3</span><div><h3>{t('friendsFamily.step3.title')}</h3><p className="text-muted-foreground mb-4">
                    {t('friendsFamily.step3.description')}
                  </p><details><summary>{copy.details}</summary><div className="family-step-body">


                  <div className="family-panel">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('friendsFamily.step3.keyInfoTitle')}
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-foreground">
                      <li>• {t('friendsFamily.step3.keyInfo1')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo2')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo3')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo4')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo5')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo6')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo7')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo8')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo9')}</li>
                    </ul>
                  </div>

                  <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground leading-relaxed">
                    {t('friendsFamily.step3.prosecutorNote')}{" "}
                    <Link href="/legal-glossary?search=prosecutor" className="underline underline-offset-2 font-medium text-foreground hover:text-foreground/80 transition-colors">
                      {t('friendsFamily.step3.prosecutorCta')} →
                    </Link>
                  </div>

                  {/* Toolkit prompt — contextual entry inside Step 3 */}
                  <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{t('friendsFamily.step3.toolkitPromptTitle')}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t('friendsFamily.step3.toolkitPromptText')}</p>
                    </div>
                    <Link href="/friends-family/toolkit" className="flex-shrink-0">
                      <span>
                        {t('friendsFamily.step3.toolkitPromptButton')} →
                      </span>
                    </Link>
                  </div>
                </div></details></div></article>


            {/* Step 4 */}

              <article className="family-step" id="ff-step-4"><span className="family-step-number" aria-hidden="true">4</span><div><h3>{t('friendsFamily.step4.title')}</h3><p className="text-muted-foreground">
                    {t('friendsFamily.step4.description')}
                  </p><details><summary>{copy.details}</summary><div className="family-step-body">


                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">{t('friendsFamily.step4.bailOptionsTitle')}</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-foreground flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.cashBailTitle')}</strong> {t('friendsFamily.step4.cashBailDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-foreground flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.bailBondTitle')}</strong> {t('friendsFamily.step4.bailBondDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-foreground flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.propertyBondTitle')}</strong> {t('friendsFamily.step4.propertyBondDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-foreground flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.rorTitle')}</strong> {t('friendsFamily.step4.rorDesc')}</span>
                        </li>
                      </ul>
                    </div>

                    <Alert className="h-fit">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{t('friendsFamily.step4.warningTitle')}</strong> {t('friendsFamily.step4.warningText')}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div></details></div></article>


            {/* Step 5 */}

              <article className="family-step" id="ff-step-5"><span className="family-step-number" aria-hidden="true">5</span><div><h3>{t('friendsFamily.step5.title')}</h3><p className="text-muted-foreground mb-4">
                    {t('friendsFamily.step5.description')}
                  </p><details><summary>{copy.details}</summary><div className="family-step-body">


                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="family-panel">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('friendsFamily.step5.practicalHelpTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-foreground">
                        <li>• {t('friendsFamily.step5.practicalHelp1')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp2')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp3')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp4')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp5')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp6')}</li>
                        <li>• {t('friendsFamily.step5.reentryLead')}{" "}
                          <Link href="/support/reentry" className="underline underline-offset-2 font-medium">
                            {t('friendsFamily.step5.reentryLink')} →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="family-panel">
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('friendsFamily.step5.emotionalSupportTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-foreground">
                        <li>• {t('friendsFamily.step5.emotionalSupport1')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport2')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport3')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport4')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport5')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport6')}</li>
                      </ul>
                    </div>
                  </div>
                </div></details></div></article>

          </div>
        </div>
      </section>

      {/* Probation / Parole — family-specific section */}
      <section className="family-section" id="ff-supervision">
        <div className="max-w-5xl mx-auto px-4">

            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{t('friendsFamily.probationParole.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('friendsFamily.probationParole.sectionSubtitle')}</p>
              </div>
            </div>


          <div className="grid md:grid-cols-2 gap-4">

              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.holdTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.holdText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.facilityTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.facilityText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.parallelTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.parallelText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.poTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.poText')}</p>

              </div>

          </div>


            <p className="text-xs text-muted-foreground mt-4 px-1">{t('friendsFamily.probationParole.disclaimer')}</p>

        </div>
      </section>

      {/* Following the Case */}
      <section className="family-section" id="ff-tracking">
        <div className="max-w-5xl mx-auto px-4">

            <div className="flex items-start gap-3 mb-6">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{t('friendsFamily.followingCase.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('friendsFamily.followingCase.sectionSubtitle')}</p>
              </div>
            </div>


          <div className="grid md:grid-cols-2 gap-4">

              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.courtDocketTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.courtDocketText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.hearingDatesTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.hearingDatesText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.vineTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.vineText')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.federalTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.federalText')}</p>

              </div>

          </div>


            <p className="text-xs text-muted-foreground mt-4 px-1">{t('friendsFamily.followingCase.continuanceNote')}</p>

        </div>
      </section>

      {/* What else may be at risk */}
      <section className="family-section" id="ff-impacts">
        <div className="max-w-5xl mx-auto px-4">

            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{t('friendsFamily.atRisk.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('friendsFamily.atRisk.sectionSubtitle')}</p>
              </div>
            </div>


          <div className="grid md:grid-cols-2 gap-4">

              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.employment.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.employment.text')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.housing.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.housing.text')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.benefits.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.benefits.text')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.immigration.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.immigration.text')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.custody.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.custody.text')}</p>

              </div>



              <div className="family-note">

                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.atRisk.firearms.title')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.atRisk.firearms.text')}</p>

              </div>

          </div>


            <div className="mt-5 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>{t('friendsFamily.atRisk.warningStrong')}</strong>{t('friendsFamily.atRisk.warningText')}{' '}
                <Link href="/collateral-consequences" className="underline font-semibold hover:text-amber-900 dark:hover:text-amber-100">{t('friendsFamily.atRisk.warningCta')}</Link>
              </p>
            </div>

        </div>
      </section>

      {/* Important Warnings */}
      <section className="family-section" id="ff-warnings">
        <div className="max-w-5xl mx-auto px-4">

            <h2 className="family-section-title">
              {t('friendsFamily.warnings.title')}
            </h2>


          <div className="grid md:grid-cols-2 gap-6">

              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>{t('friendsFamily.warnings.jailCallsTitle')}</strong> {t('friendsFamily.warnings.jailCallsText')}
                </AlertDescription>
              </Alert>



              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>{t('friendsFamily.warnings.interferenceTitle')}</strong> {t('friendsFamily.warnings.interferenceText')}
                </AlertDescription>
              </Alert>

          </div>


            <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="flex items-start gap-3">
                  <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
                  <span><strong>{t('friendsFamily.disclaimer.title')}</strong> {t('friendsFamily.disclaimer.text')}</span>
                </div>
              </AlertDescription>
            </Alert>

        </div>
      </section>

      {/* Long-term support — for families beyond the first 48 hours */}
      <section className="family-section" id="ff-long-term">
        <div className="max-w-5xl mx-auto px-4">

            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-slate-500" />
              <h2 className="text-xl font-bold text-foreground">{t('friendsFamily.longTerm.sectionTitle')}</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl">{t('friendsFamily.longTerm.sectionSubtitle')}</p>


          <div className="grid md:grid-cols-2 gap-5">

              <div className="family-note">

                  <h3 className="text-sm font-semibold text-foreground mb-3">{t('friendsFamily.longTerm.contact.title')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.contact.item1')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.contact.item2')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.contact.item3')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.contact.item4')}</li>
                  </ul>

              </div>



              <div className="family-note">

                  <h3 className="text-sm font-semibold text-foreground mb-3">{t('friendsFamily.longTerm.financial.title')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.financial.item1')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.financial.item2')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.financial.item3')}</li>
                  </ul>

              </div>



              <div className="family-note">

                  <h3 className="text-sm font-semibold text-foreground mb-3">{t('friendsFamily.longTerm.caseSupport.title')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.caseSupport.item1')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.caseSupport.item2')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.caseSupport.item3')}</li>
                  </ul>

              </div>



              <div className="family-note">

                  <h3 className="text-sm font-semibold text-foreground mb-3">{t('friendsFamily.longTerm.release.title')}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.release.item1')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.release.item2')}</li>
                    <li className="flex items-start gap-2"><span className="flex-shrink-0 mt-0.5">•</span>{t('friendsFamily.longTerm.release.item3')}</li>
                  </ul>
                  <Link href="/support/reentry" className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline mt-3">
                    {t('friendsFamily.longTerm.release.linkText')}
                  </Link>

              </div>

          </div>


            <div className="mt-6 rounded-xl border border-border bg-muted/20 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">{t('friendsFamily.longTerm.selfCare.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.longTerm.selfCare.text')}</p>
              <Link href="/support/mental-health" className="inline-flex items-center gap-1 text-sm font-medium text-foreground underline underline-offset-2 hover:no-underline mt-3">
                {t('friendsFamily.longTerm.selfCare.linkText')}
              </Link>
            </div>

        </div>
      </section>

      {/* Bottom toolkit CTA */}
      <section className="py-10 bg-background border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4">

            <div className="rounded-2xl border border-border bg-muted/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-foreground mb-1">{t('friendsFamily.toolkitCta.title')}</p>
                <p className="text-sm text-muted-foreground max-w-md">{t('friendsFamily.toolkitCta.text')}</p>
              </div>
              <Link href="/friends-family/toolkit" className="flex-shrink-0">
                <span>
                  {t('friendsFamily.toolkitCta.button')} →
                </span>
              </Link>
            </div>

        </div>
      </section>



      {/* Orientation — what this site can do for you */}
      <section className="family-section">
        <div className="max-w-5xl mx-auto px-4">

            <p className="text-base font-semibold text-foreground mb-1">{t('friendsFamily.orientation.heading')}</p>
            <p className="text-sm text-muted-foreground mb-6">{t('friendsFamily.orientation.subheading')}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/first-24-hours",
                  titleKey: "friendsFamily.orientation.first24h.title",
                  descKey:  "friendsFamily.orientation.first24h.desc",
                  ctaKey:   "friendsFamily.orientation.first24h.cta",
                },
                {
                  href: "/support",
                  titleKey: "friendsFamily.orientation.lifeSupport.title",
                  descKey:  "friendsFamily.orientation.lifeSupport.desc",
                  ctaKey:   "friendsFamily.orientation.lifeSupport.cta",
                },
                {
                  href: "/case-guidance",
                  titleKey: "friendsFamily.orientation.guidance.title",
                  descKey:  "friendsFamily.orientation.guidance.desc",
                  ctaKey:   "friendsFamily.orientation.guidance.cta",
                },
              ].map(({ href, titleKey, descKey, ctaKey }) => (
                <Link key={href} href={href}>
                  <div
                    className="family-route"
                  >

                    <p className="font-semibold text-foreground text-sm mb-1">{t(titleKey)}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t(descKey)}</p>
                    <p className="family-route-action">
                      {t(ctaKey)} <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>

        </div>
      </section>

      {/* Privacy Footer Banner */}
      <div className="family-privacy">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <BrandShieldIcon size={16} />
            <span className="text-sm font-medium">
              <strong>{t('friendsFamily.privacyBanner.title')}</strong> {t('friendsFamily.privacyBanner.text')}
            </span>
          </div>
        </div>
      </div>
</div>
      <Footer />
    </div>
  );
}
