import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QAFlowProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function QAFlow({ onComplete, onCancel }: QAFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    jurisdiction: "",
    charges: "",
    caseStage: "",
    custodyStatus: "",
    hasAttorney: false,
    consentGiven: false,
  });

  const steps = [
    {
      title: "Privacy & Consent",
      component: ConsentStep,
    },
    {
      title: "Jurisdiction",
      component: JurisdictionStep,
    },
    {
      title: "Your Case",
      component: CaseDetailsStep,
    },
    {
      title: "Current Status",
      component: StatusStep,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
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
          <CardTitle className="text-2xl">Get Personalized Legal Guidance</CardTitle>
          <Button
            variant="ghost"
            onClick={onCancel}
            data-testid="button-cancel-qa"
          >
            Cancel
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
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
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
            />
          </motion.div>
        </AnimatePresence>

        {/* Privacy Notice */}
        <div className="flex items-center space-x-2 mt-6 p-4 bg-muted rounded-lg">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Your responses are not stored and are deleted when you close your session
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ConsentStep({ formData, updateFormData, onNext }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Disclaimer & Consent</h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong>Important:</strong> This tool provides general legal information only and is not a substitute for professional legal advice.
          </p>
          <p>
            We do not store your personal information. All data is deleted when you close your session.
          </p>
          <p>
            For specific legal advice, consult with a qualified attorney.
          </p>
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
          I understand and consent to continue
        </Label>
      </div>

      <Button
        onClick={onNext}
        disabled={!formData.consentGiven}
        className="w-full bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        data-testid="button-next-consent"
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function JurisdictionStep({ formData, updateFormData, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Where is your case?</h3>
        <Label htmlFor="jurisdiction">State/Jurisdiction</Label>
        <Select
          value={formData.jurisdiction}
          onValueChange={(value) => updateFormData("jurisdiction", value)}
        >
          <SelectTrigger data-testid="select-jurisdiction">
            <SelectValue placeholder="Select your state..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AL">Alabama</SelectItem>
            <SelectItem value="AK">Alaska</SelectItem>
            <SelectItem value="AZ">Arizona</SelectItem>
            <SelectItem value="AR">Arkansas</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="CO">Colorado</SelectItem>
            <SelectItem value="CT">Connecticut</SelectItem>
            <SelectItem value="DE">Delaware</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
            <SelectItem value="GA">Georgia</SelectItem>
            <SelectItem value="HI">Hawaii</SelectItem>
            <SelectItem value="ID">Idaho</SelectItem>
            <SelectItem value="IL">Illinois</SelectItem>
            <SelectItem value="IN">Indiana</SelectItem>
            <SelectItem value="IA">Iowa</SelectItem>
            <SelectItem value="KS">Kansas</SelectItem>
            <SelectItem value="KY">Kentucky</SelectItem>
            <SelectItem value="LA">Louisiana</SelectItem>
            <SelectItem value="ME">Maine</SelectItem>
            <SelectItem value="MD">Maryland</SelectItem>
            <SelectItem value="MA">Massachusetts</SelectItem>
            <SelectItem value="MI">Michigan</SelectItem>
            <SelectItem value="MN">Minnesota</SelectItem>
            <SelectItem value="MS">Mississippi</SelectItem>
            <SelectItem value="MO">Missouri</SelectItem>
            <SelectItem value="MT">Montana</SelectItem>
            <SelectItem value="NE">Nebraska</SelectItem>
            <SelectItem value="NV">Nevada</SelectItem>
            <SelectItem value="NH">New Hampshire</SelectItem>
            <SelectItem value="NJ">New Jersey</SelectItem>
            <SelectItem value="NM">New Mexico</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="NC">North Carolina</SelectItem>
            <SelectItem value="ND">North Dakota</SelectItem>
            <SelectItem value="OH">Ohio</SelectItem>
            <SelectItem value="OK">Oklahoma</SelectItem>
            <SelectItem value="OR">Oregon</SelectItem>
            <SelectItem value="PA">Pennsylvania</SelectItem>
            <SelectItem value="RI">Rhode Island</SelectItem>
            <SelectItem value="SC">South Carolina</SelectItem>
            <SelectItem value="SD">South Dakota</SelectItem>
            <SelectItem value="TN">Tennessee</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
            <SelectItem value="UT">Utah</SelectItem>
            <SelectItem value="VT">Vermont</SelectItem>
            <SelectItem value="VA">Virginia</SelectItem>
            <SelectItem value="WA">Washington</SelectItem>
            <SelectItem value="WV">West Virginia</SelectItem>
            <SelectItem value="WI">Wisconsin</SelectItem>
            <SelectItem value="WY">Wyoming</SelectItem>
            <SelectItem value="DC">District of Columbia</SelectItem>
            <SelectItem value="federal">Federal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={onPrev}
          data-testid="button-prev-jurisdiction"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.jurisdiction}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-next-jurisdiction"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CaseDetailsStep({ formData, updateFormData, onNext, onPrev }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">About your case</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="charges">What charges are you facing?</Label>
            <Input
              id="charges"
              value={formData.charges}
              onChange={(e) => updateFormData("charges", e.target.value)}
              placeholder="e.g., DUI, theft, assault, drug possession..."
              data-testid="input-charges"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasAttorney"
              checked={formData.hasAttorney}
              onCheckedChange={(checked) => updateFormData("hasAttorney", checked)}
              data-testid="checkbox-has-attorney"
            />
            <Label htmlFor="hasAttorney" className="text-sm">
              I already have an attorney or public defender
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.charges}
          className="flex-1 bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-next-case-details"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StatusStep({ formData, updateFormData, onNext, onPrev, isLast }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Current status</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="caseStage">What stage is your case in?</Label>
            <Select
              value={formData.caseStage}
              onValueChange={(value) => updateFormData("caseStage", value)}
            >
              <SelectTrigger data-testid="select-case-stage">
                <SelectValue placeholder="Select current stage..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrest">Just arrested / Investigation</SelectItem>
                <SelectItem value="arraignment">Arraignment scheduled/completed</SelectItem>
                <SelectItem value="pretrial">Pre-trial proceedings</SelectItem>
                <SelectItem value="trial">Trial scheduled/in progress</SelectItem>
                <SelectItem value="sentencing">Sentencing phase</SelectItem>
                <SelectItem value="appeal">Appeal process</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="custodyStatus">Are you currently in custody?</Label>
            <Select
              value={formData.custodyStatus}
              onValueChange={(value) => updateFormData("custodyStatus", value)}
            >
              <SelectTrigger data-testid="select-custody-status">
                <SelectValue placeholder="Select custody status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detained">Yes, in custody</SelectItem>
                <SelectItem value="released">Released on bail/bond</SelectItem>
                <SelectItem value="ownRecognizance">Released on own recognizance</SelectItem>
                <SelectItem value="notArrested">Not arrested yet</SelectItem>
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.caseStage || !formData.custodyStatus}
          className="flex-1 bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          data-testid="button-generate-guidance"
        >
          {isLast ? "Generate Guidance" : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
