/**
 * Document Generator Service
 *
 * Orchestrates document generation for attorney templates.
 * Handles template loading, AI section generation, and document assembly.
 */

import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_MODEL } from "../../config/ai-model";
import { randomUUID } from "crypto";
import { motionToContinueTemplate } from "../../../shared/templates/motion-to-continue";
import { motionToReduceBailTemplate } from "../../../shared/templates/motion-to-reduce-bail";
import { motionToSuppressTemplate } from "../../../shared/templates/motion-to-suppress";
import { motionToDismissTemplate } from "../../../shared/templates/motion-to-dismiss";
import { noticeOfAppearanceTemplate } from "../../../shared/templates/notice-of-appearance";
import { ntaPleadingsTemplate } from "../../../shared/templates/nta-pleadings";
import { motionForContinuanceEoirTemplate } from "../../../shared/templates/motion-for-continuance-eoir";
import { motionForDiscoveryTemplate } from "../../../shared/templates/motion-for-discovery";
import { bondMotionEoirTemplate } from "../../../shared/templates/bond-motion-eoir";
import { motionForPretrialReleaseTemplate } from "../../../shared/templates/motion-for-pretrial-release";
import { motionToChangeVenueEoirTemplate } from "../../../shared/templates/motion-to-change-venue-eoir";
import { motionInLimineTemplate } from "../../../shared/templates/motion-in-limine";
import { motionToReopenEoirTemplate } from "../../../shared/templates/motion-to-reopen-eoir";
import { motionToWithdrawPleaTemplate } from "../../../shared/templates/motion-to-withdraw-plea";
import { motionToTerminateEoirTemplate } from "../../../shared/templates/motion-to-terminate-eoir";
import { motionForSentenceModificationTemplate } from "../../../shared/templates/motion-for-sentence-modification";
import { motionToReconsiderEoirTemplate } from "../../../shared/templates/motion-to-reconsider-eoir";
import { motionForNewTrialTemplate } from "../../../shared/templates/motion-for-new-trial";
import { motionForStayOfRemovalEoirTemplate } from "../../../shared/templates/motion-for-stay-of-removal-eoir";
import { habeasCorpusPetitionTemplate } from "../../../shared/templates/habeas-corpus-petition";
import { motionToSeverTemplate } from "../../../shared/templates/motion-to-sever";
import { motionForJudgmentOfAcquittalTemplate } from "../../../shared/templates/motion-for-judgment-of-acquittal";
import { motionForMistrialTemplate } from "../../../shared/templates/motion-for-mistrial";
import { motionForChangeOfVenueTemplate } from "../../../shared/templates/motion-for-change-of-venue";
import { motionToCompelDiscoveryTemplate } from "../../../shared/templates/motion-to-compel-discovery";
import { motionForBailPendingAppealTemplate } from "../../../shared/templates/motion-for-bail-pending-appeal";
import { motionToSuppressImmigrationEoirTemplate } from "../../../shared/templates/motion-to-suppress-immigration-eoir";
import { motionForVoluntaryDepartureEoirTemplate } from "../../../shared/templates/motion-for-voluntary-departure-eoir";
import { processTemplate, validateFormData, applyJurisdictionVariant } from "./template-processor";
import { devLog, errLog, opsLog } from "../../utils/dev-logger";
import { isRequestCostAcceptable } from "../cost-tracker";
import type { DocumentTemplate, TemplateSection } from "../../../shared/templates/schema";

// ============================================================================
// Types
// ============================================================================

export interface GenerateDocumentRequest {
  templateId: string;
  jurisdiction: string;
  courtType?: "state" | "federal" | "immigration";
  district?: string;
  formData: Record<string, string>;
  sessionId: string;
}

export interface GeneratedSection {
  id: string;
  name: string;
  type: "static" | "user-input" | "ai-generated";
  content: string;
}

