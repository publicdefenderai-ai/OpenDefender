import { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  ClipboardList,
  Phone,
  Banknote,
  Scale,
  Landmark,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Users,
  BookOpen,
  ExternalLink,
  MapPin,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
} from "lucide-react";

const steps = [
  {
    id: 1,
    icon: ShieldAlert,
    title: "Arrest",
    short: "Know your rights the moment you're detained.",
    duration: "0–30 min",
    color: "text-red-400",
    bg: "bg-red-950/40",
    border: "border-red-800/50",
    content: {
      rights: [
        "You have the right to remain silent — use it.",
        "You must provide your name in most states (stop-and-identify laws).",
        "Do not consent to searches, but do not physically resist.",
        "Ask calmly: \"Am I free to go?\" — if yes, walk away slowly.",
      ],
      warning: "Everything you say CAN and WILL be used against you in court. Stay silent until you have an attorney.",
      tip: "Officers may tell you that \"cooperating\" will help. It rarely does. The only safe thing to say is: \"I am exercising my right to remain silent. I want a lawyer.\"",
    },
  },
  {
    id: 2,
    icon: ClipboardList,
    title: "Booking",
    short: "What happens at the jail or police station.",
    duration: "30 min–3 hrs",
    color: "text-orange-400",
    bg: "bg-orange-950/40",
    border: "border-orange-800/50",
    content: {
      rights: [
        "You will be photographed and fingerprinted.",
        "Your belongings will be inventoried and held.",
        "You will be told the charges against you.",
        "You are entitled to make at least one phone call.",
      ],
      warning: "Jail phone calls are recorded. Never discuss your case on a jail phone — only exception is calls to a licensed attorney.",
      tip: "Memorize two numbers before going out: a trusted person who can find you a lawyer, and a bail bondsman if you know one.",
    },
  },
  {
    id: 3,
    icon: Phone,
    title: "Your Phone Call",
    short: "How to use your one call wisely.",
    duration: "At booking",
    color: "text-yellow-400",
    bg: "bg-yellow-950/40",
    border: "border-yellow-800/50",
    content: {
      rights: [
        "In most states, you get at least one phone call within a few hours of arrest.",
        "California law: 3 completed calls within 3 hours.",
        "Use your call to reach a lawyer, family member, or bail bondsman.",
        "If calling a family member, give them: your full name, the jail name, and the charges.",
      ],
      warning: "The jail phone is monitored. Do not say anything about the incident, the evidence, or anyone else involved. Just coordinate your release.",
      tip: "What to say on a jail call: \"I've been arrested at [jail name]. The charges are [X]. I need you to contact a lawyer and find out about bail. Do not discuss anything else on this call.\"",
    },
  },
  {
    id: 4,
    icon: Banknote,
    title: "Bail",
    short: "How to get released before trial.",
    duration: "2–24 hrs",
    color: "text-green-400",
    bg: "bg-green-950/40",
    border: "border-green-800/50",
    content: {
      rights: [
        "Bail is money deposited to ensure you appear at future court dates.",
        "A judge sets bail at a bail hearing — typically within 24–48 hours of arrest.",
        "You can post cash bail (full amount) or use a bondsman (10% fee, non-refundable).",
        "If you can't afford bail, your lawyer can request a bail reduction.",
      ],
      warning: "If released on bail, follow every condition: attend all hearings, comply with any no-contact orders, and report to a pretrial services officer if required.",
      tip: "Own-recognizance (OR) release means the judge lets you go without bail — just your promise to appear. Your lawyer can argue for this if you have strong community ties.",
    },
  },
  {
    id: 5,
    icon: Scale,
    title: "Right to Counsel",
    short: "When your right to a lawyer actually begins.",
    duration: "Before questioning",
    color: "text-blue-400",
    bg: "bg-blue-950/40",
    border: "border-blue-800/50",
    content: {
      rights: [
        "6th Amendment: You have the right to an attorney at all \"critical stages\" (after formal charges).",
        "5th Amendment (Miranda): You can refuse to answer questions without an attorney present — even before charges.",
        "If you cannot afford an attorney, the court must appoint one at no cost.",
        "You can invoke this right at any time by saying: \"I want a lawyer.\"",
      ],
      warning: "Once you say \"I want a lawyer,\" police must stop questioning immediately. If they continue, any answers may be suppressed. Do not keep talking after invoking — stay silent.",
      tip: "Ask specifically for a public defender at your first appearance. Don't assume one will be assigned automatically — request one.",
    },
  },
  {
    id: 6,
    icon: Landmark,
    title: "Arraignment",
    short: "Your first court appearance — what to expect.",
    duration: "24–72 hrs after arrest",
    color: "text-purple-400",
    bg: "bg-purple-950/40",
    border: "border-purple-800/50",
    content: {
      rights: [
        "The judge will read the formal charges against you.",
        "You enter a plea: Not Guilty, Guilty, or No Contest.",
        "Bail may be revisited if not set at booking.",
        "You will be given future court dates.",
      ],
      warning: "In nearly all cases, plead NOT GUILTY at arraignment — even if you plan to take a deal later. Pleading guilty at arraignment gives up your bargaining power entirely.",
      tip: "An arraignment typically takes 5–15 minutes. The judge is not deciding your case here — this is just a procedural step. Your lawyer does most of the talking.",
    },
  },
  {
    id: 7,
    icon: CalendarCheck,
    title: "After Arraignment",
    short: "The road ahead: hearings, motions, and your case.",
    duration: "Days to months",
    color: "text-indigo-400",
    bg: "bg-indigo-950/40",
    border: "border-indigo-800/50",
    content: {
      rights: [
        "Your case enters the pretrial phase: discovery, motions, plea negotiations.",
        "You have the right to review all evidence the prosecution intends to use.",
        "You can file motions to suppress illegally obtained evidence.",
        "You have a constitutional right to a speedy trial.",
      ],
      warning: "Do not discuss your case on social media, with friends, or with family in ways that could be subpoenaed. Only communications with your attorney are protected.",
      tip: "Keep a dated journal of everything you remember about the arrest — write it down while it's fresh. This helps your attorney spot procedural errors that could help your case.",
    },
  },
];

