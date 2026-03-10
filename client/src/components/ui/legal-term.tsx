/**
 * LegalTerm — inline tooltip for difficult legal vocabulary.
 *
 * Renders the term with a subtle dotted underline. On hover/focus a tooltip
 * shows a plain-language definition. Designed to be used sparingly on the
 * most confusing terms only.
 *
 * Usage:
 *   <LegalTerm term="arraignment" />
 *   <LegalTerm term="bail">bail hearing</LegalTerm>   ← custom display text
 */

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Term dictionary ──────────────────────────────────────────────────────────
// Keep this list short. Only terms that genuinely confuse a non-lawyer.

export const LEGAL_DEFINITIONS: Record<string, string> = {
  arraignment:
    "Your first court appearance. The judge reads the charges against you and you enter a plea: guilty, not guilty, or no contest.",
  bail: "Money paid to the court as a guarantee you will return for your hearings. You get it back at the end of the case if you appear.",
  "bail bond":
    "A bail bondsman pays your full bail in exchange for a fee (usually 10–15% of the bail amount). That fee is non-refundable even if charges are dropped.",
  bondsman:
    "A licensed agent who pays bail on your behalf for a non-refundable fee (usually 10–15%). If you miss court, they can pursue you to recover the money.",
  "release on own recognizance":
    "Released without paying any money — based solely on your promise to return for court dates. Also called ROR or OR release.",
  "own recognizance":
    "Released on your promise to appear without paying bail. Abbreviated ROR or OR.",
  ROR: "Release on Own Recognizance — you are freed without paying bail, based on your written promise to appear at all future court dates.",
  "Miranda rights":
    "Constitutional rights that must be read to you before a custodial interrogation: the right to remain silent and the right to an attorney. Anything you say after being Mirandized can be used against you.",
  "preliminary hearing":
    "A court hearing — before trial — where a judge reviews the evidence to decide whether there is enough probable cause to proceed to trial.",
  discovery:
    "The legal process where both sides exchange evidence before trial. The prosecution must share police reports, witness lists, and physical evidence with the defense.",
  continuance:
    "A postponement of a scheduled court date to a later date, requested by either side or ordered by the judge.",
  "motion to suppress":
    "A formal legal request asking the court to exclude specific evidence from trial because it was obtained illegally (e.g., an unlawful search).",
  "plea bargain":
    "An agreement between you and the prosecutor to resolve the case without trial — typically by pleading guilty to a lesser charge or for a lighter sentence.",
  "collateral consequences":
    "Penalties and restrictions that continue after your sentence ends — such as losing a professional license, being disqualified from housing, or immigration consequences.",
  indictment:
    "A formal written accusation issued by a grand jury stating that there is enough evidence to charge you with a crime and proceed to trial.",
  subpoena:
    "A legal order requiring a person to appear in court or provide documents. Ignoring a subpoena can result in arrest.",
  "habeas corpus":
    "Latin for 'you have the body.' A legal petition arguing that your detention is unlawful and requesting a court to order your release.",
  "public defender":
    "A court-appointed attorney provided at no cost to defendants who cannot afford a private lawyer. Guaranteed by the Sixth Amendment.",
  "attorney-client privilege":
    "A legal protection that keeps conversations between you and your attorney private. Your attorney cannot be forced to testify about what you told them.",
  arraignment: // alias
    "Your first court appearance. The judge reads the charges against you and you enter a plea: guilty, not guilty, or no contest.",
  "no contest":
    "A plea meaning you do not admit guilt but accept the punishment. Has the same legal effect as guilty in most cases but cannot be used against you in a civil lawsuit.",
  "OR release":
    "Release on Own Recognizance — freed without paying bail based on your promise to appear at all future court dates.",
  "bail fund":
    "A nonprofit organization that pays bail for people who cannot afford it. Funds are typically returned after the case ends and re-used for others.",
  "property bond":
    "Using real estate (like a home) as collateral for bail instead of cash. If you miss court, the court can place a lien on or seize the property.",
  "Daubert standard":
    "The federal legal test for whether expert witness testimony is admissible. The judge acts as 'gatekeeper' to ensure the expert's methods are scientifically reliable.",
  "Frye standard":
    "A test used in some states for expert testimony — the method must be 'generally accepted' in the relevant scientific community.",
  "withholding of removal":
    "A form of immigration protection that prevents deportation to a specific country if you would face persecution there. Separate from asylum and available even to some people who are barred from asylum.",
  CAT: "Convention Against Torture — an international treaty providing protection from deportation to a country where you would likely be tortured.",
  EOIR: "Executive Office for Immigration Review — the agency that runs the U.S. immigration court system.",
  NTA: "Notice to Appear — the document issued by immigration enforcement that starts your immigration court case.",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface LegalTermProps {
  /** Key into LEGAL_DEFINITIONS — used for the definition lookup */
  term: string;
  /** Optional custom display text. Defaults to the term itself. */
  children?: React.ReactNode;
}

export function LegalTerm({ term, children }: LegalTermProps) {
  const definition = LEGAL_DEFINITIONS[term.toLowerCase()] ?? LEGAL_DEFINITIONS[term];

  if (!definition) {
    // Render plain if term not in dictionary (fail gracefully)
    return <>{children ?? term}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="border-b border-dotted border-current/60 cursor-help inline"
          tabIndex={0}
          role="definition"
          aria-label={`Definition of ${term}`}
        >
          {children ?? term}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-72 text-sm leading-relaxed z-50"
        sideOffset={4}
      >
        <p className="font-semibold mb-1 capitalize">{term}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{definition}</p>
      </TooltipContent>
    </Tooltip>
  );
}
