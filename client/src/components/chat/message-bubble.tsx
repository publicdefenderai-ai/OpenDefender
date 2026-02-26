import { motion } from "framer-motion";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { Message } from "@/contexts/chat-context";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

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

function renderInlineMarkdown(text: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  const inlineRegex = /(\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|_(.+?)_)/g;
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    const boldContent = match[2] || match[4];
    const italicContent = match[3] || match[5];
    if (boldContent) {
      result.push(<strong key={`b-${keyIdx++}`} className="font-semibold">{boldContent}</strong>);
    } else if (italicContent) {
      result.push(<em key={`i-${keyIdx++}`} className="italic">{italicContent}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}

function RenderContent({ content }: { content: string }) {
  const parts = parseMarkdownLinks(content);
  
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          const inlineParts = renderInlineMarkdown(part);
          return inlineParts.map((inline, i) => {
            if (typeof inline === 'string') {
              return <LegalTextHighlighter key={`${index}-${i}`} text={inline} />;
            }
            return inline;
          });
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
      aria-label={isBot ? "Response" : "Your message"}
    >
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[85%]",
          isBot
            ? "bg-muted text-foreground rounded-tl-md border border-border/50"
            : "bg-primary/90 dark:bg-primary/80 text-white rounded-tr-md"
        )}
      >
        <div className="text-[15px] leading-relaxed">
          {displayContent.split('\n').map((line, lineIdx) => {
            const trimmed = line.trim();
            if (trimmed === '---' || trimmed === '***') {
              return <hr key={lineIdx} className="my-3 border-border/50" />;
            }
            if (trimmed.startsWith('> ')) {
              return (
                <div key={lineIdx} className="border-l-2 border-primary/40 pl-3 my-1 text-muted-foreground italic">
                  <RenderContent content={trimmed.slice(2)} />
                </div>
              );
            }
            if (trimmed === '') {
              return <div key={lineIdx} className="h-2" />;
            }
            return (
              <div key={lineIdx}>
                <RenderContent content={line} />
              </div>
            );
          })}
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
      <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3 border border-border/50">
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
