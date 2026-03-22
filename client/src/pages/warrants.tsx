import { Link } from "wouter";
import {
  FileText,
  Home,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";

const SECTIONS = [
  { id: "at-the-door", label: "Officers at Your Door" },
  { id: "what-is-warrant", label: "What Is a Warrant?" },
  { id: "search-warrants", label: "Search Warrants" },
  { id: "arrest-warrants", label: "Arrest Warrants" },
  { id: "no-warrant-needed", label: "When No Warrant Is Needed" },
  { id: "ice-warrants", label: "ICE vs. Court Warrants" },
  { id: "documented-concerns", label: "Documented Concerns" },
  { id: "what-to-do", label: "What to Do" },
];

function SectionAnchor({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      {children}
    </div>
  );
}

export default function Warrants() {
  useScrollToTop();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Know Your Rights", href: "/rights-info" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb items={breadcrumbItems} currentPage="Warrants & Your Rights" />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Warrants & Your Rights
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            What officers need to enter your home, search your belongings, or arrest you — and what you can do whether they have one or not
          </p>
        </div>
      </section>

      {/* Sticky section nav */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2.5 no-scrollbar">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border flex-shrink-0 transition-colors ${
                  id === "at-the-door"
                    ? "border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    : "border-border hover:bg-muted hover:border-foreground/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-16">

        {/* ── OFFICERS AT YOUR DOOR ────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="at-the-door">
            <h2 className="text-2xl font-bold text-foreground mb-4">If Officers Are at Your Door Right Now</h2>
            <Alert className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 mb-5">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>You do not have to open the door.</strong> Speak through it, and ask to see any warrant before doing anything else.
              </AlertDescription>
            </Alert>
            <Card>
              <CardContent className="p-6">
                <ol className="space-y-4">
                  {[
                    "Do not open the door. You can speak through the door or a window.",
                    'Ask: "Do you have a warrant?" You have the right to ask this.',
                    "If they say yes: ask them to slide it under the door. Read it before doing anything else.",
                    "Check the document: look for a judge's signature and your address. If it is signed by an immigration officer rather than a judge, it does not allow officers to enter your home without your consent.",
                    'If it is a valid judicial warrant: say "I am invoking my right to remain silent" and contact your attorney as soon as possible. Do not physically resist.',
                    'If there is no judicial warrant: say "I do not consent to entry." You can say this calmly through the door.',
                    "After the encounter: write down officer names, badge numbers, what was said, and what documents you saw.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border">
                  See the{" "}
                  <button
                    onClick={() => scrollTo("what-to-do")}
                    className="underline text-blue-600 dark:text-blue-400 hover:text-blue-700"
                  >
                    full What to Do guide
                  </button>{" "}
                  below for other situations, including street stops and arrest warrants.
                </p>
              </CardContent>
            </Card>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── WHAT IS A WARRANT ────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="what-is-warrant">
            <h2 className="text-2xl font-bold text-foreground mb-4">What Is a Warrant?</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A warrant is a legal document signed by a judge that gives officers permission to do one specific thing — search a specific place, or arrest a specific person. Without a warrant, officers generally cannot enter your home or take you into custody unless you give permission or a legal exception applies.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Not every document an officer carries is the same. A document signed by an immigration agency supervisor is very different from one signed by a federal judge. The difference matters, and it is explained in detail in the ICE section below.
                </p>
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-2 pr-4 font-semibold text-foreground">Who signs it</th>
                        <th className="text-left py-2 font-semibold text-foreground">What it allows</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="py-2.5 pr-4 text-foreground font-medium">Search warrant</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">Judge or magistrate</td>
                        <td className="py-2.5 text-muted-foreground">Enter and search a specific place for specific items</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-foreground font-medium">Arrest warrant</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">Judge or magistrate</td>
                        <td className="py-2.5 text-muted-foreground">Arrest a specific named person</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-foreground font-medium">ICE administrative warrant</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">ICE officer (not a court)</td>
                        <td className="py-2.5 text-muted-foreground">Administrative arrest — does <strong>not</strong> authorize entry into a home without consent</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-foreground font-medium">ICE judicial warrant</td>
                        <td className="py-2.5 pr-4 text-muted-foreground">Federal judge or magistrate</td>
                        <td className="py-2.5 text-muted-foreground">Entry into a home for immigration enforcement</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── SEARCH WARRANTS ──────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="search-warrants">
            <h2 className="text-2xl font-bold text-foreground mb-4">Search Warrants</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">What a valid search warrant must include</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {[
                    "A signature from a judge or magistrate — not a supervisor, not an agency head",
                    "The specific address to be searched — not just a general area or building",
                    "A description of what officers are looking for — not a blank permission to search everything",
                    "A date — warrants can be challenged if they are old or stale",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-green-700 dark:text-green-400">What officers can do with one</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      "Enter the named location",
                      "Search the areas described in the warrant",
                      "Seize items listed in the warrant",
                      "Also seize contraband they find in plain view while legally present",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-700 dark:text-red-400">What they cannot do</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[
                      "Search rooms or areas not named in the warrant",
                      "Search for items not described in the warrant",
                      "Use one address's warrant to search a different address",
                      "Expand the search beyond what the warrant specifies",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>How to check a warrant at the door:</strong> Ask officers to slide it under. Look for a judge's signature, your specific address, and a list of what they're looking for. You have the right to read it. You do not have to help officers search, but do not physically interfere.
                </AlertDescription>
              </Alert>
            </div>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── ARREST WARRANTS ──────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="arrest-warrants">
            <h2 className="text-2xl font-bold text-foreground mb-4">Arrest Warrants</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    An arrest warrant gives officers the legal right to arrest the named person. It does <strong className="text-foreground">not</strong> give them the right to search your home.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If officers say they have an arrest warrant for someone else and want to come inside, you do not have to let them in unless they also have a search warrant for your specific address.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If the arrest warrant names you: you will be taken into custody. Do not resist physically. Once arrested, your right to remain silent and your right to an attorney still apply from that moment forward — say clearly that you are invoking both.
                  </p>
                </CardContent>
              </Card>

              <Alert className="border-slate-200 dark:border-slate-700">
                <AlertDescription className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Related:</strong> To understand what happens next after an arrest, see the{" "}
                  <Link href="/first-24-hours" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                    First 24 Hours guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/right-to-counsel" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                    Right to an Attorney guide
                  </Link>.
                </AlertDescription>
              </Alert>
            </div>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── NO WARRANT NEEDED ────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="no-warrant-needed">
            <h2 className="text-2xl font-bold text-foreground mb-2">When Officers Don't Need a Warrant</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Courts have approved certain situations where officers can act without a warrant. These exceptions are real and legal — but they have limits, and officers sometimes claim them more broadly than courts have approved.
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Your consent",
                  description: "You gave officers permission to search or to enter. This is the most common way officers get around the warrant requirement.",
                  limit: "You have the right to refuse. Saying 'I do not consent' is legal and cannot be held against you. Consent obtained through pressure or deception may be challenged in court.",
                },
                {
                  title: "Emergency (exigent circumstances)",
                  description: "Officers face a real emergency — someone is in danger, a suspect is fleeing, or evidence is about to be destroyed.",
                  limit: "The emergency must be genuine and urgent, not invented after the fact. Courts look carefully at whether a real emergency existed.",
                },
                {
                  title: "Plain view",
                  description: "Officers are already legally present and can see contraband without searching for it.",
                  limit: "Officers must already be lawfully present. They cannot trespass to get a 'plain view' of something.",
                },
                {
                  title: "Search during a lawful arrest",
                  description: "When officers make a valid arrest, they can search the person and the area immediately around them for weapons or evidence.",
                  limit: "This does not extend to the whole house or vehicle. It covers the person and what's within arm's reach.",
                },
                {
                  title: "Vehicle searches",
                  description: "Cars have less privacy protection than homes under the law. Officers with probable cause can search a vehicle without a warrant.",
                  limit: "They still need a real reason. A hunch is not enough. The search must relate to that reason.",
                },
                {
                  title: "Brief investigative stop (Terry stop)",
                  description: "Officers with reasonable suspicion may briefly stop and question you, and may pat you down for weapons.",
                  limit: "A pat-down is for weapons only, not a full search. 'Reasonable suspicion' must be based on specific facts, not a general feeling.",
                },
              ].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">The limit: </span>
                        {item.limit}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              Knowing these exceptions matters: if officers claim one, you can clearly state that you do not consent. You may not be able to stop the search in the moment — but your objection on record gives your attorney something to work with.
            </p>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── ICE WARRANTS ─────────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="ice-warrants">
            <h2 className="text-2xl font-bold text-foreground mb-2">ICE Warrants vs. Court Warrants</h2>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              This distinction is critical for anyone who may have contact with immigration enforcement.
            </p>

            <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 mb-5">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                <strong>An ICE administrative warrant is not a court order.</strong> It does not give officers the legal right to enter your home without your consent.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <Card className="border-red-200 dark:border-red-900">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-xs mb-1">Administrative Warrant</Badge>
                  <CardTitle className="text-sm">Form I-200 or I-205</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Signed by an ICE officer, not a court</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Does not authorize entry into a home without consent</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>This is the document ICE most commonly carries</span>
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-xs font-medium text-foreground mb-1">How to identify it:</p>
                    <p className="text-xs text-muted-foreground">The top reads "U.S. Department of Homeland Security" and is signed by a "Deportation Officer" or "Immigration Enforcement Agent" — not a judge.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-900">
                <CardHeader className="pb-3">
                  <Badge className="w-fit bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0 text-xs mb-1">Judicial Warrant</Badge>
                  <CardTitle className="text-sm">Issued by a Federal Court</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Signed by a U.S. District Court judge or magistrate</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Does authorize entry into a home</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Much rarer in immigration enforcement</span>
                  </div>
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <p className="text-xs font-medium text-foreground mb-1">How to identify it:</p>
                    <p className="text-xs text-muted-foreground">The document will be on federal court letterhead and signed by a judge, referencing a specific federal court (e.g., "United States District Court for the __ District").</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Your rights apply regardless of immigration status</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Fourth Amendment protects all people in the United States from unlawful searches and seizures — not just citizens. Your right to refuse warrantless entry into your home applies whether you are a citizen, a permanent resident, an undocumented person, or a visitor.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You also have the right to remain silent. You are not required to answer questions about your immigration status, your country of origin, or how you entered the country.
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              For ICE encounter scripts, scenario guides, and printable red cards, see the{" "}
              <Link href="/immigration-guidance/know-your-rights" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                Immigration Know Your Rights
              </Link>{" "}
              page and the{" "}
              <Link href="/immigration-guidance/raids-toolkit" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                Raids Preparedness Toolkit
              </Link>.
            </p>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── DOCUMENTED CONCERNS ──────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="documented-concerns">
            <h2 className="text-2xl font-bold text-foreground mb-2">Documented Concerns</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Courts, legal organizations, and government oversight bodies have documented situations where enforcement practices did not follow standard warrant requirements. This section describes what has been found — not to suggest that every officer behaves this way, but so you know what to watch for and how to respond if it happens to you.
            </p>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Administrative warrants used to enter homes</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Multiple federal courts have ruled that an ICE administrative warrant (Form I-200 or I-205) does not satisfy the Fourth Amendment's requirement for a judicial warrant to enter a home. The ACLU and National Immigration Law Center have documented cases where officers entered homes presenting only administrative documents — without consent and without a court-issued warrant.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Consent obtained under pressure</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Courts have recognized that consent may not be truly voluntary when it is obtained under coercion, fear, or when residents do not understand they have the right to refuse. The Vera Institute of Justice and ACLU have documented patterns of officers obtaining "consent" from people who did not know they could say no — including situations where officers were already positioned at all exits of a home or building before asking.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Knock-and-announce requirements</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Even when officers have a valid judicial warrant, they are generally required to knock, announce their presence, and give occupants a brief moment to respond before forcing entry. Legal organization reports and lawsuits have documented instances in both criminal and immigration enforcement where this requirement was not followed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">The 100-mile border zone</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    U.S. Customs and Border Protection (CBP) has broader legal authority within 100 miles of any U.S. border or coastline — an area that includes most of the country's largest cities, including New York, Los Angeles, Chicago, Houston, and Miami. Within this zone, CBP can stop people at fixed checkpoints and question them about citizenship without the same warrant requirements that apply elsewhere. The ACLU has published extensive documentation of stops and searches that residents report went beyond what the law allows.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Expedited removal</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Federal immigration law allows for expedited removal — deportation without a court hearing — for people who cannot show they have been continuously present in the United States for at least two years. This process operates outside the normal judicial warrant framework. The scope of who is subject to expedited removal has changed through policy shifts over time. Consult an immigration attorney to understand the current rules.
                  </p>
                </CardContent>
              </Card>

              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>If you believe your rights were violated:</strong> Document everything — who was there, what was said, what documents were shown — and tell your attorney as soon as possible. A warrantless or non-consensual home entry may be grounds to suppress evidence or bring other legal challenges. The ACLU and NILC also have resources for people who want to report rights violations.
                </AlertDescription>
              </Alert>
            </div>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── WHAT TO DO ───────────────────────────────────────── */}
        <ScrollReveal>
          <SectionAnchor id="what-to-do">
            <h2 className="text-2xl font-bold text-foreground mb-6">What to Do</h2>
            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">If officers come to your home</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {[
                      "Do not open the door. Speak through it.",
                      'Ask: "Do you have a warrant?"',
                      "Ask them to slide the warrant under the door. Look for a judge's signature and your address.",
                      "If it is a valid judicial warrant: they may enter. Stay calm, say you are invoking your right to remain silent, and call your attorney as soon as possible.",
                      'If there is no judicial warrant, or officers have an ICE administrative form only: say "I do not consent to entry."',
                      "Do not physically resist, even if entry is forced. Contest it in court afterward — your stated non-consent is your record.",
                      "Write down everything as soon as it is safe: names, badge numbers, what was said, and what documents you saw.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">If you are stopped on the street</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {[
                      'Ask: "Am I free to go?" If the answer is yes, you may leave.',
                      "If no: you are being detained. Stay calm. Do not run.",
                      'Say: "I am invoking my right to remain silent."',
                      "Officers may pat you down for weapons during a lawful stop. This is not a full search. Say 'I do not consent to a search' regardless — your objection matters even if they proceed.",
                      "You do not have to answer questions about where you are going, where you have been, or your immigration status.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">If officers have an arrest warrant for you</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {[
                      "Do not resist. Resisting arrest creates additional criminal exposure and physical danger.",
                      'Say clearly: "I am invoking my right to remain silent and my right to an attorney."',
                      "Do not answer any questions beyond your name. You can say: 'I will not answer questions without a lawyer present.'",
                      "Contact your attorney as soon as you are allowed to make a phone call.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Alert className="border-slate-200 dark:border-slate-700">
                <AlertDescription className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Always, in every situation:</strong> Write down what happened as soon as it is safe to do so — officer names, badge numbers, what they said, what documents they showed, and any witnesses. Your memory will fade. A written account is something your attorney can use.
                </AlertDescription>
              </Alert>
            </div>
          </SectionAnchor>
        </ScrollReveal>

        {/* ── RELATED GUIDES ───────────────────────────────────── */}
        <ScrollReveal>
          <div className="border-t border-border pt-10">
            <h2 className="text-lg font-semibold mb-3">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { href: "/search-seizure", title: "Search & Seizure Rights" },
                { href: "/right-to-counsel", title: "Right to an Attorney" },
                { href: "/rights-info", title: "Know Your Rights" },
                { href: "/immigration-guidance/know-your-rights", title: "ICE Encounter Rights" },
                { href: "/immigration-guidance/raids-toolkit", title: "Raids Preparedness Toolkit" },
                { href: "/first-24-hours", title: "Your First 24 Hours" },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-border/60 hover:border-border hover:bg-muted/30 transition-colors cursor-pointer">
                    <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ── DISCLAIMER ───────────────────────────────────────── */}
        <ScrollReveal>
          <Alert className="border-slate-200 dark:border-slate-700">
            <AlertDescription className="text-muted-foreground text-sm">
              This page provides general legal information, not legal advice. Warrant law is highly fact-specific and varies by jurisdiction. If you believe your rights were violated, consult a licensed criminal defense or immigration attorney about your specific situation.
            </AlertDescription>
          </Alert>
        </ScrollReveal>

      </main>

      <Footer />
    </div>
  );
}
