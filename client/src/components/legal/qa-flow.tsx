import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { JuryInstructionBadge } from "@/components/legal/jury-instruction-badge";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, ArrowLeft, X, ExternalLink, Scale, MessageSquare, AlertTriangle, Briefcase, Users, Home, DollarSign, Car, Heart, Globe, Shield, ChevronDown, Plus, Search, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { criminalCharges, getChargesByJurisdiction, chargeCategories, normalizeChargeIds, getVerifiedCitation, isCitationVerified, getVerifiedSourceUrl, isChargeInOverlay, getPrimaryStatuteIndex, getInstructionRef, getInstructionUrl, getInstructionPaywall } from "@shared/criminal-charges";
import { getStatuteUrl, getOfficialStatuteSite, buildCaLeginfoUrlFromCitation } from "@shared/statute-citation-generator";
import { TurnstileCaptcha, useCaptcha } from "@/components/captcha/turnstile";
import { shouldShowCaseStageWarning, QA_FLOW_STATUS_STEP_INDEX } from "./qa-flow-guard";

interface QAFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  onFindLawyer?: () => void;
  onClearSession?: () => void;
  clearSessionDialog?: ReactNode;
  initialData?: Partial<QAFormData>;
  reviewAnswers?: boolean;
}

interface QAFormData {
  jurisdiction: string;
  charges: string[];
  chargesUnknown: boolean;
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean | null;
  consentGiven: boolean;
  guidanceMode: 'ai' | 'rules';
  selectedConcerns: string[];
  civilUrgency: Record<string, 'none' | 'active' | 'emergency'>;
  supervisionStatus: string;
  priorConvictions: boolean | null;
  citizenshipStatus: string;
  hasMinorChildren: boolean | null;
  hasProfessionalLicense: boolean | null;
  hasHousingAssistance: boolean | null;
  schoolZoneStatus: string;
}
export function QAFlow({
  onComplete,
  onCancel,
  onFindLawyer,
  onClearSession,
  clearSessionDialog,
  initialData,
  reviewAnswers = false,
}: QAFlowProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCaseStageWarning, setShowCaseStageWarning] = useState(false);
  const { token: captchaToken, setToken: setCaptchaToken, isRequired: captchaRequired } = useCaptcha();
  const [formData, setFormData] = useState<QAFormData>(() => ({
    ...EMPTY_FORM_DATA,
    ...initialData,
    charges: normalizeChargeIds(initialData?.charges ?? EMPTY_FORM_DATA.charges),
  }));

  const baseSteps = [
    { title: t('legalGuidance.qaFlow.steps.consent'),           component: ConsentStep },
    { title: t('legalGuidance.qaFlow.steps.jurisdiction'),      component: JurisdictionStep },
    { title: t('legalGuidance.qaFlow.steps.caseDetails'),       component: CaseDetailsStep },
    { title: t('legalGuidance.qaFlow.steps.status'),            component: StatusStep },
    { title: 'Your Situation',                                   component: BackgroundStep },
    { title: t('legalGuidance.qaFlow.steps.additionalDetails'), component: AdditionalDetailsStep },
  ];

  const steps = [
    ...baseSteps,
    { title: t('legalGuidance.qaFlow.steps.civilEmergencies'), component: CivilEmergenciesStep },
  ];

  // When a timed-out submission returns to the screener, start at the last
  // step so the user can review or edit the answers that were submitted.
  useEffect(() => {
    if (reviewAnswers) {
      setCurrentStep(steps.length - 1);
    }
  }, [reviewAnswers, steps.length]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Guard: warn if no case stage selected before submitting
      if (shouldShowCaseStageWarning(formData.caseStage)) {
        setShowCaseStageWarning(true);
        return;
      }
      onComplete({ ...formData, charges: normalizeChargeIds(formData.charges), captchaToken });
    }
  };

  const handleCaseStageWarningConfirm = () => {
    setShowCaseStageWarning(false);
    onComplete({ ...formData, charges: normalizeChargeIds(formData.charges), captchaToken });
  };

  const handleCaseStageWarningCancel = () => {
    setShowCaseStageWarning(false);
    // Navigate back to the StatusStep so the user can fill in the stage.
    // QA_FLOW_STATUS_STEP_INDEX is the authoritative constant for this index.
    setCurrentStep(QA_FLOW_STATUS_STEP_INDEX);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <CardTitle className="min-w-0 text-xl sm:text-2xl">{t('legalGuidance.qaFlow.title')}</CardTitle>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="min-h-[44px] shrink-0"
            data-testid="button-cancel-qa"
          >
            {t('legalGuidance.qaFlow.cancel')}
          </Button>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex flex-wrap items-center gap-2" data-testid="qa-step-indicator">
          {steps.map((_, index) => (
            <div
              key={index}
              data-testid={`qa-step-circle-${index + 1}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === currentStep 
                  ? "bg-gray-700 text-white" 
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t('legalGuidance.qaFlow.stepProgress', { current: currentStep + 1, total: steps.length, title: steps[currentStep].title })}
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              onNext={nextStep}
              onPrev={prevStep}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
              captchaRequired={captchaRequired}
            />
          </motion.div>
        </AnimatePresence>

        {/* Privacy Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {t('legalGuidance.qaFlow.privacyNotice')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSession}
            className="min-h-[44px] self-start text-xs text-red-600 hover:text-red-700"
          >
            {t('legalGuidance.qaFlow.clearSession.button')}
          </Button>
        </div>
      </CardContent>

    </Card>

      {clearSessionDialog}

      {/* Case stage warning dialog */}
      <AlertDialog open={showCaseStageWarning} onOpenChange={setShowCaseStageWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('legalGuidance.qaFlow.caseStageWarning.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('legalGuidance.qaFlow.caseStageWarning.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCaseStageWarningCancel} data-testid="button-case-stage-warning-back">
              {t('legalGuidance.qaFlow.caseStageWarning.goBack')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCaseStageWarningConfirm} data-testid="button-case-stage-warning-continue">
              {t('legalGuidance.qaFlow.caseStageWarning.continueAnyway')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ConsentStep({ formData, updateFormData, onNext }: any) {
  const { t } = useTranslation();

  const handleChooseMode = (mode: 'ai' | 'rules') => {
    updateFormData("guidanceMode", mode);
    updateFormData("consentGiven", true);
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.consent.title')}</h3>

        <ul className="space-y-4 text-sm mb-5">
          <li className="flex items-start gap-3">
            <Scale className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{t('legalGuidance.qaFlow.consent.bullet1Head')}</strong>{' '}
              {t('legalGuidance.qaFlow.consent.bullet1Body')}
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">
              <strong className="text-foreground">{t('legalGuidance.qaFlow.consent.bullet2Head')}</strong>{' '}
              {t('legalGuidance.qaFlow.consent.bullet2Body')}
            </span>
          </li>
        </ul>

        <div className="grid sm:grid-cols-2 gap-3">
          {/* Card A — AI Guidance */}
          <button
            onClick={() => handleChooseMode('ai')}
            data-testid="button-choose-ai"
            className="text-left border-2 border-blue-200 hover:border-blue-500 rounded-lg p-4 space-y-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-foreground">
                {t('legalGuidance.qaFlow.consent.cardATitle')}
              </span>
              <Badge className="bg-blue-600 text-white text-xs px-2 py-0">
                {t('legalGuidance.qaFlow.consent.cardARecommended')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('legalGuidance.qaFlow.consent.cardABody')}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {t('legalGuidance.qaFlow.consent.cardATime')}
            </p>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed border-t pt-2 mt-1">
              {t('legalGuidance.qaFlow.consent.cardADisclosure')}
            </p>
            <div className="pt-1">
              <span className="text-xs font-medium text-blue-600">
                {t('legalGuidance.qaFlow.consent.cardAButton')}
              </span>
            </div>
          </button>

          {/* Card B — Immediate / Rules-based */}
          <button
            onClick={() => handleChooseMode('rules')}
            data-testid="button-choose-rules"
            className="text-left border-2 border-border hover:border-green-500 rounded-lg p-4 space-y-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {t('legalGuidance.qaFlow.consent.cardBTitle')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('legalGuidance.qaFlow.consent.cardBBody')}
            </p>
            <p className="text-xs text-muted-foreground italic">
              {t('legalGuidance.qaFlow.consent.cardBTime')}
            </p>
            <div className="pt-1">
              <span className="text-xs font-medium text-green-600">
                {t('legalGuidance.qaFlow.consent.cardBButton')}
              </span>
            </div>
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          <a href="/tech-docs#ai-validation" className="underline hover:text-foreground transition-colors">
            {t('legalGuidance.qaFlow.consent.validationLink')}
          </a>
        </p>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {t('legalGuidance.qaFlow.consent.escapeHatchTitle')}
          </p>
          <a
            href="/first-24-hours"
            className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 whitespace-nowrap flex items-center gap-1 transition-colors"
          >
            {t('legalGuidance.qaFlow.consent.escapeHatchLink')} <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

const TERRITORY_CODES = new Set(["PR", "GU", "VI", "AS", "MP"]);

function JurisdictionStep({ formData, updateFormData, onNext, onPrev }: any) {
  const { t } = useTranslation();
  const isTerritory = TERRITORY_CODES.has(formData.jurisdiction);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.jurisdiction.title')}</h3>
        <Label htmlFor="jurisdiction">{t('legalGuidance.qaFlow.jurisdiction.label')}</Label>
        <Select
          value={formData.jurisdiction}
          onValueChange={(value) => updateFormData("jurisdiction", value)}
        >
          <SelectTrigger data-testid="select-jurisdiction">
            <SelectValue placeholder={t('legalGuidance.qaFlow.jurisdiction.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AL">{t('legalGuidance.qaFlow.jurisdiction.states.AL')}</SelectItem>
            <SelectItem value="AK">{t('legalGuidance.qaFlow.jurisdiction.states.AK')}</SelectItem>
            <SelectItem value="AZ">{t('legalGuidance.qaFlow.jurisdiction.states.AZ')}</SelectItem>
            <SelectItem value="AR">{t('legalGuidance.qaFlow.jurisdiction.states.AR')}</SelectItem>
            <SelectItem value="CA">{t('legalGuidance.qaFlow.jurisdiction.states.CA')}</SelectItem>
            <SelectItem value="CO">{t('legalGuidance.qaFlow.jurisdiction.states.CO')}</SelectItem>
            <SelectItem value="CT">{t('legalGuidance.qaFlow.jurisdiction.states.CT')}</SelectItem>
            <SelectItem value="DE">{t('legalGuidance.qaFlow.jurisdiction.states.DE')}</SelectItem>
            <SelectItem value="FL">{t('legalGuidance.qaFlow.jurisdiction.states.FL')}</SelectItem>
            <SelectItem value="GA">{t('legalGuidance.qaFlow.jurisdiction.states.GA')}</SelectItem>
            <SelectItem value="HI">{t('legalGuidance.qaFlow.jurisdiction.states.HI')}</SelectItem>
            <SelectItem value="ID">{t('legalGuidance.qaFlow.jurisdiction.states.ID')}</SelectItem>
            <SelectItem value="IL">{t('legalGuidance.qaFlow.jurisdiction.states.IL')}</SelectItem>
            <SelectItem value="IN">{t('legalGuidance.qaFlow.jurisdiction.states.IN')}</SelectItem>
            <SelectItem value="IA">{t('legalGuidance.qaFlow.jurisdiction.states.IA')}</SelectItem>
            <SelectItem value="KS">{t('legalGuidance.qaFlow.jurisdiction.states.KS')}</SelectItem>
            <SelectItem value="KY">{t('legalGuidance.qaFlow.jurisdiction.states.KY')}</SelectItem>
            <SelectItem value="LA">{t('legalGuidance.qaFlow.jurisdiction.states.LA')}</SelectItem>
            <SelectItem value="ME">{t('legalGuidance.qaFlow.jurisdiction.states.ME')}</SelectItem>
            <SelectItem value="MD">{t('legalGuidance.qaFlow.jurisdiction.states.MD')}</SelectItem>
            <SelectItem value="MA">{t('legalGuidance.qaFlow.jurisdiction.states.MA')}</SelectItem>
            <SelectItem value="MI">{t('legalGuidance.qaFlow.jurisdiction.states.MI')}</SelectItem>
            <SelectItem value="MN">{t('legalGuidance.qaFlow.jurisdiction.states.MN')}</SelectItem>
            <SelectItem value="MS">{t('legalGuidance.qaFlow.jurisdiction.states.MS')}</SelectItem>
            <SelectItem value="MO">{t('legalGuidance.qaFlow.jurisdiction.states.MO')}</SelectItem>
            <SelectItem value="MT">{t('legalGuidance.qaFlow.jurisdiction.states.MT')}</SelectItem>
            <SelectItem value="NE">{t('legalGuidance.qaFlow.jurisdiction.states.NE')}</SelectItem>
            <SelectItem value="NV">{t('legalGuidance.qaFlow.jurisdiction.states.NV')}</SelectItem>
            <SelectItem value="NH">{t('legalGuidance.qaFlow.jurisdiction.states.NH')}</SelectItem>
            <SelectItem value="NJ">{t('legalGuidance.qaFlow.jurisdiction.states.NJ')}</SelectItem>
            <SelectItem value="NM">{t('legalGuidance.qaFlow.jurisdiction.states.NM')}</SelectItem>
            <SelectItem value="NY">{t('legalGuidance.qaFlow.jurisdiction.states.NY')}</SelectItem>
            <SelectItem value="NC">{t('legalGuidance.qaFlow.jurisdiction.states.NC')}</SelectItem>
            <SelectItem value="ND">{t('legalGuidance.qaFlow.jurisdiction.states.ND')}</SelectItem>
            <SelectItem value="OH">{t('legalGuidance.qaFlow.jurisdiction.states.OH')}</SelectItem>
            <SelectItem value="OK">{t('legalGuidance.qaFlow.jurisdiction.states.OK')}</SelectItem>
            <SelectItem value="OR">{t('legalGuidance.qaFlow.jurisdiction.states.OR')}</SelectItem>
            <SelectItem value="PA">{t('legalGuidance.qaFlow.jurisdiction.states.PA')}</SelectItem>
            <SelectItem value="RI">{t('legalGuidance.qaFlow.jurisdiction.states.RI')}</SelectItem>
            <SelectItem value="SC">{t('legalGuidance.qaFlow.jurisdiction.states.SC')}</SelectItem>
            <SelectItem value="SD">{t('legalGuidance.qaFlow.jurisdiction.states.SD')}</SelectItem>
            <SelectItem value="TN">{t('legalGuidance.qaFlow.jurisdiction.states.TN')}</SelectItem>
            <SelectItem value="TX">{t('legalGuidance.qaFlow.jurisdiction.states.TX')}</SelectItem>
            <SelectItem value="UT">{t('legalGuidance.qaFlow.jurisdiction.states.UT')}</SelectItem>
            <SelectItem value="VT">{t('legalGuidance.qaFlow.jurisdiction.states.VT')}</SelectItem>
            <SelectItem value="VA">{t('legalGuidance.qaFlow.jurisdiction.states.VA')}</SelectItem>
            <SelectItem value="WA">{t('legalGuidance.qaFlow.jurisdiction.states.WA')}</SelectItem>
            <SelectItem value="WV">{t('legalGuidance.qaFlow.jurisdiction.states.WV')}</SelectItem>
            <SelectItem value="WI">{t('legalGuidance.qaFlow.jurisdiction.states.WI')}</SelectItem>
            <SelectItem value="WY">{t('legalGuidance.qaFlow.jurisdiction.states.WY')}</SelectItem>
            <SelectItem value="DC">{t('legalGuidance.qaFlow.jurisdiction.states.DC')}</SelectItem>
            <SelectItem value="federal">{t('legalGuidance.qaFlow.jurisdiction.states.federal')}</SelectItem>
            <SelectItem value="PR">Puerto Rico</SelectItem>
            <SelectItem value="GU">Guam</SelectItem>
            <SelectItem value="VI">U.S. Virgin Islands</SelectItem>
            <SelectItem value="AS">American Samoa</SelectItem>
            <SelectItem value="MP">Northern Mariana Islands</SelectItem>
          </SelectContent>
        </Select>

        {isTerritory && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
            <div className="space-y-1">
              <p className="font-medium">Limited coverage for U.S. territories</p>
              <p className="text-xs leading-relaxed">
                Our charge data and AI guidance are optimized for the 50 states and D.C. Territory criminal law — including local codes and federal applicability — differs significantly. The guidance you receive may not fully reflect your jurisdiction's specific statutes or procedures. We recommend verifying key details with a local attorney.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          className="min-h-[44px] sm:w-auto"
          data-testid="button-prev-jurisdiction"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.jurisdiction.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.jurisdiction}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-next-jurisdiction"
        >
          {t('legalGuidance.qaFlow.jurisdiction.continue')} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CaseDetailsStep({ formData, updateFormData, onNext, onPrev }: any) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAllCharges, setShowAllCharges] = useState(true);
  const [chargeSearchQuery, setChargeSearchQuery] = useState("");
  
  // Get charges based on selected jurisdiction (includes both state and federal charges)
  const availableCharges = getChargesByJurisdiction(formData.jurisdiction);
  
  const categoryFiltered = selectedCategory && selectedCategory !== 'all'
    ? availableCharges.filter(charge => 
        chargeCategories[selectedCategory as keyof typeof chargeCategories]?.includes(charge.id) ||
        (selectedCategory === 'Drug Offenses' &&
          charge.jurisdiction === 'NY' &&
          /^ny-/.test(charge.id) &&
          /controlled-substance|drug|sale|distribution|trafficking|manufacturing/.test(charge.id))
      )
    : availableCharges;

  const filteredCharges = chargeSearchQuery.trim()
    ? categoryFiltered.filter(charge => {
        const q = chargeSearchQuery.toLowerCase();
        return charge.name.toLowerCase().includes(q) ||
          charge.code.toLowerCase().includes(q) ||
          charge.description.toLowerCase().includes(q);
      })
    : categoryFiltered;

  const unresolvedChargeIds = formData.charges.filter(
    (id: string) => !criminalCharges.some(charge => charge.id === id),
  );

  const handleContinue = () => {
    if (unresolvedChargeIds.length > 0) {
      const recognizedCharges = formData.charges.filter(
        (id: string) => !unresolvedChargeIds.includes(id),
      );
      updateFormData("charges", recognizedCharges);
      if (recognizedCharges.length === 0) {
        updateFormData("chargesUnknown", true);
      }
    }
    onNext();
  };
  
  // Custom sorting function to group crimes with degrees together
  const sortChargesWithDegrees = (charges: any[]) => {
    return charges.sort((a, b) => {
      // Extract base crime name (remove degree indicators)
      const getBaseName = (name: string) => {
        return name.replace(/\s+(in the\s+)?(First|Second|Third|Fourth|Fifth|1st|2nd|3rd|4th|5th)\s+(Degree|Class)/i, '').trim();
      };
      
      // Extract degree from name
      const getDegreeOrder = (name: string) => {
        const degreeMatch = name.match(/(First|Second|Third|Fourth|Fifth|1st|2nd|3rd|4th|5th)/i);
        if (!degreeMatch) return 0; // No degree, sort first
        
        const degree = degreeMatch[1].toLowerCase();
        switch (degree) {
          case 'first': case '1st': return 1;
          case 'second': case '2nd': return 2;
          case 'third': case '3rd': return 3;
          case 'fourth': case '4th': return 4;
          case 'fifth': case '5th': return 5;
          default: return 5;
        }
      };
      
      const baseNameA = getBaseName(a.name);
      const baseNameB = getBaseName(b.name);
      
      // If same base crime, sort by degree
      if (baseNameA === baseNameB) {
        return getDegreeOrder(a.name) - getDegreeOrder(b.name);
      }
      
      // Otherwise sort alphabetically by base name
      return baseNameA.localeCompare(baseNameB);
    });
  };
  
  // Separate federal and state charges, then sort with degree grouping
  const federalCharges = sortChargesWithDegrees(
    filteredCharges.filter(charge => charge.id.startsWith('fed-'))
  );
  
  const stateCharges = sortChargesWithDegrees(
    filteredCharges.filter(charge => !charge.id.startsWith('fed-'))
  );
  
  // Apply "show all" logic to each section
  const displayedFederalCharges = showAllCharges ? federalCharges : federalCharges.slice(0, 4);
  const displayedStateCharges = showAllCharges ? stateCharges : stateCharges.slice(0, 4);
  
  const totalDisplayedCharges = displayedFederalCharges.length + displayedStateCharges.length;
  const totalFilteredCharges = federalCharges.length + stateCharges.length;
  
  const handleChargeToggle = (chargeId: string) => {
    const currentCharges = formData.charges || [];
    const updatedCharges = currentCharges.includes(chargeId)
      ? currentCharges.filter((id: string) => id !== chargeId)
      : [...currentCharges, chargeId];
    updateFormData("charges", updatedCharges);
  };
  
  const removeCharge = (chargeId: string) => {
    const updatedCharges = formData.charges.filter((id: string) => id !== chargeId);
    updateFormData("charges", updatedCharges);
  };
  
  const getChargeById = (id: string) => {
    return criminalCharges.find(charge => charge.id === id);
  };

  const handleChargesUnknownToggle = () => {
    const newValue = !formData.chargesUnknown;
    updateFormData("chargesUnknown", newValue);
    if (newValue) {
      updateFormData("charges", []);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.caseDetails.title')}</h3>

        <div className="space-y-4">
          {unresolvedChargeIds.length > 0 && (
            <div
              className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950/20 dark:text-amber-100"
              role="alert"
              data-testid="legacy-charge-reselection-notice"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                {t('legalGuidance.qaFlow.caseDetails.legacyChargeNotice')}
              </p>
            </div>
          )}

          {/* Selected Charges */}
          {!formData.chargesUnknown && formData.charges.length > 0 && (
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">{t('legalGuidance.qaFlow.caseDetails.selectedCharges')}</Label>
              <div className="space-y-2">
                {formData.charges.map((chargeId: string) => {
                  const charge = getChargeById(chargeId);
                  if (!charge) return null;

                  const statuteCitation = getVerifiedCitation(charge);
                  const instructionRef = getInstructionRef(charge);
                  const chargeInstructionUrl = getInstructionUrl(charge);
                  const primaryStatuteIndex = getPrimaryStatuteIndex(charge);
                  let statuteUrl: string | null = null;
                  if (isCitationVerified(charge)) {
                    if (charge.jurisdiction === 'CA' && statuteCitation) {
                      statuteUrl = buildCaLeginfoUrlFromCitation(statuteCitation, primaryStatuteIndex);
                    } else {
                      const govUrl = getVerifiedSourceUrl(charge);
                      if (govUrl) {
                        statuteUrl = govUrl;
                      } else if (!isChargeInOverlay(charge)) {
                        statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
                      }
                    }
                  }
                  const officialSite = getOfficialStatuteSite(charge.jurisdiction);
                  
                  return (
                    <div 
                      key={chargeId}
                      className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{charge.name}</span>
                            <Badge variant={charge.category === 'felony' ? 'destructive' : 'secondary'} className="text-xs">
                              {charge.category}
                            </Badge>
                          </div>
                          {statuteCitation ? (
                            <div className="flex items-center gap-2 mt-2">
                              <Scale className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                {statuteCitation}
                              </span>
                              {(statuteUrl || (officialSite && !isChargeInOverlay(charge))) && (
                                <a
                                  href={statuteUrl || officialSite || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                  data-testid={`link-statute-${charge.id}`}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span className="text-xs">View Law</span>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                                Statute reference pending - contact legal aid for details
                              </span>
                            </div>
                          )}
                          {instructionRef && (
                            <JuryInstructionBadge
                              instructionRef={instructionRef}
                              instructionUrl={chargeInstructionUrl}
                              chargeId={charge.id}
                              dataTestIdPrefix="link-instruction"
                              onLinkClick={(e) => e.stopPropagation()}
                              label={t('legalGuidance.qaFlow.caseDetails.juryInstruction')}
                              tooltipText={t('legalGuidance.qaFlow.caseDetails.juryInstructionTooltip')}
                              tooltipAriaLabel={t('legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel')}
                              className="mt-1.5"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeCharge(chargeId)}
                          className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1"
                          type="button"
                          data-testid={`button-remove-charge-${chargeId}`}
                          aria-label={`Remove charge: ${charge?.name || chargeId}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {!formData.chargesUnknown && (<>
          {/* Charge Search */}
          <div>
            <Label htmlFor="charge-search">{t('legalGuidance.qaFlow.caseDetails.searchLabel', 'Search charges')}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="charge-search"
                placeholder={t('legalGuidance.qaFlow.caseDetails.searchPlaceholder', 'Type to search (e.g. fare evasion, DUI, theft...)')}
                value={chargeSearchQuery}
                onChange={(e) => setChargeSearchQuery(e.target.value)}
                className="pl-9"
                aria-label="Search charges by name, code, or description"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label htmlFor="category">{t('legalGuidance.qaFlow.caseDetails.filterLabel')}</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger data-testid="select-charge-category">
                <SelectValue placeholder={t('legalGuidance.qaFlow.caseDetails.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('legalGuidance.qaFlow.caseDetails.allCategories')}</SelectItem>
                {Object.keys(chargeCategories)
                  .filter(category => {
                    const isStateCode = /^[A-Z]{2}$/.test(category);
                    return !isStateCode;
                  })
                  .sort((a, b) => a.localeCompare(b))
                  .map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          {/* Charge Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              {t('legalGuidance.qaFlow.caseDetails.selectLabel')} ({totalFilteredCharges} {totalFilteredCharges === 1 ? 'charge' : 'charges'})
            </Label>
            <div className="max-h-64 overflow-y-auto border rounded-md p-3 space-y-4">
              
              {totalFilteredCharges === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('legalGuidance.qaFlow.caseDetails.noResults', 'No charges found. Try a different search term or category.')}
                </p>
              )}

              {/* State Charges Section */}
              {stateCharges.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                    {t('legalGuidance.qaFlow.caseDetails.stateCharges')}
                  </h4>
                  <div className="space-y-2">
                    {displayedStateCharges.map(charge => {
                      const statuteCitation = getVerifiedCitation(charge);
                      const listInstructionRef = getInstructionRef(charge);
                      const listInstructionUrl = getInstructionUrl(charge);
                      const primaryStatuteIndex = getPrimaryStatuteIndex(charge);
                      let statuteUrl: string | null = null;
                      if (isCitationVerified(charge)) {
                        if (charge.jurisdiction === 'CA' && statuteCitation) {
                          statuteUrl = buildCaLeginfoUrlFromCitation(statuteCitation, primaryStatuteIndex);
                        } else {
                          const govUrl = getVerifiedSourceUrl(charge);
                          if (govUrl) {
                            statuteUrl = govUrl;
                          } else if (!isChargeInOverlay(charge)) {
                            statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
                          }
                        }
                      }
                      
                      return (
                        <div
                          key={charge.id}
                          className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => handleChargeToggle(charge.id)}
                        >
                          <Checkbox
                            checked={formData.charges.includes(charge.id)}
                            className="pointer-events-none"
                            data-testid={`checkbox-charge-${charge.id}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{charge.name}</span>
                              <Badge
                                variant={charge.category === 'felony' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {charge.category}
                              </Badge>
                            </div>
                            {statuteCitation && (
                              <div className="flex items-center gap-1 mb-1">
                                <Scale className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                  {statuteCitation}
                                </span>
                                {statuteUrl && (
                                  <a
                                    href={statuteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )}
                            {listInstructionRef && (
                              <JuryInstructionBadge
                                instructionRef={listInstructionRef}
                                instructionUrl={listInstructionUrl}
                                instructionPaywall={getInstructionPaywall(charge)}
                                chargeId={charge.id}
                                dataTestIdPrefix="link-instruction-list"
                                onLinkClick={(e) => e.stopPropagation()}
                                label={t('legalGuidance.qaFlow.caseDetails.juryInstruction')}
                                tooltipText={t('legalGuidance.qaFlow.caseDetails.juryInstructionTooltip')}
                                tooltipAriaLabel={t('legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel')}
                                className="mb-1"
                              />
                            )}
                            <p className="text-xs text-muted-foreground">
                              {charge.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Federal Charges Section */}
              {federalCharges.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                    {t('legalGuidance.qaFlow.caseDetails.federalCharges')}
                  </h4>
                  <div className="space-y-2">
                    {displayedFederalCharges.map(charge => {
                      const statuteCitation = getVerifiedCitation(charge);
                      const fedInstructionRef = getInstructionRef(charge);
                      const fedInstructionUrl = getInstructionUrl(charge);
                      const primaryStatuteIndex = getPrimaryStatuteIndex(charge);
                      let statuteUrl: string | null = null;
                      if (isCitationVerified(charge)) {
                        if (charge.jurisdiction === 'CA' && statuteCitation) {
                          statuteUrl = buildCaLeginfoUrlFromCitation(statuteCitation, primaryStatuteIndex);
                        } else {
                          const govUrl = getVerifiedSourceUrl(charge);
                          if (govUrl) {
                            statuteUrl = govUrl;
                          } else if (!isChargeInOverlay(charge)) {
                            statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
                          }
                        }
                      }
                      
                      return (
                        <div
                          key={charge.id}
                          className="flex items-start space-x-3 p-2 hover:bg-muted rounded cursor-pointer"
                          onClick={() => handleChargeToggle(charge.id)}
                        >
                          <Checkbox
                            checked={formData.charges.includes(charge.id)}
                            className="pointer-events-none"
                            data-testid={`checkbox-charge-${charge.id}`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{charge.name}</span>
                              <Badge
                                variant={charge.category === 'felony' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {charge.category}
                              </Badge>
                            </div>
                            {statuteCitation && (
                              <div className="flex items-center gap-1 mb-1">
                                <Scale className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                  {statuteCitation}
                                </span>
                                {statuteUrl && (
                                  <a
                                    href={statuteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            )}
                            {fedInstructionRef && (
                              <JuryInstructionBadge
                                instructionRef={fedInstructionRef}
                                instructionUrl={fedInstructionUrl}
                                instructionPaywall={getInstructionPaywall(charge)}
                                chargeId={charge.id}
                                dataTestIdPrefix="link-instruction-fed"
                                onLinkClick={(e) => e.stopPropagation()}
                                label={t('legalGuidance.qaFlow.caseDetails.juryInstruction')}
                                tooltipText={t('legalGuidance.qaFlow.caseDetails.juryInstructionTooltip')}
                                tooltipAriaLabel={t('legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel')}
                                className="mb-1"
                              />
                            )}
                            <p className="text-xs text-muted-foreground">
                              {charge.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Show More Button */}
              {!showAllCharges && totalFilteredCharges > totalDisplayedCharges && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCharges(true)}
                  className="w-full"
                >
                  {t('legalGuidance.qaFlow.caseDetails.showMore', { count: totalFilteredCharges - totalDisplayedCharges })}
                </Button>
              )}
            </div>
          </div>
          </>)}

          {formData.chargesUnknown && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong>You'll still get a useful roadmap.</strong> We'll base it on your state, where you are in the process, and anything else you share in the next steps. If you later receive paperwork or learn the charges, describe them in the "Additional Details" section for more specific guidance.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* "I don't know" option */}
      <div
        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
          formData.chargesUnknown
            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-600"
            : "border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700"
        }`}
        onClick={handleChargesUnknownToggle}
        role="checkbox"
        aria-checked={formData.chargesUnknown}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && handleChargesUnknownToggle()}
      >
        <div className="flex items-start gap-3">
          <Checkbox
            checked={formData.chargesUnknown}
            onCheckedChange={handleChargesUnknownToggle}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5"
            id="charges-unknown"
            aria-label="I don't know what charges I'm facing"
          />
          <div>
            <label htmlFor="charges-unknown" className="font-medium text-sm cursor-pointer">
              I don't know what charges I'm facing
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Select this if you haven't received paperwork or aren't sure of the official charges. You'll receive general rights and process guidance instead.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          className="min-h-[44px] sm:w-auto"
          data-testid="button-prev-case-details"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.caseDetails.back')}
        </Button>
        <Button
          onClick={handleContinue}
          disabled={formData.charges.length === 0 && !formData.chargesUnknown}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-next-case-details"
        >
          {t('legalGuidance.qaFlow.caseDetails.continue')} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StatusStep({ formData, updateFormData, onNext, onPrev, isLast }: any) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.status.title')}</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="caseStage">{t('legalGuidance.qaFlow.status.caseStageLabel')}</Label>
            <Select
              value={formData.caseStage}
              onValueChange={(value) => updateFormData("caseStage", value)}
            >
              <SelectTrigger data-testid="select-case-stage">
                <SelectValue placeholder={t('legalGuidance.qaFlow.status.caseStageplaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrest">{t('legalGuidance.qaFlow.status.stages.arrest')}</SelectItem>
                <SelectItem value="arraignment">{t('legalGuidance.qaFlow.status.stages.arraignment')}</SelectItem>
                <SelectItem value="pretrial">{t('legalGuidance.qaFlow.status.stages.pretrial')}</SelectItem>
                <SelectItem value="trial">{t('legalGuidance.qaFlow.status.stages.trial')}</SelectItem>
                <SelectItem value="sentencing">{t('legalGuidance.qaFlow.status.stages.sentencing')}</SelectItem>
                <SelectItem value="appeal">{t('legalGuidance.qaFlow.status.stages.appeal')}</SelectItem>
                <SelectItem value="unsure">{t('legalGuidance.qaFlow.status.stages.unsure')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="custodyStatus">{t('legalGuidance.qaFlow.status.custodyLabel')}</Label>
            <Select
              value={formData.custodyStatus}
              onValueChange={(value) => updateFormData("custodyStatus", value)}
            >
              <SelectTrigger data-testid="select-custody-status">
                <SelectValue placeholder={t('legalGuidance.qaFlow.status.custodyPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detained">{t('legalGuidance.qaFlow.status.custodyOptions.yes')}</SelectItem>
                <SelectItem value="released">{t('legalGuidance.qaFlow.status.custodyOptions.bail')}</SelectItem>
                <SelectItem value="ownRecognizance">{t('legalGuidance.qaFlow.status.custodyOptions.recognizance')}</SelectItem>
                <SelectItem value="notArrested">{t('legalGuidance.qaFlow.status.custodyOptions.no')}</SelectItem>
                <SelectItem value="unsure">{t('legalGuidance.qaFlow.status.custodyOptions.unsure')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hasAttorney">Do you currently have a lawyer?</Label>
            <Select
              value={formData.hasAttorney === true ? "yes" : formData.hasAttorney === false ? "no" : ""}
              onValueChange={(value) => updateFormData("hasAttorney", value === "yes")}
            >
              <SelectTrigger data-testid="select-has-attorney">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          data-testid="button-prev-status"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.status.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.caseStage || !formData.custodyStatus}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-continue-status"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function BackgroundStep({ formData, updateFormData, onNext, onPrev }: any) {
  const { t } = useTranslation();
  const isNewYorkDrugCase = formData.jurisdiction === 'NY' && (formData.charges || []).some((id: string) =>
    /^ny-/.test(id) && /controlled-substance|drug|sale|distribution|trafficking|manufacturing/.test(id)
  );

  useEffect(() => {
    if (!isNewYorkDrugCase && formData.schoolZoneStatus) {
      updateFormData("schoolZoneStatus", "");
    }
  }, [isNewYorkDrugCase, formData.schoolZoneStatus, updateFormData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Your Situation</h3>
        <p className="text-sm text-muted-foreground mb-5">
          These questions help flag hidden consequences many people don't know about — like effects on housing, benefits, or professional licenses. All answers are private and completely optional.
        </p>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Are you currently on probation or parole?</Label>
            <Select
              value={formData.supervisionStatus || ""}
              onValueChange={(v) => updateFormData("supervisionStatus", v)}
            >
              <SelectTrigger data-testid="select-supervision-status">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No</SelectItem>
                <SelectItem value="probation">Yes — probation</SelectItem>
                <SelectItem value="parole">Yes — parole</SelectItem>
                <SelectItem value="both">Yes — both</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isNewYorkDrugCase && (
            <div>
              <Label className="mb-1.5 block">
                {t('legalGuidance.qaFlow.background.schoolZoneQuestion')}
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                {t('legalGuidance.qaFlow.background.schoolZoneDescription')}
              </p>
              <Select
                value={formData.schoolZoneStatus || ""}
                onValueChange={(v) => updateFormData("schoolZoneStatus", v)}
              >
                <SelectTrigger data-testid="select-school-zone-status">
                  <SelectValue placeholder={t('legalGuidance.qaFlow.background.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">{t('legalGuidance.qaFlow.background.schoolZoneOptions.yes')}</SelectItem>
                  <SelectItem value="no">{t('legalGuidance.qaFlow.background.schoolZoneOptions.no')}</SelectItem>
                  <SelectItem value="unsure">{t('legalGuidance.qaFlow.background.schoolZoneOptions.unsure')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="mb-1.5 block">Have you had prior convictions?</Label>
            <Select
              value={formData.priorConvictions === true ? "yes" : formData.priorConvictions === false ? "no" : ""}
              onValueChange={(v) => {
                if (v === "yes") updateFormData("priorConvictions", true);
                else if (v === "no") updateFormData("priorConvictions", false);
                else updateFormData("priorConvictions", null);
              }}
            >
              <SelectTrigger data-testid="select-prior-convictions">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unsure">Not sure / prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">What is your citizenship or immigration status?</Label>
            <Select
              value={formData.citizenshipStatus || ""}
              onValueChange={(v) => updateFormData("citizenshipStatus", v)}
            >
              <SelectTrigger data-testid="select-citizenship-status">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="citizen">U.S. citizen</SelectItem>
                <SelectItem value="non_citizen">Non-citizen (green card, visa, DACA, etc.)</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Do you have minor children in your care?</Label>
            <Select
              value={formData.hasMinorChildren === true ? "yes" : formData.hasMinorChildren === false ? "no" : ""}
              onValueChange={(v) => {
                if (v === "yes") updateFormData("hasMinorChildren", true);
                else if (v === "no") updateFormData("hasMinorChildren", false);
                else updateFormData("hasMinorChildren", null);
              }}
            >
              <SelectTrigger data-testid="select-minor-children">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">
              Do you hold a professional license?{" "}
              <span className="text-xs text-muted-foreground font-normal">(nursing, teaching, CDL, contractor, etc.)</span>
            </Label>
            <Select
              value={formData.hasProfessionalLicense === true ? "yes" : formData.hasProfessionalLicense === false ? "no" : ""}
              onValueChange={(v) => {
                if (v === "yes") updateFormData("hasProfessionalLicense", true);
                else if (v === "no") updateFormData("hasProfessionalLicense", false);
                else updateFormData("hasProfessionalLicense", null);
              }}
            >
              <SelectTrigger data-testid="select-professional-license">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Are you in public or subsidized housing?</Label>
            <Select
              value={formData.hasHousingAssistance === true ? "yes" : formData.hasHousingAssistance === false ? "no" : ""}
              onValueChange={(v) => {
                if (v === "yes") updateFormData("hasHousingAssistance", true);
                else if (v === "no") updateFormData("hasHousingAssistance", false);
                else updateFormData("hasHousingAssistance", null);
              }}
            >
              <SelectTrigger data-testid="select-housing-assistance">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          data-testid="button-prev-background"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-continue-background"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function AdditionalDetailsStep({ formData, updateFormData, onNext, onPrev, isLast, captchaToken, setCaptchaToken, captchaRequired }: any) {
  const { t } = useTranslation();
  const [concernsOpen, setConcernsOpen] = useState(false);
  const concernsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!concernsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (concernsRef.current && !concernsRef.current.contains(e.target as Node)) {
        setConcernsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [concernsOpen]);

  const concernsCategories = [
    { id: 'employment', icon: Briefcase },
    { id: 'childcare', icon: Users },
    { id: 'familyCare', icon: Users },
    { id: 'housing', icon: Home },
    { id: 'finances', icon: DollarSign },
    { id: 'transportation', icon: Car },
    { id: 'mentalHealth', icon: Heart },
    { id: 'personalHealth', icon: Activity },
    { id: 'immigration', icon: Globe },
    { id: 'reputation', icon: Shield },
    { id: 'courtLogistics', icon: Scale },
  ];

  const handleConcernToggle = (concernId: string) => {
    const current = formData.selectedConcerns || [];
    const updated = current.includes(concernId)
      ? current.filter((id: string) => id !== concernId)
      : [...current, concernId];
    updateFormData("selectedConcerns", updated);
  };

  const handleRemoveConcern = (concernId: string) => {
    const current = formData.selectedConcerns || [];
    updateFormData("selectedConcerns", current.filter((id: string) => id !== concernId));
  };

  const selectedConcerns = formData.selectedConcerns || [];
  const unselectedConcerns = concernsCategories.filter(c => !selectedConcerns.includes(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {t('legalGuidance.qaFlow.additionalDetails.concernsLabel')}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('legalGuidance.qaFlow.additionalDetails.concernsSubtitle')}
        </p>

        {selectedConcerns.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedConcerns.map((id: string) => {
              const cat = concernsCategories.find(c => c.id === id);
              if (!cat) return null;
              const Icon = cat.icon;
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.label`)}
                  <button
                    onClick={() => handleRemoveConcern(id)}
                    className="ml-1 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.label`)}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        <div className="relative" ref={concernsRef}>
          <button
            type="button"
            onClick={() => setConcernsOpen(!concernsOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-md border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <Plus className="h-4 w-4" />
              {selectedConcerns.length === 0
                ? t('legalGuidance.qaFlow.additionalDetails.selectConcerns', 'Select concerns...')
                : t('legalGuidance.qaFlow.additionalDetails.addMoreConcerns', 'Add more concerns...')}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${concernsOpen ? 'rotate-180' : ''}`} />
          </button>

          {concernsOpen && (
            <div className="absolute z-20 w-full mt-1 rounded-md border border-input bg-background shadow-lg max-h-60 overflow-y-auto">
              {unselectedConcerns.length === 0 ? (
                <div className="px-3 py-3 text-sm text-muted-foreground text-center">
                  {t('legalGuidance.qaFlow.additionalDetails.allConcernsSelected', 'All concerns selected')}
                </div>
              ) : (
                unselectedConcerns.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      handleConcernToggle(id);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">
                        {t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.label`)}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${id}.description`)}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {selectedConcerns.length === 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {t('legalGuidance.qaFlow.additionalDetails.noConcernsSelected')}
          </p>
        )}
      </div>

      {/* Verify once on the final step, immediately before the support request. */}
      {isLast && captchaRequired && (
        <div className="flex justify-center">
          <TurnstileCaptcha onVerify={setCaptchaToken} />
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.additionalDetails.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={isLast && captchaRequired && !captchaToken}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700"
        >
          {isLast
            ? t('legalGuidance.qaFlow.additionalDetails.submit')
            : t('legalGuidance.qaFlow.additionalDetails.next')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Civil Emergencies Step ───────────────────────────────────────────────────

const URGENCY_LEVELS = ['none', 'active', 'emergency'] as const;
type UrgencyLevel = typeof URGENCY_LEVELS[number];

interface CivilQuestion {
  key: string;
  field: string;
  isRelevant: (concerns: string[]) => boolean;
}

const CIVIL_QUESTIONS: CivilQuestion[] = [
  {
    key: 'housing',
    field: 'housing',
    isRelevant: (c) => c.includes('housing'),
  },
  {
    key: 'employment',
    field: 'employment',
    isRelevant: (c) => c.includes('employment'),
  },
  {
    key: 'dependents',
    field: 'dependents',
    isRelevant: (c) => c.includes('childcare') || c.includes('familyCare'),
  },
  {
    key: 'immigration',
    field: 'immigration',
    isRelevant: (c) => c.includes('immigration'),
  },
];

function CivilEmergenciesStep({ formData, updateFormData, onNext, onPrev, isLast, captchaToken, setCaptchaToken, captchaRequired }: any) {
  const { t } = useTranslation();
  const concerns = formData.selectedConcerns || [];
  const civilUrgency = formData.civilUrgency || {};

  const activeQuestions = CIVIL_QUESTIONS.filter(q => q.isRelevant(concerns));

  const setUrgency = (field: string, value: UrgencyLevel) => {
    updateFormData('civilUrgency', { ...civilUrgency, [field]: value });
  };

  const allAnswered = activeQuestions.every(q => civilUrgency[q.field] !== undefined);

  const urgencyStyles: Record<UrgencyLevel, string> = {
    none:      'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800',
    active:    'border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800',
    emergency: 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800',
  };

  const selectedStyles: Record<UrgencyLevel, string> = {
    none:      'ring-2 ring-green-500',
    active:    'ring-2 ring-amber-500',
    emergency: 'ring-2 ring-red-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          {t('legalGuidance.qaFlow.civilEmergencies.title')}
        </h3>
        <p className="text-sm text-muted-foreground mb-5">
          {t('legalGuidance.qaFlow.civilEmergencies.subtitle')}
        </p>
      </div>

      {activeQuestions.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          {t(
            'legalGuidance.qaFlow.civilEmergencies.noConcerns',
            'No urgent support concerns were selected. You can continue to generate your guidance.'
          )}
        </p>
      )}

      {activeQuestions.map(({ key, field }) => {
        const selected = civilUrgency[field] as UrgencyLevel | undefined;
        return (
          <div key={key}>
            <p className="text-sm font-semibold text-foreground mb-2">
              {t(`legalGuidance.qaFlow.civilEmergencies.${key}.question`)}
            </p>
            <div className="space-y-2">
              {URGENCY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(field, level)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    urgencyStyles[level]
                  } ${selected === level ? selectedStyles[level] : 'hover:opacity-80'}`}
                >
                  {t(`legalGuidance.qaFlow.civilEmergencies.${key}.${level}`)}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {isLast && captchaRequired && (
        <div className="flex justify-center">
          <TurnstileCaptcha onVerify={setCaptchaToken} />
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('legalGuidance.qaFlow.civilEmergencies.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={!allAnswered || (captchaRequired && !captchaToken)}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700"
        >
          {t('legalGuidance.qaFlow.civilEmergencies.generate')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

const EMPTY_FORM_DATA: QAFormData = {
  jurisdiction: "",
  charges: [],
  chargesUnknown: false,
  caseStage: "",
  custodyStatus: "",
  hasAttorney: null,
  consentGiven: false,
  guidanceMode: 'ai',
  selectedConcerns: [],
  civilUrgency: {},
  supervisionStatus: "",
  priorConvictions: null,
  citizenshipStatus: "",
  hasMinorChildren: null,
  hasProfessionalLicense: null,
  hasHousingAssistance: null,
  schoolZoneStatus: "",
};
