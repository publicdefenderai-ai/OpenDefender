export const jsonSchemas = {
  CriminalCharge: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/criminal-charge.json",
    title: "CriminalCharge",
    description: "A criminal charge definition with jurisdiction-specific details",
    type: "object",
    properties: {
      id: { type: "string", description: "Unique identifier (format: jurisdiction-charge-name)", example: "ca-dui-first-offense" },
      name: { type: "string", description: "Human-readable charge name" },
      nameEs: { type: "string", description: "Spanish translation of charge name" },
      code: { type: "string", description: "Statute code reference" },
      jurisdiction: { type: "string", description: "Two-letter state code or 'federal'", pattern: "^[A-Z]{2}$|^federal$" },
      category: { type: "string", enum: ["felony", "misdemeanor", "infraction"], description: "Severity classification" },
      description: { type: "string", description: "Plain-English description of the charge" },
      descriptionEs: { type: "string", description: "Spanish translation of description" },
      maxPenalty: { type: "string", description: "Maximum penalty summary" },
      commonDefenses: { type: "array", items: { type: "string" }, description: "List of common legal defenses" },
      evidenceToGather: { type: "array", items: { type: "string" }, description: "Evidence that may help the defense" },
      specificRights: { type: "array", items: { type: "string" }, description: "Rights specific to this charge" },
      urgentActions: { type: "array", items: { type: "string" }, description: "Immediate actions to take" },
      statuteCitations: { type: "array", items: { type: "string" }, description: "Legal statute citations" }
    },
    required: ["id", "name", "jurisdiction", "category", "description"]
  },

  DiversionProgram: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/diversion-program.json",
    title: "DiversionProgram",
    description: "A pre-trial diversion or alternative sentencing program",
    type: "object",
    properties: {
      id: { type: "string", description: "Unique identifier" },
      name: { type: "string", description: "Program name" },
      state: { type: "string", description: "Two-letter state code" },
      county: { type: ["string", "null"], description: "County name" },
      jurisdictionType: { type: "string", description: "Type of jurisdiction" },
      cities: { type: ["array", "null"], items: { type: "string" }, description: "Cities covered" },
      zipCodes: { type: ["array", "null"], items: { type: "string" }, description: "ZIP codes covered" },
      programTypes: { type: "array", items: { type: "string" }, description: "Types of diversion offered" },
      eligibilityNotes: { type: ["string", "null"], description: "Eligibility requirements" },
      contact: { type: "object", description: "Contact information" },
      sources: { type: ["array", "null"], items: { type: "string" }, description: "Data sources" },
      lastUpdated: { type: ["string", "null"], format: "date-time" },
      isActive: { type: ["boolean", "null"] }
    },
    required: ["id", "name", "state"]
  },

  GlossaryTerm: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/glossary-term.json",
    title: "GlossaryTerm",
    description: "A legal term definition written at 6th-8th grade reading level",
    type: "object",
    properties: {
      id: { type: "string", description: "Unique identifier" },
      term: { type: "string", description: "The legal term" },
      definition: { type: "string", description: "Plain-English definition" },
      aliases: { type: ["array", "null"], items: { type: "string" }, description: "Alternative names for this term" },
      tags: { type: ["array", "null"], items: { type: "string" }, description: "Categorization tags" }
    },
    required: ["id", "term", "definition"]
  },

  ExpungementRule: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/expungement-rule.json",
    title: "ExpungementRule",
    description: "State-specific record expungement eligibility rules",
    type: "object",
    properties: {
      id: { type: "string", description: "Unique identifier" },
      state: { type: "string", description: "Two-letter state code" },
      overview: { type: "string", description: "Summary of expungement process" },
      waitingPeriods: {
        type: "object",
        properties: {
          misdemeanorMonths: { type: "integer" },
          felonyMonths: { type: "integer" }
        }
      },
      exclusions: { type: "array", items: { type: "string" }, description: "Offenses that cannot be expunged" },
      conditions: { type: "array", items: { type: "string" }, description: "Requirements to be eligible" },
      steps: { type: "array", items: { type: "string" }, description: "Process steps" }
    },
    required: ["id", "state", "overview"]
  },

  SearchResult: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/search-result.json",
    title: "SearchResult",
    description: "A search result with document and relevance score",
    type: "object",
    properties: {
      document: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["charge", "diversion_program", "glossary", "expungement", "rights_info", "mock_qa"] },
          title: { type: "string" },
          titleEs: { type: "string" },
          content: { type: "string" },
          jurisdiction: { type: "string" },
          url: { type: "string" }
        }
      },
      score: { type: "number", description: "Relevance score (higher is better)" },
      highlights: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: { type: "string" },
            snippet: { type: "string" }
          }
        }
      },
      matchedTerms: { type: "array", items: { type: "string" } }
    },
    required: ["document", "score"]
  },

  SearchResponse: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/search-response.json",
    title: "SearchResponse",
    description: "API response for search endpoint",
    type: "object",
    properties: {
      success: { type: "boolean" },
      results: { type: "array", items: { $ref: "/schemas/search-result.json" } },
      meta: {
        type: "object",
        properties: {
          totalResults: { type: "integer" },
          queryTime: { type: "integer", description: "Query time in milliseconds" },
          suggestions: { type: "array", items: { type: "string" } }
        }
      }
    },
    required: ["success", "results"]
  },

  APIError: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/schemas/api-error.json",
    title: "APIError",
    description: "Standard error response format",
    type: "object",
    properties: {
      success: { type: "boolean", const: false },
      error: { type: "string", description: "Error message" },
      retryAfter: { type: "integer", description: "Seconds to wait before retry (for rate limits)" }
    },
    required: ["success", "error"]
  }
};

export function getSchemaList() {
  return Object.keys(jsonSchemas).map(name => ({
    name,
    url: `/api/v1/schemas/${name.toLowerCase()}.json`
  }));
}
