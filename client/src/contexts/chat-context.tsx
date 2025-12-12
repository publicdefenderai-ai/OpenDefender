import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

export interface QuickReply {
  id: string;
  label?: string;
  labelKey?: string;
  value: string;
  icon?: string;
  color?: 'blue' | 'rose' | 'slate' | 'green' | 'purple' | 'amber';
}

export interface Message {
  id: string;
  role: 'bot' | 'user';
  content?: string;
  contentKey?: string;
  contentParams?: Record<string, string | number>;
  timestamp: Date;
  quickReplies?: QuickReply[];
  metadata?: Record<string, unknown>;
}

export interface CaseInfo {
  state?: string;
  stateName?: string;
  charges?: string[];
  chargeNames?: string[];
  courtStage?: string;
  custodyStatus?: string;
  hasAttorney?: boolean;
  incidentDescription?: string;
  concerns?: string;
  isEmergency?: boolean;
}

export type ConversationStep =
  | 'welcome'
  | 'emergency_check'
  | 'emergency_options'
  | 'main_menu'
  | 'rights_info_menu'
  | 'resources_menu'
  | 'laws_records_menu'
  | 'immigration_info'
  | 'pd_zip_search'
  | 'pd_results'
  | 'legal_aid_zip_search'
  | 'legal_aid_results'
  | 'state_selection'
  | 'charge_selection'
  | 'court_stage'
  | 'custody_status'
  | 'attorney_status'
  | 'incident_description'
  | 'concerns_question'
  | 'generating_guidance'
  | 'guidance_ready'
  | 'follow_up'
  | 'completed';

export type CompletedFlow = 
  | 'personalized_guidance'
  | 'immigration'
  | 'rights_info'
  | 'resources'
  | 'laws_records';

interface GuidanceData {
  sessionId: string;
  overview: string;
  criticalAlerts: string[];
  immediateActions: Array<{ action: string; urgency: string }>;
  nextSteps: string[];
  deadlines: Array<{ event: string; timeframe: string; description: string; priority: string }>;
  rights: string[];
  resources: Array<{ type: string; description: string; contact: string }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{ stage: string; description: string; timeframe: string; completed: boolean }>;
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
  };
  precedentCases?: Array<{
    id: string;
    caseName: string;
    citation: string;
    court: string;
    relevanceScore: number;
  }>;
}

interface StepHistoryEntry {
  step: ConversationStep;
  messageCount: number;
  caseInfo: CaseInfo;
}

interface ChatState {
  messages: Message[];
  caseInfo: CaseInfo;
  currentStep: ConversationStep;
  stepHistory: StepHistoryEntry[];
  isOpen: boolean;
  hasUnsavedGuidance: boolean;
  guidanceData: GuidanceData | null;
  isGenerating: boolean;
  hasExported: boolean;
  completedFlows: CompletedFlow[];
}

interface ChatContextValue {
  state: ChatState;
  actions: {
    openChat: () => void;
    closeChat: () => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    selectQuickReply: (reply: QuickReply, displayLabel?: string) => void;
    updateCaseInfo: (info: Partial<CaseInfo>) => void;
    setCurrentStep: (step: ConversationStep) => void;
    setGuidanceData: (data: GuidanceData) => void;
    setIsGenerating: (generating: boolean) => void;
    setHasExported: (exported: boolean) => void;
    resetChat: () => void;
    goBack: () => void;
    canGoBack: () => boolean;
    saveHistoryPoint: () => void;
    markFlowCompleted: (flow: CompletedFlow) => void;
    getAvailableFlows: () => CompletedFlow[];
  };
}

