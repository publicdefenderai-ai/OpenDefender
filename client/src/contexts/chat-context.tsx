import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

export interface QuickReply {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface Message {
  id: string;
  role: 'bot' | 'user';
  content: string;
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
  isEmergency?: boolean;
}

export type ConversationStep =
  | 'welcome'
  | 'emergency_check'
  | 'emergency_options'
  | 'state_selection'
  | 'charge_selection'
  | 'court_stage'
  | 'custody_status'
  | 'attorney_status'
  | 'incident_description'
  | 'generating_guidance'
  | 'guidance_ready'
  | 'follow_up'
  | 'completed';

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

interface ChatState {
  messages: Message[];
  caseInfo: CaseInfo;
  currentStep: ConversationStep;
  isOpen: boolean;
  hasUnsavedGuidance: boolean;
  guidanceData: GuidanceData | null;
  isGenerating: boolean;
  hasExported: boolean;
}

interface ChatContextValue {
  state: ChatState;
  actions: {
    openChat: () => void;
    closeChat: () => void;
    addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    selectQuickReply: (reply: QuickReply) => void;
    updateCaseInfo: (info: Partial<CaseInfo>) => void;
    setCurrentStep: (step: ConversationStep) => void;
    setGuidanceData: (data: GuidanceData) => void;
    setIsGenerating: (generating: boolean) => void;
    setHasExported: (exported: boolean) => void;
    resetChat: () => void;
  };
}

const initialState: ChatState = {
  messages: [],
  caseInfo: {},
  currentStep: 'welcome',
  isOpen: false,
  hasUnsavedGuidance: false,
  guidanceData: null,
  isGenerating: false,
  hasExported: false,
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

  const selectQuickReply = useCallback((reply: QuickReply) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: reply.label,
      timestamp: new Date(),
    };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
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
    },
  }), [state, openChat, closeChat, addMessage, selectQuickReply, updateCaseInfo, setCurrentStep, setGuidanceData, setIsGenerating, setHasExported, resetChat]);

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
