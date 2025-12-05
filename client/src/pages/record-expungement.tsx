import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileX, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  FileText,
  Scale,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { 
  expungementRules, 
  getExpungementByState, 
  getAvailableExpungementStates,
  assessEligibility
} from "@/lib/expungement-data";

interface EligibilityResultProps {
  result: {
    eligibility: "likely" | "possible" | "unlikely";
    reason: string;
    nextSteps: string[];
  };
  selectedState: string;
}

function EligibilityResult({ result, selectedState }: EligibilityResultProps) {
  const { t } = useTranslation();
  
  const getIcon = () => {
    switch (result.eligibility) {
      case "likely":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "possible":
        return <AlertCircle className="h-8 w-8 text-yellow-600" />;
      case "unlikely":
        return <XCircle className="h-8 w-8 text-red-600" />;
    }
  };

  const getColor = () => {
    switch (result.eligibility) {
      case "likely":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "possible":
        return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
      case "unlikely":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    }
  };

  const getTitle = () => {
    switch (result.eligibility) {
      case "likely":
        return t('recordExpungement.eligibilityResult.likelyEligible');
      case "possible":
        return t('recordExpungement.eligibilityResult.possiblyEligible');
      case "unlikely":
        return t('recordExpungement.eligibilityResult.unlikelyEligible');
    }
  };

  const rule = getExpungementByState(selectedState);

  return (
    <Card className={getColor()}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Result Header */}
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <h3 className="text-lg font-semibold">{getTitle()}</h3>
              <p className="text-sm text-muted-foreground">{result.reason}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('recordExpungement.eligibilityResult.nextSteps')}
            </h4>
            <ul className="space-y-2">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* State Information */}
          {rule && (
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                {t('recordExpungement.eligibilityResult.stateInfo', { state: selectedState })}
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">{t('recordExpungement.eligibilityResult.overview')}</h5>
                  <p className="text-sm text-muted-foreground">{rule.overview}</p>
                </div>

                {rule.exclusions && rule.exclusions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">{t('recordExpungement.eligibilityResult.commonExclusions')}</h5>
                    <div className="flex flex-wrap gap-1">
                      {rule.exclusions.slice(0, 5).map((exclusion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exclusion}
                        </Badge>
                      ))}
                      {rule.exclusions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          {t('recordExpungement.eligibilityResult.moreExclusions', { count: rule.exclusions.length - 5 })}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {rule.sources && rule.sources.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">{t('recordExpungement.eligibilityResult.legalSources')}</h5>
                    <div className="flex flex-wrap gap-2">
                      {rule.sources.map((source, index) => (
                        <span key={index} className="text-xs text-muted-foreground">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>{t('recordExpungement.eligibilityResult.disclaimerTitle')}</strong> {t('recordExpungement.eligibilityResult.disclaimerText')}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecordExpungement() {
  useScrollToTop();
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState("");
  const [offenseType, setOffenseType] = useState<"misdemeanor" | "felony" | "">("");
  const [completionDate, setCompletionDate] = useState("");
  const [hasMultipleConvictions, setHasMultipleConvictions] = useState(false);
  const [offenseCategory, setOffenseCategory] = useState("");
  const [showResults, setShowResults] = useState(false);

  const availableStates = getAvailableExpungementStates();

  const handleCheckEligibility = () => {
    if (!selectedState || !offenseType || !completionDate || !offenseCategory) {
      return;
    }
    setShowResults(true);
  };

  const resetForm = () => {
    setSelectedState("");
    setOffenseType("");
    setCompletionDate("");
    setHasMultipleConvictions(false);
    setOffenseCategory("");
    setShowResults(false);
  };

  const isFormComplete = selectedState && offenseType && completionDate && offenseCategory;

  let eligibilityResult;
  if (showResults && isFormComplete) {
    eligibilityResult = assessEligibility(
      selectedState,
      offenseType,
      new Date(completionDate),
      hasMultipleConvictions,
      offenseCategory
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Amber Vivid Header */}
      <section className="vivid-header-amber py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileX className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('recordExpungement.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 max-w-3xl mx-auto">
              {t('recordExpungement.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('recordExpungement.navigation.backToHome')}
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Information Banner */}
          <ScrollReveal delay={0.1}>
            <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      {t('recordExpungement.infoBanner.title')}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      {t('recordExpungement.infoBanner.description')}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {t('recordExpungement.infoBanner.stateNote')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Eligibility Form */}
          <ScrollReveal delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileX className="h-5 w-5" />
                  {t('recordExpungement.eligibilityForm.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* State Selection */}
                <div>
                  <Label htmlFor="state">{t('recordExpungement.eligibilityForm.stateQuestion')}</Label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger data-testid="select-state">
                      <SelectValue placeholder={t('recordExpungement.eligibilityForm.statePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map(state => (
                        <SelectItem key={state} value={state}>
                          {state === "Federal" ? t('recordExpungement.eligibilityForm.federalCourt') : state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Offense Type */}
                <div>
                  <Label>{t('recordExpungement.eligibilityForm.offenseTypeQuestion')}</Label>
                  <RadioGroup
                    value={offenseType}
                    onValueChange={(value) => setOffenseType(value as "misdemeanor" | "felony")}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misdemeanor" id="misdemeanor" data-testid="radio-misdemeanor" />
                      <Label htmlFor="misdemeanor">{t('recordExpungement.eligibilityForm.misdemeanor')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="felony" id="felony" data-testid="radio-felony" />
                      <Label htmlFor="felony">{t('recordExpungement.eligibilityForm.felony')}</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Completion Date */}
                <div>
                  <Label htmlFor="completion-date">{t('recordExpungement.eligibilityForm.completionDateQuestion')}</Label>
                  <Input
                    id="completion-date"
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    data-testid="input-completion-date"
                  />
                </div>

                {/* Offense Category */}
                <div>
                  <Label htmlFor="offense-category">{t('recordExpungement.eligibilityForm.offenseCategoryQuestion')}</Label>
                  <Input
                    id="offense-category"
                    value={offenseCategory}
                    onChange={(e) => setOffenseCategory(e.target.value)}
                    placeholder={t('recordExpungement.eligibilityForm.offenseCategoryPlaceholder')}
                    data-testid="input-offense-category"
                  />
                </div>

                {/* Multiple Convictions */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiple-convictions"
                    checked={hasMultipleConvictions}
                    onCheckedChange={(checked) => setHasMultipleConvictions(checked === true)}
                    data-testid="checkbox-multiple-convictions"
                  />
                  <Label htmlFor="multiple-convictions" className="text-sm">
                    {t('recordExpungement.eligibilityForm.multipleConvictions')}
                  </Label>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCheckEligibility}
                    disabled={!isFormComplete}
                    className="flex-1"
                    data-testid="button-check-eligibility"
                  >
                    {t('recordExpungement.eligibilityForm.checkEligibility')}
                  </Button>
                  {showResults && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      data-testid="button-reset-form"
                    >
                      {t('recordExpungement.eligibilityForm.reset')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Results */}
          {showResults && eligibilityResult && (
            <ScrollReveal delay={0.3}>
              <EligibilityResult 
                result={eligibilityResult} 
                selectedState={selectedState}
              />
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}