const initialState: ChatState = {
  messages: [],
  caseInfo: {},
  currentStep: 'welcome',
  stepHistory: [],
  isOpen: false,
  hasUnsavedGuidance: false,
  guidanceData: null,
  isGenerating: false,
  hasExported: false,
  completedFlows: [],
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ChatState>(initialState);

  const openChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
  }, []);

  const selectQuickReply = useCallback((reply: QuickReply, displayLabel?: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: displayLabel || reply.label || '',
      timestamp: new Date(),
    };
    setState(prev => {
      // Save history BEFORE adding the user's reply message
      // This way, going back will restore to the state before this interaction
      const historyEntry: StepHistoryEntry = {
        step: prev.currentStep,
        messageCount: prev.messages.length,
        caseInfo: { ...prev.caseInfo },
      };
      return {
        ...prev,
        messages: [...prev.messages, userMessage],
        stepHistory: [...prev.stepHistory, historyEntry],
      };
    });
  }, []);

  const updateCaseInfo = useCallback((info: Partial<CaseInfo>) => {
    setState(prev => ({
      ...prev,
      caseInfo: { ...prev.caseInfo, ...info },
    }));
  }, []);

  const setCurrentStep = useCallback((step: ConversationStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const saveHistoryPoint = useCallback(() => {
    setState(prev => {
      const historyEntry: StepHistoryEntry = {
        step: prev.currentStep,
        messageCount: prev.messages.length,
        caseInfo: { ...prev.caseInfo },
      };
      return {
        ...prev,
        stepHistory: [...prev.stepHistory, historyEntry],
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setState(prev => {
      if (prev.stepHistory.length === 0) return prev;
      
      const newHistory = [...prev.stepHistory];
      const previousState = newHistory.pop()!;
      
      // Remove messages added after the previous state
      const messages = prev.messages.slice(0, previousState.messageCount);
      
      return {
        ...prev,
        currentStep: previousState.step,
        stepHistory: newHistory,
        messages,
        caseInfo: previousState.caseInfo,
      };
    });
  }, []);

  const canGoBack = useCallback(() => {
    return state.stepHistory.length > 0 && 
           state.currentStep !== 'generating_guidance' && 
           state.currentStep !== 'guidance_ready' &&
           state.currentStep !== 'welcome';
  }, [state.stepHistory.length, state.currentStep]);

  const setGuidanceData = useCallback((data: GuidanceData) => {
    setState(prev => ({
      ...prev,
      guidanceData: data,
      hasUnsavedGuidance: true,
      currentStep: 'guidance_ready',
    }));
  }, []);

  const setIsGenerating = useCallback((generating: boolean) => {
    setState(prev => ({ ...prev, isGenerating: generating }));
  }, []);

  const setHasExported = useCallback((exported: boolean) => {
    setState(prev => ({
      ...prev,
      hasExported: exported,
      hasUnsavedGuidance: exported ? false : prev.hasUnsavedGuidance,
    }));
  }, []);

  const resetChat = useCallback(() => {
    setState(initialState);
  }, []);

  const markFlowCompleted = useCallback((flow: CompletedFlow) => {
    setState(prev => ({
      ...prev,
      completedFlows: prev.completedFlows.includes(flow) 
        ? prev.completedFlows 
        : [...prev.completedFlows, flow],
    }));
  }, []);

  const getAvailableFlows = useCallback((): CompletedFlow[] => {
    const allFlows: CompletedFlow[] = ['personalized_guidance', 'immigration', 'rights_info', 'resources', 'laws_records'];
    return allFlows.filter(flow => !state.completedFlows.includes(flow));
  }, [state.completedFlows]);

  const value = useMemo(() => ({
    state,
    actions: {
      openChat,
      closeChat,
      addMessage,
      selectQuickReply,
      updateCaseInfo,
      setCurrentStep,
      setGuidanceData,
      setIsGenerating,
      setHasExported,
      resetChat,
      goBack,
      canGoBack,
      saveHistoryPoint,
      markFlowCompleted,
      getAvailableFlows,
    },
  }), [state, openChat, closeChat, addMessage, selectQuickReply, updateCaseInfo, setCurrentStep, setGuidanceData, setIsGenerating, setHasExported, resetChat, goBack, canGoBack, saveHistoryPoint, markFlowCompleted, getAvailableFlows]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
