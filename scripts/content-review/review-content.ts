/**
 * Quarterly Content Review Script
 *
 * Uses Claude API to review user-facing static content across guidance pages,
 * support resources, and immigration guidance for accuracy and currency.
 * Writes structured JSON output for each category, consumed by generate-report.ts.
 *
 * Run: npx tsx scripts/content-review/review-content.ts
 * Env: ANTHROPIC_API_KEY
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  file: string;
  section: string;
  currentText: string;
  proposedText: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

interface FileReviewResult {
  file: string;
  suggestions: Suggestion[];
  reviewedAt: string;
  error?: string;
}

interface CategoryOutput {
  category: string;
  reviewedAt: string;
  files: FileReviewResult[];
  totalSuggestions: number;
}

// ─── Content targets ──────────────────────────────────────────────────────────

const CATEGORIES: { name: string; outputFile: string; files: string[] }[] = [
  {
    name: "Criminal Justice Guidance",
    outputFile: "guidance-diff.json",
    files: [
      "client/src/pages/rights-info.tsx",
      "client/src/pages/case-guidance.tsx",
      "client/src/pages/search-seizure.tsx",
      "client/src/pages/process.tsx",
      "client/src/pages/collateral-consequences.tsx",
      "client/src/pages/first-24-hours.tsx",
      "client/src/pages/jail-phone-call.tsx",
      "client/src/pages/quick-reference.tsx",
    ],
  },
  {
    name: "Immigration Guidance",
    outputFile: "immigration-diff.json",
    files: [
      "client/src/pages/immigration-guidance.tsx",
      "client/src/pages/immigration/know-your-rights.tsx",
      "client/src/pages/immigration/daca-tps.tsx",
      "client/src/pages/immigration/bond-hearings.tsx",
      "client/src/pages/immigration/workplace-raids.tsx",
      "client/src/pages/immigration/raids-toolkit.tsx",
      "client/src/pages/immigration/family-planning.tsx",
    ],
  },
  {
    name: "Support Resources",
    outputFile: "support-diff.json",
    files: [
      "client/src/pages/support/employment.tsx",
      "client/src/pages/support/housing.tsx",
      "client/src/pages/support/finances.tsx",
      "client/src/pages/support/mental-health.tsx",
      "client/src/pages/support/transportation.tsx",
      "client/src/pages/support/childcare.tsx",
      "client/src/pages/support/family-care.tsx",
      "client/src/pages/support/reputation.tsx",
      "client/src/pages/support/personal-health.tsx",
      "client/src/pages/support/court-logistics.tsx",
    ],
  },
  {
    name: "Life Resources & Legal Reference",
    outputFile: "resources-diff.json",
    files: [
      "client/src/pages/friends-family.tsx",
      "client/src/pages/diversion-programs.tsx",
      "client/src/pages/record-expungement.tsx",
      "client/src/lib/diversion-programs-data.ts",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, "../..");
const OUTPUT_DIR = path.join(import.meta.dirname, "output");
const MAX_FILE_CHARS = 14_000; // stay within token budget per call

function readFile(relPath: string): string {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${abs}`);
  }
  const content = fs.readFileSync(abs, "utf-8");
  if (content.length > MAX_FILE_CHARS) {
    return (
      content.slice(0, MAX_FILE_CHARS) +
      `\n\n[... file truncated at ${MAX_FILE_CHARS} chars for review ...]`
    );
  }
  return content;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Claude review ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a legal content reviewer for OpenDefender, a free public defender support app used by people who cannot afford attorneys. Your job is to review user-facing content for accuracy, currency, and clarity.

OpenDefender serves criminal defense clients and their families, immigration clients, and people seeking support resources. The content must be:
- Legally accurate and current
- Written at a plain-language reading level
- Free of outdated procedures, repealed statutes, or changed agency names
- Helpful and trauma-informed in tone

You will review a React/TypeScript source file. Focus ONLY on user-facing text strings: JSX text content, string values in data arrays, description fields, and label strings. Do NOT comment on code structure, TypeScript types, imports, or component logic.

Return ONLY a valid JSON object. No markdown, no explanation outside the JSON.`;

const USER_PROMPT_TEMPLATE = (filePath: string, content: string) => `Review this file for user-facing content that may be outdated, inaccurate, or could mislead vulnerable users.

File: ${filePath}

For each issue found, provide:
- "section": a short label for which part of the file this is (e.g. "Miranda rights card", "Bond hearing steps")
- "currentText": the exact current text string (keep it short — just the relevant phrase or sentence)
- "proposedText": your suggested replacement
- "reason": one sentence explaining why this change is needed
- "severity": "high" (legally incorrect/dangerous), "medium" (outdated or potentially misleading), "low" (clarity improvement)

Be conservative. Only flag things you are reasonably confident are wrong, outdated, or genuinely harmful to users. Skip content that looks accurate.

Return this JSON structure exactly:
{
  "suggestions": [
    {
      "section": "string",
      "currentText": "string",
      "proposedText": "string",
      "reason": "string",
      "severity": "high" | "medium" | "low"
    }
  ]
}

File content:
${content}`;

async function reviewFile(relPath: string): Promise<FileReviewResult> {
  const result: FileReviewResult = {
    file: relPath,
    suggestions: [],
    reviewedAt: new Date().toISOString(),
  };

  let content: string;
  try {
    content = readFile(relPath);
  } catch (err: any) {
    result.error = err.message;
    return result;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: USER_PROMPT_TEMPLATE(relPath, content),
        },
      ],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text : "";

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

    let parsed: { suggestions: Omit<Suggestion, "file">[] };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      result.error = `JSON parse failed. Raw response: ${raw.slice(0, 200)}`;
      return result;
    }

    result.suggestions = (parsed.suggestions || []).map((s) => ({
      file: relPath,
      ...s,
    }));
  } catch (err: any) {
    result.error = `API error: ${err.message}`;
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Determine which category to run (supports filtering via CLI arg)
  const categoryFilter = process.argv[2]; // e.g. "guidance" | "immigration" | "support" | "resources"

  const targets = categoryFilter
    ? CATEGORIES.filter((c) =>
        c.outputFile.includes(categoryFilter) ||
        c.name.toLowerCase().includes(categoryFilter.toLowerCase())
      )
    : CATEGORIES;

  if (targets.length === 0) {
    console.error(`No category matched filter: "${categoryFilter}"`);
    process.exit(1);
  }

  for (const category of targets) {
    console.log(`\n─── Reviewing: ${category.name} ───`);
    const output: CategoryOutput = {
      category: category.name,
      reviewedAt: new Date().toISOString(),
      files: [],
      totalSuggestions: 0,
    };

    for (const file of category.files) {
      console.log(`  • ${file}`);
      const result = await reviewFile(file);

      if (result.error) {
        console.warn(`    ⚠ ${result.error}`);
      } else {
        console.log(`    ✓ ${result.suggestions.length} suggestion(s)`);
      }

      output.files.push(result);
      output.totalSuggestions += result.suggestions.length;

      // Brief pause between calls to avoid rate limiting
      await sleep(1500);
    }

    const outPath = path.join(OUTPUT_DIR, category.outputFile);
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
    console.log(`  → Written to ${outPath} (${output.totalSuggestions} total suggestions)`);
  }

  console.log("\n✅ Content review complete.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
