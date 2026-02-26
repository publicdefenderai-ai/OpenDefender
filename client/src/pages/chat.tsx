import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowLeft, AlertTriangle, FileText, Globe, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18nInstance from "@/i18n";
import { useLocation } from "wouter";
import { useProgressiveReveal } from "@/hooks/use-progressive-reveal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/ui/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useChat, QuickReply, ConversationStep, CompletedFlow } from "@/contexts/chat-context";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { QuickReplyButtons, FullWidthReply } from "@/components/chat/quick-replies";
import { ProgressBreadcrumbs, GeneratingProgress } from "@/components/chat/progress-indicator";
import { CaseStatusPanel } from "@/components/chat/case-status-panel";
import { ChatInput } from "@/components/chat/chat-input";
import { StateSelector } from "@/components/chat/state-selector";
import { ChargeSelector } from "@/components/chat/charge-selector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";
import { getDocumentsForPhase, mapCaseStageToPhase, type LegalDocument } from "@shared/legal-documents";

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

const concernsCategories = [
  { id: 'employment', labelKey: 'chat.concerns.employment' },
  { id: 'childcare', labelKey: 'chat.concerns.childcare' },
  { id: 'familyCare', labelKey: 'chat.concerns.familyCare' },
  { id: 'housing', labelKey: 'chat.concerns.housing' },
  { id: 'finances', labelKey: 'chat.concerns.finances' },
  { id: 'transportation', labelKey: 'chat.concerns.transportation' },
  { id: 'mentalHealth', labelKey: 'chat.concerns.mentalHealth' },
  { id: 'immigration', labelKey: 'chat.concerns.immigration' },
  { id: 'reputation', labelKey: 'chat.concerns.reputation' },
  { id: 'courtLogistics', labelKey: 'chat.concerns.courtLogistics' },
];

const FLOW_MENU_OPTIONS: Record<CompletedFlow, { id: string; labelKey: string; value: string; color: 'blue' | 'rose' | 'slate' | 'green' | 'purple' | 'amber' }> = {
  personalized_guidance: { id: 'menu-guidance', labelKey: 'chat.replies.getHelp', value: 'menu_personalized', color: 'blue' },
  immigration: { id: 'menu-immigration', labelKey: 'chat.replies.immigrationEnforcement', value: 'menu_immigration', color: 'rose' },
  rights_info: { id: 'menu-rights', labelKey: 'chat.replies.knowRights', value: 'menu_rights', color: 'slate' },
  resources: { id: 'menu-resources', labelKey: 'chat.replies.resources', value: 'menu_resources_category', color: 'purple' },
  laws_records: { id: 'menu-laws', labelKey: 'chat.replies.lawsRecords', value: 'menu_laws', color: 'purple' },
  attorney_tools: { id: 'menu-attorney', labelKey: 'chat.replies.attorneyTools', value: 'menu_attorney', color: 'slate' },
};

