import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { QuickReply } from "@/contexts/chat-context";

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
  blue: "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
  green: "bg-slate-50 border-primary/20 text-slate-700 hover:bg-primary/5 hover:border-primary/30 dark:bg-slate-900 dark:border-primary/30 dark:text-slate-300 dark:hover:bg-primary/10",
  amber: "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30 dark:bg-primary/10 dark:border-primary/30 dark:text-primary dark:hover:bg-primary/20",
  purple: "bg-primary/5 border-primary/25 text-slate-700 hover:bg-primary/10 hover:border-primary/40 dark:bg-primary/15 dark:border-primary/40 dark:text-slate-300 dark:hover:bg-primary/25",
};

export function QuickReplyButtons({ 
  replies, 
  onSelect, 
  disabled = false,
  columns = 2 
}: QuickReplyButtonsProps) {
  return (
    <div 
      role="group" 
      aria-label="Response options"
      className={cn(
        "grid gap-2 mt-3",
        columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      )}
    >
      {replies.map((reply, index) => (
        <motion.button
          key={reply.id}
          custom={index}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover={!disabled ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          onClick={() => !disabled && onSelect(reply)}
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
          aria-label={reply.label}
        >
          {reply.icon && (
            <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
              {reply.icon}
            </span>
          )}
          <span className="flex-1">{reply.label}</span>
        </motion.button>
      ))}
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
  return (
    <motion.button
      whileHover={!disabled ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(reply)}
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
      <span>{reply.label}</span>
    </motion.button>
  );
}
