import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import "./advocate-hub.css";

const categories = [
  {
    id: "before-plea",
    label: "Before the plea",
    title: "Before the Plea: Early Intervention",
    intro: "Screen immediate risks and gather information before plea discussions.",
    tools: [
      {
        href: "/for-advocates/intake-checklist",
        title: "First Contact Intake Checklist",
        description: "Prepare for first contact with structured questions and flags for issues needing prompt legal attention."
      },
      {
        href: "/collateral-consequences",
        title: "Arrest-Stage Risk Screener",
        description: "Screen for risks involving housing, work, immigration, benefits, caregiving, supervision, and licensing."
      },
      {
        href: "/support/court-logistics/bail-preparation",
        title: "Bail & Pretrial Release Preparation",
        description: "Gather employment, housing, community, and support information, with letter templates and a printable checklist."
      },
      {
        href: "/diversion-programs",
        title: "Diversion Programs",
        description: "Browse program listings by location and program type. Confirm eligibility, requirements, and outcomes with the program and counsel."
      }
    ]
  },
  {
    id: "life-stabilization",
    label: "Life stabilization",
    title: "Life Stabilization",
    intro: "Connect clients and families with practical support.",
    tools: [
      {
        href: "/support",
        title: "Life & Family Support Hub",
        description: "Find housing, employment, childcare, health, transportation, finances, and reentry resources to share with clients and families."
      },
      {
        href: "/support/court-logistics",
        title: "Court Logistics & Hearing Preparation",
        description: "Prepare for court with practical guidance, hearing checklists, date reminders, and courthouse information."
      },
      {
        href: "/support/mental-health",
        title: "Mental Health & Crisis Resources",
        description: "Find crisis lines, substance use programs, and community mental health resources."
      },
      {
        href: "/immigration-guidance",
        title: "Immigration Guidance",
        description: "Explore rights during enforcement encounters, detainers, and civil immigration resources."
      }
    ]
  },
  {
    id: "reputation",
    label: "Reputation & history",
    title: "Reputation & Social History",
    intro: "Organize a fuller picture of the client and explore record-related resources.",
    tools: [
      {
        href: "/for-advocates/mitigation-builder",
        title: "Mitigation Builder",
        description: "Organize community ties, housing, employment, treatment, family responsibilities, and references into a summary to copy or print."
      },
      {
        href: "/support/reputation/eligibility",
        title: "Expungement Eligibility Screener",
        description: "Explore state-based record clearance information, waiting periods, and exclusions for further legal review."
      },
      {
        href: "/support/reputation#rap-sheet",
        title: "Rap Sheet Review & Error Correction",
        description: "Find guidance on obtaining records, identifying errors, and requesting corrections."
      },
      {
        href: "/support/reputation#certificates-of-relief",
        title: "Certificates of Relief",
        description: "Explore certificates of relief and related resources where these options are available."
      },
      {
        href: "/support/reputation#fcra-rights",
        title: "Background Check Rights (FCRA)",
        description: "Review background-check notices, disputes, and communication templates for employers and landlords."
      }
    ]
  },
  {
    id: "client-education",
    label: "Client education",
    title: "Client Education",
    intro: "Share plain-language guides that help clients understand the process.",
    tools: [
      {
        href: "/first-24-hours",
        title: "First 24 Hours: Arrest to Arraignment",
        description: "Walk clients and families through arrest, booking, bail, access to counsel, and arraignment."
      },
      {
        href: "/case-timeline",
        title: "Full Case Timeline",
        description: "Help clients understand the stages of a criminal case and the decisions along the way."
      },
      {
        href: "/rights-info",
        title: "Know Your Rights",
        description: "Share plain-language resources on police encounters, searches, questioning, and quick-reference cards."
      },
      {
        href: "/friends-family",
        title: "Friends & Family Guide",
        description: "Help supporters locate a detained person and coordinate practical support throughout a case."
      }
    ]
  },
  {
    id: "find-help",
    label: "Find help",
    title: "Find Additional Help",
    intro: "Find organizations that may be able to provide additional assistance.",
    tools: [
      {
        href: "/legal-aid",
        title: "Legal Aid Directory",
        description: "Locate legal aid organizations and other assistance by location and practice area."
      }
    ]
  }
];

export default function ForAdvocates() {
  useScrollToTop();
  return (
    <>
      <Header />
      <div lang="en" className="advocate-hub">
        <header>
          <p>Advocate Hub</p>
          <h1>Tools for your practice</h1>
          <p className="advocate-intro">Resources for public defenders, social workers and case advocates, from the first client meeting through resolution and beyond.</p>
        </header>

        <div className="advocate-featured">
          <article>
            <p>At the first meeting</p>
            <h2>First Contact Intake Checklist</h2>
            <p>Screen for concerns about supervision, immigration, warrants, housing, health and caregiving.</p>
            <Link href="/for-advocates/intake-checklist">Open intake checklist</Link>
          </article>
          <article>
            <p>Prepare a client’s social history</p>
            <h2>Mitigation Builder</h2>
            <p>Bring community ties, treatment, employment and family responsibilities into a structured summary.</p>
            <Link href="/for-advocates/mitigation-builder">Open mitigation builder</Link>
          </article>
        </div>

        <nav aria-label="Resource categories">
          {categories.map(category => <a key={category.id} href={`#${category.id}`}>{category.label}</a>)}
        </nav>
        {categories.map(category => (
          <section className="advocate-category" key={category.id} id={category.id} tabIndex={-1} aria-labelledby={`${category.id}-title`}>
            <header>
              <small>{category.tools.length} {category.tools.length === 1 ? "resource" : "resources"}</small>
              <h2 id={`${category.id}-title`}>{category.title}</h2>
              <p>{category.intro}</p>
            </header>
            <ul className="advocate-tools">
              {category.tools.map(tool => (
                <li key={tool.href}>
                  <h3><Link href={tool.href}>{tool.title}</Link></h3>
                  <p>{tool.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <details className="advocate-planned">
          <summary>In development · 2 tools</summary>
          <ul className="advocate-tools">
            <li><h3>Pretrial Release Arguments</h3><p>Planned resources for bail factors, alternatives to cash bail and release arguments.</p></li>
            <li><h3>Immigration Intersection Screen</h3><p>Planned screening support for immigration consequences that require specialist review.</p></li>
          </ul>
        </details>
        <p className="advocate-mission">OpenDefender is built around the holistic defense model. If you work in public defense, social work or community advocacy, <Link href="/mission-statement">learn more about the project</Link>.</p>
      </div>
      <Footer />
    </>
  );
}