export interface GeneratedDocument {
  documentId: string;
  sessionId: string;
  templateId: string;
  templateName: string;
  jurisdiction: string;
  courtType: "state" | "federal" | "immigration";
  district?: string;
  sections: GeneratedSection[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface DocumentGenerationError {
  code: string;
  message: string;
  section?: string;
}

// Template registry
const templateRegistry: Map<string, DocumentTemplate> = new Map([
  ["motion-to-continue", motionToContinueTemplate],
  ["motion-to-reduce-bail", motionToReduceBailTemplate],
  ["motion-to-suppress", motionToSuppressTemplate],
  ["motion-to-dismiss", motionToDismissTemplate],
  ["notice-of-appearance", noticeOfAppearanceTemplate],
  ["nta-pleadings", ntaPleadingsTemplate],
  ["motion-for-continuance-eoir", motionForContinuanceEoirTemplate],
  ["motion-for-discovery", motionForDiscoveryTemplate],
  ["bond-motion-eoir", bondMotionEoirTemplate],
  ["motion-for-pretrial-release", motionForPretrialReleaseTemplate],
  ["motion-to-change-venue-eoir", motionToChangeVenueEoirTemplate],
  ["motion-in-limine", motionInLimineTemplate],
  ["motion-to-reopen-eoir", motionToReopenEoirTemplate],
  ["motion-to-withdraw-plea", motionToWithdrawPleaTemplate],
  ["motion-to-terminate-eoir", motionToTerminateEoirTemplate],
  ["motion-for-sentence-modification", motionForSentenceModificationTemplate],
  ["motion-to-reconsider-eoir", motionToReconsiderEoirTemplate],
  ["motion-for-new-trial", motionForNewTrialTemplate],
  ["motion-for-stay-of-removal-eoir", motionForStayOfRemovalEoirTemplate],
  ["habeas-corpus-petition", habeasCorpusPetitionTemplate],
  ["motion-to-sever", motionToSeverTemplate],
  ["motion-for-judgment-of-acquittal", motionForJudgmentOfAcquittalTemplate],
  ["motion-for-mistrial", motionForMistrialTemplate],
  ["motion-for-change-of-venue", motionForChangeOfVenueTemplate],
  ["motion-to-compel-discovery", motionToCompelDiscoveryTemplate],
  ["motion-for-bail-pending-appeal", motionForBailPendingAppealTemplate],
  ["motion-to-suppress-immigration-eoir", motionToSuppressImmigrationEoirTemplate],
  ["motion-for-voluntary-departure-eoir", motionForVoluntaryDepartureEoirTemplate],
]);

// Document storage (in-memory, expires with session)
const generatedDocuments: Map<string, GeneratedDocument> = new Map();

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const DOCUMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes (matches session TTL)

// Start cleanup interval
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  generatedDocuments.forEach((doc, key) => {
    if (doc.expiresAt.getTime() < now) {
      keysToDelete.push(key);
    }
  });

  if (keysToDelete.length > 0) {
    keysToDelete.forEach((key) => generatedDocuments.delete(key));
    opsLog('doc-generator', `Cleaned up ${keysToDelete.length} expired documents`);
  }
}, CLEANUP_INTERVAL_MS);

// ============================================================================
// Template Functions
// ============================================================================

/**
 * Get list of available templates
 */
export function getTemplates(category?: string): Array<{
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedCompletionTime: string;
  difficultyLevel: string;
  supportedJurisdictions: string[];
}> {
  const templates: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    estimatedCompletionTime: string;
    difficultyLevel: string;
    supportedJurisdictions: string[];
  }> = [];

  templateRegistry.forEach((template) => {
    if (!category || template.category === category) {
      templates.push({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        estimatedCompletionTime: template.estimatedCompletionTime,
        difficultyLevel: template.difficultyLevel,
        supportedJurisdictions: template.supportedJurisdictions,
      });
    }
  });

  return templates;
}

/**
 * Get a specific template by ID
 */
export function getTemplate(
  templateId: string,
  jurisdiction?: string,
  courtType?: string,
  district?: string
): DocumentTemplate | null {
  const template = templateRegistry.get(templateId);
  if (!template) return null;

  // Apply jurisdiction variant if available
  if (jurisdiction) {
    return applyJurisdictionVariant(template, jurisdiction, courtType, district);
  }

  return template;
}

/**
 * Get a generated document by ID
 */
export function getGeneratedDocument(documentId: string): GeneratedDocument | null {
  const doc = generatedDocuments.get(documentId);
  if (!doc) return null;

  // Check if expired
  if (doc.expiresAt.getTime() < Date.now()) {
    generatedDocuments.delete(documentId);
    return null;
  }

  return doc;
}

// ============================================================================
// AI Generation
// ============================================================================

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 60000, // 60 second timeout
    })
  : null;

const AI_SYSTEM_PROMPT = `You are an expert legal document drafter for criminal defense matters.
Generate professional, persuasive content for court filings.
Use formal legal writing style. Cite relevant authorities when appropriate.
Be concise but thorough. Focus on facts and applicable law.
Do not include any preamble or explanation - return only the requested content.`;

