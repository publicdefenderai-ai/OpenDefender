import { useState, useEffect } from "react";

const STORAGE_KEY = "od_selected_jurisdiction";

export function useJurisdiction() {
  const [jurisdiction, setJurisdictionState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      if (jurisdiction) {
        localStorage.setItem(STORAGE_KEY, jurisdiction);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage unavailable — silent fail
    }
  }, [jurisdiction]);

  const setJurisdiction = (value: string) => {
    setJurisdictionState(value);
  };

  return { jurisdiction, setJurisdiction };
}
