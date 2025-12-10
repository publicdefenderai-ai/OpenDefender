import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface NavigationGuard {
  shouldBlock: () => boolean;
  onBlock: (navigateFn: () => void) => void;
}

interface NavigationGuardContextType {
  guard: NavigationGuard | null;
  registerGuard: (guard: NavigationGuard) => void;
  unregisterGuard: () => void;
  attemptNavigation: (navigateFn: () => void) => boolean;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null);

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const [guard, setGuard] = useState<NavigationGuard | null>(null);

  const registerGuard = useCallback((newGuard: NavigationGuard) => {
    setGuard(newGuard);
  }, []);

  const unregisterGuard = useCallback(() => {
    setGuard(null);
  }, []);

  const attemptNavigation = useCallback((navigateFn: () => void): boolean => {
    if (guard && guard.shouldBlock()) {
      guard.onBlock(navigateFn);
      return false;
    }
    navigateFn();
    return true;
  }, [guard]);

  return (
    <NavigationGuardContext.Provider value={{ guard, registerGuard, unregisterGuard, attemptNavigation }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error("useNavigationGuard must be used within NavigationGuardProvider");
  }
  return context;
}
