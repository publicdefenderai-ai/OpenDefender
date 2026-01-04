import { useEffect, useCallback } from "react";

interface KeyboardShortcutOptions {
  enabled?: boolean;
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const target = event.target as HTMLElement;
    const isInputFocused = 
      target.tagName === "INPUT" || 
      target.tagName === "TEXTAREA" || 
      target.isContentEditable;

    if (event.key === "/" && !isInputFocused) {
      event.preventDefault();
      const searchInput = document.querySelector<HTMLInputElement>(
        'input[data-testid*="search"], input[placeholder*="Search"], input[placeholder*="search"]'
      );
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    if (event.key === "Escape") {
      const closeButton = document.querySelector<HTMLButtonElement>(
        '[data-testid="dialog-close"], [aria-label="Close"], button[class*="DialogClose"], [data-radix-collection-item][aria-label="Close"]'
      );
      if (closeButton) {
        closeButton.click();
        return;
      }

      if (isInputFocused) {
        target.blur();
      }
    }

    if (event.key === "?" && !isInputFocused) {
      event.preventDefault();
      const helpEvent = new CustomEvent("show-keyboard-shortcuts");
      window.dispatchEvent(helpEvent);
    }

    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      const helpEvent = new CustomEvent("show-keyboard-shortcuts");
      window.dispatchEvent(helpEvent);
    }

    if (event.key === "g" && !isInputFocused) {
      const waitForSecondKey = (e: KeyboardEvent) => {
        window.removeEventListener("keydown", waitForSecondKey);
        
        if (e.key === "h") {
          e.preventDefault();
          window.location.href = "/";
        } else if (e.key === "r") {
          e.preventDefault();
          window.location.href = "/rights-info";
        } else if (e.key === "d") {
          e.preventDefault();
          window.location.href = "/document-library";
        } else if (e.key === "c") {
          e.preventDefault();
          window.location.href = "/chat";
        }
      };
      
      setTimeout(() => {
        window.addEventListener("keydown", waitForSecondKey, { once: true });
        setTimeout(() => {
          window.removeEventListener("keydown", waitForSecondKey);
        }, 1000);
      }, 0);
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export const KEYBOARD_SHORTCUTS = [
  { keys: ["/"], description: "Focus search" },
  { keys: ["Esc"], description: "Close dialog / unfocus" },
  { keys: ["Ctrl+K"], description: "Show keyboard shortcuts" },
  { keys: ["g", "h"], description: "Go to Home" },
  { keys: ["g", "r"], description: "Go to Rights Info" },
  { keys: ["g", "d"], description: "Go to Documents" },
  { keys: ["g", "c"], description: "Go to Chat" },
];

export function showKeyboardShortcuts() {
  const helpEvent = new CustomEvent("show-keyboard-shortcuts");
  window.dispatchEvent(helpEvent);
}
