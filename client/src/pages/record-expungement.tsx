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

import { PrivacyBanner } from "@/components/layout/privacy-banner";
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
        return "Likely Eligible";
      case "possible":
        return "Possibly Eligible";
      case "unlikely":
        return "Unlikely Eligible";
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
              Next Steps
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
                {selectedState} Expungement Information
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Overview</h5>
                  <p className="text-sm text-muted-foreground">{rule.overview}</p>
                </div>

                {rule.exclusions && rule.exclusions.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Common Exclusions</h5>
                    <div className="flex flex-wrap gap-1">
                      {rule.exclusions.slice(0, 5).map((exclusion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exclusion}
                        </Badge>
                      ))}
                      {rule.exclusions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{rule.exclusions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {rule.sources && rule.sources.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm mb-2">Legal Sources</h5>
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
              <strong>Important:</strong> This is a preliminary assessment only. Eligibility depends on many factors 
              including specific circumstances, local rules, and judicial discretion. Consult with a qualified attorney 
              for definitive legal advice about your situation.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecordExpungement() {
  useScrollToTop();
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
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileX className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-800 dark:text-blue-200">
              Record Expungement
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
              Check if you're eligible to clear your criminal record and get a fresh start
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
                  Back to Home
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
                      What is Record Expungement?
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      Expungement removes or seals criminal records from public view, helping you move forward 
                      without the burden of past convictions affecting employment, housing, or other opportunities.
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Each state has different rules, waiting periods, and eligibility requirements.
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
                  Check Your Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* State Selection */}
                <div>
                  <Label htmlFor="state">Which state was your conviction in?</Label>
                  <Select
                    value={selectedState}
                    onValueChange={setSelectedState}
                  >
                    <SelectTrigger data-testid="select-state">
                      <SelectValue placeholder="Select your state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map(state => (
                        <SelectItem key={state} value={state}>
                          {state === "Federal" ? "Federal Court" : state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Offense Type */}
                <div>
                  <Label>What type of offense was it?</Label>
                  <RadioGroup
                    value={offenseType}
                    onValueChange={(value) => setOffenseType(value as "misdemeanor" | "felony")}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misdemeanor" id="misdemeanor" data-testid="radio-misdemeanor" />
                      <Label htmlFor="misdemeanor">Misdemeanor</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="felony" id="felony" data-testid="radio-felony" />
                      <Label htmlFor="felony">Felony</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Completion Date */}
                <div>
                  <Label htmlFor="completion-date">When did you complete your sentence/probation?</Label>
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
                  <Label htmlFor="offense-category">What type of offense was it? (e.g., drug possession, DUI, theft, assault)</Label>
                  <Input
                    id="offense-category"
                    value={offenseCategory}
                    onChange={(e) => setOffenseCategory(e.target.value)}
                    placeholder="e.g., drug possession, theft, DUI, assault"
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
                    I have multiple convictions on my record
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
                    Check Eligibility
                  </Button>
                  {showResults && (
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      data-testid="button-reset-form"
                    >
                      Reset
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

          {/* Quick Navigation */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Need Legal Help?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get personalized legal guidance for your specific situation.
                  </p>
                  <Link href="/case-guidance">
                    <Button variant="outline" className="w-full">
                      Get Legal Guidance
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Find Diversion Programs</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Explore alternative programs that may help avoid conviction.
                  </p>
                  <Link href="/diversion-programs">
                    <Button variant="outline" className="w-full">
                      Explore Options
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}