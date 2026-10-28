import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { QuickReply } from "@/contexts/chat-context";
import { useChat } from "@/contexts/chat-context";

interface QuickReplyButtonsProps {
  replies: QuickReply[];
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
  columns?: 1 | 2;
}

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.2 }
  })
};


export function QuickReplyButtons({ 
  replies, 
  onSelect, 
  disabled = false,
  columns = 2 
}: QuickReplyButtonsProps) {
  const { t } = useTranslation();
  const { actions } = useChat();
  
  const handleSelect = (reply: QuickReply) => {
    const displayLabel = reply.labelKey ? t(reply.labelKey) : reply.label || '';
    actions.selectQuickReply(reply, displayLabel);
    onSelect(reply);
  };
  
  return (
    <div 
      role="group" 
      aria-label="Response options"
      className={cn(
        "chat-replies grid gap-2 mt-3",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {replies.map((reply, index) => {
        const displayLabel = reply.labelKey ? t(reply.labelKey) : reply.label || '';
        return (
          <motion.button
            key={reply.id}
            custom={index}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            onClick={() => !disabled && handleSelect(reply)}
            disabled={disabled}
            className={cn(
              "flex min-w-0 min-h-[44px] items-center gap-2 px-4 py-3 rounded-xl",
              "border text-left text-[15px] font-medium",
              "transition-colors duration-150 break-words",
              "border-border bg-background text-foreground hover:bg-muted hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
              reply.value === "urgent_yes" && "chat-urgent-choice",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            data-testid={`quick-reply-${reply.id}`}
            aria-label={displayLabel}
          >
            {reply.icon && (
              <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
                {reply.icon}
              </span>
            )}
             <span className="min-w-0 flex-1">{displayLabel}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

interface FullWidthReplyProps {
  reply: QuickReply;
  onSelect: (reply: QuickReply) => void;
  disabled?: boolean;
  variant?: 'default' | 'primary' | 'outline';
}

export function FullWidthReply({ 
  reply, 
  onSelect, 
  disabled = false,
  variant = 'default'
}: FullWidthReplyProps) {
  const { t } = useTranslation();
  const { actions } = useChat();
  
  const displayLabel = reply.labelKey ? t(reply.labelKey) : reply.label || '';
  
  const handleSelect = () => {
    actions.selectQuickReply(reply, displayLabel);
    onSelect(reply);
  };
  
  return (
    <motion.button
      onClick={() => !disabled && handleSelect()}
      disabled={disabled}
      className={cn(
        "w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
        "text-[15px] font-medium transition-colors duration-150",
        variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === 'outline' && "border border-border bg-background text-foreground hover:bg-muted",
        variant === 'default' && "border border-border bg-background text-foreground hover:bg-muted hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      data-testid={`quick-reply-${reply.id}`}
    >
      {reply.icon && (
        <span className="text-lg" role="img" aria-hidden="true">
          {reply.icon}
        </span>
      )}
      <span>{displayLabel}</span>
    </motion.button>
  );
}