const AI_IMMIGRATION_SYSTEM_PROMPT = `You are an expert legal document drafter for immigration defense matters before EOIR immigration courts.
Generate professional content for immigration court filings.
Use formal legal writing style consistent with the EOIR Immigration Court Practice Manual.
Always use "Respondent" (never "Defendant"), "DHS" (never "Plaintiff"), "A-Number" (never "Case Number"), "Immigration Judge" (never "the Court"), and "Notice to Appear / NTA" (never "Complaint").
Cite INA sections, 8 CFR regulations, and EOIR rules as appropriate.
Be concise but thorough. Focus on facts and applicable immigration law.
Do not include any preamble or explanation - return only the requested content.`;

/**
 * Generate AI content for a section
 */
async function generateAISection(
  section: TemplateSection,
  formData: Record<string, string>,
  jurisdiction: string,
  courtType?: "state" | "federal" | "immigration"
): Promise<string> {
  if (!anthropic) {
    throw new Error("AI service not configured (ANTHROPIC_API_KEY missing)");
  }

  if (!section.aiPromptTemplate) {
    throw new Error(`No AI prompt template for section: ${section.id}`);
  }

  // Interpolate variables into the prompt (but NOT PII like names)
  // Form data that gets sent to AI should be limited to non-PII metadata
  const safeFormData: Record<string, string> = {
    jurisdiction,
    // Motion to continue fields
    hearingType: formData.hearingType || "hearing",
    primaryReason: formData.primaryReason || "good cause",
    reasonExplanation: formData.reasonExplanation || "",
    priorContinuances: formData.priorContinuances || "0",
    custodyStatus: formData.custodyStatus || "unknown",
    speedyTrialWaiver: formData.speedyTrialWaiver || "unknown",
    oppositionPosition: formData.oppositionPosition || "unknown",
    // Motion to suppress fields
    evidenceType: formData.evidenceType || "physical",
    evidenceDescription: formData.evidenceDescription || "",
    dateObtained: formData.dateObtained || "",
    locationObtained: formData.locationObtained || "",
    constitutionalBasis: formData.constitutionalBasis || "",
    factualBasis: formData.factualBasis || "",
    warrantIssued: formData.warrantIssued || "not_applicable",
    mirandaGiven: formData.mirandaGiven || "not_applicable",
    consentGiven: formData.consentGiven || "not_applicable",
    // Immigration court fields
    proceedingType: formData.proceedingType || "removal",
    detainedStatus: formData.detainedStatus || "released",
    filingMethod: formData.filingMethod || "ecas",
    detentionFacility: formData.detentionFacility || "",
    ntaServiceResponse: formData.ntaServiceResponse || "",
    admittedAllegations: formData.admittedAllegations || "",
    deniedAllegations: formData.deniedAllegations || "",
    allegationExplanation: formData.allegationExplanation || "",
    chargesResponse: formData.chargesResponse || "",
    chargesExplanation: formData.chargesExplanation || "",
    selectedRelief: formData.selectedRelief || "",
    reliefExplanation: formData.reliefExplanation || "",
    countryDesignation: formData.countryDesignation || "",
    // Motion to reduce bail fields
    currentBailAmount: formData.currentBailAmount || "",
    bailType: formData.bailType || "",
    bailSetBy: formData.bailSetBy || "",
    bailSetDate: formData.bailSetDate || "",
    charges: formData.charges || "",
    chargeLevel: formData.chargeLevel || "",
    currentlyInCustody: formData.currentlyInCustody || "",
    timeInCustody: formData.timeInCustody || "",
    priorBailRequests: formData.priorBailRequests || "none",
    employmentStatus: formData.employmentStatus || "",
    employmentDetails: formData.employmentDetails || "",
    residenceStatus: formData.residenceStatus || "",
    residenceDetails: formData.residenceDetails || "",
    familyTies: formData.familyTies || "",
    communityInvolvement: formData.communityInvolvement || "",
    criminalHistory: formData.criminalHistory || "",
    criminalHistoryDetails: formData.criminalHistoryDetails || "",
    substanceTreatment: formData.substanceTreatment || "not_applicable",
    mentalHealthTreatment: formData.mentalHealthTreatment || "not_applicable",
    flightRiskFactors: formData.flightRiskFactors || "",
    defendantIncome: formData.defendantIncome || "",
    defendantAssets: formData.defendantAssets || "",
    abilityToPayExplanation: formData.abilityToPayExplanation || "",
    proposedAlternative: formData.proposedAlternative || "",
    proposedBailAmount: formData.proposedBailAmount || "",
    proposedConditions: formData.proposedConditions || "",
    // Motion for pretrial release fields
    arrestDate: formData.arrestDate || "",
    currentFacility: formData.currentFacility || "",
    chargesDescription: formData.chargesDescription || "",
    priorReleaseRequests: formData.priorReleaseRequests || "none",
    bailSet: formData.bailSet || "",
    residenceYears: formData.residenceYears || "",
    residenceType: formData.residenceType || "",
    dependents: formData.dependents || "",
    militaryService: formData.militaryService || "none",
    educationStatus: formData.educationStatus || "",
    courtAppearanceHistory: formData.courtAppearanceHistory || "",
    fta_history: formData.fta_history || "none",
    passportStatus: formData.passportStatus || "",
    releaseType: formData.releaseType || "",
    electronicMonitoring: formData.electronicMonitoring || "",
    pretrial_services: formData.pretrial_services || "",
    thirdPartyCustodian: formData.thirdPartyCustodian || "",
    surrenderPassport: formData.surrenderPassport || "",
    stayAwayOrders: formData.stayAwayOrders || "",
    // Motion to change venue (EOIR) fields
    immigrationCourt: formData.immigrationCourt || "",
    requestedCourt: formData.requestedCourt || "",
    changeReason: formData.changeReason || "",
    changeReasonExplanation: formData.changeReasonExplanation || "",
    currentAddress: formData.currentAddress || "",
    dateOfRelocation: formData.dateOfRelocation || "",
    priorAddress: formData.priorAddress || "",
    distanceToCurrentCourt: formData.distanceToCurrentCourt || "",
    distanceToRequestedCourt: formData.distanceToRequestedCourt || "",
    transportationHardship: formData.transportationHardship || "",
    dhsPosition: formData.dhsPosition || "",
    dhsPositionDetails: formData.dhsPositionDetails || "",
    // Motion in limine fields
    trialDate: formData.trialDate || "",
    trialType: formData.trialType || "",
    evidenceCategory: formData.evidenceCategory || "",
    prejudiceExplanation: formData.prejudiceExplanation || "",
    evidenceRelevance: formData.evidenceRelevance || "",
    additionalEvidenceItems: formData.additionalEvidenceItems || "",
    primaryRule: formData.primaryRule || "",
    legalBasisExplanation: formData.legalBasisExplanation || "",
    prosecutionLikelyArgument: formData.prosecutionLikelyArgument || "",
    applicableExceptions: formData.applicableExceptions || "",
    // Motion to reopen (EOIR) fields
    dateOfFinalOrder: formData.dateOfFinalOrder || "",
    typeOfFinalOrder: formData.typeOfFinalOrder || "",
    daysSinceOrder: formData.daysSinceOrder || "",
    motionDeadlineAwareness: formData.motionDeadlineAwareness || "",
    reopenBasis: formData.reopenBasis || "",
    reopenBasisExplanation: formData.reopenBasisExplanation || "",
    newEvidenceDescription: formData.newEvidenceDescription || "",
    whyNotPreviouslyAvailable: formData.whyNotPreviouslyAvailable || "",
    priorMotionsToReopen: formData.priorMotionsToReopen || "none",
    priorMotionDetails: formData.priorMotionDetails || "",
    wasInAbsentia: formData.wasInAbsentia || "",
    noticeDetails: formData.noticeDetails || "",
    addressHistory: formData.addressHistory || "",
    exceptionalCircumstances: formData.exceptionalCircumstances || "",
    reliefSought: formData.reliefSought || "",
    // Habeas corpus petition fields
    convictionDate: formData.convictionDate || "",
    convictionCourt: formData.convictionCourt || "",
    originalCaseNumber: formData.originalCaseNumber || "",
    convictionCharges: formData.convictionCharges || "",
    sentenceImposed: formData.sentenceImposed || "",
    sentenceDate: formData.sentenceDate || "",
    currentCustodyStatus: formData.currentCustodyStatus || "",
    petitionType: formData.petitionType || "",
    directAppealFiled: formData.directAppealFiled || "",
    directAppealResult: formData.directAppealResult || "",
    directAppealDate: formData.directAppealDate || "",
    priorHabeasPetitions: formData.priorHabeasPetitions || "none",
    priorPetitionDetails: formData.priorPetitionDetails || "",
    stateRemediesExhausted: formData.stateRemediesExhausted || "",
    exhaustionExplanation: formData.exhaustionExplanation || "",
    aepdaTimeliness: formData.aepdaTimeliness || "",
    primaryGround: formData.primaryGround || "",
    groundsDescription: formData.groundsDescription || "",
    additionalGrounds: formData.additionalGrounds || "",
    prejudiceDescription: formData.prejudiceDescription || "",
    supportingEvidence: formData.supportingEvidence || "",
    coaRequested: formData.coaRequested || "",
    hearingRequested: formData.hearingRequested || "",
    // Motion to sever fields
    severanceType: formData.severanceType || "",
    numberOfCodefendants: formData.numberOfCodefendants || "",
    codefendantNames: formData.codefendantNames || "",
    chargesToSever: formData.chargesToSever || "",
    curingInstructions: formData.curingInstructions || "",
    prosecutionPosition: formData.prosecutionPosition || "",
    // Motion for judgment of acquittal fields
    trialStartDate: formData.trialStartDate || "",
    trialPhase: formData.trialPhase || "",
    judgeAssigned: formData.judgeAssigned || "",
    insufficientElements: formData.insufficientElements || "",
    missingEvidence: formData.missingEvidence || "",
    weaknessesInProsecution: formData.weaknessesInProsecution || "",
    credibilityIssues: formData.credibilityIssues || "",
    // Motion for mistrial fields
    mistrialBasis: formData.mistrialBasis || "",
    incidentDescription: formData.incidentDescription || "",
    dateOfIncident: formData.dateOfIncident || "",
    curativeAction: formData.curativeAction || "",
    curingAttemptDetails: formData.curingAttemptDetails || "",
    prejudiceToDefendant: formData.prejudiceToDefendant || "",
    // Motion for change of venue fields
    currentVenue: formData.currentVenue || "",
    requestedVenue: formData.requestedVenue || "",
    primaryBasis: formData.primaryBasis || "",
    publicityDescription: formData.publicityDescription || "",
    publicityExamples: formData.publicityExamples || "",
    juryPoolConcerns: formData.juryPoolConcerns || "",
    priorVoirDireAttempts: formData.priorVoirDireAttempts || "",
    communityImpact: formData.communityImpact || "",
    // Motion to compel discovery fields
    originalRequestDate: formData.originalRequestDate || "",
    originalRequestMethod: formData.originalRequestMethod || "",
    discoveryRequested: formData.discoveryRequested || "",
    prosecutionResponse: formData.prosecutionResponse || "",
    whatRemains: formData.whatRemains || "",
    relevanceOfMaterials: formData.relevanceOfMaterials || "",
    sanctionsRequested: formData.sanctionsRequested || "",
    sanctionJustification: formData.sanctionJustification || "",
    // Motion for bail pending appeal fields
    custodyFacility: formData.custodyFacility || "",
    noticeOfAppealFiled: formData.noticeOfAppealFiled || "",
    appealFilingDate: formData.appealFilingDate || "",
    appellateIssues: formData.appellateIssues || "",
    likelihoodOfSuccess: formData.likelihoodOfSuccess || "",
    flightRisk: formData.flightRisk || "",
    flightRiskExplanation: formData.flightRiskExplanation || "",
    dangerToCommunity: formData.dangerToCommunity || "",
    priorCourtAppearances: formData.priorCourtAppearances || "",
    // Immigration: motion to suppress evidence fields
    obtainingAgency: formData.obtainingAgency || "",
    violationType: formData.violationType || "",
    egregiousnessFactors: formData.egregiousnessFactors || "",
    witnessesPresent: formData.witnessesPresent || "",
    bodycamOrDocumentation: formData.bodycamOrDocumentation || "",
    additionalRelief: formData.additionalRelief || "",
    // Immigration: motion for voluntary departure fields
    departureStage: formData.departureStage || "",
    requestedPeriod: formData.requestedPeriod || "",
    destinationCountry: formData.destinationCountry || "",
    meansOfDeparture: formData.meansOfDeparture || "",
    financialAbility: formData.financialAbility || "",
    departureArrangements: formData.departureArrangements || "",
    physicalPresenceYears: formData.physicalPresenceYears || "",
    goodMoralCharacter: formData.goodMoralCharacter || "",
    noAggravatedFelony: formData.noAggravatedFelony || "",
    noTerrorismCharges: formData.noTerrorismCharges || "",
    priorVoluntaryDeparture: formData.priorVoluntaryDeparture || "",
    taxCompliance: formData.taxCompliance || "",
    voluntaryDepartureBond: formData.voluntaryDepartureBond || "",
    bondAmount: formData.bondAmount || "",
    financialResources: formData.financialResources || "",
  };

  // Process template with safe data
  const prompt = processTemplate(section.aiPromptTemplate, safeFormData);

  // Select system prompt based on court type
  const systemPrompt = courtType === "immigration"
    ? AI_IMMIGRATION_SYSTEM_PROMPT
    : AI_SYSTEM_PROMPT;

  devLog('ai', `Generating content for section: ${section.id}`);
  devLog('ai', `Prompt length: ${prompt.length} characters`);

  if (!isRequestCostAcceptable(systemPrompt.length + prompt.length)) {
    throw new Error('Document section prompt is too large to process.');
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      temperature: 0.3, // Low temperature for legal accuracy
      system: [
        {
          type: "text" as const,
          text: systemPrompt,
          cache_control: { type: "ephemeral" as const },
        },
      ],
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in AI response");
    }

    opsLog('ai', `Section ${section.id}: ${response.usage.input_tokens}+${response.usage.output_tokens} tokens`);

    return textContent.text.trim();
  } catch (error) {
    errLog(`[AI] Failed to generate section ${section.id}:`, error);
    throw error;
  }
}

