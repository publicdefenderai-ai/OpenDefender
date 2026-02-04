export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Public Defender AI - Open API",
    description: `
## Overview
Public Defender AI provides free, open access to legal information and resources. This API enables third-party developers, legal aid organizations, and civil rights groups to integrate our datasets into their own applications.

## Rate Limits
- **Search endpoints**: 30 requests per minute
- **Data endpoints**: 60 requests per minute
- **All endpoints**: Rate limited by IP address

## Data Attribution
When using this data, please include attribution:
> Data provided by Public Defender AI (publicdefenderai.org)

## Security Notes
- All endpoints are read-only (GET requests only)
- No authentication required for public data
- CORS enabled for cross-origin requests
- AI-powered guidance endpoints are NOT public (require direct site access)

## Contact
For integration support or to report issues, please open an issue on our GitHub repository.
    `.trim(),
    version: "1.0.0",
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    },
    contact: {
      name: "Public Defender AI",
      url: "https://github.com/publicdefenderai"
    }
  },
  servers: [
    {
      url: "/api/v1",
      description: "Public API v1"
    }
  ],
  tags: [
    { name: "Search", description: "Site-wide search across all legal content" },
    { name: "Criminal Charges", description: "Criminal charge definitions by jurisdiction" },
    { name: "Diversion Programs", description: "Pre-trial diversion and alternative sentencing programs" },
    { name: "Glossary", description: "Legal terminology definitions" },
    { name: "Expungement", description: "Record expungement eligibility rules by state" },
    { name: "Export", description: "Bulk data export endpoints" }
  ],
  paths: {
    "/search": {
      get: {
        tags: ["Search"],
        summary: "Search all legal content",
        description: "Performs a full-text search across criminal charges, diversion programs, glossary terms, expungement rules, and informational pages. Supports legal synonym expansion (e.g., 'lawyer' finds 'attorney').",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            description: "Search query (3-100 characters)",
            schema: { type: "string", minLength: 3, maxLength: 100 },
            example: "DUI first offense"
          },
          {
            name: "lang",
            in: "query",
            required: false,
            description: "Language for results (en or es)",
            schema: { type: "string", enum: ["en", "es"], default: "en" }
          },
          {
            name: "types",
            in: "query",
            required: false,
            description: "Filter by content types (comma-separated)",
            schema: { type: "string" },
            example: "charge,diversion_program"
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Maximum results to return (1-50)",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 20 }
          }
        ],
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    results: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SearchResult" }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        totalResults: { type: "integer" },
                        queryTime: { type: "integer", description: "Time in milliseconds" },
                        expandedTerms: { type: "array", items: { type: "string" } }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": { description: "Invalid query parameters" },
          "429": { description: "Rate limit exceeded" }
        }
      }
    },
    "/charges": {
      get: {
        tags: ["Criminal Charges"],
        summary: "List criminal charges",
        description: "Returns criminal charge definitions. Filter by jurisdiction or get all 4,100+ charges across 51 jurisdictions.",
        parameters: [
          {
            name: "jurisdiction",
            in: "query",
            required: false,
            description: "Two-letter state code or 'federal'",
            schema: { type: "string" },
            example: "CA"
          },
          {
            name: "category",
            in: "query",
            required: false,
            description: "Filter by charge category",
            schema: { 
              type: "string", 
              enum: ["violent", "property", "drug", "financial", "traffic", "public_order", "weapons", "sex_crimes", "other"]
            }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description: "Maximum results (1-100)",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 50 }
          },
          {
            name: "offset",
            in: "query",
            required: false,
            description: "Pagination offset",
            schema: { type: "integer", minimum: 0, default: 0 }
          }
        ],
        responses: {
          "200": {
            description: "List of criminal charges",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CriminalCharge" }
                    },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        limit: { type: "integer" },
                        offset: { type: "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/charges/{id}": {
      get: {
        tags: ["Criminal Charges"],
        summary: "Get charge by ID",
        description: "Returns detailed information about a specific criminal charge.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "Charge ID (format: jurisdiction-charge-name)",
            schema: { type: "string" },
            example: "ca-dui-first-offense"
          },
          {
            name: "lang",
            in: "query",
            required: false,
            description: "Language for translated fields",
            schema: { type: "string", enum: ["en", "es"], default: "en" }
          }
        ],
        responses: {
          "200": {
            description: "Charge details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CriminalCharge" }
              }
            }
          },
          "404": { description: "Charge not found" }
        }
      }
    },
    "/diversion-programs": {
      get: {
        tags: ["Diversion Programs"],
        summary: "List diversion programs",
        description: "Returns pre-trial diversion and alternative sentencing programs. 73 programs across major U.S. metros.",
        parameters: [
          {
            name: "state",
            in: "query",
            required: false,
            description: "Filter by state (two-letter code)",
            schema: { type: "string" },
            example: "CA"
          },
          {
            name: "county",
            in: "query",
            required: false,
            description: "Filter by county name",
            schema: { type: "string" },
            example: "Los Angeles"
          },
          {
            name: "type",
            in: "query",
            required: false,
            description: "Filter by program type",
            schema: { 
              type: "string",
              enum: ["drug_court", "mental_health", "veterans", "dui", "pretrial", "deferred_adjudication"]
            }
          }
        ],
        responses: {
          "200": {
            description: "List of diversion programs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/DiversionProgram" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/glossary": {
      get: {
        tags: ["Glossary"],
        summary: "List legal terms",
        description: "Returns legal terminology definitions in plain English, suitable for 6th-8th grade reading level.",
        parameters: [
          {
            name: "lang",
            in: "query",
            required: false,
            description: "Language (en or es)",
            schema: { type: "string", enum: ["en", "es"], default: "en" }
          }
        ],
        responses: {
          "200": {
            description: "List of glossary terms",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/GlossaryTerm" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/expungement-rules": {
      get: {
        tags: ["Expungement"],
        summary: "List expungement rules",
        description: "Returns record expungement eligibility rules by state.",
        parameters: [
          {
            name: "state",
            in: "query",
            required: false,
            description: "Filter by state (two-letter code)",
            schema: { type: "string" },
            example: "CA"
          }
        ],
        responses: {
          "200": {
            description: "Expungement rules",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/ExpungementRule" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/export/charges": {
      get: {
        tags: ["Export"],
        summary: "Export all criminal charges",
        description: "Bulk export of all criminal charges in JSON or CSV format.",
        parameters: [
          {
            name: "format",
            in: "query",
            required: false,
            description: "Export format",
            schema: { type: "string", enum: ["json", "csv"], default: "json" }
          },
          {
            name: "jurisdiction",
            in: "query",
            required: false,
            description: "Filter by jurisdiction",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Exported data",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/CriminalCharge" } } },
              "text/csv": { schema: { type: "string" } }
            }
          }
        }
      }
    },
    "/export/diversion-programs": {
      get: {
        tags: ["Export"],
        summary: "Export all diversion programs",
        description: "Bulk export of all diversion programs in JSON or CSV format.",
        parameters: [
          {
            name: "format",
            in: "query",
            required: false,
            description: "Export format",
            schema: { type: "string", enum: ["json", "csv"], default: "json" }
          }
        ],
        responses: {
          "200": {
            description: "Exported data",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/DiversionProgram" } } },
              "text/csv": { schema: { type: "string" } }
            }
          }
        }
      }
    },
    "/stats": {
      get: {
        tags: ["Search"],
        summary: "Get index statistics",
        description: "Returns statistics about the search index and available data.",
        responses: {
          "200": {
            description: "Index statistics",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totalDocuments: { type: "integer", example: 4299 },
                    byType: {
                      type: "object",
                      additionalProperties: { type: "integer" }
                    },
                    jurisdictions: { type: "integer", example: 51 }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      SearchResult: {
        type: "object",
        properties: {
          document: {
            type: "object",
            properties: {
              id: { type: "string" },
              type: { type: "string", enum: ["charge", "diversion_program", "glossary", "expungement", "rights_info", "mock_qa"] },
              title: { type: "string" },
              content: { type: "string" },
              jurisdiction: { type: "string" },
              url: { type: "string" }
            }
          },
          score: { type: "number" },
          highlights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                snippet: { type: "string" }
              }
            }
          }
        }
      },
      CriminalCharge: {
        type: "object",
        properties: {
          id: { type: "string", example: "ca-dui-first-offense" },
          name: { type: "string", example: "DUI - First Offense" },
          jurisdiction: { type: "string", example: "CA" },
          category: { type: "string", enum: ["violent", "property", "drug", "financial", "traffic", "public_order", "weapons", "sex_crimes", "other"] },
          severity: { type: "string", enum: ["infraction", "misdemeanor", "felony", "wobbler"] },
          statuteCitation: { type: "string", example: "Cal. Veh. Code § 23152(a)" },
          description: { type: "string" },
          penalties: {
            type: "object",
            properties: {
              imprisonment: { type: "string" },
              fine: { type: "string" },
              probation: { type: "string" }
            }
          },
          commonDefenses: { type: "array", items: { type: "string" } },
          relatedCharges: { type: "array", items: { type: "string" } }
        }
      },
      DiversionProgram: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          state: { type: "string" },
          county: { type: "string" },
          type: { type: "string" },
          description: { type: "string" },
          eligibility: { type: "array", items: { type: "string" } },
          benefits: { type: "array", items: { type: "string" } },
          contactInfo: {
            type: "object",
            properties: {
              phone: { type: "string" },
              website: { type: "string" },
              address: { type: "string" }
            }
          }
        }
      },
      GlossaryTerm: {
        type: "object",
        properties: {
          id: { type: "string" },
          term: { type: "string" },
          definition: { type: "string" },
          examples: { type: "array", items: { type: "string" } },
          relatedTerms: { type: "array", items: { type: "string" } }
        }
      },
      ExpungementRule: {
        type: "object",
        properties: {
          state: { type: "string" },
          eligibleOffenses: { type: "array", items: { type: "string" } },
          waitingPeriod: { type: "string" },
          requirements: { type: "array", items: { type: "string" } },
          process: { type: "string" },
          costEstimate: { type: "string" }
        }
      }
    }
  }
};
