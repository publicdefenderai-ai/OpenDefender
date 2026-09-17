import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  AUTHORITY_EVIDENCE_SCHEMA_VERSION,
  buildAuthorityEvidence,
  buildAuthorityModelMappingReviewPrompt,
  classifyAuthorityMapping,
  parseAuthorityModelMappingReviewResponse,
  resolveAuthorityModelClientCredentials,
  reviewAuthorityMappingsWithModel,
  validateAuthorityModelMappingProposal,
} from "../server/services/authority-offense-evidence";

function document(title = "Theft", text = "Section 1. Theft.\nEffective: 2026-01-01\nClass A misdemeanor."): {
  sourceKey: string;
  lawId: string;
  section: string;
  subdivision: null;
  citation: string;
  sourceUrl: string;
  officialTitle: string;
  text: string;
  contentHash: string;
  effectiveDateStart: string;
  sourceEvidence: string;
} {
  return {
    sourceKey: "test:statute:1",
    lawId: "TEST",
    section: "1",
    subdivision: null,
    citation: "Test Code § 1",
    sourceUrl: "https://example.test/1",
    officialTitle: title,
    text,
    contentHash: createHash("sha256").update(text).digest("hex"),
    effectiveDateStart: "2026-01-01",
    sourceEvidence: "Effective: 2026-01-01",
  };
}

