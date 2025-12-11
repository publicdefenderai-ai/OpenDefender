import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowLeft, Lock, AlertTriangle, FileText, Undo2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat, QuickReply, ConversationStep, CompletedFlow } from "@/contexts/chat-context";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { QuickReplyButtons, FullWidthReply } from "@/components/chat/quick-replies";
import { ProgressDots } from "@/components/chat/progress-indicator";
import { CaseStatusPanel } from "@/components/chat/case-status-panel";
import { ChatInput } from "@/components/chat/chat-input";
import { StateSelector } from "@/components/chat/state-selector";
import { ChargeSelector } from "@/components/chat/charge-selector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia"
};

const FLOW_MENU_OPTIONS: Record<CompletedFlow, { id: string; label: string; value: string; color: 'blue' | 'green' | 'amber' | 'purple' }> = {
  personalized_guidance: { id: 'menu-guidance', label: "Personalized Guidance", value: 'menu_personalized', color: 'blue' },
  immigration: { id: 'menu-immigration', label: "Immigration Enforcement", value: 'menu_immigration', color: 'amber' },
  rights_info: { id: 'menu-rights', label: "Rights Info", value: 'menu_rights', color: 'green' },
  resources: { id: 'menu-resources', label: "Resources", value: 'menu_resources', color: 'purple' },
  laws_records: { id: 'menu-laws', label: "Laws & Records", value: 'menu_laws', color: 'blue' },
};

function getNextMenuOptions(excludeFlow: CompletedFlow, completedFlows: CompletedFlow[] = []): QuickReply[] {
  const allFlows: CompletedFlow[] = ['personalized_guidance', 'immigration', 'rights_info', 'resources', 'laws_records'];
  return allFlows
    .filter(flow => flow !== excludeFlow && !completedFlows.includes(flow))
    .map(flow => FLOW_MENU_OPTIONS[flow]);
}

