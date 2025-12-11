import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ArrowLeft, Lock, AlertTriangle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat, QuickReply, ConversationStep } from "@/contexts/chat-context";
import { MessageBubble, TypingIndicator } from "@/components/chat/message-bubble";
import { QuickReplyButtons, FullWidthReply } from "@/components/chat/quick-replies";
import { ProgressDots } from "@/components/chat/progress-indicator";
import { CaseStatusPanel } from "@/components/chat/case-status-panel";
import { ChatInput } from "@/components/chat/chat-input";
import { StateSelector } from "@/components/chat/state-selector";
import { ChargeSelector } from "@/components/chat/charge-selector";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
          { id: 'urgent-yes', label: t('chat.replies.urgentYes', "Yes, I need help right now"), value: 'urgent_yes', icon: '🚨' },
          { id: 'urgent-no', label: t('chat.replies.urgentNo', "No, I have time to talk"), value: 'urgent_no', icon: '✓' },
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
          addBotMessage(t('chat.messages.emergencyAdvice', "I understand this is urgent. Here's what's most important right now:\n\n• Stay calm and don't resist\n• You have the right to remain silent\n• Ask for a lawyer before answering questions\n\nLet me get you the right guidance. What state are you in?"));
        } else {
          addBotMessage(t('chat.messages.stateQuestion', "Great, let's take this step by step. First, what state is your case in?"));
        }
        actions.setCurrentStep('state_selection');
        break;

      case 'court_stage':
        actions.updateCaseInfo({ courtStage: reply.value });
        addBotMessage(t('chat.messages.custodyQuestion', "Are you currently in custody or have you been released?"), [
          { id: 'custody-yes', label: t('chat.replies.inCustody', "Yes, in custody"), value: 'yes', icon: '🔒' },
          { id: 'custody-bail', label: t('chat.replies.onBail', "Out on bail/bond"), value: 'bail', icon: '💰' },
          { id: 'custody-or', label: t('chat.replies.ownRecognizance', "Released on my own"), value: 'recognizance', icon: '✓' },
          { id: 'custody-no', label: t('chat.replies.notInCustody', "Not in custody"), value: 'no', icon: '🏠' },
        ]);
        actions.setCurrentStep('custody_status');
        break;

      case 'custody_status':
        actions.updateCaseInfo({ custodyStatus: reply.value });
        addBotMessage(t('chat.messages.attorneyQuestion', "Do you have an attorney or public defender?"), [
          { id: 'attorney-yes', label: t('chat.replies.hasAttorney', "Yes, I have representation"), value: 'yes', icon: '⚖️' },
          { id: 'attorney-no', label: t('chat.replies.noAttorney', "No, I need to find one"), value: 'no', icon: '❓' },
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
    const stateName = US_STATES[stateCode] || stateCode;
    actions.addMessage({ role: 'user', content: stateName });
    actions.updateCaseInfo({ state: stateCode, stateName });
    
    addBotMessage(t('chat.messages.chargeQuestion', `Got it, ${stateName}. What charges are you facing? Select all that apply.`));
    setShowChargeSelector(true);
    actions.setCurrentStep('charge_selection');
  }, [actions, addBotMessage, t]);

  const handleChargesSelect = useCallback((charges: Array<{ code: string; name: string }>) => {
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
          incidentDescription: message,
        });

        const data = await response.json();
        
        setIsTyping(false);
        actions.setIsGenerating(false);
        actions.setGuidanceData(data.guidance || data);
        
        addBotMessage(t('chat.messages.guidanceReady', "Your legal guidance is ready! I've put together a summary of your situation, important deadlines, your rights, and recommended next steps.\n\nYou can export this to keep for your records."), [
          { id: 'view-guidance', label: t('chat.replies.viewGuidance', "View My Guidance"), value: 'view_guidance', icon: '📋' },
          { id: 'export-pdf', label: t('chat.replies.exportPdf', "Export as PDF"), value: 'export_pdf', icon: '📄' },
        ]);
        
      } catch (error) {
        console.error('Guidance generation error:', error);
        setIsTyping(false);
        actions.setIsGenerating(false);
        
        addBotMessage(t('chat.messages.error', "I'm sorry, I encountered an issue generating your guidance. Please try again or contact support if the problem continues."), [
          { id: 'retry', label: t('chat.replies.retry', "Try Again"), value: 'retry' },
        ]);
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
    
    addBotMessage(formattedContent);
    actions.setCurrentStep('follow_up');
  }, [state.guidanceData, addBotMessage, actions]);

  const handleExportPdf = useCallback(async () => {
    if (!state.guidanceData) {
      toast({ title: t('chat.export.noData', 'No guidance to export'), variant: "destructive" });
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const margin = 20;
      let y = margin;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - (margin * 2);
      
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Legal Guidance Summary', margin, y);
      y += 12;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);
      y += 8;
      doc.text(`State: ${state.caseInfo.stateName || state.caseInfo.state || 'N/A'}`, margin, y);
      y += 8;
      if (state.caseInfo.chargeNames?.length) {
        doc.text(`Charges: ${state.caseInfo.chargeNames.join(', ')}`, margin, y);
        y += 8;
      }
      y += 6;
      
      doc.setTextColor(0);
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;
      
      const data = state.guidanceData;
      let content = "";
      
      if (data.overview) {
        content += `OVERVIEW\n${data.overview}\n\n`;
      }
      
      if (data.rights && data.rights.length > 0) {
        content += `YOUR RIGHTS\n${data.rights.map(r => `- ${r}`).join('\n')}\n\n`;
      }
      
      if (data.nextSteps && data.nextSteps.length > 0) {
        content += `NEXT STEPS\n${data.nextSteps.map(s => `- ${s}`).join('\n')}\n\n`;
      }
      
      if (data.deadlines && data.deadlines.length > 0) {
        content += `IMPORTANT DEADLINES\n${data.deadlines.map(d => `- ${d.event}: ${d.timeframe}`).join('\n')}\n\n`;
      }
      
      if (data.resources && data.resources.length > 0) {
        content += `RESOURCES\n${data.resources.map(r => `- ${r.type}: ${r.description} (${r.contact})`).join('\n')}\n\n`;
      }
      
      if (data.immediateActions && data.immediateActions.length > 0) {
        content += `IMMEDIATE ACTIONS\n${data.immediateActions.map(a => `- [${a.urgency}] ${a.action}`).join('\n')}\n\n`;
      }
      
      if (data.warnings && data.warnings.length > 0) {
        content += `WARNINGS\n${data.warnings.map(w => `- ${w}`).join('\n')}\n\n`;
      }
      
      if (!content) {
        content = "Legal guidance has been generated. Please contact a legal professional for personalized advice.";
      }
      
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content, maxWidth);
      
      for (const line of lines) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 6;
      }
      
      doc.save('legal-guidance.pdf');
      actions.setHasExported(true);
      toast({ title: t('chat.export.success', 'PDF downloaded successfully') });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({ title: t('chat.export.error', 'Failed to export PDF'), variant: "destructive" });
    }
  }, [state.guidanceData, state.caseInfo, actions, toast, t]);

  const canUseFreeText = state.currentStep === 'incident_description' || 
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
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
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
