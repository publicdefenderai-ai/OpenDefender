import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useChat } from "@/contexts/chat-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ChatLauncher() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { state, actions } = useChat();

  if (state.isOpen || location === '/chat') {
    return null;
  }

  const handleOpenChat = () => {
    actions.openChat();
    setLocation('/chat');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-50"
        data-testid="chat-launcher"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleOpenChat}
            size="icon"
            className="relative h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
            data-testid="button-open-chat"
          >
            <MessageSquare className="h-5 w-5" />
            
            {state.hasUnsavedGuidance && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