function StepCard({
  step,
  isOpen,
  onToggle,
}: {
  step: (typeof steps)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;
  return (
    <div
      id={`step-${step.id}`}
      className={`rounded-xl border ${step.border} ${step.bg} overflow-hidden transition-all duration-300`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:opacity-90 transition-opacity"
        aria-expanded={isOpen}
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${step.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Step {step.id}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-slate-400">{step.duration}</span>
          </div>
          <h3 className="text-white font-bold text-lg leading-snug">{step.title}</h3>
          <p className="text-slate-300 text-sm mt-0.5">{step.short}</p>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-6 space-y-4 border-t border-slate-700/50">
          <ul className="mt-4 space-y-2">
            {step.content.rights.map((right, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
                <span>{right}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 rounded-lg bg-red-950/60 border border-red-800/50 p-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
            <p className="text-sm text-red-200">{step.content.warning}</p>
          </div>
          <div className="flex gap-3 rounded-lg bg-slate-800/60 border border-slate-600/50 p-4">
            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <p className="text-sm text-slate-300">
              <span className="text-amber-400 font-semibold">Tip: </span>
              {step.content.tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  activeStep,
  openStep,
}: {
  activeStep: number;
  openStep: (n: number) => void;
}) {
  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-6 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">
          Jump to step
        </p>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                openStep(step.id);
                document
                  .getElementById(`step-${step.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                isActive
                  ? "bg-blue-900/60 border border-blue-700/60 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? step.color : "text-slate-500"}`}
              />
              <span className="text-sm font-medium truncate">{step.title}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-700/60">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">
            Quick help
          </p>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Find a lawyer</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Get AI guidance</span>
          </a>
          <div className="mt-3 pt-3 border-t border-slate-700/40">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-2">
              For family & friends
            </p>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
            >
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Locate the facility</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Family guide</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcesCard() {
  const resources = [
    {
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-950/50 border-blue-800/50",
      title: "Free Legal Aid",
      desc: "Find a public defender or legal aid organization near you — all 50 states.",
      link: "Browse legal aid →",
    },
    {
      icon: MapPin,
      color: "text-emerald-400",
      bg: "bg-emerald-950/50 border-emerald-800/50",
      title: "Find Your Facility",
      desc: "Locate an arrested person in any county jail or state prison across the US.",
      link: "Use the locator →",
    },
    {
      icon: FileText,
      color: "text-amber-400",
      bg: "bg-amber-950/50 border-amber-800/50",
      title: "Print Rights Card",
      desc: "A pocket-sized reference card of your rights during a police encounter.",
      link: "Download PDF →",
    },
    {
      icon: BookOpen,
      color: "text-purple-400",
      bg: "bg-purple-950/50 border-purple-800/50",
      title: "Case Timeline",
      desc: "What happens after arraignment — bail hearings, motions, trial, and sentencing.",
      link: "View timeline →",
    },
  ];

  return (
    <div className="mt-12 rounded-2xl border border-slate-700/60 bg-slate-900/70 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-700/60">
        <h2 className="text-lg font-bold text-white">Resources & Next Steps</h2>
        <p className="text-sm text-slate-400 mt-1">
          Everything you need — in one place. No searching required.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/40">
        {resources.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={i}
              className={`p-5 flex gap-4 hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                i >= 2 ? "border-t border-slate-700/40" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl ${r.bg} border flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${r.color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium mt-2 ${r.color} group-hover:underline`}
                >
                  {r.link} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Redesign() {
  const [openStepId, setOpenStepId] = useState<number>(1);

  const toggleStep = (id: number) => {
    setOpenStepId((prev) => (prev === id ? -1 : id));
  };

  const openStep = (id: number) => {
    setOpenStepId(id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Fake nav bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">OpenDefender</span>
        </div>
        <div className="hidden md:flex items-center gap-5 ml-6 text-sm text-slate-400">
          <span className="text-blue-400 font-medium">First 24 Hours</span>
          <span>Case Timeline</span>
          <span>Your Rights</span>
          <span>Find a Lawyer</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500">EN</span>
          <span className="text-xs text-slate-500">ES</span>
          <span className="text-xs text-slate-500">中文</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-amber-400/40" />
            <span className="text-amber-200 text-xs font-semibold uppercase tracking-[0.18em]">
              Begin Your Defense Here
            </span>
            <div className="h-px w-12 bg-amber-400/40" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Your First 24 Hours
            <br />
            <span className="text-blue-400">After an Arrest</span>
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            A plain-language guide to every stage — from the moment of arrest through
            your first court appearance. Know your rights. Know what to do next.
          </p>

          {/* Step pills — mobile quick nav */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:hidden">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    openStep(step.id);
                    document
                      .getElementById(`step-${step.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <Icon className={`w-3 h-3 ${step.color}`} />
                  {step.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex gap-10">
          {/* Sticky sidebar */}
          <Sidebar activeStep={openStepId} openStep={openStep} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-slate-700/60" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Your 7-Step Guide
              </span>
              <div className="h-px flex-1 bg-slate-700/60" />
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {steps.map((step) => (
                <StepCard
                  key={step.id}
                  step={step}
                  isOpen={openStepId === step.id}
                  onToggle={() => toggleStep(step.id)}
                />
              ))}
            </div>

            {/* Friends & Family callout */}
            <div className="mt-8 rounded-xl border border-teal-700/50 bg-teal-950/40 overflow-hidden">
              <div className="flex gap-4 p-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-900/70 border border-teal-700/60 flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-bold text-base">For Friends &amp; Family</h3>
                  <p className="text-sm text-teal-200/80 mt-1">
                    If someone you love has been arrested, the first steps are finding where they're being held and getting them a lawyer. You don't need to navigate this alone.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900/70 border border-teal-700/60 text-sm text-teal-200 hover:bg-teal-800/70 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Inmate locator — all 50 states
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900/70 border border-teal-700/60 text-sm text-teal-200 hover:bg-teal-800/70 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Full friends &amp; family guide
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources card */}
            <ResourcesCard />

            {/* Footer nudge */}
            <p className="mt-8 text-center text-xs text-slate-500">
              This guide covers general U.S. law. State-specific rules vary — your attorney can clarify local procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
