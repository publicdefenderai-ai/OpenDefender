import { Shield, Clock, MessageSquare, Heart, Globe, ChevronRight, ArrowRight, Scale, FileText, BookOpen, Users } from "lucide-react";

// Mini browser-chrome illustration wrapping a styled page preview
function PagePreview({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10" style={{ background: "#1a1a2e" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10" style={{ background: "#12122a" }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 mx-3 py-1 px-3 rounded text-xs text-white/40" style={{ background: "#1e1e3f", fontFamily: "monospace" }}>
          opendefender.org{title}
        </div>
      </div>
      {children}
    </div>
  );
}

// Path card with alternating layout
function PathCard({
  number,
  icon: Icon,
  label,
  headline,
  subhead,
  bullets,
  previewContent,
  flip,
  accentColor,
  bgLight,
}: {
  number: string;
  icon: React.ElementType;
  label: string;
  headline: string;
  subhead: string;
  bullets: string[];
  previewContent: React.ReactNode;
  flip?: boolean;
  accentColor: string;
  bgLight: string;
}) {
  const textSide = (
    <div className="flex-1 flex flex-col justify-center py-6 px-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: accentColor }}>
          {number}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ background: bgLight, color: accentColor }}>
          <Icon className="w-3.5 h-3.5" />
          {label}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-3">{headline}</h2>
      <p className="text-slate-500 text-base leading-relaxed mb-6">{subhead}</p>
      <ul className="space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: bgLight }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
            </div>
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all" style={{ background: accentColor }}>
          Open this path <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const previewSide = (
    <div className="flex-1 py-8 px-6">
      {previewContent}
    </div>
  );

  return (
    <div className="flex min-h-[400px] rounded-2xl overflow-hidden border border-slate-100" style={{ background: "#fff" }}>
      {flip ? (
        <>
          {previewSide}
          {textSide}
        </>
      ) : (
        <>
          {textSide}
          {previewSide}
        </>
      )}
    </div>
  );
}

// Styled mini previews of each page
function First24Preview() {
  return (
    <PagePreview title="/first-24-hours" color="#1e3a5f">
      <div style={{ background: "#1e3a5f" }} className="px-5 py-4">
        <div className="text-white/50 text-xs uppercase tracking-wider mb-1">BEGIN YOUR DEFENSE HERE</div>
        <div className="text-white text-xl font-bold mb-1">Your First 24 Hours</div>
        <div className="text-white/60 text-xs">From arrest through your first court appearance</div>
      </div>
      <div className="px-5 py-3 space-y-2" style={{ background: "#f8f9fc" }}>
        {[
          { step: "1", label: "At the Moment of Arrest", tag: "Immediately", color: "#e74c3c" },
          { step: "2", label: "Booking & Processing", tag: "1-4 hours", color: "#e67e22" },
          { step: "3", label: "Your Phone Call Rights", tag: "Right away", color: "#f39c12" },
          { step: "4", label: "Bail & Release Options", tag: "1-24 hours", color: "#27ae60" },
        ].map(({ step, label, tag, color }) => (
          <div key={step} className="flex items-center gap-3 p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: color }}>
              {step}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate">{label}</div>
            </div>
            <div className="text-xs text-slate-400 flex-shrink-0">{tag}</div>
          </div>
        ))}
        <div className="text-center text-xs text-slate-400 py-1">+ 3 more steps</div>
      </div>
    </PagePreview>
  );
}

