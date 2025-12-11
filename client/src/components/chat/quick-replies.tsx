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
  blue: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900",
  green: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 dark:bg-green-950 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900",
  amber: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900",
  purple: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-900",
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