// ============================================================================
// Document Generation
// ============================================================================

/**
 * Generate a document from a template
 */
export async function generateDocument(
  request: GenerateDocumentRequest
): Promise<GeneratedDocument> {
  const { templateId, jurisdiction, courtType, district, formData, sessionId } = request;

  // Get template with jurisdiction variant
  const template = getTemplate(templateId, jurisdiction, courtType, district);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Validate form data
  const validation = validateFormData(template, formData);
  if (!validation.isValid) {
    throw new Error(`Invalid form data: ${validation.errors.join(", ")}`);
  }

  devLog('doc-generator', `Generating ${templateId} for jurisdiction ${jurisdiction}`);

  // Process each section
  const generatedSections: GeneratedSection[] = [];

  for (const section of template.baseSections) {
    let content = "";

    switch (section.type) {
      case "static":
        // Process static content with variable interpolation
        content = section.staticContent
          ? processTemplate(section.staticContent, formData)
          : "";
        break;

      case "user-input":
        // Format user input as structured content
        content = formatUserInputSection(section, formData);
        break;

      case "ai-generated":
        // Generate AI content
        content = await generateAISection(section, formData, jurisdiction, courtType);
        break;

      default:
        devLog('doc-generator', `Unknown section type: ${section.type}`);
    }

    generatedSections.push({
      id: section.id,
      name: section.name,
      type: section.type,
      content,
    });
  }

  // Create document record
  const documentId = randomUUID();
  const now = new Date();

  const document: GeneratedDocument = {
    documentId,
    sessionId,
    templateId,
    templateName: template.name,
    jurisdiction,
    courtType: courtType || "state",
    district,
    sections: generatedSections,
    generatedAt: now,
    expiresAt: new Date(now.getTime() + DOCUMENT_TTL_MS),
  };

  // Store document
  generatedDocuments.set(documentId, document);

  opsLog('doc-generator', `Generated document ${documentId.substring(0, 8)} for session ${sessionId.substring(0, 8)}`);

  return document;
}

/**
 * Format user input section for display
 */
function formatUserInputSection(
  section: TemplateSection,
  formData: Record<string, string>
): string {
  if (!section.inputs) return "";

  const lines: string[] = [];

  for (const input of section.inputs) {
    const value = formData[input.id];
    if (value) {
      // For select inputs, try to find the label
      if (input.type === "select" && input.validation?.options) {
        const option = input.validation.options.find((opt) => opt.value === value);
        lines.push(`${input.label}: ${option?.label || value}`);
      } else {
        lines.push(`${input.label}: ${value}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Delete a generated document
 */
export function deleteGeneratedDocument(documentId: string): boolean {
  return generatedDocuments.delete(documentId);
}

/**
 * Clear all documents for a specific session
 */
export function clearSessionDocuments(sessionId: string): number {
  const keysToDelete: string[] = [];

  generatedDocuments.forEach((doc, key) => {
    if (doc.sessionId === sessionId) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => generatedDocuments.delete(key));
  return keysToDelete.length;
}
