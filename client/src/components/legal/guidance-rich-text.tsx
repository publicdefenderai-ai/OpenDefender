import React from "react";

function guidanceTextValue(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw !== null && raw !== undefined && typeof raw === "object") {
    const value = raw as Record<string, unknown>;
    const candidate = value.action
      ?? value.step
      ?? value.text
      ?? value.description
      ?? value.consequence
      ?? value.warning;
    return typeof candidate === "string" ? candidate : JSON.stringify(raw);
  }
  return String(raw ?? "");
}

function safeHref(href: string): "internal" | "external" | "text" {
  if (href.startsWith("/")) return "internal";
  if (/^(https?:\/\/|mailto:)/i.test(href)) return "external";
  return "text";
}

/**
 * Render the small Markdown subset used by generated case guidance.
 * This is deliberately not a general Markdown renderer: generated guidance
 * only needs bold/italic emphasis and labeled links.
 */
export function renderGuidanceRichText(
  raw: unknown,
  navigate?: (href: string) => void,
): React.ReactNode {
  const text = guidanceTextValue(raw);
  const tokens = text.split(/(\*\*[^*\n]+\*\*|__[^_\n]+__|(?<!\w)\*[^*\n]+\*(?!\w)|(?<!\w)_[^_\n]+_(?!\w)|\[[^\]\n]+\]\([^)]+\))/g);

  if (tokens.length === 1) return text;

  return (
    <>
      {tokens.map((token, index) => {
        const boldMatch = token.match(/^(?:\*\*|__)([^*\n_]+)(?:\*\*|__)$/);
        if (boldMatch) {
          return <strong key={index} className="font-semibold">{boldMatch[1]}</strong>;
        }

        const italicMatch = token.match(/^(?:\*|_)([^*\n_]+)(?:\*|_)$/);
        if (italicMatch) {
          return <em key={index}>{italicMatch[1]}</em>;
        }

        const linkMatch = token.match(/^\[([^\]\n]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const hrefType = safeHref(href);
          if (hrefType === "internal") {
            if (navigate) {
              return (
                <button
                  key={index}
                  onClick={() => navigate(href)}
                  className="underline underline-offset-2 hover:opacity-80 font-medium text-left"
                >
                  {label}
                </button>
              );
            }
            return <a key={index} href={href} className="underline underline-offset-2 hover:opacity-80 font-medium">{label}</a>;
          }
          if (hrefType === "external") {
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80 font-medium"
              >
                {label}
              </a>
            );
          }
          return <span key={index}>{label}</span>;
        }

        return <span key={index}>{token}</span>;
      })}
    </>
  );
}