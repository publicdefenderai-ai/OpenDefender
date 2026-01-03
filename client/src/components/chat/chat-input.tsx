import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Mic, MicOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLocked?: boolean;
  lockMessage?: string;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function ChatInput({ 
  onSend, 
  disabled = false, 
  placeholder,
  isLocked = false,
  lockMessage 
}: ChatInputProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSpeechSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (message.trim() && !disabled && !isLocked) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const startListening = useCallback(() => {
    if (!isSpeechSupported) {
      toast({
        title: t('chat.voice.notSupported', 'Voice input not supported'),
        description: t('chat.voice.notSupportedDesc', 'Your browser does not support voice input. Please use a modern browser like Chrome.'),
        variant: 'destructive'
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = i18n.language === 'es' ? 'es-US' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessing(false);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      if (finalTranscript) {
        setMessage(prev => prev + (prev ? ' ' : '') + finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: t('chat.voice.permissionDenied', 'Microphone access denied'),
          description: t('chat.voice.permissionDeniedDesc', 'Please allow microphone access in your browser settings.'),
          variant: 'destructive'
        });
      } else if (event.error !== 'aborted') {
        toast({
          title: t('chat.voice.error', 'Voice input error'),
          description: t('chat.voice.errorDesc', 'There was an error with voice input. Please try again.'),
          variant: 'destructive'
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSpeechSupported, i18n.language, t, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      setIsProcessing(true);
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  if (isLocked) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-xl border border-border/50"
      >
        <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          {lockMessage || t('chat.input.lockedMessage', 'Answer the questions above to continue')}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={cn(
        "flex items-end gap-2 p-2 bg-muted/30 rounded-xl border transition-colors",
        isListening 
          ? "border-red-500/50 bg-red-50/10 dark:bg-red-900/10" 
          : "border-border/50 focus-within:border-primary/50"
      )}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening 
            ? t('chat.voice.listening', 'Listening...') 
            : placeholder || t('chat.input.placeholder', 'Type your message...')}
          disabled={disabled || isListening}
          rows={1}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px]",
            disabled && "opacity-50"
          )}
          data-testid="input-chat-message"
        />
        
        {isSpeechSupported && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              type="button"
              size="icon"
              variant={isListening ? "destructive" : "outline"}
              disabled={disabled || isProcessing}
              onClick={toggleListening}
              className={cn(
                "h-9 w-9 rounded-lg shrink-0 relative",
                isListening && "animate-pulse"
              )}
              data-testid="button-voice-input"
              aria-label={isListening ? t('chat.voice.stopListening', 'Stop listening') : t('chat.voice.startListening', 'Start voice input')}
            >
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </motion.div>
                ) : isListening ? (
                  <motion.div
                    key="listening"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <MicOff className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Mic className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        )}

        <motion.div
          whileHover={!disabled && message.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && message.trim() ? { scale: 0.95 } : {}}
        >
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !message.trim() || isListening}
            className="h-9 w-9 rounded-lg shrink-0"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      
      {isListening && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
        >
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          {t('chat.voice.recordingHint', 'Speak now... Tap the microphone again when done.')}
        </motion.p>
      )}
    </form>
  );
}
