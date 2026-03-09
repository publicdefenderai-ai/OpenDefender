import { useEffect } from "react";
import { useLocation } from "wouter";

export default function LegalAid() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/resources");
  }, [setLocation]);

  return null;
}