export default function ChatPage() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { state, actions } = useChat();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showChargeSelector, setShowChargeSelector] = useState(false);

  useEffect(() => {
    actions.openChat();
    
    if (state.currentStep === 'welcome' && state.messages.length === 0) {
      actions.addMessage({
        role: 'bot',
        content: t('chat.messages.welcome', "Hi! I'm here to help you understand your legal situation. Everything we discuss stays private and is deleted after your session.\n\nAre you in an urgent situation right now?"),
        quickReplies: [
          { id: 'urgent-yes', label: t('chat.replies.urgentYes', "Yes, I need help right now"), value: 'urgent_yes', color: 'purple' as const },
          { id: 'urgent-no', label: t('chat.replies.urgentNo', "No, I have time to talk"), value: 'urgent_no', color: 'blue' as const },
        ],
      });
      actions.setCurrentStep('emergency_check');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, isTyping]);

  // Sync charge selector visibility with current step (for back navigation)
  useEffect(() => {
    if (state.currentStep !== 'charge_selection') {
      setShowChargeSelector(false);
    }
  }, [state.currentStep]);

  const addBotMessage = useCallback((content: string, quickReplies?: QuickReply[]) => {
    actions.addMessage({
      role: 'bot',
      content,
      quickReplies,
    });
  }, [actions]);

  const handleQuickReply = useCallback(async (reply: QuickReply) => {
    actions.selectQuickReply(reply);

    switch (state.currentStep) {
      case 'emergency_check':
        if (reply.value === 'urgent_yes') {
          actions.updateCaseInfo({ isEmergency: true });
          // Show comprehensive urgent help info (same as "Urgent Help Needed" button)
          addBotMessage(t('chat.messages.emergencyAdviceFull', `🚨 **If you're being arrested or detained right now:**

**✅ Stay Calm**
Do not resist, run, or argue. Keep your hands visible. Resisting can lead to additional charges, even if the original arrest is later found to be unlawful.

**🔇 Exercise Your Right to Remain Silent**
Say clearly: "I am exercising my right to remain silent."
You do NOT have to answer questions about where you're going, what you're doing, or where you live.

**⚖️ Request an Attorney**
Say: "I want a lawyer." Police must stop questioning you once you ask for an attorney.
If you can't afford one, you can request a public defender at your first court appearance.

**🚫 Do Not Consent to Searches**
Say: "I do not consent to any searches."
Police may search anyway, but stating this protects your rights for later.

**📝 Remember These Details**
Note the officers' badge numbers, patrol car numbers, and any witness information. This can help your case later.

---
**What would you like to do next?**`), [
            { id: 'emergency-personalized', label: t('chat.replies.personalizedGuidance', "Personalized Guidance"), value: 'personalized_guidance', color: 'blue' as const },
            { id: 'emergency-rights', label: t('chat.replies.myRights', "My Rights"), value: 'learn_rights', color: 'green' as const },
            { id: 'emergency-process', label: t('chat.replies.criminalJusticeProcess', "Criminal Justice Process"), value: 'learn_process', color: 'amber' as const },
          ]);
          actions.setCurrentStep('emergency_options');
        } else {
          // Show main menu with 5 options
          addBotMessage(t('chat.messages.mainMenu', "What can I help you with?"), [
            { id: 'menu-guidance', label: t('chat.replies.personalizedGuidance', "Personalized Guidance"), value: 'menu_personalized', color: 'blue' as const },
            { id: 'menu-immigration', label: t('chat.replies.immigrationEnforcement', "Immigration Enforcement"), value: 'menu_immigration', color: 'amber' as const },
            { id: 'menu-rights', label: t('chat.replies.rightsInfo', "Rights Info"), value: 'menu_rights', color: 'green' as const },
            { id: 'menu-resources', label: t('chat.replies.resources', "Resources"), value: 'menu_resources', color: 'purple' as const },
            { id: 'menu-laws', label: t('chat.replies.lawsRecords', "Laws & Records"), value: 'menu_laws', color: 'blue' as const },
          ]);
          actions.setCurrentStep('main_menu');
        }
        break;

      case 'main_menu':
        if (reply.value === 'menu_personalized') {
          addBotMessage(t('chat.messages.stateQuestion', "Let's get you personalized guidance. First, what state is your case in?"));
          actions.setCurrentStep('state_selection');
        } else if (reply.value === 'menu_immigration') {
          addBotMessage(t('chat.messages.immigrationSummary', `**Immigration Enforcement Information**

If you're worried about immigration enforcement, here's what you should know:

**Your Rights:**
• You have the right to remain silent about your immigration status
• You don't have to open your door to immigration officers without a judicial warrant
• You have the right to speak to a lawyer before answering questions

**If Approached by ICE:**
• Stay calm and don't run
• Ask if you are free to leave
• Don't sign any documents without speaking to a lawyer
• Remember details about the encounter

For comprehensive immigration guidance, visit our full [Immigration Guidance](/immigration-guidance) page.

**What else can I help you with?**`), getNextMenuOptions('immigration', state.completedFlows));
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('main_menu');
        } else if (reply.value === 'menu_rights') {
          addBotMessage(t('chat.messages.rightsMenu', "Which rights topic would you like to learn about?"), [
            { id: 'rights-constitutional', label: t('chat.replies.constitutionalRights', "Constitutional Rights"), value: 'rights_constitutional', color: 'blue' as const },
            { id: 'rights-process', label: t('chat.replies.justiceProcess', "Justice Process"), value: 'rights_process', color: 'green' as const },
            { id: 'rights-search', label: t('chat.replies.searchSeizure', "Search & Seizure"), value: 'rights_search', color: 'purple' as const },
            { id: 'rights-family', label: t('chat.replies.helpingFamily', "Helping Family"), value: 'rights_family', color: 'amber' as const },
            { id: 'rights-glossary', label: t('chat.replies.legalGlossary', "Legal Glossary"), value: 'rights_glossary', color: 'blue' as const },
          ]);
          actions.setCurrentStep('rights_info_menu');
        } else if (reply.value === 'menu_resources') {
          addBotMessage(t('chat.messages.resourcesMenu', "What type of resource are you looking for?"), [
            { id: 'resources-pd', label: t('chat.replies.findPublicDefender', "Find Public Defender"), value: 'resources_pd', color: 'blue' as const },
            { id: 'resources-legal-aid', label: t('chat.replies.legalAidOrgs', "Legal Aid Orgs"), value: 'resources_legal_aid', color: 'green' as const },
            { id: 'resources-diversion', label: t('chat.replies.diversionPrograms', "Diversion Programs"), value: 'resources_diversion', color: 'purple' as const },
            { id: 'resources-expungement', label: t('chat.replies.recordExpungement', "Record Expungement"), value: 'resources_expungement', color: 'amber' as const },
          ]);
          actions.setCurrentStep('resources_menu');
        } else if (reply.value === 'menu_laws') {
          addBotMessage(t('chat.messages.lawsMenu', "What would you like to search?"), [
            { id: 'laws-court', label: t('chat.replies.courtRecords', "Court Records Search"), value: 'laws_court', color: 'blue' as const },
            { id: 'laws-statutes', label: t('chat.replies.statutesSearch', "Statutes Search"), value: 'laws_statutes', color: 'green' as const },
          ]);
          actions.setCurrentStep('laws_records_menu');
        }
        break;

      case 'rights_info_menu':
        if (reply.value === 'rights_constitutional') {
          setLocation('/rights-info');
          actions.markFlowCompleted('rights_info');
        } else if (reply.value === 'rights_process') {
          setLocation('/process');
          actions.markFlowCompleted('rights_info');
        } else if (reply.value === 'rights_search') {
          setLocation('/search-seizure');
          actions.markFlowCompleted('rights_info');
        } else if (reply.value === 'rights_family') {
          setLocation('/friends-family');
          actions.markFlowCompleted('rights_info');
        } else if (reply.value === 'rights_glossary') {
          setLocation('/legal-glossary');
          actions.markFlowCompleted('rights_info');
        }
        break;

      case 'resources_menu':
        if (reply.value === 'resources_pd') {
          addBotMessage(t('chat.messages.enterZipPD', "Please enter your ZIP code to find Public Defender offices near you:"));
          actions.setCurrentStep('pd_zip_search');
        } else if (reply.value === 'resources_legal_aid') {
          addBotMessage(t('chat.messages.enterZipLegalAid', "Please enter your ZIP code to find Legal Aid organizations near you:"));
          actions.setCurrentStep('legal_aid_zip_search');
        } else if (reply.value === 'resources_diversion') {
          setLocation('/diversion-programs');
          actions.markFlowCompleted('resources');
        } else if (reply.value === 'resources_expungement') {
          setLocation('/record-expungement');
          actions.markFlowCompleted('resources');
        }
        break;

      case 'laws_records_menu':
        if (reply.value === 'laws_court') {
          setLocation('/court-records');
          actions.markFlowCompleted('laws_records');
        } else if (reply.value === 'laws_statutes') {
          setLocation('/statutes');
          actions.markFlowCompleted('laws_records');
        }
        break;

      case 'emergency_options':
        if (reply.value === 'personalized_guidance') {
          addBotMessage(t('chat.messages.stateQuestion', "Let's get you personalized guidance. First, what state is your case in?"));
          actions.setCurrentStep('state_selection');
        } else if (reply.value === 'learn_rights') {
          addBotMessage(t('chat.messages.rightsInfo', `**Your Key Constitutional Rights:**

🛡️ **Right to Remain Silent** (5th Amendment)
You cannot be forced to testify against yourself. Anything you say can be used against you in court.

⚖️ **Right to an Attorney** (6th Amendment)
You have the right to a lawyer. If you can't afford one, the court will appoint a public defender.

📞 **Right to a Phone Call**
Most states allow at least one phone call after booking to contact family or an attorney.

📜 **Right to Know the Charges**
You must be told what crimes you're accused of.

---
For more detailed information, visit our [Know Your Rights](/rights-info) page.

**What would you like to do next?**`), [
            { id: 'rights-personalized', label: t('chat.replies.personalizedGuidance', "Personalized Guidance"), value: 'personalized_guidance', color: 'blue' as const },
            { id: 'rights-process', label: t('chat.replies.criminalJusticeProcess', "Criminal Justice Process"), value: 'learn_process', color: 'amber' as const },
          ]);
        } else if (reply.value === 'learn_process') {
          addBotMessage(t('chat.messages.processInfo', `**The Criminal Justice Process:**

**1. Arrest & Booking** (0-48 hours)
You're taken into custody, fingerprinted, and photographed. You may be held until arraignment.

**2. Arraignment** (24-72 hours after arrest)
First court appearance where charges are read, you enter a plea, and bail is set.

**3. Pre-Trial** (Weeks to months)
Discovery of evidence, plea negotiations, and motions are filed.

**4. Trial** (If no plea deal)
Evidence is presented before a judge or jury who decides guilt.

**5. Sentencing** (If convicted)
Judge determines punishment based on guidelines and circumstances.

**6. Appeal** (Optional)
You can challenge the verdict or sentence through higher courts.

---
For a complete guide, visit our [Criminal Justice Process](/process) page.

**What would you like to do next?**`), [
            { id: 'process-personalized', label: t('chat.replies.personalizedGuidance', "Personalized Guidance"), value: 'personalized_guidance', color: 'blue' as const },
            { id: 'process-rights', label: t('chat.replies.myRights', "My Rights"), value: 'learn_rights', color: 'green' as const },
          ]);
        }
        break;

      case 'court_stage':
        actions.updateCaseInfo({ courtStage: reply.value });
        addBotMessage(t('chat.messages.custodyQuestion', "Are you currently in custody or have you been released?"), [
          { id: 'custody-yes', label: t('chat.replies.inCustody', "Yes, in custody"), value: 'yes', color: 'purple' as const },
          { id: 'custody-bail', label: t('chat.replies.onBail', "Out on bail/bond"), value: 'bail', color: 'blue' as const },
          { id: 'custody-or', label: t('chat.replies.ownRecognizance', "Released on my own"), value: 'recognizance', color: 'blue' as const },
          { id: 'custody-no', label: t('chat.replies.notInCustody', "Not in custody"), value: 'no', color: 'blue' as const },
        ]);
        actions.setCurrentStep('custody_status');
        break;

      case 'custody_status':
        actions.updateCaseInfo({ custodyStatus: reply.value });
        addBotMessage(t('chat.messages.attorneyQuestion', "Do you have an attorney or public defender?"), [
          { id: 'attorney-yes', label: t('chat.replies.hasAttorney', "Yes, I have representation"), value: 'yes', color: 'blue' as const },
          { id: 'attorney-no', label: t('chat.replies.noAttorney', "No, I need to find one"), value: 'no', color: 'purple' as const },
        ]);
        actions.setCurrentStep('attorney_status');
        break;

      case 'attorney_status':
        actions.updateCaseInfo({ hasAttorney: reply.value === 'yes' });
        addBotMessage(t('chat.messages.descriptionPrompt', "Thanks for that information. Now, briefly describe what happened - this helps me give you more relevant guidance.\n\n(Your description is kept private and deleted after this session)"));
        actions.setCurrentStep('incident_description');
        break;

      default:
        if (reply.value === 'view_guidance') {
          handleViewGuidance();
        } else if (reply.value === 'export_pdf') {
          handleExportPdf();
        }
        break;
    }
  }, [state.currentStep, actions, addBotMessage, t]);

  const handleStateSelect = useCallback((stateCode: string) => {
    actions.saveHistoryPoint(); // Save history before this selection
    const stateName = US_STATES[stateCode] || stateCode;
    actions.addMessage({ role: 'user', content: stateName });
    actions.updateCaseInfo({ state: stateCode, stateName });
    
    addBotMessage(t('chat.messages.chargeQuestion', `Got it, ${stateName}. What charges are you facing? Select all that apply.`));
    setShowChargeSelector(true);
    actions.setCurrentStep('charge_selection');
  }, [actions, addBotMessage, t]);

  const handleChargesSelect = useCallback((charges: Array<{ code: string; name: string }>) => {
    actions.saveHistoryPoint(); // Save history before this selection
    const chargeNames = charges.map(c => c.name);
    const chargeCodes = charges.map(c => c.code);
    
    actions.addMessage({ role: 'user', content: chargeNames.join(', ') });
    actions.updateCaseInfo({ charges: chargeCodes, chargeNames });
    setShowChargeSelector(false);

    addBotMessage(t('chat.messages.stageQuestion', "What stage is your case in?"), [
      { id: 'stage-arrest', label: t('chat.replies.stageArrest', "Just arrested / under investigation"), value: 'arrest' },
      { id: 'stage-arraignment', label: t('chat.replies.stageArraignment', "Arraignment coming up"), value: 'arraignment' },
      { id: 'stage-pretrial', label: t('chat.replies.stagePretrial', "Pre-trial proceedings"), value: 'pretrial' },
      { id: 'stage-trial', label: t('chat.replies.stageTrial', "Trial scheduled/ongoing"), value: 'trial' },
      { id: 'stage-sentencing', label: t('chat.replies.stageSentencing', "Sentencing phase"), value: 'sentencing' },
      { id: 'stage-unsure', label: t('chat.replies.stageUnsure', "I'm not sure"), value: 'unsure' },
    ]);
    actions.setCurrentStep('court_stage');
  }, [actions, addBotMessage, t]);

  const handleFreeTextSubmit = useCallback(async (message: string) => {
    if (state.currentStep === 'incident_description') {
      actions.addMessage({ role: 'user', content: message });
      actions.updateCaseInfo({ incidentDescription: message });
      
      // Ask about concerns before generating guidance
      addBotMessage(t('chat.messages.concernsQuestion', "What are you most worried about? Any specific questions?\n\n(For example: losing your job, affording a lawyer, when you have to go to court)"));
      actions.setCurrentStep('concerns_question');
      
    } else if (state.currentStep === 'concerns_question') {
      actions.addMessage({ role: 'user', content: message });
      actions.updateCaseInfo({ concerns: message });
      
      setIsTyping(true);
      actions.setIsGenerating(true);
      actions.setCurrentStep('generating_guidance');
      
      addBotMessage(t('chat.messages.generating', "Thank you. I'm now reviewing your situation and preparing your personalized guidance. This may take a moment..."));

      try {
        const response = await apiRequest('POST', '/api/legal-guidance', {
          jurisdiction: state.caseInfo.state,
          charges: state.caseInfo.charges,
          caseStage: state.caseInfo.courtStage,
          custodyStatus: state.caseInfo.custodyStatus,
          hasAttorney: state.caseInfo.hasAttorney,
          incidentDescription: state.caseInfo.incidentDescription,
          concerns: message,
        });

        const data = await response.json();
        
        setIsTyping(false);
        actions.setIsGenerating(false);
        actions.setGuidanceData(data.guidance || data);
        actions.markFlowCompleted('personalized_guidance');
        
        addBotMessage(t('chat.messages.guidanceReady', "Your legal guidance is ready! I've put together a summary of your situation, important deadlines, your rights, and recommended next steps.\n\nYou can export this to keep for your records."), [
          { id: 'view-guidance', label: t('chat.replies.viewGuidance', "View My Guidance"), value: 'view_guidance', color: 'blue' as const },
          { id: 'export-pdf', label: t('chat.replies.exportPdf', "Export as PDF"), value: 'export_pdf', color: 'purple' as const },
        ]);
        
      } catch (error) {
        console.error('Guidance generation error:', error);
        setIsTyping(false);
        actions.setIsGenerating(false);
        
        addBotMessage(t('chat.messages.error', "I'm sorry, I encountered an issue generating your guidance. Please try again or contact support if the problem continues."), [
          { id: 'retry', label: t('chat.replies.retry', "Try Again"), value: 'retry' },
        ]);
      }
    } else if (state.currentStep === 'pd_zip_search') {
      // Handle Public Defender ZIP search
      const zipCode = message.trim();
      if (!/^\d{5}$/.test(zipCode)) {
        addBotMessage(t('chat.messages.invalidZip', "Please enter a valid 5-digit ZIP code."));
        return;
      }
      
      actions.addMessage({ role: 'user', content: zipCode });
      setIsTyping(true);
      
      try {
        const offices = await searchPublicDefenderOffices(zipCode);
        setIsTyping(false);
        
        if (offices.length === 0) {
          addBotMessage(t('chat.messages.noPDFound', `I couldn't find Public Defender offices near ${zipCode}. Try a different ZIP code or visit our [Resources page](/diversion-programs) for more options.

**What else can I help you with?**`), getNextMenuOptions('resources', state.completedFlows));
        } else {
          const resultsText = offices.slice(0, 3).map((office, i) => 
            `**${i + 1}. ${office.name}**
📍 ${office.address}
${office.phone ? `📞 ${office.phone}` : ''}
${office.distance ? `📏 ${office.distance} miles away` : ''}`
          ).join('\n\n');
          
          addBotMessage(t('chat.messages.pdResults', `Here are Public Defender offices near ${zipCode}:

${resultsText}

**What else can I help you with?**`), getNextMenuOptions('resources', state.completedFlows));
        }
        
        actions.markFlowCompleted('resources');
        actions.setCurrentStep('main_menu');
      } catch (error) {
        setIsTyping(false);
        addBotMessage(t('chat.messages.searchError', "I had trouble searching. Please try again."));
      }
      
    } else if (state.currentStep === 'legal_aid_zip_search') {
      // Handle Legal Aid ZIP search
      const zipCode = message.trim();
      if (!/^\d{5}$/.test(zipCode)) {
        addBotMessage(t('chat.messages.invalidZip', "Please enter a valid 5-digit ZIP code."));
        return;
      }
      
      actions.addMessage({ role: 'user', content: zipCode });
      setIsTyping(true);
      
      try {
        const orgs = await searchLegalAidOrganizations(zipCode);
        setIsTyping(false);
        
        if (orgs.length === 0) {
          addBotMessage(t('chat.messages.noLegalAidFound', `I couldn't find Legal Aid organizations near ${zipCode}. Try a different ZIP code or visit our [Resources page](/diversion-programs) for more options.

**What else can I help you with?**`), getNextMenuOptions('resources', state.completedFlows));
        } else {
          const resultsText = orgs.slice(0, 3).map((org, i) => 
            `**${i + 1}. ${org.name}**
📍 ${org.address}
${org.phone ? `📞 ${org.phone}` : ''}
${org.distance ? `📏 ${org.distance} miles away` : ''}`
          ).join('\n\n');
          
          addBotMessage(t('chat.messages.legalAidResults', `Here are Legal Aid organizations near ${zipCode}:

${resultsText}

**What else can I help you with?**`), getNextMenuOptions('resources', state.completedFlows));
        }
        
        actions.markFlowCompleted('resources');
        actions.setCurrentStep('main_menu');
      } catch (error) {
        setIsTyping(false);
        addBotMessage(t('chat.messages.searchError', "I had trouble searching. Please try again."));
      }
      
    } else if (state.currentStep === 'follow_up' || state.currentStep === 'guidance_ready') {
      actions.addMessage({ role: 'user', content: message });
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(t('chat.messages.followUpResponse', "That's a great question. Based on what you've told me, here's what I'd suggest..."));
      }, 1500);
    }
  }, [state.currentStep, state.caseInfo, actions, addBotMessage, t]);

  const handleClose = useCallback(() => {
    if (state.hasUnsavedGuidance) {
      toast({
        title: t('chat.exitWarning.title', "You have guidance that hasn't been exported"),
        description: t('chat.exitWarning.description', "Your guidance will be lost if you leave without exporting."),
        variant: "destructive",
      });
    }
    actions.closeChat();
    setLocation('/');
  }, [state.hasUnsavedGuidance, actions, setLocation, toast, t]);

  const handleViewGuidance = useCallback(() => {
    if (!state.guidanceData) return;
    
    const data = state.guidanceData;
    let formattedContent = "";
    
    if (data.overview) {
      formattedContent = `**Overview**\n${data.overview}\n\n`;
    }
    
    if (data.rights && data.rights.length > 0) {
      formattedContent += `**Your Rights**\n${data.rights.map(r => `• ${r}`).join('\n')}\n\n`;
    }
    
    if (data.nextSteps && data.nextSteps.length > 0) {
      formattedContent += `**Next Steps**\n${data.nextSteps.map(s => `• ${s}`).join('\n')}\n\n`;
    }
    
    if (data.deadlines && data.deadlines.length > 0) {
      formattedContent += `**Important Deadlines**\n${data.deadlines.map(d => `• ${d.event}: ${d.timeframe}`).join('\n')}\n\n`;
    }
    
    if (data.resources && data.resources.length > 0) {
      formattedContent += `**Resources**\n${data.resources.map(r => `• ${r.type}: ${r.description}`).join('\n')}`;
    }
    
    if (!formattedContent) {
      formattedContent = "Your legal guidance is ready. Please export as PDF for full details.";
    }
    
    formattedContent += "\n\n**What else can I help you with?**";
    
    addBotMessage(formattedContent, getNextMenuOptions('personalized_guidance', state.completedFlows));
    actions.setCurrentStep('main_menu');
  }, [state.guidanceData, state.completedFlows, addBotMessage, actions]);

  const handleExportPdf = useCallback(async () => {
    if (!state.guidanceData) {
      toast({ title: t('chat.export.noData', 'No guidance to export'), variant: "destructive" });
      return;
    }

    try {
      const { generateGuidancePDF } = await import('@/lib/pdf-generator');
      
      // Format guidance data for the full PDF generator
      const enhancedGuidance = {
        ...state.guidanceData,
        caseData: {
          jurisdiction: state.caseInfo.stateName || state.caseInfo.state || 'Unknown',
          charges: state.caseInfo.chargeNames?.join(', ') || 'Not specified',
          caseStage: state.caseInfo.courtStage || 'Not specified',
          custodyStatus: state.caseInfo.custodyStatus || 'Not specified',
          hasAttorney: state.caseInfo.hasAttorney || false,
        },
      } as any; // Type cast to avoid strict typing issues with guidance data format
      
      generateGuidancePDF(enhancedGuidance, 'en');
      actions.setHasExported(true);
      toast({ title: t('chat.export.success', 'PDF downloaded successfully') });
      
      addBotMessage(t('chat.messages.exportedWhatElse', "Your PDF has been downloaded.\n\n**What else can I help you with?**"), getNextMenuOptions('personalized_guidance', state.completedFlows));
      actions.setCurrentStep('main_menu');
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: t('chat.export.error', 'Failed to export PDF'), variant: "destructive" });
    }
  }, [state.guidanceData, state.caseInfo, state.completedFlows, actions, toast, t, addBotMessage]);

  const canUseFreeText = state.currentStep === 'incident_description' || 
                          state.currentStep === 'concerns_question' ||
                          state.currentStep === 'pd_zip_search' ||
                          state.currentStep === 'legal_aid_zip_search' ||
                          state.currentStep === 'follow_up' || 
                          state.currentStep === 'guidance_ready';

  const latestMessage = state.messages[state.messages.length - 1];
  const hasQuickReplies = latestMessage?.quickReplies && latestMessage.quickReplies.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-background flex">
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="flex-1 flex flex-col md:flex-row"
      >
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="md:hidden h-8 w-8"
                data-testid="button-close-mobile"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {actions.canGoBack() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions.goBack}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  data-testid="button-go-back"
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">{t('chat.header.back', 'Back')}</span>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-foreground">{t('chat.header.title', 'PD Chat')}</h1>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>{t('chat.header.privacy', 'Private')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {state.guidanceData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPdf}
                  data-testid="button-export-pdf"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('chat.header.export', 'Export')}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hidden md:flex"
                data-testid="button-close-chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <ProgressDots currentStep={state.currentStep} />

          <ScrollArea 
            ref={scrollRef}
            className="flex-1 px-4 py-4"
          >
            <div className="max-w-2xl mx-auto space-y-1">
              {state.messages.map((message, index) => (
                <div key={message.id}>
                  <MessageBubble 
                    message={message} 
                    isLatest={index === state.messages.length - 1}
                  />
                  {message.quickReplies && index === state.messages.length - 1 && (
                    <div className="ml-11">
                      <QuickReplyButtons
                        replies={message.quickReplies}
                        onSelect={handleQuickReply}
                        disabled={state.isGenerating}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && <TypingIndicator />}
              
              {showChargeSelector && state.caseInfo.state && (
                <div className="ml-11 mt-3">
                  <ChargeSelector
                    jurisdiction={state.caseInfo.state}
                    onSelect={handleChargesSelect}
                  />
                </div>
              )}

              {state.currentStep === 'state_selection' && !showChargeSelector && (
                <div className="ml-11 mt-3">
                  <StateSelector onSelect={handleStateSelect} />
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-background">
            <div className="max-w-2xl mx-auto">
              <ChatInput
                onSend={handleFreeTextSubmit}
                disabled={state.isGenerating}
                isLocked={!canUseFreeText}
                lockMessage={hasQuickReplies 
                  ? t('chat.input.selectOption', 'Select an option above to continue')
                  : t('chat.input.answering', 'Complete the current step to continue')
                }
                placeholder={state.currentStep === 'incident_description' 
                  ? t('chat.input.descriptionPlaceholder', 'Describe what happened...')
                  : state.currentStep === 'concerns_question'
                  ? t('chat.input.concernsPlaceholder', 'What worries you most about your situation?')
                  : (state.currentStep === 'pd_zip_search' || state.currentStep === 'legal_aid_zip_search')
                  ? t('chat.input.zipPlaceholder', 'Enter your 5-digit ZIP code...')
                  : t('chat.input.placeholder', 'Ask a follow-up question...')
                }
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                {t('chat.footer.privacy', 'Your data is encrypted and deleted after this session')}
              </p>
            </div>
          </div>
        </div>

        <aside className="hidden lg:flex w-72 border-l border-border bg-muted/30 p-4">
          <CaseStatusPanel 
            caseInfo={state.caseInfo} 
            className="w-full h-fit max-h-[calc(100vh-8rem)]"
          />
        </aside>
      </motion.div>
    </div>
  );
}
