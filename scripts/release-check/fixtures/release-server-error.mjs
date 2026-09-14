const mode = process.env.RELEASE_CHECK_FIXTURE_MODE ?? "unexpected";

console.log(`[release-check-fixture] mode=${mode}`);
console.error("[ERROR] Anthropic API key not set - AI guidance will use rule-based fallback");
console.error("[ERROR] Anthropic API key not set for document summarizer");
console.error("[ERROR] ANTHROPIC_API_KEY not set — mitigation polish will be unavailable");

if (mode === "unexpected") {
  console.error("[ERROR] release fixture database connection failed: useful stderr context");
}

setTimeout(() => {
  process.exit(mode === "unexpected" ? 23 : 0);
}, 10);