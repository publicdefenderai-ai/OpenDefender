import { useState, useEffect, useId } from "react";
import { flushSync } from "react-dom";
import { familyToolkitDesignCopy } from "@/locales/family-toolkit-design";
import {
  ChevronLeft, Printer, AlertCircle, Phone, MapPin, Scale,
  FileText, Mail, Calendar, User, Hash, Clock, Building2,
  ChevronDown, ChevronUp, ExternalLink, Info, Check,
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

// ── State court lookup data ──────────────────────────────────────────────────

const COURT_LOOKUPS: Record<string, { url: string; name: string; note?: string }> = {
  AL: { url: "https://publicportal.ajc.state.al.us/PublicAccessPortal/", name: "Alabama Judicial System" },
  AK: { url: "https://records.courts.alaska.gov/", name: "Alaska Court Records" },
  AZ: { url: "https://apps.supremecourt.az.gov/publicaccess/", name: "Arizona Public Access" },
  AR: { url: "https://caseinfo.aoc.arkansas.gov/", name: "Arkansas Court Connect" },
  CA: { url: "https://www.courts.ca.gov/find-my-court.htm", name: "California Court Search", note: "Case lookup varies by county. Select your county from the list." },
  CO: { url: "https://www.courts.state.co.us/Courts/Case_Search.cfm", name: "Colorado eCourts" },
  CT: { url: "https://civilinquiry.jud.ct.gov/", name: "Connecticut Judicial Branch" },
  DE: { url: "https://efts.courts.delaware.gov/", name: "Delaware Courts" },
  FL: { url: "https://www.myeclerk.com/", name: "Florida Clerk of Courts", note: "Varies by county — select your county for case lookup." },
  GA: { url: "https://www.gasupreme.us/", name: "Georgia Courts", note: "Case records are held by the county clerk. Search for your county's superior court." },
  HI: { url: "https://hoohiki.courts.hawaii.gov/", name: "Hawaii Ho'ohiki" },
  ID: { url: "https://mycourts.idaho.gov/", name: "Idaho iCourt" },
  IL: { url: "https://casenet.courts.il.gov/", name: "Illinois Case Net" },
  IN: { url: "https://public.courts.in.gov/mycase/", name: "Indiana MyCase" },
  IA: { url: "https://www.iowacourts.state.ia.us/ESAWebApp/SelectFrame", name: "Iowa Court Records" },
  KS: { url: "https://www.kscourts.org/Cases-Decisions/Cases/Case-Lookup/", name: "Kansas Courts" },
  KY: { url: "https://kcoj.kycourts.net/kyecourts/", name: "Kentucky eCourts" },
  LA: { url: "https://www.lacsc.org/", name: "Louisiana Courts", note: "Records are maintained by parish. Search your parish court directly." },
  ME: { url: "https://www.courts.maine.gov/", name: "Maine Judicial Branch" },
  MD: { url: "https://casesearch.courts.state.md.us/casesearch/", name: "Maryland Case Search" },
  MA: { url: "https://www.masscourts.org/eservices/", name: "Massachusetts Courts" },
  MI: { url: "https://www.courts.michigan.gov/", name: "Michigan Courts", note: "Case records are held at the county level. Search your county's circuit court." },
  MN: { url: "https://publicaccess.courts.state.mn.us/", name: "Minnesota Court Access" },
  MS: { url: "https://courts.ms.gov/trialcourt/trialcourt.php", name: "Mississippi Courts" },
  MO: { url: "https://www.courts.mo.gov/casenet/", name: "Missouri Case Net" },
  MT: { url: "https://courts.mt.gov/", name: "Montana Courts" },
  NE: { url: "https://www.nebraska.gov/justice/", name: "Nebraska JUSTICE" },
  NV: { url: "https://www.nevadajudiciary.us/", name: "Nevada Judiciary" },
  NH: { url: "https://www.courts.nh.gov/", name: "New Hampshire Courts" },
  NJ: { url: "https://portal.njcourts.gov/webe7/", name: "New Jersey Courts" },
  NM: { url: "https://caselookup.nmcourts.gov/caselookup/", name: "New Mexico Case Lookup" },
  NY: { url: "https://iapps.courts.state.ny.us/webcivil/ecourtsEntryPage", name: "New York eCourts" },
  NC: { url: "https://www.nccourts.gov/", name: "North Carolina Courts" },
  ND: { url: "https://www.ndcourts.gov/", name: "North Dakota Courts" },
  OH: { url: "https://www.supremecourt.ohio.gov/", name: "Ohio Courts", note: "Records are maintained by county. Search your county's common pleas court." },
  OK: { url: "https://www.oscn.net/applications/oscn/start.asp", name: "Oklahoma State Courts Network" },
  OR: { url: "https://publicaccess.courts.oregon.gov/", name: "Oregon eCourt Public Access" },
  PA: { url: "https://ujsportal.pacourts.us/", name: "Pennsylvania Unified Judicial System" },
  RI: { url: "https://www.courts.ri.gov/", name: "Rhode Island Courts" },
  SC: { url: "https://www.sccourts.org/caseSearch/", name: "South Carolina Courts" },
  SD: { url: "https://ujsportal.sd.gov/", name: "South Dakota UJS Portal" },
  TN: { url: "https://www.tncourts.gov/", name: "Tennessee Courts" },
  TX: { url: "https://search.txcourts.gov/", name: "Texas Court Search" },
  UT: { url: "https://www.utcourts.gov/ocap/", name: "Utah Online Court Assistance" },
  VT: { url: "https://www.vermontjudiciary.org/", name: "Vermont Judiciary" },
  VA: { url: "https://eapps.courts.state.va.us/gdcourts/caseSearch.do", name: "Virginia Court Records" },
  WA: { url: "https://www.courts.wa.gov/", name: "Washington Courts", note: "Records vary by county. Select your county superior court from the courts directory." },
  WV: { url: "https://apps.wv.gov/supreme/courts/", name: "West Virginia Courts" },
  WI: { url: "https://wcca.wicourts.gov/", name: "Wisconsin Circuit Court Access" },
  WY: { url: "https://www.courts.state.wy.us/", name: "Wyoming Courts" },
  DC: { url: "https://www.dccourts.gov/", name: "DC Courts" },
  FED: { url: "https://www.courtlistener.com/", name: "Federal Courts via CourtListener (free)", note: "CourtListener’s RECAP archive has free copies of some federal filings. PACER provides access to public federal court records and may charge fees. A missing search result does not rule out a case." },
};

const US_STATES_LOOKUP = [
  { code: "AL", label: "Alabama" }, { code: "AK", label: "Alaska" },
  { code: "AZ", label: "Arizona" }, { code: "AR", label: "Arkansas" },
  { code: "CA", label: "California" }, { code: "CO", label: "Colorado" },
  { code: "CT", label: "Connecticut" }, { code: "DE", label: "Delaware" },
  { code: "FL", label: "Florida" }, { code: "GA", label: "Georgia" },
  { code: "HI", label: "Hawaii" }, { code: "ID", label: "Idaho" },
  { code: "IL", label: "Illinois" }, { code: "IN", label: "Indiana" },
  { code: "IA", label: "Iowa" }, { code: "KS", label: "Kansas" },
  { code: "KY", label: "Kentucky" }, { code: "LA", label: "Louisiana" },
  { code: "ME", label: "Maine" }, { code: "MD", label: "Maryland" },
  { code: "MA", label: "Massachusetts" }, { code: "MI", label: "Michigan" },
  { code: "MN", label: "Minnesota" }, { code: "MS", label: "Mississippi" },
  { code: "MO", label: "Missouri" }, { code: "MT", label: "Montana" },
  { code: "NE", label: "Nebraska" }, { code: "NV", label: "Nevada" },
  { code: "NH", label: "New Hampshire" }, { code: "NJ", label: "New Jersey" },
  { code: "NM", label: "New Mexico" }, { code: "NY", label: "New York" },
  { code: "NC", label: "North Carolina" }, { code: "ND", label: "North Dakota" },
  { code: "OH", label: "Ohio" }, { code: "OK", label: "Oklahoma" },
  { code: "OR", label: "Oregon" }, { code: "PA", label: "Pennsylvania" },
  { code: "RI", label: "Rhode Island" }, { code: "SC", label: "South Carolina" },
  { code: "SD", label: "South Dakota" }, { code: "TN", label: "Tennessee" },
  { code: "TX", label: "Texas" }, { code: "UT", label: "Utah" },
  { code: "VT", label: "Vermont" }, { code: "VA", label: "Virginia" },
  { code: "WA", label: "Washington" }, { code: "WV", label: "West Virginia" },
  { code: "WI", label: "Wisconsin" }, { code: "WY", label: "Wyoming" },
  { code: "DC", label: "Washington D.C." }, { code: "FED", label: "Federal Court" },
];

// ── Printable Contact Kit layout (print:block hidden) ────────────────────────

function PrintableKit({ fields }: { fields: Record<string, string> }) {
  return (
    <div className="hidden print:block p-8 font-sans text-sm">
      <h1 className="text-xl font-bold mb-1">Emergency Contact Kit</h1>
      <p className="text-xs text-gray-500 mb-6">OpenDefender · opendefender.net · Temporary in-memory session records · Not legal advice</p>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {Object.entries(fields).filter(([, v]) => v.trim()).map(([key, value]) => (
          <div key={key}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function FamilyToolkit() {
  useScrollToTop();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith('es') ? 'es' : i18n.language.startsWith('zh') ? 'zh' : 'en';
  const copy = familyToolkitDesignCopy[language];
  const [activeTool, setActiveTool] = useState('contact-kit');
  const [printTarget, setPrintTarget] = useState('contact-kit');
  const showTool = (id: string, focus = true) => {
    setActiveTool(id);
    if (focus) requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(`#${id} h2`);
      heading?.focus({preventScroll:true}); heading?.scrollIntoView({block:'start'});
    });
  };
  useEffect(() => {
    const reveal = () => {
      const id = location.hash.slice(1);
      if (['contact-kit','docket-lookup','certified-mail','address-guide'].includes(id)) showTool(id);
    };
    reveal(); window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, []);

  // Contact Kit state
  const [kit, setKit] = useState({
    personName: "", bookingNumber: "", dateOfArrest: "",
    facilityName: "", facilityPhone: "", visitingHours: "",
    publicDefenderName: "", publicDefenderPhone: "",
    attorneyName: "", attorneyPhone: "",
    bailBondsmanName: "", bailBondsmanPhone: "",
    courtName: "", courtClerkPhone: "", caseNumber: "",
    nextCourtDate: "", nextCourtLocation: "", judgeOrCourtroom: "",
  });
  const updateKit = (key: string, value: string) => setKit(prev => ({ ...prev, [key]: value }));
  const filledCount = Object.values(kit).filter(v => v.trim()).length;

  // Docket lookup state
  const [lookupState, setLookupState] = useState("");
  const courtInfo = lookupState ? COURT_LOOKUPS[lookupState] : null;

  // Certified mail checklist state
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggleCheck = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePrint = (target: string) => {
    flushSync(() => setPrintTarget(target));
    window.print();
  };

  // Certified mail items
  const mailItems = {
    thisWeek: [
      { id: "usps", label: "USPS Mail Forwarding", detail: "The addressee or an authorized representative can request forwarding. USPS may require identification and proof of authority." },
      { id: "ssa", label: "Social Security Administration", detail: "Notify SSA of the change in circumstances if the person receives SSI, SSDI, or other SSA benefits. Benefits may be suspended but can be reinstated." },
      { id: "snap", label: "SNAP/Food Assistance Office", detail: "Notify your local SNAP office. Report changes in household membership. Other eligible household members may continue receiving SNAP; ask how to update the case after release." },
      { id: "bank", label: "Bank or Credit Union", detail: "The account holder or a representative authorized by the bank can update the mailing address. Confirm who may make changes before acting." },
    ],
    beforeCourt: [
      { id: "bail_receipt", label: "Bail or Bond Documentation", detail: "Keep copies of bail receipts, bond agreements and release conditions. Ask the recipient if a certified copy is needed." },
      { id: "attorney_confirm", label: "Attorney Retainer Confirmation", detail: "If you hired a private attorney, keep a copy of the signed retainer agreement and confirmation of representation." },
      { id: "employer", label: "Employer Notification (if needed)", detail: "If the person will miss work, written notification of the situation (without oversharing legal details) can be provided through the employer’s usual reporting channel. Keep confirmation." },
    ],
    ongoing: [
      { id: "probation", label: "Probation or Parole Officer", detail: "Follow the reporting method and deadline in the supervision conditions. If mail is accepted, certified mail with a return receipt can help document delivery." },
      { id: "court_notices", label: "Court Notices and Filings", detail: "Keep your filed copies and filing confirmations. If a recipient requires a certified court order, request it from the clerk." },
      { id: "benefits_renewal", label: "Benefits Renewal Notices", detail: "SNAP, Medicaid, and other benefits require periodic renewal. Use the agency’s accepted renewal method and save confirmation." },
    ],
  };

  // Address guide items
  const addressGuide = [
    {
      category: "Mail & Identity",
      icon: Mail,
      items: [
        { label: "USPS Mail Forwarding", url: "https://moversguide.usps.com/", timeline: "Immediately", detail: "Submit a change-of-address online or at your local post office. Only the addressee or an authorized representative should submit the request. Forwarding duration varies by mail class; notify senders directly." },
        { label: "State Driver's License / ID", url: "https://www.usa.gov/motor-vehicle-services", timeline: "Check your state deadline", detail: "Contact your state DMV. Address updates are often possible online or by mail. Bring proof of new address." },
      ],
    },
    {
      category: "Benefits",
      icon: FileText,
      items: [
        { label: "Social Security (SSA)", url: "https://www.ssa.gov/", timeline: "Immediately", detail: "Call 1-800-772-1213 or visit ssa.gov to report the change. For SSI, report changes promptly and by the tenth day after the end of the month of the change. Ask SSA about release documentation and restarting payments." },
        { label: "SNAP / Food Assistance", url: "https://www.fns.usda.gov/snap/state-directory", timeline: "Immediately", detail: "Contact your state SNAP office. Report household changes. Eligible household members may keep receiving SNAP. Ask whether the returning person should rejoin the household case or apply." },
        { label: "Medicaid", url: "https://www.medicaid.gov/", timeline: "Before or soon after release", detail: "Incarceration alone does not terminate eligibility. Ask your state Medicaid office about enrollment, renewal and restoring services." },
      ],
    },
    {
      category: "Financial",
      icon: Hash,
      items: [
        { label: "Bank / Credit Union", url: "", timeline: "This week", detail: "The account holder, joint owner or representative may have different permissions. Ask the bank what authority and documents it requires for this change." },
        { label: "Direct Deposit Paychecks", url: "", timeline: "Before next pay period", detail: "Confirm direct deposit routing with the employer's payroll department to ensure pay continues to the correct account." },
        { label: "IRS / Tax Correspondence", url: "https://www.irs.gov/", timeline: "As needed", detail: "File IRS Form 8822 to update your address with the IRS. The IRS generally takes four to six weeks after receipt to process an address change." },
      ],
    },
    {
      category: "Legal & Court",
      icon: Scale,
      items: [
        { label: "Attorney of Record", url: "", timeline: "Immediately", detail: "Ensure the attorney has the most current mailing address for all parties. Court correspondence is often sent to the attorney of record." },
        { label: "Probation or Parole Officer", url: "", timeline: "Immediately — required", detail: "Failure to notify a probation or parole officer of an address change is often a violation. Do this immediately and get written confirmation." },
        { label: "Court Clerk's Office", url: "", timeline: "Before next hearing", detail: "File a formal change-of-address notice with the court clerk so that notices and orders reach the correct address." },
      ],
    },
    {
      category: "Employment",
      icon: Building2,
      items: [
        { label: "Employer HR / Payroll", url: "", timeline: "This week", detail: "Update the address on file for W-2s, pay stubs, and any benefits correspondence. Do this even if employment is on hold." },
        { label: "Health Insurance Provider", url: "", timeline: "This week", detail: "If employer-sponsored health insurance is involved, update the address with the insurance provider to ensure plan documents and notices are received." },
      ],
    },
  ];

  const jumpLinks = [
    { id: "contact-kit", label: "Contact Info Kit" },
    { id: "docket-lookup", label: "Docket Lookup" },
    { id: "certified-mail", label: "Certified Mail" },
    { id: "address-guide", label: "Address Guide" },
  ];

  return (
    <div className="toolkit-page min-h-screen bg-background">
      <Header />

      {/* Printable kit — only visible when printing */}
      <div className="toolkit-print" lang="en">
      <div data-print-sheet="contact-kit" hidden={printTarget !== "contact-kit"}>
        <PrintableKit fields={{
          "Person Name": kit.personName,
          "Booking Number": kit.bookingNumber,
          "Date of Arrest": kit.dateOfArrest,
          "Facility Name": kit.facilityName,
          "Facility Phone": kit.facilityPhone,
          "Visiting Hours": kit.visitingHours,
          "Public Defender": kit.publicDefenderName,
          "Public Defender Phone": kit.publicDefenderPhone,
          "Attorney Name": kit.attorneyName,
          "Attorney Phone": kit.attorneyPhone,
          "Bail Bondsman": kit.bailBondsmanName,
          "Bail Bondsman Phone": kit.bailBondsmanPhone,
          "Court Name": kit.courtName,
          "Court Clerk Phone": kit.courtClerkPhone,
          "Case Number": kit.caseNumber,
          "Next Court Date": kit.nextCourtDate,
          "Court Location": kit.nextCourtLocation,
          "Judge / Courtroom": kit.judgeOrCourtroom,
        }} />
      </div>
      <section data-print-sheet="certified-mail" hidden={printTarget !== 'certified-mail'}>
        <h1>Certified Mail Checklist</h1>
        <p>OpenDefender · opendefender.net · Not legal advice</p>
        {Object.entries(mailItems).map(([group,items])=><div key={group}><h2>{group === 'thisWeek' ? 'This week' : group === 'beforeCourt' ? 'Before the next court date' : 'Ongoing'}</h2>
          {items.map(item=><div className="toolkit-print-item" key={item.id}><h3>{checked[item.id] ? '☑' : '☐'} {item.label}</h3><p>{item.detail}</p></div>)}
        </div>)}
      </section>
      <section data-print-sheet="address-guide" hidden={printTarget !== 'address-guide'}>
        <h1>Change-of-Address Guide</h1><p>OpenDefender · opendefender.net · Not legal advice</p>
        {addressGuide.map(group=><div key={group.category}><h2>{group.category}</h2>{group.items.map(item=><div className="toolkit-print-item" key={item.label}><h3>{item.label}</h3><p>{item.timeline}</p><p>{item.detail}</p>{item.url && <p>{item.url}</p>}</div>)}</div>)}
      </section>
      </div>

      {/* Hero */}
      <section className="toolkit-hero print:hidden">
        <div className="toolkit-width">
          <Link href="/friends-family">
            <span className="toolkit-back">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Family Guide
            </span>
          </Link>
          <h1 lang={language}>{copy.title}</h1>
          <p className="toolkit-intro" lang="en">
            Four practical tools for the work that needs to happen now. Fill in what you know. You can always add more later.
          </p>
          {language !== "en" && <p lang={language}>{copy.englishNotice}</p>}
        </div>
      </section>

      {/* Ephemeral data warning */}
      <div className="print:hidden bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Nothing on this page is saved.</strong> All information you enter is cleared when you close or navigate away. Print or screenshot anything you want to keep before leaving.
          </p>
        </div>
      </div>

      <div className="toolkit-work toolkit-width print:hidden" lang="en">

<nav className="toolkit-nav" aria-label={copy.navigation} lang={language}>
 {jumpLinks.map(({id},index)=><button key={id} type="button" aria-pressed={activeTool === id} aria-controls={id} onClick={()=>showTool(id)}>{copy.tools[index]}</button>)}
</nav><div className="toolkit-panels">
        {/* ── TOOL 1: Contact Info Kit ──────────────────────────────────────── */}
        <section id="contact-kit" hidden={activeTool !== "contact-kit"} className="toolkit-panel">

            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">

                <h2 tabIndex={-1} className="text-xl font-bold text-foreground">Contact Info Kit</h2>
              </div>
              {filledCount > 0 && (
                <span className="text-xs text-muted-foreground">{filledCount} of {Object.keys(kit).length} filled</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-5">Fill in what you know. Blank fields stay blank — no need to complete everything at once. Print or screenshot before you leave.</p>


          <div className="space-y-5">
            {/* Person */}
            <FieldGroup title="Person" icon={User} color="text-slate-600">
              <Field label="Full legal name" value={kit.personName} onChange={v => updateKit("personName", v)} placeholder="As it appears on ID" />
              <Field label="Booking / case number" value={kit.bookingNumber} onChange={v => updateKit("bookingNumber", v)} placeholder="From booking paperwork" />
              <Field label="Date of arrest" value={kit.dateOfArrest} onChange={v => updateKit("dateOfArrest", v)} type="date" />
            </FieldGroup>

            {/* Facility */}
            <FieldGroup title="Facility / Jail" icon={Building2} color="text-blue-600">
              <Field label="Facility name" value={kit.facilityName} onChange={v => updateKit("facilityName", v)} placeholder="Name of jail or detention center" />
              <Field label="Main phone number" value={kit.facilityPhone} onChange={v => updateKit("facilityPhone", v)} type="tel" placeholder="(000) 000-0000" />
              <Field label="Visiting hours" value={kit.visitingHours} onChange={v => updateKit("visitingHours", v)} placeholder="e.g. Sat–Sun 10am–2pm" />
            </FieldGroup>

            {/* Legal */}
            <FieldGroup title="Legal Representation" icon={Scale} color="text-green-600">
              <Field label="Public defender name" value={kit.publicDefenderName} onChange={v => updateKit("publicDefenderName", v)} placeholder="If appointed" />
              <Field label="Public defender phone" value={kit.publicDefenderPhone} onChange={v => updateKit("publicDefenderPhone", v)} type="tel" placeholder="(000) 000-0000" />
              <Field label="Private attorney name" value={kit.attorneyName} onChange={v => updateKit("attorneyName", v)} placeholder="If hired" />
              <Field label="Private attorney phone" value={kit.attorneyPhone} onChange={v => updateKit("attorneyPhone", v)} type="tel" placeholder="(000) 000-0000" />
              <Field label="Bail bondsman name" value={kit.bailBondsmanName} onChange={v => updateKit("bailBondsmanName", v)} placeholder="If applicable" />
              <Field label="Bail bondsman phone" value={kit.bailBondsmanPhone} onChange={v => updateKit("bailBondsmanPhone", v)} type="tel" placeholder="(000) 000-0000" />
            </FieldGroup>

            {/* Court */}
            <FieldGroup title="Court" icon={Calendar} color="text-purple-600">
              <Field label="Court name" value={kit.courtName} onChange={v => updateKit("courtName", v)} placeholder="e.g. Los Angeles Superior Court" />
              <Field label="Court clerk phone" value={kit.courtClerkPhone} onChange={v => updateKit("courtClerkPhone", v)} type="tel" placeholder="(000) 000-0000" />
              <Field label="Case number" value={kit.caseNumber} onChange={v => updateKit("caseNumber", v)} placeholder="From court paperwork" />
              <Field label="Next court date" value={kit.nextCourtDate} onChange={v => updateKit("nextCourtDate", v)} type="date" />
              <Field label="Court location / address" value={kit.nextCourtLocation} onChange={v => updateKit("nextCourtLocation", v)} placeholder="Address or room number" />
              <Field label="Judge / courtroom" value={kit.judgeOrCourtroom} onChange={v => updateKit("judgeOrCourtroom", v)} placeholder="If known" />
            </FieldGroup>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={()=>handlePrint("contact-kit")}  variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print this kit
            </Button>
            <p className="text-xs text-muted-foreground self-center">On mobile: screenshot this page to save your information.</p>
          </div>
        </section>

        {/* ── TOOL 2: Docket & Warrant Lookup ──────────────────────────────── */}
        <section id="docket-lookup" hidden={activeTool !== "docket-lookup"} className="toolkit-panel">

            <div className="flex items-center gap-3 mb-1">

              <h2 tabIndex={-1} className="text-xl font-bold text-foreground">Docket & Warrant Lookup</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Find the court record, case status, and hearing dates. Select the state where the person was arrested.</p>


          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">State or jurisdiction</label>
              <select
                value={lookupState}
                onChange={e => setLookupState(e.target.value)}
                className="w-full sm:w-64 text-sm rounded-lg border border-input bg-background px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Select state for court lookup"
              >
                <option value="">— Select a state —</option>
                {US_STATES_LOOKUP.map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

            {courtInfo && (
              <Card className="border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-900/10">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{courtInfo.name}</p>
                      {courtInfo.note && <p className="text-xs text-muted-foreground mt-1">{courtInfo.note}</p>}
                    </div>
                    <a
                      href={courtInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                    >
                      Open <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <div className="border-t border-teal-200 dark:border-teal-800/40 pt-3 space-y-1.5">
                    <p className="text-sm font-semibold text-muted-foreground">What to look for</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-start gap-2"><span className="text-teal-600 mt-0.5 flex-shrink-0">•</span> Search by full legal name and date of birth</li>
                      <li className="flex items-start gap-2"><span className="text-teal-600 mt-0.5 flex-shrink-0">•</span> Case number (if you have it) gives the most direct result</li>
                      <li className="flex items-start gap-2"><span className="text-teal-600 mt-0.5 flex-shrink-0">•</span> Look for: charges listed, next hearing date, case status, and the name of the assigned judge</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status guide */}
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground mb-3">What common case statuses mean</p>
              <dl className="space-y-2.5">
                {[
                  { status: "Pending / Active", meaning: "Charges have been filed. The case is open and working through the court process." },
                  { status: "Arraigned", meaning: "The defendant has appeared in court and entered a plea. Pretrial proceedings are next." },
                  { status: "Pretrial / Scheduling", meaning: "The case is in the period between arraignment and trial. Hearings may be scheduled." },
                  { status: "Warrant Issued", meaning: "A judge has issued a warrant — often for failing to appear in court. This needs immediate attention. Contact an attorney today." },
                  { status: "Disposed / Closed", meaning: "The case has concluded. This could mean acquittal, conviction, dismissal, or a plea agreement." },
                ].map(({ status, meaning }) => (
                  <div key={status} className="toolkit-status">
                    <dt className="font-semibold text-foreground w-40 flex-shrink-0">{status}</dt>
                    <dd className="text-muted-foreground leading-snug">{meaning}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-border p-3 flex items-start gap-2.5 bg-background">
              <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">For a federal court case, search the free RECAP archive on <a href="https://www.courtlistener.com/" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">CourtListener</a> or <a href="https://pacer.gov" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">PACER.gov</a> for the public federal docket. RECAP coverage is incomplete. Immigration court proceedings use a separate system.</p>
            </div>
          </div>
        </section>

        {/* ── TOOL 3: Certified Mail Checklist ─────────────────────────────── */}
        <section id="certified-mail" hidden={activeTool !== "certified-mail"} className="toolkit-panel">

            <div className="flex items-center gap-3 mb-1">

              <h2 tabIndex={-1} className="text-xl font-bold text-foreground">Certified Mail Checklist</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Certified mail can document mailing and delivery. Follow the recipient’s rules for filing or notice; a mailing receipt does not certify a document.</p>


          <Alert className="border-blue-200 bg-blue-50/60 dark:bg-blue-900/10 dark:border-blue-800/60 mb-5">
            <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
              <strong>How to send certified mail:</strong> At any USPS post office, ask for "certified mail with return receipt." Keep the mailing receipt and any delivery confirmation. Postage, certified mail and an optional paper or electronic return receipt have separate fees. Check current USPS prices.
            </AlertDescription>
          </Alert>

          <div className="space-y-5">
            {[
              { title: "This week", items: mailItems.thisWeek, urgency: "text-red-700 dark:text-red-400", bg: "bg-red-50/60 dark:bg-red-900/10 border-red-200 dark:border-red-800/60" },
              { title: "Before the next court date", items: mailItems.beforeCourt, urgency: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/60" },
              { title: "Ongoing", items: mailItems.ongoing, urgency: "text-slate-600 dark:text-slate-400", bg: "bg-muted/30 border-border" },
            ].map(({ title, items, urgency, bg }) => (
              <div key={title}>
                <p className="toolkit-check-heading">{title}</p>
                <div className="toolkit-check-list">
                  {items.map(({ id, label, detail }) => (
                    <label key={id} className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors">
                      <input
                        type="checkbox"
                        className="toolkit-checkbox"
                        checked={!!checked[id]}
                        onChange={() => toggleCheck(id)}
                        aria-label={label}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-snug ${checked[id] ? "line-through text-muted-foreground" : "text-foreground"}`}>{label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{detail}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <Button onClick={()=>handlePrint("certified-mail")}  variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print this checklist
            </Button>
          </div>
        </section>

        {/* ── TOOL 4: Change-of-Address Guide ──────────────────────────────── */}
        <section id="address-guide" hidden={activeTool !== "address-guide"} className="toolkit-panel">

            <div className="flex items-center gap-3 mb-1">

              <h2 tabIndex={-1} className="text-xl font-bold text-foreground">Change-of-Address Guide</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-5">What needs to be updated, who to contact, and how long you have. Address each category in timeline order.</p>


          <Accordion type="multiple" className="w-full space-y-2">
            {addressGuide.map(({ category, icon: Icon, items }) => (
              <AccordionItem key={category} value={category} className="toolkit-address-group">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-semibold text-base text-left">{category}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3">
                    {items.map(({ label, url, timeline, detail }) => (
                      <div key={label} className="toolkit-address-item">
                        <div className="toolkit-address-heading">
                          <p className="text-sm font-semibold text-foreground leading-snug">{label}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="toolkit-timing">{timeline}</span>
                            {url && (
                              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors" aria-label={`Visit ${label}`}>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-5">
            <Button onClick={()=>handlePrint("address-guide")}  variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print this guide
            </Button>
          </div>
        </section>

</div></div><div className="toolkit-bottom toolkit-width print:hidden">
        {/* Bottom nav */}
        <div className="border-t border-border pt-6 flex items-center justify-between">
          <Link href="/friends-family">
            <span>
              <ChevronLeft className="h-4 w-4" />
              Back to Family Guide
            </span>
          </Link>
          <Link href="/support">
            <span>
              Life Support Resources →
            </span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ── Small reusable components ─────────────────────────────────────────────────

function FieldGroup({ title, icon: Icon, color, children }: {
  title: string; icon: React.ElementType; color: string; children: React.ReactNode;
}) {
  return (<fieldset className="toolkit-fieldset"><legend>{title}</legend><div className="toolkit-fields">{children}</div></fieldset>);
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  const fieldId = useId();
  return (
    <div>
      <label htmlFor={fieldId} className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <input
        id={fieldId}
        autoComplete="off"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label={label}
      />
    </div>
  );
}
