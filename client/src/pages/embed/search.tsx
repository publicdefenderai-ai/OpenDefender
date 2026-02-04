import { useEffect } from "react";
import { EmbeddableSearch } from "@/components/widgets/embeddable-search";

export default function EmbedSearch() {
  const params = new URLSearchParams(window.location.search);
  const theme = (params.get("theme") as "light" | "dark") || "light";
  const language = (params.get("lang") as "en" | "es") || "en";
  const compact = params.get("compact") === "true";

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "transparent";
  }, []);

  return (
    <div style={{ padding: "8px" }}>
      <EmbeddableSearch
        theme={theme}
        language={language}
        compact={compact}
      />
    </div>
  );
}