function GuidancePreview() {
  return (
    <PagePreview title="/chat" color="#0f766e">
      <div className="px-4 py-3 border-b border-slate-100" style={{ background: "#fff" }}>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <div className="w-2 h-2 rounded-full bg-blue-500 text-xs" />
          Step 1 of 5 — Safety Check
        </div>
        <div className="flex gap-1 mt-2">
          {["Safety", "Location", "Charges", "Situation", "Details"].map((s, i) => (
            <div key={s} className={`flex-1 text-center py-1 rounded text-xs font-medium ${i === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 space-y-3" style={{ background: "#f8f9fc" }}>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
          <div className="text-xs text-slate-600 leading-relaxed">
            Hi! I'm an AI assistant here to help you understand your legal situation. Everything we discuss stays private and is deleted after your session.
          </div>
          <div className="text-xs font-medium text-slate-700 mt-2">Are you in an urgent situation right now?</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="py-2 rounded-lg text-center text-xs font-medium text-red-700 bg-red-50 border border-red-200">Yes, help now</div>
          <div className="py-2 rounded-lg text-center text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200">No, time to talk</div>
        </div>
        <div className="text-center text-xs text-slate-400">Your information is private and deleted after your session</div>
      </div>
    </PagePreview>
  );
}

function SupportPreview() {
  return (
    <PagePreview title="/support" color="#8b2252">
      <div style={{ background: "#8b2252" }} className="px-5 py-4">
        <div className="text-white text-lg font-bold mb-1">Support Resources</div>
        <div className="text-white/70 text-xs leading-relaxed">Facing legal challenges affects every part of your life</div>
      </div>
      <div className="px-4 py-3 space-y-2" style={{ background: "#f8f9fc" }}>
        <div className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-rose-50 rounded text-xs flex items-center justify-center">📞</div>
            <div>
              <div className="text-xs font-semibold text-slate-700">Not sure where to start?</div>
              <div className="text-xs text-blue-600">Call or text 211</div>
            </div>
          </div>
        </div>
        {[
          { icon: "💼", label: "Employment Help", sub: "Know your rights at work" },
          { icon: "💰", label: "Financial Assistance", sub: "Bail funds, emergency aid" },
          { icon: "🧠", label: "Mental Health Support", sub: "Free counseling resources" },
          { icon: "🏠", label: "Housing Stability", sub: "Eviction prevention help" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="p-2.5 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-rose-50 rounded text-xs flex items-center justify-center">{icon}</div>
              <div>
                <div className="text-xs font-semibold text-slate-700">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300" />
          </div>
        ))}
      </div>
    </PagePreview>
  );
}

// Flow timeline
function ExampleFlow() {
  const steps = [
    {
      time: "Day 0",
      path: "First 24 Hours",
      color: "#1e3a5f",
      bg: "#eef2f8",
      icon: Clock,
      action: "Maria is arrested. She opens First 24 Hours on her husband's phone.",
      detail: "Reads Step 1: stays silent, asks for a lawyer. Understands booking will take 2-4 hours.",
    },
    {
      time: "Day 1",
      path: "Personalized Guidance",
      color: "#0f766e",
      bg: "#eef9f8",
      icon: MessageSquare,
      action: "Released on bail. Maria uses Case Guidance to understand the DUI charge.",
      detail: "AI explains the charge, penalties, and that first-offense diversion may be available in her state.",
    },
    {
      time: "Week 1",
      path: "Life Support",
      color: "#8b2252",
      bg: "#f8eef3",
      icon: Heart,
      action: "Maria is worried about losing her job and paying rent while her case is pending.",
      detail: "Support Hub connects her to an employment rights clinic and emergency rental assistance.",
    },
    {
      time: "Month 2",
      path: "Personalized Guidance",
      color: "#0f766e",
      bg: "#eef9f8",
      icon: MessageSquare,
      action: "Court date approaching. Maria asks about what to expect at arraignment.",
      detail: "Guidance walks through the timeline, plea options, and how to talk to her public defender.",
    },
  ];

  return (
    <div className="py-12 px-8" style={{ background: "#f8f9fc" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 mb-4">
            Example Journey
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">See how the paths work together</h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            Most people use more than one path. Here is how Maria used OpenDefender through a DUI case.
          </p>
        </div>
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-slate-200" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 relative">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-20 text-right">
                    <span className="text-xs font-bold text-slate-400">{step.time}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm" style={{ background: step.color }}>
                  <step.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: step.bg, color: step.color }}>
                      {step.path}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">{step.action}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Immigration standalone question section
function ImmigrationSection() {
  return (
    <div className="py-10 px-8" style={{ background: "#fff" }}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border-2 border-dashed border-amber-300 p-8" style={{ background: "#fffbf0" }}>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#f59e0b" }}>
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 uppercase tracking-wider">
                  Open Question
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Should Immigration be a 4th standalone path?</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Immigration issues have a completely different legal system, timeline, and urgency than criminal cases. Users facing deportation, visa questions, or mixed-status family concerns may benefit from a dedicated path rather than finding immigration guidance buried under "Get Help."
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl p-4 bg-white border border-slate-100">
                  <div className="font-semibold text-slate-700 mb-2">Arguments for a 4th path</div>
                  <ul className="space-y-1.5 text-slate-500 text-xs">
                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">+</span>Different urgency — deportation can happen fast</li>
                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">+</span>Distinct audience (mixed-status families, visa holders)</li>
                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">+</span>Already has dedicated nav entry and guidance page</li>
                    <li className="flex gap-2"><span className="text-green-500 flex-shrink-0">+</span>Reduces cognitive load for a frightened user</li>
                  </ul>
                </div>
                <div className="rounded-xl p-4 bg-white border border-slate-100">
                  <div className="font-semibold text-slate-700 mb-2">Arguments to keep as-is</div>
                  <ul className="space-y-1.5 text-slate-500 text-xs">
                    <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">-</span>Many users have both criminal and immigration issues</li>
                    <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">-</span>4 paths risks overwhelming the page hero</li>
                    <li className="flex gap-2"><span className="text-red-400 flex-shrink-0">-</span>Could be a sub-path under "Get Help" with higher prominence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full site inventory
function SiteInventory() {
  const categories = [
    {
      icon: MessageSquare,
      title: "Get Help",
      color: "#0f766e",
      bg: "#eef9f8",
      links: [
        { label: "Case Guidance (AI)", url: "/case-guidance" },
        { label: "AI Chat", url: "/chat" },
        { label: "Document Summarizer", url: "/document-summarizer" },
        { label: "Immigration Guidance", url: "/immigration-guidance" },
        { label: "First 24 Hours", url: "/first-24-hours" },
      ],
    },
    {
      icon: Scale,
      title: "Know Your Rights",
      color: "#1e3a5f",
      bg: "#eef2f8",
      links: [
        { label: "Constitutional Rights", url: "/rights-info" },
        { label: "Case Timeline", url: "/case-timeline" },
        { label: "Quick Reference Cards", url: "/quick-reference" },
        { label: "Search & Seizure", url: "/search-seizure" },
        { label: "Friends & Family Guide", url: "/friends-family" },
        { label: "Collateral Consequences", url: "/collateral-consequences" },
        { label: "Mock Q&A Practice", url: "/resources" },
      ],
    },
    {
      icon: Users,
      title: "Find Resources",
      color: "#5b21b6",
      bg: "#f3effe",
      links: [
        { label: "Public Defenders", url: "/legal-aid" },
        { label: "Legal Aid Organizations", url: "/legal-aid" },
        { label: "Diversion Programs (111)", url: "/diversion-programs" },
        { label: "Record Expungement", url: "/record-expungement" },
      ],
    },
    {
      icon: Heart,
      title: "Life Support",
      color: "#8b2252",
      bg: "#f8eef3",
      links: [
        { label: "Support Hub", url: "/support" },
        { label: "Employment", url: "/support/employment" },
        { label: "Finances", url: "/support/finances" },
        { label: "Mental Health", url: "/support/mental-health" },
        { label: "Transportation", url: "/support/transportation" },
        { label: "Childcare", url: "/support/childcare" },
        { label: "Court Logistics", url: "/support/court-logistics" },
        { label: "Reputation & Background Checks", url: "/support/reputation" },
      ],
    },
    {
      icon: BookOpen,
      title: "Reference & Lookup",
      color: "#374151",
      bg: "#f3f4f6",
      links: [
        { label: "Legal Glossary", url: "/legal-glossary" },
        { label: "Court Locator", url: "/court-locator" },
        { label: "Statute Lookup", url: "/statutes" },
        { label: "Document Library", url: "/document-library" },
        { label: "Court Records", url: "/court-records" },
      ],
    },
    {
      icon: FileText,
      title: "Attorney Tools",
      color: "#92400e",
      bg: "#fef3e2",
      links: [
        { label: "Attorney Portal", url: "/attorney" },
        { label: "Document Generation (25+ templates)", url: "/attorney" },
      ],
    },
  ];

  return (
    <div className="py-12 px-8" style={{ background: "#f8f9fc" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Full Site Directory</h2>
          <p className="text-slate-500 text-sm">Every page on OpenDefender, organized by what you need</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.title} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100" style={{ background: cat.bg }}>
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: cat.color }}>
                  <cat.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.title}</span>
              </div>
              <div className="p-3 space-y-1">
                {cat.links.map((link) => (
                  <div key={link.label} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-50 group cursor-pointer">
                    <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors">{link.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowToRevamp() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero */}
      <div className="py-14 px-8 text-center" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Shield className="w-7 h-7 text-blue-300" />
            <span className="text-blue-200 font-semibold text-sm tracking-wide uppercase">OpenDefender</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Where do you want to start?
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-xl mx-auto">
            OpenDefender has three main paths. Most people use more than one. Choose based on where you are right now.
          </p>
        </div>
      </div>

      {/* PATH 1 — First 24 Hours */}
      <div className="py-6 px-8" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <PathCard
            number="1"
            icon={Clock}
            label="Just arrested or recently released"
            headline="First 24 Hours After Arrest"
            subhead="The decisions made in the first day set the course of the entire case. This guide walks you through every step from the moment of arrest to your first court appearance."
            bullets={[
              "7-step guide: arrest, booking, phone calls, bail, counsel, arraignment",
              "State-by-state inmate locator (all 50 states + federal)",
              "Scripts for your one phone call from jail",
              "Know when your right to a lawyer actually begins",
            ]}
            previewContent={<First24Preview />}
            accentColor="#1e3a5f"
            bgLight="#eef2f8"
            flip={false}
          />
        </div>
      </div>

      {/* PATH 2 — Personalized Guidance */}
      <div className="py-6 px-8" style={{ background: "#f8f9fc" }}>
        <div className="max-w-5xl mx-auto">
          <PathCard
            number="2"
            icon={MessageSquare}
            label="Understand your specific situation"
            headline="Personalized Case Guidance"
            subhead="Answer a few questions and get AI-powered guidance tailored to your charges, location, and situation. Private by design — your answers are never stored."
            bullets={[
              "5-step intake: safety check, location, charges, situation, details",
              "Explains your charges in plain language",
              "Identifies diversion programs and plea options in your state",
              "Powered by Claude AI with verified legal accuracy checks",
            ]}
            previewContent={<GuidancePreview />}
            accentColor="#0f766e"
            bgLight="#eef9f8"
            flip={true}
          />
        </div>
      </div>

      {/* PATH 3 — Life Support */}
      <div className="py-6 px-8" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <PathCard
            number="3"
            icon={Heart}
            label="Life doesn't stop while your case is pending"
            headline="Life Support Resources"
            subhead="A legal case touches every part of your life. These resources help with employment, finances, housing, mental health, and more — so you can stay stable while your case moves forward."
            bullets={[
              "Employment rights when facing charges",
              "Emergency financial assistance and bail funds",
              "Free mental health support resources",
              "Housing stability and eviction prevention",
              "Childcare, transportation, and court logistics help",
            ]}
            previewContent={<SupportPreview />}
            accentColor="#8b2252"
            bgLight="#f8eef3"
            flip={false}
          />
        </div>
      </div>

      {/* Example Flow */}
      <ExampleFlow />

      {/* Immigration Question */}
      <ImmigrationSection />

      {/* Site Inventory */}
      <SiteInventory />

      {/* Footer note */}
      <div className="py-6 px-8 text-center" style={{ background: "#1e3a5f" }}>
        <p className="text-blue-200 text-sm">
          All content is free. Your privacy is protected. Available in English, Spanish, and Chinese.
        </p>
      </div>
    </div>
  );
}
