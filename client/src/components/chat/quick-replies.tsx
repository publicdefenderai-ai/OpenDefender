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

const colorStyles = {
  // Personalized Guidance - Blue (matches vivid-header)
  blue: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/60",
  // Immigration - Rose/Pink (matches vivid-header-rose)
  rose: "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-900/60",
  // Rights Info - Slate/Navy (matches vivid-header-alt)
  slate: "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:border-slate-400 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/70",
  // Resources - Green (matches vivid-header-green)
  green: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-900/60",
  // Laws & Records - Purple (matches vivid-header-purple)
  purple: "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 hover:border-purple-300 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900/60",
  // Amber - Secondary actions
  amber: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-200 dark:hover:bg-amber-900/60",
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
        "grid gap-2 mt-3",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
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
            whileHover={!disabled ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => !disabled && handleSelect(reply)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl",
              "border text-left text-[15px] font-medium",
              "transition-colors duration-150",
              reply.color 
                ? colorStyles[reply.color]
                : "border-border bg-background text-foreground hover:bg-muted hover:border-primary/50",
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
            <span className="flex-1">{displayLabel}</span>
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
      whileHover={!disabled ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && handleSelect()}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl",
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
