import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { KEYBOARD_SHORTCUTS } from "@/hooks/use-keyboard-shortcuts";
import { Keyboard } from "lucide-react";

export function KeyboardShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleShowShortcuts = () => setOpen(true);
    window.addEventListener("show-keyboard-shortcuts", handleShowShortcuts);
    return () => window.removeEventListener("show-keyboard-shortcuts", handleShowShortcuts);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-keyboard-shortcuts">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick navigation shortcuts for power users
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
              data-testid={`shortcut-${index}`}
            >
              <span className="text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex} className="flex items-center gap-1">
                    {keyIndex > 0 && <span className="text-muted-foreground text-xs">then</span>}
                    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Esc</kbd> to close
        </p>
      </DialogContent>
    </Dialog>
  );
}
