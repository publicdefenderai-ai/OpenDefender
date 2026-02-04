import { useEffect } from "react";
import { GlossaryWidget } from "@/components/widgets/glossary-widget";

export default function EmbedGlossary() {
  const params = new URLSearchParams(window.location.search);
  const theme = (params.get("theme") as "light" | "dark") || "light";
  const language = (params.get("lang") as "en" | "es") || "en";

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.background = "transparent";
  }, []);

  return (
    <div style={{ padding: "8px" }}>
      <GlossaryWidget
        theme={theme}
        language={language}
      />
    </div>
  );
}
