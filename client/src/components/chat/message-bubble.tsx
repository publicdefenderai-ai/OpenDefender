import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Message } from "@/contexts/chat-context";

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

function parseMarkdownLinks(content: string) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | { text: string; href: string })[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push({ text: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

function RenderContent({ content }: { content: string }) {
  const parts = parseMarkdownLinks(content);
  
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>;
        }
        return (
          <Link
            key={index}
            href={part.href}
            className="text-primary underline underline-offset-2 hover:text-primary/80 font-medium"
            data-testid={`link-${part.href.replace(/\//g, '-').slice(1)}`}
          >
            {part.text}
          </Link>
        );
      })}
    </>
  );
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const { t } = useTranslation();
  const isBot = message.role === 'bot';
  
  const displayContent = message.contentKey 
    ? t(message.contentKey, message.contentParams || {})
    : message.content || '';

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex gap-3 mb-4",
        isBot ? "justify-start" : "justify-end"
      )}
      role="article"
      aria-label={isBot ? "Assistant message" : "Your message"}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <Scale className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%]",
          isBot 
            ? "bg-muted text-foreground rounded-tl-sm" 
            : "bg-primary/90 dark:bg-primary/80 text-white rounded-tr-sm max-w-[70%]"
        )}
      >
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
          <RenderContent content={displayContent} />
        </div>
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 mb-4 justify-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        <Scale className="h-4 w-4 text-primary" />
      </div>
      
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-5">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          />
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
