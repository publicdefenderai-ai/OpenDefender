/**
 * Type declarations for @redactpii/node
 * Since the package doesn't include TypeScript declarations,
 * we define the types we need here.
 */

declare module '@redactpii/node' {
  export interface RedactorOptions {
    rules?: {
      EMAIL?: boolean;
      SSN?: boolean;
      PHONE?: boolean;
      CREDIT_CARD?: boolean;
      [key: string]: boolean | undefined;
    };
    customReplacements?: {
      [key: string]: string;
    };
  }

  export class Redactor {
    constructor(options?: RedactorOptions);
    
    /**
     * Redact PII from text
     */
    redact(text: string): string;
    
    /**
     * Check if text contains PII
     */
    hasPII(text: string): boolean;
    
    /**
     * Redact PII from an object recursively
     */
    redactObject(obj: any): any;
  }
}
