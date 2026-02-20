import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLocked?: boolean;
  lockMessage?: string;
  onInputChange?: (value: string) => void;
}

export function ChatInput({ 
  onSend, 
  disabled = false, 
  placeholder,
  isLocked = false,
  lockMessage,
  onInputChange
}: ChatInputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className="flex items-end gap-2 p-2 bg-muted/30 rounded-xl border border-border/50 focus-within:border-primary/50 transition-colors">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            onInputChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('chat.input.placeholder', 'Type your message...')}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px]",
            disabled && "opacity-50"
          )}
          data-testid="input-chat-message"
        />

        <motion.div
          whileHover={!disabled && message.trim() ? { scale: 1.05 } : {}}
          whileTap={!disabled && message.trim() ? { scale: 0.95 } : {}}
        >
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !message.trim()}
            className="h-9 w-9 rounded-lg shrink-0"
            data-testid="button-send-message"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </form>
  );
}
