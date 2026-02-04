import { useEffect } from "react";
import { RightsCard } from "@/components/widgets/rights-card";

export default function EmbedRights() {
  const params = new URLSearchParams(window.location.search);
  const theme = (params.get("theme") as "light" | "dark") || "light";
  const language = (params.get("lang") as "en" | "es") || "en";
  const variant = (params.get("variant") as "full" | "compact" | "mini") || "full";

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "transparent";
  }, []);

  return (
    <div style={{ padding: "8px", display: "flex", justifyContent: "center" }}>
      <RightsCard
        theme={theme}
        language={language}
        variant={variant}
      />
    </div>
  );
}