function getNextMenuOptions(excludeFlow: CompletedFlow, completedFlows: CompletedFlow[] = []): QuickReply[] {
  // 4 main journeys: Get Help, Immigration Enforcement, Know Your Rights, Resources
  const mainFlows: CompletedFlow[] = ['personalized_guidance', 'immigration', 'rights_info', 'resources'];
  return mainFlows
    .filter(flow => flow !== excludeFlow && !completedFlows.includes(flow))
    .map(flow => FLOW_MENU_OPTIONS[flow]);
}

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { state, actions } = useChat();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showChargeSelector, setShowChargeSelector] = useState(false);
  const [stillWorkingShown, setStillWorkingShown] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [privilegeWarningAcknowledged, setPrivilegeWarningAcknowledged] = useState(false);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const { visibleItems: visibleMessages, pendingCount } = useProgressiveReveal(
    state.messages,
    { initialCount: 5, batchSize: 3, batchDelayMs: 100 }
  );

  const handleStillWorking = useCallback(() => {
    if (!stillWorkingShown) {
      setStillWorkingShown(true);
      actions.addMessage({
        role: 'bot',
        contentKey: 'chat.messages.stillWorking',
      });
    }
  }, [stillWorkingShown, actions]);

  const handleLanguageChange = useCallback(async (lng: string) => {
    await i18nInstance.changeLanguage(lng);
    actions.resetChat();
    
    setTimeout(() => {
      actions.addMessage({
        role: 'bot',
        contentKey: 'chat.messages.welcome',
        quickReplies: [
          { id: 'urgent-yes', labelKey: 'chat.replies.urgentYes', value: 'urgent_yes', color: 'rose' as const },
          { id: 'urgent-no', labelKey: 'chat.replies.urgentNo', value: 'urgent_no', color: 'slate' as const },
        ],
      });
      actions.setCurrentStep('emergency_check');
      toast({
        title: lng === 'zh' ? '语言已更改' : lng === 'es' ? 'Idioma cambiado' : 'Language changed',
        description: lng === 'zh' ? '聊天已重新开始，使用中文' : lng === 'es' ? 'El chat se ha reiniciado en español' : 'Chat has been restarted in English',
      });
    }, 100);
  }, [actions, toast]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const hasInitialized = useRef(false);
  
  useEffect(() => {
    actions.openChat();
    
    if (state.currentStep === 'welcome' && state.messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      actions.addMessage({
        role: 'bot',
        contentKey: 'chat.messages.welcome',
        quickReplies: [
          { id: 'urgent-yes', labelKey: 'chat.replies.urgentYes', value: 'urgent_yes', color: 'rose' as const },
          { id: 'urgent-no', labelKey: 'chat.replies.urgentNo', value: 'urgent_no', color: 'slate' as const },
        ],
      });
      actions.setCurrentStep('emergency_check');
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Detect "stuck" state when user returns from another page
  // This happens when the last message has no quick replies and input is locked
  useEffect(() => {
    const latestMsg = state.messages[state.messages.length - 1];
    const hasReplies = latestMsg?.quickReplies && latestMsg.quickReplies.length > 0;
    const isFreeTextStep = state.currentStep === 'incident_description' ||
                           state.currentStep === 'pd_zip_search' ||
                           state.currentStep === 'legal_aid_zip_search' ||
                           state.currentStep === 'follow_up' ||
                           state.currentStep === 'guidance_ready';
    const isWelcome = state.currentStep === 'welcome';
    const isGenerating = state.currentStep === 'generating_guidance';
    const isChargeSelection = state.currentStep === 'charge_selection';
    const isStateSelection = state.currentStep === 'state_selection';
    const isConcernsQuestion = state.currentStep === 'concerns_question';

    // If chat is stuck (no quick replies, can't use free text, not in special states)
    if (state.messages.length > 0 && !hasReplies && !isFreeTextStep && !isWelcome && !isGenerating && !isChargeSelection && !isStateSelection && !isConcernsQuestion) {
      // Show "What else can I help you with?" with 3 main journey options
      actions.addMessage({
        role: 'bot',
        contentKey: 'chat.messages.whatElse',
        quickReplies: [
          { id: 'menu-guidance', labelKey: 'chat.replies.getHelp', value: 'menu_personalized', color: 'blue' as const },
          { id: 'menu-rights', labelKey: 'chat.replies.knowRights', value: 'menu_rights', color: 'slate' as const },
          { id: 'menu-resources', labelKey: 'chat.replies.resources', value: 'menu_resources_category', color: 'purple' as const },
        ],
      });
      actions.setCurrentStep('main_menu');
    }
  }, []); // Run once on mount

  // Scroll to bottom when messages change or typing indicator appears
  const scrollToBottom = useCallback(() => {
    // Immediate scroll for mobile responsiveness
    const doScroll = () => {
      if (messagesEndRef.current) {
        // Find the radix scroll viewport
        const scrollContainer = messagesEndRef.current.closest('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
        // Also try scrollIntoView as fallback
        messagesEndRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
      }
    };
    
    // Run immediately and again after a short delay for content that loads async
    doScroll();
    setTimeout(doScroll, 100);
    setTimeout(doScroll, 300);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, isTyping, showChargeSelector, scrollToBottom]);

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

  const addBotMessageWithKey = useCallback((contentKey: string, quickReplies?: QuickReply[], contentParams?: Record<string, string | number>) => {
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
      setIsTyping(false);
      actions.addMessage({
        role: 'bot',
        contentKey,
        contentParams,
        quickReplies,
      });
    }, 1000);
  }, [actions]);

  const handleQuickReply = useCallback(async (reply: QuickReply) => {
    switch (state.currentStep) {
      case 'emergency_check':
        if (reply.value === 'urgent_yes') {
          actions.updateCaseInfo({ isEmergency: true });
          addBotMessageWithKey('chat.messages.emergencyAdviceFull', [
            { id: 'emergency-personalized', labelKey: 'chat.replies.personalizedGuidance', value: 'personalized_guidance', color: 'blue' as const },
            { id: 'emergency-rights', labelKey: 'chat.replies.myRights', value: 'learn_rights', color: 'slate' as const },
            { id: 'emergency-process', labelKey: 'chat.replies.criminalJusticeProcess', value: 'learn_process', color: 'green' as const },
          ]);
          actions.setCurrentStep('emergency_options');
        } else {
          addBotMessageWithKey('chat.messages.mainMenu', [
            { id: 'menu-guidance', labelKey: 'chat.replies.getHelp', value: 'menu_personalized', color: 'blue' as const },
            { id: 'menu-immigration', labelKey: 'chat.replies.immigrationEnforcement', value: 'menu_immigration', color: 'rose' as const },
            { id: 'menu-rights', labelKey: 'chat.replies.knowRights', value: 'menu_rights', color: 'slate' as const },
            { id: 'menu-attorney', labelKey: 'chat.replies.attorneyTools', value: 'menu_attorney', color: 'slate' as const },
            { id: 'menu-resources', labelKey: 'chat.replies.resources', value: 'menu_resources_category', color: 'purple' as const },
          ]);
          actions.setCurrentStep('main_menu');
        }
        break;

      case 'main_menu':
        if (reply.value === 'menu_personalized') {
          setPrivilegeWarningAcknowledged(false);
          addBotMessageWithKey('chat.messages.stateQuestion');
          actions.setCurrentStep('state_selection');
        } else if (reply.value === 'menu_immigration') {
          addBotMessageWithKey('chat.messages.immigrationMenu', [
            { id: 'imm-general-info', labelKey: 'chat.replies.immGeneralHub', value: 'imm_general_info', color: 'green' as const },
            { id: 'imm-situational', labelKey: 'chat.replies.immSituationalGuides', value: 'imm_situational', color: 'blue' as const },
            { id: 'imm-know-rights', labelKey: 'chat.replies.immKnowYourRights', value: 'imm_know_rights', color: 'amber' as const },
            { id: 'imm-find-detained', labelKey: 'chat.replies.immFindDetained', value: 'imm_find_detained', color: 'amber' as const },
            { id: 'imm-find-lawyer', labelKey: 'chat.replies.immFindLawyer', value: 'imm_find_lawyer', color: 'rose' as const },
          ]);
          actions.setCurrentStep('immigration_submenu');
        } else if (reply.value === 'menu_rights') {
          addBotMessageWithKey('chat.messages.rightsMenu', [
            { id: 'rights-constitutional', labelKey: 'chat.replies.constitutionalRights', value: 'rights_constitutional', color: 'slate' as const },
            { id: 'rights-process', labelKey: 'chat.replies.justiceProcess', value: 'rights_process', color: 'slate' as const },
            { id: 'rights-search', labelKey: 'chat.replies.searchSeizure', value: 'rights_search', color: 'slate' as const },
            { id: 'rights-family', labelKey: 'chat.replies.helpingFamily', value: 'rights_family', color: 'slate' as const },
            { id: 'rights-glossary', labelKey: 'chat.replies.legalGlossary', value: 'rights_glossary', color: 'slate' as const },
          ]);
          actions.setCurrentStep('rights_info_menu');
        } else if (reply.value === 'menu_resources_category') {
          addBotMessageWithKey('chat.messages.resourcesCategoryMenu', [
            { id: 'resources-legal-aid-cat', labelKey: 'chat.replies.legalAidResources', value: 'menu_resources', color: 'green' as const },
            { id: 'resources-laws-cat', labelKey: 'chat.replies.lawsRecords', value: 'menu_laws', color: 'purple' as const },
            { id: 'resources-life-support-cat', labelKey: 'chat.replies.lifeSupportResources', value: 'menu_life_support', color: 'rose' as const },
          ]);
          actions.setCurrentStep('resources_category_menu');
        } else if (reply.value === 'menu_life_support') {
          setLocation('/support');
          actions.markFlowCompleted('resources');
        } else if (reply.value === 'menu_resources') {
          addBotMessageWithKey('chat.messages.resourcesMenu', [
            { id: 'resources-pd', labelKey: 'chat.replies.findPublicDefender', value: 'resources_pd', color: 'green' as const },
            { id: 'resources-legal-aid', labelKey: 'chat.replies.legalAidOrgs', value: 'resources_legal_aid', color: 'green' as const },
            { id: 'resources-diversion', labelKey: 'chat.replies.diversionPrograms', value: 'resources_diversion', color: 'green' as const },
            { id: 'resources-expungement', labelKey: 'chat.replies.recordExpungement', value: 'resources_expungement', color: 'green' as const },
            { id: 'resources-doc-summarizer', labelKey: 'chat.replies.documentSummarizer', value: 'resources_doc_summarizer', color: 'blue' as const },
          ]);
          actions.setCurrentStep('resources_menu');
        } else if (reply.value === 'menu_laws') {
          addBotMessageWithKey('chat.messages.lawsMenu', [
            { id: 'laws-court', labelKey: 'chat.replies.courtRecords', value: 'laws_court', color: 'purple' as const },
            { id: 'laws-statutes', labelKey: 'chat.replies.statutesSearch', value: 'laws_statutes', color: 'purple' as const },
            { id: 'laws-documents', labelKey: 'chat.replies.documentLibrary', value: 'laws_documents', color: 'purple' as const },
          ]);
          actions.setCurrentStep('laws_records_menu');
        } else if (reply.value === 'menu_attorney') {
          setLocation('/attorney');
          actions.markFlowCompleted('attorney_tools');
        } else if (reply.value === 'resources_pd') {
          addBotMessageWithKey('chat.messages.enterZipPD');
          actions.setCurrentStep('pd_zip_search');
        } else if (reply.value === 'resources_legal_aid') {
          addBotMessageWithKey('chat.messages.enterZipLegalAid');
          actions.setCurrentStep('legal_aid_zip_search');
        } else if (reply.value === 'export_pdf') {
          handleExportClick();
        }
        break;

      case 'resources_category_menu':
        if (reply.value === 'menu_resources') {
          addBotMessageWithKey('chat.messages.resourcesMenu', [
            { id: 'resources-pd', labelKey: 'chat.replies.findPublicDefender', value: 'resources_pd', color: 'green' as const },
            { id: 'resources-legal-aid', labelKey: 'chat.replies.legalAidOrgs', value: 'resources_legal_aid', color: 'green' as const },
            { id: 'resources-diversion', labelKey: 'chat.replies.diversionPrograms', value: 'resources_diversion', color: 'green' as const },
            { id: 'resources-expungement', labelKey: 'chat.replies.recordExpungement', value: 'resources_expungement', color: 'green' as const },
            { id: 'resources-doc-summarizer', labelKey: 'chat.replies.documentSummarizer', value: 'resources_doc_summarizer', color: 'green' as const },
          ]);
          actions.setCurrentStep('resources_menu');
        } else if (reply.value === 'menu_laws') {
          addBotMessageWithKey('chat.messages.lawsMenu', [
            { id: 'laws-court', labelKey: 'chat.replies.courtRecords', value: 'laws_court', color: 'purple' as const },
            { id: 'laws-statutes', labelKey: 'chat.replies.statutesSearch', value: 'laws_statutes', color: 'purple' as const },
            { id: 'laws-documents', labelKey: 'chat.replies.documentLibrary', value: 'laws_documents', color: 'purple' as const },
          ]);
          actions.setCurrentStep('laws_records_menu');
        } else if (reply.value === 'menu_life_support') {
          setLocation('/support');
          actions.markFlowCompleted('resources');
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
          addBotMessageWithKey('chat.messages.enterZipPD');
          actions.setCurrentStep('pd_zip_search');
        } else if (reply.value === 'resources_legal_aid') {
          addBotMessageWithKey('chat.messages.enterZipLegalAid');
          actions.setCurrentStep('legal_aid_zip_search');
        } else if (reply.value === 'resources_diversion') {
          setLocation('/diversion-programs');
          actions.markFlowCompleted('resources');
        } else if (reply.value === 'resources_expungement') {
          setLocation('/record-expungement');
          actions.markFlowCompleted('resources');
        } else if (reply.value === 'resources_doc_summarizer') {
          setLocation('/document-summarizer');
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
        } else if (reply.value === 'laws_documents') {
          setLocation('/document-library');
          actions.markFlowCompleted('laws_records');
        }
        break;

      case 'emergency_options':
        if (reply.value === 'personalized_guidance') {
          setPrivilegeWarningAcknowledged(false);
          addBotMessageWithKey('chat.messages.stateQuestion');
          actions.setCurrentStep('state_selection');
        } else if (reply.value === 'learn_rights') {
          addBotMessageWithKey('chat.messages.rightsInfo', [
            { id: 'rights-personalized', labelKey: 'chat.replies.personalizedGuidance', value: 'personalized_guidance', color: 'blue' as const },
            { id: 'rights-process', labelKey: 'chat.replies.criminalJusticeProcess', value: 'learn_process', color: 'slate' as const },
          ]);
        } else if (reply.value === 'learn_process') {
          addBotMessageWithKey('chat.messages.processInfo', [
            { id: 'process-personalized', labelKey: 'chat.replies.personalizedGuidance', value: 'personalized_guidance', color: 'blue' as const },
            { id: 'process-rights', labelKey: 'chat.replies.myRights', value: 'learn_rights', color: 'slate' as const },
          ]);
        }
        break;

      case 'immigration_submenu':
        if (reply.value === 'imm_general_info') {
          setLocation('/immigration-guidance');
          actions.markFlowCompleted('immigration');
        } else if (reply.value === 'imm_know_rights') {
          setLocation('/immigration-guidance/know-your-rights');
          actions.markFlowCompleted('immigration');
        } else if (reply.value === 'imm_situational') {
          setLocation('/immigration-guidance');
          actions.markFlowCompleted('immigration');
          setTimeout(() => {
            const el = document.getElementById('detailed-guides');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 200);
        } else if (reply.value === 'imm_find_detained') {
          setLocation('/immigration-guidance/find-detained');
          actions.markFlowCompleted('immigration');
        } else if (reply.value === 'imm_find_lawyer') {
          setLocation('/immigration-guidance/find-attorney');
          actions.markFlowCompleted('immigration');
        }
        break;

      case 'immigration_situation':
        if (reply.value === 'imm_urgent') {
          addBotMessageWithKey('chat.messages.immigrationUrgent.reminder', [
            { id: 'imm-at-home', labelKey: 'chat.replies.immAtHome', value: 'imm_at_home', color: 'rose' as const },
            { id: 'imm-at-work', labelKey: 'chat.replies.immAtWork', value: 'imm_at_work', color: 'rose' as const },
            { id: 'imm-in-public', labelKey: 'chat.replies.immInPublic', value: 'imm_in_public', color: 'rose' as const },
          ]);
          actions.setCurrentStep('immigration_urgent_location');
        } else if (reply.value === 'imm_planning') {
          addBotMessageWithKey('chat.messages.immigrationPlanning.question', [
            { id: 'imm-myself', labelKey: 'chat.replies.immMyself', value: 'imm_myself', color: 'blue' as const },
            { id: 'imm-family', labelKey: 'chat.replies.immFamily', value: 'imm_family', color: 'blue' as const },
            { id: 'imm-workplace', labelKey: 'chat.replies.immWorkplace', value: 'imm_workplace', color: 'blue' as const },
          ]);
          actions.setCurrentStep('immigration_planning_who');
        } else if (reply.value === 'imm_detained') {
          addBotMessageWithKey('chat.messages.immigrationDetained.question', [
            { id: 'imm-ice-detention', labelKey: 'chat.replies.immIceDetention', value: 'imm_ice_detention', color: 'amber' as const },
            { id: 'imm-county-jail', labelKey: 'chat.replies.immCountyJail', value: 'imm_county_jail', color: 'amber' as const },
            { id: 'imm-port-entry', labelKey: 'chat.replies.immPortOfEntry', value: 'imm_port_entry', color: 'amber' as const },
          ]);
          actions.setCurrentStep('immigration_detained_status');
        } else if (reply.value === 'imm_general') {
          setLocation('/immigration-guidance');
          actions.markFlowCompleted('immigration');
        }
        break;

      case 'immigration_urgent_location':
        if (reply.value === 'imm_at_home') {
          addBotMessageWithKey('chat.messages.immigrationUrgent.atHome', [
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_at_work') {
          addBotMessageWithKey('chat.messages.immigrationUrgent.atWork', [
            { id: 'imm-workplace-raids', labelKey: 'chat.replies.immWorkplaceRaids', value: 'imm_workplace_raids', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_in_public') {
          addBotMessageWithKey('chat.messages.immigrationUrgent.inPublic', [
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        }
        break;

      case 'immigration_planning_who':
        if (reply.value === 'imm_myself') {
          addBotMessageWithKey('chat.messages.immigrationPlanning.myself', [
            { id: 'imm-daca-tps', labelKey: 'chat.replies.immDacaTps', value: 'imm_daca_tps', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_family') {
          addBotMessageWithKey('chat.messages.immigrationPlanning.family', [
            { id: 'imm-family-planning', labelKey: 'chat.replies.immFamilyPlanning', value: 'imm_family_planning', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_workplace') {
          addBotMessageWithKey('chat.messages.immigrationPlanning.workplace', [
            { id: 'imm-workplace-raids', labelKey: 'chat.replies.immWorkplaceRaids', value: 'imm_workplace_raids', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        }
        break;

      case 'immigration_detained_status':
        if (reply.value === 'imm_ice_detention') {
          addBotMessageWithKey('chat.messages.immigrationDetained.iceDetention', [
            { id: 'imm-bond-hearings', labelKey: 'chat.replies.immBondHearings', value: 'imm_bond_hearings', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_county_jail') {
          addBotMessageWithKey('chat.messages.immigrationDetained.countyJail', [
            { id: 'imm-bond-hearings', labelKey: 'chat.replies.immBondHearings', value: 'imm_bond_hearings', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        } else if (reply.value === 'imm_port_entry') {
          addBotMessageWithKey('chat.messages.immigrationDetained.portOfEntry', [
            { id: 'imm-bond-hearings', labelKey: 'chat.replies.immBondHearings', value: 'imm_bond_hearings', color: 'blue' as const },
            { id: 'imm-find-attorney', labelKey: 'chat.replies.immFindAttorney', value: 'imm_find_attorney', color: 'green' as const },
            { id: 'imm-back-hub', labelKey: 'chat.replies.immBackToHub', value: 'imm_back_hub', color: 'slate' as const },
          ]);
          actions.markFlowCompleted('immigration');
          actions.setCurrentStep('immigration_result');
        }
        break;

      case 'immigration_result':
        if (reply.value === 'imm_find_attorney') {
          setLocation('/immigration-guidance/find-attorney');
        } else if (reply.value === 'imm_daca_tps') {
          setLocation('/immigration-guidance/daca-tps');
        } else if (reply.value === 'imm_family_planning') {
          setLocation('/immigration-guidance/family-planning');
        } else if (reply.value === 'imm_workplace_raids') {
          setLocation('/immigration-guidance/workplace-raids');
        } else if (reply.value === 'imm_bond_hearings') {
          setLocation('/immigration-guidance/bond-hearings');
        } else if (reply.value === 'imm_back_hub') {
          setLocation('/immigration-guidance');
        }
        break;

      case 'court_stage':
        actions.updateCaseInfo({ courtStage: reply.value });
        addBotMessageWithKey('chat.messages.custodyQuestion', [
          { id: 'custody-yes', labelKey: 'chat.replies.inCustody', value: 'yes', color: 'rose' as const },
          { id: 'custody-bail', labelKey: 'chat.replies.onBail', value: 'bail', color: 'amber' as const },
          { id: 'custody-or', labelKey: 'chat.replies.ownRecognizance', value: 'recognizance', color: 'blue' as const },
          { id: 'custody-no', labelKey: 'chat.replies.notInCustody', value: 'no', color: 'blue' as const },
        ]);
        actions.setCurrentStep('custody_status');
        break;

      case 'custody_status':
        actions.updateCaseInfo({ custodyStatus: reply.value });
        addBotMessageWithKey('chat.messages.attorneyQuestion', [
          { id: 'attorney-yes', labelKey: 'chat.replies.hasAttorney', value: 'yes', color: 'green' as const },
          { id: 'attorney-no', labelKey: 'chat.replies.noAttorney', value: 'no', color: 'amber' as const },
        ]);
        actions.setCurrentStep('attorney_status');
        break;

      case 'attorney_status':
        actions.updateCaseInfo({ hasAttorney: reply.value === 'yes' });
        // Always show the privilege warning regardless of attorney status
        // since what users type here is not protected by attorney-client privilege
        addBotMessageWithKey('chat.messages.descriptionPromptWithWarning', [
          { id: 'privilege-continue', labelKey: 'chat.replies.privilegeContinue', value: 'privilege_continue', color: 'slate' as const },
          { id: 'privilege-skip', labelKey: 'chat.replies.privilegeSkip', value: 'privilege_skip', color: 'blue' as const },
        ]);
        actions.setCurrentStep('privilege_warning');
        break;

      case 'privilege_warning':
        if (reply.value === 'privilege_continue') {
          setPrivilegeWarningAcknowledged(true);
          addBotMessageWithKey('chat.messages.privilegeAcknowledged');
          actions.setCurrentStep('incident_description');
        } else if (reply.value === 'privilege_skip') {
          setPrivilegeWarningAcknowledged(true);
          handlePrivilegeSkip();
        }
        break;

      default:
        if (reply.value === 'view_guidance') {
          handleViewGuidance();
        } else if (reply.value === 'export_pdf') {
          handleExportClick();
        } else if (reply.value === 'find_public_defender') {
          // "What To Do Now" action - Find a Public Defender
          addBotMessageWithKey('chat.messages.enterZipPD');
          actions.setCurrentStep('pd_zip_search');
        } else if (reply.value === 'find_legal_aid') {
          // "What To Do Now" action - Find Legal Aid
          addBotMessageWithKey('chat.messages.enterZipLegalAid');
          actions.setCurrentStep('legal_aid_zip_search');
        } else if (reply.value === 'ask_follow_up') {
          // "What To Do Now" action - Ask Follow-Up Question
          addBotMessageWithKey('chat.messages.askFollowUpPrompt');
          actions.setCurrentStep('follow_up');
        } else if (reply.value === 'back_to_menu') {
          // "What To Do Now" action - Back to main menu
          const menuOptions = getNextMenuOptions('personalized_guidance', state.completedFlows);
          addBotMessageWithKey('chat.messages.whatElse', menuOptions);
          actions.setCurrentStep('main_menu');
        }
        break;
    }
  }, [state.currentStep, state.completedFlows, actions, addBotMessage, addBotMessageWithKey]);

  const handleStateSelect = useCallback((stateCode: string) => {
    actions.saveHistoryPoint(); // Save history before this selection
    const stateName = US_STATES[stateCode] || stateCode;
    actions.addMessage({ role: 'user', content: stateName });
    actions.updateCaseInfo({ state: stateCode, stateName });
    
    addBotMessageWithKey('chat.messages.chargeQuestion', undefined, { state: stateName });
    setShowChargeSelector(true);
    actions.setCurrentStep('charge_selection');
  }, [actions, addBotMessageWithKey]);

  const handleChargesSelect = useCallback((charges: Array<{ id: string; code: string; name: string }>) => {
    actions.saveHistoryPoint(); // Save history before this selection
    const chargeNames = charges.map(c => c.name);
    const chargeIds = charges.map(c => c.id);
    
    actions.addMessage({ role: 'user', content: chargeNames.join(', ') });
    actions.updateCaseInfo({ charges: chargeIds, chargeNames });
    setShowChargeSelector(false);

    addBotMessageWithKey('chat.messages.stageQuestion', [
      { id: 'stage-arrest', labelKey: 'chat.replies.stageArrest', value: 'arrest' },
      { id: 'stage-arraignment', labelKey: 'chat.replies.stageArraignment', value: 'arraignment' },
      { id: 'stage-pretrial', labelKey: 'chat.replies.stagePretrial', value: 'pretrial' },
      { id: 'stage-trial', labelKey: 'chat.replies.stageTrial', value: 'trial' },
      { id: 'stage-sentencing', labelKey: 'chat.replies.stageSentencing', value: 'sentencing' },
      { id: 'stage-unsure', labelKey: 'chat.replies.stageUnsure', value: 'unsure' },
    ]);
    actions.setCurrentStep('court_stage');
  }, [actions, addBotMessageWithKey]);

  const handleConcernToggle = useCallback((concernId: string) => {
    setSelectedConcerns(prev =>
      prev.includes(concernId)
        ? prev.filter(id => id !== concernId)
        : [...prev, concernId]
    );
  }, []);

  const handleConcernsSubmit = useCallback(async () => {
    // Display selected concerns as user message
    const selectedLabels = selectedConcerns.map(id => {
      const category = concernsCategories.find(c => c.id === id);
      return category ? t(category.labelKey) : id;
    });
    actions.addMessage({ role: 'user', content: selectedLabels.join(', ') || t('chat.concerns.none', 'None selected') });
    actions.updateCaseInfo({ selectedConcerns: [...selectedConcerns] });

    setIsTyping(true);
    actions.setIsGenerating(true);
    actions.setCurrentStep('generating_guidance');
    setStillWorkingShown(false);

    try {
      const response = await apiRequest('POST', '/api/legal-guidance', {
        jurisdiction: state.caseInfo.state,
        charges: state.caseInfo.charges,
        caseStage: state.caseInfo.courtStage,
        custodyStatus: state.caseInfo.custodyStatus,
        hasAttorney: state.caseInfo.hasAttorney,
        incidentDescription: state.caseInfo.incidentDescription,
        selectedConcerns: selectedConcerns,
        language: i18n.language,
      });

      const data = await response.json();

      setIsTyping(false);
      actions.setIsGenerating(false);
      actions.setGuidanceData(data.guidance || data);
      actions.markFlowCompleted('personalized_guidance');

      addBotMessageWithKey('chat.messages.guidanceReady', [
        { id: 'view-guidance', labelKey: 'chat.replies.viewGuidance', value: 'view_guidance', color: 'blue' as const },
        { id: 'export-pdf', labelKey: 'chat.replies.exportPdf', value: 'export_pdf', color: 'slate' as const },
      ]);

      // Reset selected concerns for next time
      setSelectedConcerns([]);

    } catch (error) {
      console.error('Guidance generation error:', error);
      setIsTyping(false);
      actions.setIsGenerating(false);

      addBotMessageWithKey('chat.messages.error', [
        { id: 'retry', labelKey: 'chat.replies.retry', value: 'retry' },
      ]);
    }
  }, [selectedConcerns, state.caseInfo, actions, addBotMessageWithKey, t, i18n.language]);

  const handleFreeTextSubmit = useCallback(async (message: string) => {
    if (state.currentStep === 'incident_description') {
      actions.addMessage({ role: 'user', content: message });
      actions.updateCaseInfo({ incidentDescription: message });

      // Reset selected concerns when entering concerns step
      setSelectedConcerns([]);
      addBotMessageWithKey('chat.messages.concernsQuestion');
      actions.setCurrentStep('concerns_question');

    } else if (state.currentStep === 'pd_zip_search') {
      const zipCode = message.trim();
      if (!/^\d{5}$/.test(zipCode)) {
        addBotMessageWithKey('chat.messages.invalidZip');
        return;
      }
      
      actions.addMessage({ role: 'user', content: zipCode });
      setIsTyping(true);
      
      try {
        const offices = await searchPublicDefenderOffices(zipCode);
        setIsTyping(false);
        
        if (offices.length === 0) {
          addBotMessageWithKey('chat.messages.noPDFound', getNextMenuOptions('resources', state.completedFlows), { zipCode });
        } else {
          const resultsText = offices.slice(0, 3).map((office, i) => 
            `**${i + 1}. ${office.name}**\n📍 ${office.address}${office.phone ? `\n📞 ${office.phone}` : ''}${office.distance ? `\n📏 ${office.distance} miles away` : ''}`
          ).join('\n\n');
          
          addBotMessage(t('chat.messages.pdResults', `Here are Public Defender offices near {{zipCode}}:\n\n${resultsText}\n\n**What else can I help you with?**`, { zipCode }), getNextMenuOptions('resources', state.completedFlows));
        }
        
        actions.markFlowCompleted('resources');
        actions.setCurrentStep('main_menu');
      } catch (error) {
        setIsTyping(false);
        addBotMessageWithKey('chat.messages.searchError', [
          { id: 'retry-pd', labelKey: 'chat.replies.tryAgain', value: 'resources_pd', color: 'green' as const },
          ...getNextMenuOptions('resources', state.completedFlows),
        ]);
        actions.setCurrentStep('main_menu');
      }
      
    } else if (state.currentStep === 'legal_aid_zip_search') {
      const zipCode = message.trim();
      if (!/^\d{5}$/.test(zipCode)) {
        addBotMessageWithKey('chat.messages.invalidZip');
        return;
      }
      
      actions.addMessage({ role: 'user', content: zipCode });
      setIsTyping(true);
      
      try {
        const orgs = await searchLegalAidOrganizations(zipCode);
        setIsTyping(false);
        
        if (orgs.length === 0) {
          addBotMessageWithKey('chat.messages.noLegalAidFound', getNextMenuOptions('resources', state.completedFlows), { zipCode });
        } else {
          const resultsText = orgs.slice(0, 3).map((org, i) => 
            `**${i + 1}. ${org.name}**\n📍 ${org.address}${org.phone ? `\n📞 ${org.phone}` : ''}${org.distance ? `\n📏 ${org.distance} miles away` : ''}`
          ).join('\n\n');
          
          addBotMessage(t('chat.messages.legalAidResults', `Here are Legal Aid organizations near {{zipCode}}:\n\n${resultsText}\n\n**What else can I help you with?**`, { zipCode }), getNextMenuOptions('resources', state.completedFlows));
        }
        
        actions.markFlowCompleted('resources');
        actions.setCurrentStep('main_menu');
      } catch (error) {
        setIsTyping(false);
        addBotMessageWithKey('chat.messages.searchError', [
          { id: 'retry-legal-aid', labelKey: 'chat.replies.tryAgain', value: 'resources_legal_aid', color: 'green' as const },
          ...getNextMenuOptions('resources', state.completedFlows),
        ]);
        actions.setCurrentStep('main_menu');
      }
      
    } else if (state.currentStep === 'follow_up' || state.currentStep === 'guidance_ready') {
      actions.addMessage({ role: 'user', content: message });
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        addBotMessageWithKey('chat.messages.followUpResponse');
      }, 1500);
    }
  }, [state.currentStep, state.caseInfo, state.completedFlows, actions, addBotMessage, addBotMessageWithKey, t]);

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
    
    // Add personalized practice Q&A if available
    if (data.mockQA && data.mockQA.length > 0) {
      formattedContent += `\n\n**${t('mockQA.personalizedTitle', 'Practice Questions for Your Case')}**\n`;
      formattedContent += `${t('mockQA.sectionSubtitle', 'Questions you may be asked during your proceeding')}\n\n`;
      data.mockQA.forEach((qa: { question: string; suggestedResponse: string; explanation: string }, index: number) => {
        formattedContent += `**${index + 1}. ${qa.question}**\n`;
        formattedContent += `> ${t('mockQA.suggestedResponse', 'Suggested Response')}: "${qa.suggestedResponse}"\n`;
        formattedContent += `*${qa.explanation}*\n\n`;
      });
    }
    
    // Add Documents You Should Have section based on case stage
    const casePhase = mapCaseStageToPhase(state.caseInfo.courtStage || 'just_arrested');
    const relevantDocuments = getDocumentsForPhase(casePhase, 'criminal');
    if (relevantDocuments.length > 0) {
      formattedContent += `\n\n**${t('documents.guidance.documentsSection.title', 'Documents You Should Have')}**\n`;
      formattedContent += `${t('documents.guidance.documentsSection.description', 'Based on your case stage, you should have received these important documents.')}\n`;
      relevantDocuments.slice(0, 5).forEach((doc: LegalDocument) => {
        const docTitle = t(doc.titleKey);
        const importanceLabel = t(`documentLibrary.importance.${doc.importanceLevel}`);
        formattedContent += `• ${docTitle} (${importanceLabel})\n`;
      });
      formattedContent += `\n[${t('documents.guidance.documentsSection.viewLibrary', 'View All Documents')}](/document-library)`;
    }
    
    if (!formattedContent) {
      formattedContent = "Your legal guidance is ready. Please export as PDF for full details.";
    }
    
    // Add confidence badge
    const stateName = state.caseInfo.stateName || state.caseInfo.state;
    const verificationBadge = stateName 
      ? t('chat.messages.verifiedAgainst', { state: stateName, defaultValue: `✓ Verified against ${stateName} criminal statutes` })
      : t('chat.messages.verifiedGeneric', '✓ Verified against official criminal statutes');
    
    formattedContent += `\n\n---\n*${verificationBadge}*`;
    
    // Add "What To Do Now" section
    formattedContent += `\n\n${t('chat.messages.whatToDoNow', '**What would you like to do next?**')}`;
    
    // "What To Do Now" action buttons - primary actions first, then secondary options
    const whatToDoNowOptions = [
      { id: 'find-pd-action', labelKey: 'chat.replies.findPublicDefenderAction', value: 'find_public_defender', color: 'blue' as const },
      { id: 'find-legal-aid-action', labelKey: 'chat.replies.findLegalAidAction', value: 'find_legal_aid', color: 'blue' as const },
      { id: 'save-guidance', labelKey: 'chat.replies.saveGuidance', value: 'export_pdf', color: 'slate' as const },
      { id: 'ask-followup', labelKey: 'chat.replies.askFollowUp', value: 'ask_follow_up', color: 'slate' as const },
      { id: 'more-options', labelKey: 'chat.replies.moreOptions', value: 'back_to_menu', color: 'slate' as const },
    ];
    
    addBotMessage(formattedContent, whatToDoNowOptions);
    actions.setCurrentStep('guidance_ready');
  }, [state.guidanceData, state.caseInfo, addBotMessage, actions, t]);

  const handleExportClick = useCallback(() => {
    if (!state.guidanceData) {
      toast({ title: t('chat.export.noData', 'No guidance to export'), variant: "destructive" });
      return;
    }
    setShowExportWarning(true);
  }, [state.guidanceData, toast, t]);

  const handleConfirmExport = useCallback(async () => {
    setShowExportWarning(false);
    
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
      
      addBotMessageWithKey('chat.messages.exportedWhatElse', getNextMenuOptions('personalized_guidance', state.completedFlows));
      actions.setCurrentStep('main_menu');
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: t('chat.export.error', 'Failed to export PDF'), variant: "destructive" });
    }
  }, [state.guidanceData, state.caseInfo, state.completedFlows, actions, toast, t, addBotMessageWithKey]);

  const handlePrivilegeSkip = useCallback(async () => {
    setIsTyping(true);
    actions.setIsGenerating(true);
    actions.setCurrentStep('generating_guidance');
    
    try {
      const response = await apiRequest('POST', '/api/legal-guidance', {
        jurisdiction: state.caseInfo.state,
        charges: state.caseInfo.charges,
        caseStage: state.caseInfo.courtStage,
        custodyStatus: state.caseInfo.custodyStatus,
        hasAttorney: false,
        incidentDescription: '',
        concerns: '',
        language: i18n.language,
      });

      const data = await response.json();
      
      setIsTyping(false);
      actions.setIsGenerating(false);
      actions.setGuidanceData(data.guidance || data);
      actions.markFlowCompleted('personalized_guidance');
      
      addBotMessageWithKey('chat.messages.guidanceReady', [
        { id: 'view-guidance', labelKey: 'chat.replies.viewGuidance', value: 'view_guidance', color: 'blue' as const },
        { id: 'export-pdf', labelKey: 'chat.replies.exportPdf', value: 'export_pdf', color: 'slate' as const },
      ]);
    } catch (error) {
      console.error('Guidance generation error:', error);
      setIsTyping(false);
      actions.setIsGenerating(false);
      addBotMessageWithKey('chat.messages.error', [
        { id: 'retry', labelKey: 'chat.replies.retry', value: 'retry' },
      ]);
    }
  }, [state.caseInfo, actions, addBotMessageWithKey, i18n.language]);

  const canUseFreeText = state.currentStep === 'incident_description' ||
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
              {actions.canGoBack() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={actions.goBack}
                  className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  data-testid="button-go-back"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="text-xs">{t('chat.header.back', 'Back')}</span>
                </Button>
              )}
              <h1 className="text-sm font-semibold text-foreground">{t('chat.header.title', 'PD Chat')}</h1>
            </div>
            
            <div className="flex items-center gap-1">
              {state.guidanceData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportClick}
                  data-testid="button-export-pdf"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('chat.header.export', 'Export')}
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    data-testid="button-language-toggle"
                    aria-label="Change language"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('en')}
                    className={i18n.language === 'en' ? 'bg-accent' : ''}
                    data-testid="menu-item-english"
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('es')}
                    className={i18n.language === 'es' ? 'bg-accent' : ''}
                    data-testid="menu-item-spanish"
                  >
                    🇪🇸 Español
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('zh')}
                    className={i18n.language === 'zh' ? 'bg-accent' : ''}
                    data-testid="menu-item-chinese"
                  >
                    🇨🇳 中文
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
                data-testid="button-theme-toggle"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="hidden md:flex"
                data-testid="button-close-chat"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <ProgressBreadcrumbs currentStep={state.currentStep} />

          <ScrollArea className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 180px)' }}>
            <div className="max-w-2xl mx-auto space-y-3" role="log" aria-live="polite" aria-label="Chat messages">
              {pendingCount > 0 && (
                <div className="text-center py-2 text-sm text-muted-foreground animate-pulse">
                  {t('chat.loadingHistory', 'Loading earlier messages...')}
                </div>
              )}
              {visibleMessages.map((message, index) => (
                <div key={message.id}>
                  <MessageBubble 
                    message={message} 
                    isLatest={index === visibleMessages.length - 1}
                  />
                  {message.quickReplies && index === visibleMessages.length - 1 && (
                    <div className="ml-0 sm:ml-11">
                      <QuickReplyButtons
                        replies={message.quickReplies}
                        onSelect={handleQuickReply}
                        disabled={state.isGenerating}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <AnimatePresence>
                {isTyping && state.currentStep === 'generating_guidance' && (
                  <GeneratingProgress 
                    isGenerating={state.isGenerating} 
                    onProgressComplete={handleStillWorking}
                  />
                )}
                {isTyping && <TypingIndicator />}
              </AnimatePresence>
              
              {showChargeSelector && state.caseInfo.state && (
                <div className="ml-0 sm:ml-11 mt-3">
                  <ChargeSelector
                    jurisdiction={state.caseInfo.state}
                    onSelect={handleChargesSelect}
                  />
                </div>
              )}

              {state.currentStep === 'state_selection' && !showChargeSelector && (
                <div className="ml-0 sm:ml-11 mt-3">
                  <StateSelector onSelect={handleStateSelect} />
                </div>
              )}

              {state.currentStep === 'concerns_question' && (
                <div className="ml-0 sm:ml-11 mt-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('chat.concerns.selectPrompt', 'Tap all that apply, then Continue')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {concernsCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedConcerns.includes(category.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleConcernToggle(category.id)}
                        className={`transition-all ${
                          selectedConcerns.includes(category.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
                        }`}
                      >
                        {selectedConcerns.includes(category.id) && (
                          <span className="mr-1">✓</span>
                        )}
                        {t(category.labelKey)}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleConcernsSubmit}
                      disabled={state.isGenerating}
                      className="min-w-[120px]"
                    >
                      {t('chat.concerns.done', 'Continue')}
                      {selectedConcerns.length > 0 && (
                        <span className="ml-2 bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs">
                          {selectedConcerns.length}
                        </span>
                      )}
                    </Button>
                    {selectedConcerns.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {selectedConcerns.length} {t('chat.concerns.selected', 'selected')}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Scroll anchor - always at the bottom */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 sm:p-6 border-t border-border bg-background">
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
                  : (state.currentStep === 'pd_zip_search' || state.currentStep === 'legal_aid_zip_search')
                  ? t('chat.input.zipPlaceholder', 'Enter your 5-digit ZIP code...')
                  : t('chat.input.placeholder', 'Ask a follow-up question...')
                }
              />
              <p className="text-xs text-muted-foreground text-center mt-3">
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

      {/* Export Warning Dialog */}
      <AlertDialog open={showExportWarning} onOpenChange={setShowExportWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('exportWarning.title', 'Important: Before You Export')}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-left">
                <p>{t('exportWarning.intro', 'This document contains details about your legal situation that you provided. Please be aware:')}</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.notLegalAdvice', 'This is not legal advice')}</strong> — {t('exportWarning.notLegalAdviceDesc', "It's general legal information only")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.notPrivileged', 'Not protected by attorney-client privilege')}</strong> — {t('exportWarning.notPrivilegedDesc', 'Documents you create and share may be requested by opposing parties in legal proceedings')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.shareWithAttorney', 'Share only with your attorney')}</strong> — {t('exportWarning.shareWithAttorneyDesc', 'If you have a lawyer, share this with them first before anyone else')}</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  {t('exportWarning.recommendation', 'We recommend discussing this guidance with a licensed attorney before taking any action.')}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExport} data-testid="button-confirm-export">
              {t('exportWarning.confirmButton', 'I Understand, Export PDF')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
