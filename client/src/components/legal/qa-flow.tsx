import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, ArrowLeft, X, ExternalLink, Scale, MessageSquare, AlertTriangle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { criminalCharges, getChargesByJurisdiction, chargeCategories } from "@shared/criminal-charges";
import { generateStatuteCitation, getStatuteUrl, getOfficialStatuteSite } from "@shared/statute-citation-generator";
import { TurnstileCaptcha, useCaptcha } from "@/components/captcha/turnstile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface QAFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  onFindLawyer?: () => void;
  onClearSession?: () => void;
}

export function QAFlow({ onComplete, onCancel, onFindLawyer, onClearSession }: QAFlowProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrivilegeWarning, setShowPrivilegeWarning] = useState(false);
  const [privilegeWarningAcknowledged, setPrivilegeWarningAcknowledged] = useState(false);
  const { token: captchaToken, setToken: setCaptchaToken, isRequired: captchaRequired } = useCaptcha();
  const [formData, setFormData] = useState({
    jurisdiction: "",
    charges: [] as string[],
    caseStage: "",
    custodyStatus: "",
    hasAttorney: false,
    consentGiven: false,
    incidentDescription: "",
    concernsQuestions: "",
  });

  const steps = [
    {
      title: t('legalGuidance.qaFlow.steps.consent'),
      component: ConsentStep,
    },
    {
      title: t('legalGuidance.qaFlow.steps.jurisdiction'),
      component: JurisdictionStep,
    },
    {
      title: t('legalGuidance.qaFlow.steps.caseDetails'),
      component: CaseDetailsStep,
    },
    {
      title: t('legalGuidance.qaFlow.steps.status'),
      component: StatusStep,
    },
    {
      title: t('legalGuidance.qaFlow.steps.additionalDetails'),
      component: AdditionalDetailsStep,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ ...formData, captchaToken });
    }
  };

  const handlePrivilegeWarningContinue = () => {
    setPrivilegeWarningAcknowledged(true);
    setShowPrivilegeWarning(false);
  };

  const handleTextareaFocus = () => {
    if (!formData.hasAttorney && !privilegeWarningAcknowledged) {
      setShowPrivilegeWarning(true);
    }
  };

  const handleSkipAndGetGuidance = () => {
    setPrivilegeWarningAcknowledged(true);
    setShowPrivilegeWarning(false);
    updateFormData("incidentDescription", "");
    updateFormData("concernsQuestions", "");
    onComplete({ ...formData, captchaToken });
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-2xl">{t('legalGuidance.qaFlow.title')}</CardTitle>
          <Button
            variant="ghost"
            onClick={onCancel}
            data-testid="button-cancel-qa"
          >
            {t('legalGuidance.qaFlow.cancel')}
          </Button>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
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

      <CardContent>
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
              onTextareaFocus={handleTextareaFocus}
              captchaToken={captchaToken}
              setCaptchaToken={setCaptchaToken}
              captchaRequired={captchaRequired}
            />
          </motion.div>
        </AnimatePresence>

        {/* Privacy Notice */}
        <div className="flex items-center justify-between mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {t('legalGuidance.qaFlow.privacyNotice')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSession}
            className="text-xs text-red-600 hover:text-red-700"
          >
            {t('legalGuidance.qaFlow.clearSession.button')}
          </Button>
        </div>
      </CardContent>

      {/* Privilege Warning Dialog */}
      <Dialog open={showPrivilegeWarning} onOpenChange={setShowPrivilegeWarning}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] overflow-hidden">
          <DialogHeader className="overflow-hidden">
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300 break-words">
                {t('legalGuidance.qaFlow.privilegeWarning.criminalWarning')}
              </p>
            </div>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {t('legalGuidance.qaFlow.privilegeWarning.title')}
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <p>
                {t('legalGuidance.qaFlow.privilegeWarning.notPrivate')}
              </p>
              <p>
                {t('legalGuidance.qaFlow.privilegeWarning.recommendation')}
              </p>
              <p className="text-amber-700 dark:text-amber-300 font-medium">
                {t('legalGuidance.qaFlow.privilegeWarning.governmentWarning')}
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4 w-full">
            <Button
              onClick={handlePrivilegeWarningContinue}
              variant="outline"
              className="w-full whitespace-normal text-center"
              data-testid="button-privilege-continue"
            >
              {t('legalGuidance.qaFlow.privilegeWarning.continueAnyway')}
            </Button>
            <Button
              onClick={handleSkipAndGetGuidance}
              className="w-full bg-blue-600 hover:bg-blue-700 whitespace-normal text-center"
              data-testid="button-privilege-skip"
            >
              {t('legalGuidance.qaFlow.privilegeWarning.skipAndGetGuidance')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ConsentStep({ formData, updateFormData, onNext }: any) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.consent.title')}</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong>{t('legalGuidance.qaFlow.consent.important')}</strong> {t('legalGuidance.qaFlow.consent.generalInfo')}
          </p>
          <p>
            {t('legalGuidance.qaFlow.consent.noStorage')}
          </p>
          <p>
            {t('legalGuidance.qaFlow.consent.consultAttorney')}
          </p>

          {/* Warning disclosures */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
            <p>
              {t('legalGuidance.qaFlow.consent.notPrivileged')}
            </p>
            <p>
              {t('legalGuidance.qaFlow.consent.governmentDisclosure')}
            </p>
            <p>
              {t('legalGuidance.qaFlow.consent.criminalWarning')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consent"
          checked={formData.consentGiven}
          onCheckedChange={(checked) => updateFormData("consentGiven", checked)}
          data-testid="checkbox-consent"
        />
        <Label htmlFor="consent" className="text-sm">
          {t('legalGuidance.qaFlow.consent.checkboxLabel')}
        </Label>
      </div>

      <Button
        onClick={onNext}
        disabled={!formData.consentGiven}
        className="w-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        data-testid="button-next-consent"
      >
        {t('legalGuidance.qaFlow.consent.continueButton')} <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function JurisdictionStep({ formData, updateFormData, onNext, onPrev }: any) {
  const { t } = useTranslation();
  
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
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={onPrev}
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
  
  // Get charges based on selected jurisdiction (includes both state and federal charges)
  const availableCharges = getChargesByJurisdiction(formData.jurisdiction);
  
  // Filter charges by category if selected
  const filteredCharges = selectedCategory && selectedCategory !== 'all'
    ? availableCharges.filter(charge => 
        chargeCategories[selectedCategory as keyof typeof chargeCategories]?.includes(charge.id)
      )
    : availableCharges;
  
  // Custom sorting function to group crimes with degrees together
  const sortChargesWithDegrees = (charges: any[]) => {
    return charges.sort((a, b) => {
      // Extract base crime name (remove degree indicators)
      const getBaseName = (name: string) => {
        return name.replace(/\s+(in the\s+)?(First|Second|Third|Fourth|1st|2nd|3rd|4th)\s+(Degree|Class)/i, '').trim();
      };
      
      // Extract degree from name
      const getDegreeOrder = (name: string) => {
        const degreeMatch = name.match(/(First|Second|Third|Fourth|1st|2nd|3rd|4th)/i);
        if (!degreeMatch) return 0; // No degree, sort first
        
        const degree = degreeMatch[1].toLowerCase();
        switch (degree) {
          case 'first': case '1st': return 1;
          case 'second': case '2nd': return 2;
          case 'third': case '3rd': return 3;
          case 'fourth': case '4th': return 4;
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t('legalGuidance.qaFlow.caseDetails.title')}</h3>
        
        <div className="space-y-4">
          {/* Selected Charges */}
          {formData.charges.length > 0 && (
            <div className="mb-4">
              <Label className="text-sm font-medium mb-2 block">{t('legalGuidance.qaFlow.caseDetails.selectedCharges')}</Label>
              <div className="space-y-2">
                {formData.charges.map((chargeId: string) => {
                  const charge = getChargeById(chargeId);
                  if (!charge) return null;
                  
                  const statuteCitation = generateStatuteCitation(charge.jurisdiction, charge.code);
                  const statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
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
                              {(statuteUrl || officialSite) && (
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
                        </div>
                        <button
                          onClick={() => removeCharge(chargeId)}
                          className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1"
                          type="button"
                          data-testid={`button-remove-charge-${chargeId}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
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
              {t('legalGuidance.qaFlow.caseDetails.selectLabel')}
            </Label>
            <div className="max-h-64 overflow-y-auto border rounded-md p-3 space-y-4">
              
              {/* State Charges Section */}
              {stateCharges.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                    {t('legalGuidance.qaFlow.caseDetails.stateCharges')}
                  </h4>
                  <div className="space-y-2">
                    {displayedStateCharges.map(charge => {
                      const statuteCitation = generateStatuteCitation(charge.jurisdiction, charge.code);
                      const statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
                      
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
                                {charge.code}
                              </Badge>
                              <Badge 
                                variant="outline"
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
                            <p className="text-xs text-muted-foreground">
                              {charge.description}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              {t('legalGuidance.qaFlow.caseDetails.maxPenalty')} {charge.maxPenalty}
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
                      const statuteCitation = generateStatuteCitation(charge.jurisdiction, charge.code);
                      const statuteUrl = getStatuteUrl(charge.jurisdiction, charge.code);
                      
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
                                {charge.code}
                              </Badge>
                              <Badge 
                                variant="outline"
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
                            <p className="text-xs text-muted-foreground">
                              {charge.description}
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                              {t('legalGuidance.qaFlow.caseDetails.maxPenalty')} {charge.maxPenalty}
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasAttorney"
              checked={formData.hasAttorney}
              onCheckedChange={(checked) => updateFormData("hasAttorney", checked)}
              data-testid="checkbox-has-attorney"
            />
            <Label htmlFor="hasAttorney" className="text-sm">
              {t('legalGuidance.qaFlow.caseDetails.hasAttorneyLabel')}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={onPrev}
          data-testid="button-prev-case-details"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.caseDetails.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={formData.charges.length === 0}
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
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
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

function AdditionalDetailsStep({ formData, updateFormData, onNext, onPrev, isLast, onTextareaFocus, captchaToken, setCaptchaToken, captchaRequired }: any) {
  const { t } = useTranslation();
  const captchaNeeded = captchaRequired && !captchaToken;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t('legalGuidance.qaFlow.additionalDetails.title')}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('legalGuidance.qaFlow.additionalDetails.description')}
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="incidentDescription">
              {t('legalGuidance.qaFlow.additionalDetails.incidentLabel')}
            </Label>
            <Textarea
              id="incidentDescription"
              value={formData.incidentDescription || ""}
              onChange={(e) => updateFormData("incidentDescription", e.target.value)}
              onFocus={onTextareaFocus}
              placeholder={t('legalGuidance.qaFlow.additionalDetails.incidentPlaceholder')}
              rows={4}
              className="mt-2"
              data-testid="textarea-incident-description"
            />
          </div>

          <div>
            <Label htmlFor="concernsQuestions">
              {t('legalGuidance.qaFlow.additionalDetails.concernsLabel')}
            </Label>
            <Textarea
              id="concernsQuestions"
              value={formData.concernsQuestions || ""}
              onChange={(e) => updateFormData("concernsQuestions", e.target.value)}
              onFocus={onTextareaFocus}
              placeholder={t('legalGuidance.qaFlow.additionalDetails.concernsPlaceholder')}
              rows={4}
              className="mt-2"
              data-testid="textarea-concerns-questions"
            />
          </div>
        </div>
      </div>

      {/* CAPTCHA verification */}
      <TurnstileCaptcha onVerify={setCaptchaToken} size="normal" />

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={onPrev}
          data-testid="button-prev-additional"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('legalGuidance.qaFlow.additionalDetails.back')}
        </Button>
        <Button
          onClick={onNext}
          disabled={captchaNeeded}
          className="flex-1 bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-generate-guidance"
        >
          {t('legalGuidance.qaFlow.status.submitButton')} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