describe("authority offense evidence", () => {
  it("binds bounded text and evidence spans to the exact source hash", () => {
    const source = document();
    const evidence = buildAuthorityEvidence(source);

    expect(evidence.schemaVersion).toBe(AUTHORITY_EVIDENCE_SCHEMA_VERSION);
    expect(evidence.sourceHash).toBe(source.contentHash);
    expect(evidence.sectionIdentity.citation).toBe(source.citation);
    expect(evidence.currentness.effectiveDateStart).toBe("2026-01-01");
    expect(evidence.evidenceSpans.some((span) => span.kind === "title")).toBe(true);
    expect(evidence.evidenceSpans.some((span) => span.kind === "grading")).toBe(true);
    expect(evidence.evidenceSpans.every((span) =>
      source.text.slice(span.start, span.end) === span.quote,
    )).toBe(true);
  });

  it("classifies exact, aliases, compounds, shared citations, missing sources, and conflicts", () => {
    const source = document();
    const input = {
      catalogLabel: "Theft",
      catalogCode: "1",
      references: [{ section: "1", subdivision: null }],
      documents: [source],
      codeIdentityMatches: true,
      approvedAlias: false,
    };
    expect(classifyAuthorityMapping(input).classification).toBe("exact_match");
    expect(classifyAuthorityMapping({ ...input, approvedAlias: true }).classification)
      .toBe("approved_alias");
    expect(classifyAuthorityMapping({
      ...input,
      references: [{ section: "1", subdivision: null }, { section: "2", subdivision: null }],
      documents: [source, { ...source, sourceKey: "test:statute:2", section: "2" }],
    }).classification).toBe("compound");
    expect(classifyAuthorityMapping({ ...input, sharedCitation: true }).classification)
      .toBe("shared_citation");
    expect(classifyAuthorityMapping({ ...input, documents: [] }).classification)
      .toBe("missing_section");
    expect(classifyAuthorityMapping({ ...input, codeIdentityMatches: false }).classification)
      .toBe("citation_identity_conflict");
    expect(classifyAuthorityMapping({ ...input, catalogLabel: "Fraud" }).classification)
      .toBe("semantic_conflict");
  });

  it("accepts model suggestions only when every quoted span matches the hashed evidence", () => {
    const evidence = buildAuthorityEvidence(document());
    const quote = evidence.evidenceSpans.find((span) => span.kind === "title")!;
    const proposal = {
      sourceHash: evidence.sourceHash,
      proposedSourceKeys: ["test:statute:1"],
      confidence: "high" as const,
      quotedSpans: [quote],
    };
    expect(validateAuthorityModelMappingProposal(proposal, [evidence])).toBe(true);
    expect(validateAuthorityModelMappingProposal({
      ...proposal,
      quotedSpans: [{ ...quote, quote: "invented title" }],
    }, [evidence])).toBe(false);
    expect(validateAuthorityModelMappingProposal({
      ...proposal,
      sourceHash: "wrong",
    }, [evidence])).toBe(false);
    expect(validateAuthorityModelMappingProposal({
      ...proposal,
      proposedSourceKeys: ["test:statute:other"],
    }, [evidence])).toBe(false);
  });

  it("builds a redacted model prompt and keeps accepted suggestions audit-only", () => {
    const source = document();
    const evidence = buildAuthorityEvidence(source);
    const title = evidence.evidenceSpans.find((span) => span.kind === "title")!;
    const reviewCase = {
      caseId: "charge-1",
      catalogLabel: "A catalog theft label",
      catalogCode: "1",
      mappingClassification: "semantic_conflict" as const,
      deterministicConfidence: "low" as const,
      evidence: [evidence],
    };
    const prompt = buildAuthorityModelMappingReviewPrompt([reviewCase]);
    expect(prompt).toContain(evidence.sourceHash);
    expect(prompt).toContain(title.quote);
    expect(prompt).not.toContain(evidence.boundedText);
    expect(prompt).not.toContain(evidence.sectionIdentity.sourceUrl);

    const review = parseAuthorityModelMappingReviewResponse(
      JSON.stringify({
        proposals: [{
          caseId: "charge-1",
          proposal: {
            sourceHash: evidence.sourceHash,
            proposedSourceKeys: [evidence.sectionIdentity.sourceKey],
            confidence: "high",
            quotedSpans: [title],
          },
        }],
      }),
      [reviewCase],
    );
    expect(review.accepted).toBe(1);
    expect(review.outcomes[0]).toMatchObject({
      status: "accepted",
      deterministicConfidence: "low",
    });
    expect(reviewCase.deterministicConfidence).toBe("low");
  });

  it("rejects model spans that were not included in the redacted prompt evidence", () => {
    const source = document();
    const evidence = buildAuthorityEvidence(source);
    const fullOffenseSpan = evidence.evidenceSpans.find((span) => span.kind === "offense")!;
    const review = parseAuthorityModelMappingReviewResponse(
      JSON.stringify({
        proposals: [{
          caseId: "charge-1",
          proposal: {
            sourceHash: evidence.sourceHash,
            proposedSourceKeys: [evidence.sectionIdentity.sourceKey],
            confidence: "high",
            quotedSpans: [fullOffenseSpan],
          },
        }],
      }),
      [{
        caseId: "charge-1",
        catalogLabel: "A catalog theft label",
        catalogCode: "1",
        mappingClassification: "semantic_conflict",
        deterministicConfidence: "low",
        evidence: [evidence],
      }],
    );
    expect(review.accepted).toBe(0);
    expect(review.outcomes[0].rejectionReason).toContain("quoted-span validation");
  });

  it("batches large reviews and records truncation per affected batch", async () => {
    const evidence = buildAuthorityEvidence(document());
    const cases = Array.from({ length: 5 }, (_, index) => ({
      caseId: `charge-${index}`,
      catalogLabel: `Catalog label ${index}`,
      catalogCode: String(index),
      mappingClassification: "semantic_conflict" as const,
      deterministicConfidence: "low" as const,
      evidence: [evidence],
    }));
    const prompts: string[] = [];
    const review = await reviewAuthorityMappingsWithModel(cases, async (prompt) => {
      prompts.push(prompt);
      return { text: "{\"proposals\":[]}", stopReason: "end_turn" };
    });
    expect(prompts).toHaveLength(2);
    expect(review.candidates).toBe(5);
    expect(review.rejected).toBe(5);

    const truncated = await reviewAuthorityMappingsWithModel(
      [cases[0]],
      async () => ({ text: "{\"proposals\":[", stopReason: "max_tokens" }),
    );
    expect(truncated.outcomes[0].rejectionReason)
      .toBe("Model response was truncated before complete JSON.");
  });

  it("rejects a case when the model returns conflicting duplicate proposals", () => {
    const evidence = buildAuthorityEvidence(document());
    const title = evidence.evidenceSpans.find((span) => span.kind === "title")!;
    const review = parseAuthorityModelMappingReviewResponse(
      JSON.stringify({
        proposals: [
          {
            caseId: "charge-1",
            proposal: {
              sourceHash: evidence.sourceHash,
              proposedSourceKeys: [evidence.sectionIdentity.sourceKey],
              confidence: "high",
              quotedSpans: [title],
            },
          },
          {
            caseId: "charge-1",
            proposal: {
              sourceHash: evidence.sourceHash,
              proposedSourceKeys: [evidence.sectionIdentity.sourceKey],
              confidence: "low",
              quotedSpans: [title],
            },
          },
        ],
      }),
      [{
        caseId: "charge-1",
        catalogLabel: "A catalog theft label",
        catalogCode: "1",
        mappingClassification: "semantic_conflict",
        deterministicConfidence: "low",
        evidence: [evidence],
      }],
    );
    expect(review.accepted).toBe(0);
    expect(review.rejected).toBe(1);
    expect(review.outcomes[0].rejectionReason)
      .toContain("more than one proposal");
  });

  it("selects Anthropic credentials atomically when direct and integration settings coexist", () => {
    expect(resolveAuthorityModelClientCredentials({
      ANTHROPIC_API_KEY: "direct-key",
    })).toEqual({ apiKey: "direct-key" });
    expect(resolveAuthorityModelClientCredentials({
      AI_INTEGRATIONS_ANTHROPIC_API_KEY: "integration-key",
      AI_INTEGRATIONS_ANTHROPIC_BASE_URL: "https://integration.example",
    })).toEqual({
      apiKey: "integration-key",
      baseURL: "https://integration.example",
    });
    expect(resolveAuthorityModelClientCredentials({
      ANTHROPIC_API_KEY: "direct-key",
      AI_INTEGRATIONS_ANTHROPIC_API_KEY: "integration-key",
      AI_INTEGRATIONS_ANTHROPIC_BASE_URL: "https://integration.example",
    })).toEqual({
      apiKey: "integration-key",
      baseURL: "https://integration.example",
    });
  });
});