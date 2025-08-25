import { GuidanceDashboard } from "@/components/legal/guidance-dashboard";
import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Test data that matches what the API returns
const testGuidanceData = {
  sessionId: "test-session",
  criticalAlerts: [
    "URGENT: Exercise right to remain silent - do not answer questions without attorney",
    "Arraignment must occur Within 48 hours (72 hours if arrested on weekend)",
    "CRITICAL: Request public defender immediately if you cannot afford attorney"
  ],
  immediateActions: [
    "Exercise right to remain silent immediately",
    "Request attorney before any questioning",
    "Comply physically but assert rights verbally",
    "Memorize booking number and jail location"
  ],
  nextSteps: [
    "Contact attorney or request public defender",
    "Notify family/employer of situation",
    "Gather bail money and documentation",
    "Prepare for arraignment hearing"
  ],
  deadlines: [
    {
      event: "Arraignment Hearing",
      timeframe: "Within 48 hours (72 hours if arrested on weekend)",
      description: "First court appearance where charges are formally read",
      priority: "critical" as const,
      daysFromNow: 2
    },
    {
      event: "Discovery Deadline",
      timeframe: "30 days after arraignment",
      description: "Exchange of evidence between prosecution and defense",
      priority: "normal" as const,
      daysFromNow: 30
    }
  ],
  rights: [
    "Right to remain silent (5th Amendment)",
    "Right to attorney (6th Amendment)",
    "Right to reasonable bail (8th Amendment)",
    "Right to phone call",
    "Right to medical attention if injured"
  ],
  resources: [
    {
      type: "Public Defender Office",
      description: "Free legal representation if you qualify financially",
      contact: "Contact your local public defender office",
      hours: "Monday-Friday 8:00 AM - 5:00 PM"
    },
    {
      type: "Legal Aid Society",
      description: "Additional legal assistance and resources",
      contact: "Local legal aid organizations",
      hours: "Varies by location"
    }
  ],
  warnings: [
    "Do not discuss your case on social media",
    "Avoid contact with witnesses or alleged victims",
    "Comply with all court orders and bail conditions"
  ],
  evidenceToGather: [
    "Receipts, bank statements, proof of purchase",
    "Alibi witnesses and documentation",
    "Security footage from multiple locations"
  ],
  courtPreparation: [
    "Dress appropriately for court",
    "Arrive early and know courtroom location",
    "Bring required documentation"
  ],
  avoidActions: [
    "Do not discuss case with cellmates",
    "Do not sign any documents without attorney review",
    "Do not waive any rights"
  ],
  timeline: [
    {
      stage: "Arrest",
      description: "Taken into custody and booked",
      timeframe: "Completed",
      completed: true
    },
    {
      stage: "Arraignment",
      description: "Charges read, plea entered, bail set",
      timeframe: "Within 48 hours (72 hours if arrested on weekend)",
      completed: false
    },
    {
      stage: "Preliminary Hearing",
      description: "Court determines probable cause",
      timeframe: "Within 10 court days for felonies",
      completed: false
    }
  ],
  caseData: {
    jurisdiction: "CA",
    charges: "Robbery",
    caseStage: "arrest",
    custodyStatus: "detained",
    hasAttorney: false
  }
};

export default function DashboardTest() {
  return (
    <div className="min-h-screen bg-background">
      <PrivacyBanner />
      <Header />
      
      <main className="px-4 py-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Interactive Web Dashboard - Test Page
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            This is how the dashboard should look after completing the guidance questionnaire.
          </p>
        </div>
        
        <GuidanceDashboard 
          guidance={testGuidanceData} 
          onClose={() => window.location.href = '/case-guidance'}
          onDeleteSession={() => window.location.href = '/case-guidance'}
        />
      </main>
      
      <Footer />
    </div>
  );
}