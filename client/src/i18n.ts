import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translation: {
          "header": {
            "title": "Public Defender AI",
            "subtitle": "Free Legal Guidance & Rights Information",
            "menu": {
              "getHelp": "Get Help",
              "getHelpDesc": "Chat with our AI for personalized legal guidance",
              "knowRights": "Know Your Rights",
              "knowRightsDesc": "Learn about your constitutional protections",
              "documentLibrary": "Document Library",
              "documentLibraryDesc": "Understand the legal documents in your case",
              "findResources": "Find Resources",
              "findResourcesDesc": "Locate courts, public defenders, and legal aid"
            },
            "language": "Language",
            "theme": "Theme",
            "darkMode": "Dark Mode",
            "lightMode": "Light Mode"
          },
          "home": {
            "hero": {
              "title1": "Know Your Rights.",
              "title2": "Protect Your Future.",
              "subtitle": "Get free legal guidance, understand court processes, and access resources to help navigate the criminal justice system.",
              "urgentHelpButton": "URGENT HELP NEEDED",
              "getStartedButton": "GET STARTED",
              "navigatingToolButton": "Navigating This Tool",
              "urgentHelpNotice": "If you're being arrested or are in court now, click \"Urgent Help Needed\" for immediate guidance."
            },
            "features": {
              "title": "Powered by Real Legal Data",
              "subtitle": "Our AI agent uses comprehensive legal databases and court records to provide accurate, up-to-date information.",
              "federalCourts": "Court Records",
              "federalCourtsDesc": "Access to millions of federal and state court opinions through CourtListener API. RECAP Archive integration for free access to federal court documents (PACER integration pending).",
              "federalCourtsStatus": "Partial Completion",
              "stateLaws": "State & Federal Laws",
              "stateLawsDesc": "Complete 50-state + DC coverage with 1,255 criminal statutes and 713 validated charge matches across 12 offense categories. Federal statutes from GovInfo.gov. All jurisdictions linked to official legislature websites.",
              "stateLawsStatus": "Active - 51 Jurisdictions",
              "analytics": "Criminal Justice Analytics",
              "analyticsDesc": "Bureau of Justice Statistics (BJS) integration in progress. NCVS/NIBRS API implementation with proper weighting and pagination pending validation.",
              "analyticsStatus": "Partial Completion"
            },
            "trust": {
              "title": "Built on Trust & Transparency",
              "subtitle": "Every piece of legal information is backed by credible sources",
              "verifiedTitle": "Verified Citations",
              "verifiedDesc": "All legal statements include proper citations to laws, court cases, and regulations",
              "privacyTitle": "Privacy Protected",
              "privacyDesc": "No personal information stored, all session data automatically deleted",
              "currentTitle": "Current Information",
              "currentDesc": "Legal databases updated regularly to reflect the latest laws and procedures",
              "disclaimerTitle": "Legal Disclaimer:",
              "disclaimerText": "This AI agent provides general legal information only and is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific situation. The information provided may not reflect the most recent legal developments and should not be relied upon as legal counsel."
            },
            "urgentHelp": {
              "modalTitle": "Urgent Legal Situation",
              "arrestWarning": "If you are being arrested RIGHT NOW:",
              "arrestWarningText": "You have the right to stay silent and the right to a lawyer. Use these rights right away.",
              "immediateActions": "What to Do Right Now:",
              "stayCalmTitle": "1. Stay Calm",
              "stayCalmText": "Don't fight back. Keep your hands where police can see them. Do what they say calmly.",
              "assertRightsTitle": "2. State Your Rights",
              "assertRightsText1": "Say clearly: \"I want to stay silent. I want to talk to a lawyer.\"",
              "assertRightsText2": "Then stop talking to police. Don't answer questions until you have a lawyer.",
              "noConsentTitle": "3. Don't Let Them Search",
              "noConsentText": "Say: \"I don't give permission to search.\" Don't fight back, but make it clear you're saying no.",
              "publicDefenderTitle": "4. Ask for a Public Defender",
              "publicDefenderText": "If you can't pay for a lawyer, you can get one for free. Ask for a public defender when you first go to court.",
              "rememberTitle": "Remember:",
              "rememberText": "Anything you say can be used against you in court. The best way to protect yourself is to stay silent until you have a lawyer."
            },
            "whatWeDo": {
              "title": "What We Do",
              "subtitle": "Public Defender AI helps individuals understand their legal rights and navigate the criminal justice system.",
              "card1Title": "AI Legal Guidance",
              "card1Desc": "Get personalized legal information based on your specific situation",
              "card2Title": "Rights Information",
              "card2Desc": "Learn about your legal rights during arrest and court proceedings",
              "card3Title": "Find Resources",
              "card3Desc": "Locate public defenders, legal aid organizations, and court information"
            },
            "cta": {
              "title": "Ready to Get Started?",
              "subtitle": "Get free legal help and information for your situation.",
              "button": "Get Started"
            },
            "knowRights": {
              "title": "Know Your Rights",
              "subtitle": "Understanding your legal rights is the first step to protecting yourself.",
              "rightToRemainSilent": "Right to Remain Silent",
              "rightToRemainSilentDesc": "You don't have to answer questions without a lawyer present",
              "rightToAttorney": "Right to an Attorney",
              "rightToAttorneyDesc": "You have the right to legal representation, even if you can't afford it",
              "rightToFairTrial": "Right to a Fair Trial",
              "rightToFairTrialDesc": "You're entitled to a fair legal process and an unbiased jury",
              "searchWarrantRights": "Search & Seizure Protections",
              "searchWarrantRightsDesc": "Police need a warrant to search you or your property in most cases",
              "selfIncrimination": "Protection Against Self-Incrimination",
              "selfIncriminationDesc": "You cannot be forced to testify against yourself",
              "speedyTrial": "Right to Speedy Trial",
              "speedyTrialDesc": "You have the right to a trial without unreasonable delays",
              "learnMore": "Learn More About Your Rights",
              "showMore": "Show More",
              "showLess": "Show Less"
            },
            "dataSources": {
              "title": "Data Sources",
              "subtitle": "Our information comes from trusted, authoritative legal databases.",
              "courtlistener": "CourtListener API",
              "courtlistenerDesc": "8.4M+ court opinions and federal dockets from Free Law Project",
              "recap": "RECAP Archive",
              "recapDesc": "Free access to federal court records crowdsourced from PACER users",
              "cornell": "Cornell Legal Institute",
              "cornellDesc": "US Constitution, federal laws, and legal resources"
            },
            "publicDefenderSearch": {
              "title": "Find Public Defender Offices",
              "inputLabel": "Enter ZIP Code",
              "inputPlaceholder": "Enter 5-digit ZIP code",
              "searchButton": "Search",
              "searching": "Searching...",
              "noResults": "No public defender offices found within 50 miles. Try a different ZIP code or contact your local courthouse for information.",
              "error": "Please enter a valid 5-digit ZIP code",
              "errorGeneral": "Unable to search for offices. Please try again or contact your local court for information.",
              "county": "County",
              "milesAway": "mi away",
              "address": "Address",
              "phone": "Phone",
              "email": "Email",
              "hours": "Hours",
              "services": "Services",
              "directions": "Directions"
            },
            "legalAidSearch": {
              "title": "Find Legal Aid Organizations",
              "inputLabel": "Enter ZIP Code",
              "inputPlaceholder": "Enter 5-digit ZIP code",
              "searchButton": "Search",
              "searching": "Searching...",
              "noResults": "No legal aid organizations found within 100 miles. Try a different ZIP code or contact your state bar association.",
              "error": "Please enter a valid 5-digit ZIP code",
              "errorGeneral": "Unable to search for organizations. Please try again or contact your local bar association.",
              "servicesOffered": "Services Offered",
              "alertMessage": "These organizations focus on criminal justice and immigration legal assistance. Services are often free or low-cost for those who qualify.",
              "resultsFound": "Found {{count}} organization{{plural}} near you"
            },
            "searchResults": {
              "foundOffices": "Found {{count}} office{{plural}} near you"
            }
          },
          "footer": {
            "tagline": "Expanding access to justice through AI-powered legal guidance and resources.",
            "legalResources": "Legal Resources",
            "knowYourRights": "Know Your Rights",
            "courtProcedures": "Court Procedures",
            "legalGlossary": "Legal Glossary",
            "recordExpungement": "Record Expungement",
            "friendsFamily": "For Friends & Family",
            "courtRecords": "Find Court Records",
            "getHelp": "Get Help",
            "getCaseGuidance": "Get Case Guidance",
            "immigrationEnforcement": "Immigration Enforcement",
            "diversionPrograms": "Diversion Programs",
            "findLocalCourts": "Find Local Courts",
            "findPublicDefender": "Find Public Defender",
            "legalAidOrgs": "Legal Aid Organizations",
            "about": "About",
            "ourMission": "Our Mission",
            "developmentRoadmap": "Development Roadmap",
            "privacyPolicy": "Privacy Policy",
            "noticeDisclaimers": "Notice & Disclaimers",
            "privacyNotice": "Privacy First: We do not store your personal data — all input deleted after session.",
            "copyright": "© 2025 Public Defender AI. Not a substitute for professional legal advice."
          },
          "common": {
            "close": "Close",
            "cancel": "Cancel",
            "submit": "Submit",
            "search": "Search",
            "loading": "Loading...",
            "error": "Error",
            "success": "Success",
            "email": "Email",
            "phone": "Phone",
            "address": "Address",
            "name": "Name",
            "description": "Description",
            "learnMore": "Learn More",
            "getStarted": "Get Started",
            "back": "Back",
            "next": "Next",
            "save": "Save",
            "important": "Important",
            "privacyFirst": "Privacy First"
          },
          "mockQA": {
            "sectionTitle": "Practice Questions & Answers",
            "sectionSubtitle": "Common questions you might hear during court proceedings",
            "personalizedTitle": "Practice Questions for Your Case",
            "showResponse": "Show Response",
            "hideResponse": "Hide Response",
            "practiceNote": "Practice saying these responses out loud to feel more prepared for your court appearance.",
            "arraignment": {
              "plea": {
                "question": "How do you plead to the charges against you?",
                "response": "Not guilty, Your Honor.",
                "explanation": "Most attorneys recommend pleading not guilty at arraignment. This preserves all your options and gives time to review evidence."
              },
              "understand": {
                "question": "Do you understand the charges against you?",
                "response": "Yes, Your Honor, I understand the charges.",
                "explanation": "If you don't fully understand, it's okay to say 'I would like my attorney to explain them to me.' Never say yes if you truly don't understand."
              },
              "attorney": {
                "question": "Do you have an attorney or do you need one appointed?",
                "response": "I would like to request a public defender, Your Honor.",
                "explanation": "If you cannot afford an attorney, you have the right to have one appointed for you. Be honest about your financial situation."
              },
              "waiveTime": {
                "question": "Do you waive your right to a speedy trial?",
                "response": "I would like to discuss this with my attorney before answering.",
                "explanation": "Never waive time without consulting your attorney. This affects important deadlines in your case."
              }
            },
            "bail": {
              "residence": {
                "question": "What is your current address and how long have you lived there?",
                "response": "I live at [address] and have lived there for [time period].",
                "explanation": "Stable housing shows you have ties to the community and are less likely to flee."
              },
              "employment": {
                "question": "Are you currently employed? Where do you work?",
                "response": "Yes, I work at [employer] as a [job title].",
                "explanation": "Employment demonstrates community ties and responsibility. Mention how long you've worked there."
              },
              "ties": {
                "question": "Do you have family in the area?",
                "response": "Yes, I have [family members] who live nearby.",
                "explanation": "Family connections show you have reasons to stay in the area and appear for court dates."
              }
            },
            "pretrial": {
              "progress": {
                "question": "Have you been meeting with your attorney to prepare your case?",
                "response": "Yes, Your Honor, I have been in regular contact with my attorney.",
                "explanation": "This shows you are taking your case seriously and actively participating in your defense."
              },
              "conditions": {
                "question": "Have you been complying with all conditions of your release?",
                "response": "Yes, Your Honor, I have followed all conditions.",
                "explanation": "If you've had any difficulties, inform your attorney before the hearing so they can address it appropriately."
              }
            },
            "plea": {
              "voluntary": {
                "question": "Is your plea being made freely and voluntarily?",
                "response": "Yes, Your Honor.",
                "explanation": "Only answer yes if this is truly your decision and no one is forcing you. If you have doubts, tell the judge."
              },
              "discussed": {
                "question": "Have you fully discussed this plea with your attorney?",
                "response": "Yes, Your Honor, I have discussed all aspects of this plea with my attorney.",
                "explanation": "You should have had time to ask questions and understand all consequences before entering a plea."
              },
              "consequences": {
                "question": "Do you understand the consequences of this plea, including potential jail time?",
                "response": "Yes, Your Honor, I understand the possible consequences.",
                "explanation": "Make sure you truly understand the maximum penalties, collateral consequences, and immigration effects if applicable."
              }
            },
            "sentencing": {
              "statement": {
                "question": "Is there anything you would like to say to the court before I impose sentence?",
                "response": "Yes, Your Honor. [Express genuine remorse, take responsibility, mention positive steps taken]",
                "explanation": "This is your allocution. Be sincere, take responsibility, and mention any rehabilitation efforts you've made."
              },
              "understand": {
                "question": "Do you understand the sentence I have just imposed?",
                "response": "Yes, Your Honor, I understand.",
                "explanation": "If anything is unclear about your sentence, conditions, or reporting requirements, ask for clarification."
              }
            },
            "trial": {
              "testify": {
                "question": "Do you wish to testify in your own defense?",
                "response": "I would like to discuss this further with my attorney before deciding.",
                "explanation": "This is a major decision. You have the right not to testify, and the jury cannot hold your silence against you."
              },
              "juryWaiver": {
                "question": "Do you waive your right to a jury trial?",
                "response": "I would like to maintain my right to a jury trial, Your Honor.",
                "explanation": "Only waive a jury trial after careful discussion with your attorney about whether a bench trial might be better for your specific case."
              }
            }
          },
          "legalGuidance": {
            "qaFlow": {
              "title": "Get Personalized Legal Guidance",
              "cancel": "Cancel",
              "stepProgress": "Step {{current}} of {{total}}: {{title}}",
              "privacyNotice": "Your data is encrypted and auto-deleted within 24 hours. However, AI prompts may be retained by our provider for up to 30 days and could be subject to legal process during that time.",
              "steps": {
                "consent": "Privacy & Consent",
                "jurisdiction": "Your State",
                "caseDetails": "Your Case",
                "status": "Current Status",
                "additionalDetails": "Additional Details (Optional)"
              },
              "consent": {
                "title": "Privacy Disclaimer & Consent",
                "important": "Important:",
                "generalInfo": "This tool provides general legal information only and is not a substitute for professional legal advice.",
                "noStorage": "We do not store your personal information. All data is deleted when you close your session.",
                "consultAttorney": "For specific legal advice, consult with a qualified attorney.",
                "notPrivileged": "Your conversations with this AI are NOT protected by attorney-client privilege and could be requested by law enforcement or through legal process.",
                "governmentDisclosure": "Our AI provider (Anthropic) may retain your prompts for up to 30 days. During this time, if the government issues a valid subpoena or court order, your conversations may be disclosed.",
                "criminalWarning": "If you are under investigation or facing criminal charges, speak with a licensed attorney for confidential advice before sharing case details here.",
                "checkboxLabel": "I understand and consent to continue",
                "continueButton": "Continue"
              },
              "jurisdiction": {
                "title": "Where is your case?",
                "label": "Your State",
                "placeholder": "Select your state...",
                "states": {
                  "AL": "Alabama",
                  "AK": "Alaska",
                  "AZ": "Arizona",
                  "AR": "Arkansas",
                  "CA": "California",
                  "CO": "Colorado",
                  "CT": "Connecticut",
                  "DE": "Delaware",
                  "FL": "Florida",
                  "GA": "Georgia",
                  "HI": "Hawaii",
                  "ID": "Idaho",
                  "IL": "Illinois",
                  "IN": "Indiana",
                  "IA": "Iowa",
                  "KS": "Kansas",
                  "KY": "Kentucky",
                  "LA": "Louisiana",
                  "ME": "Maine",
                  "MD": "Maryland",
                  "MA": "Massachusetts",
                  "MI": "Michigan",
                  "MN": "Minnesota",
                  "MS": "Mississippi",
                  "MO": "Missouri",
                  "MT": "Montana",
                  "NE": "Nebraska",
                  "NV": "Nevada",
                  "NH": "New Hampshire",
                  "NJ": "New Jersey",
                  "NM": "New Mexico",
                  "NY": "New York",
                  "NC": "North Carolina",
                  "ND": "North Dakota",
                  "OH": "Ohio",
                  "OK": "Oklahoma",
                  "OR": "Oregon",
                  "PA": "Pennsylvania",
                  "RI": "Rhode Island",
                  "SC": "South Carolina",
                  "SD": "South Dakota",
                  "TN": "Tennessee",
                  "TX": "Texas",
                  "UT": "Utah",
                  "VT": "Vermont",
                  "VA": "Virginia",
                  "WA": "Washington",
                  "WV": "West Virginia",
                  "WI": "Wisconsin",
                  "WY": "Wyoming",
                  "DC": "District of Columbia",
                  "federal": "Federal"
                },
                "back": "Back",
                "continue": "Continue"
              },
              "caseDetails": {
                "title": "What charges are you facing?",
                "selectedCharges": "Selected Charges:",
                "filterLabel": "Filter by Category (Optional)",
                "filterPlaceholder": "All categories",
                "allCategories": "All categories",
                "selectLabel": "Select all charges that apply to your case:",
                "stateCharges": "State Charges",
                "federalCharges": "Federal Charges",
                "maxPenalty": "Max penalty:",
                "showMore": "Show {{count}} more charges...",
                "hasAttorneyLabel": "I already have an attorney or public defender",
                "back": "Back",
                "continue": "Continue"
              },
              "status": {
                "title": "Current status",
                "caseStageLabel": "What stage is your case in?",
                "caseStageplaceholder": "Select current stage...",
                "stages": {
                  "arrest": "Just arrested / Investigation",
                  "arraignment": "Arraignment scheduled/completed",
                  "pretrial": "Pre-trial proceedings",
                  "trial": "Trial scheduled/in progress",
                  "sentencing": "Sentencing phase",
                  "appeal": "Appeal process",
                  "unsure": "Not sure"
                },
                "custodyLabel": "Are you currently in custody?",
                "custodyPlaceholder": "Select custody status...",
                "custodyOptions": {
                  "yes": "Yes, in custody",
                  "bail": "Released on bail/bond",
                  "recognizance": "Released on recognizance (no bail)",
                  "no": "No, not in custody"
                },
                "back": "Back",
                "submitButton": "Get My Legal Guidance",
                "continue": "Continue"
              },
              "additionalDetails": {
                "title": "Tell Us More (Optional)",
                "description": "The more details you provide, the better our AI can tailor guidance to your specific situation. All fields are optional - skip any you're not comfortable sharing.",
                "incidentLabel": "What happened? Describe the incident in your own words",
                "incidentPlaceholder": "Example: I was driving home from work when the police pulled me over. They said I was swerving but I had just swerved to avoid a pothole...",
                "concernsLabel": "What are you most worried about? Any specific questions?",
                "concernsPlaceholder": "Example: I'm worried about losing my job. I have kids and can't afford a lawyer. When do I have to go to court?",
                "back": "Back"
              },
              "privilegeWarning": {
                "title": "Before You Share Details",
                "notPrivate": "What you type here is NOT protected by attorney-client privilege. Your prompts are processed by Anthropic's AI and could be disclosed if requested through legal process (such as a subpoena or court order).",
                "recommendation": "If you are under investigation or facing charges, we strongly recommend consulting a licensed attorney first. They can provide truly confidential advice. This step is optional—skip it to receive general guidance without sharing details.",
                "governmentWarning": "Important: Anthropic may retain prompts for up to 30 days. During this time, your conversations could be disclosed pursuant to a valid legal request.",
                "continueAnyway": "Continue Anyway",
                "skipAndGetGuidance": "Skip & Get General Guidance",
                "findLawyer": "Help Me Find a Lawyer"
              },
              "clearSession": {
                "button": "Clear My Session",
                "confirm": "Clear all data?",
                "description": "This will delete all your case information from our servers immediately. This cannot be undone.",
                "cancel": "Cancel",
                "cleared": "Session cleared successfully"
              }
            },
            "dashboard": {
              "title": "Legal Guidance Dashboard",
              "generatedOn": "Generated on",
              "hideDetails": "Hide Details",
              "showDetails": "Show Details",
              "close": "Close",
              "exportPDF": "Export PDF",
              "summary": {
                "charges": "Charges",
                "jurisdiction": "Your State",
                "currentStage": "Current Stage",
                "progress": "Progress",
                "actionsCompleted": "Actions Completed",
                "protected": "Protected"
              },
              "criticalAlerts": {
                "title": "Critical Alerts - Action Required"
              },
              "upcomingDeadlines": {
                "title": "Upcoming Deadlines"
              },
              "immediateActions": {
                "title": "Immediate Actions (Next 48 Hours)",
                "completed": "Completed: {{count}} of {{total}} actions"
              },
              "caseTimeline": {
                "title": "Case Timeline",
                "progress": "Case Progress",
                "current": "Current"
              },
              "nextSteps": {
                "title": "Next Steps"
              },
              "yourRights": {
                "title": "Your Rights"
              },
              "localResources": {
                "title": "Local Resources"
              },
              "evidenceToGather": {
                "title": "Evidence to Gather"
              },
              "importantWarnings": {
                "title": "Important Warnings"
              },
              "courtPreparation": {
                "title": "Court Preparation"
              },
              "actionsToAvoid": {
                "title": "Actions to Avoid"
              },
              "privacyNotice": {
                "title": "Your Privacy is Protected",
                "text": "This guidance is generated based on your input and will be automatically deleted after your session ends. No personal information is permanently stored.",
                "encrypted": "All data encrypted in transit and at rest",
                "autoDelete": "Session data automatically deleted after 24 hours",
                "piiRedacted": "Personal information redacted before AI processing",
                "deleteNow": "Delete My Data Now",
                "deleteNote": "Permanently removes all session data"
              }
            }
          },
          "getStartedMenu": {
            "main": {
              "title": "What Do You Need?",
              "caseGuidance": {
                "title": "Get Guidance For My Case",
                "description": "Personalized legal guidance based on your situation"
              },
              "immigration": {
                "title": "Immigration Enforcement",
                "description": "Rights during ICE encounters and deportation"
              },
              "legalRights": {
                "title": "Legal Rights Info",
                "description": "Constitutional rights and legal processes"
              },
              "legalAid": {
                "title": "Legal Aid Resources & Support",
                "description": "Find legal help and support services"
              },
              "lawsRecords": {
                "title": "Laws & Documents",
                "description": "Find statutes, case law, court records, and document guides"
              },
              "attorneyTools": {
                "title": "Attorney Tools",
                "description": "Document drafting and resources for legal professionals"
              },
              "resources": {
                "title": "Resources",
                "description": "Legal aid, support services, laws, court records, and documents"
              }
            },
            "resourcesSubmenu": {
              "title": "Resources",
              "backButton": "Back to Main Menu",
              "legalAid": "Legal Aid Resources & Support",
              "lawsRecords": "Laws & Documents"
            },
            "legalRightsSubmenu": {
              "title": "Legal Rights Info",
              "backButton": "Back to Main Menu",
              "constitutionalRights": "Your Legal Rights",
              "criminalJusticeProcess": "Criminal Justice Process",
              "caseTimeline": "Case Timeline",
              "quickReference": "Quick-Reference Cards",
              "searchSeizure": "Search and Seizure",
              "assistingFriends": "Assisting Friends or Family",
              "legalGlossary": "Legal Glossary"
            },
            "legalAidSubmenu": {
              "title": "Legal Aid Resources & Support",
              "backButton": "Back to Resources",
              "publicDefender": "Find Public Defender",
              "legalAidOrgs": "Legal Aid Organizations",
              "diversionPrograms": "Diversion Programs",
              "recordsExpungement": "Records Expungement"
            },
            "lawsRecordsSubmenu": {
              "title": "Laws & Documents",
              "backButton": "Back to Resources",
              "courtRecords": "Court Records Search",
              "statutes": "Statutes Search",
              "documentLibrary": "Document Library"
            },
            "immigrationSubmenu": {
              "title": "Immigration Enforcement",
              "backButton": "Back to Main Menu",
              "generalInfo": "General Information",
              "situationalGuides": "Situational Guides",
              "knowYourRights": "Know Your Rights",
              "findDetained": "Find a Detained Person",
              "findLawyer": "Find a Lawyer"
            }
          },
          "case": {
            "hero": {
              "title": "Case Guidance",
              "subtitle": "Get Personalized Legal Guidance",
              "description": "Answer a few questions about your situation to get legal help, next steps, and resources for your case.",
              "startButton": "Get Started",
              "privacyNote": "Your responses are private and automatically deleted after your session"
            },
            "howItWorks": {
              "title": "How Personalized Guidance Works",
              "step1Title": "Answer Questions",
              "step1Desc": "Tell us about your state, charges, and where you are in the legal process",
              "step2Title": "We Review Your Situation",
              "step2Desc": "Our system looks at your situation using legal databases and past court cases",
              "step3Title": "Get Guidance",
              "step3Desc": "Receive tailored next steps, deadlines, and relevant legal information",
              "step4Title": "Connect to Help",
              "step4Desc": "Access local resources, attorneys, and support organizations"
            },
            "benefits": {
              "title": "What You'll Receive",
              "nextStepsTitle": "Next Steps",
              "nextStepsDesc": "Clear, actionable steps you should take based on your case stage and circumstances",
              "deadlinesTitle": "Important Deadlines",
              "deadlinesDesc": "Important dates and deadlines you need to know about in your state",
              "rightsTitle": "Your Rights",
              "rightsDesc": "Rights that apply to your situation and how to use them",
              "resourcesTitle": "Local Resources",
              "resourcesDesc": "Public defenders, legal aid organizations, and support services in your area",
              "warningsTitle": "Important Warnings",
              "warningsDesc": "Things to avoid and potential pitfalls specific to your situation",
              "legalInfoTitle": "Legal Information",
              "legalInfoDesc": "Laws and past court cases that apply to your situation"
            },
            "privacy": {
              "title": "Your Privacy is Protected",
              "subtitle": "We take your privacy seriously. Here's how we protect your information.",
              "noStorageTitle": "No Data Storage",
              "noStorageDesc": "Personal information is not saved to our servers",
              "sessionOnlyTitle": "Session-Only",
              "sessionOnlyDesc": "Data exists only during your active session",
              "autoDeleteTitle": "Auto-Delete",
              "autoDeleteDesc": "All information automatically deleted when you leave",
              "anonymousTitle": "Anonymous",
              "anonymousDesc": "No account required, completely anonymous usage",
              "disclaimer": "This tool provides general legal information and guidance only. It is not a substitute for professional legal advice. Always consult with a qualified attorney for advice specific to your case.",
              "getStartedButton": "Get Started Now",
              "learnRightsButton": "Learn About Your Rights First",
              "footerBanner": "We do not store your personal data — all input deleted after session."
            },
            "exitWarning": {
              "title": "Before You Go",
              "message": "Your personalized guidance has not been exported. To protect your privacy, we don't store this information. If you leave now, it will be lost.",
              "export": "Export",
              "proceed": "Proceed"
            },
            "clearSession": {
              "title": "Clear Session Data",
              "message": "This will permanently delete all your case information and guidance from memory. This action cannot be undone.",
              "confirm": "Clear Session",
              "cancel": "Cancel",
              "successTitle": "Session Cleared",
              "successMessage": "All session data has been cleared from memory.",
              "errorTitle": "Error",
              "errorMessage": "Failed to clear session. Please try again."
            }
          },
          "rights": {
            "hero": {
              "title": "Know Your Legal Rights",
              "subtitle": "Understanding your legal rights is the first step in protecting yourself in the legal system."
            },
            "quickRights": {
              "title": "Essential Rights Everyone Should Know",
              "silent": {
                "title": "Right to Remain Silent",
                "description": "You don't have to answer questions beyond basic identification",
                "detailedExplanation": "The law protects you from being forced to say things that hurt your case. You only need to give basic information like your name and address - beyond that, you can refuse to answer any questions from police without a lawyer present. Anything you say can be used against you in court, so using this right protects you from saying things that could hurt your defense, even if you think you're innocent."
              },
              "attorney": {
                "title": "Right to an Attorney",
                "description": "Free legal representation if you cannot afford one",
                "detailedExplanation": "The law guarantees your right to have a lawyer for criminal cases. If you can't afford to hire a lawyer, the court must give you a public defender for free - this applies to any criminal case where you could go to jail. You should ask for a lawyer right away when arrested and before answering any questions, because having a lawyer from the start greatly improves your chances of a fair outcome."
              },
              "phoneCall": {
                "title": "Right to a Phone Call",
                "description": "Contact family, attorney, or bail bondsman after arrest",
                "detailedExplanation": "After being arrested and booked, you have the right to make a reasonable number of phone calls to contact an attorney, family member, or bail bondsman. Police cannot listen to calls with your attorney due to attorney-client privilege, but they may monitor other calls. It's important to use this right wisely - contact your lawyer first if possible, and avoid discussing details of your case on any call that might be recorded."
              },
              "knowCharges": {
                "title": "Right to Know Charges",
                "description": "Must be informed of accusations against you",
                "detailedExplanation": "The law requires that you be formally told about the criminal charges against you, usually at your first court appearance within 48-72 hours of arrest. You have the right to know exactly what crimes you're accused of, which laws they say you broke, and what punishments you could face. This information lets you and your lawyer prepare your defense and makes sure you can't be tried for crimes you weren't properly told about."
              }
            },
            "detailedRights": {
              "title": "Your Legal Rights in Detail",
              "tabs": {
                "miranda": "Miranda Warning",
                "arrest": "During Arrest",
                "court": "In Court",
                "prison": "If Convicted"
              },
              "miranda": {
                "title": "Miranda Warning",
                "completeWarning": "The Complete Miranda Warning:",
                "warning1": "You have the right to remain silent.",
                "warning2": "Anything you say can and will be used against you in a court of law.",
                "warning3": "You have the right to an attorney.",
                "warning4": "If you cannot afford an attorney, one will be provided for you.",
                "warning5": "Do you understand the rights I have just read to you?",
                "warning6": "With these rights in mind, do you wish to speak to me?",
                "whenApply": "When Miranda Warning Applies:",
                "apply1": "When you are in police custody AND being interrogated",
                "apply2": "Not required for traffic stops or voluntary questioning",
                "apply3": "Must be given before custodial interrogation begins",
                "apply4": "You can invoke these rights at any time during questioning",
                "alertTitle": "Important:",
                "alertText": "If police don't read you your Miranda warning, statements you made while in custody may not be allowed in court, but this doesn't automatically dismiss your case."
              },
              "arrest": {
                "title": "Rights During Arrest",
                "shouldDo": "What You Should Do:",
                "do1": "Stay calm and don't resist arrest",
                "do2": "Keep your hands visible",
                "do3": "Exercise your right to remain silent",
                "do4": "Ask for an attorney immediately",
                "do5": "Remember details for your lawyer later",
                "shouldNotDo": "What You Should NOT Do:",
                "dont1": "Don't run or resist physically",
                "dont2": "Don't argue with police",
                "dont3": "Don't consent to searches",
                "dont4": "Don't answer questions without a lawyer",
                "dont5": "Don't sign anything",
                "policePowers": "Police Powers During Arrest:",
                "power1": "Can search you and immediate area for weapons/evidence",
                "power2": "Can seize items in plain view",
                "power3": "Can search your vehicle if arrested during traffic stop",
                "power4": "Cannot search your phone without a warrant (in most cases)"
              },
              "court": {
                "title": "Rights in Court",
                "constitutional": "Legal Rights:",
                "right1": "Right to a fair and speedy trial",
                "right2": "Right to a fair, unbiased jury",
                "right3": "Right to confront witnesses",
                "right4": "Right to present a defense",
                "right5": "Right to appeal conviction",
                "burdenProof": "Burden of Proof:",
                "burden1": "Prosecution must prove guilt beyond reasonable doubt",
                "burden2": "You are presumed innocent until proven guilty",
                "burden3": "You don't have to prove your innocence",
                "burden4": "You have the right not to testify",
                "etiquetteTitle": "Court Etiquette:",
                "etiquetteText": "Dress appropriately, arrive on time, stand when the judge enters, address the judge as \"Your Honor,\" and let your attorney speak for you."
              },
              "prison": {
                "title": "Rights If Convicted",
                "continuing": "Continuing Rights:",
                "right1": "Right to appeal your conviction",
                "right2": "Right to legal representation for appeal",
                "right3": "Right to humane treatment in prison",
                "right4": "Right to medical care",
                "right5": "Right to practice religion",
                "right6": "Right to communicate with family (with restrictions)",
                "afterRelease": "After Release:",
                "after1": "Possible probation or parole supervision",
                "after2": "Potential employment restrictions",
                "after3": "Loss of certain civil rights (voting, firearms)",
                "after4": "Immigration consequences for non-citizens",
                "after5": "Possible record expungement or sealing",
                "collateralTitle": "Collateral Consequences:",
                "collateralText": "Criminal convictions can affect employment, housing, professional licenses, student aid, and immigration status. Discuss these with your attorney."
              }
            },
            "disclaimer": {
              "title": "Important:",
              "text": "This information is for learning only and is not legal advice. Laws are different in each state and change over time. Always talk to a real lawyer for help with your specific situation.",
              "needHelp": "Need Immediate Legal Help?",
              "emergencyAid": "Emergency Legal Aid",
              "caseGuidance": "Get Case Guidance"
            }
          },
          "immigration": {
            "common": {
              "importantLabel": "Important:"
            },
            "hero": {
              "title1": "Immigration Enforcement",
              "title2": "Know Your Rights",
              "subtitle": "Essential rights information for both citizens and non-citizens during ICE encounters and deportation proceedings"
            },
            "criticalAlert": {
              "title": "CRITICAL:",
              "text": "These rights apply to ALL persons in the United States, no matter your citizenship. You have legal protections even during immigration enforcement actions."
            },
            "emergencyRights": {
              "title": "Immediate Rights During ICE Encounters",
              "subtitle": "These rights apply to EVERYONE - citizens, non-citizens, documented, and undocumented persons",
              "constitutionalTitle": "Your Legal Rights",
              "constitutionalRights": {
                "silent": {
                  "title": "Right to Remain Silent:",
                  "text": "You do NOT have to answer questions about your immigration status, nationality, or where you were born."
                },
                "refuseSearch": {
                  "title": "Right to Refuse Searches:",
                  "text": "You can refuse to consent to a search of yourself, belongings, car, or home."
                },
                "attorney": {
                  "title": "Right to an Attorney:",
                  "text": "You have the right to speak with an attorney before answering questions."
                },
                "interpreter": {
                  "title": "Right to Interpreter:",
                  "text": "You have the right to an interpreter during proceedings."
                }
              },
              "whatNotToDoTitle": "What NOT to Do",
              "whatNotToDo": {
                "lie": {
                  "title": "Don't lie or provide false documents:",
                  "text": "This can be used against you in immigration court."
                },
                "run": {
                  "title": "Don't run or resist:",
                  "text": "This can lead to additional criminal charges."
                },
                "sign": {
                  "title": "Don't sign anything:",
                  "text": "Without understanding what it says or speaking to an attorney first."
                },
                "carryDocuments": {
                  "title": "Don't carry foreign documents:",
                  "text": "Unless required by law (like a driver's license)."
                }
              }
            },
            "deportationPhases": {
              "title": "Deportation Process Phases",
              "subtitle": "Understanding each stage of immigration enforcement proceedings",
              "phase1": {
                "title": "Phase 1: Initial ICE Encounter",
                "rightsTitle": "Your Rights:",
                "rights": {
                  "askLeave": "Ask if you are free to leave",
                  "warrant": "Request to see a warrant before allowing entry to your home",
                  "silent": "Remain silent about immigration status",
                  "attorney": "Request an attorney immediately"
                },
                "expectTitle": "What to Expect:",
                "expect": {
                  "approach": "ICE agents may approach at home, work, or in public",
                  "documents": "They may ask for identification and immigration documents",
                  "adminWarrant": "Administrative warrant ≠ judicial warrant",
                  "detention": "You may be detained if they believe you're removable"
                }
              },
              "phase2": {
                "title": "Phase 2: Immigration Detention",
                "rightsTitle": "Your Rights in Detention:",
                "rights": {
                  "phone": "Right to make phone calls to family and attorney",
                  "consulate": "Right to contact your consulate (non-citizens)",
                  "interpreter": "Right to interpreters during proceedings",
                  "charges": "Right to be informed of charges against you",
                  "bond": "Right to request bond hearing (in most cases)"
                },
                "importantTitle": "Important to Know:",
                "important": {
                  "duration": "Detention can last weeks, months, or longer",
                  "nta": "You will receive a Notice to Appear (NTA)",
                  "mandatory": "Some people are subject to mandatory detention",
                  "bondAmount": "Bond amounts vary widely ($1,500 - $25,000+)",
                  "criminal": "Certain criminal convictions affect bond eligibility"
                }
              },
              "phase3": {
                "title": "Phase 3: Immigration Court Proceedings",
                "rightsTitle": "Court Rights:",
                "rights": {
                  "attorney": "Right to an attorney (at your own expense)",
                  "interpreter": "Right to an interpreter",
                  "examine": "Right to examine evidence against you",
                  "present": "Right to present evidence and witnesses",
                  "appeal": "Right to appeal negative decisions"
                },
                "outcomesTitle": "Possible Outcomes:",
                "outcomes": {
                  "relief": "Relief from removal: Asylum, cancellation, adjustment",
                  "voluntary": "Voluntary departure: Leave at your own expense",
                  "removal": "Removal order: Forced deportation",
                  "continuances": "Continuances: Case postponed for various reasons",
                  "closure": "Administrative closure: Case temporarily closed"
                }
              },
              "phase4": {
                "title": "Phase 4: Appeals and Final Removal",
                "rightsTitle": "Appeal Rights:",
                "rights": {
                  "deadline": "30-day deadline to file appeal to Board of Immigration Appeals (BIA)",
                  "federal": "Possible federal court review after BIA decision",
                  "stay": "Stay of removal while appeal is pending (if requested)",
                  "motions": "Motions to reopen/reconsider in certain circumstances"
                },
                "processTitle": "Final Removal Process:",
                "process": {
                  "schedule": "ICE schedules removal date after final order",
                  "period": "90-day removal period (can be extended)",
                  "refusal": "Countries may refuse to accept returnees",
                  "supervision": "Some individuals may be released under supervision",
                  "bar": "Future entry to U.S. may be barred for years"
                }
              }
            },
            "specialProtections": {
              "title": "Special Protections",
              "subtitle": "Additional rights and protections for vulnerable populations",
              "usCitizens": {
                "title": "U.S. Citizens",
                "items": {
                  "noDeportation": "Cannot be deported (constitutional protection)",
                  "detained": "May be detained if identity is questioned",
                  "proof": "Should carry proof of citizenship",
                  "contact": "Contact family/attorney immediately if detained",
                  "complaints": "File complaints if rights violated"
                }
              },
              "vulnerable": {
                "title": "Vulnerable Populations",
                "pregnant": "Pregnant women: Special custody determination",
                "nursing": "Nursing mothers: Extended family detention alternatives",
                "minors": "Minors: Special procedures and protections",
                "mentallyIll": "Mentally ill: Competency evaluations required",
                "trafficking": "Victims of trafficking: Special visa protections"
              },
              "sanctuary": {
                "title": "Sanctuary Jurisdictions",
                "items": {
                  "policies": "Local policies limiting ICE cooperation",
                  "notice": "Advance notice of ICE operations (some areas)",
                  "know": "Know your local jurisdiction's policies",
                  "canOperate": "ICE can still operate in sanctuary areas",
                  "contact": "Contact local immigrant rights groups"
                }
              }
            },
            "resources": {
              "title": "Emergency Resources & Contacts",
              "subtitle": "Critical phone numbers and resources for immigration emergencies",
              "hotlines": {
                "title": "National Hotlines",
                "nif": {
                  "name": "National Immigration Forum",
                  "number": "1-800-954-6287",
                  "description": "24/7 deportation defense hotline"
                },
                "aclu": {
                  "name": "ACLU",
                  "number": "Text \"IMMIGRANT\" to 88823",
                  "description": "Know your rights information"
                },
                "doj": {
                  "name": "DOJ Executive Office for Immigration Review",
                  "number": "1-800-898-7180",
                  "description": "Attorney list and hearing information"
                }
              },
              "locators": {
                "title": "Locator Services",
                "iceDetainee": {
                  "name": "ICE Detainee Locator",
                  "url": "ice.gov/detain/ice-ero/locate-detainee",
                  "description": "Find detained individuals in ICE custody"
                },
                "legalServices": {
                  "name": "Immigration Advocates Network",
                  "url": "immigrationadvocates.org/nonprofit/legaldirectory",
                  "description": "Find free and low-cost immigration legal services"
                },
                "consulate": {
                  "name": "Consulate Locator",
                  "url": "state.gov/foreign-embassies",
                  "description": "Find your country's consulate in the U.S."
                }
              },
              "prepareTitle": "Prepare Now",
              "prepare": {
                "plan": "Create a family emergency plan",
                "documents": "Keep important documents in a safe place",
                "attorney": "Know immigration attorney contact information",
                "redCard": "Carry an immigration \"red card\" with your rights",
                "trustee": "Designate trusted person for childcare decisions"
              }
            },
            "finalCta": {
              "title": "Get Additional Help",
              "rights": "Learn Your General Rights",
              "local": "Find Local Resources"
            },
            "hub": {
              "detailedGuides": {
                "title": "Detailed Guides",
                "subtitle": "In-depth information on specific immigration topics",
                "dacaCard": {
                  "title": "DACA & TPS Information",
                  "description": "Eligibility, renewal deadlines, and what to do if your status lapses"
                },
                "raidsCard": {
                  "title": "Workplace Raids",
                  "description": "Your rights during ICE enforcement, what employers must do"
                },
                "familyCard": {
                  "title": "Mixed-Status Family Planning",
                  "description": "Emergency plans, caregiver authorization, document preparation"
                },
                "bondCard": {
                  "title": "Bond Hearings",
                  "description": "Eligibility, hearing process, what to do if denied"
                },
                "attorneyCard": {
                  "title": "Find & Verify an Attorney",
                  "description": "Avoid fraud, verify credentials, find free legal help"
                },
                "findDetainedCard": {
                  "title": "Find a Detained Person",
                  "description": "Use the ICE Detainee Locator, understand A-Numbers, bond information, and facility contacts"
                },
                "kyrCard": {
                  "title": "Know Your Rights Materials",
                  "description": "Printable red cards, ICE encounter scripts, warrant recognition guides"
                },
                "raidsToolkitCard": {
                  "title": "Community Raids Toolkit",
                  "description": "Safety checklists, emergency contact cards, scenario-specific preparedness guides"
                }
              },
              "backButton": "Back to Immigration Hub"
            },
            "daca": {
              "badge": "Immigration Protection",
              "title": "DACA & TPS Information",
              "subtitle": "Understanding Deferred Action for Childhood Arrivals (DACA) and Temporary Protected Status (TPS) programs, eligibility requirements, and renewal processes.",
              "disclaimer": "Immigration law changes frequently. Always verify current requirements with USCIS.gov or an immigration attorney before taking action.",
              "dacaSection": {
                "title": "DACA (Deferred Action for Childhood Arrivals)",
                "whatIs": "What is DACA?",
                "whatIsText": "DACA provides temporary protection from deportation and work authorization for individuals who came to the U.S. as children. It does not provide a path to citizenship or legal permanent residence.",
                "eligibility": "Basic Eligibility Requirements",
                "req1": "Were under 31 years old as of June 15, 2012",
                "req2": "Came to the U.S. before age 16",
                "req3": "Continuously resided in U.S. since June 15, 2007",
                "req4": "Were present in U.S. on June 15, 2012",
                "req5": "Currently in school, graduated, or have GED",
                "req6": "No felony, significant misdemeanor, or 3+ misdemeanors",
                "renewal": "Renewal Timeline",
                "renewalText": "Submit renewal applications 120-150 days before your current DACA expires. Processing typically takes 3-6 months."
              },
              "tpsSection": {
                "title": "TPS (Temporary Protected Status)",
                "whatIs": "What is TPS?",
                "whatIsText": "TPS is granted to nationals of designated countries experiencing ongoing armed conflict, environmental disaster, or other extraordinary conditions. It provides temporary lawful status and work authorization.",
                "countries": "Currently Designated Countries",
                "countriesNote": "*List subject to change. Verify current designations at USCIS.gov",
                "benefits": "TPS Benefits",
                "benefit1": "Protection from deportation while TPS is valid",
                "benefit2": "Employment Authorization Document (EAD)",
                "benefit3": "May apply for travel authorization",
                "reregistration": "Re-registration",
                "reregistrationText": "TPS holders must re-register during each re-registration period announced by USCIS. Missing deadlines can result in loss of status."
              },
              "statusLapse": {
                "title": "What If Your Status Lapses?",
                "dontPanic": "Don't Panic",
                "dontPanicText": "A lapsed status doesn't mean immediate deportation. Consult with an immigration attorney immediately to understand your options.",
                "gatherDocs": "Gather Documents",
                "gatherDocsText": "Collect all your immigration documents, proof of continuous presence, and any correspondence from USCIS. These will be crucial for any remedy.",
                "seekHelp": "Seek Legal Help",
                "seekHelpText": "Contact an accredited representative or immigration attorney. Many organizations offer free or low-cost consultations for DACA/TPS holders."
              },
              "resources": "Official Resources"
            },
            "raids": {
              "badge": "Workplace Rights",
              "title": "Workplace Raids & Your Rights",
              "subtitle": "Know your rights during ICE workplace enforcement actions. Understanding what agents can and cannot do helps protect you.",
              "criticalAlert": "If ICE is at your workplace right now:",
              "criticalAlertText": "Stay calm. You have rights. Do not run. Do not provide false documents.",
              "yourRights": {
                "title": "Your Rights During a Workplace Raid",
                "silent": "Right to Remain Silent",
                "silentText": "You don't have to answer questions about where you were born, your immigration status, or how you entered the U.S.",
                "refuse": "Right to Refuse Consent",
                "refuseText": "You can refuse to show documents beyond what's required for employment verification.",
                "attorney": "Right to an Attorney",
                "attorneyText": "You can request to speak with an attorney before answering any questions.",
                "basis": "Right to Know Basis for Detention",
                "basisText": "If detained, you can ask why and request to see the warrant or documentation."
              },
              "whatNotToDo": {
                "title": "What NOT to Do",
                "run": "Don't Run or Hide",
                "runText": "Running may be used against you and could result in additional charges.",
                "falseDocs": "Don't Provide False Documents",
                "falseDocsText": "Using fake documents is a federal crime that can result in imprisonment and bars to future immigration relief.",
                "lie": "Don't Lie About Identity",
                "lieText": "Giving false information to federal agents is a crime. It's better to remain silent.",
                "sign": "Don't Sign Documents You Don't Understand",
                "signText": "Some forms may be voluntary departure agreements. Ask for time to consult an attorney."
              },
              "employer": {
                "title": "Employer Obligations",
                "mustProvide": "What Employers Must Provide",
                "must1": "Access to non-public areas only with a judicial warrant (not administrative warrant)",
                "must2": "Reasonable time for employees to consult with counsel if available",
                "must3": "I-9 forms within 3 days notice (72 hours) if requested for audit",
                "canDo": "What Employers Can Do",
                "can1": "Request to see the warrant and verify it's signed by a judge",
                "can2": "Contact their attorney before allowing access to non-public areas",
                "can3": "Document the raid (agents' names, badge numbers, actions taken)",
                "can4": "Post Know Your Rights information in the workplace"
              },
              "afterRaid": {
                "title": "After a Workplace Raid",
                "detained": "If You Were Detained",
                "detained1": "Memorize or write down your A-Number",
                "detained2": "Contact family to let them know your location",
                "detained3": "Request to make phone calls - you have this right",
                "detained4": "Don't sign anything without understanding it",
                "detained5": "Ask for a bond hearing if eligible",
                "notDetained": "If You Were Not Detained",
                "notDetained1": "Document everything you witnessed",
                "notDetained2": "Note badge numbers and agent names",
                "notDetained3": "Consult with an immigration attorney",
                "notDetained4": "Report civil rights violations to community organizations",
                "notDetained5": "Create an emergency family plan"
              },
              "emergency": {
                "title": "Emergency Contacts",
                "subtitle": "Keep these numbers saved in your phone",
                "nilc": "National Immigration Law Center",
                "aclu": "ACLU Immigrants' Rights"
              }
            },
            "family": {
              "badge": "Family Protection",
              "title": "Mixed-Status Family Planning",
              "subtitle": "Protect your family by planning ahead. Create emergency plans, designate caregivers, and organize important documents.",
              "planningAlert": "Planning ahead protects your family.",
              "planningAlertText": "Even if nothing happens, having a plan reduces stress and ensures your children are cared for.",
              "documents": {
                "title": "Essential Documents to Prepare",
                "poa": {
                  "title": "Power of Attorney",
                  "description": "Designates someone to make legal and financial decisions on your behalf if you're detained.",
                  "item1": "General POA for financial matters",
                  "item2": "Durable POA (survives incapacity)",
                  "item3": "Must be notarized to be valid"
                },
                "caregiver": {
                  "title": "Caregiver Authorization",
                  "description": "Allows a trusted person to care for your children and make day-to-day decisions.",
                  "item1": "Authorizes school enrollment",
                  "item2": "Allows medical treatment consent",
                  "item3": "Temporary (usually 6-12 months)"
                },
                "guardianship": {
                  "title": "Guardianship Nomination",
                  "description": "Names your preferred guardian if you can't care for your children long-term.",
                  "item1": "Courts consider but don't always follow",
                  "item2": "Name backup guardians too",
                  "item3": "Should be notarized"
                }
              },
              "emergencyPlan": {
                "title": "Creating Your Family Emergency Plan",
                "communication": {
                  "title": "Communication Plan",
                  "step1": "Memorize Key Numbers",
                  "step1Text": "Have children memorize a trusted adult's phone number in case you're separated.",
                  "step2": "Create a Contact Tree",
                  "step2Text": "List 3-5 trusted people who can be called in an emergency. Share this list with your children's school.",
                  "step3": "Code Words",
                  "step3Text": "Create a family code word that trusted adults will use when picking up children."
                },
                "documentPrep": {
                  "title": "Document Preparation",
                  "step1": "Gather Birth Certificates",
                  "step1Text": "Have copies of all family members' birth certificates, including U.S. citizen children.",
                  "step2": "Passport Information",
                  "step2Text": "Keep copies of all passports (home country and U.S. if applicable) in a secure location.",
                  "step3": "Immigration Records",
                  "step3Text": "Store copies of all immigration documents, including A-numbers for detained family members."
                }
              },
              "financial": {
                "title": "Financial & Practical Considerations",
                "bank": "Bank Access",
                "bankText": "Add a trusted person to your bank accounts or set up a joint account so bills can be paid if you're detained.",
                "property": "Property Access",
                "propertyText": "Leave a spare key with a trusted neighbor or friend. Document the location of important items in your home.",
                "medical": "Medical Information",
                "medicalText": "Keep a list of children's medications, allergies, and doctor contacts with your caregiver authorization."
              },
              "freeHelp": "Free Help Available:",
              "freeHelpText": "Many immigrant advocacy organizations offer free assistance with family emergency planning. Contact your local legal aid organization or immigrant rights group for help creating these documents."
            },
            "bond": {
              "badge": "Detention & Release",
              "title": "Immigration Bond Hearings",
              "subtitle": "Understanding the bond process, eligibility requirements, and how to prepare for a bond hearing in immigration court.",
              "importantAlert": "Not everyone is eligible for bond. Some individuals are subject to mandatory detention. An immigration attorney can help determine eligibility.",
              "whatIsBond": {
                "title": "What is Immigration Bond?",
                "delivery": {
                  "title": "Delivery Bond",
                  "description": "Allows release from detention while the immigration case proceeds. The person must appear at all hearings.",
                  "amount": "Typical Amount:",
                  "amountValue": "$1,500 - $25,000+",
                  "setter": "Who Sets It:",
                  "setterValue": "ICE or Immigration Judge"
                },
                "voluntary": {
                  "title": "Voluntary Departure Bond",
                  "description": "Allows someone to leave the U.S. voluntarily at their own expense. The bond is refunded if they depart by the deadline.",
                  "amount": "Typical Amount:",
                  "amountValue": "$500 - $5,000",
                  "benefit": "Benefit:",
                  "benefitValue": "Avoids removal order"
                }
              },
              "eligibility": {
                "title": "Bond Eligibility",
                "mayBeEligible": "May Be Eligible",
                "eligible1": "People with no serious criminal history",
                "eligible2": "Those who are not flight risks",
                "eligible3": "Individuals with strong community ties",
                "eligible4": "People with U.S. citizen family members",
                "eligible5": "Those with steady employment history",
                "mandatoryDetention": "Mandatory Detention (No Bond)",
                "mandatory1": "Aggravated felony convictions",
                "mandatory2": "Certain drug offenses",
                "mandatory3": "Firearms offenses",
                "mandatory4": "Terrorism-related charges",
                "mandatory5": "Prior deportation orders (in some cases)"
              },
              "process": {
                "title": "The Bond Hearing Process",
                "step1": "Request a Bond Hearing",
                "step1Text": "You or your attorney must request a bond hearing before the immigration judge. ICE may also set an initial bond amount that can be challenged.",
                "step2": "Gather Evidence",
                "step2Text": "Prepare documents showing community ties: letters from family, proof of employment, lease agreements, utility bills, tax returns, and character letters.",
                "step3": "Attend the Hearing",
                "step3Text": "The judge will consider whether you're a flight risk or danger to the community. Having an attorney significantly improves outcomes.",
                "step4": "Pay the Bond",
                "step4Text": "If granted, bond must be paid through ICE (not the court). A family member or friend can pay on your behalf. Some organizations offer bond funds."
              },
              "denied": {
                "title": "If Bond is Denied",
                "options": "You Have Options",
                "option1": "Appeal to the Board of Immigration Appeals (BIA)",
                "option2": "Request reconsideration if circumstances change",
                "option3": "File a habeas corpus petition in federal court",
                "timeline": "Timeline",
                "time1": "BIA appeal must be filed within 30 days",
                "time2": "BIA decisions can take several months",
                "time3": "Consult an attorney immediately"
              },
              "resources": {
                "title": "Bond Fund Resources",
                "subtitle": "Can't afford bond? These organizations may be able to help:",
                "bailFund": "National Bail Fund Network",
                "bailFundText": "Directory of local bond funds that help families pay immigration bonds.",
                "raices": "RAICES Bond Fund",
                "raicesText": "Provides bond assistance for immigrants detained in Texas and beyond."
              }
            },
            "attorney": {
              "badge": "Legal Representation",
              "title": "Find & Verify an Immigration Attorney",
              "subtitle": "How to find legitimate immigration legal help and protect yourself from scams.",
              "scamWarning": "Beware of Notario Fraud!",
              "scamWarningText": "In the U.S., \"notarios\" are not authorized to provide legal advice. Only licensed attorneys and DOJ-accredited representatives can represent you in immigration court.",
              "whoCanHelp": {
                "title": "Who Can Legally Help With Immigration Cases?",
                "attorneys": {
                  "title": "Licensed Attorneys",
                  "description": "Attorneys licensed by any U.S. state bar can represent you in immigration matters, even if they're licensed in a different state.",
                  "item1": "Can represent you in court",
                  "item2": "Can file applications with USCIS",
                  "item3": "Subject to ethical rules and discipline"
                },
                "accredited": {
                  "title": "DOJ-Accredited Representatives",
                  "description": "Non-attorneys who are trained and authorized by the Department of Justice to represent immigrants. They work at recognized organizations.",
                  "item1": "Often offer free or low-cost services",
                  "item2": "Can represent you in immigration court",
                  "item3": "Work at non-profit organizations"
                }
              },
              "verify": {
                "title": "How to Verify an Immigration Attorney",
                "stateBar": {
                  "title": "Check State Bar",
                  "description": "Every state has a bar association website where you can verify if an attorney is licensed and in good standing.",
                  "link": "ABA Bar Directory"
                },
                "eoir": {
                  "title": "EOIR Recognition List",
                  "description": "The DOJ maintains a list of recognized organizations and accredited representatives authorized to provide immigration services.",
                  "link": "EOIR Roster"
                },
                "aila": {
                  "title": "AILA Lawyer Search",
                  "description": "The American Immigration Lawyers Association (AILA) has a directory of member attorneys who specialize in immigration law.",
                  "link": "AILA Lawyer Search"
                }
              },
              "redFlags": {
                "title": "Red Flags: Signs of Immigration Fraud",
                "warnings": {
                  "title": "Warning Signs",
                  "item1": "Guarantees a specific outcome or approval",
                  "item2": "Claims special connections to USCIS or judges",
                  "item3": "Asks you to sign blank forms",
                  "item4": "Won't provide a written contract",
                  "item5": "Encourages you to lie on applications",
                  "item6": "Keeps your original documents",
                  "item7": "Uses the title \"notario\" or \"immigration consultant\""
                },
                "legitimate": {
                  "title": "Signs of a Legitimate Attorney",
                  "item1": "Provides a written fee agreement",
                  "item2": "Explains risks and possible outcomes honestly",
                  "item3": "Gives you copies of all documents filed",
                  "item4": "Returns your original documents",
                  "item5": "Responds to your questions and calls",
                  "item6": "Is verifiable through state bar or EOIR",
                  "item7": "Has you review and sign forms yourself"
                }
              },
              "freeHelp": {
                "title": "Free & Low-Cost Legal Help",
                "organizations": "Legal Aid Organizations",
                "org1": "Catholic Charities immigration services",
                "org2": "CLINIC (Catholic Legal Immigration Network)",
                "org3": "Local legal aid societies",
                "org4": "Law school immigration clinics",
                "findingHelp": "Finding Help",
                "find1": "Search ImmigrationAdvocates.org",
                "find2": "Contact your local bar association",
                "find3": "Ask community organizations"
              },
              "reportFraud": {
                "title": "Report Immigration Fraud",
                "subtitle": "If you've been a victim of immigration fraud, report it:",
                "ftc": "FTC Complaint",
                "eoir": "EOIR Complaint"
              }
            }
          },
          "courtRecords": {
            "hero": {
              "title": "Court Records Search",
              "subtitle": "Search free court records from the RECAP Archive and case law database"
            },
            "freeFirstAlert": {
              "title": "Free First Policy:",
              "text1": "We search the free RECAP Archive first. If a document isn't available for free, we'll show you where to find it on PACER (which charges fees). Install the",
              "linkText": "RECAP browser extension",
              "text2": "to automatically save your PACER purchases to the free archive."
            },
            "searchParams": {
              "title": "Search Parameters",
              "description": "Enter at least one search criterion below",
              "searchTerm": "Search Term",
              "searchTermPlaceholder": "Keywords, party names...",
              "caseName": "Case Name",
              "caseNamePlaceholder": "Smith v. Jones",
              "docketNumber": "Docket Number",
              "docketNumberPlaceholder": "1:20-cv-12345",
              "searchButton": "Search Court Records"
            },
            "results": {
              "title": "Search Results",
              "totalResults": "{{count}} total results",
              "noResults": "No results found",
              "searchFailed": "Search failed. Please try again or refine your search criteria.",
              "recapSection": "RECAP Archive - Federal Court Filings ({{count}})",
              "opinionsSection": "Case Law Opinions ({{count}})",
              "filed": "Filed: {{date}}",
              "decided": "Decided: {{date}}",
              "free": "FREE",
              "viewOnPacer": "View on PACER",
              "viewOpinion": "View Opinion",
              "downloadFree": "Download Free PDF",
              "natureOfSuit": "Nature of Suit:",
              "assignedTo": "Assigned to:",
              "referredTo": "Referred to:",
              "dateTerminated": "Date Terminated:",
              "citedBy": "Cited by {{count}} cases",
              "citations": "Citations:",
              "status": "Status:",
              "precedentialStatus": "Court Decision Type:"
            },
            "partialFailure": {
              "title": "Partial Search Failure:",
              "text": "Some search services are unavailable.",
              "recapFailed": "RECAP docket search failed.",
              "opinionsFailed": "Case law opinion search failed.",
              "incomplete": "Results shown may be incomplete."
            }
          },
          "legalGlossary": {
            "hero": {
              "title": "Legal Glossary",
              "subtitle": "Understanding legal terms and concepts to help you navigate the criminal justice system"
            },
            "navigation": {
              "backToHome": "Back to Home",
              "termsCount": "{{count}} of {{total}} terms"
            },
            "search": {
              "placeholder": "Search legal terms, definitions, or keywords...",
              "browseByLetter": "Browse by Letter:",
              "filterByCategory": "Filter by Category:",
              "clearFilters": "Clear All Filters"
            },
            "terms": {
              "title": "Legal Terms & Definitions",
              "relatedTerms": "Related Terms:",
              "commonUsage": "Common Usage:",
              "examples": "Examples:",
              "legalContext": "Legal Context:",
              "aliases": "Also known as:",
              "categories": "Categories:"
            }
          },
          "process": {
            "hero": {
              "title": "Criminal Justice Process Timeline",
              "subtitle": "Step-by-step guide through arrest, first court appearance, trial, and sentencing"
            },
            "crossLinks": {
              "timeline": "Interactive guide — select your stage to see rights and tips",
              "quickRef": "Printable cards with your rights at every stage"
            },
            "alert": {
              "important": "Important:",
              "text": "The exact timing and steps can be different in each state and for different cases. Always talk to a real lawyer for help with your specific situation."
            },
            "steps": {
              "yourRights": "Your Rights at This Stage:",
              "whatToExpect": "What to Expect:",
              "step1": {
                "title": "Arrest",
                "description": "Law enforcement takes you into custody based on probable cause or a warrant.",
                "timeframe": "Immediate",
                "rights": [
                  "Right to remain silent",
                  "Right to an attorney",
                  "Right to a phone call",
                  "Right to be informed of charges"
                ]
              },
              "step2": {
                "title": "Booking",
                "description": "Processing at the police station including fingerprints, photos, and personal information.",
                "timeframe": "1-3 hours",
                "rights": [
                  "Right to medical attention if needed",
                  "Right to contact attorney or family",
                  "Right to humane treatment"
                ]
              },
              "step3": {
                "title": "First Court Appearance",
                "description": "First court appearance where charges are formally read and you enter a plea.",
                "timeframe": "24-72 hours",
                "rights": [
                  "Right to be informed of charges",
                  "Right to have attorney present",
                  "Right to request public defender",
                  "Right to reasonable bail"
                ]
              },
              "step4": {
                "title": "First Hearing",
                "description": "Court determines if there's probable cause to believe you committed the crime.",
                "timeframe": "1-2 weeks",
                "rights": [
                  "Right to challenge evidence",
                  "Right to cross-examine witnesses",
                  "Right to attorney representation"
                ]
              },
              "step5": {
                "title": "Discovery",
                "description": "Both sides exchange evidence, witness lists, and other case information.",
                "timeframe": "Weeks to months",
                "rights": [
                  "Right to see prosecution's evidence",
                  "Right to present defense evidence",
                  "Right to expert witnesses"
                ]
              },
              "step6": {
                "title": "Trial",
                "description": "Formal presentation of evidence before a judge or jury to determine guilt or innocence.",
                "timeframe": "Varies",
                "rights": [
                  "Right to jury trial",
                  "Right to confront witnesses",
                  "Right to remain silent",
                  "Right to present defense"
                ]
              },
              "step7": {
                "title": "Sentencing",
                "description": "If convicted, the court determines the appropriate punishment.",
                "timeframe": "2-6 weeks after trial",
                "rights": [
                  "Right to speak at sentencing",
                  "Right to appeal",
                  "Right to fair and proportional punishment"
                ]
              }
            },
            "additionalInfo": {
              "title": "Important Notes",
              "pleaBargains": {
                "title": "Plea Bargains",
                "text": "Most criminal cases (about 90-95%) are resolved through plea bargains rather than going to trial. This happens during the discovery phase when prosecutors and defense attorneys negotiate reduced charges or sentencing in exchange for a guilty plea."
              },
              "speedyTrial": {
                "title": "Speedy Trial Rights",
                "text": "The law guarantees your right to a quick trial. Federal cases must usually start within 70 days of being charged or your first court appearance. State rules vary, often ranging from 60 to 180 days."
              },
              "publicDefender": {
                "title": "Getting a Public Defender",
                "text": "If you can't pay for a lawyer, you have the legal right to one. Public defenders are assigned when you first go to court. You may need to fill out a form to show you can't afford a lawyer."
              },
              "bondBail": {
                "title": "Bond and Bail",
                "text": "Bail is money paid to the court to ensure you return for trial. If you can't afford bail, you may remain in custody or request a bail hearing. Some jurisdictions offer release on recognizance (ROR) for low-risk defendants."
              }
            },
            "guides": {
              "title": "Understanding Key Legal Processes",
              "subtitle": "Learn about important decisions you may face during your case. Click each section to expand and learn more.",
              "bail": {
                "title": "Cash Bail",
                "intro": "Bail is money held by the court to make sure you come back for your court dates. Here's what you need to know as a defendant.",
                "whatIs": {
                  "title": "What is bail?",
                  "description": "Bail is a way to get out of jail while waiting for your case to be finished. You pay money (or someone pays for you), and the court holds it until your case ends.",
                  "points": [
                    "Bail is not a fine or punishment - it's like a deposit",
                    "If you go to all your court dates, you get the money back (minus any fees)",
                    "The purpose is to make sure you don't run away before trial"
                  ]
                },
                "howSet": {
                  "title": "How bail amounts are set",
                  "description": "A judge decides your bail amount based on several things:",
                  "factors": [
                    "How serious your charges are",
                    "Your criminal history (if any)",
                    "Whether you have strong ties to the community (job, family, home)",
                    "Whether you're considered a flight risk",
                    "Your ability to pay",
                    "Public safety concerns"
                  ]
                },
                "options": {
                  "title": "Your bail options",
                  "types": [
                    {
                      "name": "Cash Bail",
                      "description": "You pay the full bail amount to the court. You get it all back when the case ends (if you showed up to court)."
                    },
                    {
                      "name": "Bail Bond (through a bondsman)",
                      "description": "You pay a bail bondsman about 10-15% of the bail amount. They pay the full bail. You don't get your payment back - it's their fee."
                    },
                    {
                      "name": "Property Bond",
                      "description": "You use property (like a house) as collateral instead of cash. If you don't show up, the court can take the property."
                    },
                    {
                      "name": "Release on Recognizance (ROR)",
                      "description": "You're released with just a promise to return - no money required. This is for lower-risk defendants with strong community ties."
                    }
                  ]
                },
                "cantAfford": {
                  "title": "What if you can't afford bail?",
                  "description": "Don't lose hope. There are steps you can take:",
                  "options": [
                    "Ask your lawyer to request a bail reduction hearing",
                    "Gather evidence of community ties (job letter, family support, lease)",
                    "Look into bail funds - nonprofit organizations that help pay bail",
                    "Ask family or friends if they can help with a bail bond",
                    "In some areas, there are pretrial services programs as alternatives"
                  ]
                },
                "conditions": {
                  "title": "Conditions of release",
                  "description": "Even if you post bail, the judge may set rules you must follow while out:",
                  "examples": [
                    "Check in with a pretrial officer regularly",
                    "Stay in the area (no travel without permission)",
                    "Avoid contact with certain people (like witnesses or victims)",
                    "No alcohol or drugs, possibly with testing",
                    "Wear an ankle monitor",
                    "Keep or find a job",
                    "Obey a curfew"
                  ]
                },
                "missCourt": {
                  "title": "What happens if you miss court?",
                  "description": "Missing a court date is serious. Here's what can happen:",
                  "consequences": [
                    "A warrant will be issued for your arrest",
                    "You'll lose your bail money (or the bondsman will look for you)",
                    "You could face additional criminal charges for failure to appear",
                    "It will be much harder to get bail again",
                    "The judge may view you as less trustworthy when deciding your case"
                  ]
                }
              },
              "plea": {
                "title": "Plea Bargains",
                "intro": "About 90-95% of criminal cases are resolved through plea bargains. Understanding this process helps you make informed decisions.",
                "whatIs": {
                  "title": "What is a plea bargain?",
                  "description": "A plea bargain is an agreement between you (the defendant) and the prosecutor. You agree to plead guilty to a charge, and in return, you get something - usually a lighter sentence or fewer charges.",
                  "points": [
                    "It's a negotiation - your lawyer bargains on your behalf",
                    "The judge must approve the agreement",
                    "You give up your right to a trial when you accept",
                    "Once accepted, it's very hard to take back"
                  ]
                },
                "types": {
                  "title": "Types of plea deals",
                  "deals": [
                    {
                      "name": "Charge Bargaining",
                      "description": "You plead guilty to a less serious charge. For example, a felony might be reduced to a misdemeanor."
                    },
                    {
                      "name": "Sentence Bargaining",
                      "description": "You plead guilty to the original charge, but the prosecutor recommends a lighter sentence to the judge."
                    },
                    {
                      "name": "Count Bargaining",
                      "description": "If you face multiple charges, some are dropped in exchange for pleading guilty to others."
                    },
                    {
                      "name": "Fact Bargaining",
                      "description": "Certain facts are left out of the case, which can affect sentencing (less common)."
                    }
                  ]
                },
                "rights": {
                  "title": "Your rights during plea negotiations",
                  "description": "Remember, you have important rights in this process:",
                  "list": [
                    "You can ALWAYS reject any plea offer - nobody can force you to accept",
                    "You have the right to go to trial instead",
                    "You must be told about immigration consequences before pleading (if applicable)",
                    "You can ask for time to think about an offer",
                    "You should always talk to a lawyer before deciding"
                  ]
                },
                "questions": {
                  "title": "Questions to ask before accepting",
                  "description": "Before you agree to any plea deal, make sure you understand:",
                  "list": [
                    "Exactly what am I pleading guilty to?",
                    "What is the maximum sentence I could get?",
                    "What sentence is the prosecutor recommending?",
                    "Is the judge required to follow the recommendation?",
                    "Will I have a criminal record? Can it ever be expunged?",
                    "How will this affect my immigration status (if applicable)?",
                    "Will I be able to own firearms?",
                    "Will I have to register as a sex offender (if applicable)?",
                    "What happens if I violate probation?"
                  ]
                },
                "collateral": {
                  "title": "Collateral consequences",
                  "description": "Pleading guilty can affect your life beyond the sentence. These are called 'collateral consequences':",
                  "consequences": [
                    "Immigration: Can lead to deportation, denial of citizenship, or visa problems",
                    "Employment: Some jobs require background checks; certain professions may be off-limits",
                    "Housing: Public housing and some landlords may reject you",
                    "Education: May affect financial aid or admission to schools",
                    "Voting: In some states, felons lose voting rights",
                    "Gun rights: Felonies and some misdemeanors prevent gun ownership",
                    "Professional licenses: Some convictions prevent becoming a nurse, teacher, etc.",
                    "Child custody: May be considered in family court decisions"
                  ]
                },
                "decide": {
                  "title": "Accept the deal or go to trial?",
                  "description": "This is one of the most important decisions in your case. Here are factors to consider:",
                  "acceptTitle": "Consider accepting if:",
                  "acceptReasons": [
                    "The evidence against you is strong",
                    "The deal significantly reduces your potential sentence",
                    "Going to trial could result in much worse consequences",
                    "The deal allows you to avoid certain charges with serious collateral consequences",
                    "Your lawyer strongly recommends it"
                  ],
                  "trialTitle": "Consider going to trial if:",
                  "trialReasons": [
                    "You are truly innocent",
                    "The evidence against you is weak",
                    "Your constitutional rights were violated (illegal search, coerced confession)",
                    "The plea offer isn't much better than what you'd get at trial",
                    "You're willing to accept the risk for a chance at acquittal"
                  ]
                }
              }
            },
            "legalDisclaimer": {
              "title": "Legal Disclaimer:",
              "text": "This information is for educational purposes only and does not constitute legal advice. Laws and procedures vary by state and federal jurisdiction. Always consult with a qualified attorney for advice specific to your situation."
            }
          },
          "caseTimeline": {
            "title": "Case Timeline",
            "subtitle": "Follow the stages of a criminal case from start to finish. Select your current stage to see what to expect and your rights.",
            "selectStage": "Select a stage to learn what happens and what your rights are",
            "yourRights": "Your Rights",
            "whatToKnow": "What to Know",
            "viewQuickRef": "Quick-Reference Card",
            "disclaimer": {
              "title": "Important:",
              "text": "Every case is different. The stages shown are a general guide for a typical criminal case. Your case may have additional or fewer steps. Always consult with your attorney about your specific situation."
            },
            "stages": {
              "arrest": {
                "title": "Arrest",
                "timeframe": "Minutes to hours",
                "description": "An arrest happens when police take you into custody. You may be handcuffed and taken to a police station. This can happen with or without a warrant. Officers must have probable cause to believe you committed a crime.",
                "rights": [
                  "You have the right to remain silent",
                  "You have the right to an attorney",
                  "You do not have to consent to a search",
                  "You have the right to know why you are being arrested"
                ],
                "tips": [
                  "Stay calm and do not resist, even if the arrest feels unfair",
                  "Clearly state: 'I am exercising my right to remain silent'",
                  "Say: 'I want a lawyer' — then stop talking",
                  "Remember officer badge numbers and patrol car numbers",
                  "Do not sign anything without a lawyer present"
                ]
              },
              "booking": {
                "title": "Booking",
                "timeframe": "1-4 hours",
                "description": "After arrest, you are taken to a jail or police station for booking. This is the administrative process of recording your information. Your personal belongings will be taken and stored.",
                "rights": [
                  "You still have the right to remain silent",
                  "You have the right to a phone call (usually within a few hours)",
                  "You can request medical attention if needed",
                  "Your belongings must be returned when you are released"
                ],
                "tips": [
                  "You will be fingerprinted and photographed",
                  "Use your phone call to contact a lawyer or family member",
                  "Do not discuss your case with anyone in the holding area",
                  "Be polite to booking officers — it does not hurt your case",
                  "Ask when you will see a judge"
                ]
              },
              "firstAppearance": {
                "title": "First Appearance",
                "timeframe": "24-72 hours after arrest",
                "description": "Your first time before a judge. The charges are formally read, and the judge decides about bail. If you cannot afford an attorney, you can request a public defender at this stage.",
                "rights": [
                  "Right to be informed of the charges",
                  "Right to an attorney (public defender if you can't afford one)",
                  "Right to request reasonable bail",
                  "Right to plead not guilty"
                ],
                "tips": [
                  "Almost always plead 'not guilty' at this stage",
                  "Request a public defender if you cannot afford a lawyer",
                  "Dress appropriately and address the judge as 'Your Honor'",
                  "Do not discuss facts of your case in open court",
                  "Bring information about your ties to the community for bail arguments"
                ]
              },
              "pretrial": {
                "title": "Pretrial",
                "timeframe": "Weeks to months",
                "description": "The period between your first appearance and trial. Your attorney reviews evidence, files motions, and may negotiate with the prosecutor. Plea bargain discussions often happen during this phase.",
                "rights": [
                  "Right to see all evidence the prosecution has (discovery)",
                  "Right to a speedy trial",
                  "Right to have your attorney file motions on your behalf",
                  "Right to reject any plea deal offered"
                ],
                "tips": [
                  "Stay in close contact with your attorney",
                  "Attend every court date — missing one leads to a bench warrant",
                  "Follow all bail conditions carefully",
                  "Do not post about your case on social media",
                  "About 90-95% of cases are resolved through plea bargains"
                ]
              },
              "discovery": {
                "title": "Discovery",
                "timeframe": "Part of pretrial phase",
                "description": "Both sides exchange evidence. The prosecution must share all evidence with your defense attorney, including anything that might help prove your innocence (this is called the Brady Rule).",
                "rights": [
                  "Right to see all evidence against you",
                  "Right to evidence that could prove your innocence (Brady material)",
                  "Right to challenge evidence through motions",
                  "Right to have your attorney review all discovery materials"
                ],
                "tips": [
                  "Share all information with your attorney — attorney-client privilege protects you",
                  "Help your attorney identify potential witnesses",
                  "Gather any documents, texts, or records that support your case",
                  "Your attorney may file motions to suppress improperly obtained evidence",
                  "Keep notes of anything you remember about the incident"
                ]
              },
              "trial": {
                "title": "Trial",
                "timeframe": "Days to weeks",
                "description": "If your case goes to trial, both sides present their case before a judge or jury. The prosecution must prove your guilt beyond a reasonable doubt. You have the right to testify or remain silent.",
                "rights": [
                  "Right to a trial by jury (for most criminal cases)",
                  "Right to confront and cross-examine witnesses",
                  "Right to present your own evidence and witnesses",
                  "Right to testify or to remain silent (cannot be held against you)",
                  "Presumption of innocence until proven guilty"
                ],
                "tips": [
                  "Trust your attorney's strategy — they know the process",
                  "Dress professionally and be respectful in court",
                  "Do not react emotionally to testimony or evidence",
                  "Your attorney decides whether you should testify",
                  "The burden of proof is on the prosecution, not on you"
                ]
              },
              "sentencing": {
                "title": "Sentencing",
                "timeframe": "Immediately or weeks after verdict",
                "description": "If found guilty, the judge determines your punishment based on sentencing guidelines, the severity of the crime, your criminal history, and other factors. You have the right to speak before sentencing.",
                "rights": [
                  "Right to speak at your sentencing (allocution)",
                  "Right to have your attorney present mitigating factors",
                  "Right to appeal the conviction or sentence",
                  "Right to fair and proportional punishment (8th Amendment)"
                ],
                "tips": [
                  "Show genuine accountability — judges notice",
                  "Highlight rehabilitation steps (counseling, employment, education)",
                  "Have family or community members write support letters",
                  "Ask your attorney about sentencing alternatives (probation, community service)",
                  "Understand your right to appeal — there are deadlines"
                ]
              }
            }
          },
          "quickRef": {
            "title": "Quick-Reference Cards",
            "subtitle": "Compact, printable guides for your rights at every stage. Save them to your phone or print them out.",
            "printAll": "Print All Cards",
            "tabs": {
              "police": "Police Encounters",
              "court": "Court Stages",
              "all": "All Cards"
            },
            "disclaimer": {
              "title": "Important:",
              "text": "These cards provide general information about your rights. Laws vary by state and situation. This is not legal advice. Always consult with an attorney about your specific case."
            },
            "police": {
              "title": "If You Are Stopped by Police",
              "stay": "Stay Calm & Remember",
              "stay1": "You have the right to remain silent. Say: \"I am exercising my right to remain silent.\"",
              "stay2": "You have the right to refuse searches. Say: \"I do not consent to a search.\"",
              "stay3": "Ask: \"Am I free to leave?\" If yes, walk away calmly.",
              "stay4": "You have the right to an attorney. Say: \"I want to speak to a lawyer.\"",
              "doHeading": "Do",
              "do1": "Keep your hands visible at all times",
              "do2": "Provide your name and ID if asked",
              "do3": "Stay calm and speak clearly",
              "do4": "Remember badge numbers and patrol car numbers",
              "do5": "Write down everything immediately after",
              "dontHeading": "Don't",
              "dont1": "Don't resist arrest, even if you believe it's unfair",
              "dont2": "Don't run, argue, or make sudden movements",
              "dont3": "Don't consent to a search of your person, car, or home",
              "dont4": "Don't answer questions without a lawyer present",
              "dont5": "Don't sign anything without reading it and consulting an attorney",
              "ifArrested": "If You Are Arrested",
              "arrested1": "Say clearly: \"I want a lawyer\" — then stop talking",
              "arrested2": "You get at least one phone call — use it to call a lawyer or family",
              "arrested3": "Do not discuss your case with anyone except your attorney",
              "arrested4": "You must be brought before a judge within 48-72 hours"
            },
            "arraignment": {
              "title": "Arraignment",
              "expect": "What to Expect",
              "expect1": "The judge reads the charges against you",
              "expect2": "You enter a plea: guilty, not guilty, or no contest",
              "expect3": "Bail amount may be set or modified",
              "expect4": "Your attorney can request a public defender if needed",
              "say": "What to Say",
              "say1": "\"Not guilty\" — this is almost always the best initial plea",
              "say2": "\"I would like a court-appointed attorney\" — if you can't afford one",
              "say3": "\"Yes, Your Honor\" / \"No, Your Honor\" — when addressing the judge",
              "dontSay": "Don't Say",
              "dontSay1": "Don't discuss the facts of your case in open court",
              "dontSay2": "Don't plead guilty without talking to a lawyer first",
              "dontSay3": "Don't argue with the judge or prosecutor",
              "rights": "Your Rights",
              "right1": "Right to an attorney (free if you can't afford one)",
              "right2": "Right to know the charges against you",
              "right3": "Right to reasonable bail",
              "right4": "Right to a speedy trial"
            },
            "bail": {
              "title": "Bail Hearing",
              "expect": "What to Expect",
              "expect1": "Judge decides whether to grant bail and how much",
              "expect2": "Factors: severity of charge, flight risk, community ties, criminal history",
              "expect3": "You or your attorney can argue for lower bail or release",
              "expect4": "Conditions of release may be set (curfew, no contact orders, etc.)",
              "say": "What to Say",
              "say1": "Emphasize community ties: family, job, length of residence",
              "say2": "Mention you will comply with all court dates",
              "say3": "Offer alternatives if bail is too high (ankle monitor, check-ins)",
              "dontSay": "Don't Say",
              "dontSay1": "Don't discuss the details of your case",
              "dontSay2": "Don't make promises you can't keep",
              "dontSay3": "Don't show frustration or anger toward the court",
              "rights": "Your Rights",
              "right1": "Right to reasonable bail (8th Amendment)",
              "right2": "Right to a bail hearing",
              "right3": "Right to appeal a bail decision"
            },
            "pretrial": {
              "title": "Pretrial / Discovery",
              "expect": "What to Expect",
              "expect1": "Both sides exchange evidence (discovery process)",
              "expect2": "Your attorney may file motions to suppress evidence or dismiss charges",
              "expect3": "Plea bargain negotiations often happen during this phase",
              "expect4": "This phase can take weeks to months",
              "say": "What to Do",
              "do1": "Stay in close contact with your attorney",
              "do2": "Attend every court date — missing one can result in a bench warrant",
              "do3": "Follow all bail conditions strictly",
              "do4": "Gather any evidence or witnesses that help your case",
              "dontSay": "Don't Do",
              "dont1": "Don't discuss your case on social media or with others",
              "dont2": "Don't contact witnesses or victims directly",
              "dont3": "Don't accept a plea deal without fully understanding the consequences",
              "rights": "Your Rights",
              "right1": "Right to see all evidence against you (Brady Rule)",
              "right2": "Right to a speedy trial",
              "right3": "Right to present your own evidence and witnesses"
            },
            "plea": {
              "title": "Plea Hearing",
              "expect": "What to Expect",
              "expect1": "The judge asks if you understand the plea and its consequences",
              "expect2": "You must confirm the plea is voluntary and not coerced",
              "expect3": "The judge explains the maximum possible sentence",
              "expect4": "Sentencing may happen immediately or be scheduled later",
              "say": "What to Say",
              "say1": "\"Yes, I understand\" — when the judge explains the plea terms",
              "say2": "\"Yes, this is my voluntary decision\" — confirm you were not forced",
              "say3": "Ask your lawyer to explain anything you don't understand",
              "dontSay": "Don't Say",
              "dontSay1": "Don't say \"I didn't do it\" while pleading guilty — the judge may reject the plea",
              "dontSay2": "Don't agree to a plea if you don't understand the collateral consequences (immigration, housing, employment)",
              "dontSay3": "Don't rush — you can ask for more time to decide",
              "rights": "Your Rights",
              "right1": "Right to withdraw a guilty plea in certain circumstances",
              "right2": "Right to know the full consequences before pleading",
              "right3": "Right to reject any plea deal and go to trial"
            },
            "sentencing": {
              "title": "Sentencing",
              "expect": "What to Expect",
              "expect1": "The judge considers sentencing guidelines, victim impact statements, and your background",
              "expect2": "Your attorney can present mitigating factors (first offense, employment, family responsibilities)",
              "expect3": "Possible outcomes: fines, probation, community service, imprisonment, or combination",
              "expect4": "You may have the opportunity to address the court",
              "say": "What to Say",
              "say1": "Express genuine remorse if you have been found guilty",
              "say2": "Mention rehabilitation steps you've taken (counseling, classes, employment)",
              "say3": "Describe your responsibilities (children, family, community)",
              "dontSay": "Don't Say",
              "dontSay1": "Don't blame the victim or minimize the offense",
              "dontSay2": "Don't argue with the judge's questions",
              "dontSay3": "Don't make excuses — take responsibility where appropriate",
              "rights": "Your Rights",
              "right1": "Right to speak at your sentencing (allocution)",
              "right2": "Right to appeal the sentence",
              "right3": "Right to fair and proportional punishment (8th Amendment)",
              "right4": "Right to have your attorney present"
            }
          },
          "diversionPrograms": {
            "hero": {
              "title": "Diversion Programs",
              "subtitle": "Find alternative programs to avoid conviction and get the help you need"
            },
            "navigation": {
              "backToHome": "Back to Home",
              "programsCount": "{{count}} of {{total}} programs"
            },
            "search": {
              "placeholder": "Enter your zip code, county, or city...",
              "filterByState": "Filter by State:",
              "allStates": "All states",
              "federalPrograms": "Federal Programs",
              "filterByProgramType": "Filter by Program Type:",
              "allProgramTypes": "All program types",
              "clearAllFilters": "Clear All Filters"
            },
            "infoBanner": {
              "title": "What are Diversion Programs?",
              "description": "Diversion programs allow eligible defendants to avoid traditional prosecution by completing treatment, community service, or other requirements. Successful completion often results in dismissed charges or reduced penalties."
            },
            "programCard": {
              "location": "Location",
              "county": "County",
              "moreLocations": "+{{count}} more",
              "programTypes": "Program Types",
              "eligibility": "Eligibility",
              "contactInformation": "Contact Information",
              "visitWebsite": "Visit Website"
            },
            "emptyState": {
              "title": "No programs found",
              "description": "Try adjusting your search location or filters to find programs in your area.",
              "clearFilters": "Clear Filters"
            },
            "quickNav": {
              "legalGuidanceTitle": "Need Legal Guidance?",
              "legalGuidanceDesc": "Get personalized legal advice for your specific charges and situation.",
              "legalGuidanceButton": "Get Legal Guidance",
              "recordClearingTitle": "Learn About Record Clearing",
              "recordClearingDesc": "Check if you're eligible to expunge or seal your criminal record.",
              "recordClearingButton": "Check Eligibility"
            }
          },
          "recordExpungement": {
            "hero": {
              "title": "Record Expungement",
              "subtitle": "Check if you're eligible to clear your criminal record and get a fresh start"
            },
            "navigation": {
              "backToHome": "Back to Home"
            },
            "infoBanner": {
              "title": "What is Record Expungement?",
              "description": "Expungement removes or seals criminal records from public view, helping you move forward without the burden of past convictions affecting employment, housing, or other opportunities.",
              "stateNote": "Each state has different rules, waiting periods, and eligibility requirements."
            },
            "eligibilityForm": {
              "title": "Check Your Eligibility",
              "stateQuestion": "Which state was your conviction in?",
              "statePlaceholder": "Select your state...",
              "federalCourt": "Federal Court",
              "offenseTypeQuestion": "What type of offense was it?",
              "misdemeanor": "Misdemeanor",
              "felony": "Felony",
              "completionDateQuestion": "When did you complete your sentence/probation?",
              "offenseCategoryQuestion": "What type of offense was it? (e.g., drug possession, DUI, theft, assault)",
              "offenseCategoryPlaceholder": "e.g., drug possession, theft, DUI, assault",
              "multipleConvictions": "I have multiple convictions on my record",
              "checkEligibility": "Check Eligibility",
              "reset": "Reset"
            },
            "eligibilityResult": {
              "likelyEligible": "Likely Eligible",
              "possiblyEligible": "Possibly Eligible",
              "unlikelyEligible": "Unlikely Eligible",
              "nextSteps": "Next Steps",
              "stateInfo": "{{state}} Expungement Information",
              "overview": "Overview",
              "commonExclusions": "Common Exclusions",
              "moreExclusions": "+{{count}} more",
              "legalSources": "Legal Sources",
              "disclaimerTitle": "Important:",
              "disclaimerText": "This is a preliminary assessment only. Eligibility depends on many factors including specific circumstances, local rules, and judicial discretion. Consult with a qualified attorney for definitive legal advice about your situation."
            },
            "quickNav": {
              "legalHelpTitle": "Need Legal Help?",
              "legalHelpDesc": "Get personalized legal guidance for your specific situation.",
              "legalHelpButton": "Get Legal Guidance",
              "diversionProgramsTitle": "Find Diversion Programs",
              "diversionProgramsDesc": "Explore alternative programs that may help avoid conviction.",
              "diversionProgramsButton": "Explore Options"
            }
          },
          "friendsFamily": {
            "hero": {
              "title": "Helping an Arrested Friend or Family Member",
              "subtitle": "Practical steps you can take to support someone who has been arrested or detained"
            },
            "criticalAlert": {
              "title": "First 24 Hours Are Critical:",
              "text": "Quick action can make a significant difference in helping your loved one. Focus on gathering information, securing legal representation, and providing support."
            },
            "sectionTitle": "Step-by-Step Action Plan",
            "step1": {
              "title": "Find Out Where They Are Being Held",
              "description": "The first step is locating which facility is holding your loved one.",
              "howToFindTitle": "How to Find Them:",
              "howToFind1": "Call local police station or county jail",
              "howToFind2": "Check online inmate locator (county sheriff website)",
              "howToFind3": "Call the court clerk's office",
              "howToFind4": "For federal arrests: call Federal Bureau of Prisons",
              "infoToProvideTitle": "Information to Provide:",
              "infoToProvide1": "Full legal name",
              "infoToProvide2": "Date of birth",
              "infoToProvide3": "Approximate date/time of arrest",
              "infoToProvide4": "Location where arrested (if known)"
            },
            "step2": {
              "title": "Secure Legal Representation",
              "description": "Getting a lawyer involved early is one of the most important things you can do.",
              "alertTitle": "Important:",
              "alertText": "If they can't afford a lawyer, they have the right to a public defender. Don't delay - ask for one when they first see the judge.",
              "publicDefenderTitle": "Public Defender",
              "publicDefenderDesc": "Free for those who can't afford a lawyer. Ask for one at first court appearance or through court clerk.",
              "legalAidTitle": "Legal Aid Organizations",
              "legalAidDesc": "Free or low-cost legal services for qualifying individuals.",
              "privateAttorneyTitle": "Private Attorney",
              "privateAttorneyDesc": "Hired representation. Can be expensive but may offer more personalized attention."
            },
            "step3": {
              "title": "Gather Important Information",
              "description": "Collect details that will help their attorney and prepare for court proceedings.",
              "keyInfoTitle": "Key Information to Document:",
              "keyInfo1": "Booking number/inmate number",
              "keyInfo2": "Charges filed against them",
              "keyInfo3": "Court date and time",
              "keyInfo4": "Bail amount (if set)",
              "keyInfo5": "Names of arresting officers",
              "keyInfo6": "Case number",
              "keyInfo7": "Name of assigned public defender (if applicable)",
              "keyInfo8": "Witness contact information"
            },
            "step4": {
              "title": "Understand Bail and Bonding",
              "description": "Bail allows temporary release from jail while awaiting trial.",
              "bailOptionsTitle": "Bail Options:",
              "cashBailTitle": "Cash Bail:",
              "cashBailDesc": "Pay full amount to court (refunded after case ends)",
              "bailBondTitle": "Bail Bond:",
              "bailBondDesc": "Pay 10-15% to bondsman (non-refundable)",
              "propertyBondTitle": "Property Bond:",
              "propertyBondDesc": "Use property as collateral",
              "rorTitle": "Release on Recognizance:",
              "rorDesc": "Released without payment (low flight risk)",
              "warningTitle": "Bail Bondsman Warning:",
              "warningText": "If you use a bondsman, you're responsible if the person doesn't appear in court. You could lose your collateral or be required to pay the full bail amount."
            },
            "step5": {
              "title": "Provide Ongoing Support",
              "description": "Being arrested is stressful. Here's how you can help throughout the process.",
              "practicalHelpTitle": "Practical Help:",
              "practicalHelp1": "Attend court hearings for support",
              "practicalHelp2": "Help gather character references",
              "practicalHelp3": "Collect employment records",
              "practicalHelp4": "Secure important documents",
              "practicalHelp5": "Manage their affairs while detained",
              "practicalHelp6": "Deposit money for commissary/phone calls",
              "emotionalSupportTitle": "Emotional Support:",
              "emotionalSupport1": "Stay in contact through approved channels",
              "emotionalSupport2": "Write letters if visits aren't possible",
              "emotionalSupport3": "Remain positive and encouraging",
              "emotionalSupport4": "Don't discuss case details on monitored calls",
              "emotionalSupport5": "Help them stay connected with family",
              "emotionalSupport6": "Support mental health needs"
            },
            "warnings": {
              "title": "Important Reminders",
              "jailCallsTitle": "Never Discuss Case Details on Jail Phones:",
              "jailCallsText": "All calls from jail are recorded and can be used as evidence. Only discuss the case with their attorney through approved confidential channels.",
              "interferenceTitle": "Don't Try to Interfere:",
              "interferenceText": "Never attempt to contact witnesses, destroy evidence, or interfere with the investigation. This can result in additional charges for both you and your loved one."
            },
            "disclaimer": {
              "title": "Legal Disclaimer:",
              "text": "This information is for educational purposes only and does not constitute legal advice. Every situation is different. Consult with a qualified attorney for guidance specific to your loved one's case."
            },
            "privacyBanner": {
              "title": "Privacy First:",
              "text": "We do not store your personal data — all input deleted after session."
            }
          },
          "courtLocator": {
            "hero": {
              "title": "Find Your Local Court",
              "subtitle": "Locate nearby courthouses using free government data sources and OpenStreetMap. Get contact information, hours of operation, and available services in your area."
            },
            "search": {
              "inputPlaceholder": "Enter ZIP code",
              "searchButton": "Search",
              "searching": "Searching...",
              "error": "Please enter a valid 5-digit ZIP code",
              "errorGeneral": "Unable to search for offices. Please try again or contact your local court for information.",
              "limitedData": "Limited court data available for this area. Showing sample results.",
              "sampleData": "Using sample data. Some court information may be limited for this area."
            },
            "results": {
              "title": "Court Search Results",
              "foundCourts": "Found {{count}} courthouse{{plural}} in your area",
              "noCourts": "No courts found",
              "tryDifferent": "Try searching with a different ZIP code"
            },
            "sections": {
              "stateTitle": "State & Local Courts ({{count}})",
              "stateDesc": "Courts organized by county, with same-county courts listed first",
              "federalTitle": "Federal Courts ({{count}})",
              "federalDesc": "Federal courts handle federal crimes and civil cases"
            },
            "courtTypes": {
              "federal": "Federal Court",
              "state": "State Court",
              "municipal": "Municipal Court",
              "traffic": "Traffic Court",
              "bankruptcy": "Bankruptcy Court",
              "court": "Court"
            },
            "courtCard": {
              "phone": "Phone",
              "hours": "Hours",
              "services": "Services",
              "directions": "Get Directions",
              "milesAway": "{{distance}} mi away"
            },
            "info": {
              "title": "Understanding Court Types",
              "subtitle": "Different courts handle different types of cases. Here's what you need to know.",
              "federal": {
                "title": "Federal Courts",
                "desc": "Handle violations of federal law, including federal crimes, bankruptcy, and cases involving federal agencies or constitutional questions.",
                "examples": "Bank robbery, drug trafficking across state lines, federal tax evasion, immigration violations"
              },
              "state": {
                "title": "State Courts",
                "desc": "Handle most criminal and civil cases, including felonies, misdemeanors, family law, and state law violations.",
                "examples": "Assault, theft, DUI, domestic violence, probate, family court matters"
              },
              "municipal": {
                "title": "Municipal Courts",
                "desc": "Handle local ordinance violations and minor offenses within city limits.",
                "examples": "Noise complaints, zoning violations, minor traffic offenses, city code violations"
              }
            },
            "faq": {
              "title": "Frequently Asked Questions",
              "q1": "How do I know which court handles my case?",
              "a1": "The type of charge determines which court has jurisdiction. Federal crimes go to federal court, state crimes to state court. Check your court summons or contact the court clerk if you're unsure.",
              "q2": "Can I visit the courthouse before my court date?",
              "a2": "Yes, most courthouses are open to the public during business hours. This can help you find the correct courtroom and feel more comfortable on your actual court date.",
              "q3": "What should I bring to court?",
              "a3": "Bring your court summons, valid ID, any relevant documents related to your case, and a pen and paper to take notes. Dress professionally and arrive early."
            },
            "courtInformation": {
              "title": "Important Court Information",
              "courtTypesCard": {
                "title": "Court Types",
                "description": "Different courts handle different types of cases. Federal courts handle federal crimes, state courts handle most criminal cases, and municipal courts handle local violations."
              },
              "courtHoursCard": {
                "title": "Court Hours",
                "description": "Most courts operate Monday through Friday during business hours. Some courts have extended hours or weekend sessions for certain matters."
              },
              "dataSourcesCard": {
                "title": "Data Sources",
                "description": "Court locations from OpenStreetMap and CourtListener (Free Law Project). Always call ahead to confirm hours and procedures as data may vary."
              }
            }
          },
          "developmentRoadmap": {
            "hero": {
              "title": "Development Roadmap",
              "subtitle": "Our Vision for the Future",
              "description": "Track our progress as we build the most comprehensive free legal assistance platform. This roadmap is transparent, data-driven, and focused on expanding access to justice.",
              "openSourceNote": "This project is open-source (MIT License for code, CC0 for documentation) and built in public. We're committed to transparency in development and decision-making."
            },
            "mission": {
              "title": "Our Mission & Principles",
              "accessToJustice": {
                "title": "Access to Justice",
                "description": "Making legal guidance accessible to everyone, regardless of economic status or location"
              },
              "privacyFirst": {
                "title": "Privacy First",
                "description": "Protecting user privacy with ephemeral sessions and no data retention"
              },
              "continuousImprovement": {
                "title": "Continuous Improvement",
                "description": "Iterating based on user feedback and evolving legal landscape"
              }
            },
            "stats": {
              "completed": "Completed",
              "inProgress": "In Progress",
              "planned": "Planned",
              "researching": "Researching"
            },
            "categories": {
              "all": "All Categories",
              "data": "Data Sources",
              "features": "Features",
              "infrastructure": "Infrastructure",
              "ai": "AI & Machine Learning",
              "legal": "Legal Content"
            },
            "filters": {
              "title": "Filter by Category",
              "viewAll": "View All"
            },
            "progress": {
              "overall": "Overall Progress",
              "completion": "{{percent}}% Complete"
            },
            "status": {
              "completed": "Completed",
              "inProgress": "In Progress",
              "planned": "Planned",
              "researching": "Researching"
            },
            "priority": {
              "critical": "Critical",
              "high": "High",
              "medium": "Medium",
              "low": "Low"
            },
            "roadmapItem": {
              "estimatedCompletion": "Est. Completion",
              "dependencies": "Dependencies",
              "challenges": "Challenges",
              "impact": "Impact",
              "progress": "Progress"
            },
            "items": {
              "attorneyTools": {
                "title": "Attorney Tools Portal",
                "description": "Dedicated section for licensed attorneys with court records lookup, document resources, and professional tools. Foundation for attorney-specific features.",
                "impact": "Enables specialized features for legal professionals while maintaining shared access to core resources"
              },
              "courtlistener": {
                "title": "CourtListener API Integration",
                "description": "Complete integration with Free Law Project's CourtListener API for 8.4+ million court opinions and federal dockets",
                "impact": "Provides foundational access to federal case law and court records"
              },
              "pacer": {
                "title": "PACER Authentication & Data Access",
                "description": "Implement PACER authentication API and cost-effective document retrieval system",
                "impact": "Access to 500M+ federal court documents and real-time case updates",
                "challenges": {
                  "cost": "Cost management for $0.10/page",
                  "rateLimit": "Rate limiting compliance",
                  "bulk": "Bulk data optimization"
                }
              },
              "stateStatutes": {
                "title": "State Laws Database",
                "description": "Complete 50-state + DC coverage achieved with 1,255 criminal statutes across 12 offense categories including homicide, assault, theft, fraud, drug offenses, and more. 713 validated charge-statute matches with links to official legislature websites.",
                "impact": "Full nationwide coverage of state criminal statutes"
              },
              "aiGuidance": {
                "title": "AI Legal Guidance Engine",
                "description": "Advanced AI system for generating personalized legal guidance based on case parameters. Currently powered by Claude Sonnet 4 with jurisdiction-aware prompting.",
                "impact": "Core functionality for personalized legal assistance",
                "challenges": {
                  "accuracy": "Legal accuracy validation",
                  "bias": "Bias detection and mitigation",
                  "jurisdiction": "Jurisdiction-specific nuances"
                }
              },
              "attorneyDocGen": {
                "title": "Attorney Document Generation",
                "description": "28 AI-powered document templates for licensed attorneys: 17 criminal motions (all 50 states + DC, by county/ward) and 11 immigration motions (EOIR format, by district/division). Covers all case phases from initial filings through post-sentencing.",
                "impact": "Reduces time burden on public defenders and legal aid attorneys handling high caseloads"
              },
              "publicApiV1": {
                "title": "Public REST API v1",
                "description": "Open API providing third-party access to legal content, criminal charges, diversion programs, glossary terms, and expungement rules. Includes OpenAPI specification, embeddable widgets, CORS support, and rate limiting.",
                "impact": "Enables legal aid organizations and developers to integrate our data into their own tools"
              },
              "securityAudit": {
                "title": "Security & Code Audit",
                "description": "Comprehensive security hardening: removed PII from AI prompts, moved API keys from URLs to secure headers, structured production-safe logging, removed 1,400+ lines of dead code, and uninstalled unused dependencies.",
                "impact": "Stronger data privacy protections and a cleaner, more maintainable codebase"
              },
              "bilingualSupport": {
                "title": "Trilingual English/Spanish/Chinese Support",
                "description": "Full trilingual support across the entire platform including case guidance, rights information, criminal charges, glossary terms, immigration guidance, case timeline, quick-reference cards, and site-wide search. Over 3,150 translation keys in each language.",
                "impact": "Accessible legal information for Spanish-speaking and Chinese-speaking communities navigating the justice system"
              },
              "additionalLanguages": {
                "title": "Additional Language Support",
                "description": "Expand beyond English, Spanish, and Chinese to include Vietnamese, Korean, Tagalog, and other languages common in immigrant communities.",
                "impact": "Broader access for non-English speaking individuals navigating the justice system"
              },
              "expandedJurisdictions": {
                "title": "Expanded Jurisdiction Coverage",
                "description": "Add court-specific rules, local procedures, and jurisdiction-specific guidance for additional states and counties.",
                "impact": "More accurate, locally-relevant guidance for users across the country"
              },
              "judgeAnalytics": {
                "title": "Judge & Court Analytics",
                "description": "Statistical analysis of sentencing patterns, plea agreements, and judicial decision-making",
                "impact": "Predictive insights for case strategy and outcomes",
                "challenges": {
                  "privacy": "Data privacy concerns",
                  "significance": "Statistical significance",
                  "historicalBias": "Bias in historical data"
                }
              },
              "mobileApp": {
                "title": "Mobile Application",
                "description": "Native mobile apps for iOS and Android with offline capabilities for emergency situations",
                "impact": "Accessibility during arrest and emergency situations"
              },
              "privacyEncryption": {
                "title": "Advanced Privacy & Encryption",
                "description": "Complete privacy protection: NLP-based PII detection, anonymous consent tracking, transport encryption (HTTPS), encryption at rest (database), and session-based ephemerality with user-controlled data deletion.",
                "impact": "Maximum privacy protection for vulnerable users"
              },
              "clientE2E": {
                "title": "Client-Side End-to-End Encryption",
                "description": "Advanced future feature: Browser-based encryption where user data is encrypted before leaving the device, ensuring zero-knowledge architecture.",
                "impact": "Ultimate privacy for extremely sensitive consultations",
                "challenges": {
                  "keyManagement": "Secure key generation and storage in browser without server access",
                  "aiCompatibility": "AI processing requires plaintext - trade-off between encryption and guidance quality"
                }
              }
            },
            "badges": {
              "quickWin": "Quick Win"
            },
            "getInvolved": {
              "title": "Get Involved",
              "subtitle": "This is a community-driven project. Here's how you can contribute:",
              "contribute": {
                "title": "Contribute on GitHub",
                "description": "Submit code, report bugs, or suggest improvements"
              },
              "feedback": {
                "title": "Share Feedback",
                "description": "Tell us what features would help you most"
              },
              "spread": {
                "title": "Spread the Word",
                "description": "Share this tool with those who need legal assistance"
              }
            },
            "featureRequest": {
              "modalTitle": "Request a Feature",
              "description": "Have an idea for how we can better serve individuals navigating the legal system? We'd love to hear from you.",
              "nameLabel": "Your Name",
              "namePlaceholder": "Enter your name",
              "emailLabel": "Email Address",
              "emailPlaceholder": "Enter your email",
              "descriptionLabel": "Feature Description",
              "descriptionPlaceholder": "Describe the feature you'd like to see...",
              "submitButton": "Submit Request",
              "cancelButton": "Cancel",
              "requestButton": "Request a Feature",
              "validationName": "Missing Information",
              "validationNameDesc": "Please fill out all fields.",
              "validationEmail": "Invalid Email",
              "validationEmailDesc": "Please enter a valid email address.",
              "successTitle": "Email Client Opened",
              "successDesc": "Your default email client should open. Please send the email to submit your request.",
              "disclaimer": "By submitting a feature request, you consent to us contacting you about your suggestion. We respect your privacy and will not share your information."
            },
            "transparency": {
              "title": "Commitment to Transparency",
              "description": "We believe in open development. All progress, challenges, and decisions are shared publicly to maintain accountability and build trust with the communities we serve."
            }
          },
          "missionStatement": {
            "hero": {
              "title": "Mission Statement",
              "subtitle": "Public Defender AI is a public good dedicated to leveraging artificial intelligence, legal data, and automation to provide timely, accurate, and accessible assistance to individuals in the United States who are accused of crimes and may not have immediate access to legal counsel. This platform is built on open-source principles with MIT licensing for code and CC0 (Creative Commons Zero) for documentation, ensuring it remains free and accessible to all who need it."
            },
            "goals": {
              "title": "Our Primary Goals",
              "expandAccess": {
                "title": "Expand Access to Justice",
                "description": "Deliver preliminary legal information, guidance, and case-relevant insights to defendants at no cost, reducing barriers for underserved populations."
              },
              "supportDefenders": {
                "title": "Support Public Defender Workflows",
                "description": "Provide public defenders with fast access to aggregated legal data, case statistics, and procedural requirements to help them prepare more effective defense strategies."
              },
              "empowerDecisions": {
                "title": "Empower Informed Decision-Making",
                "description": "Enable defendants to better understand their rights, legal options, and potential outcomes through clear, plain-language explanations grounded in reliable data."
              },
              "increaseFairness": {
                "title": "Increase Efficiency and Fairness",
                "description": "Automate collection and synthesis of public legal datasets so that defendants and attorneys can quickly identify relevant precedents, procedural rules, and plea or sentencing trends."
              }
            },
            "principles": {
              "title": "Guiding Principles",
              "description": "This project is guided by the principles of fairness, transparency, data privacy, and compliance with applicable laws and ethical guidelines governing legal practice.",
              "disclaimer": "The AI agent is not a substitute for a licensed attorney but a support tool to supplement human legal counsel and improve access to equitable defense resources."
            }
          },
          "privacyPolicy": {
            "hero": {
              "title": "Privacy Policy",
              "subtitle": "We are committed to protecting your privacy. This policy explains how we handle your information.",
              "lastUpdated": "Last Updated: February 4, 2026"
            },
            "notice": {
              "title": "Privacy-First Platform:",
              "description": "We do not collect or store personal data. Your privacy is protected by default."
            },
            "principles": {
              "title": "Our Privacy Principles",
              "noPersonalData": {
                "title": "No Personal Data Collection",
                "description": "We do not collect, store, or maintain any personally identifiable information. This includes names, addresses, case details, charges, or any other information that could identify you personally. All interactions with our platform are anonymous."
              },
              "anonymizedData": {
                "title": "Anonymized Data Only",
                "description": "We may collect anonymized, aggregated data for the following purposes:",
                "usage": {
                  "metrics": "Understanding how our platform is used to improve user experience",
                  "improvements": "Identifying features and resources that are most helpful",
                  "integrations": "Providing anonymized insights to third parties who wish to integrate our services into their platforms"
                }
              },
              "noSharing": {
                "title": "No Data Sharing or Sale",
                "description": "We do not share, sell, or provide your data to any third parties. Since we do not collect personal data, we could not share it even if we wanted to. Any anonymized data shared is completely stripped of identifying information."
              }
            },
            "caseData": {
              "title": "How We Protect Your Case Information",
              "summary": "When you use our legal guidance tool, your case information receives multiple layers of protection. Here's exactly what happens to your data:",
              "memoryOnly": {
                "title": "Memory-Only Storage",
                "description": "Your case information is stored only in temporary server memory - it is never written to a database or saved to disk. This means your data exists only while being processed and cannot be recovered after your session ends."
              },
              "piiRedaction": {
                "title": "Personal Information Automatically Removed",
                "description": "Before your case details are processed by our AI, we automatically detect and remove personal information like names, phone numbers, email addresses, and Social Security numbers. This redaction happens locally on our servers using machine learning - your personal details are never sent to external AI services."
              },
              "autoDelete": {
                "title": "Automatic 24-Hour Deletion",
                "description": "Even in memory, your case data has a maximum lifespan of 24 hours. After this time, it is automatically and permanently deleted. You don't need to take any action - deletion happens automatically."
              },
              "serverRestart": {
                "title": "Cleared on Server Restart",
                "description": "Because data is stored only in memory, any server restart or update completely clears all session data. This happens regularly as we improve the platform, providing an additional layer of data ephemerality."
              }
            },
            "technical": {
              "title": "Technical Details",
              "sessions": {
                "title": "Session Data",
                "description": "Temporary session data is used to maintain your browsing experience during a single visit. This data is automatically deleted when you close your browser or end your session. No session information is stored permanently."
              },
              "logs": {
                "title": "Server Logs",
                "description": "Our web servers may temporarily collect standard technical information such as IP addresses, browser type, and access times for security and troubleshooting purposes. These logs are retained for a limited time and are not used to identify individual users."
              },
              "external": {
                "title": "External Data Sources",
                "description": "Our platform accesses public legal databases and services to provide you with information:",
                "services": {
                  "anthropic": "Anthropic Claude Sonnet 4 - for generating legal guidance and document summaries. Your personal information is removed before processing. Anthropic may retain data for up to 30 days for operational and safety purposes, then it is automatically deleted. This data is never used to train AI models.",
                  "govInfo": "GovInfo.gov API - for federal criminal statutes (Title 18 USC)",
                  "courtListener": "CourtListener API - for case law and court data",
                  "recap": "RECAP Archive - for federal court documents",
                  "cornell": "Cornell Legal Information Institute - for legal statutes",
                  "openLaws": "OpenLaws API - for state statute text and legal data"
                },
                "note": "When you use our platform to search these databases, your queries may be transmitted to these services. Personal information is automatically redacted before being sent to AI services. We recommend reviewing their privacy policies if you have concerns about external data access."
              }
            },
            "rights": {
              "title": "Your Privacy Rights",
              "description": "Because we do not collect or store personal data, you automatically have the following protections:",
              "list": {
                "noDataStored": "No data to access, modify, or delete - we never store it in the first place",
                "sessionControl": "Full control over session data - simply close your browser to end all tracking",
                "noTracking": "No cross-site tracking, cookies, or persistent identifiers"
              }
            },
            "changes": {
              "title": "Changes to This Policy",
              "description": "We may update this privacy policy from time to time. The date of the last update is shown at the top of this page. Continued use of our platform after changes constitutes acceptance of the updated policy."
            },
            "contact": {
              "title": "Questions About Privacy?",
              "description": "If you have questions about how we protect your privacy, please reach out through our public GitHub repository or community channels."
            }
          },
          "documentLibrary": {
            "title": "Case Documents Library",
            "subtitle": "Understand the documents you may receive during your case. Each section is explained in plain language.",
            "importance": {
              "critical": "Critical",
              "important": "Important",
              "informational": "Informational"
            },
            "card": {
              "purpose": "Purpose",
              "whatToDo": "What To Do With This Document",
              "sections": "Document Sections"
            },
            "filter": {
              "label": "Filter by:",
              "phase": "Case Phase",
              "category": "Category",
              "allPhases": "All Phases",
              "allCategories": "All Categories",
              "criminal": "Criminal Justice",
              "immigration": "Immigration",
              "showing": "{{count}} documents"
            },
            "tabs": {
              "criminal": "Criminal Justice",
              "immigration": "Immigration"
            },
            "noDocuments": "No documents match your filters.",
            "cta": {
              "title": "Need Personalized Guidance?",
              "description": "Our AI assistant can help you understand which documents you should have for your specific situation.",
              "button": "Get Guidance"
            }
          },
          "documents": {
            "citationTicket": {
              "title": "Citation / Ticket",
              "description": "A written notice given for minor offenses instead of a physical arrest.",
              "purpose": "This document officially notifies you of the charges against you and tells you when and where to appear in court. It serves as your summons to court.",
              "whatToDo": "Keep this document safe! Note the court date and case number. Failing to appear on the listed date can result in a warrant for your arrest.",
              "sections": {
                "charges": { "label": "Offense/Charges Listed", "explanation": "This section shows what you are accused of doing. It references specific laws or codes you allegedly violated." },
                "courtDate": { "label": "Court Appearance Date", "explanation": "This is the date and time you MUST appear in court. Missing this date can result in additional charges and an arrest warrant." },
                "caseNumber": { "label": "Case/Citation Number", "explanation": "A unique identifier for your case. You'll need this number to look up your case online or when calling the court." },
                "bailAmount": { "label": "Bail/Bond Amount", "explanation": "The amount of money you may need to pay to be released or to avoid jail. Not all citations include this." }
              }
            },
            "arrestWarrant": {
              "title": "Arrest Warrant",
              "description": "A court order authorizing police to arrest you.",
              "purpose": "This document, signed by a judge, gives police legal authority to arrest you. It means a judge found enough evidence (probable cause) to believe you committed a crime.",
              "whatToDo": "If you're shown a warrant, don't resist. Ask for a copy and note the judge's name and charges listed. Contact an attorney immediately.",
              "sections": {
                "probableCause": { "label": "Statement of Probable Cause", "explanation": "This explains why the judge believes you may have committed a crime. It summarizes the evidence or allegations against you." },
                "judgeSignature": { "label": "Judge's Signature", "explanation": "A valid arrest warrant must be signed by a judge or magistrate. Without this signature, the warrant may not be valid." },
                "chargesListed": { "label": "Charges Listed", "explanation": "The specific crimes you are accused of. This determines how serious your case is and what penalties you might face." }
              }
            },
            "propertyVoucher": {
              "title": "Property Voucher",
              "description": "A receipt listing all personal items taken from you during arrest.",
              "purpose": "This is your proof of what belongings police took when you were arrested. You'll need this to get your property back after your case is resolved.",
              "whatToDo": "Keep this document! Check that all items are listed correctly. You'll need the voucher number to reclaim your property. Report any missing items immediately.",
              "sections": {
                "itemsList": { "label": "Items Listed", "explanation": "A detailed list of everything taken from you - wallet, phone, jewelry, cash amounts, etc. Verify this is accurate before signing." },
                "voucherNumber": { "label": "Voucher Number", "explanation": "The unique number you'll need to get your property back. Write this down separately in case you lose the paper." },
                "officerInfo": { "label": "Officer Information", "explanation": "The name and badge number of the officer who took your property. This helps if there are disputes about your belongings." }
              }
            },
            "bookingPapers": {
              "title": "Booking Papers",
              "description": "Documents created when you are processed into jail.",
              "purpose": "These papers record your arrest information, the charges against you, and your personal information. They become part of your arrest record.",
              "whatToDo": "Review for accuracy. Errors in booking papers can cause problems later. Note your booking number - family can use this to locate you or post bail.",
              "sections": {
                "personalInfo": { "label": "Personal Information", "explanation": "Your name, address, date of birth, and physical description. Make sure this is accurate to avoid identity issues." },
                "arrestDetails": { "label": "Arrest Details", "explanation": "When, where, and why you were arrested. This information will be important for your defense." },
                "bookingNumber": { "label": "Booking Number", "explanation": "A unique identifier for your jail stay. Family members can use this to find you in the jail system or arrange bail." }
              }
            },
            "mirandaAcknowledgment": {
              "title": "Miranda Rights Acknowledgment",
              "description": "A form documenting that you were informed of your rights.",
              "purpose": "This documents that police told you about your right to remain silent and your right to an attorney before questioning you.",
              "whatToDo": "You don't have to sign this. If you do, it doesn't mean you're giving up your rights - you can still remain silent and ask for a lawyer at any time.",
              "sections": {
                "rightsListed": { "label": "Rights Listed", "explanation": "Your Miranda rights: right to remain silent, anything you say can be used against you, right to an attorney, right to a free attorney if you can't afford one." },
                "waiverSection": { "label": "Waiver Section", "explanation": "This asks if you voluntarily give up these rights. You do NOT have to sign this. Even if you do, you can invoke your rights at any time during questioning." }
              }
            },
            "criminalComplaint": {
              "title": "Criminal Complaint",
              "description": "The formal document that officially charges you with a crime.",
              "purpose": "This is the prosecutor's official statement of what crimes you're accused of and the basic facts they claim prove you're guilty. It starts your criminal case.",
              "whatToDo": "Read this carefully with your attorney. It tells you exactly what you're being charged with. Your defense strategy will be built around responding to these allegations.",
              "sections": {
                "charges": { "label": "Criminal Charges", "explanation": "The specific crimes you're accused of, including the degree (misdemeanor vs. felony). Each charge has different potential penalties." },
                "factsAlleged": { "label": "Statement of Facts", "explanation": "The prosecutor's version of what happened. This is what they will try to prove at trial. Your attorney will look for weaknesses in this story." },
                "statuteCitations": { "label": "Statute Citations", "explanation": "The specific laws you allegedly broke. These code sections define what the prosecutor must prove to convict you." }
              }
            },
            "arraignmentNotice": {
              "title": "Arraignment Notice",
              "description": "Notice of your first court appearance after arrest.",
              "purpose": "This tells you when and where you must appear for your arraignment - the hearing where you'll be formally told the charges and asked to enter a plea.",
              "whatToDo": "Do not miss this date! Arrive early. If you don't have a lawyer, tell the judge you want a public defender. You'll typically plead 'not guilty' at this stage.",
              "sections": {
                "courtLocation": { "label": "Court Location", "explanation": "The specific courthouse, room number, and address where you must appear. Arrive early to go through security and find the right courtroom." },
                "dateTime": { "label": "Date and Time", "explanation": "Exactly when you must appear. Missing this date will likely result in a bench warrant for your arrest." },
                "caseNumber": { "label": "Case Number", "explanation": "Your unique case identifier. Use this to check in with the court clerk when you arrive." }
              }
            },
            "bailBondOrder": {
              "title": "Bail/Bond Order",
              "description": "The court's decision on bail and conditions for your release.",
              "purpose": "This document explains how much bail you owe, any conditions you must follow while released, and the consequences of violating those conditions.",
              "whatToDo": "Follow ALL conditions strictly. Violations can result in re-arrest and bail being revoked. Keep this document - it lists your next court date.",
              "sections": {
                "bailAmount": { "label": "Bail Amount", "explanation": "The money required for your release. You may pay the full amount (refunded after case ends) or use a bail bondsman (typically 10% non-refundable fee)." },
                "conditions": { "label": "Release Conditions", "explanation": "Rules you must follow while out on bail - like not contacting certain people, not leaving the state, or drug testing. Breaking these can send you back to jail." },
                "nextCourtDate": { "label": "Next Court Date", "explanation": "Your next required court appearance. Missing this date forfeits your bail money and results in an arrest warrant." }
              }
            },
            "discoveryDocuments": {
              "title": "Discovery Documents",
              "description": "Evidence the prosecution must share with your defense.",
              "purpose": "These are all the materials the prosecutor plans to use against you at trial. Your attorney has the right to see this evidence so they can prepare your defense.",
              "whatToDo": "Review these carefully with your attorney. Discovery can reveal weaknesses in the prosecution's case or evidence that supports your innocence.",
              "sections": {
                "policeReports": { "label": "Police Reports", "explanation": "Officers' written accounts of what happened. These often contain details that can be challenged or contradicted by other evidence." },
                "witnessStatements": { "label": "Witness Statements", "explanation": "What witnesses told police. Your attorney will analyze these for inconsistencies and prepare for cross-examination." },
                "evidenceList": { "label": "Evidence List", "explanation": "Physical evidence, videos, photos, lab results, etc. Your attorney can challenge how this evidence was collected or interpreted." }
              }
            },
            "pleaOffer": {
              "title": "Plea Offer",
              "description": "A written offer from the prosecutor to resolve your case without trial.",
              "purpose": "This proposes a deal: plead guilty to certain charges in exchange for reduced penalties or dropped charges. About 90% of cases are resolved through plea bargains.",
              "whatToDo": "Discuss this carefully with your attorney before responding. Consider the strength of the evidence, potential trial outcomes, and personal circumstances. You don't have to accept.",
              "sections": {
                "offeredCharges": { "label": "Charges You'd Plead To", "explanation": "The specific charges you would admit guilt to. These may be less serious than your original charges." },
                "recommendedSentence": { "label": "Recommended Sentence", "explanation": "What punishment the prosecutor recommends. Note: The judge doesn't have to follow this recommendation." },
                "deadline": { "label": "Offer Deadline", "explanation": "How long you have to accept this deal. After the deadline, the offer may be withdrawn or become less favorable." }
              }
            },
            "subpoena": {
              "title": "Subpoena",
              "description": "A court order requiring you to appear in court or provide documents.",
              "purpose": "This legally compels you to testify as a witness or produce documents/records. Ignoring a subpoena can result in contempt of court charges.",
              "whatToDo": "Take this seriously! Contact an attorney if you have concerns about testifying. You must appear on the date listed unless a judge excuses you.",
              "sections": {
                "appearanceRequired": { "label": "Appearance Details", "explanation": "When and where you must appear. This is not optional - failure to appear can result in arrest." },
                "documentsRequested": { "label": "Documents Requested", "explanation": "Specific records or items you must bring. A 'subpoena duces tecum' requires you to produce documents." }
              }
            },
            "sentencingOrder": {
              "title": "Sentencing Order / Judgment",
              "description": "The official document stating your sentence after conviction.",
              "purpose": "This is the court's final decision on your punishment - jail time, fines, probation, community service, etc. It becomes part of your permanent record.",
              "whatToDo": "Review for accuracy. Understand all conditions you must follow. Know your appeal deadline (usually 30 days). Keep this document for your records.",
              "sections": {
                "sentenceImposed": { "label": "Sentence Imposed", "explanation": "Your specific punishment - jail/prison time, whether it's suspended, and how it will be served (straight time vs. work release, etc.)." },
                "finesRestitution": { "label": "Fines and Restitution", "explanation": "Money you owe - court fees, fines, and payments to victims. These are legally enforceable debts." },
                "probationTerms": { "label": "Probation Terms", "explanation": "Rules you must follow during probation - reporting to a probation officer, drug testing, travel restrictions, etc. Violations can mean jail time." },
                "appealRights": { "label": "Appeal Rights", "explanation": "Information about your right to appeal the conviction or sentence. You typically have 30 days to file an appeal." }
              }
            },
            "noticeToAppearI862": {
              "title": "Notice to Appear (NTA)",
              "description": "The main charging document that starts deportation proceedings.",
              "purpose": "This is ICE's formal notice that they want to deport you. It orders you to appear before an immigration judge and lists the reasons they claim you can be removed from the US.",
              "whatToDo": "Get an immigration attorney IMMEDIATELY. Note your A-number and hearing date. Check the free legal services list provided. Never miss your hearing - it results in automatic deportation order.",
              "sections": {
                "aNumber": { "label": "Alien Registration Number (A-Number)", "explanation": "Your unique 9-digit identifier in the immigration system. You need this to check your case status online or by phone." },
                "charges": { "label": "Immigration Charges", "explanation": "The legal reasons ICE claims you can be deported - overstayed visa, entered without inspection, criminal conviction, etc." },
                "hearingInfo": { "label": "Hearing Information", "explanation": "Date, time, and location of your immigration court hearing. Sometimes says 'TBD' and you'll get a separate notice later." },
                "legalServices": { "label": "Free Legal Services List", "explanation": "Contact information for free or low-cost immigration attorneys in your area. Call these immediately." }
              }
            },
            "recordDeportableAlienI213": {
              "title": "Record of Deportable/Inadmissible Alien",
              "description": "ICE's record of your arrest and the reasons for detention.",
              "purpose": "This documents how and why you were arrested by immigration officers, including any statements you made. It's often used as evidence against you.",
              "whatToDo": "Review this carefully with an attorney. Check for errors in the facts. Any statements you made can be challenged if you weren't properly informed of your rights.",
              "sections": {
                "arrestCircumstances": { "label": "Arrest Circumstances", "explanation": "How, when, and where ICE arrested you. This may include whether they had a proper warrant." },
                "statementsRecorded": { "label": "Statements Recorded", "explanation": "What ICE says you told them during arrest. These statements can be used against you, so verify their accuracy with your attorney." }
              }
            },
            "bondHearingNotice": {
              "title": "Bond Hearing Notice",
              "description": "Notice of your hearing to request release from immigration detention.",
              "purpose": "This tells you when you can ask an immigration judge to set bond so you can be released from detention while your case proceeds.",
              "whatToDo": "Prepare evidence that you're not a flight risk or danger - community ties, employment, family in the US, etc. An attorney can significantly improve your chances.",
              "sections": {
                "hearingDate": { "label": "Hearing Date", "explanation": "When you can present your case for release. Missing this means you stay detained until your removal hearing." },
                "eligibilityInfo": { "label": "Eligibility Information", "explanation": "Some people aren't eligible for bond due to criminal history or other factors. An attorney can explain your specific situation." }
              }
            },
            "warrantOfRemovalI205": {
              "title": "Warrant of Removal/Deportation",
              "description": "The order authorizing ICE to physically deport you.",
              "purpose": "This means an immigration judge has ordered your removal and ICE can now carry out the deportation. This is issued after you've lost your case or given up the right to fight it.",
              "whatToDo": "Contact an attorney immediately about appeal options. You may have limited time (30 days for BIA appeal). Check if you qualify for any relief or protection.",
              "sections": {
                "removalOrder": { "label": "Removal Order", "explanation": "The official order that you must leave the United States. It includes the legal basis for your removal." },
                "appealDeadline": { "label": "Appeal Deadline", "explanation": "How long you have to challenge this order. Missing this deadline may eliminate your options to stay and fight." }
              }
            },
            "orderOfSupervisionI220B": {
              "title": "Order of Supervision",
              "description": "Conditions for release when you have a removal order but can't be immediately deported.",
              "purpose": "If you have a final deportation order but your home country won't accept you or there are other barriers, ICE may release you under supervision with strict conditions.",
              "whatToDo": "Follow ALL conditions strictly. Report as required. Violations can result in re-detention. Continue working with an attorney on options.",
              "sections": {
                "reportingRequirements": { "label": "Reporting Requirements", "explanation": "How often and where you must check in with ICE. Missing a check-in can result in immediate detention." },
                "travelRestrictions": { "label": "Travel Restrictions", "explanation": "Limits on where you can travel. You typically cannot leave the area without permission and definitely cannot leave the US." }
              }
            },
            "expeditedRemovalI860": {
              "title": "Notice of Expedited Removal",
              "description": "An order for quick deportation without a court hearing.",
              "purpose": "This is used when someone is caught at or near the border without valid entry documents. It allows deportation without seeing an immigration judge.",
              "whatToDo": "If you fear persecution in your home country, you MUST tell the officer immediately. Say 'I am afraid to return to my country.' This triggers a credible fear interview.",
              "sections": {
                "removalGrounds": { "label": "Grounds for Removal", "explanation": "Why ICE claims you can be quickly removed - usually entering without inspection or with fraudulent documents." },
                "fearClaim": { "label": "Fear of Return", "explanation": "If you're afraid to go back to your country (fear of violence, persecution, etc.), you MUST express this fear to get a hearing. This is your only chance to avoid immediate removal." }
              }
            },
            "guidance": {
              "documentsSection": {
                "title": "Documents You Should Have",
                "description": "Based on your case stage, you should have received these important documents. Click any document to learn more.",
                "noneFound": "No specific documents expected at this stage.",
                "learnMore": "Learn More",
                "viewLibrary": "View All Documents"
              }
            }
          },
          "chat": {
          "openChat": "Open legal guidance chat",
          "progress": {
            "step": "Step {{current}} of {{total}}",
            "safety": "Safety",
            "safetyDesc": "Checking if you need immediate help",
            "location": "Location",
            "locationDesc": "Tell us where your case is",
            "charges": "Charges",
            "chargesDesc": "Select the charges you're facing",
            "situation": "Situation",
            "situationDesc": "Your case stage and current status",
            "details": "Details",
            "detailsDesc": "Describe what happened for personalized guidance"
          },
          "messages": {
            "welcome": "Hi! I'm here to help you understand your legal situation. Everything we discuss stays private and is deleted after your session.\n\nAre you in an urgent situation right now?",
            "emergencyAdviceFull": "🚨 **If you're being arrested or detained right now:**\n\n**✅ Stay Calm**\nDo not resist, run, or argue. Keep your hands visible. Resisting can lead to additional charges, even if the original arrest is later found to be unlawful.\n\n**🔇 Exercise Your Right to Remain Silent**\nSay clearly: \"I am exercising my right to remain silent.\"\nYou do NOT have to answer questions about where you're going, what you're doing, or where you live.\n\n**⚖️ Request an Attorney**\nSay: \"I want a lawyer.\" Police must stop questioning you once you ask for an attorney.\nIf you can't afford one, you can request a public defender at your first court appearance.\n\n**🚫 Do Not Consent to Searches**\nSay: \"I do not consent to any searches.\"\nPolice may search anyway, but stating this protects your rights for later.\n\n**📝 Remember These Details**\nNote the officers' badge numbers, patrol car numbers, and any witness information. This can help your case later.\n\n---\n**What would you like to do next?**",
            "mainMenu": "What can I help you with?",
            "stateQuestion": "Let's get you personalized guidance. First, what state is your case in?",
            "chargeQuestion": "Got it, {{state}}. What charges are you facing? Select all that apply.",
            "stageQuestion": "What stage is your case in?",
            "custodyQuestion": "Are you currently in custody or have you been released?",
            "attorneyQuestion": "Do you have an attorney or public defender?",
            "descriptionPrompt": "Thanks for that information. Now, briefly describe what happened - this helps me give you more relevant guidance.\n\n(Your information is analyzed by AI to provide guidance. Personal details are automatically removed before processing. Nothing is stored after your session.)",
            "descriptionPromptWithWarning": "Thanks for that information.\n\n⚠️ **Before You Share Details**\n\nWe would like you to share specifics about your case to receive personalized guidance. Unlike talking to a lawyer, what you type here is not private and could be used against you if you're ever asked about it in court.\n\nWe recommend speaking with a lawyer first. This step is optional—skip it to still receive general guidance.",
            "privilegeWarning": "⚠️ **Before You Share Details**\n\nUnlike talking to a lawyer, what you type here is not private and could be used against you if you're ever asked about it in court.\n\nWe recommend speaking with a lawyer first. This step is optional—skip it to still receive general guidance.",
            "privilegeAcknowledged": "Understood. Go ahead and describe what happened—take your time.",
            "concernsQuestion": "What are you most worried about? Any specific questions?\n\n(For example: losing your job, affording a lawyer, when you have to go to court)",
            "generating": "Thank you. I'm now reviewing your situation and preparing your personalized guidance. This may take a moment...",
            "stillWorking": "Still working on your guidance... Complex legal situations require careful analysis. Thank you for your patience.",
            "guidanceReady": "Your legal guidance is ready! I've put together a summary of your situation, important deadlines, your rights, and recommended next steps.\n\nYou can export this to keep for your records.",
            "error": "I'm sorry, I encountered an issue generating your guidance. Please try again or contact support if the problem continues.",
            "immigrationSummary": "**Immigration Enforcement Information**\n\nIf you're worried about immigration enforcement, here's what you should know:\n\n**Your Rights:**\n• You have the right to remain silent about your immigration status\n• You don't have to open your door to immigration officers without a judicial warrant\n• You have the right to speak to a lawyer before answering questions\n\n**If Approached by ICE:**\n• Stay calm and don't run\n• Ask if you are free to leave\n• Don't sign any documents without speaking to a lawyer\n• Remember details about the encounter\n\nFor comprehensive immigration guidance, visit our full [Immigration Guidance](/immigration-guidance) page.\n\n**What else can I help you with?**",
            "immigrationMenu": "How can we help with immigration?",
            "immigrationSituation": "I can help you with immigration-related questions. **What best describes your situation?**",
            "immigrationUrgent": {
              "reminder": "🚨 **Immediate Rights Reminder:**\n\n• **Stay calm** - Don't run or resist\n• **You have the right to remain silent** - You don't have to answer questions about your status\n• **Ask if you're free to leave** - If yes, calmly walk away\n• **Don't sign anything** without understanding it fully\n• **Request a lawyer** before answering questions\n\n**Where is this happening?**",
              "atHome": "🏠 **Your Rights at Home:**\n\n• **Don't open the door** unless they show a judicial warrant (signed by a judge)\n• An ICE administrative warrant (Form I-200) does NOT give them the right to enter\n• Say: \"I do not consent to you entering my home\"\n• If they force entry, don't resist but state you don't consent\n• Gather names and badge numbers if possible\n\n📞 **Emergency Contacts:**\n• National Immigration Forum: 1-800-954-6287\n• ACLU: Text \"IMMIGRANT\" to 88823\n\n**Connect with an immigration attorney immediately:**",
              "atWork": "💼 **Your Rights at Work:**\n\n• You have the right to remain silent\n• Ask to see a warrant - read it carefully\n• Don't run, lie, or use false documents\n• You can decline to answer questions about your status\n• Remember: You can have a lawyer present\n\n📋 Your employer CANNOT retaliate against you for exercising your rights.\n\n**Learn more about workplace raids and employer responsibilities:**",
              "inPublic": "🚶 **Your Rights in Public/at Checkpoints:**\n\n• Stay calm and don't run\n• At a checkpoint, you may be asked about citizenship\n• You can remain silent about your immigration status\n• Don't carry false documents\n• If detained, ask for a lawyer immediately\n\n📞 **Emergency Contacts:**\n• National Immigration Forum: 1-800-954-6287\n• DOJ Immigration Review: 1-800-898-7180\n\n**Connect with an immigration attorney:**"
            },
            "immigrationPlanning": {
              "question": "**Who are you planning for?**\n\nWe have resources to help you prepare:",
              "myself": "For personal planning, consider:\n\n• **Know your rights** before any encounter\n• **Prepare an emergency contact card** with attorney information\n• **Keep important documents** in a safe, accessible place\n• **Create a family communication plan**\n\nIf you have DACA, TPS, or other protected status, stay informed about renewals and deadlines:",
              "family": "**Family Planning Resources:**\n\nPreparing your family for potential immigration enforcement:\n\n• Designate a trusted person for childcare decisions\n• Prepare power of attorney documents\n• Keep copies of important documents accessible\n• Create a family emergency plan\n• Know your children's rights at school\n\nAccess our comprehensive family planning guide:",
              "workplace": "**Workplace Preparation:**\n\nPrepare your workplace for potential ICE enforcement:\n\n• Know the difference between judicial and administrative warrants\n• Understand employer and employee rights\n• Create a workplace response plan\n• Know where to get legal help\n\nAccess our workplace raids guide:"
            },
            "immigrationDetained": {
              "question": "**What is the current detention situation?**",
              "iceDetention": "**If in ICE Detention:**\n\n📞 **Your Rights in Detention:**\n• Right to make phone calls to family and attorney\n• Right to contact your consulate\n• Right to request a bond hearing (in most cases)\n• Right to an interpreter\n\n💰 **Bond Information:**\n• Bond amounts typically range from $1,500 to $25,000+\n• Certain criminal convictions may make you ineligible for bond\n• A judge will consider ties to community, flight risk, and danger\n\n**Learn about bond hearings and how to prepare:**",
              "countyJail": "**If in County Jail on Immigration Hold:**\n\n📋 **What This Means:**\n• ICE has requested the jail hold you for up to 48 hours after your criminal case\n• The hold is a REQUEST, not an order (in many states)\n• Some jails refuse to honor these detainers\n\n⚖️ **Your Rights:**\n• You can still request bond in your criminal case\n• Ask your criminal defense attorney about immigration consequences\n• You have the right to speak with an immigration attorney\n\n**Learn about bond hearings:",
              "portOfEntry": "**At a Port of Entry (Airport/Border):**\n\n🛂 **Key Information:**\n• Different rules apply at ports of entry\n• CBP has broader authority at borders\n• You can still request to speak with a lawyer\n• Don't sign anything without understanding it\n\n📞 **If You're a U.S. Citizen/Green Card Holder:**\nYou cannot be denied entry, but delays may occur.\n\n**Connect with an immigration attorney immediately:**",
              "result": "**Important:** Immigration law is complex. An experienced immigration attorney can make a significant difference in your case.\n\n📍 **Find verified immigration attorneys:**"
            },
            "rightsMenu": "Which rights topic would you like to learn about?",
            "rightsInfo": "**Your Key Constitutional Rights:**\n\n🛡️ **Right to Remain Silent** (5th Amendment)\nYou cannot be forced to testify against yourself. Anything you say can be used against you in court.\n\n⚖️ **Right to an Attorney** (6th Amendment)\nYou have the right to a lawyer. If you can't afford one, the court will appoint a public defender.\n\n📞 **Right to a Phone Call**\nMost states allow at least one phone call after booking to contact family or an attorney.\n\n📜 **Right to Know the Charges**\nYou must be told what crimes you're accused of.\n\n---\nFor more detailed information, visit our [Know Your Rights](/rights-info) page.\n\n**What would you like to do next?**",
            "processInfo": "**The Criminal Justice Process:**\n\n**1. Arrest & Booking** (0-48 hours)\nYou're taken into custody, fingerprinted, and photographed. You may be held until arraignment.\n\n**2. Arraignment** (24-72 hours after arrest)\nFirst court appearance where charges are read, you enter a plea, and bail is set.\n\n**3. Pre-Trial** (Weeks to months)\nDiscovery of evidence, plea negotiations, and motions are filed.\n\n**4. Trial** (If no plea deal)\nEvidence is presented before a judge or jury who decides guilt.\n\n**5. Sentencing** (If convicted)\nJudge determines punishment based on guidelines and circumstances.\n\n**6. Appeal** (Optional)\nYou can challenge the verdict or sentence through higher courts.\n\n---\nFor a complete guide, visit our [Criminal Justice Process](/process) page.\n\n**What would you like to do next?**",
            "resourcesCategoryMenu": "What type of resource are you looking for?",
            "resourcesMenu": "What type of resource are you looking for?",
            "lawsMenu": "What would you like to search?",
            "enterZipPD": "Please enter your ZIP code to find Public Defender offices near you:",
            "enterZipLegalAid": "Please enter your ZIP code to find Legal Aid organizations near you:",
            "invalidZip": "Please enter a valid 5-digit ZIP code.",
            "noPDFound": "I couldn't find Public Defender offices near {{zip}}. Try a different ZIP code or visit our [Resources page](/diversion-programs) for more options.\n\n**What else can I help you with?**",
            "noLegalAidFound": "I couldn't find Legal Aid organizations near {{zip}}. Try a different ZIP code or visit our [Resources page](/diversion-programs) for more options.\n\n**What else can I help you with?**",
            "pdResults": "Here are Public Defender offices near {{zip}}:\n\n{{results}}\n\n**What else can I help you with?**",
            "legalAidResults": "Here are Legal Aid organizations near {{zip}}:\n\n{{results}}\n\n**What else can I help you with?**",
            "searchError": "I had trouble searching. You can try again or explore other options.",
            "whatElse": "What else can I help you with?",
            "exportedWhatElse": "Your PDF has been downloaded.\n\n**What else can I help you with?**",
            "followUpResponse": "That's a great question. Based on what you've told me, here's what I'd suggest...",
            "whatToDoNow": "**What would you like to do next?**",
            "verifiedAgainst": "✓ Verified against {{state}} criminal statutes",
            "verifiedGeneric": "✓ Verified against official criminal statutes",
            "askFollowUpPrompt": "You can now type any follow-up questions below."
          },
          "replies": {
            "urgentYes": "Yes, I need help right now",
            "urgentNo": "No, I have time to talk",
            "getHelp": "Get Help with My Case",
            "knowRights": "Know My Rights",
            "findResources": "Find Resources",
            "legalAidResources": "Legal Aid Resources & Support",
            "personalizedGuidance": "Personalized Guidance",
            "immigrationEnforcement": "Immigration Enforcement",
            "rightsInfo": "Rights Info",
            "resources": "Resources",
            "lawsRecords": "Laws & Documents",
            "attorneyTools": "Attorney Tools",
            "myRights": "My Rights",
            "criminalJusticeProcess": "Criminal Justice Process",
            "constitutionalRights": "Constitutional Rights",
            "justiceProcess": "Justice Process",
            "searchSeizure": "Search & Seizure",
            "helpingFamily": "Helping Family",
            "legalGlossary": "Legal Glossary",
            "findPublicDefender": "Find Public Defender",
            "legalAidOrgs": "Legal Aid Orgs",
            "diversionPrograms": "Diversion Programs",
            "recordExpungement": "Record Expungement",
            "documentSummarizer": "Document Summarizer",
            "courtRecords": "Court Records Search",
            "statutesSearch": "Statutes Search",
            "documentLibrary": "Document Library",
            "stageArrest": "Just arrested / under investigation",
            "stageArraignment": "Arraignment coming up",
            "stagePretrial": "Pre-trial proceedings",
            "stageTrial": "Trial scheduled/ongoing",
            "stageSentencing": "Sentencing phase",
            "stageUnsure": "I'm not sure",
            "inCustody": "Yes, in custody",
            "onBail": "Out on bail/bond",
            "ownRecognizance": "Released on my own",
            "notInCustody": "Not in custody",
            "hasAttorney": "Yes, I have representation",
            "noAttorney": "No, I need to find one",
            "privilegeContinue": "I Understand, Continue",
            "privilegeSkip": "Skip & Get General Guidance",
            "viewGuidance": "View My Guidance",
            "exportPdf": "Export as PDF",
            "saveGuidance": "Save This Guidance",
            "findPublicDefenderAction": "Find a Public Defender",
            "findLegalAidAction": "Find Legal Aid Near Me",
            "askFollowUp": "Ask a Follow-Up Question",
            "moreOptions": "Explore Other Topics",
            "retry": "Try Again",
            "tryAgain": "Try Another ZIP Code",
            "immUrgent": "Active encounter right now",
            "immPlanning": "Planning/preparing",
            "immDetained": "Already detained/in proceedings",
            "immGeneralInfo": "Just want general info",
            "immAtHome": "At home",
            "immAtWork": "At work",
            "immInPublic": "In public / checkpoint",
            "immMyself": "Myself",
            "immFamily": "My family",
            "immWorkplace": "My workplace",
            "immIceDetention": "In ICE detention",
            "immCountyJail": "In county jail on immigration hold",
            "immPortOfEntry": "At a port of entry",
            "immFindAttorney": "Find Immigration Attorney",
            "immDacaTps": "DACA/TPS Information",
            "immFamilyPlanning": "Family Planning Guide",
            "immWorkplaceRaids": "Workplace Raids Guide",
            "immBondHearings": "Bond Hearings Info",
            "immBackToHub": "Back to Immigration Hub",
            "immGeneralHub": "General Information",
            "immSituationalGuides": "Situational Guides",
            "immKnowYourRights": "Know Your Rights",
            "immFindDetained": "Find a Detained Person",
            "immFindLawyer": "Find a Lawyer"
          },
          "header": {
            "title": "Legal Guidance Chat",
            "subtitle": "Private and secure"
          },
          "input": {
            "placeholder": "Ask a follow-up question...",
            "selectOption": "Select an option above to continue",
            "answering": "Complete the current step to continue",
            "descriptionPlaceholder": "Describe what happened...",
            "concernsPlaceholder": "What worries you most about your situation?",
            "zipPlaceholder": "Enter your 5-digit ZIP code..."
          },
          "voice": {
            "listening": "Listening...",
            "startListening": "Start voice input",
            "stopListening": "Stop listening",
            "recordingHint": "Speak now... Tap the microphone again when done.",
            "notSupported": "Voice input not supported",
            "notSupportedDesc": "Your browser does not support voice input. Please use a modern browser like Chrome, Edge, or Safari.",
            "permissionDenied": "Microphone access denied",
            "permissionDeniedDesc": "Please allow microphone access in your browser settings to use voice input.",
            "networkError": "Voice input unavailable",
            "networkErrorDesc": "Voice recognition requires an internet connection. Please type your message instead.",
            "error": "Voice input error",
            "errorDesc": "There was an error with voice input. Please try again."
          },
          "footer": {
            "privacy": "Your information is private and deleted after your session"
          },
          "exitWarning": {
            "title": "You have guidance that hasn't been exported",
            "description": "Your guidance will be lost if you leave without exporting."
          },
          "export": {
            "noData": "No guidance to export",
            "success": "PDF downloaded successfully",
            "error": "Failed to export PDF"
          },
          "stateSelector": {
            "placeholder": "Search for your state...",
            "noResults": "No states found"
          },
          "chargeSelector": {
            "title": "Select Charges",
            "selected": "selected",
            "available": "available",
            "searchPlaceholder": "Search all charges...",
            "loading": "Loading charges...",
            "noResults": "No charges found matching your search",
            "noCharges": "No charges available",
            "selectAtLeast": "Select at least one charge",
            "continue": "Continue with {{count}} charge(s)",
            "categories": {
              "all": "All",
              "felony": "Felony",
              "misdemeanor": "Misdemeanor",
              "infraction": "Infraction"
            }
          },
          "casePanel": {
            "title": "Your Case Info",
            "state": "State",
            "charges": "Charges",
            "stage": "Stage",
            "custody": "Custody",
            "attorney": "Attorney",
            "hasAttorney": "Yes",
            "noAttorney": "No",
            "urgentSituation": "Urgent Situation",
            "stages": {
              "arrest": "Investigation/Arrest",
              "arraignment": "Arraignment",
              "pretrial": "Pre-trial",
              "trial": "Trial",
              "sentencing": "Sentencing",
              "appeal": "Appeal",
              "unsure": "Unknown"
            },
            "custody_status": {
              "yes": "In Custody",
              "bail": "Out on Bail",
              "recognizance": "Own Recognizance",
              "no": "Not in Custody"
            }
          }
        },
        "exportWarning": {
          "title": "Important: Before You Export",
          "intro": "This document contains details about your legal situation that you provided. Please be aware:",
          "notLegalAdvice": "This is not legal advice",
          "notLegalAdviceDesc": "It's general legal information only",
          "notPrivileged": "Not protected by attorney-client privilege",
          "notPrivilegedDesc": "Documents you create and share may be requested by opposing parties in legal proceedings",
          "shareWithAttorney": "Share only with your attorney",
          "shareWithAttorneyDesc": "If you have a lawyer, share this with them first before anyone else",
          "recommendation": "We recommend discussing this guidance with a licensed attorney before taking any action.",
          "confirmButton": "I Understand, Export PDF"
        },
        "attorneyPortal": {
          "hero": {
            "title": "Attorney Tools",
            "subtitle": "Resources and tools for licensed attorneys representing clients in criminal and immigration matters."
          },
          "disclaimer": "These tools are designed for licensed attorneys. Document generation features require attestation of bar membership.",
          "comingSoon": "Coming Soon",
          "documentGeneration": {
            "title": "Document Generation",
            "description": "AI-powered drafting for common criminal and immigration filings. Generate motions, notices, and other documents tailored to your client's case.",
            "feature1": "Motions to Continue, Discovery, Bail Reduction",
            "feature2": "Immigration court filings (EOIR-28, Bond Memos)",
            "feature3": "Jurisdiction-specific formatting",
            "getStarted": "Get Started",
            "button": "Coming Soon"
          },
          "courtRecords": {
            "title": "Court Records Lookup",
            "description": "Search federal court records through PACER and access free documents via RECAP. Research case history, docket entries, and filed documents.",
            "feature1": "PACER integration for federal courts",
            "feature2": "Free access via RECAP archive",
            "feature3": "Docket search and document retrieval",
            "button": "Search Court Records"
          },
          "sharedResources": {
            "title": "Shared Resources",
            "description": "These resources are available to everyone and may be useful for your practice.",
            "statutes": "Statute Lookup",
            "statutesDesc": "Search state and federal laws",
            "documents": "Document Library",
            "documentsDesc": "Legal forms and templates",
            "glossary": "Legal Glossary",
            "glossaryDesc": "Legal term definitions",
            "courts": "Court Locator",
            "courtsDesc": "Find court locations"
          },
          "guidanceNote": {
            "title": "Personalized Guidance",
            "description": "Our AI-powered guidance chat is also available for attorneys to quickly understand a client's situation or research rights and procedures.",
            "button": "Get Guidance"
          },
          "verify": {
            "title": "Attorney Verification",
            "subtitle": "Please verify your bar membership to access document generation tools.",
            "backToPortal": "Back to Attorney Portal",
            "formTitle": "Attorney Verification",
            "formDescription": "Confirm the required attestations to access attorney document tools.",
            "attestationsTitle": "Required Attestations",
            "attestation1": "I am a licensed attorney in good standing with my state bar association, and I am accessing these tools on behalf of a client I represent.",
            "attestation2": "I am accessing these tools on behalf of a client I represent.",
            "attestation3": "I understand that attorney-client privilege protections depend on proper use of these tools.",
            "attestation4": "I accept the",
            "termsOfService": "Terms of Service",
            "tosTitle": "Attorney Tools Terms of Service",
            "tosSubtitle": "Please review before accepting.",
            "tosContent": "By using these attorney tools, you acknowledge and agree to the following:",
            "privacyNotice": "Your session data will be automatically deleted after 30 minutes.",
            "verifying": "Verifying...",
            "submit": "Verify and Continue"
          },
          "session": {
            "expiresIn": "Session expires in",
            "checking": "Checking session...",
            "redirecting": "Redirecting to verification..."
          },
          "documents": {
            "title": "Document Generation",
            "subtitle": "AI-powered document drafting for criminal and immigration matters.",
            "barState": "Bar State",
            "criminal": "Criminal",
            "immigration": "Immigration",
            "sessionNote": "Your session will automatically end after 30 minutes of inactivity.",
            "endSession": "End Session",
            "comingSoonTitle": "Templates Coming Soon",
            "criminalComingSoon": "Criminal law templates including Motions to Continue, Discovery Requests, and Bail Reduction motions are being developed.",
            "immigrationComingSoon": "Immigration templates including EOIR-28 forms, Bond Memoranda, and Change of Venue motions are being developed."
          }
        }
      }
      },
      es: {
        translation: {
          "header": {
            "title": "Defensor Público IA",
            "subtitle": "Orientación Legal Gratuita e Información sobre sus Derechos",
            "menu": {
              "getHelp": "Obtener Ayuda",
              "getHelpDesc": "Chatea con nuestra IA para orientación legal personalizada",
              "knowRights": "Conozca sus Derechos",
              "knowRightsDesc": "Aprenda sobre sus protecciones constitucionales",
              "documentLibrary": "Biblioteca de Documentos",
              "documentLibraryDesc": "Entienda los documentos legales de su caso",
              "findResources": "Encontrar Recursos",
              "findResourcesDesc": "Localice tribunales, defensores públicos y ayuda legal"
            },
            "language": "Idioma",
            "theme": "Tema",
            "darkMode": "Modo Oscuro",
            "lightMode": "Modo Claro"
          },
          "home": {
            "hero": {
              "title1": "Conozca sus Derechos.",
              "title2": "Proteja su Futuro.",
              "subtitle": "Obtenga orientación legal gratuita, entienda los procesos judiciales y acceda a recursos para navegar el sistema de justicia penal.",
              "urgentHelpButton": "AYUDA URGENTE NECESARIA",
              "getStartedButton": "COMENZAR",
              "navigatingToolButton": "Cómo Usar Esta Herramienta",
              "urgentHelpNotice": "Si está siendo arrestado o está en la corte ahora, haga clic en \"Ayuda Urgente Necesaria\" para orientación inmediata."
            },
            "features": {
              "title": "Respaldado por Datos Legales Reales",
              "subtitle": "Nuestro agente de IA utiliza bases de datos legales exhaustivas y registros judiciales para proporcionar información precisa y actualizada.",
              "federalCourts": "Registros Judiciales",
              "federalCourtsDesc": "Acceso a millones de opiniones judiciales federales y estatales a través de la API de CourtListener. Integración del Archivo RECAP para acceso gratuito a documentos judiciales federales (integración PACER pendiente).",
              "federalCourtsStatus": "Finalización Parcial",
              "stateLaws": "Leyes Estatales y Federales",
              "stateLawsDesc": "Cobertura completa de 50 estados + DC con 1,255 estatutos penales y 713 coincidencias de cargos validadas en 12 categorías de delitos. Estatutos federales de GovInfo.gov. Todas las jurisdicciones vinculadas a sitios web oficiales de legislaturas.",
              "stateLawsStatus": "Activo - 51 Jurisdicciones",
              "analytics": "Análisis de Justicia Penal",
              "analyticsDesc": "Integración de la Oficina de Estadísticas de Justicia (BJS) en progreso. Implementación de API NCVS/NIBRS con ponderación adecuada y paginación pendiente de validación.",
              "analyticsStatus": "Finalización Parcial"
            },
            "trust": {
              "title": "Basado en Confianza y Transparencia",
              "subtitle": "Cada pieza de información legal está respaldada por fuentes creíbles",
              "verifiedTitle": "Citas Verificadas",
              "verifiedDesc": "Todas las declaraciones legales incluyen citas apropiadas a estatutos, jurisprudencia y regulaciones",
              "privacyTitle": "Privacidad Protegida",
              "privacyDesc": "No se almacena información personal, todos los datos de la sesión se eliminan automáticamente",
              "currentTitle": "Información Actualizada",
              "currentDesc": "Bases de datos legales actualizadas regularmente para reflejar las leyes y procedimientos más recientes",
              "disclaimerTitle": "Descargo de Responsabilidad Legal:",
              "disclaimerText": "Este agente de IA proporciona información legal general únicamente y no sustituye el asesoramiento legal profesional. Siempre consulte con un abogado calificado para su situación específica. La información proporcionada puede no reflejar los desarrollos legales más recientes y no debe utilizarse como asesoría legal."
            },
            "urgentHelp": {
              "modalTitle": "Situación Legal Urgente",
              "arrestWarning": "Si está siendo arrestado AHORA MISMO:",
              "arrestWarningText": "Tiene derecho a permanecer en silencio y derecho a un abogado. Ejerza estos derechos inmediatamente.",
              "immediateActions": "Acciones Inmediatas:",
              "stayCalmTitle": "1. Mantenga la Calma",
              "stayCalmText": "No resista el arresto. Mantenga sus manos visibles. Siga las instrucciones con calma.",
              "assertRightsTitle": "2. Diga Sus Derechos",
              "assertRightsText1": "Diga claramente: \"Quiero quedarme en silencio. Quiero hablar con un abogado.\"",
              "assertRightsText2": "Luego deje de hablar con la policía. No responda preguntas hasta tener un abogado.",
              "noConsentTitle": "3. NO Consienta Registros",
              "noConsentText": "Diga: \"No consiento ningún registro.\" No resista físicamente, pero deje clara su negativa.",
              "publicDefenderTitle": "4. Solicite un Defensor Público",
              "publicDefenderText": "Si no puede pagar un abogado, tiene derecho a un defensor público gratuito. Solicite uno inmediatamente en su primera comparecencia ante el tribunal.",
              "rememberTitle": "Recuerde:",
              "rememberText": "Todo lo que diga puede y será usado en su contra en la corte. La mejor protección es permanecer en silencio hasta tener representación legal."
            },
            "whatWeDo": {
              "title": "Lo Que Hacemos",
              "subtitle": "Defensor Público IA ayuda a las personas a entender sus derechos legales y navegar el sistema de justicia penal.",
              "card1Title": "Orientación Legal con IA",
              "card1Desc": "Obtenga información legal personalizada según su situación específica",
              "card2Title": "Información sobre Derechos",
              "card2Desc": "Aprenda sobre sus derechos constitucionales durante el arresto y procedimientos judiciales",
              "card3Title": "Encuentre Recursos",
              "card3Desc": "Localice defensores públicos, organizaciones de asistencia legal e información judicial"
            },
            "cta": {
              "title": "¿Listo para Comenzar?",
              "subtitle": "Acceda a orientación legal gratuita y recursos adaptados a su situación.",
              "button": "Iniciar Evaluación Legal"
            },
            "knowRights": {
              "title": "Conozca sus Derechos",
              "subtitle": "Entender sus derechos constitucionales es el primer paso para protegerse.",
              "rightToRemainSilent": "Derecho a Permanecer en Silencio",
              "rightToRemainSilentDesc": "No tiene que responder preguntas sin un abogado presente",
              "rightToAttorney": "Derecho a un Abogado",
              "rightToAttorneyDesc": "Tiene derecho a representación legal, incluso si no puede pagarla",
              "rightToFairTrial": "Derecho a un Juicio Justo",
              "rightToFairTrialDesc": "Tiene derecho al debido proceso y a un jurado imparcial",
              "searchWarrantRights": "Protecciones contra Registro e Incautación",
              "searchWarrantRightsDesc": "La policía necesita una orden para registrarle a usted o su propiedad en la mayoría de los casos",
              "selfIncrimination": "Protección contra la Autoincriminación",
              "selfIncriminationDesc": "No puede ser obligado a testificar contra sí mismo",
              "speedyTrial": "Derecho a un Juicio Rápido",
              "speedyTrialDesc": "Tiene derecho a un juicio sin demoras irrazonables",
              "learnMore": "Aprenda Más sobre sus Derechos",
              "showMore": "Mostrar Más",
              "showLess": "Mostrar Menos"
            },
            "dataSources": {
              "title": "Fuentes de Datos",
              "subtitle": "Nuestra información proviene de bases de datos legales confiables y autorizadas.",
              "courtlistener": "API CourtListener",
              "courtlistenerDesc": "8.4M+ opiniones judiciales y expedientes federales del Proyecto Ley Libre",
              "recap": "Archivo RECAP",
              "recapDesc": "Acceso gratuito a registros judiciales federales recopilados de usuarios de PACER",
              "cornell": "Instituto Legal Cornell",
              "cornellDesc": "Constitución de EE.UU., estatutos federales y recursos legales"
            },
            "publicDefenderSearch": {
              "title": "Encontrar Oficinas de Defensor Público",
              "inputLabel": "Ingrese Código Postal",
              "inputPlaceholder": "Ingrese código postal de 5 dígitos",
              "searchButton": "Buscar",
              "searching": "Buscando...",
              "noResults": "No se encontraron oficinas de defensor público dentro de 50 millas. Intente con un código postal diferente o contacte a su tribunal local para información.",
              "error": "Por favor ingrese un código postal válido de 5 dígitos",
              "errorGeneral": "No se puede buscar oficinas. Por favor intente nuevamente o contacte a su tribunal local para información.",
              "county": "Condado",
              "milesAway": "mi de distancia",
              "address": "Dirección",
              "phone": "Teléfono",
              "email": "Correo Electrónico",
              "hours": "Horario",
              "services": "Servicios",
              "directions": "Direcciones"
            },
            "legalAidSearch": {
              "title": "Encontrar Organizaciones de Asistencia Legal",
              "inputLabel": "Ingrese Código Postal",
              "inputPlaceholder": "Ingrese código postal de 5 dígitos",
              "searchButton": "Buscar",
              "searching": "Buscando...",
              "noResults": "No se encontraron organizaciones de asistencia legal dentro de 100 millas. Intente con un código postal diferente o contacte a la asociación de abogados de su estado.",
              "error": "Por favor ingrese un código postal válido de 5 dígitos",
              "errorGeneral": "No se puede buscar organizaciones. Por favor intente nuevamente o contacte a la asociación de abogados local.",
              "servicesOffered": "Servicios Ofrecidos",
              "alertMessage": "Estas organizaciones se enfocan en asistencia legal de justicia penal e inmigración. Los servicios a menudo son gratuitos o de bajo costo para quienes califican.",
              "resultsFound": "Se encontró {{count}} organización{{plural}} cerca de usted"
            },
            "searchResults": {
              "foundOffices": "Se encontró {{count}} oficina{{plural}} cerca de usted"
            }
          },
          "footer": {
            "tagline": "Expandiendo el acceso a la justicia a través de orientación legal y recursos impulsados por IA.",
            "legalResources": "Recursos Legales",
            "knowYourRights": "Conozca sus Derechos",
            "courtProcedures": "Procedimientos Judiciales",
            "legalGlossary": "Glosario Legal",
            "recordExpungement": "Eliminación de Antecedentes",
            "friendsFamily": "Para Amigos y Familia",
            "courtRecords": "Buscar Registros Judiciales",
            "getHelp": "Obtener Ayuda",
            "getCaseGuidance": "Obtener Orientación de Caso",
            "immigrationEnforcement": "Aplicación de Inmigración",
            "diversionPrograms": "Programas de Desviación",
            "findLocalCourts": "Encontrar Tribunales Locales",
            "findPublicDefender": "Encontrar Defensor Público",
            "legalAidOrgs": "Organizaciones de Asistencia Legal",
            "about": "Acerca de",
            "ourMission": "Nuestra Misión",
            "developmentRoadmap": "Hoja de Ruta de Desarrollo",
            "privacyPolicy": "Política de Privacidad",
            "noticeDisclaimers": "Avisos y Exenciones",
            "privacyNotice": "Privacidad Primero: No almacenamos sus datos personales — toda información se elimina después de la sesión.",
            "copyright": "© 2025 Defensor Público IA. No sustituye el asesoramiento legal profesional."
          },
          "common": {
            "close": "Cerrar",
            "cancel": "Cancelar",
            "submit": "Enviar",
            "search": "Buscar",
            "loading": "Cargando...",
            "error": "Error",
            "success": "Éxito",
            "email": "Correo Electrónico",
            "phone": "Teléfono",
            "address": "Dirección",
            "name": "Nombre",
            "description": "Descripción",
            "learnMore": "Aprenda Más",
            "getStarted": "Comenzar",
            "back": "Volver",
            "next": "Siguiente",
            "save": "Guardar",
            "important": "Importante",
            "privacyFirst": "Privacidad Primero"
          },
          "mockQA": {
            "sectionTitle": "Preguntas y Respuestas de Práctica",
            "sectionSubtitle": "Preguntas comunes que podría escuchar durante los procedimientos judiciales",
            "personalizedTitle": "Preguntas de Práctica para Su Caso",
            "showResponse": "Mostrar Respuesta",
            "hideResponse": "Ocultar Respuesta",
            "practiceNote": "Practique decir estas respuestas en voz alta para sentirse más preparado para su audiencia en la corte.",
            "arraignment": {
              "plea": {
                "question": "¿Cómo se declara respecto a los cargos en su contra?",
                "response": "No culpable, Su Señoría.",
                "explanation": "La mayoría de los abogados recomiendan declararse no culpable en la lectura de cargos. Esto preserva todas sus opciones y da tiempo para revisar la evidencia."
              },
              "understand": {
                "question": "¿Entiende los cargos en su contra?",
                "response": "Sí, Su Señoría, entiendo los cargos.",
                "explanation": "Si no entiende completamente, está bien decir 'Me gustaría que mi abogado me los explique.' Nunca diga sí si realmente no entiende."
              },
              "attorney": {
                "question": "¿Tiene abogado o necesita que se le asigne uno?",
                "response": "Me gustaría solicitar un defensor público, Su Señoría.",
                "explanation": "Si no puede pagar un abogado, tiene derecho a que le asignen uno. Sea honesto sobre su situación financiera."
              },
              "waiveTime": {
                "question": "¿Renuncia a su derecho a un juicio rápido?",
                "response": "Me gustaría discutir esto con mi abogado antes de responder.",
                "explanation": "Nunca renuncie al tiempo sin consultar a su abogado. Esto afecta fechas límite importantes en su caso."
              }
            },
            "bail": {
              "residence": {
                "question": "¿Cuál es su dirección actual y cuánto tiempo ha vivido allí?",
                "response": "Vivo en [dirección] y he vivido allí por [período de tiempo].",
                "explanation": "Una vivienda estable demuestra que tiene vínculos con la comunidad y es menos probable que huya."
              },
              "employment": {
                "question": "¿Está empleado actualmente? ¿Dónde trabaja?",
                "response": "Sí, trabajo en [empleador] como [puesto].",
                "explanation": "El empleo demuestra vínculos comunitarios y responsabilidad. Mencione cuánto tiempo ha trabajado allí."
              },
              "ties": {
                "question": "¿Tiene familia en el área?",
                "response": "Sí, tengo [familiares] que viven cerca.",
                "explanation": "Las conexiones familiares demuestran que tiene razones para quedarse en el área y presentarse a las fechas de corte."
              }
            },
            "pretrial": {
              "progress": {
                "question": "¿Ha estado reuniéndose con su abogado para preparar su caso?",
                "response": "Sí, Su Señoría, he estado en contacto regular con mi abogado.",
                "explanation": "Esto demuestra que está tomando su caso en serio y participando activamente en su defensa."
              },
              "conditions": {
                "question": "¿Ha cumplido con todas las condiciones de su libertad?",
                "response": "Sí, Su Señoría, he seguido todas las condiciones.",
                "explanation": "Si ha tenido alguna dificultad, informe a su abogado antes de la audiencia para que pueda abordarlo apropiadamente."
              }
            },
            "plea": {
              "voluntary": {
                "question": "¿Su declaración se hace libre y voluntariamente?",
                "response": "Sí, Su Señoría.",
                "explanation": "Solo responda sí si esta es verdaderamente su decisión y nadie lo está forzando. Si tiene dudas, dígaselo al juez."
              },
              "discussed": {
                "question": "¿Ha discutido completamente esta declaración con su abogado?",
                "response": "Sí, Su Señoría, he discutido todos los aspectos de esta declaración con mi abogado.",
                "explanation": "Debería haber tenido tiempo para hacer preguntas y entender todas las consecuencias antes de declararse."
              },
              "consequences": {
                "question": "¿Entiende las consecuencias de esta declaración, incluyendo el posible tiempo en prisión?",
                "response": "Sí, Su Señoría, entiendo las posibles consecuencias.",
                "explanation": "Asegúrese de entender verdaderamente las penas máximas, consecuencias colaterales y efectos migratorios si aplican."
              }
            },
            "sentencing": {
              "statement": {
                "question": "¿Hay algo que le gustaría decir al tribunal antes de que imponga la sentencia?",
                "response": "Sí, Su Señoría. [Exprese arrepentimiento genuino, tome responsabilidad, mencione pasos positivos tomados]",
                "explanation": "Esta es su alocución. Sea sincero, tome responsabilidad y mencione cualquier esfuerzo de rehabilitación que haya hecho."
              },
              "understand": {
                "question": "¿Entiende la sentencia que acabo de imponer?",
                "response": "Sí, Su Señoría, entiendo.",
                "explanation": "Si algo no está claro sobre su sentencia, condiciones o requisitos de reporte, pida aclaración."
              }
            },
            "trial": {
              "testify": {
                "question": "¿Desea testificar en su propia defensa?",
                "response": "Me gustaría discutir esto más con mi abogado antes de decidir.",
                "explanation": "Esta es una decisión importante. Tiene derecho a no testificar, y el jurado no puede usar su silencio en su contra."
              },
              "juryWaiver": {
                "question": "¿Renuncia a su derecho a un juicio con jurado?",
                "response": "Me gustaría mantener mi derecho a un juicio con jurado, Su Señoría.",
                "explanation": "Solo renuncie a un juicio con jurado después de discutirlo cuidadosamente con su abogado sobre si un juicio de banco podría ser mejor para su caso específico."
              }
            }
          },
          "legalGuidance": {
            "qaFlow": {
              "title": "Obtenga Orientación Legal Personalizada",
              "cancel": "Cancelar",
              "stepProgress": "Paso {{current}} de {{total}}: {{title}}",
              "privacyNotice": "Sus datos están encriptados y se eliminan automáticamente dentro de 24 horas. Sin embargo, los mensajes de IA pueden ser retenidos por nuestro proveedor hasta por 30 días y podrían estar sujetos a procesos legales durante ese tiempo.",
              "steps": {
                "consent": "Privacidad y Consentimiento",
                "jurisdiction": "Su Estado",
                "caseDetails": "Su Caso",
                "status": "Estado Actual",
                "additionalDetails": "Detalles Adicionales (Opcional)"
              },
              "consent": {
                "title": "Aviso de Privacidad y Consentimiento",
                "important": "Importante:",
                "generalInfo": "Esta herramienta proporciona información legal general únicamente y no sustituye el asesoramiento legal profesional.",
                "noStorage": "No almacenamos su información personal. Todos los datos se eliminan cuando cierra su sesión.",
                "consultAttorney": "Para asesoramiento legal específico, consulte con un abogado calificado.",
                "notPrivileged": "Sus conversaciones con esta IA NO están protegidas por el privilegio abogado-cliente y podrían ser solicitadas por las autoridades o mediante un proceso legal.",
                "governmentDisclosure": "Nuestro proveedor de IA (Anthropic) puede retener sus mensajes hasta por 30 días. Durante este tiempo, si el gobierno emite una citación válida u orden judicial, sus conversaciones podrían ser divulgadas.",
                "criminalWarning": "Si está bajo investigación o enfrenta cargos criminales, hable con un abogado licenciado para recibir asesoramiento confidencial antes de compartir detalles de su caso aquí.",
                "checkboxLabel": "Entiendo y acepto continuar",
                "continueButton": "Continuar"
              },
              "jurisdiction": {
                "title": "¿Dónde está su caso?",
                "label": "Su Estado",
                "placeholder": "Seleccione su estado...",
                "states": {
                  "AL": "Alabama",
                  "AK": "Alaska",
                  "AZ": "Arizona",
                  "AR": "Arkansas",
                  "CA": "California",
                  "CO": "Colorado",
                  "CT": "Connecticut",
                  "DE": "Delaware",
                  "FL": "Florida",
                  "GA": "Georgia",
                  "HI": "Hawái",
                  "ID": "Idaho",
                  "IL": "Illinois",
                  "IN": "Indiana",
                  "IA": "Iowa",
                  "KS": "Kansas",
                  "KY": "Kentucky",
                  "LA": "Luisiana",
                  "ME": "Maine",
                  "MD": "Maryland",
                  "MA": "Massachusetts",
                  "MI": "Michigan",
                  "MN": "Minnesota",
                  "MS": "Mississippi",
                  "MO": "Misuri",
                  "MT": "Montana",
                  "NE": "Nebraska",
                  "NV": "Nevada",
                  "NH": "Nuevo Hampshire",
                  "NJ": "Nueva Jersey",
                  "NM": "Nuevo México",
                  "NY": "Nueva York",
                  "NC": "Carolina del Norte",
                  "ND": "Dakota del Norte",
                  "OH": "Ohio",
                  "OK": "Oklahoma",
                  "OR": "Oregón",
                  "PA": "Pensilvania",
                  "RI": "Rhode Island",
                  "SC": "Carolina del Sur",
                  "SD": "Dakota del Sur",
                  "TN": "Tennessee",
                  "TX": "Texas",
                  "UT": "Utah",
                  "VT": "Vermont",
                  "VA": "Virginia",
                  "WA": "Washington",
                  "WV": "Virginia Occidental",
                  "WI": "Wisconsin",
                  "WY": "Wyoming",
                  "DC": "Distrito de Columbia",
                  "federal": "Federal"
                },
                "back": "Volver",
                "continue": "Continuar"
              },
              "caseDetails": {
                "title": "¿Qué cargos enfrenta?",
                "selectedCharges": "Cargos Seleccionados:",
                "filterLabel": "Filtrar por Categoría (Opcional)",
                "filterPlaceholder": "Todas las categorías",
                "allCategories": "Todas las categorías",
                "selectLabel": "Seleccione todos los cargos que apliquen a su caso:",
                "stateCharges": "Cargos Estatales",
                "federalCharges": "Cargos Federales",
                "maxPenalty": "Pena máxima:",
                "showMore": "Mostrar {{count}} cargos más...",
                "hasAttorneyLabel": "Ya tengo un abogado o defensor público",
                "back": "Volver",
                "continue": "Continuar"
              },
              "status": {
                "title": "Estado actual",
                "caseStageLabel": "¿En qué etapa está su caso?",
                "caseStageplaceholder": "Seleccione la etapa actual...",
                "stages": {
                  "arrest": "Recién arrestado / Investigación",
                  "arraignment": "Lectura de cargos programada/completada",
                  "pretrial": "Procedimientos previos al juicio",
                  "trial": "Juicio programado/en progreso",
                  "sentencing": "Fase de sentencia",
                  "appeal": "Proceso de apelación",
                  "unsure": "No estoy seguro"
                },
                "custodyLabel": "¿Está actualmente bajo custodia?",
                "custodyPlaceholder": "Seleccione estado de custodia...",
                "custodyOptions": {
                  "yes": "Sí, bajo custodia",
                  "bail": "Liberado bajo fianza",
                  "recognizance": "Liberado bajo palabra (sin fianza)",
                  "no": "No, no estoy bajo custodia"
                },
                "back": "Volver",
                "submitButton": "Obtener Mi Orientación Legal",
                "continue": "Continuar"
              },
              "additionalDetails": {
                "title": "Cuéntenos Más (Opcional)",
                "description": "Entre más detalles proporcione, mejor podrá nuestra IA adaptar la orientación a su situación específica. Todos los campos son opcionales - omita cualquiera que no se sienta cómodo compartiendo.",
                "incidentLabel": "¿Qué pasó? Describa el incidente en sus propias palabras",
                "incidentPlaceholder": "Ejemplo: Iba manejando a casa del trabajo cuando la policía me detuvo. Dijeron que estaba zigzagueando pero acababa de esquivar un bache...",
                "concernsLabel": "¿Qué es lo que más le preocupa? ¿Alguna pregunta específica?",
                "concernsPlaceholder": "Ejemplo: Me preocupa perder mi trabajo. Tengo hijos y no puedo pagar un abogado. ¿Cuándo tengo que ir a la corte?",
                "back": "Volver"
              },
              "privilegeWarning": {
                "title": "Antes de Compartir Detalles",
                "notPrivate": "Lo que escriba aquí NO está protegido por el privilegio abogado-cliente. Sus mensajes son procesados por la IA de Anthropic y podrían ser divulgados si se solicitan mediante un proceso legal (como una citación u orden judicial).",
                "recommendation": "Si está bajo investigación o enfrenta cargos, recomendamos encarecidamente consultar primero con un abogado licenciado. Ellos pueden brindar asesoramiento verdaderamente confidencial. Este paso es opcional—omítalo para recibir orientación general sin compartir detalles.",
                "governmentWarning": "Importante: Anthropic puede retener los mensajes hasta por 30 días. Durante este tiempo, sus conversaciones podrían ser divulgadas en respuesta a una solicitud legal válida.",
                "continueAnyway": "Continuar de Todos Modos",
                "skipAndGetGuidance": "Omitir y Obtener Orientación General",
                "findLawyer": "Ayúdeme a Encontrar un Abogado"
              },
              "clearSession": {
                "button": "Borrar Mi Sesión",
                "confirm": "¿Borrar todos los datos?",
                "description": "Esto eliminará toda la información de su caso de nuestros servidores inmediatamente. Esta acción no se puede deshacer.",
                "cancel": "Cancelar",
                "cleared": "Sesión borrada exitosamente"
              }
            },
            "dashboard": {
              "title": "Panel de Orientación Legal",
              "generatedOn": "Generado el",
              "hideDetails": "Ocultar Detalles",
              "showDetails": "Mostrar Detalles",
              "close": "Cerrar",
              "exportPDF": "Exportar PDF",
              "summary": {
                "charges": "Cargos",
                "jurisdiction": "Su Estado",
                "currentStage": "Etapa Actual",
                "progress": "Progreso",
                "actionsCompleted": "Acciones Completadas",
                "protected": "Protegido"
              },
              "criticalAlerts": {
                "title": "Alertas Críticas - Acción Requerida"
              },
              "upcomingDeadlines": {
                "title": "Plazos Próximos"
              },
              "immediateActions": {
                "title": "Acciones Inmediatas (Próximas 48 Horas)",
                "completed": "Completadas: {{count}} de {{total}} acciones"
              },
              "caseTimeline": {
                "title": "Cronología del Caso",
                "progress": "Progreso del Caso",
                "current": "Actual"
              },
              "nextSteps": {
                "title": "Próximos Pasos"
              },
              "yourRights": {
                "title": "Sus Derechos"
              },
              "localResources": {
                "title": "Recursos Locales"
              },
              "evidenceToGather": {
                "title": "Evidencia a Recopilar"
              },
              "importantWarnings": {
                "title": "Advertencias Importantes"
              },
              "courtPreparation": {
                "title": "Preparación para la Corte"
              },
              "actionsToAvoid": {
                "title": "Acciones a Evitar"
              },
              "privacyNotice": {
                "title": "Su Privacidad está Protegida",
                "text": "Esta orientación se genera en base a su información y se eliminará automáticamente después de que termine su sesión. No se almacena información personal de forma permanente.",
                "encrypted": "Todos los datos encriptados en tránsito y en reposo",
                "autoDelete": "Datos de sesión eliminados automáticamente después de 24 horas",
                "piiRedacted": "Información personal redactada antes del procesamiento de IA",
                "deleteNow": "Eliminar Mis Datos Ahora",
                "deleteNote": "Elimina permanentemente todos los datos de la sesión"
              }
            }
          },
          "getStartedMenu": {
            "main": {
              "title": "¿Qué Necesita?",
              "caseGuidance": {
                "title": "Obtener Orientación para Mi Caso",
                "description": "Orientación legal personalizada basada en su situación"
              },
              "immigration": {
                "title": "Aplicación de Inmigración",
                "description": "Derechos durante encuentros con ICE y deportación"
              },
              "legalRights": {
                "title": "Información de Derechos Legales",
                "description": "Derechos constitucionales y procesos legales"
              },
              "legalAid": {
                "title": "Recursos y Apoyo de Asistencia Legal",
                "description": "Encuentre ayuda legal y servicios de apoyo"
              },
              "lawsRecords": {
                "title": "Leyes y Documentos",
                "description": "Buscar estatutos, jurisprudencia, registros judiciales y guías de documentos"
              },
              "attorneyTools": {
                "title": "Herramientas para Abogados",
                "description": "Redacción de documentos y recursos para profesionales legales"
              },
              "resources": {
                "title": "Recursos",
                "description": "Asistencia legal, servicios de apoyo, leyes, registros judiciales y documentos"
              }
            },
            "resourcesSubmenu": {
              "title": "Recursos",
              "backButton": "Volver al Menú Principal",
              "legalAid": "Recursos y Apoyo de Asistencia Legal",
              "lawsRecords": "Leyes y Documentos"
            },
            "legalRightsSubmenu": {
              "title": "Información de Derechos Legales",
              "backButton": "Volver al Menú Principal",
              "constitutionalRights": "Sus Derechos Legales",
              "criminalJusticeProcess": "Proceso de Justicia Criminal",
              "caseTimeline": "Línea de Tiempo del Caso",
              "quickReference": "Tarjetas de Referencia Rápida",
              "searchSeizure": "Registro e Incautación",
              "assistingFriends": "Ayudar a Amigos o Familiares",
              "legalGlossary": "Glosario Legal"
            },
            "legalAidSubmenu": {
              "title": "Recursos y Apoyo de Asistencia Legal",
              "backButton": "Volver a Recursos",
              "publicDefender": "Encontrar Defensor Público",
              "legalAidOrgs": "Organizaciones de Asistencia Legal",
              "diversionPrograms": "Programas de Desviación",
              "recordsExpungement": "Eliminación de Antecedentes"
            },
            "lawsRecordsSubmenu": {
              "title": "Leyes y Documentos",
              "backButton": "Volver a Recursos",
              "courtRecords": "Búsqueda de Registros Judiciales",
              "statutes": "Búsqueda de Estatutos",
              "documentLibrary": "Biblioteca de Documentos"
            },
            "immigrationSubmenu": {
              "title": "Aplicación de Inmigración",
              "backButton": "Volver al Menú Principal",
              "generalInfo": "Información General",
              "situationalGuides": "Guías Situacionales",
              "knowYourRights": "Conozca Sus Derechos",
              "findDetained": "Encontrar a una Persona Detenida",
              "findLawyer": "Encontrar un Abogado"
            }
          },
          "case": {
            "hero": {
              "title": "Orientación de Caso",
              "subtitle": "Obtenga Orientación Legal Personalizada",
              "description": "Responda algunas preguntas sobre su situación para recibir orientación legal personalizada, próximos pasos y recursos específicos para su caso y jurisdicción.",
              "startButton": "Iniciar Evaluación Personalizada",
              "privacyNote": "Sus respuestas son privadas y se eliminan automáticamente después de su sesión"
            },
            "howItWorks": {
              "title": "Cómo Funciona la Orientación Personalizada",
              "step1Title": "Responda Preguntas",
              "step1Desc": "Díganos sobre su estado, cargos y dónde está en el proceso legal",
              "step2Title": "Revisamos Su Situación",
              "step2Desc": "Nuestro sistema mira su situación usando bases de datos legales y casos pasados",
              "step3Title": "Obtenga Orientación",
              "step3Desc": "Reciba próximos pasos personalizados, plazos e información legal relevante",
              "step4Title": "Conéctese con Ayuda",
              "step4Desc": "Acceda a recursos locales, abogados y organizaciones de apoyo"
            },
            "benefits": {
              "title": "Lo Que Recibirá",
              "nextStepsTitle": "Próximos Pasos",
              "nextStepsDesc": "Pasos claros y accionables que debe tomar según la etapa y circunstancias de su caso",
              "deadlinesTitle": "Plazos Importantes",
              "deadlinesDesc": "Fechas y plazos críticos que debe conocer en su jurisdicción",
              "rightsTitle": "Sus Derechos",
              "rightsDesc": "Derechos específicos que se aplican a su situación y cómo ejercerlos",
              "resourcesTitle": "Recursos Locales",
              "resourcesDesc": "Defensores públicos, organizaciones de asistencia legal y servicios de apoyo en su área",
              "warningsTitle": "Advertencias Importantes",
              "warningsDesc": "Cosas que debe evitar y posibles problemas específicos de su situación",
              "legalInfoTitle": "Información Legal",
              "legalInfoDesc": "Leyes y casos pasados que se aplican a su situación"
            },
            "privacy": {
              "title": "Su Privacidad Está Protegida",
              "subtitle": "Tomamos su privacidad en serio. Así es como protegemos su información.",
              "noStorageTitle": "Sin Almacenamiento de Datos",
              "noStorageDesc": "La información personal no se guarda en nuestros servidores",
              "sessionOnlyTitle": "Solo Durante la Sesión",
              "sessionOnlyDesc": "Los datos existen solo durante su sesión activa",
              "autoDeleteTitle": "Eliminación Automática",
              "autoDeleteDesc": "Toda la información se elimina automáticamente cuando se va",
              "anonymousTitle": "Anónimo",
              "anonymousDesc": "No se requiere cuenta, uso completamente anónimo",
              "disclaimer": "Esta herramienta proporciona información y orientación legal general únicamente. No sustituye el asesoramiento legal profesional. Siempre consulte con un abogado calificado para obtener asesoramiento específico a su caso.",
              "getStartedButton": "Comenzar Ahora",
              "learnRightsButton": "Aprenda Primero Sobre Sus Derechos",
              "footerBanner": "No almacenamos sus datos personales — toda información se elimina después de la sesión."
            },
            "exitWarning": {
              "title": "Antes de Irse",
              "message": "Su orientación personalizada no ha sido exportada. Para proteger su privacidad, no almacenamos esta información. Si se va ahora, se perderá.",
              "export": "Exportar",
              "proceed": "Continuar"
            },
            "clearSession": {
              "title": "Borrar Datos de Sesión",
              "message": "Esto eliminará permanentemente toda la información de su caso y orientación de la memoria. Esta acción no se puede deshacer.",
              "confirm": "Borrar Sesión",
              "cancel": "Cancelar",
              "successTitle": "Sesión Borrada",
              "successMessage": "Todos los datos de la sesión han sido borrados de la memoria.",
              "errorTitle": "Error",
              "errorMessage": "No se pudo borrar la sesión. Por favor intente de nuevo."
            }
          },
          "rights": {
            "hero": {
              "title": "Conozca sus Derechos Legales",
              "subtitle": "Entender sus derechos constitucionales y legales es el primer paso para protegerse dentro del sistema de justicia penal."
            },
            "quickRights": {
              "title": "Derechos Esenciales que Todos Deben Conocer",
              "silent": {
                "title": "Derecho a Permanecer en Silencio",
                "description": "No tiene que responder preguntas más allá de la identificación básica",
                "detailedExplanation": "La Quinta Enmienda le protege contra la auto-incriminación, lo que significa que no puede ser obligado a testificar contra usted mismo. Solo necesita proporcionar información de identificación básica como su nombre y dirección - más allá de eso, tiene el derecho absoluto de negarse a responder cualquier pregunta de las autoridades sin un abogado presente. Todo lo que diga puede ser usado en su contra en la corte, por lo que ejercer este derecho le protege de hacer declaraciones que podrían perjudicar su defensa, incluso si cree que es inocente."
              },
              "attorney": {
                "title": "Derecho a un Abogado",
                "description": "Representación legal gratuita si no puede pagarla",
                "detailedExplanation": "La Sexta Enmienda garantiza su derecho a asesoría legal en procedimientos criminales. Si no puede pagar un abogado privado, la corte debe proporcionarle un defensor público sin costo para usted - esto aplica a cualquier caso criminal donde el tiempo en prisión sea una pena posible. Debe solicitar un abogado inmediatamente después del arresto y antes de responder cualquier pregunta, ya que tener representación legal desde el principio mejora significativamente sus posibilidades de un resultado justo."
              },
              "phoneCall": {
                "title": "Derecho a una Llamada Telefónica",
                "description": "Contactar a familia, abogado o fianza después del arresto",
                "detailedExplanation": "Después de ser arrestado y procesado, tiene derecho a hacer un número razonable de llamadas telefónicas para contactar a un abogado, familiar o agente de fianzas. La policía no puede escuchar llamadas con su abogado debido al privilegio abogado-cliente, pero pueden monitorear otras llamadas. Es importante usar este derecho sabiamente - contacte a su abogado primero si es posible, y evite discutir detalles de su caso en cualquier llamada que pueda ser grabada."
              },
              "knowCharges": {
                "title": "Derecho a Conocer los Cargos",
                "description": "Debe ser informado de las acusaciones en su contra",
                "detailedExplanation": "La Sexta Enmienda requiere que sea informado formalmente de los cargos criminales en su contra, típicamente en su lectura de cargos o comparecencia inicial dentro de 48-72 horas del arresto. Tiene derecho a saber exactamente de qué crímenes se le acusa, las leyes específicas que supuestamente violó, y las penas potenciales que enfrenta. Esta información le permite a usted y a su abogado preparar una estrategia de defensa apropiada y asegura que no pueda ser juzgado por crímenes de los que no fue debidamente notificado."
              }
            },
            "detailedRights": {
              "title": "Sus Derechos Constitucionales en Detalle",
              "tabs": {
                "miranda": "Advertencia Miranda",
                "arrest": "Durante el Arresto",
                "court": "En la Corte",
                "prison": "Si es Condenado"
              },
              "miranda": {
                "title": "Advertencia Miranda",
                "completeWarning": "La Advertencia Miranda Completa:",
                "warning1": "Tiene derecho a permanecer en silencio.",
                "warning2": "Todo lo que diga puede y será usado en su contra en un tribunal de justicia.",
                "warning3": "Tiene derecho a un abogado.",
                "warning4": "Si no puede pagar un abogado, se le proporcionará uno.",
                "warning5": "¿Entiende los derechos que acabo de leerle?",
                "warning6": "Con estos derechos en mente, ¿desea hablar conmigo?",
                "whenApply": "Cuándo se Aplican los Derechos Miranda:",
                "apply1": "Cuando está bajo custodia policial Y siendo interrogado",
                "apply2": "No se requieren para paradas de tráfico o interrogatorios voluntarios",
                "apply3": "Deben darse antes de que comience el interrogatorio bajo custodia",
                "apply4": "Puede invocar estos derechos en cualquier momento durante el interrogatorio",
                "alertTitle": "Importante:",
                "alertText": "Si la policía no lee los derechos Miranda, las declaraciones hechas durante el interrogatorio bajo custodia pueden ser inadmisibles en la corte, pero esto no descarta automáticamente su caso."
              },
              "arrest": {
                "title": "Derechos Durante el Arresto",
                "shouldDo": "Lo Que Debe Hacer:",
                "do1": "Manténgase calmado y no resista el arresto",
                "do2": "Mantenga sus manos visibles",
                "do3": "Ejerza su derecho a permanecer en silencio",
                "do4": "Solicite un abogado inmediatamente",
                "do5": "Recuerde detalles para su abogado más tarde",
                "shouldNotDo": "Lo Que NO Debe Hacer:",
                "dont1": "No huya ni resista físicamente",
                "dont2": "No discuta con la policía",
                "dont3": "No consienta registros",
                "dont4": "No responda preguntas sin un abogado",
                "dont5": "No firme nada",
                "policePowers": "Poderes Policiales Durante el Arresto:",
                "power1": "Pueden registrarle a usted y el área inmediata en busca de armas/evidencia",
                "power2": "Pueden incautar artículos a la vista",
                "power3": "Pueden registrar su vehículo si es arrestado durante una parada de tráfico",
                "power4": "No pueden registrar su teléfono sin una orden (en la mayoría de los casos)"
              },
              "court": {
                "title": "Derechos en la Corte",
                "constitutional": "Derechos Legales:",
                "right1": "Derecho a un juicio justo y rápido",
                "right2": "Derecho a un jurado imparcial",
                "right3": "Derecho a confrontar a los testigos",
                "right4": "Derecho a presentar una defensa",
                "right5": "Derecho a apelar la condena",
                "burdenProof": "Carga de la Prueba:",
                "burden1": "La fiscalía debe probar la culpabilidad más allá de una duda razonable",
                "burden2": "Se presume que es inocente hasta que se demuestre su culpabilidad",
                "burden3": "No tiene que probar su inocencia",
                "burden4": "Tiene derecho a no testificar",
                "etiquetteTitle": "Etiqueta en la Corte:",
                "etiquetteText": "Vístase apropiadamente, llegue a tiempo, póngase de pie cuando entre el juez, diríjase al juez como \"Su Señoría\" y deje que su abogado hable por usted."
              },
              "prison": {
                "title": "Derechos Si es Condenado",
                "continuing": "Derechos Continuos:",
                "right1": "Derecho a apelar su condena",
                "right2": "Derecho a representación legal para la apelación",
                "right3": "Derecho a un trato humano en prisión",
                "right4": "Derecho a atención médica",
                "right5": "Derecho a practicar su religión",
                "right6": "Derecho a comunicarse con la familia (con restricciones)",
                "afterRelease": "Después de la Liberación:",
                "after1": "Posible supervisión de libertad condicional o libertad bajo palabra",
                "after2": "Posibles restricciones de empleo",
                "after3": "Pérdida de ciertos derechos civiles (votar, armas de fuego)",
                "after4": "Consecuencias migratorias para no ciudadanos",
                "after5": "Posible eliminación o sellado de antecedentes",
                "collateralTitle": "Consecuencias Colaterales:",
                "collateralText": "Las condenas penales pueden afectar el empleo, la vivienda, las licencias profesionales, la ayuda estudiantil y el estatus migratorio. Discuta esto con su abogado."
              }
            },
            "disclaimer": {
              "title": "Importante:",
              "text": "Esta información es solo para fines educativos y no constituye asesoramiento legal. Las leyes varían según la jurisdicción y cambian con el tiempo. Siempre consulte con un abogado calificado para obtener asesoramiento específico a su situación.",
              "needHelp": "¿Necesita Ayuda Legal Inmediata?",
              "emergencyAid": "Asistencia Legal de Emergencia",
              "caseGuidance": "Obtener Orientación de Caso"
            }
          },
          "immigration": {
            "common": {
              "importantLabel": "Importante:"
            },
            "hero": {
              "title1": "Cumplimiento de Inmigración",
              "title2": "Conozca sus Derechos",
              "subtitle": "Información esencial sobre derechos tanto para ciudadanos como para no ciudadanos durante encuentros con ICE y procesos de deportación"
            },
            "criticalAlert": {
              "title": "CRÍTICO:",
              "text": "Estos derechos se aplican a TODAS las personas en los Estados Unidos, sin importar su estatus migratorio. Usted tiene protecciones constitucionales incluso durante acciones de cumplimiento de inmigración."
            },
            "emergencyRights": {
              "title": "Derechos Inmediatos Durante Encuentros con ICE",
              "subtitle": "Estos derechos se aplican a TODOS - ciudadanos, no ciudadanos, personas documentadas e indocumentadas",
              "constitutionalTitle": "Sus Derechos Legales",
              "constitutionalRights": {
                "silent": {
                  "title": "Derecho a Permanecer en Silencio:",
                  "text": "NO tiene que responder preguntas sobre su estatus migratorio, nacionalidad o dónde nació."
                },
                "refuseSearch": {
                  "title": "Derecho a Rechazar Registros:",
                  "text": "Puede negarse a consentir un registro de usted mismo, sus pertenencias, automóvil o casa."
                },
                "attorney": {
                  "title": "Derecho a un Abogado:",
                  "text": "Tiene derecho a hablar con un abogado antes de responder preguntas."
                },
                "interpreter": {
                  "title": "Derecho a un Intérprete:",
                  "text": "Tiene derecho a un intérprete durante los procedimientos."
                }
              },
              "whatNotToDoTitle": "Qué NO Hacer",
              "whatNotToDo": {
                "lie": {
                  "title": "No mienta ni proporcione documentos falsos:",
                  "text": "Esto puede usarse en su contra en la corte de inmigración."
                },
                "run": {
                  "title": "No huya ni resista:",
                  "text": "Esto puede llevar a cargos criminales adicionales."
                },
                "sign": {
                  "title": "No firme nada:",
                  "text": "Sin entender lo que dice o sin hablar primero con un abogado."
                },
                "carryDocuments": {
                  "title": "No porte documentos extranjeros:",
                  "text": "A menos que la ley lo requiera (como una licencia de conducir)."
                }
              }
            },
            "deportationPhases": {
              "title": "Fases del Proceso de Deportación",
              "subtitle": "Entendiendo cada etapa de los procedimientos de cumplimiento de inmigración",
              "phase1": {
                "title": "Fase 1: Encuentro Inicial con ICE",
                "rightsTitle": "Sus Derechos:",
                "rights": {
                  "askLeave": "Pregunte si puede irse libremente",
                  "warrant": "Solicite ver una orden antes de permitir la entrada a su hogar",
                  "silent": "Permanezca en silencio sobre su estatus migratorio",
                  "attorney": "Solicite un abogado inmediatamente"
                },
                "expectTitle": "Qué Esperar:",
                "expect": {
                  "approach": "Los agentes de ICE pueden acercarse en casa, trabajo o en público",
                  "documents": "Pueden solicitar identificación y documentos de inmigración",
                  "adminWarrant": "Orden administrativa ≠ orden judicial",
                  "detention": "Puede ser detenido si creen que es removible"
                }
              },
              "phase2": {
                "title": "Fase 2: Detención de Inmigración",
                "rightsTitle": "Sus Derechos en Detención:",
                "rights": {
                  "phone": "Derecho a hacer llamadas telefónicas a familia y abogado",
                  "consulate": "Derecho a contactar su consulado (no ciudadanos)",
                  "interpreter": "Derecho a intérpretes durante los procedimientos",
                  "charges": "Derecho a ser informado de los cargos en su contra",
                  "bond": "Derecho a solicitar audiencia de fianza (en la mayoría de los casos)"
                },
                "importantTitle": "Importante Saber:",
                "important": {
                  "duration": "La detención puede durar semanas, meses o más",
                  "nta": "Recibirá un Aviso de Comparecencia (NTA)",
                  "mandatory": "Algunas personas están sujetas a detención obligatoria",
                  "bondAmount": "Los montos de fianza varían ampliamente ($1,500 - $25,000+)",
                  "criminal": "Ciertas condenas penales afectan la elegibilidad de fianza"
                }
              },
              "phase3": {
                "title": "Fase 3: Procedimientos de Corte de Inmigración",
                "rightsTitle": "Derechos en la Corte:",
                "rights": {
                  "attorney": "Derecho a un abogado (a su propio costo)",
                  "interpreter": "Derecho a un intérprete",
                  "examine": "Derecho a examinar evidencia en su contra",
                  "present": "Derecho a presentar evidencia y testigos",
                  "appeal": "Derecho a apelar decisiones negativas"
                },
                "outcomesTitle": "Resultados Posibles:",
                "outcomes": {
                  "relief": "Alivio de remoción: Asilo, cancelación, ajuste",
                  "voluntary": "Salida voluntaria: Salir a su propio costo",
                  "removal": "Orden de remoción: Deportación forzada",
                  "continuances": "Aplazamientos: Caso pospuesto por varias razones",
                  "closure": "Cierre administrativo: Caso cerrado temporalmente"
                }
              },
              "phase4": {
                "title": "Fase 4: Apelaciones y Remoción Final",
                "rightsTitle": "Derechos de Apelación:",
                "rights": {
                  "deadline": "Plazo de 30 días para presentar apelación ante la Junta de Apelaciones de Inmigración (BIA)",
                  "federal": "Posible revisión de corte federal después de decisión de BIA",
                  "stay": "Suspensión de remoción mientras la apelación está pendiente (si se solicita)",
                  "motions": "Mociones para reabrir/reconsiderar en ciertas circunstancias"
                },
                "processTitle": "Proceso de Remoción Final:",
                "process": {
                  "schedule": "ICE programa la fecha de remoción después de la orden final",
                  "period": "Período de remoción de 90 días (puede extenderse)",
                  "refusal": "Los países pueden negarse a aceptar retornados",
                  "supervision": "Algunos individuos pueden ser liberados bajo supervisión",
                  "bar": "La entrada futura a EE.UU. puede estar prohibida por años"
                }
              }
            },
            "specialProtections": {
              "title": "Protecciones Especiales",
              "subtitle": "Derechos y protecciones adicionales para poblaciones vulnerables",
              "usCitizens": {
                "title": "Ciudadanos Estadounidenses",
                "items": {
                  "noDeportation": "No pueden ser deportados (protección constitucional)",
                  "detained": "Pueden ser detenidos si se cuestiona su identidad",
                  "proof": "Deben portar prueba de ciudadanía",
                  "contact": "Contacte familia/abogado inmediatamente si es detenido",
                  "complaints": "Presente quejas si sus derechos son violados"
                }
              },
              "vulnerable": {
                "title": "Poblaciones Vulnerables",
                "pregnant": "Mujeres embarazadas: Determinación especial de custodia",
                "nursing": "Madres lactantes: Alternativas de detención familiar extendida",
                "minors": "Menores: Procedimientos y protecciones especiales",
                "mentallyIll": "Enfermos mentales: Evaluaciones de competencia requeridas",
                "trafficking": "Víctimas de tráfico: Protecciones de visa especiales"
              },
              "sanctuary": {
                "title": "Jurisdicciones Santuario",
                "items": {
                  "policies": "Políticas locales que limitan la cooperación con ICE",
                  "notice": "Aviso anticipado de operaciones de ICE (algunas áreas)",
                  "know": "Conozca las políticas de su jurisdicción local",
                  "canOperate": "ICE aún puede operar en áreas santuario",
                  "contact": "Contacte grupos locales de derechos de inmigrantes"
                }
              }
            },
            "resources": {
              "title": "Recursos y Contactos de Emergencia",
              "subtitle": "Números telefónicos críticos y recursos para emergencias de inmigración",
              "hotlines": {
                "title": "Líneas Directas Nacionales",
                "nif": {
                  "name": "Foro Nacional de Inmigración",
                  "number": "1-800-954-6287",
                  "description": "Línea directa de defensa contra deportación 24/7"
                },
                "aclu": {
                  "name": "ACLU",
                  "number": "Envíe \"IMMIGRANT\" al 88823",
                  "description": "Información sobre conozca sus derechos"
                },
                "doj": {
                  "name": "Oficina Ejecutiva del DOJ para Revisión de Inmigración",
                  "number": "1-800-898-7180",
                  "description": "Lista de abogados e información de audiencias"
                }
              },
              "locators": {
                "title": "Servicios de Localización",
                "iceDetainee": {
                  "name": "Localizador de Detenidos de ICE",
                  "url": "ice.gov/detain/ice-ero/locate-detainee",
                  "description": "Encuentre individuos detenidos bajo custodia de ICE"
                },
                "legalServices": {
                  "name": "Red de Defensores de Inmigración",
                  "url": "immigrationadvocates.org/nonprofit/legaldirectory",
                  "description": "Encuentre servicios legales de inmigración gratuitos y de bajo costo"
                },
                "consulate": {
                  "name": "Localizador de Consulados",
                  "url": "state.gov/foreign-embassies",
                  "description": "Encuentre el consulado de su país en EE.UU."
                }
              },
              "prepareTitle": "Prepárese Ahora",
              "prepare": {
                "plan": "Cree un plan de emergencia familiar",
                "documents": "Mantenga documentos importantes en un lugar seguro",
                "attorney": "Conozca la información de contacto de un abogado de inmigración",
                "redCard": "Porte una \"tarjeta roja\" de inmigración con sus derechos",
                "trustee": "Designe una persona de confianza para decisiones sobre el cuidado de niños"
              }
            },
            "finalCta": {
              "title": "Obtenga Ayuda Adicional",
              "rights": "Aprenda sus Derechos Generales",
              "local": "Encuentre Recursos Locales"
            },
            "hub": {
              "detailedGuides": {
                "title": "Guías Detalladas",
                "subtitle": "Información detallada sobre temas específicos de inmigración",
                "dacaCard": {
                  "title": "Información de DACA y TPS",
                  "description": "Elegibilidad, fechas límite de renovación, y qué hacer si su estatus expira"
                },
                "raidsCard": {
                  "title": "Redadas en el Trabajo",
                  "description": "Sus derechos durante acciones de ICE, lo que los empleadores deben hacer"
                },
                "familyCard": {
                  "title": "Planificación Familiar de Estatus Mixto",
                  "description": "Planes de emergencia, autorización de cuidadores, preparación de documentos"
                },
                "bondCard": {
                  "title": "Audiencias de Fianza",
                  "description": "Elegibilidad, proceso de audiencia, qué hacer si es denegado"
                },
                "attorneyCard": {
                  "title": "Encontrar y Verificar un Abogado",
                  "description": "Evitar fraudes, verificar credenciales, encontrar ayuda legal gratuita"
                },
                "findDetainedCard": {
                  "title": "Encontrar a una Persona Detenida",
                  "description": "Use el Localizador de Detenidos de ICE, entienda los Números A, información de fianza y contactos de instalaciones"
                },
                "kyrCard": {
                  "title": "Materiales Conozca Sus Derechos",
                  "description": "Tarjetas rojas imprimibles, guiones para encuentros con ICE, guías de reconocimiento de órdenes judiciales"
                },
                "raidsToolkitCard": {
                  "title": "Kit de Herramientas Comunitario para Redadas",
                  "description": "Listas de seguridad, tarjetas de contacto de emergencia, guías de preparación por escenario"
                }
              },
              "backButton": "Volver al Centro de Inmigración"
            },
            "daca": {
              "badge": "Protección Migratoria",
              "title": "Información de DACA y TPS",
              "subtitle": "Entendiendo los programas de Acción Diferida para los Llegados en la Infancia (DACA) y Estatus de Protección Temporal (TPS), requisitos de elegibilidad y procesos de renovación.",
              "disclaimer": "Las leyes de inmigración cambian frecuentemente. Siempre verifique los requisitos actuales en USCIS.gov o con un abogado de inmigración antes de tomar acción.",
              "dacaSection": {
                "title": "DACA (Acción Diferida para los Llegados en la Infancia)",
                "whatIs": "¿Qué es DACA?",
                "whatIsText": "DACA proporciona protección temporal contra la deportación y autorización de trabajo para personas que llegaron a EE.UU. siendo niños. No proporciona un camino hacia la ciudadanía o residencia permanente legal.",
                "eligibility": "Requisitos Básicos de Elegibilidad",
                "req1": "Tenía menos de 31 años a partir del 15 de junio de 2012",
                "req2": "Llegó a EE.UU. antes de los 16 años",
                "req3": "Ha residido continuamente en EE.UU. desde el 15 de junio de 2007",
                "req4": "Estaba presente en EE.UU. el 15 de junio de 2012",
                "req5": "Actualmente en la escuela, graduado, o tiene GED",
                "req6": "Sin delitos graves, delitos menores significativos, o 3+ delitos menores",
                "renewal": "Cronograma de Renovación",
                "renewalText": "Presente solicitudes de renovación 120-150 días antes de que expire su DACA actual. El procesamiento típicamente toma 3-6 meses."
              },
              "tpsSection": {
                "title": "TPS (Estatus de Protección Temporal)",
                "whatIs": "¿Qué es TPS?",
                "whatIsText": "TPS se otorga a nacionales de países designados que experimentan conflictos armados, desastres ambientales u otras condiciones extraordinarias. Proporciona estatus legal temporal y autorización de trabajo.",
                "countries": "Países Actualmente Designados",
                "countriesNote": "*Lista sujeta a cambios. Verifique las designaciones actuales en USCIS.gov",
                "benefits": "Beneficios de TPS",
                "benefit1": "Protección contra deportación mientras TPS sea válido",
                "benefit2": "Documento de Autorización de Empleo (EAD)",
                "benefit3": "Puede solicitar autorización de viaje",
                "reregistration": "Re-registro",
                "reregistrationText": "Los beneficiarios de TPS deben re-registrarse durante cada período de re-registro anunciado por USCIS. Perder fechas límite puede resultar en pérdida de estatus."
              },
              "statusLapse": {
                "title": "¿Qué Pasa Si Su Estatus Expira?",
                "dontPanic": "No Entre en Pánico",
                "dontPanicText": "Un estatus expirado no significa deportación inmediata. Consulte con un abogado de inmigración inmediatamente para entender sus opciones.",
                "gatherDocs": "Reúna Documentos",
                "gatherDocsText": "Recopile todos sus documentos de inmigración, prueba de presencia continua y cualquier correspondencia de USCIS. Estos serán cruciales para cualquier remedio.",
                "seekHelp": "Busque Ayuda Legal",
                "seekHelpText": "Contacte a un representante acreditado o abogado de inmigración. Muchas organizaciones ofrecen consultas gratuitas o de bajo costo para beneficiarios de DACA/TPS."
              },
              "resources": "Recursos Oficiales"
            },
            "raids": {
              "badge": "Derechos en el Trabajo",
              "title": "Redadas en el Trabajo y Sus Derechos",
              "subtitle": "Conozca sus derechos durante acciones de cumplimiento de ICE en el trabajo. Entender lo que los agentes pueden y no pueden hacer le ayuda a protegerse.",
              "criticalAlert": "Si ICE está en su lugar de trabajo ahora mismo:",
              "criticalAlertText": "Mantenga la calma. Usted tiene derechos. No corra. No proporcione documentos falsos.",
              "yourRights": {
                "title": "Sus Derechos Durante una Redada en el Trabajo",
                "silent": "Derecho a Permanecer en Silencio",
                "silentText": "No tiene que responder preguntas sobre dónde nació, su estatus migratorio, o cómo entró a EE.UU.",
                "refuse": "Derecho a Rechazar Consentimiento",
                "refuseText": "Puede negarse a mostrar documentos más allá de lo requerido para verificación de empleo.",
                "attorney": "Derecho a un Abogado",
                "attorneyText": "Puede solicitar hablar con un abogado antes de responder cualquier pregunta.",
                "basis": "Derecho a Conocer la Base de Detención",
                "basisText": "Si es detenido, puede preguntar por qué y solicitar ver la orden o documentación."
              },
              "whatNotToDo": {
                "title": "Qué NO Hacer",
                "run": "No Corra ni se Esconda",
                "runText": "Correr puede usarse en su contra y podría resultar en cargos adicionales.",
                "falseDocs": "No Proporcione Documentos Falsos",
                "falseDocsText": "Usar documentos falsos es un delito federal que puede resultar en encarcelamiento e impedimentos para futuros beneficios migratorios.",
                "lie": "No Mienta Sobre su Identidad",
                "lieText": "Dar información falsa a agentes federales es un delito. Es mejor permanecer en silencio.",
                "sign": "No Firme Documentos que No Entienda",
                "signText": "Algunos formularios pueden ser acuerdos de salida voluntaria. Pida tiempo para consultar con un abogado."
              },
              "employer": {
                "title": "Obligaciones del Empleador",
                "mustProvide": "Lo Que los Empleadores Deben Proporcionar",
                "must1": "Acceso a áreas no públicas solo con orden judicial (no orden administrativa)",
                "must2": "Tiempo razonable para que los empleados consulten con abogados si están disponibles",
                "must3": "Formularios I-9 dentro de 3 días de aviso (72 horas) si se solicita para auditoría",
                "canDo": "Lo Que los Empleadores Pueden Hacer",
                "can1": "Solicitar ver la orden y verificar que esté firmada por un juez",
                "can2": "Contactar a su abogado antes de permitir acceso a áreas no públicas",
                "can3": "Documentar la redada (nombres de agentes, números de placa, acciones tomadas)",
                "can4": "Publicar información de Conozca Sus Derechos en el lugar de trabajo"
              },
              "afterRaid": {
                "title": "Después de una Redada en el Trabajo",
                "detained": "Si Fue Detenido",
                "detained1": "Memorice o escriba su Número A",
                "detained2": "Contacte a su familia para informarles su ubicación",
                "detained3": "Solicite hacer llamadas telefónicas - tiene este derecho",
                "detained4": "No firme nada sin entenderlo",
                "detained5": "Pida una audiencia de fianza si es elegible",
                "notDetained": "Si No Fue Detenido",
                "notDetained1": "Documente todo lo que presenció",
                "notDetained2": "Anote números de placa y nombres de agentes",
                "notDetained3": "Consulte con un abogado de inmigración",
                "notDetained4": "Reporte violaciones de derechos civiles a organizaciones comunitarias",
                "notDetained5": "Cree un plan de emergencia familiar"
              },
              "emergency": {
                "title": "Contactos de Emergencia",
                "subtitle": "Guarde estos números en su teléfono",
                "nilc": "Centro Nacional de Leyes de Inmigración",
                "aclu": "ACLU Derechos de Inmigrantes"
              }
            },
            "family": {
              "badge": "Protección Familiar",
              "title": "Planificación Familiar de Estatus Mixto",
              "subtitle": "Proteja a su familia planificando con anticipación. Cree planes de emergencia, designe cuidadores y organice documentos importantes.",
              "planningAlert": "Planificar con anticipación protege a su familia.",
              "planningAlertText": "Aunque nada suceda, tener un plan reduce el estrés y asegura que sus hijos estén cuidados.",
              "documents": {
                "title": "Documentos Esenciales para Preparar",
                "poa": {
                  "title": "Poder Notarial",
                  "description": "Designa a alguien para tomar decisiones legales y financieras en su nombre si es detenido.",
                  "item1": "Poder general para asuntos financieros",
                  "item2": "Poder duradero (sobrevive incapacidad)",
                  "item3": "Debe ser notarizado para ser válido"
                },
                "caregiver": {
                  "title": "Autorización de Cuidador",
                  "description": "Permite a una persona de confianza cuidar a sus hijos y tomar decisiones diarias.",
                  "item1": "Autoriza inscripción escolar",
                  "item2": "Permite consentimiento para tratamiento médico",
                  "item3": "Temporal (usualmente 6-12 meses)"
                },
                "guardianship": {
                  "title": "Nominación de Tutor",
                  "description": "Nombra a su tutor preferido si no puede cuidar a sus hijos a largo plazo.",
                  "item1": "Los tribunales consideran pero no siempre siguen",
                  "item2": "Nombre tutores de respaldo también",
                  "item3": "Debe ser notarizado"
                }
              },
              "emergencyPlan": {
                "title": "Creando Su Plan de Emergencia Familiar",
                "communication": {
                  "title": "Plan de Comunicación",
                  "step1": "Memorizar Números Clave",
                  "step1Text": "Haga que los niños memoricen el número de teléfono de un adulto de confianza en caso de separación.",
                  "step2": "Crear un Árbol de Contactos",
                  "step2Text": "Liste 3-5 personas de confianza que pueden ser llamadas en una emergencia. Comparta esta lista con la escuela de sus hijos.",
                  "step3": "Palabras Clave",
                  "step3Text": "Cree una palabra clave familiar que los adultos de confianza usarán cuando recojan a los niños."
                },
                "documentPrep": {
                  "title": "Preparación de Documentos",
                  "step1": "Reunir Actas de Nacimiento",
                  "step1Text": "Tenga copias de las actas de nacimiento de todos los miembros de la familia, incluyendo hijos ciudadanos estadounidenses.",
                  "step2": "Información de Pasaportes",
                  "step2Text": "Guarde copias de todos los pasaportes (del país de origen y de EE.UU. si aplica) en un lugar seguro.",
                  "step3": "Registros de Inmigración",
                  "step3Text": "Guarde copias de todos los documentos de inmigración, incluyendo números A para miembros de familia detenidos."
                }
              },
              "financial": {
                "title": "Consideraciones Financieras y Prácticas",
                "bank": "Acceso Bancario",
                "bankText": "Agregue a una persona de confianza a sus cuentas bancarias o configure una cuenta conjunta para que las facturas se puedan pagar si es detenido.",
                "property": "Acceso a Propiedad",
                "propertyText": "Deje una llave extra con un vecino o amigo de confianza. Documente la ubicación de artículos importantes en su hogar.",
                "medical": "Información Médica",
                "medicalText": "Mantenga una lista de medicamentos de los niños, alergias y contactos de médicos con su autorización de cuidador."
              },
              "freeHelp": "Ayuda Gratuita Disponible:",
              "freeHelpText": "Muchas organizaciones de defensa de inmigrantes ofrecen asistencia gratuita con la planificación de emergencia familiar. Contacte a su organización local de ayuda legal o grupo de derechos de inmigrantes para ayuda creando estos documentos."
            },
            "bond": {
              "badge": "Detención y Liberación",
              "title": "Audiencias de Fianza de Inmigración",
              "subtitle": "Entendiendo el proceso de fianza, requisitos de elegibilidad y cómo prepararse para una audiencia de fianza en la corte de inmigración.",
              "importantAlert": "No todos son elegibles para fianza. Algunas personas están sujetas a detención obligatoria. Un abogado de inmigración puede ayudar a determinar la elegibilidad.",
              "whatIsBond": {
                "title": "¿Qué es la Fianza de Inmigración?",
                "delivery": {
                  "title": "Fianza de Entrega",
                  "description": "Permite la liberación de detención mientras el caso de inmigración procede. La persona debe presentarse a todas las audiencias.",
                  "amount": "Cantidad Típica:",
                  "amountValue": "$1,500 - $25,000+",
                  "setter": "Quién la Establece:",
                  "setterValue": "ICE o Juez de Inmigración"
                },
                "voluntary": {
                  "title": "Fianza de Salida Voluntaria",
                  "description": "Permite a alguien salir de EE.UU. voluntariamente a su propio costo. La fianza se reembolsa si salen antes de la fecha límite.",
                  "amount": "Cantidad Típica:",
                  "amountValue": "$500 - $5,000",
                  "benefit": "Beneficio:",
                  "benefitValue": "Evita orden de deportación"
                }
              },
              "eligibility": {
                "title": "Elegibilidad para Fianza",
                "mayBeEligible": "Puede Ser Elegible",
                "eligible1": "Personas sin historial criminal serio",
                "eligible2": "Aquellos que no son riesgo de fuga",
                "eligible3": "Individuos con fuertes lazos comunitarios",
                "eligible4": "Personas con familiares ciudadanos estadounidenses",
                "eligible5": "Aquellos con historial de empleo estable",
                "mandatoryDetention": "Detención Obligatoria (Sin Fianza)",
                "mandatory1": "Condenas por delitos graves agravados",
                "mandatory2": "Ciertos delitos de drogas",
                "mandatory3": "Delitos con armas de fuego",
                "mandatory4": "Cargos relacionados con terrorismo",
                "mandatory5": "Órdenes de deportación previas (en algunos casos)"
              },
              "process": {
                "title": "El Proceso de Audiencia de Fianza",
                "step1": "Solicitar una Audiencia de Fianza",
                "step1Text": "Usted o su abogado deben solicitar una audiencia de fianza ante el juez de inmigración. ICE también puede establecer una cantidad inicial de fianza que puede ser impugnada.",
                "step2": "Reunir Evidencia",
                "step2Text": "Prepare documentos que muestren lazos comunitarios: cartas de familia, prueba de empleo, contratos de arrendamiento, facturas de servicios, declaraciones de impuestos y cartas de carácter.",
                "step3": "Asistir a la Audiencia",
                "step3Text": "El juez considerará si usted es un riesgo de fuga o un peligro para la comunidad. Tener un abogado mejora significativamente los resultados.",
                "step4": "Pagar la Fianza",
                "step4Text": "Si se otorga, la fianza debe pagarse a través de ICE (no la corte). Un familiar o amigo puede pagar en su nombre. Algunas organizaciones ofrecen fondos de fianza."
              },
              "denied": {
                "title": "Si la Fianza es Denegada",
                "options": "Tiene Opciones",
                "option1": "Apelar ante la Junta de Apelaciones de Inmigración (BIA)",
                "option2": "Solicitar reconsideración si las circunstancias cambian",
                "option3": "Presentar una petición de habeas corpus en corte federal",
                "timeline": "Cronograma",
                "time1": "La apelación ante BIA debe presentarse dentro de 30 días",
                "time2": "Las decisiones de BIA pueden tomar varios meses",
                "time3": "Consulte a un abogado inmediatamente"
              },
              "resources": {
                "title": "Recursos de Fondos de Fianza",
                "subtitle": "¿No puede pagar la fianza? Estas organizaciones pueden ayudar:",
                "bailFund": "Red Nacional de Fondos de Fianza",
                "bailFundText": "Directorio de fondos de fianza locales que ayudan a familias a pagar fianzas de inmigración.",
                "raices": "Fondo de Fianza RAICES",
                "raicesText": "Proporciona asistencia de fianza para inmigrantes detenidos en Texas y más allá."
              }
            },
            "attorney": {
              "badge": "Representación Legal",
              "title": "Encontrar y Verificar un Abogado de Inmigración",
              "subtitle": "Cómo encontrar ayuda legal de inmigración legítima y protegerse de estafas.",
              "scamWarning": "¡Cuidado con el Fraude de Notarios!",
              "scamWarningText": "En EE.UU., los \"notarios\" no están autorizados para dar consejo legal. Solo abogados con licencia y representantes acreditados por el DOJ pueden representarle en la corte de inmigración.",
              "whoCanHelp": {
                "title": "¿Quién Puede Ayudar Legalmente con Casos de Inmigración?",
                "attorneys": {
                  "title": "Abogados con Licencia",
                  "description": "Abogados con licencia de cualquier colegio de abogados estatal de EE.UU. pueden representarle en asuntos de inmigración, incluso si tienen licencia en un estado diferente.",
                  "item1": "Pueden representarle en la corte",
                  "item2": "Pueden presentar solicitudes ante USCIS",
                  "item3": "Sujetos a reglas éticas y disciplina"
                },
                "accredited": {
                  "title": "Representantes Acreditados por el DOJ",
                  "description": "No-abogados que están capacitados y autorizados por el Departamento de Justicia para representar a inmigrantes. Trabajan en organizaciones reconocidas.",
                  "item1": "A menudo ofrecen servicios gratuitos o de bajo costo",
                  "item2": "Pueden representarle en la corte de inmigración",
                  "item3": "Trabajan en organizaciones sin fines de lucro"
                }
              },
              "verify": {
                "title": "Cómo Verificar a un Abogado de Inmigración",
                "stateBar": {
                  "title": "Verificar con el Colegio de Abogados",
                  "description": "Cada estado tiene un sitio web del colegio de abogados donde puede verificar si un abogado tiene licencia y está en buen estado.",
                  "link": "Directorio del Colegio de Abogados"
                },
                "eoir": {
                  "title": "Lista de Reconocimiento de EOIR",
                  "description": "El DOJ mantiene una lista de organizaciones reconocidas y representantes acreditados autorizados para proporcionar servicios de inmigración.",
                  "link": "Lista EOIR"
                },
                "aila": {
                  "title": "Búsqueda de Abogados AILA",
                  "description": "La Asociación Americana de Abogados de Inmigración (AILA) tiene un directorio de abogados miembros que se especializan en leyes de inmigración.",
                  "link": "Búsqueda de Abogados AILA"
                }
              },
              "redFlags": {
                "title": "Señales de Alerta: Signos de Fraude de Inmigración",
                "warnings": {
                  "title": "Señales de Advertencia",
                  "item1": "Garantiza un resultado o aprobación específica",
                  "item2": "Afirma tener conexiones especiales con USCIS o jueces",
                  "item3": "Le pide que firme formularios en blanco",
                  "item4": "No proporciona un contrato escrito",
                  "item5": "Le anima a mentir en las solicitudes",
                  "item6": "Se queda con sus documentos originales",
                  "item7": "Usa el título \"notario\" o \"consultor de inmigración\""
                },
                "legitimate": {
                  "title": "Señales de un Abogado Legítimo",
                  "item1": "Proporciona un acuerdo de honorarios por escrito",
                  "item2": "Explica riesgos y posibles resultados honestamente",
                  "item3": "Le da copias de todos los documentos presentados",
                  "item4": "Devuelve sus documentos originales",
                  "item5": "Responde a sus preguntas y llamadas",
                  "item6": "Es verificable a través del colegio de abogados o EOIR",
                  "item7": "Le hace revisar y firmar formularios usted mismo"
                }
              },
              "freeHelp": {
                "title": "Ayuda Legal Gratuita y de Bajo Costo",
                "organizations": "Organizaciones de Ayuda Legal",
                "org1": "Servicios de inmigración de Caridades Católicas",
                "org2": "CLINIC (Red Legal de Inmigración Católica)",
                "org3": "Sociedades locales de ayuda legal",
                "org4": "Clínicas de inmigración de escuelas de derecho",
                "findingHelp": "Encontrando Ayuda",
                "find1": "Busque en ImmigrationAdvocates.org",
                "find2": "Contacte a su colegio de abogados local",
                "find3": "Pregunte a organizaciones comunitarias"
              },
              "reportFraud": {
                "title": "Reportar Fraude de Inmigración",
                "subtitle": "Si ha sido víctima de fraude de inmigración, repórtelo:",
                "ftc": "Queja FTC",
                "eoir": "Queja EOIR"
              }
            }
          },
          "courtRecords": {
            "hero": {
              "title": "Búsqueda de Registros Judiciales",
              "subtitle": "Busque registros judiciales gratuitos del Archivo RECAP y la base de datos de jurisprudencia"
            },
            "freeFirstAlert": {
              "title": "Política de Gratuidad Primero:",
              "text1": "Buscamos primero en el Archivo RECAP gratuito. Si un documento no está disponible gratuitamente, le mostraremos dónde encontrarlo en PACER (que cobra tarifas). Instale la",
              "linkText": "extensión de navegador RECAP",
              "text2": "para guardar automáticamente sus compras de PACER en el archivo gratuito."
            },
            "searchParams": {
              "title": "Parámetros de Búsqueda",
              "description": "Ingrese al menos un criterio de búsqueda a continuación",
              "searchTerm": "Término de Búsqueda",
              "searchTermPlaceholder": "Palabras clave, nombres de partes...",
              "caseName": "Nombre del Caso",
              "caseNamePlaceholder": "Smith v. Jones",
              "docketNumber": "Número de Expediente",
              "docketNumberPlaceholder": "1:20-cv-12345",
              "searchButton": "Buscar Registros Judiciales"
            },
            "results": {
              "title": "Resultados de Búsqueda",
              "totalResults": "{{count}} resultados totales",
              "noResults": "No se encontraron resultados",
              "searchFailed": "La búsqueda falló. Por favor intente de nuevo o refine sus criterios de búsqueda.",
              "recapSection": "Archivo RECAP - Presentaciones de Cortes Federales ({{count}})",
              "opinionsSection": "Opiniones de Jurisprudencia ({{count}})",
              "filed": "Presentado: {{date}}",
              "decided": "Decidido: {{date}}",
              "free": "GRATIS",
              "viewOnPacer": "Ver en PACER",
              "viewOpinion": "Ver Opinión",
              "downloadFree": "Descargar PDF Gratis",
              "natureOfSuit": "Naturaleza del Caso:",
              "assignedTo": "Asignado a:",
              "referredTo": "Referido a:",
              "dateTerminated": "Fecha de Terminación:",
              "citedBy": "Citado por {{count}} casos",
              "citations": "Citas:",
              "status": "Estado:",
              "precedentialStatus": "Tipo de Decisión:"
            },
            "partialFailure": {
              "title": "Fallo Parcial de Búsqueda:",
              "text": "Algunos servicios de búsqueda no están disponibles.",
              "recapFailed": "La búsqueda de expedientes RECAP falló.",
              "opinionsFailed": "La búsqueda de opiniones de jurisprudencia falló.",
              "incomplete": "Los resultados mostrados pueden estar incompletos."
            }
          },
          "legalGlossary": {
            "hero": {
              "title": "Glosario Legal",
              "subtitle": "Comprendiendo términos y conceptos legales para ayudarle a navegar el sistema de justicia penal"
            },
            "navigation": {
              "backToHome": "Volver al Inicio",
              "termsCount": "{{count}} de {{total}} términos"
            },
            "search": {
              "placeholder": "Buscar términos legales, definiciones o palabras clave...",
              "browseByLetter": "Navegar por Letra:",
              "filterByCategory": "Filtrar por Categoría:",
              "clearFilters": "Limpiar Todos los Filtros"
            },
            "terms": {
              "title": "Términos y Definiciones Legales",
              "relatedTerms": "Términos Relacionados:",
              "commonUsage": "Uso Común:",
              "examples": "Ejemplos:",
              "legalContext": "Contexto Legal:",
              "aliases": "También conocido como:",
              "categories": "Categorías:"
            }
          },
          "process": {
            "hero": {
              "title": "Cronología del Proceso de Justicia Penal",
              "subtitle": "Guía paso a paso a través del arresto, acusación formal, juicio y procedimientos de sentencia"
            },
            "crossLinks": {
              "timeline": "Guía interactiva — seleccione su etapa para ver derechos y consejos",
              "quickRef": "Tarjetas imprimibles con sus derechos en cada etapa"
            },
            "alert": {
              "important": "Importante:",
              "text": "La cronología exacta y los procedimientos pueden variar significativamente según la jurisdicción y la complejidad del caso. Siempre consulte con un abogado calificado para orientación específica a su situación."
            },
            "steps": {
              "yourRights": "Sus Derechos en Esta Etapa:",
              "whatToExpect": "Qué Esperar:",
              "step1": {
                "title": "Arresto",
                "description": "Las fuerzas del orden lo toman bajo custodia basándose en causa probable o una orden judicial.",
                "timeframe": "Inmediato",
                "rights": [
                  "Derecho a permanecer en silencio",
                  "Derecho a un abogado",
                  "Derecho a una llamada telefónica",
                  "Derecho a ser informado de los cargos"
                ]
              },
              "step2": {
                "title": "Registro",
                "description": "Procesamiento en la estación de policía incluyendo huellas dactilares, fotos e información personal.",
                "timeframe": "1-3 horas",
                "rights": [
                  "Derecho a atención médica si es necesario",
                  "Derecho a contactar a un abogado o familia",
                  "Derecho a trato humano"
                ]
              },
              "step3": {
                "title": "Comparecencia Inicial/Acusación Formal",
                "description": "Primera comparecencia en corte donde se leen formalmente los cargos y usted se declara.",
                "timeframe": "24-72 horas",
                "rights": [
                  "Derecho a ser informado de los cargos",
                  "Derecho a tener un abogado presente",
                  "Derecho a solicitar un defensor público",
                  "Derecho a fianza razonable"
                ]
              },
              "step4": {
                "title": "Audiencia Preliminar",
                "description": "La corte determina si hay causa probable para creer que usted cometió el crimen.",
                "timeframe": "1-2 semanas",
                "rights": [
                  "Derecho a impugnar evidencia",
                  "Derecho a interrogar testigos",
                  "Derecho a representación legal"
                ]
              },
              "step5": {
                "title": "Descubrimiento",
                "description": "Ambas partes intercambian evidencia, listas de testigos y otra información del caso.",
                "timeframe": "Semanas a meses",
                "rights": [
                  "Derecho a ver la evidencia de la fiscalía",
                  "Derecho a presentar evidencia de defensa",
                  "Derecho a testigos expertos"
                ]
              },
              "step6": {
                "title": "Juicio",
                "description": "Presentación formal de evidencia ante un juez o jurado para determinar culpabilidad o inocencia.",
                "timeframe": "Varía",
                "rights": [
                  "Derecho a juicio por jurado",
                  "Derecho a confrontar testigos",
                  "Derecho a permanecer en silencio",
                  "Derecho a presentar defensa"
                ]
              },
              "step7": {
                "title": "Sentencia",
                "description": "Si es condenado, la corte determina el castigo apropiado.",
                "timeframe": "2-6 semanas después del juicio",
                "rights": [
                  "Derecho a hablar en la sentencia",
                  "Derecho a apelar",
                  "Derecho a castigo justo y proporcional"
                ]
              }
            },
            "additionalInfo": {
              "title": "Notas Importantes",
              "pleaBargains": {
                "title": "Acuerdos de Culpabilidad",
                "text": "La mayoría de los casos penales (aproximadamente 90-95%) se resuelven mediante acuerdos de culpabilidad en lugar de ir a juicio. Esto sucede durante la fase de descubrimiento cuando los fiscales y abogados defensores negocian cargos reducidos o sentencias a cambio de una declaración de culpabilidad."
              },
              "speedyTrial": {
                "title": "Derechos a Juicio Rápido",
                "text": "La Sexta Enmienda garantiza su derecho a un juicio rápido. Los casos federales típicamente deben comenzar dentro de 70 días de la acusación formal o primera comparecencia. Los requisitos estatales varían, a menudo oscilando entre 60 y 180 días."
              },
              "publicDefender": {
                "title": "Obtener un Defensor Público",
                "text": "Si no puede pagar un abogado, tiene el derecho constitucional a uno. Los defensores públicos son asignados en su comparecencia inicial. Es posible que deba completar una declaración jurada financiera para probar elegibilidad."
              },
              "bondBail": {
                "title": "Fianza y Libertad Bajo Fianza",
                "text": "La fianza es el dinero pagado a la corte para asegurar que regrese para el juicio. Si no puede pagar la fianza, puede permanecer bajo custodia o solicitar una audiencia de fianza. Algunas jurisdicciones ofrecen liberación bajo palabra (ROR) para acusados de bajo riesgo."
              }
            },
            "guides": {
              "title": "Entendiendo Procesos Legales Clave",
              "subtitle": "Aprenda sobre decisiones importantes que puede enfrentar durante su caso. Haga clic en cada sección para expandir y aprender más.",
              "bail": {
                "title": "Fianza en Efectivo",
                "intro": "La fianza es dinero que el tribunal retiene para asegurar que usted regrese a sus citas en la corte. Esto es lo que necesita saber como acusado.",
                "whatIs": {
                  "title": "¿Qué es la fianza?",
                  "description": "La fianza es una forma de salir de la cárcel mientras espera que termine su caso. Usted paga dinero (o alguien paga por usted), y el tribunal lo retiene hasta que termine su caso.",
                  "points": [
                    "La fianza no es una multa ni un castigo - es como un depósito",
                    "Si asiste a todas sus fechas de corte, recupera el dinero (menos cualquier tarifa)",
                    "El propósito es asegurar que no huya antes del juicio"
                  ]
                },
                "howSet": {
                  "title": "Cómo se establece el monto de la fianza",
                  "description": "Un juez decide el monto de su fianza basándose en varias cosas:",
                  "factors": [
                    "Qué tan serios son sus cargos",
                    "Su historial criminal (si lo tiene)",
                    "Si tiene lazos fuertes con la comunidad (trabajo, familia, hogar)",
                    "Si se le considera un riesgo de fuga",
                    "Su capacidad de pago",
                    "Preocupaciones de seguridad pública"
                  ]
                },
                "options": {
                  "title": "Sus opciones de fianza",
                  "types": [
                    {
                      "name": "Fianza en Efectivo",
                      "description": "Usted paga el monto total de la fianza al tribunal. Recupera todo cuando termina el caso (si se presentó a la corte)."
                    },
                    {
                      "name": "Fianza con Fiador (a través de un fiador)",
                      "description": "Usted paga a un fiador aproximadamente 10-15% del monto de la fianza. Ellos pagan la fianza completa. No recupera su pago - es su tarifa."
                    },
                    {
                      "name": "Fianza con Propiedad",
                      "description": "Usa propiedad (como una casa) como garantía en lugar de efectivo. Si no se presenta, el tribunal puede tomar la propiedad."
                    },
                    {
                      "name": "Liberación Bajo Palabra (ROR)",
                      "description": "Es liberado solo con una promesa de regresar - no se requiere dinero. Esto es para acusados de bajo riesgo con fuertes lazos comunitarios."
                    }
                  ]
                },
                "cantAfford": {
                  "title": "¿Qué pasa si no puede pagar la fianza?",
                  "description": "No pierda la esperanza. Hay pasos que puede tomar:",
                  "options": [
                    "Pida a su abogado que solicite una audiencia de reducción de fianza",
                    "Reúna evidencia de lazos comunitarios (carta de empleo, apoyo familiar, contrato de arrendamiento)",
                    "Busque fondos de fianza - organizaciones sin fines de lucro que ayudan a pagar fianzas",
                    "Pregunte a familiares o amigos si pueden ayudar con un fiador",
                    "En algunas áreas, hay programas de servicios previos al juicio como alternativas"
                  ]
                },
                "conditions": {
                  "title": "Condiciones de liberación",
                  "description": "Aunque pague la fianza, el juez puede establecer reglas que debe seguir mientras está fuera:",
                  "examples": [
                    "Presentarse con un oficial de servicios previos al juicio regularmente",
                    "Permanecer en el área (no viajar sin permiso)",
                    "Evitar contacto con ciertas personas (como testigos o víctimas)",
                    "No alcohol ni drogas, posiblemente con pruebas",
                    "Usar un monitor de tobillo",
                    "Mantener o encontrar un trabajo",
                    "Obedecer un toque de queda"
                  ]
                },
                "missCourt": {
                  "title": "¿Qué pasa si falta a la corte?",
                  "description": "Faltar a una fecha de corte es serio. Esto es lo que puede pasar:",
                  "consequences": [
                    "Se emitirá una orden de arresto en su contra",
                    "Perderá su dinero de fianza (o el fiador lo buscará)",
                    "Podría enfrentar cargos criminales adicionales por no comparecer",
                    "Será mucho más difícil obtener fianza nuevamente",
                    "El juez puede verlo como menos confiable al decidir su caso"
                  ]
                }
              },
              "plea": {
                "title": "Acuerdos de Culpabilidad",
                "intro": "Aproximadamente 90-95% de los casos criminales se resuelven mediante acuerdos de culpabilidad. Entender este proceso le ayuda a tomar decisiones informadas.",
                "whatIs": {
                  "title": "¿Qué es un acuerdo de culpabilidad?",
                  "description": "Un acuerdo de culpabilidad es un convenio entre usted (el acusado) y el fiscal. Usted acepta declararse culpable de un cargo, y a cambio, obtiene algo - usualmente una sentencia más leve o menos cargos.",
                  "points": [
                    "Es una negociación - su abogado negocia en su nombre",
                    "El juez debe aprobar el acuerdo",
                    "Renuncia a su derecho a un juicio cuando acepta",
                    "Una vez aceptado, es muy difícil retractarse"
                  ]
                },
                "types": {
                  "title": "Tipos de acuerdos",
                  "deals": [
                    {
                      "name": "Negociación de Cargos",
                      "description": "Se declara culpable de un cargo menos serio. Por ejemplo, un delito grave podría reducirse a un delito menor."
                    },
                    {
                      "name": "Negociación de Sentencia",
                      "description": "Se declara culpable del cargo original, pero el fiscal recomienda una sentencia más leve al juez."
                    },
                    {
                      "name": "Negociación de Cantidad",
                      "description": "Si enfrenta múltiples cargos, algunos se retiran a cambio de declararse culpable de otros."
                    },
                    {
                      "name": "Negociación de Hechos",
                      "description": "Ciertos hechos se omiten del caso, lo que puede afectar la sentencia (menos común)."
                    }
                  ]
                },
                "rights": {
                  "title": "Sus derechos durante las negociaciones",
                  "description": "Recuerde, tiene derechos importantes en este proceso:",
                  "list": [
                    "SIEMPRE puede rechazar cualquier oferta - nadie puede obligarlo a aceptar",
                    "Tiene derecho a ir a juicio en su lugar",
                    "Debe ser informado sobre consecuencias migratorias antes de declararse (si aplica)",
                    "Puede pedir tiempo para pensar sobre una oferta",
                    "Siempre debe hablar con un abogado antes de decidir"
                  ]
                },
                "questions": {
                  "title": "Preguntas antes de aceptar",
                  "description": "Antes de aceptar cualquier acuerdo, asegúrese de entender:",
                  "list": [
                    "¿Exactamente de qué me estoy declarando culpable?",
                    "¿Cuál es la sentencia máxima que podría recibir?",
                    "¿Qué sentencia está recomendando el fiscal?",
                    "¿El juez está obligado a seguir la recomendación?",
                    "¿Tendré antecedentes penales? ¿Se pueden borrar alguna vez?",
                    "¿Cómo afectará esto mi estatus migratorio (si aplica)?",
                    "¿Podré tener armas de fuego?",
                    "¿Tendré que registrarme como delincuente sexual (si aplica)?",
                    "¿Qué pasa si violo la libertad condicional?"
                  ]
                },
                "collateral": {
                  "title": "Consecuencias colaterales",
                  "description": "Declararse culpable puede afectar su vida más allá de la sentencia. Estas se llaman 'consecuencias colaterales':",
                  "consequences": [
                    "Inmigración: Puede llevar a deportación, negación de ciudadanía, o problemas de visa",
                    "Empleo: Algunos trabajos requieren verificación de antecedentes; ciertas profesiones pueden estar prohibidas",
                    "Vivienda: Vivienda pública y algunos arrendadores pueden rechazarlo",
                    "Educación: Puede afectar ayuda financiera o admisión a escuelas",
                    "Votación: En algunos estados, los delincuentes pierden el derecho al voto",
                    "Derechos de armas: Delitos graves y algunos menores impiden poseer armas",
                    "Licencias profesionales: Algunas condenas impiden ser enfermero, maestro, etc.",
                    "Custodia de menores: Puede considerarse en decisiones del tribunal de familia"
                  ]
                },
                "decide": {
                  "title": "¿Aceptar el acuerdo o ir a juicio?",
                  "description": "Esta es una de las decisiones más importantes en su caso. Aquí hay factores a considerar:",
                  "acceptTitle": "Considere aceptar si:",
                  "acceptReasons": [
                    "La evidencia en su contra es fuerte",
                    "El acuerdo reduce significativamente su sentencia potencial",
                    "Ir a juicio podría resultar en consecuencias mucho peores",
                    "El acuerdo le permite evitar ciertos cargos con consecuencias colaterales serias",
                    "Su abogado lo recomienda fuertemente"
                  ],
                  "trialTitle": "Considere ir a juicio si:",
                  "trialReasons": [
                    "Es verdaderamente inocente",
                    "La evidencia en su contra es débil",
                    "Sus derechos constitucionales fueron violados (registro ilegal, confesión forzada)",
                    "La oferta no es mucho mejor que lo que obtendría en juicio",
                    "Está dispuesto a aceptar el riesgo por una oportunidad de absolución"
                  ]
                }
              }
            },
            "legalDisclaimer": {
              "title": "Aviso Legal:",
              "text": "Esta información es solo para fines educativos y no constituye asesoramiento legal. Las leyes y procedimientos varían según el estado y la jurisdicción federal. Siempre consulte con un abogado calificado para obtener asesoramiento específico a su situación."
            }
          },
          "caseTimeline": {
            "title": "Línea de Tiempo del Caso",
            "subtitle": "Siga las etapas de un caso penal de principio a fin. Seleccione su etapa actual para ver qué esperar y cuáles son sus derechos.",
            "selectStage": "Seleccione una etapa para saber qué sucede y cuáles son sus derechos",
            "yourRights": "Sus Derechos",
            "whatToKnow": "Lo Que Debe Saber",
            "viewQuickRef": "Tarjeta de Referencia Rápida",
            "disclaimer": {
              "title": "Importante:",
              "text": "Cada caso es diferente. Las etapas mostradas son una guía general para un caso penal típico. Su caso puede tener pasos adicionales o menos. Siempre consulte con su abogado sobre su situación específica."
            },
            "stages": {
              "arrest": {
                "title": "Arresto",
                "timeframe": "Minutos a horas",
                "description": "Un arresto ocurre cuando la policía lo toma bajo custodia. Pueden esposarlo y llevarlo a una estación de policía. Esto puede suceder con o sin una orden judicial. Los oficiales deben tener causa probable para creer que usted cometió un delito.",
                "rights": [
                  "Tiene derecho a guardar silencio",
                  "Tiene derecho a un abogado",
                  "No tiene que consentir a un registro",
                  "Tiene derecho a saber por qué lo están arrestando"
                ],
                "tips": [
                  "Mantenga la calma y no resista, incluso si el arresto parece injusto",
                  "Diga claramente: 'Estoy ejerciendo mi derecho a guardar silencio'",
                  "Diga: 'Quiero un abogado' — luego deje de hablar",
                  "Recuerde los números de placa de los oficiales y los números de patrulla",
                  "No firme nada sin un abogado presente"
                ]
              },
              "booking": {
                "title": "Registro",
                "timeframe": "1-4 horas",
                "description": "Después del arresto, lo llevan a una cárcel o estación de policía para el registro. Este es el proceso administrativo de registrar su información. Sus pertenencias personales serán tomadas y almacenadas.",
                "rights": [
                  "Todavía tiene derecho a guardar silencio",
                  "Tiene derecho a una llamada telefónica (generalmente dentro de unas horas)",
                  "Puede solicitar atención médica si la necesita",
                  "Sus pertenencias deben ser devueltas cuando sea liberado"
                ],
                "tips": [
                  "Le tomarán huellas dactilares y fotografías",
                  "Use su llamada telefónica para contactar a un abogado o familiar",
                  "No discuta su caso con nadie en el área de detención",
                  "Sea cortés con los oficiales de registro — no perjudica su caso",
                  "Pregunte cuándo verá a un juez"
                ]
              },
              "firstAppearance": {
                "title": "Primera Comparecencia",
                "timeframe": "24-72 horas después del arresto",
                "description": "Su primera vez ante un juez. Los cargos se leen formalmente y el juez decide sobre la fianza. Si no puede pagar un abogado, puede solicitar un defensor público en esta etapa.",
                "rights": [
                  "Derecho a ser informado de los cargos",
                  "Derecho a un abogado (defensor público si no puede pagar uno)",
                  "Derecho a solicitar una fianza razonable",
                  "Derecho a declararse inocente"
                ],
                "tips": [
                  "Casi siempre declare 'no culpable' en esta etapa",
                  "Solicite un defensor público si no puede pagar un abogado",
                  "Vístase apropiadamente y diríjase al juez como 'Su Señoría'",
                  "No discuta los hechos de su caso en audiencia pública",
                  "Traiga información sobre sus vínculos con la comunidad para argumentos de fianza"
                ]
              },
              "pretrial": {
                "title": "Prejuicio",
                "timeframe": "Semanas a meses",
                "description": "El período entre su primera comparecencia y el juicio. Su abogado revisa la evidencia, presenta mociones y puede negociar con el fiscal. Las discusiones de acuerdo de culpabilidad a menudo ocurren durante esta fase.",
                "rights": [
                  "Derecho a ver toda la evidencia que tiene la fiscalía (descubrimiento)",
                  "Derecho a un juicio rápido",
                  "Derecho a que su abogado presente mociones en su nombre",
                  "Derecho a rechazar cualquier acuerdo de culpabilidad ofrecido"
                ],
                "tips": [
                  "Manténgase en contacto cercano con su abogado",
                  "Asista a cada fecha de audiencia — faltar lleva a una orden de arresto",
                  "Siga todas las condiciones de fianza cuidadosamente",
                  "No publique sobre su caso en redes sociales",
                  "Aproximadamente el 90-95% de los casos se resuelven mediante acuerdos de culpabilidad"
                ]
              },
              "discovery": {
                "title": "Descubrimiento",
                "timeframe": "Parte de la fase prejuicio",
                "description": "Ambas partes intercambian evidencia. La fiscalía debe compartir toda la evidencia con su abogado defensor, incluyendo cualquier cosa que pueda ayudar a probar su inocencia (esto se llama la Regla Brady).",
                "rights": [
                  "Derecho a ver toda la evidencia en su contra",
                  "Derecho a evidencia que pueda probar su inocencia (material Brady)",
                  "Derecho a impugnar evidencia mediante mociones",
                  "Derecho a que su abogado revise todos los materiales de descubrimiento"
                ],
                "tips": [
                  "Comparta toda la información con su abogado — el privilegio abogado-cliente lo protege",
                  "Ayude a su abogado a identificar posibles testigos",
                  "Reúna cualquier documento, mensaje o registro que apoye su caso",
                  "Su abogado puede presentar mociones para suprimir evidencia obtenida ilegalmente",
                  "Mantenga notas de todo lo que recuerde sobre el incidente"
                ]
              },
              "trial": {
                "title": "Juicio",
                "timeframe": "Días a semanas",
                "description": "Si su caso va a juicio, ambas partes presentan su caso ante un juez o jurado. La fiscalía debe probar su culpabilidad más allá de una duda razonable. Tiene derecho a testificar o guardar silencio.",
                "rights": [
                  "Derecho a un juicio por jurado (para la mayoría de casos penales)",
                  "Derecho a confrontar e interrogar testigos",
                  "Derecho a presentar su propia evidencia y testigos",
                  "Derecho a testificar o guardar silencio (no puede ser usado en su contra)",
                  "Presunción de inocencia hasta que se pruebe la culpabilidad"
                ],
                "tips": [
                  "Confíe en la estrategia de su abogado — ellos conocen el proceso",
                  "Vístase profesionalmente y sea respetuoso en la corte",
                  "No reaccione emocionalmente al testimonio o evidencia",
                  "Su abogado decide si usted debe testificar",
                  "La carga de la prueba recae sobre la fiscalía, no sobre usted"
                ]
              },
              "sentencing": {
                "title": "Sentencia",
                "timeframe": "Inmediatamente o semanas después del veredicto",
                "description": "Si es declarado culpable, el juez determina su castigo basándose en las guías de sentencia, la gravedad del delito, su historial criminal y otros factores. Tiene derecho a hablar antes de la sentencia.",
                "rights": [
                  "Derecho a hablar en su sentencia (alocución)",
                  "Derecho a que su abogado presente factores atenuantes",
                  "Derecho a apelar la condena o sentencia",
                  "Derecho a un castigo justo y proporcionado (8va Enmienda)"
                ],
                "tips": [
                  "Muestre responsabilidad genuina — los jueces lo notan",
                  "Destaque pasos de rehabilitación (consejería, empleo, educación)",
                  "Pida a familiares o miembros de la comunidad que escriban cartas de apoyo",
                  "Pregunte a su abogado sobre alternativas de sentencia (probatoria, servicio comunitario)",
                  "Entienda su derecho a apelar — hay plazos"
                ]
              }
            }
          },
          "quickRef": {
            "title": "Tarjetas de Referencia Rápida",
            "subtitle": "Guías compactas e imprimibles para sus derechos en cada etapa. Guárdelas en su teléfono o imprimalas.",
            "printAll": "Imprimir Todas las Tarjetas",
            "tabs": {
              "police": "Encuentros Policiales",
              "court": "Etapas de la Corte",
              "all": "Todas las Tarjetas"
            },
            "disclaimer": {
              "title": "Importante:",
              "text": "Estas tarjetas proporcionan información general sobre sus derechos. Las leyes varían según el estado y la situación. Esto no es asesoramiento legal. Siempre consulte con un abogado sobre su caso específico."
            },
            "police": {
              "title": "Si la Policía lo Detiene",
              "stay": "Mantenga la Calma y Recuerde",
              "stay1": "Tiene derecho a guardar silencio. Diga: \"Estoy ejerciendo mi derecho a guardar silencio.\"",
              "stay2": "Tiene derecho a rechazar registros. Diga: \"No doy mi consentimiento para un registro.\"",
              "stay3": "Pregunte: \"¿Soy libre de irme?\" Si la respuesta es sí, aléjese con calma.",
              "stay4": "Tiene derecho a un abogado. Diga: \"Quiero hablar con un abogado.\"",
              "doHeading": "Haga",
              "do1": "Mantenga sus manos visibles en todo momento",
              "do2": "Proporcione su nombre e identificación si se lo piden",
              "do3": "Mantenga la calma y hable claramente",
              "do4": "Recuerde los números de placa y de patrulla",
              "do5": "Escriba todo inmediatamente después",
              "dontHeading": "No Haga",
              "dont1": "No resista el arresto, incluso si cree que es injusto",
              "dont2": "No corra, discuta ni haga movimientos bruscos",
              "dont3": "No consienta un registro de su persona, auto o casa",
              "dont4": "No responda preguntas sin un abogado presente",
              "dont5": "No firme nada sin leerlo y consultar a un abogado",
              "ifArrested": "Si lo Arrestan",
              "arrested1": "Diga claramente: \"Quiero un abogado\" — luego deje de hablar",
              "arrested2": "Tiene al menos una llamada telefónica — úsela para llamar a un abogado o familiar",
              "arrested3": "No discuta su caso con nadie excepto su abogado",
              "arrested4": "Deben llevarlo ante un juez dentro de 48-72 horas"
            },
            "arraignment": {
              "title": "Lectura de Cargos",
              "expect": "Qué Esperar",
              "expect1": "El juez lee los cargos en su contra",
              "expect2": "Usted declara: culpable, no culpable o nolo contendere",
              "expect3": "Se puede establecer o modificar el monto de la fianza",
              "expect4": "Su abogado puede solicitar un defensor público si es necesario",
              "say": "Qué Decir",
              "say1": "\"No culpable\" — casi siempre es la mejor declaración inicial",
              "say2": "\"Me gustaría un abogado designado por la corte\" — si no puede pagar uno",
              "say3": "\"Sí, Su Señoría\" / \"No, Su Señoría\" — al dirigirse al juez",
              "dontSay": "No Diga",
              "dontSay1": "No discuta los hechos de su caso en audiencia abierta",
              "dontSay2": "No se declare culpable sin hablar primero con un abogado",
              "dontSay3": "No discuta con el juez o fiscal",
              "rights": "Sus Derechos",
              "right1": "Derecho a un abogado (gratis si no puede pagarlo)",
              "right2": "Derecho a conocer los cargos en su contra",
              "right3": "Derecho a una fianza razonable",
              "right4": "Derecho a un juicio rápido"
            },
            "bail": {
              "title": "Audiencia de Fianza",
              "expect": "Qué Esperar",
              "expect1": "El juez decide si otorga fianza y cuánto",
              "expect2": "Factores: gravedad del cargo, riesgo de fuga, vínculos comunitarios, historial criminal",
              "expect3": "Usted o su abogado pueden argumentar por una fianza más baja o liberación",
              "expect4": "Se pueden establecer condiciones de liberación (toque de queda, órdenes de no contacto, etc.)",
              "say": "Qué Decir",
              "say1": "Enfatice vínculos comunitarios: familia, trabajo, tiempo de residencia",
              "say2": "Mencione que cumplirá con todas las fechas de audiencia",
              "say3": "Ofrezca alternativas si la fianza es muy alta (tobillera electrónica, reportes)",
              "dontSay": "No Diga",
              "dontSay1": "No discuta los detalles de su caso",
              "dontSay2": "No haga promesas que no puede cumplir",
              "dontSay3": "No muestre frustración o enojo hacia la corte",
              "rights": "Sus Derechos",
              "right1": "Derecho a una fianza razonable (8va Enmienda)",
              "right2": "Derecho a una audiencia de fianza",
              "right3": "Derecho a apelar una decisión de fianza"
            },
            "pretrial": {
              "title": "Prejuicio / Descubrimiento",
              "expect": "Qué Esperar",
              "expect1": "Ambas partes intercambian evidencia (proceso de descubrimiento)",
              "expect2": "Su abogado puede presentar mociones para suprimir evidencia o desestimar cargos",
              "expect3": "Las negociaciones de acuerdo de culpabilidad a menudo ocurren durante esta fase",
              "expect4": "Esta fase puede tomar semanas a meses",
              "say": "Qué Hacer",
              "do1": "Manténgase en contacto cercano con su abogado",
              "do2": "Asista a cada fecha de audiencia — faltar puede resultar en una orden de arresto",
              "do3": "Siga todas las condiciones de fianza estrictamente",
              "do4": "Reúna cualquier evidencia o testigos que ayuden a su caso",
              "dontSay": "No Haga",
              "dont1": "No discuta su caso en redes sociales o con otros",
              "dont2": "No contacte testigos o víctimas directamente",
              "dont3": "No acepte un acuerdo de culpabilidad sin entender completamente las consecuencias",
              "rights": "Sus Derechos",
              "right1": "Derecho a ver toda la evidencia en su contra (Regla Brady)",
              "right2": "Derecho a un juicio rápido",
              "right3": "Derecho a presentar su propia evidencia y testigos"
            },
            "plea": {
              "title": "Audiencia de Declaración",
              "expect": "Qué Esperar",
              "expect1": "El juez pregunta si entiende la declaración y sus consecuencias",
              "expect2": "Debe confirmar que la declaración es voluntaria y no fue coaccionada",
              "expect3": "El juez explica la sentencia máxima posible",
              "expect4": "La sentencia puede ocurrir inmediatamente o programarse para después",
              "say": "Qué Decir",
              "say1": "\"Sí, entiendo\" — cuando el juez explica los términos de la declaración",
              "say2": "\"Sí, esta es mi decisión voluntaria\" — confirme que no fue forzado",
              "say3": "Pida a su abogado que le explique cualquier cosa que no entienda",
              "dontSay": "No Diga",
              "dontSay1": "No diga \"No lo hice\" mientras se declara culpable — el juez puede rechazar la declaración",
              "dontSay2": "No acepte una declaración si no entiende las consecuencias colaterales (inmigración, vivienda, empleo)",
              "dontSay3": "No se apresure — puede pedir más tiempo para decidir",
              "rights": "Sus Derechos",
              "right1": "Derecho a retirar una declaración de culpabilidad en ciertas circunstancias",
              "right2": "Derecho a conocer las consecuencias completas antes de declarar",
              "right3": "Derecho a rechazar cualquier acuerdo de culpabilidad e ir a juicio"
            },
            "sentencing": {
              "title": "Sentencia",
              "expect": "Qué Esperar",
              "expect1": "El juez considera las guías de sentencia, declaraciones de impacto de la víctima y su historial",
              "expect2": "Su abogado puede presentar factores atenuantes (primer delito, empleo, responsabilidades familiares)",
              "expect3": "Resultados posibles: multas, probatoria, servicio comunitario, encarcelamiento o combinación",
              "expect4": "Puede tener la oportunidad de dirigirse a la corte",
              "say": "Qué Decir",
              "say1": "Exprese arrepentimiento genuino si ha sido declarado culpable",
              "say2": "Mencione pasos de rehabilitación que ha tomado (consejería, clases, empleo)",
              "say3": "Describa sus responsabilidades (hijos, familia, comunidad)",
              "dontSay": "No Diga",
              "dontSay1": "No culpe a la víctima ni minimice el delito",
              "dontSay2": "No discuta con las preguntas del juez",
              "dontSay3": "No ponga excusas — asuma responsabilidad cuando sea apropiado",
              "rights": "Sus Derechos",
              "right1": "Derecho a hablar en su sentencia (alocución)",
              "right2": "Derecho a apelar la sentencia",
              "right3": "Derecho a un castigo justo y proporcionado (8va Enmienda)",
              "right4": "Derecho a que su abogado esté presente"
            }
          },
          "diversionPrograms": {
            "hero": {
              "title": "Programas de Desviación",
              "subtitle": "Encuentre programas alternativos para evitar condenas y obtener la ayuda que necesita"
            },
            "navigation": {
              "backToHome": "Volver al Inicio",
              "programsCount": "{{count}} de {{total}} programas"
            },
            "search": {
              "placeholder": "Ingrese su código postal, condado o ciudad...",
              "filterByState": "Filtrar por Estado:",
              "allStates": "Todos los estados",
              "federalPrograms": "Programas Federales",
              "filterByProgramType": "Filtrar por Tipo de Programa:",
              "allProgramTypes": "Todos los tipos de programas",
              "clearAllFilters": "Limpiar Todos los Filtros"
            },
            "infoBanner": {
              "title": "¿Qué son los Programas de Desviación?",
              "description": "Los programas de desviación permiten a los acusados elegibles evitar el proceso penal tradicional completando tratamiento, servicio comunitario u otros requisitos. La finalización exitosa a menudo resulta en cargos desestimados o penas reducidas."
            },
            "programCard": {
              "location": "Ubicación",
              "county": "Condado",
              "moreLocations": "+{{count}} más",
              "programTypes": "Tipos de Programas",
              "eligibility": "Elegibilidad",
              "contactInformation": "Información de Contacto",
              "visitWebsite": "Visitar Sitio Web"
            },
            "emptyState": {
              "title": "No se encontraron programas",
              "description": "Intente ajustar su búsqueda de ubicación o filtros para encontrar programas en su área.",
              "clearFilters": "Limpiar Filtros"
            },
            "quickNav": {
              "legalGuidanceTitle": "¿Necesita Orientación Legal?",
              "legalGuidanceDesc": "Obtenga asesoramiento legal personalizado para sus cargos y situación específicos.",
              "legalGuidanceButton": "Obtener Orientación Legal",
              "recordClearingTitle": "Aprenda sobre Limpieza de Antecedentes",
              "recordClearingDesc": "Verifique si es elegible para eliminar o sellar su registro penal.",
              "recordClearingButton": "Verificar Elegibilidad"
            }
          },
          "recordExpungement": {
            "hero": {
              "title": "Eliminación de Antecedentes Penales",
              "subtitle": "Verifique si es elegible para limpiar su registro penal y comenzar de nuevo"
            },
            "navigation": {
              "backToHome": "Volver al Inicio"
            },
            "infoBanner": {
              "title": "¿Qué es la Eliminación de Antecedentes?",
              "description": "La eliminación de antecedentes remueve o sella los registros penales de la vista pública, ayudándole a avanzar sin la carga de condenas pasadas que afecten el empleo, vivienda u otras oportunidades.",
              "stateNote": "Cada estado tiene diferentes reglas, períodos de espera y requisitos de elegibilidad."
            },
            "eligibilityForm": {
              "title": "Verifique su Elegibilidad",
              "stateQuestion": "¿En qué estado fue su condena?",
              "statePlaceholder": "Seleccione su estado...",
              "federalCourt": "Corte Federal",
              "offenseTypeQuestion": "¿Qué tipo de delito fue?",
              "misdemeanor": "Delito Menor",
              "felony": "Delito Grave",
              "completionDateQuestion": "¿Cuándo completó su sentencia/libertad condicional?",
              "offenseCategoryQuestion": "¿Qué tipo de delito fue? (ej., posesión de drogas, DUI, robo, asalto)",
              "offenseCategoryPlaceholder": "ej., posesión de drogas, robo, DUI, asalto",
              "multipleConvictions": "Tengo múltiples condenas en mi registro",
              "checkEligibility": "Verificar Elegibilidad",
              "reset": "Restablecer"
            },
            "eligibilityResult": {
              "likelyEligible": "Probablemente Elegible",
              "possiblyEligible": "Posiblemente Elegible",
              "unlikelyEligible": "Probablemente No Elegible",
              "nextSteps": "Próximos Pasos",
              "stateInfo": "Información de Eliminación de {{state}}",
              "overview": "Descripción General",
              "commonExclusions": "Exclusiones Comunes",
              "moreExclusions": "+{{count}} más",
              "legalSources": "Fuentes Legales",
              "disclaimerTitle": "Importante:",
              "disclaimerText": "Esta es solo una evaluación preliminar. La elegibilidad depende de muchos factores incluyendo circunstancias específicas, reglas locales y discreción judicial. Consulte con un abogado calificado para asesoramiento legal definitivo sobre su situación."
            },
            "quickNav": {
              "legalHelpTitle": "¿Necesita Ayuda Legal?",
              "legalHelpDesc": "Obtenga orientación legal personalizada para su situación específica.",
              "legalHelpButton": "Obtener Orientación Legal",
              "diversionProgramsTitle": "Encontrar Programas de Desviación",
              "diversionProgramsDesc": "Explore programas alternativos que pueden ayudar a evitar condenas.",
              "diversionProgramsButton": "Explorar Opciones"
            }
          },
          "friendsFamily": {
            "hero": {
              "title": "Ayudando a un Amigo o Familiar Arrestado",
              "subtitle": "Pasos prácticos que puede tomar para apoyar a alguien que ha sido arrestado o detenido"
            },
            "criticalAlert": {
              "title": "Las Primeras 24 Horas Son Críticas:",
              "text": "La acción rápida puede hacer una diferencia significativa al ayudar a su ser querido. Concéntrese en recopilar información, asegurar representación legal y proporcionar apoyo."
            },
            "sectionTitle": "Plan de Acción Paso a Paso",
            "step1": {
              "title": "Averigüe Dónde Están Detenidos",
              "description": "El primer paso es localizar en qué instalación retienen a su ser querido.",
              "howToFindTitle": "Cómo Encontrarlos:",
              "howToFind1": "Llame a la estación de policía local o cárcel del condado",
              "howToFind2": "Consulte el localizador de reclusos en línea (sitio web del sheriff del condado)",
              "howToFind3": "Llame a la oficina del secretario del tribunal",
              "howToFind4": "Para arrestos federales: llame a la Oficina Federal de Prisiones",
              "infoToProvideTitle": "Información que Debe Proporcionar:",
              "infoToProvide1": "Nombre legal completo",
              "infoToProvide2": "Fecha de nacimiento",
              "infoToProvide3": "Fecha/hora aproximada del arresto",
              "infoToProvide4": "Ubicación donde fue arrestado (si se conoce)"
            },
            "step2": {
              "title": "Asegurar Representación Legal",
              "description": "Involucrar a un abogado temprano es una de las cosas más importantes que puede hacer.",
              "alertTitle": "Importante:",
              "alertText": "Si no pueden pagar un abogado, tienen derecho a un defensor público. No se demore - solicite uno en la primera comparecencia ante el tribunal (lectura de cargos).",
              "publicDefenderTitle": "Defensor Público",
              "publicDefenderDesc": "Gratuito para quienes califican financieramente. Solicite en la lectura de cargos o a través del secretario del tribunal.",
              "legalAidTitle": "Organizaciones de Asistencia Legal",
              "legalAidDesc": "Servicios legales gratuitos o de bajo costo para personas que califiquen.",
              "privateAttorneyTitle": "Abogado Privado",
              "privateAttorneyDesc": "Representación contratada. Puede ser costoso pero puede ofrecer atención más personalizada."
            },
            "step3": {
              "title": "Recopilar Información Importante",
              "description": "Recopile detalles que ayudarán a su abogado y a prepararse para los procedimientos judiciales.",
              "keyInfoTitle": "Información Clave que Debe Documentar:",
              "keyInfo1": "Número de reserva/número de recluso",
              "keyInfo2": "Cargos presentados en su contra",
              "keyInfo3": "Fecha y hora del tribunal",
              "keyInfo4": "Monto de la fianza (si se estableció)",
              "keyInfo5": "Nombres de los oficiales que realizaron el arresto",
              "keyInfo6": "Número de caso",
              "keyInfo7": "Nombre del defensor público asignado (si corresponde)",
              "keyInfo8": "Información de contacto de testigos"
            },
            "step4": {
              "title": "Entender la Fianza y la Libertad Bajo Fianza",
              "description": "La fianza permite la liberación temporal de la cárcel mientras espera el juicio.",
              "bailOptionsTitle": "Opciones de Fianza:",
              "cashBailTitle": "Fianza en Efectivo:",
              "cashBailDesc": "Pague el monto completo al tribunal (se reembolsa después de que termine el caso)",
              "bailBondTitle": "Fianza con Aval:",
              "bailBondDesc": "Pague el 10-15% al fiador (no reembolsable)",
              "propertyBondTitle": "Fianza de Propiedad:",
              "propertyBondDesc": "Use propiedad como garantía",
              "rorTitle": "Liberación bajo Palabra:",
              "rorDesc": "Liberado sin pago (bajo riesgo de fuga)",
              "warningTitle": "Advertencia sobre Fiadores:",
              "warningText": "Si usa un fiador, usted es responsable si la persona no se presenta ante el tribunal. Podría perder su garantía o estar obligado a pagar el monto total de la fianza."
            },
            "step5": {
              "title": "Proporcionar Apoyo Continuo",
              "description": "Ser arrestado es estresante. Aquí le mostramos cómo puede ayudar durante el proceso.",
              "practicalHelpTitle": "Ayuda Práctica:",
              "practicalHelp1": "Asista a las audiencias judiciales para dar apoyo",
              "practicalHelp2": "Ayude a reunir referencias de carácter",
              "practicalHelp3": "Recopile registros de empleo",
              "practicalHelp4": "Asegure documentos importantes",
              "practicalHelp5": "Administre sus asuntos mientras está detenido",
              "practicalHelp6": "Deposite dinero para llamadas telefónicas/comisaría",
              "emotionalSupportTitle": "Apoyo Emocional:",
              "emotionalSupport1": "Manténgase en contacto a través de canales aprobados",
              "emotionalSupport2": "Escriba cartas si las visitas no son posibles",
              "emotionalSupport3": "Permanezca positivo y alentador",
              "emotionalSupport4": "No discuta detalles del caso en llamadas monitoreadas",
              "emotionalSupport5": "Ayúdelos a mantenerse conectados con la familia",
              "emotionalSupport6": "Apoye sus necesidades de salud mental"
            },
            "warnings": {
              "title": "Recordatorios Importantes",
              "jailCallsTitle": "Nunca Discuta Detalles del Caso por Teléfono de la Cárcel:",
              "jailCallsText": "Todas las llamadas desde la cárcel se graban y pueden usarse como evidencia. Solo discuta el caso con su abogado a través de canales confidenciales aprobados.",
              "interferenceTitle": "No Intente Interferir:",
              "interferenceText": "Nunca intente contactar testigos, destruir evidencia o interferir con la investigación. Esto puede resultar en cargos adicionales tanto para usted como para su ser querido."
            },
            "disclaimer": {
              "title": "Descargo de Responsabilidad Legal:",
              "text": "Esta información es solo para fines educativos y no constituye asesoramiento legal. Cada situación es diferente. Consulte con un abogado calificado para orientación específica al caso de su ser querido."
            },
            "privacyBanner": {
              "title": "Privacidad Primero:",
              "text": "No almacenamos sus datos personales — toda la información se elimina después de la sesión."
            }
          },
          "courtLocator": {
            "hero": {
              "title": "Encuentre su Tribunal Local",
              "subtitle": "Ubique tribunales cercanos utilizando fuentes de datos gubernamentales gratuitas y OpenStreetMap. Obtenga información de contacto, horarios de operación y servicios disponibles en su área."
            },
            "search": {
              "inputPlaceholder": "Ingrese código postal",
              "searchButton": "Buscar",
              "searching": "Buscando...",
              "error": "Por favor ingrese un código postal válido de 5 dígitos",
              "errorGeneral": "No se puede buscar oficinas. Por favor intente nuevamente o contacte a su tribunal local para información.",
              "limitedData": "Datos limitados de tribunales disponibles para esta área. Mostrando resultados de muestra.",
              "sampleData": "Usando datos de muestra. Cierta información de tribunales puede ser limitada para esta área."
            },
            "results": {
              "title": "Resultados de Búsqueda de Tribunales",
              "foundCourts": "Se encontró {{count}} tribunal{{plural}} en su área",
              "noCourts": "No se encontraron tribunales",
              "tryDifferent": "Intente buscar con un código postal diferente"
            },
            "sections": {
              "stateTitle": "Tribunales Estatales y Locales ({{count}})",
              "stateDesc": "Tribunales organizados por condado, con tribunales del mismo condado listados primero",
              "federalTitle": "Tribunales Federales ({{count}})",
              "federalDesc": "Los tribunales federales manejan crímenes federales y casos civiles"
            },
            "courtTypes": {
              "federal": "Tribunal Federal",
              "state": "Tribunal Estatal",
              "municipal": "Tribunal Municipal",
              "traffic": "Tribunal de Tránsito",
              "bankruptcy": "Tribunal de Quiebras",
              "court": "Tribunal"
            },
            "courtCard": {
              "phone": "Teléfono",
              "hours": "Horario",
              "services": "Servicios",
              "directions": "Obtener Direcciones",
              "milesAway": "{{distance}} mi de distancia"
            },
            "info": {
              "title": "Entendiendo Tipos de Tribunales",
              "subtitle": "Diferentes tribunales manejan diferentes tipos de casos. Esto es lo que necesita saber.",
              "federal": {
                "title": "Tribunales Federales",
                "desc": "Manejan violaciones de la ley federal, incluyendo crímenes federales, quiebras y casos que involucran agencias federales o cuestiones constitucionales.",
                "examples": "Robo bancario, tráfico de drogas entre estados, evasión de impuestos federales, violaciones migratorias"
              },
              "state": {
                "title": "Tribunales Estatales",
                "desc": "Manejan la mayoría de casos criminales y civiles, incluyendo delitos graves, delitos menores, derecho familiar y violaciones de leyes estatales.",
                "examples": "Asalto, robo, DUI, violencia doméstica, sucesiones, asuntos de tribunal familiar"
              },
              "municipal": {
                "title": "Tribunales Municipales",
                "desc": "Manejan violaciones de ordenanzas locales y delitos menores dentro de los límites de la ciudad.",
                "examples": "Quejas de ruido, violaciones de zonificación, infracciones menores de tránsito, violaciones del código de la ciudad"
              }
            },
            "faq": {
              "title": "Preguntas Frecuentes",
              "q1": "¿Cómo sé qué tribunal maneja mi caso?",
              "a1": "El tipo de cargo determina qué tribunal tiene jurisdicción. Los crímenes federales van al tribunal federal, los crímenes estatales al tribunal estatal. Revise su citación judicial o contacte al secretario del tribunal si no está seguro.",
              "q2": "¿Puedo visitar el tribunal antes de mi fecha de comparecencia?",
              "a2": "Sí, la mayoría de los tribunales están abiertos al público durante horas de oficina. Esto puede ayudarle a encontrar la sala correcta y sentirse más cómodo en su fecha de comparecencia real.",
              "q3": "¿Qué debo llevar al tribunal?",
              "a3": "Lleve su citación judicial, identificación válida, cualquier documento relevante relacionado con su caso, y papel y bolígrafo para tomar notas. Vístase profesionalmente y llegue temprano."
            },
            "courtInformation": {
              "title": "Información Importante del Tribunal",
              "courtTypesCard": {
                "title": "Tipos de Tribunales",
                "description": "Diferentes tribunales manejan diferentes tipos de casos. Los tribunales federales manejan crímenes federales, los tribunales estatales manejan la mayoría de casos penales, y los tribunales municipales manejan violaciones locales."
              },
              "courtHoursCard": {
                "title": "Horarios del Tribunal",
                "description": "La mayoría de los tribunales operan de lunes a viernes durante horas de oficina. Algunos tribunales tienen horarios extendidos o sesiones de fin de semana para ciertos asuntos."
              },
              "dataSourcesCard": {
                "title": "Fuentes de Datos",
                "description": "Ubicaciones de tribunales de OpenStreetMap y CourtListener (Proyecto de Ley Libre). Siempre llame con anticipación para confirmar horarios y procedimientos ya que los datos pueden variar."
              }
            }
          },
          "developmentRoadmap": {
            "hero": {
              "title": "Hoja de Ruta de Desarrollo",
              "subtitle": "Nuestra Visión para el Futuro",
              "description": "Siga nuestro progreso mientras construimos la plataforma de asistencia legal gratuita más completa. Esta hoja de ruta es transparente, basada en datos y enfocada en expandir el acceso a la justicia.",
              "openSourceNote": "Este proyecto es de código abierto (Licencia MIT para código, CC0 para documentación) y se construye en público. Estamos comprometidos con la transparencia en el desarrollo y la toma de decisiones."
            },
            "mission": {
              "title": "Nuestra Misión y Principios",
              "accessToJustice": {
                "title": "Acceso a la Justicia",
                "description": "Hacer que la orientación legal sea accesible para todos, independientemente de su estado económico o ubicación"
              },
              "privacyFirst": {
                "title": "Privacidad Primero",
                "description": "Proteger la privacidad del usuario con sesiones efímeras y sin retención de datos"
              },
              "continuousImprovement": {
                "title": "Mejora Continua",
                "description": "Iterando basándonos en comentarios de usuarios y el panorama legal en evolución"
              }
            },
            "stats": {
              "completed": "Completado",
              "inProgress": "En Progreso",
              "planned": "Planificado",
              "researching": "Investigando"
            },
            "categories": {
              "all": "Todas las Categorías",
              "data": "Fuentes de Datos",
              "features": "Características",
              "infrastructure": "Infraestructura",
              "ai": "IA y Aprendizaje Automático",
              "legal": "Contenido Legal"
            },
            "filters": {
              "title": "Filtrar por Categoría",
              "viewAll": "Ver Todo"
            },
            "progress": {
              "overall": "Progreso General",
              "completion": "{{percent}}% Completo"
            },
            "status": {
              "completed": "Completado",
              "inProgress": "En Progreso",
              "planned": "Planificado",
              "researching": "Investigando"
            },
            "priority": {
              "critical": "Crítico",
              "high": "Alto",
              "medium": "Medio",
              "low": "Bajo"
            },
            "roadmapItem": {
              "estimatedCompletion": "Finalización Est.",
              "dependencies": "Dependencias",
              "challenges": "Desafíos",
              "impact": "Impacto",
              "progress": "Progreso"
            },
            "items": {
              "attorneyTools": {
                "title": "Portal de Herramientas para Abogados",
                "description": "Sección dedicada para abogados licenciados con búsqueda de registros judiciales, recursos de documentos y herramientas profesionales. Base para funciones específicas para abogados.",
                "impact": "Permite funciones especializadas para profesionales legales mientras mantiene acceso compartido a recursos centrales"
              },
              "courtlistener": {
                "title": "Integración API CourtListener",
                "description": "Integración completa con la API CourtListener del Proyecto Ley Libre para más de 8.4 millones de opiniones judiciales y expedientes federales",
                "impact": "Proporciona acceso fundamental a jurisprudencia federal y registros judiciales"
              },
              "pacer": {
                "title": "Autenticación y Acceso a Datos PACER",
                "description": "Implementar API de autenticación PACER y sistema de recuperación de documentos rentable",
                "impact": "Acceso a más de 500M de documentos judiciales federales y actualizaciones de casos en tiempo real",
                "challenges": {
                  "cost": "Gestión de costos de $0.10/página",
                  "rateLimit": "Cumplimiento de límites de tasa",
                  "bulk": "Optimización de datos masivos"
                }
              },
              "stateStatutes": {
                "title": "Base de Datos de Leyes Estatales",
                "description": "Cobertura completa de 50 estados + DC lograda con 1,255 estatutos penales en 12 categorías de delitos incluyendo homicidio, asalto, robo, fraude, delitos de drogas y más. 713 coincidencias de cargos-estatutos validadas con enlaces a sitios web oficiales de legislaturas.",
                "impact": "Cobertura nacional completa de estatutos penales estatales"
              },
              "aiGuidance": {
                "title": "Motor de Orientación Legal con IA",
                "description": "Sistema avanzado de IA para generar orientación legal personalizada basada en parámetros de caso. Actualmente impulsado por Claude Sonnet 4 con indicaciones conscientes de jurisdicción.",
                "impact": "Funcionalidad central para asistencia legal personalizada",
                "challenges": {
                  "accuracy": "Validación de precisión legal",
                  "bias": "Detección y mitigación de sesgos",
                  "jurisdiction": "Matices específicos de jurisdicción"
                }
              },
              "attorneyDocGen": {
                "title": "Generación de Documentos para Abogados",
                "description": "28 plantillas de documentos impulsadas por IA para abogados licenciados: 17 mociones penales (los 50 estados + DC, por condado/distrito) y 11 mociones de inmigración (formato EOIR, por distrito/división). Cubre todas las fases del caso desde presentaciones iniciales hasta post-sentencia.",
                "impact": "Reduce la carga de tiempo para defensores públicos y abogados de asistencia legal con altas cargas de casos"
              },
              "publicApiV1": {
                "title": "API REST Pública v1",
                "description": "API abierta que proporciona acceso de terceros a contenido legal, cargos penales, programas de desvío, términos del glosario y reglas de eliminación de antecedentes. Incluye especificación OpenAPI, widgets integrables, soporte CORS y limitación de velocidad.",
                "impact": "Permite a organizaciones de asistencia legal y desarrolladores integrar nuestros datos en sus propias herramientas"
              },
              "securityAudit": {
                "title": "Auditoría de Seguridad y Código",
                "description": "Fortalecimiento integral de seguridad: eliminación de PII de prompts de IA, traslado de claves API de URLs a encabezados seguros, registro estructurado seguro para producción, eliminación de más de 1,400 líneas de código muerto y desinstalación de dependencias no utilizadas.",
                "impact": "Protecciones de privacidad de datos más fuertes y un código más limpio y mantenible"
              },
              "bilingualSupport": {
                "title": "Soporte Trilingüe Inglés/Español/Chino",
                "description": "Soporte trilingüe completo en toda la plataforma incluyendo orientación de casos, información de derechos, cargos penales, términos del glosario, orientación migratoria, línea de tiempo de casos, tarjetas de referencia rápida y búsqueda en todo el sitio. Más de 3,150 claves de traducción en cada idioma.",
                "impact": "Información legal accesible para comunidades hispanohablantes y de habla china que navegan el sistema de justicia"
              },
              "additionalLanguages": {
                "title": "Soporte de Idiomas Adicionales",
                "description": "Expandir más allá del inglés, español y chino para incluir vietnamita, coreano, tagalo y otros idiomas comunes en comunidades inmigrantes.",
                "impact": "Acceso más amplio para personas que no hablan inglés navegando el sistema de justicia"
              },
              "expandedJurisdictions": {
                "title": "Cobertura Jurisdiccional Ampliada",
                "description": "Agregar reglas específicas de tribunales, procedimientos locales y orientación específica de jurisdicción para estados y condados adicionales.",
                "impact": "Orientación más precisa y localmente relevante para usuarios en todo el país"
              },
              "judgeAnalytics": {
                "title": "Análisis de Jueces y Tribunales",
                "description": "Análisis estadístico de patrones de sentencia, acuerdos de culpabilidad y toma de decisiones judiciales",
                "impact": "Perspectivas predictivas para estrategia de casos y resultados",
                "challenges": {
                  "privacy": "Preocupaciones de privacidad de datos",
                  "significance": "Significancia estadística",
                  "historicalBias": "Sesgo en datos históricos"
                }
              },
              "mobileApp": {
                "title": "Aplicación Móvil",
                "description": "Aplicaciones móviles nativas para iOS y Android con capacidades offline para situaciones de emergencia",
                "impact": "Accesibilidad durante arresto y situaciones de emergencia"
              },
              "privacyEncryption": {
                "title": "Privacidad y Encriptación Avanzadas",
                "description": "Protección de privacidad completa: detección de PII basada en NLP, seguimiento de consentimiento anónimo, encriptación en tránsito (HTTPS), encriptación en reposo (base de datos), y efimeralidad basada en sesión con eliminación de datos controlada por el usuario.",
                "impact": "Máxima protección de privacidad para usuarios vulnerables"
              },
              "clientE2E": {
                "title": "Encriptación de Extremo a Extremo del Cliente",
                "description": "Función avanzada futura: Encriptación basada en navegador donde los datos del usuario se encriptan antes de salir del dispositivo, garantizando arquitectura de conocimiento cero.",
                "impact": "Privacidad máxima para consultas extremadamente sensibles",
                "challenges": {
                  "keyManagement": "Generación y almacenamiento seguro de claves en el navegador sin acceso al servidor",
                  "aiCompatibility": "El procesamiento de IA requiere texto sin encriptar - compromiso entre encriptación y calidad de orientación"
                }
              }
            },
            "badges": {
              "quickWin": "Ganancia Rápida"
            },
            "getInvolved": {
              "title": "Involúcrese",
              "subtitle": "Este es un proyecto impulsado por la comunidad. Así es como puede contribuir:",
              "contribute": {
                "title": "Contribuir en GitHub",
                "description": "Enviar código, reportar errores o sugerir mejoras"
              },
              "feedback": {
                "title": "Compartir Retroalimentación",
                "description": "Díganos qué características le ayudarían más"
              },
              "spread": {
                "title": "Difundir la Palabra",
                "description": "Compartir esta herramienta con quienes necesitan asistencia legal"
              }
            },
            "featureRequest": {
              "modalTitle": "Solicitar una Característica",
              "description": "¿Tiene una idea de cómo podemos servir mejor a las personas navegando el sistema legal? Nos encantaría escucharle.",
              "nameLabel": "Su Nombre",
              "namePlaceholder": "Ingrese su nombre",
              "emailLabel": "Dirección de Correo Electrónico",
              "emailPlaceholder": "Ingrese su correo electrónico",
              "descriptionLabel": "Descripción de la Característica",
              "descriptionPlaceholder": "Describa la característica que le gustaría ver...",
              "submitButton": "Enviar Solicitud",
              "cancelButton": "Cancelar",
              "requestButton": "Solicitar una Característica",
              "validationName": "Información Faltante",
              "validationNameDesc": "Por favor complete todos los campos.",
              "validationEmail": "Correo Electrónico Inválido",
              "validationEmailDesc": "Por favor ingrese una dirección de correo electrónico válida.",
              "successTitle": "Cliente de Correo Abierto",
              "successDesc": "Su cliente de correo predeterminado debería abrirse. Por favor envíe el correo para enviar su solicitud.",
              "disclaimer": "Al enviar una solicitud de característica, usted consiente que le contactemos sobre su sugerencia. Respetamos su privacidad y no compartiremos su información."
            },
            "transparency": {
              "title": "Compromiso con la Transparencia",
              "description": "Creemos en el desarrollo abierto. Todo el progreso, desafíos y decisiones se comparten públicamente para mantener la responsabilidad y construir confianza con las comunidades a las que servimos."
            }
          },
          "missionStatement": {
            "hero": {
              "title": "Declaración de Misión",
              "subtitle": "Defensor Público IA es un bien público dedicado a aprovechar la inteligencia artificial, datos legales y automatización para proporcionar asistencia oportuna, precisa y accesible a personas en los Estados Unidos acusadas de crímenes y que pueden no tener acceso inmediato a asesoramiento legal. Esta plataforma se construye sobre principios de código abierto con licencia MIT para el código y CC0 (Creative Commons Zero) para la documentación, asegurando que permanezca gratuita y accesible para todos los que la necesiten."
            },
            "goals": {
              "title": "Nuestros Objetivos Principales",
              "expandAccess": {
                "title": "Expandir el Acceso a la Justicia",
                "description": "Entregar información legal preliminar, orientación y perspectivas relevantes al caso a los acusados sin costo, reduciendo barreras para poblaciones desatendidas."
              },
              "supportDefenders": {
                "title": "Apoyar Flujos de Trabajo de Defensores Públicos",
                "description": "Proporcionar a los defensores públicos acceso rápido a datos legales agregados, estadísticas de casos y requisitos procedimentales para ayudarles a preparar estrategias de defensa más efectivas."
              },
              "empowerDecisions": {
                "title": "Empoderar la Toma de Decisiones Informadas",
                "description": "Permitir que los acusados comprendan mejor sus derechos, opciones legales y resultados potenciales a través de explicaciones claras y en lenguaje simple fundamentadas en datos confiables."
              },
              "increaseFairness": {
                "title": "Aumentar la Eficiencia y Equidad",
                "description": "Automatizar la recopilación y síntesis de conjuntos de datos legales públicos para que los acusados y abogados puedan identificar rápidamente precedentes relevantes, reglas procedimentales y tendencias de acuerdos o sentencias."
              }
            },
            "principles": {
              "title": "Principios Rectores",
              "description": "Este proyecto está guiado por los principios de equidad, transparencia, privacidad de datos y cumplimiento con las leyes aplicables y pautas éticas que rigen la práctica legal.",
              "disclaimer": "El agente de IA no sustituye a un abogado con licencia, sino que es una herramienta de apoyo para complementar el asesoramiento legal humano y mejorar el acceso a recursos de defensa equitativos."
            }
          },
          "privacyPolicy": {
            "hero": {
              "title": "Política de Privacidad",
              "subtitle": "Estamos comprometidos a proteger su privacidad. Esta política explica cómo manejamos su información.",
              "lastUpdated": "Última actualización: 4 de febrero de 2026"
            },
            "notice": {
              "title": "Plataforma que prioriza la privacidad:",
              "description": "No recopilamos ni almacenamos datos personales. Su privacidad está protegida de forma predeterminada."
            },
            "principles": {
              "title": "Nuestros Principios de Privacidad",
              "noPersonalData": {
                "title": "Sin Recopilación de Datos Personales",
                "description": "No recopilamos, almacenamos ni mantenemos información de identificación personal. Esto incluye nombres, direcciones, detalles de casos, cargos o cualquier otra información que pueda identificarlo personalmente. Todas las interacciones con nuestra plataforma son anónimas."
              },
              "anonymizedData": {
                "title": "Solo Datos Anonimizados",
                "description": "Podemos recopilar datos anonimizados y agregados para los siguientes propósitos:",
                "usage": {
                  "metrics": "Comprender cómo se utiliza nuestra plataforma para mejorar la experiencia del usuario",
                  "improvements": "Identificar características y recursos que son más útiles",
                  "integrations": "Proporcionar información anonimizada a terceros que deseen integrar nuestros servicios en sus plataformas"
                }
              },
              "noSharing": {
                "title": "Sin Compartir o Vender Datos",
                "description": "No compartimos, vendemos ni proporcionamos sus datos a terceros. Como no recopilamos datos personales, no podríamos compartirlos aunque quisiéramos. Cualquier dato anonimizado compartido está completamente desprovisto de información identificatoria."
              }
            },
            "caseData": {
              "title": "Cómo Protegemos la Información de su Caso",
              "summary": "Cuando usa nuestra herramienta de orientación legal, la información de su caso recibe múltiples capas de protección. Esto es exactamente lo que sucede con sus datos:",
              "memoryOnly": {
                "title": "Almacenamiento Solo en Memoria",
                "description": "La información de su caso se almacena solo en la memoria temporal del servidor - nunca se escribe en una base de datos ni se guarda en disco. Esto significa que sus datos existen solo mientras se procesan y no se pueden recuperar después de que finalice su sesión."
              },
              "piiRedaction": {
                "title": "Información Personal Eliminada Automáticamente",
                "description": "Antes de que los detalles de su caso sean procesados por nuestra IA, detectamos y eliminamos automáticamente información personal como nombres, números de teléfono, direcciones de correo electrónico y números de Seguro Social. Esta redacción ocurre localmente en nuestros servidores usando aprendizaje automático - sus datos personales nunca se envían a servicios de IA externos."
              },
              "autoDelete": {
                "title": "Eliminación Automática en 24 Horas",
                "description": "Incluso en memoria, los datos de su caso tienen una vida útil máxima de 24 horas. Después de este tiempo, se eliminan automática y permanentemente. No necesita tomar ninguna acción - la eliminación ocurre automáticamente."
              },
              "serverRestart": {
                "title": "Borrado al Reiniciar el Servidor",
                "description": "Debido a que los datos se almacenan solo en memoria, cualquier reinicio o actualización del servidor borra completamente todos los datos de sesión. Esto ocurre regularmente mientras mejoramos la plataforma, proporcionando una capa adicional de efímero de datos."
              }
            },
            "technical": {
              "title": "Detalles Técnicos",
              "sessions": {
                "title": "Datos de Sesión",
                "description": "Los datos temporales de sesión se utilizan para mantener su experiencia de navegación durante una sola visita. Estos datos se eliminan automáticamente cuando cierra su navegador o finaliza su sesión. No se almacena información de sesión de forma permanente."
              },
              "logs": {
                "title": "Registros del Servidor",
                "description": "Nuestros servidores web pueden recopilar temporalmente información técnica estándar como direcciones IP, tipo de navegador y tiempos de acceso con fines de seguridad y resolución de problemas. Estos registros se conservan por un tiempo limitado y no se utilizan para identificar usuarios individuales."
              },
              "external": {
                "title": "Fuentes de Datos Externas",
                "description": "Nuestra plataforma accede a bases de datos y servicios legales públicos para proporcionarle información:",
                "services": {
                  "anthropic": "Anthropic Claude Sonnet 4 - para generar orientación legal y resúmenes de documentos. Su información personal se elimina antes del procesamiento. Anthropic puede retener los datos hasta 30 días para fines operativos y de seguridad, luego se eliminan automáticamente. Estos datos nunca se usan para entrenar modelos de IA.",
                  "govInfo": "API de GovInfo.gov - para estatutos penales federales (Título 18 USC)",
                  "courtListener": "API de CourtListener - para jurisprudencia y datos judiciales",
                  "recap": "Archivo RECAP - para documentos judiciales federales",
                  "cornell": "Instituto de Información Legal de Cornell - para estatutos legales",
                  "openLaws": "API de OpenLaws - para texto de estatutos estatales y datos legales"
                },
                "note": "Cuando usa nuestra plataforma para buscar en estas bases de datos, sus consultas pueden transmitirse a estos servicios. La información personal se elimina automáticamente antes de enviarse a los servicios de IA. Recomendamos revisar sus políticas de privacidad si tiene inquietudes sobre el acceso a datos externos."
              }
            },
            "rights": {
              "title": "Sus Derechos de Privacidad",
              "description": "Debido a que no recopilamos ni almacenamos datos personales, automáticamente tiene las siguientes protecciones:",
              "list": {
                "noDataStored": "No hay datos para acceder, modificar o eliminar - nunca los almacenamos en primer lugar",
                "sessionControl": "Control total sobre los datos de sesión - simplemente cierre su navegador para finalizar todo el seguimiento",
                "noTracking": "Sin seguimiento entre sitios, cookies o identificadores persistentes"
              }
            },
            "changes": {
              "title": "Cambios a Esta Política",
              "description": "Podemos actualizar esta política de privacidad de vez en cuando. La fecha de la última actualización se muestra en la parte superior de esta página. El uso continuado de nuestra plataforma después de los cambios constituye la aceptación de la política actualizada."
            },
            "contact": {
              "title": "¿Preguntas sobre privacidad?",
              "description": "Si tiene preguntas sobre cómo protegemos su privacidad, comuníquese a través de nuestro repositorio público de GitHub o canales comunitarios."
            }
          },
          "documentLibrary": {
            "title": "Biblioteca de Documentos del Caso",
            "subtitle": "Comprenda los documentos que puede recibir durante su caso. Cada sección se explica en lenguaje sencillo.",
            "importance": {
              "critical": "Crítico",
              "important": "Importante",
              "informational": "Informativo"
            },
            "card": {
              "purpose": "Propósito",
              "whatToDo": "Qué Hacer Con Este Documento",
              "sections": "Secciones del Documento"
            },
            "filter": {
              "label": "Filtrar por:",
              "phase": "Fase del Caso",
              "category": "Categoría",
              "allPhases": "Todas las Fases",
              "allCategories": "Todas las Categorías",
              "criminal": "Justicia Penal",
              "immigration": "Inmigración",
              "showing": "{{count}} documentos"
            },
            "tabs": {
              "criminal": "Justicia Penal",
              "immigration": "Inmigración"
            },
            "noDocuments": "Ningún documento coincide con sus filtros.",
            "cta": {
              "title": "¿Necesita Orientación Personalizada?",
              "description": "Nuestro asistente de IA puede ayudarle a entender qué documentos debería tener para su situación específica.",
              "button": "Obtener Orientación"
            }
          },
          "documents": {
            "citationTicket": {
              "title": "Citación / Multa",
              "description": "Un aviso escrito dado por delitos menores en lugar de un arresto físico.",
              "purpose": "Este documento le notifica oficialmente los cargos en su contra y le dice cuándo y dónde debe comparecer ante el tribunal. Sirve como su citación judicial.",
              "whatToDo": "¡Guarde este documento! Anote la fecha de la corte y el número de caso. No presentarse en la fecha indicada puede resultar en una orden de arresto.",
              "sections": {
                "charges": { "label": "Delito/Cargos Listados", "explanation": "Esta sección muestra de qué se le acusa. Hace referencia a leyes o códigos específicos que supuestamente violó." },
                "courtDate": { "label": "Fecha de Comparecencia", "explanation": "Esta es la fecha y hora en que DEBE presentarse en la corte. Faltar a esta fecha puede resultar en cargos adicionales y una orden de arresto." },
                "caseNumber": { "label": "Número de Caso/Citación", "explanation": "Un identificador único para su caso. Necesitará este número para buscar su caso en línea o al llamar a la corte." },
                "bailAmount": { "label": "Monto de Fianza", "explanation": "La cantidad de dinero que puede necesitar pagar para ser liberado o evitar la cárcel. No todas las citaciones incluyen esto." }
              }
            },
            "arrestWarrant": {
              "title": "Orden de Arresto",
              "description": "Una orden judicial que autoriza a la policía a arrestarlo.",
              "purpose": "Este documento, firmado por un juez, da a la policía autoridad legal para arrestarlo. Significa que un juez encontró suficiente evidencia (causa probable) para creer que cometió un delito.",
              "whatToDo": "Si le muestran una orden, no resista. Pida una copia y anote el nombre del juez y los cargos listados. Contacte a un abogado inmediatamente.",
              "sections": {
                "probableCause": { "label": "Declaración de Causa Probable", "explanation": "Esto explica por qué el juez cree que pudo haber cometido un delito. Resume la evidencia o acusaciones en su contra." },
                "judgeSignature": { "label": "Firma del Juez", "explanation": "Una orden de arresto válida debe estar firmada por un juez o magistrado. Sin esta firma, la orden puede no ser válida." },
                "chargesListed": { "label": "Cargos Listados", "explanation": "Los delitos específicos de los que se le acusa. Esto determina qué tan serio es su caso y qué penalidades podría enfrentar." }
              }
            },
            "propertyVoucher": {
              "title": "Comprobante de Propiedad",
              "description": "Un recibo que lista todos los artículos personales tomados durante el arresto.",
              "purpose": "Esta es su prueba de qué pertenencias tomó la policía cuando fue arrestado. Necesitará esto para recuperar su propiedad después de que se resuelva su caso.",
              "whatToDo": "¡Guarde este documento! Verifique que todos los artículos estén listados correctamente. Necesitará el número del comprobante para reclamar su propiedad. Reporte cualquier artículo faltante inmediatamente.",
              "sections": {
                "itemsList": { "label": "Artículos Listados", "explanation": "Una lista detallada de todo lo que le quitaron - cartera, teléfono, joyas, cantidades de dinero, etc. Verifique que sea preciso antes de firmar." },
                "voucherNumber": { "label": "Número de Comprobante", "explanation": "El número único que necesitará para recuperar su propiedad. Anótelo por separado en caso de que pierda el papel." },
                "officerInfo": { "label": "Información del Oficial", "explanation": "El nombre y número de placa del oficial que tomó su propiedad. Esto ayuda si hay disputas sobre sus pertenencias." }
              }
            },
            "bookingPapers": {
              "title": "Papeles de Registro",
              "description": "Documentos creados cuando es procesado en la cárcel.",
              "purpose": "Estos papeles registran su información de arresto, los cargos en su contra y su información personal. Se convierten en parte de su registro de arresto.",
              "whatToDo": "Revise la precisión. Errores en los papeles de registro pueden causar problemas después. Anote su número de registro - la familia puede usarlo para localizarlo o pagar la fianza.",
              "sections": {
                "personalInfo": { "label": "Información Personal", "explanation": "Su nombre, dirección, fecha de nacimiento y descripción física. Asegúrese de que sea preciso para evitar problemas de identidad." },
                "arrestDetails": { "label": "Detalles del Arresto", "explanation": "Cuándo, dónde y por qué fue arrestado. Esta información será importante para su defensa." },
                "bookingNumber": { "label": "Número de Registro", "explanation": "Un identificador único para su estadía en la cárcel. Los familiares pueden usarlo para encontrarlo en el sistema de la cárcel o arreglar la fianza." }
              }
            },
            "mirandaAcknowledgment": {
              "title": "Reconocimiento de Derechos Miranda",
              "description": "Un formulario que documenta que fue informado de sus derechos.",
              "purpose": "Esto documenta que la policía le informó sobre su derecho a permanecer en silencio y su derecho a un abogado antes de interrogarlo.",
              "whatToDo": "No tiene que firmar esto. Si lo hace, no significa que esté renunciando a sus derechos - aún puede permanecer en silencio y pedir un abogado en cualquier momento.",
              "sections": {
                "rightsListed": { "label": "Derechos Listados", "explanation": "Sus derechos Miranda: derecho a permanecer en silencio, todo lo que diga puede usarse en su contra, derecho a un abogado, derecho a un abogado gratuito si no puede pagarlo." },
                "waiverSection": { "label": "Sección de Renuncia", "explanation": "Esto pregunta si renuncia voluntariamente a estos derechos. NO tiene que firmar esto. Incluso si lo hace, puede invocar sus derechos en cualquier momento durante el interrogatorio." }
              }
            },
            "criminalComplaint": {
              "title": "Denuncia Penal",
              "description": "El documento formal que oficialmente lo acusa de un delito.",
              "purpose": "Esta es la declaración oficial del fiscal de qué delitos se le acusa y los hechos básicos que afirman prueban su culpabilidad. Inicia su caso penal.",
              "whatToDo": "Lea esto cuidadosamente con su abogado. Le dice exactamente de qué se le acusa. Su estrategia de defensa se construirá en respuesta a estas acusaciones.",
              "sections": {
                "charges": { "label": "Cargos Penales", "explanation": "Los delitos específicos de los que se le acusa, incluyendo el grado (delito menor vs. delito grave). Cada cargo tiene diferentes penalidades potenciales." },
                "factsAlleged": { "label": "Declaración de Hechos", "explanation": "La versión del fiscal de lo que pasó. Esto es lo que intentarán probar en el juicio. Su abogado buscará debilidades en esta historia." },
                "statuteCitations": { "label": "Citas de Estatutos", "explanation": "Las leyes específicas que supuestamente violó. Estas secciones de código definen lo que el fiscal debe probar para condenarlo." }
              }
            },
            "arraignmentNotice": {
              "title": "Aviso de Lectura de Cargos",
              "description": "Aviso de su primera comparecencia ante la corte después del arresto.",
              "purpose": "Esto le dice cuándo y dónde debe presentarse para su lectura de cargos - la audiencia donde se le informará formalmente los cargos y se le pedirá declarar.",
              "whatToDo": "¡No falte a esta fecha! Llegue temprano. Si no tiene abogado, dígale al juez que quiere un defensor público. Típicamente declarará 'no culpable' en esta etapa.",
              "sections": {
                "courtLocation": { "label": "Ubicación de la Corte", "explanation": "El juzgado específico, número de sala y dirección donde debe presentarse. Llegue temprano para pasar seguridad y encontrar la sala correcta." },
                "dateTime": { "label": "Fecha y Hora", "explanation": "Exactamente cuándo debe presentarse. Faltar a esta fecha probablemente resultará en una orden de arresto." },
                "caseNumber": { "label": "Número de Caso", "explanation": "Su identificador único de caso. Use esto para registrarse con el secretario de la corte cuando llegue." }
              }
            },
            "bailBondOrder": {
              "title": "Orden de Fianza",
              "description": "La decisión de la corte sobre la fianza y condiciones para su liberación.",
              "purpose": "Este documento explica cuánta fianza debe, cualquier condición que debe seguir mientras esté liberado, y las consecuencias de violar esas condiciones.",
              "whatToDo": "Siga TODAS las condiciones estrictamente. Las violaciones pueden resultar en re-arresto y revocación de la fianza. Guarde este documento - lista su próxima fecha de corte.",
              "sections": {
                "bailAmount": { "label": "Monto de Fianza", "explanation": "El dinero requerido para su liberación. Puede pagar el monto completo (reembolsado después del caso) o usar un fiador (típicamente 10% no reembolsable)." },
                "conditions": { "label": "Condiciones de Liberación", "explanation": "Reglas que debe seguir mientras esté en libertad bajo fianza - como no contactar a ciertas personas, no salir del estado, o pruebas de drogas. Romper estas puede enviarlo de vuelta a la cárcel." },
                "nextCourtDate": { "label": "Próxima Fecha de Corte", "explanation": "Su próxima comparecencia requerida. Faltar a esta fecha confisca su dinero de fianza y resulta en una orden de arresto." }
              }
            },
            "discoveryDocuments": {
              "title": "Documentos de Descubrimiento",
              "description": "Evidencia que el fiscal debe compartir con su defensa.",
              "purpose": "Estos son todos los materiales que el fiscal planea usar en su contra en el juicio. Su abogado tiene derecho a ver esta evidencia para preparar su defensa.",
              "whatToDo": "Revise estos cuidadosamente con su abogado. El descubrimiento puede revelar debilidades en el caso del fiscal o evidencia que apoya su inocencia.",
              "sections": {
                "policeReports": { "label": "Informes Policiales", "explanation": "Relatos escritos de los oficiales de lo que pasó. Estos a menudo contienen detalles que pueden ser cuestionados o contradichos por otra evidencia." },
                "witnessStatements": { "label": "Declaraciones de Testigos", "explanation": "Lo que los testigos le dijeron a la policía. Su abogado analizará estos para inconsistencias y preparará el contrainterrogatorio." },
                "evidenceList": { "label": "Lista de Evidencia", "explanation": "Evidencia física, videos, fotos, resultados de laboratorio, etc. Su abogado puede cuestionar cómo se recolectó o interpretó esta evidencia." }
              }
            },
            "pleaOffer": {
              "title": "Oferta de Acuerdo",
              "description": "Una oferta escrita del fiscal para resolver su caso sin juicio.",
              "purpose": "Esto propone un trato: declararse culpable de ciertos cargos a cambio de penalidades reducidas o cargos retirados. Aproximadamente el 90% de los casos se resuelven mediante acuerdos.",
              "whatToDo": "Discuta esto cuidadosamente con su abogado antes de responder. Considere la fuerza de la evidencia, resultados potenciales del juicio y circunstancias personales. No tiene que aceptar.",
              "sections": {
                "offeredCharges": { "label": "Cargos a los que se Declararía", "explanation": "Los cargos específicos a los que admitiría culpabilidad. Estos pueden ser menos serios que sus cargos originales." },
                "recommendedSentence": { "label": "Sentencia Recomendada", "explanation": "Qué castigo recomienda el fiscal. Nota: El juez no tiene que seguir esta recomendación." },
                "deadline": { "label": "Fecha Límite de la Oferta", "explanation": "Cuánto tiempo tiene para aceptar este trato. Después de la fecha límite, la oferta puede ser retirada o volverse menos favorable." }
              }
            },
            "subpoena": {
              "title": "Citación Judicial",
              "description": "Una orden judicial que le requiere comparecer ante la corte o proporcionar documentos.",
              "purpose": "Esto lo obliga legalmente a testificar como testigo o producir documentos/registros. Ignorar una citación puede resultar en cargos por desacato.",
              "whatToDo": "¡Tome esto en serio! Contacte a un abogado si tiene preocupaciones sobre testificar. Debe presentarse en la fecha listada a menos que un juez lo excuse.",
              "sections": {
                "appearanceRequired": { "label": "Detalles de Comparecencia", "explanation": "Cuándo y dónde debe presentarse. Esto no es opcional - no presentarse puede resultar en arresto." },
                "documentsRequested": { "label": "Documentos Solicitados", "explanation": "Registros o artículos específicos que debe traer. Una 'citación duces tecum' requiere que produzca documentos." }
              }
            },
            "sentencingOrder": {
              "title": "Orden de Sentencia / Fallo",
              "description": "El documento oficial que establece su sentencia después de la condena.",
              "purpose": "Esta es la decisión final de la corte sobre su castigo - tiempo en cárcel, multas, libertad condicional, servicio comunitario, etc. Se convierte en parte de su registro permanente.",
              "whatToDo": "Revise la precisión. Entienda todas las condiciones que debe seguir. Conozca su fecha límite de apelación (usualmente 30 días). Guarde este documento para sus registros.",
              "sections": {
                "sentenceImposed": { "label": "Sentencia Impuesta", "explanation": "Su castigo específico - tiempo en cárcel/prisión, si está suspendido, y cómo se cumplirá (tiempo directo vs. libertad laboral, etc.)." },
                "finesRestitution": { "label": "Multas y Restitución", "explanation": "Dinero que debe - cuotas de la corte, multas y pagos a víctimas. Estas son deudas legalmente exigibles." },
                "probationTerms": { "label": "Términos de Libertad Condicional", "explanation": "Reglas que debe seguir durante la libertad condicional - reportarse a un oficial, pruebas de drogas, restricciones de viaje, etc. Las violaciones pueden significar tiempo en cárcel." },
                "appealRights": { "label": "Derechos de Apelación", "explanation": "Información sobre su derecho a apelar la condena o sentencia. Típicamente tiene 30 días para presentar una apelación." }
              }
            },
            "noticeToAppearI862": {
              "title": "Notificación de Comparecencia (NTA)",
              "description": "El documento principal de cargos que inicia los procedimientos de deportación.",
              "purpose": "Este es el aviso formal de ICE de que quieren deportarlo. Le ordena comparecer ante un juez de inmigración y lista las razones por las que afirman que puede ser removido de EE.UU.",
              "whatToDo": "Consiga un abogado de inmigración INMEDIATAMENTE. Anote su número A y fecha de audiencia. Consulte la lista de servicios legales gratuitos proporcionada. Nunca falte a su audiencia - resulta en orden de deportación automática.",
              "sections": {
                "aNumber": { "label": "Número de Registro de Extranjero (Número A)", "explanation": "Su identificador único de 9 dígitos en el sistema de inmigración. Necesita esto para verificar el estado de su caso en línea o por teléfono." },
                "charges": { "label": "Cargos de Inmigración", "explanation": "Las razones legales por las que ICE afirma que puede ser deportado - visa vencida, entrada sin inspección, condena penal, etc." },
                "hearingInfo": { "label": "Información de la Audiencia", "explanation": "Fecha, hora y ubicación de su audiencia en la corte de inmigración. A veces dice 'Por Determinar' y recibirá un aviso separado después." },
                "legalServices": { "label": "Lista de Servicios Legales Gratuitos", "explanation": "Información de contacto para abogados de inmigración gratuitos o de bajo costo en su área. Llame inmediatamente." }
              }
            },
            "recordDeportableAlienI213": {
              "title": "Registro de Extranjero Deportable/Inadmisible",
              "description": "El registro de ICE de su arresto y las razones de la detención.",
              "purpose": "Esto documenta cómo y por qué fue arrestado por oficiales de inmigración, incluyendo cualquier declaración que haya hecho. A menudo se usa como evidencia en su contra.",
              "whatToDo": "Revise esto cuidadosamente con un abogado. Verifique errores en los hechos. Cualquier declaración que haya hecho puede ser cuestionada si no fue informado apropiadamente de sus derechos.",
              "sections": {
                "arrestCircumstances": { "label": "Circunstancias del Arresto", "explanation": "Cómo, cuándo y dónde ICE lo arrestó. Esto puede incluir si tenían una orden apropiada." },
                "statementsRecorded": { "label": "Declaraciones Registradas", "explanation": "Lo que ICE dice que les dijo durante el arresto. Estas declaraciones pueden usarse en su contra, así que verifique su precisión con su abogado." }
              }
            },
            "bondHearingNotice": {
              "title": "Aviso de Audiencia de Fianza",
              "description": "Aviso de su audiencia para solicitar liberación de la detención de inmigración.",
              "purpose": "Esto le dice cuándo puede pedirle a un juez de inmigración que fije una fianza para que pueda ser liberado de la detención mientras su caso procede.",
              "whatToDo": "Prepare evidencia de que no es un riesgo de fuga ni un peligro - vínculos comunitarios, empleo, familia en EE.UU., etc. Un abogado puede mejorar significativamente sus posibilidades.",
              "sections": {
                "hearingDate": { "label": "Fecha de Audiencia", "explanation": "Cuándo puede presentar su caso para liberación. Faltar a esto significa que permanece detenido hasta su audiencia de remoción." },
                "eligibilityInfo": { "label": "Información de Elegibilidad", "explanation": "Algunas personas no son elegibles para fianza debido a historial criminal u otros factores. Un abogado puede explicar su situación específica." }
              }
            },
            "warrantOfRemovalI205": {
              "title": "Orden de Remoción/Deportación",
              "description": "La orden que autoriza a ICE a deportarlo físicamente.",
              "purpose": "Esto significa que un juez de inmigración ha ordenado su remoción e ICE ahora puede ejecutar la deportación. Esto se emite después de que haya perdido su caso o renunciado al derecho de combatirlo.",
              "whatToDo": "Contacte a un abogado inmediatamente sobre opciones de apelación. Puede tener tiempo limitado (30 días para apelación al BIA). Verifique si califica para algún alivio o protección.",
              "sections": {
                "removalOrder": { "label": "Orden de Remoción", "explanation": "La orden oficial de que debe salir de Estados Unidos. Incluye la base legal para su remoción." },
                "appealDeadline": { "label": "Fecha Límite de Apelación", "explanation": "Cuánto tiempo tiene para impugnar esta orden. Perder esta fecha límite puede eliminar sus opciones para quedarse y luchar." }
              }
            },
            "orderOfSupervisionI220B": {
              "title": "Orden de Supervisión",
              "description": "Condiciones para liberación cuando tiene una orden de remoción pero no puede ser deportado inmediatamente.",
              "purpose": "Si tiene una orden final de deportación pero su país de origen no lo acepta o hay otras barreras, ICE puede liberarlo bajo supervisión con condiciones estrictas.",
              "whatToDo": "Siga TODAS las condiciones estrictamente. Repórtese según lo requerido. Las violaciones pueden resultar en re-detención. Continúe trabajando con un abogado en opciones.",
              "sections": {
                "reportingRequirements": { "label": "Requisitos de Reporte", "explanation": "Con qué frecuencia y dónde debe presentarse con ICE. Faltar a un reporte puede resultar en detención inmediata." },
                "travelRestrictions": { "label": "Restricciones de Viaje", "explanation": "Límites sobre dónde puede viajar. Típicamente no puede salir del área sin permiso y definitivamente no puede salir de EE.UU." }
              }
            },
            "expeditedRemovalI860": {
              "title": "Aviso de Remoción Expedita",
              "description": "Una orden para deportación rápida sin audiencia en la corte.",
              "purpose": "Esto se usa cuando alguien es atrapado en o cerca de la frontera sin documentos de entrada válidos. Permite la deportación sin ver a un juez de inmigración.",
              "whatToDo": "Si teme persecución en su país de origen, DEBE decirle al oficial inmediatamente. Diga 'Tengo miedo de regresar a mi país.' Esto activa una entrevista de miedo creíble.",
              "sections": {
                "removalGrounds": { "label": "Fundamentos para Remoción", "explanation": "Por qué ICE afirma que puede ser removido rápidamente - usualmente entrada sin inspección o con documentos fraudulentos." },
                "fearClaim": { "label": "Miedo de Regresar", "explanation": "Si tiene miedo de regresar a su país (miedo de violencia, persecución, etc.), DEBE expresar este miedo para obtener una audiencia. Esta es su única oportunidad de evitar la remoción inmediata." }
              }
            },
            "guidance": {
              "documentsSection": {
                "title": "Documentos Que Debería Tener",
                "description": "Basado en la etapa de su caso, debería haber recibido estos documentos importantes. Haga clic en cualquier documento para aprender más.",
                "noneFound": "No se esperan documentos específicos en esta etapa.",
                "learnMore": "Aprender Más",
                "viewLibrary": "Ver Todos los Documentos"
              }
            }
          },
          "chat": {
          "openChat": "Abrir chat de orientación legal",
          "progress": {
            "step": "Paso {{current}} de {{total}}",
            "safety": "Seguridad",
            "safetyDesc": "Verificando si necesita ayuda inmediata",
            "location": "Ubicación",
            "locationDesc": "Díganos dónde está su caso",
            "charges": "Cargos",
            "chargesDesc": "Seleccione los cargos que enfrenta",
            "situation": "Situación",
            "situationDesc": "La etapa y estado actual de su caso",
            "details": "Detalles",
            "detailsDesc": "Describa lo que pasó para orientación personalizada"
          },
          "messages": {
            "welcome": "¡Hola! Estoy aquí para ayudarle a entender su situación legal. Todo lo que hablemos es privado y se elimina después de su sesión.\n\n¿Está en una situación urgente ahora mismo?",
            "emergencyAdviceFull": "🚨 **Si está siendo arrestado o detenido ahora mismo:**\n\n**✅ Mantenga la Calma**\nNo resista, corra ni discuta. Mantenga las manos visibles. Resistirse puede resultar en cargos adicionales, incluso si el arresto original luego se considera ilegal.\n\n**🔇 Ejerza su Derecho a Permanecer en Silencio**\nDiga claramente: \"Estoy ejerciendo mi derecho a permanecer en silencio.\"\nNO tiene que responder preguntas sobre adónde va, qué está haciendo o dónde vive.\n\n**⚖️ Solicite un Abogado**\nDiga: \"Quiero un abogado.\" La policía debe dejar de interrogarlo una vez que pida un abogado.\nSi no puede pagar uno, puede solicitar un defensor público en su primera comparecencia ante el tribunal.\n\n**🚫 No Consienta Registros**\nDiga: \"No consiento ningún registro.\"\nLa policía puede registrar de todos modos, pero decir esto protege sus derechos para después.\n\n**📝 Recuerde Estos Detalles**\nAnote los números de placa de los oficiales, números de patrulla y cualquier información de testigos. Esto puede ayudar su caso después.\n\n---\n**¿Qué le gustaría hacer ahora?**",
            "mainMenu": "¿En qué puedo ayudarle?",
            "stateQuestion": "Vamos a darle orientación personalizada. Primero, ¿en qué estado está su caso?",
            "chargeQuestion": "Entendido, {{state}}. ¿Qué cargos enfrenta? Seleccione todos los que apliquen.",
            "stageQuestion": "¿En qué etapa está su caso?",
            "custodyQuestion": "¿Está actualmente bajo custodia o ha sido liberado?",
            "attorneyQuestion": "¿Tiene un abogado o defensor público?",
            "descriptionPrompt": "Gracias por esa información. Ahora, describa brevemente lo que pasó - esto me ayuda a darle orientación más relevante.\n\n(Su información es analizada por IA para proporcionar orientación. Los datos personales se eliminan automáticamente antes del procesamiento. Nada se almacena después de su sesión.)",
            "descriptionPromptWithWarning": "Gracias por esa información.\n\n⚠️ **Antes de Compartir Detalles**\n\nNos gustaría que comparta detalles específicos sobre su caso para recibir orientación personalizada. A diferencia de hablar con un abogado, lo que escriba aquí no es privado y podría usarse en su contra si alguna vez se lo preguntan en la corte.\n\nRecomendamos hablar primero con un abogado. Este paso es opcional—omítalo para recibir orientación general.",
            "privilegeWarning": "⚠️ **Antes de Compartir Detalles**\n\nA diferencia de hablar con un abogado, lo que escriba aquí no es privado y podría usarse en su contra si alguna vez se lo preguntan en la corte.\n\nRecomendamos hablar primero con un abogado. Este paso es opcional—omítalo para recibir orientación general.",
            "privilegeAcknowledged": "Entendido. Adelante, describa lo que pasó—tómese su tiempo.",
            "concernsQuestion": "¿Qué es lo que más le preocupa? ¿Alguna pregunta específica?\n\n(Por ejemplo: perder su trabajo, pagar un abogado, cuándo tiene que ir a la corte)",
            "generating": "Gracias. Ahora estoy revisando su situación y preparando su orientación personalizada. Esto puede tomar un momento...",
            "stillWorking": "Todavía trabajando en su orientación... Las situaciones legales complejas requieren un análisis cuidadoso. Gracias por su paciencia.",
            "guidanceReady": "¡Su orientación legal está lista! He preparado un resumen de su situación, plazos importantes, sus derechos y próximos pasos recomendados.\n\nPuede exportar esto para guardarlo en sus registros.",
            "error": "Lo siento, encontré un problema al generar su orientación. Por favor intente de nuevo o contacte soporte si el problema continúa.",
            "immigrationSummary": "**Información sobre Aplicación de Inmigración**\n\nSi le preocupa la aplicación de inmigración, esto es lo que debe saber:\n\n**Sus Derechos:**\n• Tiene derecho a permanecer en silencio sobre su estatus migratorio\n• No tiene que abrir su puerta a oficiales de inmigración sin una orden judicial\n• Tiene derecho a hablar con un abogado antes de responder preguntas\n\n**Si es Abordado por ICE:**\n• Mantenga la calma y no corra\n• Pregunte si es libre de irse\n• No firme ningún documento sin hablar con un abogado\n• Recuerde detalles sobre el encuentro\n\nPara orientación completa sobre inmigración, visite nuestra página de [Guía de Inmigración](/immigration-guidance).\n\n**¿En qué más puedo ayudarle?**",
            "immigrationMenu": "¿Cómo podemos ayudarle con inmigración?",
            "immigrationSituation": "Puedo ayudarle con preguntas relacionadas con inmigración. **¿Qué describe mejor su situación?**",
            "immigrationUrgent": {
              "reminder": "🚨 **Recordatorio Inmediato de Derechos:**\n\n• **Mantenga la calma** - No corra ni resista\n• **Tiene derecho a permanecer en silencio** - No tiene que responder preguntas sobre su estatus\n• **Pregunte si es libre de irse** - Si sí, aléjese calmadamente\n• **No firme nada** sin entenderlo completamente\n• **Solicite un abogado** antes de responder preguntas\n\n**¿Dónde está ocurriendo esto?**",
              "atHome": "🏠 **Sus Derechos en Casa:**\n\n• **No abra la puerta** a menos que le muestren una orden judicial (firmada por un juez)\n• Una orden administrativa de ICE (Formulario I-200) NO les da derecho a entrar\n• Diga: \"No consiento que entren a mi casa\"\n• Si entran a la fuerza, no resista pero declare que no consiente\n• Reúna nombres y números de placa si es posible\n\n📞 **Contactos de Emergencia:**\n• Foro Nacional de Inmigración: 1-800-954-6287\n• ACLU: Envíe \"IMMIGRANT\" al 88823\n\n**Conecte con un abogado de inmigración inmediatamente:**",
              "atWork": "💼 **Sus Derechos en el Trabajo:**\n\n• Tiene derecho a permanecer en silencio\n• Pida ver una orden - léala cuidadosamente\n• No corra, mienta ni use documentos falsos\n• Puede negarse a responder preguntas sobre su estatus\n• Recuerde: Puede tener un abogado presente\n\n📋 Su empleador NO PUEDE tomar represalias contra usted por ejercer sus derechos.\n\n**Aprenda más sobre redadas en el trabajo y responsabilidades del empleador:**",
              "inPublic": "🚶 **Sus Derechos en Público/en Puntos de Control:**\n\n• Mantenga la calma y no corra\n• En un punto de control, pueden preguntarle sobre ciudadanía\n• Puede permanecer en silencio sobre su estatus migratorio\n• No lleve documentos falsos\n• Si es detenido, pida un abogado inmediatamente\n\n📞 **Contactos de Emergencia:**\n• Foro Nacional de Inmigración: 1-800-954-6287\n• DOJ Revisión de Inmigración: 1-800-898-7180\n\n**Conecte con un abogado de inmigración:**"
            },
            "immigrationPlanning": {
              "question": "**¿Para quién está planeando?**\n\nTenemos recursos para ayudarle a prepararse:",
              "myself": "Para planificación personal, considere:\n\n• **Conozca sus derechos** antes de cualquier encuentro\n• **Prepare una tarjeta de contacto de emergencia** con información de abogado\n• **Mantenga documentos importantes** en un lugar seguro y accesible\n• **Cree un plan de comunicación familiar**\n\nSi tiene DACA, TPS u otro estatus protegido, manténgase informado sobre renovaciones y fechas límite:",
              "family": "**Recursos de Planificación Familiar:**\n\nPreparando a su familia para posible aplicación de inmigración:\n\n• Designe una persona de confianza para decisiones de cuidado de niños\n• Prepare documentos de poder notarial\n• Mantenga copias de documentos importantes accesibles\n• Cree un plan de emergencia familiar\n• Conozca los derechos de sus hijos en la escuela\n\nAcceda a nuestra guía completa de planificación familiar:",
              "workplace": "**Preparación del Lugar de Trabajo:**\n\nPrepare su lugar de trabajo para posible aplicación de ICE:\n\n• Conozca la diferencia entre órdenes judiciales y administrativas\n• Entienda los derechos del empleador y empleado\n• Cree un plan de respuesta en el trabajo\n• Sepa dónde obtener ayuda legal\n\nAcceda a nuestra guía de redadas en el trabajo:"
            },
            "immigrationDetained": {
              "question": "**¿Cuál es la situación actual de detención?**",
              "iceDetention": "**Si está en Detención de ICE:**\n\n📞 **Sus Derechos en Detención:**\n• Derecho a hacer llamadas telefónicas a familia y abogado\n• Derecho a contactar su consulado\n• Derecho a solicitar audiencia de fianza (en la mayoría de casos)\n• Derecho a un intérprete\n\n💰 **Información de Fianza:**\n• Las cantidades de fianza típicamente van de $1,500 a $25,000+\n• Ciertas condenas penales pueden hacerlo inelegible para fianza\n• Un juez considerará vínculos con la comunidad, riesgo de fuga y peligro\n\n**Aprenda sobre audiencias de fianza y cómo prepararse:**",
              "countyJail": "**Si está en Cárcel del Condado con Retención de Inmigración:**\n\n📋 **Lo Que Esto Significa:**\n• ICE ha solicitado que la cárcel lo retenga hasta 48 horas después de su caso penal\n• La retención es una SOLICITUD, no una orden (en muchos estados)\n• Algunas cárceles se niegan a cumplir con estos retenedores\n\n⚖️ **Sus Derechos:**\n• Todavía puede solicitar fianza en su caso penal\n• Pregunte a su abogado defensor penal sobre consecuencias migratorias\n• Tiene derecho a hablar con un abogado de inmigración\n\n**Aprenda sobre audiencias de fianza:**",
              "portOfEntry": "**En un Puerto de Entrada (Aeropuerto/Frontera):**\n\n🛂 **Información Clave:**\n• Diferentes reglas aplican en puertos de entrada\n• CBP tiene mayor autoridad en fronteras\n• Aún puede solicitar hablar con un abogado\n• No firme nada sin entenderlo\n\n📞 **Si es Ciudadano de EE.UU./Residente Permanente:**\nNo se le puede negar la entrada, pero pueden ocurrir retrasos.\n\n**Conecte con un abogado de inmigración inmediatamente:**",
              "result": "**Importante:** La ley de inmigración es compleja. Un abogado de inmigración con experiencia puede hacer una diferencia significativa en su caso.\n\n📍 **Encuentre abogados de inmigración verificados:**"
            },
            "rightsMenu": "¿Sobre qué tema de derechos le gustaría aprender?",
            "rightsInfo": "**Sus Derechos Constitucionales Clave:**\n\n🛡️ **Derecho a Permanecer en Silencio** (5ta Enmienda)\nNo puede ser obligado a testificar contra sí mismo. Todo lo que diga puede usarse en su contra en la corte.\n\n⚖️ **Derecho a un Abogado** (6ta Enmienda)\nTiene derecho a un abogado. Si no puede pagar uno, la corte le asignará un defensor público.\n\n📞 **Derecho a una Llamada Telefónica**\nLa mayoría de los estados permiten al menos una llamada después del registro para contactar a la familia o un abogado.\n\n📜 **Derecho a Conocer los Cargos**\nDebe ser informado de qué crímenes se le acusa.\n\n---\nPara información más detallada, visite nuestra página [Conozca sus Derechos](/rights-info).\n\n**¿Qué le gustaría hacer ahora?**",
            "processInfo": "**El Proceso de Justicia Penal:**\n\n**1. Arresto y Registro** (0-48 horas)\nEs llevado a custodia, le toman huellas y fotografías. Puede ser retenido hasta la lectura de cargos.\n\n**2. Lectura de Cargos** (24-72 horas después del arresto)\nPrimera comparecencia ante el tribunal donde se leen los cargos, usted declara y se fija la fianza.\n\n**3. Pre-Juicio** (Semanas a meses)\nDescubrimiento de evidencia, negociaciones de acuerdo y se presentan mociones.\n\n**4. Juicio** (Si no hay acuerdo)\nSe presenta evidencia ante un juez o jurado que decide la culpabilidad.\n\n**5. Sentencia** (Si es condenado)\nEl juez determina el castigo basándose en guías y circunstancias.\n\n**6. Apelación** (Opcional)\nPuede impugnar el veredicto o sentencia a través de tribunales superiores.\n\n---\nPara una guía completa, visite nuestra página [Proceso de Justicia Penal](/process).\n\n**¿Qué le gustaría hacer ahora?**",
            "resourcesCategoryMenu": "¿Qué tipo de recurso está buscando?",
            "resourcesMenu": "¿Qué tipo de recurso está buscando?",
            "lawsMenu": "¿Qué le gustaría buscar?",
            "enterZipPD": "Por favor ingrese su código postal para encontrar oficinas de Defensor Público cerca de usted:",
            "enterZipLegalAid": "Por favor ingrese su código postal para encontrar organizaciones de Asistencia Legal cerca de usted:",
            "invalidZip": "Por favor ingrese un código postal válido de 5 dígitos.",
            "noPDFound": "No encontré oficinas de Defensor Público cerca de {{zip}}. Intente con un código postal diferente o visite nuestra [página de Recursos](/diversion-programs) para más opciones.\n\n**¿En qué más puedo ayudarle?**",
            "noLegalAidFound": "No encontré organizaciones de Asistencia Legal cerca de {{zip}}. Intente con un código postal diferente o visite nuestra [página de Recursos](/diversion-programs) para más opciones.\n\n**¿En qué más puedo ayudarle?**",
            "pdResults": "Aquí están las oficinas de Defensor Público cerca de {{zip}}:\n\n{{results}}\n\n**¿En qué más puedo ayudarle?**",
            "legalAidResults": "Aquí están las organizaciones de Asistencia Legal cerca de {{zip}}:\n\n{{results}}\n\n**¿En qué más puedo ayudarle?**",
            "searchError": "Tuve problemas al buscar. Puede intentar de nuevo o explorar otras opciones.",
            "whatElse": "¿En qué más puedo ayudarle?",
            "exportedWhatElse": "Su PDF ha sido descargado.\n\n**¿En qué más puedo ayudarle?**",
            "followUpResponse": "Esa es una gran pregunta. Basándome en lo que me ha dicho, esto es lo que sugeriría...",
            "whatToDoNow": "**¿Qué le gustaría hacer ahora?**",
            "verifiedAgainst": "✓ Verificado con los estatutos penales de {{state}}",
            "verifiedGeneric": "✓ Verificado con los estatutos penales oficiales",
            "askFollowUpPrompt": "Ahora puede escribir cualquier pregunta adicional abajo."
          },
          "replies": {
            "urgentYes": "Sí, necesito ayuda ahora mismo",
            "urgentNo": "No, tengo tiempo para hablar",
            "getHelp": "Ayuda con Mi Caso",
            "knowRights": "Conocer Mis Derechos",
            "findResources": "Encontrar Recursos",
            "legalAidResources": "Recursos y Apoyo de Asistencia Legal",
            "personalizedGuidance": "Orientación Personalizada",
            "immigrationEnforcement": "Aplicación de Inmigración",
            "rightsInfo": "Info de Derechos",
            "resources": "Recursos",
            "lawsRecords": "Leyes y Documentos",
            "attorneyTools": "Herramientas para Abogados",
            "myRights": "Mis Derechos",
            "criminalJusticeProcess": "Proceso de Justicia Penal",
            "constitutionalRights": "Derechos Constitucionales",
            "justiceProcess": "Proceso Judicial",
            "searchSeizure": "Registro e Incautación",
            "helpingFamily": "Ayudar a la Familia",
            "legalGlossary": "Glosario Legal",
            "findPublicDefender": "Encontrar Defensor Público",
            "legalAidOrgs": "Orgs de Asistencia Legal",
            "diversionPrograms": "Programas de Desviación",
            "recordExpungement": "Eliminación de Antecedentes",
            "documentSummarizer": "Resumidor de Documentos",
            "courtRecords": "Búsqueda de Registros Judiciales",
            "statutesSearch": "Búsqueda de Estatutos",
            "documentLibrary": "Biblioteca de Documentos",
            "stageArrest": "Recién arrestado / bajo investigación",
            "stageArraignment": "Lectura de cargos próxima",
            "stagePretrial": "Procedimientos pre-juicio",
            "stageTrial": "Juicio programado/en curso",
            "stageSentencing": "Fase de sentencia",
            "stageUnsure": "No estoy seguro",
            "inCustody": "Sí, bajo custodia",
            "onBail": "Libre bajo fianza",
            "ownRecognizance": "Liberado bajo palabra",
            "notInCustody": "No bajo custodia",
            "hasAttorney": "Sí, tengo representación",
            "noAttorney": "No, necesito encontrar uno",
            "privilegeContinue": "Entiendo, Continuar",
            "privilegeSkip": "Omitir y Obtener Orientación General",
            "viewGuidance": "Ver Mi Orientación",
            "exportPdf": "Exportar como PDF",
            "saveGuidance": "Guardar Esta Orientación",
            "findPublicDefenderAction": "Encontrar un Defensor Público",
            "findLegalAidAction": "Encontrar Asistencia Legal Cerca",
            "askFollowUp": "Hacer una Pregunta Adicional",
            "moreOptions": "Explorar Otros Temas",
            "retry": "Intentar de Nuevo",
            "tryAgain": "Probar Otro Código Postal",
            "immUrgent": "Encuentro activo ahora mismo",
            "immPlanning": "Planificando/preparándome",
            "immDetained": "Ya detenido/en procedimientos",
            "immGeneralInfo": "Solo quiero información general",
            "immAtHome": "En casa",
            "immAtWork": "En el trabajo",
            "immInPublic": "En público / punto de control",
            "immMyself": "Para mí",
            "immFamily": "Mi familia",
            "immWorkplace": "Mi lugar de trabajo",
            "immIceDetention": "En detención de ICE",
            "immCountyJail": "En cárcel del condado con retención de inmigración",
            "immPortOfEntry": "En un puerto de entrada",
            "immFindAttorney": "Encontrar Abogado de Inmigración",
            "immDacaTps": "Información de DACA/TPS",
            "immFamilyPlanning": "Guía de Planificación Familiar",
            "immWorkplaceRaids": "Guía de Redadas en el Trabajo",
            "immBondHearings": "Info de Audiencias de Fianza",
            "immBackToHub": "Volver al Centro de Inmigración",
            "immGeneralHub": "Información General",
            "immSituationalGuides": "Guías Situacionales",
            "immKnowYourRights": "Conozca Sus Derechos",
            "immFindDetained": "Encontrar a una Persona Detenida",
            "immFindLawyer": "Encontrar un Abogado"
          },
          "header": {
            "title": "Chat de Orientación Legal",
            "subtitle": "Privado y seguro"
          },
          "input": {
            "placeholder": "Haga una pregunta adicional...",
            "selectOption": "Seleccione una opción arriba para continuar",
            "answering": "Complete el paso actual para continuar",
            "descriptionPlaceholder": "Describa lo que pasó...",
            "concernsPlaceholder": "¿Qué es lo que más le preocupa de su situación?",
            "zipPlaceholder": "Ingrese su código postal de 5 dígitos..."
          },
          "voice": {
            "listening": "Escuchando...",
            "startListening": "Iniciar entrada de voz",
            "stopListening": "Detener escucha",
            "recordingHint": "Hable ahora... Toque el micrófono de nuevo cuando termine.",
            "notSupported": "Entrada de voz no compatible",
            "notSupportedDesc": "Su navegador no admite entrada de voz. Use un navegador moderno como Chrome, Edge o Safari.",
            "permissionDenied": "Acceso al micrófono denegado",
            "permissionDeniedDesc": "Permita el acceso al micrófono en la configuración de su navegador para usar la entrada de voz.",
            "networkError": "Entrada de voz no disponible",
            "networkErrorDesc": "El reconocimiento de voz requiere conexión a internet. Por favor escriba su mensaje.",
            "error": "Error de entrada de voz",
            "errorDesc": "Hubo un error con la entrada de voz. Intente de nuevo."
          },
          "footer": {
            "privacy": "Su información es privada y se elimina después de su sesión"
          },
          "exitWarning": {
            "title": "Tiene orientación que no ha sido exportada",
            "description": "Su orientación se perderá si sale sin exportar."
          },
          "export": {
            "noData": "No hay orientación para exportar",
            "success": "PDF descargado exitosamente",
            "error": "Error al exportar PDF"
          },
          "stateSelector": {
            "placeholder": "Buscar su estado...",
            "noResults": "No se encontraron estados"
          },
          "chargeSelector": {
            "title": "Seleccionar Cargos",
            "selected": "seleccionado(s)",
            "available": "disponibles",
            "searchPlaceholder": "Buscar todos los cargos...",
            "loading": "Cargando cargos...",
            "noResults": "No se encontraron cargos que coincidan con su búsqueda",
            "noCharges": "No hay cargos disponibles",
            "selectAtLeast": "Seleccione al menos un cargo",
            "continue": "Continuar con {{count}} cargo(s)",
            "categories": {
              "all": "Todos",
              "felony": "Delito Grave",
              "misdemeanor": "Delito Menor",
              "infraction": "Infracción"
            }
          },
          "casePanel": {
            "title": "Información de su Caso",
            "state": "Estado",
            "charges": "Cargos",
            "stage": "Etapa",
            "custody": "Custodia",
            "attorney": "Abogado",
            "hasAttorney": "Sí",
            "noAttorney": "No",
            "urgentSituation": "Situación Urgente",
            "stages": {
              "arrest": "Investigación/Arresto",
              "arraignment": "Lectura de Cargos",
              "pretrial": "Pre-juicio",
              "trial": "Juicio",
              "sentencing": "Sentencia",
              "appeal": "Apelación",
              "unsure": "Desconocido"
            },
            "custody_status": {
              "yes": "Bajo Custodia",
              "bail": "Libre Bajo Fianza",
              "recognizance": "Bajo Palabra",
              "no": "No Bajo Custodia"
            }
          }
        },
        "exportWarning": {
          "title": "Importante: Antes de Exportar",
          "intro": "Este documento contiene detalles sobre su situación legal que usted proporcionó. Por favor tenga en cuenta:",
          "notLegalAdvice": "Esto no es asesoría legal",
          "notLegalAdviceDesc": "Es solo información legal general",
          "notPrivileged": "No está protegido por el privilegio abogado-cliente",
          "notPrivilegedDesc": "Los documentos que cree y comparta pueden ser solicitados por las partes contrarias en procedimientos legales",
          "shareWithAttorney": "Comparta solo con su abogado",
          "shareWithAttorneyDesc": "Si tiene un abogado, comparta esto primero con él antes que con cualquier otra persona",
          "recommendation": "Le recomendamos discutir esta orientación con un abogado licenciado antes de tomar cualquier acción.",
          "confirmButton": "Entiendo, Exportar PDF"
        },
        "attorneyPortal": {
          "hero": {
            "title": "Herramientas para Abogados",
            "subtitle": "Recursos y herramientas para abogados con licencia que representan clientes en asuntos penales e inmigratorios."
          },
          "disclaimer": "Estas herramientas están diseñadas para abogados con licencia. Las funciones de generación de documentos requieren certificación de membresía al colegio de abogados.",
          "comingSoon": "Próximamente",
          "documentGeneration": {
            "title": "Generación de Documentos",
            "description": "Redacción impulsada por IA para presentaciones penales e inmigratorias comunes. Genere mociones, avisos y otros documentos adaptados al caso de su cliente.",
            "feature1": "Mociones de Continuación, Descubrimiento, Reducción de Fianza",
            "feature2": "Presentaciones de tribunal de inmigración (EOIR-28, Memorandos de Fianza)",
            "feature3": "Formato específico por jurisdicción",
            "getStarted": "Comenzar",
            "button": "Próximamente"
          },
          "courtRecords": {
            "title": "Búsqueda de Registros Judiciales",
            "description": "Busque registros de tribunales federales a través de PACER y acceda a documentos gratuitos vía RECAP. Investigue historial de casos, entradas de expedientes y documentos presentados.",
            "feature1": "Integración PACER para tribunales federales",
            "feature2": "Acceso gratuito vía archivo RECAP",
            "feature3": "Búsqueda de expedientes y recuperación de documentos",
            "button": "Buscar Registros Judiciales"
          },
          "sharedResources": {
            "title": "Recursos Compartidos",
            "description": "Estos recursos están disponibles para todos y pueden ser útiles para su práctica.",
            "statutes": "Búsqueda de Estatutos",
            "statutesDesc": "Buscar leyes estatales y federales",
            "documents": "Biblioteca de Documentos",
            "documentsDesc": "Formularios y plantillas legales",
            "glossary": "Glosario Legal",
            "glossaryDesc": "Definiciones de términos legales",
            "courts": "Localizador de Tribunales",
            "courtsDesc": "Encontrar ubicaciones de tribunales"
          },
          "guidanceNote": {
            "title": "Orientación Personalizada",
            "description": "Nuestro chat de orientación impulsado por IA también está disponible para que los abogados comprendan rápidamente la situación de un cliente o investiguen derechos y procedimientos.",
            "button": "Obtener Orientación"
          },
          "verify": {
            "title": "Verificación de Abogado",
            "subtitle": "Por favor verifique su membresía al colegio de abogados para acceder a las herramientas de generación de documentos.",
            "backToPortal": "Volver al Portal de Abogados",
            "formTitle": "Verificación de Abogado",
            "formDescription": "Confirme las certificaciones requeridas para acceder a las herramientas de documentos para abogados.",
            "attestationsTitle": "Certificaciones Requeridas",
            "attestation1": "Soy un abogado con licencia en buena posición con mi colegio de abogados estatal, y estoy accediendo a estas herramientas en nombre de un cliente que represento.",
            "attestation2": "Estoy accediendo a estas herramientas en nombre de un cliente que represento.",
            "attestation3": "Entiendo que las protecciones del privilegio abogado-cliente dependen del uso adecuado de estas herramientas.",
            "attestation4": "Acepto los",
            "termsOfService": "Términos de Servicio",
            "tosTitle": "Términos de Servicio de Herramientas para Abogados",
            "tosSubtitle": "Por favor revise antes de aceptar.",
            "tosContent": "Al usar estas herramientas para abogados, usted reconoce y acepta lo siguiente:",
            "privacyNotice": "Los datos de su sesión se eliminarán automáticamente después de 30 minutos.",
            "verifying": "Verificando...",
            "submit": "Verificar y Continuar"
          },
          "session": {
            "expiresIn": "La sesión expira en",
            "checking": "Verificando sesión...",
            "redirecting": "Redirigiendo a verificación..."
          },
          "documents": {
            "title": "Generación de Documentos",
            "subtitle": "Redacción de documentos impulsada por IA para asuntos penales e inmigratorios.",
            "barState": "Estado del Colegio",
            "criminal": "Penal",
            "immigration": "Inmigración",
            "sessionNote": "Su sesión terminará automáticamente después de 30 minutos de inactividad.",
            "endSession": "Terminar Sesión",
            "comingSoonTitle": "Plantillas Próximamente",
            "criminalComingSoon": "Las plantillas de derecho penal incluyendo Mociones de Continuación, Solicitudes de Descubrimiento y mociones de Reducción de Fianza están siendo desarrolladas.",
            "immigrationComingSoon": "Las plantillas de inmigración incluyendo formularios EOIR-28, Memorandos de Fianza y mociones de Cambio de Sede están siendo desarrolladas."
          }
        }
        }
      }
      ,
      zh: {
        translation: {
          "header": {
            "title": "Public Defender AI",
            "subtitle": "免费法律指导与权利信息",
            "menu": {
              "getHelp": "获取帮助",
              "getHelpDesc": "与我们的AI对话，获取个性化的法律指导",
              "knowRights": "了解你的权利",
              "knowRightsDesc": "了解你的宪法保护",
              "documentLibrary": "文件库",
              "documentLibraryDesc": "了解你案件中的法律文件",
              "findResources": "查找资源",
              "findResourcesDesc": "查找法院、公设辩护人和法律援助"
            },
            "language": "语言",
            "theme": "主题",
            "darkMode": "深色模式",
            "lightMode": "浅色模式"
          },
          "home": {
            "hero": {
              "title1": "了解你的权利。",
              "title2": "保护你的未来。",
              "subtitle": "获取免费的法律指导，了解法庭流程，获取资源帮助你应对刑事司法系统。",
              "urgentHelpButton": "紧急求助",
              "getStartedButton": "开始使用",
              "navigatingToolButton": "如何使用这个工具",
              "urgentHelpNotice": "如果你正在被逮捕或正在出庭，请点击\"紧急求助\"获取即时指导。"
            },
            "features": {
              "title": "基于真实法律数据",
              "subtitle": "我们的AI使用全面的法律数据库和法院记录，提供准确、最新的信息。",
              "federalCourts": "法院记录",
              "federalCourtsDesc": "通过CourtListener API获取数百万联邦和州法院判例。RECAP Archive整合提供免费联邦法院文件访问（PACER整合即将推出）。",
              "federalCourtsStatus": "部分完成",
              "stateLaws": "州和联邦法律",
              "stateLawsDesc": "涵盖全部50个州加华盛顿特区，包含1,255项刑事法规和713项经过验证的指控匹配，涵盖12个犯罪类别。联邦法规来自GovInfo.gov。所有辖区都链接到官方立法机构网站。",
              "stateLawsStatus": "已启用 - 51个辖区",
              "analytics": "刑事司法数据分析",
              "analyticsDesc": "司法统计局（BJS）整合正在推进中。NCVS/NIBRS API实现及适当加权和分页功能正在验证中。",
              "analyticsStatus": "部分完成"
            },
            "trust": {
              "title": "建立在信任和透明之上",
              "subtitle": "每一条法律信息都有可靠来源支持",
              "verifiedTitle": "经过验证的引用",
              "verifiedDesc": "所有法律声明都包含对法律、法院案件和法规的正确引用",
              "privacyTitle": "隐私受到保护",
              "privacyDesc": "不存储个人信息，所有会话数据自动删除",
              "currentTitle": "最新信息",
              "currentDesc": "法律数据库定期更新，以反映最新的法律和程序",
              "disclaimerTitle": "法律免责声明：",
              "disclaimerText": "本AI仅提供一般性法律信息，不能替代专业法律建议。请务必就你的具体情况咨询合格的律师。所提供的信息可能未反映最新的法律动态，不应作为法律意见依赖。"
            },
            "urgentHelp": {
              "modalTitle": "紧急法律情况",
              "arrestWarning": "如果你正在被逮捕：",
              "arrestWarningText": "你有权保持沉默，有权请律师。请立即行使这些权利。",
              "immediateActions": "现在该怎么做：",
              "stayCalmTitle": "1. 保持冷静",
              "stayCalmText": "不要反抗。让警察看到你的双手。冷静地配合他们的指示。",
              "assertRightsTitle": "2. 声明你的权利",
              "assertRightsText1": "清楚地说：\"我要保持沉默。我要和律师谈话。\"",
              "assertRightsText2": "然后停止和警察说话。在有律师之前不要回答任何问题。",
              "noConsentTitle": "3. 不要同意搜查",
              "noConsentText": "说：\"我不同意搜查。\"不要反抗，但要明确表示你不同意。",
              "publicDefenderTitle": "4. 要求公设辩护人",
              "publicDefenderText": "如果你请不起律师，你可以免费获得一位。第一次出庭时要求公设辩护人。",
              "rememberTitle": "请记住：",
              "rememberText": "你说的任何话都可能在法庭上被用作对你不利的证据。保护自己的最好方式就是在有律师之前保持沉默。"
            },
            "whatWeDo": {
              "title": "我们做什么",
              "subtitle": "Public Defender AI帮助人们了解自己的法律权利，并在刑事司法系统中获得指引。",
              "card1Title": "AI法律指导",
              "card1Desc": "根据你的具体情况获取个性化的法律信息",
              "card2Title": "权利信息",
              "card2Desc": "了解你在逮捕和法庭程序中的法律权利",
              "card3Title": "查找资源",
              "card3Desc": "查找公设辩护人、法律援助组织和法院信息"
            },
            "cta": {
              "title": "准备好开始了吗？",
              "subtitle": "为你的情况获取免费的法律帮助和信息。",
              "button": "开始使用"
            },
            "knowRights": {
              "title": "了解你的权利",
              "subtitle": "了解你的法律权利是保护自己的第一步。",
              "rightToRemainSilent": "沉默权",
              "rightToRemainSilentDesc": "没有律师在场时，你不需要回答问题",
              "rightToAttorney": "律师权",
              "rightToAttorneyDesc": "你有权获得法律代理，即使你负担不起",
              "rightToFairTrial": "公正审判权",
              "rightToFairTrialDesc": "你有权获得公正的法律程序和不偏不倚的陪审团",
              "searchWarrantRights": "搜查和扣押保护",
              "searchWarrantRightsDesc": "在大多数情况下，警察需要搜查令才能搜查你或你的财产",
              "selfIncrimination": "免于自证其罪的保护",
              "selfIncriminationDesc": "你不能被迫提供对自己不利的证词",
              "speedyTrial": "快速审判权",
              "speedyTrialDesc": "你有权在没有不合理延误的情况下接受审判",
              "learnMore": "了解更多关于你的权利",
              "showMore": "显示更多",
              "showLess": "收起"
            },
            "dataSources": {
              "title": "数据来源",
              "subtitle": "我们的信息来自值得信赖的权威法律数据库。",
              "courtlistener": "CourtListener API",
              "courtlistenerDesc": "来自Free Law Project的840多万份法院判例和联邦案卷",
              "recap": "RECAP Archive",
              "recapDesc": "由PACER用户众包共享的免费联邦法院记录",
              "cornell": "Cornell Legal Institute",
              "cornellDesc": "美国宪法、联邦法律和法律资源"
            },
            "publicDefenderSearch": {
              "title": "查找公设辩护人办公室",
              "inputLabel": "输入邮政编码",
              "inputPlaceholder": "输入5位邮政编码",
              "searchButton": "搜索",
              "searching": "搜索中...",
              "noResults": "50英里内未找到公设辩护人办公室。请尝试其他邮政编码或联系当地法院获取信息。",
              "error": "请输入有效的5位邮政编码",
              "errorGeneral": "无法搜索办公室。请重试或联系当地法院获取信息。",
              "county": "县",
              "milesAway": "英里",
              "address": "地址",
              "phone": "电话",
              "email": "邮箱",
              "hours": "工作时间",
              "services": "服务",
              "directions": "路线"
            },
            "legalAidSearch": {
              "title": "查找法律援助组织",
              "inputLabel": "输入邮政编码",
              "inputPlaceholder": "输入5位邮政编码",
              "searchButton": "搜索",
              "searching": "搜索中...",
              "noResults": "100英里内未找到法律援助组织。请尝试其他邮政编码或联系你所在州的律师协会。",
              "error": "请输入有效的5位邮政编码",
              "errorGeneral": "无法搜索组织。请重试或联系当地律师协会。",
              "servicesOffered": "提供的服务",
              "alertMessage": "这些组织专注于刑事司法和移民法律援助。符合条件的人通常可以获得免费或低价服务。",
              "resultsFound": "在你附近找到了{{count}}个组织{{plural}}"
            },
            "searchResults": {
              "foundOffices": "在你附近找到了{{count}}个办公室{{plural}}"
            }
          },
          "footer": {
            "tagline": "通过AI驱动的法律指导和资源，扩大司法公正的覆盖面。",
            "legalResources": "法律资源",
            "knowYourRights": "了解你的权利",
            "courtProcedures": "法庭程序",
            "legalGlossary": "法律术语表",
            "recordExpungement": "犯罪记录消除",
            "friendsFamily": "亲友帮助指南",
            "courtRecords": "查找法院记录",
            "getHelp": "获取帮助",
            "getCaseGuidance": "获取案件指导",
            "immigrationEnforcement": "移民执法",
            "diversionPrograms": "转处计划",
            "findLocalCourts": "查找当地法院",
            "findPublicDefender": "查找公设辩护人",
            "legalAidOrgs": "法律援助组织",
            "about": "关于",
            "ourMission": "我们的使命",
            "developmentRoadmap": "开发路线图",
            "privacyPolicy": "隐私政策",
            "noticeDisclaimers": "通知与免责声明",
            "privacyNotice": "隐私优先：我们不存储你的个人数据——所有输入在会话结束后删除。",
            "copyright": "© 2025 Public Defender AI。不能替代专业法律建议。"
          },
          "common": {
            "close": "关闭",
            "cancel": "取消",
            "submit": "提交",
            "search": "搜索",
            "loading": "加载中...",
            "error": "错误",
            "success": "成功",
            "email": "邮箱",
            "phone": "电话",
            "address": "地址",
            "name": "姓名",
            "description": "描述",
            "learnMore": "了解更多",
            "getStarted": "开始使用",
            "back": "返回",
            "next": "下一步",
            "save": "保存",
            "important": "重要",
            "privacyFirst": "隐私优先"
          },
          "mockQA": {
            "sectionTitle": "练习问答",
            "sectionSubtitle": "法庭上你可能会听到的常见问题",
            "personalizedTitle": "针对你案件的练习问题",
            "showResponse": "显示回答",
            "hideResponse": "隐藏回答",
            "practiceNote": "大声练习这些回答，这样你在出庭时会更有准备。",
            "arraignment": {
              "plea": {
                "question": "对于你被指控的罪名，你作何答辩？",
                "response": "不认罪，法官大人。",
                "explanation": "大多数律师建议在提审时作无罪答辩。这样可以保留你所有的选择，并有时间审查证据。"
              },
              "understand": {
                "question": "你是否理解你被指控的罪名？",
                "response": "是的，法官大人，我理解这些指控。",
                "explanation": "如果你没有完全理解，可以说'我希望我的律师向我解释一下。'如果你真的不理解，千万不要说是。"
              },
              "attorney": {
                "question": "你有律师吗，还是需要指定一位？",
                "response": "法官大人，我想申请一位公设辩护人。",
                "explanation": "如果你请不起律师，你有权获得一位免费指定的律师。请如实说明你的经济状况。"
              },
              "waiveTime": {
                "question": "你是否放弃快速审判的权利？",
                "response": "我想先和我的律师讨论后再回答。",
                "explanation": "在未咨询律师的情况下，不要放弃时间权利。这会影响你案件中的重要期限。"
              }
            },
            "bail": {
              "residence": {
                "question": "你目前的地址是什么？你在那里住了多久？",
                "response": "我住在[地址]，已经住了[时间]。",
                "explanation": "稳定的住所表明你与社区有联系，不太可能逃跑。"
              },
              "employment": {
                "question": "你目前有工作吗？在哪里工作？",
                "response": "是的，我在[雇主]担任[职位]。",
                "explanation": "有工作说明你与社区有联系，有责任心。提一下你在那里工作了多久。"
              },
              "ties": {
                "question": "你在这个地区有家人吗？",
                "response": "是的，我有[家人]住在附近。",
                "explanation": "家庭关系表明你有留在这个地区并按时出庭的理由。"
              }
            },
            "pretrial": {
              "progress": {
                "question": "你有定期与律师会面准备案件吗？",
                "response": "是的，法官大人，我一直与律师保持联系。",
                "explanation": "这表明你认真对待自己的案件，并积极参与辩护。"
              },
              "conditions": {
                "question": "你是否遵守了所有释放条件？",
                "response": "是的，法官大人，我遵守了所有条件。",
                "explanation": "如果你遇到了任何困难，在听证会之前告诉你的律师，让他们能够妥善处理。"
              }
            },
            "plea": {
              "voluntary": {
                "question": "你的认罪是自愿的吗？",
                "response": "是的，法官大人。",
                "explanation": "只有在这确实是你自己的决定、没有人强迫你的情况下才回答是。如果你有疑虑，告诉法官。"
              },
              "discussed": {
                "question": "你是否已经和律师充分讨论了这个认罪协议？",
                "response": "是的，法官大人，我已经和律师讨论了认罪的各个方面。",
                "explanation": "你应该有时间提问并了解所有后果，然后再作认罪答辩。"
              },
              "consequences": {
                "question": "你是否了解认罪的后果，包括可能的监禁？",
                "response": "是的，法官大人，我了解可能的后果。",
                "explanation": "确保你真正了解最高刑罚、附带后果，以及如果适用的话，对移民身份的影响。"
              }
            },
            "sentencing": {
              "statement": {
                "question": "在我宣判之前，你有什么要对法庭说的吗？",
                "response": "是的，法官大人。[表达真诚的悔意，承担责任，提及已采取的积极措施]",
                "explanation": "这是你的陈述机会。要真诚，承担责任，提及你已经做出的改过努力。"
              },
              "understand": {
                "question": "你是否理解我刚才宣布的判决？",
                "response": "是的，法官大人，我理解了。",
                "explanation": "如果你对判决、条件或报到要求有任何不清楚的地方，请要求澄清。"
              }
            },
            "trial": {
              "testify": {
                "question": "你是否愿意为自己辩护作证？",
                "response": "我想先和律师进一步讨论后再决定。",
                "explanation": "这是一个重大决定。你有权不作证，陪审团不能因为你的沉默而对你不利。"
              },
              "juryWaiver": {
                "question": "你是否放弃接受陪审团审判的权利？",
                "response": "法官大人，我想保留我的陪审团审判权利。",
                "explanation": "只有在与律师仔细讨论后，确定法官审判对你的具体案件可能更有利时，才放弃陪审团审判。"
              }
            }
          },
          "legalGuidance": {
            "qaFlow": {
              "title": "获取个性化法律指导",
              "cancel": "取消",
              "stepProgress": "第{{current}}步，共{{total}}步：{{title}}",
              "privacyNotice": "你的回答不会被保存，会在你关闭会话时删除",
              "steps": {
                "consent": "隐私与同意",
                "jurisdiction": "你的州",
                "caseDetails": "你的案件",
                "status": "当前状态",
                "additionalDetails": "补充信息（可选）"
              },
              "consent": {
                "title": "隐私免责声明与同意",
                "important": "重要：",
                "generalInfo": "本工具仅提供一般性法律信息，不能替代专业法律建议。",
                "noStorage": "我们不存储你的个人信息。所有数据在你关闭会话时删除。",
                "consultAttorney": "如需具体的法律建议，请咨询合格的律师。",
                "checkboxLabel": "我理解并同意继续",
                "continueButton": "继续"
              },
              "jurisdiction": {
                "title": "你的案件在哪个州？",
                "label": "你的州",
                "placeholder": "选择你的州...",
                "states": {
                  "AL": "Alabama",
                  "AK": "Alaska",
                  "AZ": "Arizona",
                  "AR": "Arkansas",
                  "CA": "California",
                  "CO": "Colorado",
                  "CT": "Connecticut",
                  "DE": "Delaware",
                  "FL": "Florida",
                  "GA": "Georgia",
                  "HI": "Hawaii",
                  "ID": "Idaho",
                  "IL": "Illinois",
                  "IN": "Indiana",
                  "IA": "Iowa",
                  "KS": "Kansas",
                  "KY": "Kentucky",
                  "LA": "Louisiana",
                  "ME": "Maine",
                  "MD": "Maryland",
                  "MA": "Massachusetts",
                  "MI": "Michigan",
                  "MN": "Minnesota",
                  "MS": "Mississippi",
                  "MO": "Missouri",
                  "MT": "Montana",
                  "NE": "Nebraska",
                  "NV": "Nevada",
                  "NH": "New Hampshire",
                  "NJ": "New Jersey",
                  "NM": "New Mexico",
                  "NY": "New York",
                  "NC": "North Carolina",
                  "ND": "North Dakota",
                  "OH": "Ohio",
                  "OK": "Oklahoma",
                  "OR": "Oregon",
                  "PA": "Pennsylvania",
                  "RI": "Rhode Island",
                  "SC": "South Carolina",
                  "SD": "South Dakota",
                  "TN": "Tennessee",
                  "TX": "Texas",
                  "UT": "Utah",
                  "VT": "Vermont",
                  "VA": "Virginia",
                  "WA": "Washington",
                  "WV": "West Virginia",
                  "WI": "Wisconsin",
                  "WY": "Wyoming",
                  "DC": "District of Columbia",
                  "federal": "联邦"
                },
                "back": "返回",
                "continue": "继续"
              },
              "caseDetails": {
                "title": "你面临什么指控？",
                "selectedCharges": "已选择的指控：",
                "filterLabel": "按类别筛选（可选）",
                "filterPlaceholder": "所有类别",
                "allCategories": "所有类别",
                "selectLabel": "选择所有适用于你案件的指控：",
                "stateCharges": "州指控",
                "federalCharges": "联邦指控",
                "maxPenalty": "最高刑罚：",
                "showMore": "显示更多{{count}}项指控...",
                "hasAttorneyLabel": "我已经有律师或公设辩护人",
                "back": "返回",
                "continue": "继续"
              },
              "status": {
                "title": "当前状态",
                "caseStageLabel": "你的案件处于哪个阶段？",
                "caseStageplaceholder": "选择当前阶段...",
                "stages": {
                  "arrest": "刚被逮捕 / 调查阶段",
                  "arraignment": "提审已安排/已完成",
                  "pretrial": "审前程序",
                  "trial": "审判已安排/进行中",
                  "sentencing": "量刑阶段",
                  "appeal": "上诉程序",
                  "unsure": "不确定"
                },
                "custodyLabel": "你目前是否被拘留？",
                "custodyPlaceholder": "选择拘留状态...",
                "custodyOptions": {
                  "yes": "是的，正在被拘留",
                  "bail": "已缴纳保释金释放",
                  "recognizance": "自行具结释放（无需保释金）",
                  "no": "不，未被拘留"
                },
                "back": "返回",
                "submitButton": "获取我的法律指导",
                "continue": "继续"
              },
              "additionalDetails": {
                "title": "补充信息（可选）",
                "description": "你提供的细节越多，我们的AI就能为你的具体情况提供越好的指导。所有字段都是可选的——你可以跳过不想回答的问题。",
                "incidentLabel": "发生了什么？用你自己的话描述事件经过",
                "incidentPlaceholder": "例如：我下班开车回家时被警察拦下了。他们说我在左右摇晃，但我只是为了避开一个坑洞才转了一下方向...",
                "concernsLabel": "你最担心什么？有什么具体问题吗？",
                "concernsPlaceholder": "例如：我担心会丢掉工作。我有孩子，请不起律师。我什么时候要上法庭？",
                "back": "返回"
              },
              "privilegeWarning": {
                "title": "分享信息之前请注意",
                "notPrivate": "和律师交谈不同，你在这里输入的内容不受保密特权保护，如果在法庭上被问到，可能会被用作对你不利的证据。",
                "recommendation": "我们建议你先咨询律师。这一步是可选的——跳过它你仍然可以获得一般性指导。",
                "continueAnyway": "仍然继续",
                "skipAndGetGuidance": "跳过并获取一般性指导",
                "findLawyer": "帮我找一位律师"
              }
            },
            "dashboard": {
              "title": "法律指导仪表盘",
              "generatedOn": "生成日期",
              "hideDetails": "隐藏详情",
              "showDetails": "显示详情",
              "close": "关闭",
              "exportPDF": "导出PDF",
              "summary": {
                "charges": "指控",
                "jurisdiction": "你的州",
                "currentStage": "当前阶段",
                "progress": "进度",
                "actionsCompleted": "已完成的操作",
                "protected": "已保护"
              },
              "criticalAlerts": {
                "title": "紧急提醒 - 需要立即行动"
              },
              "upcomingDeadlines": {
                "title": "即将到来的截止日期"
              },
              "immediateActions": {
                "title": "立即行动（48小时内）",
                "completed": "已完成：{{count}}/{{total}}项操作"
              },
              "caseTimeline": {
                "title": "案件时间线",
                "progress": "案件进展",
                "current": "当前"
              },
              "nextSteps": {
                "title": "下一步"
              },
              "yourRights": {
                "title": "你的权利"
              },
              "localResources": {
                "title": "当地资源"
              },
              "evidenceToGather": {
                "title": "需要收集的证据"
              },
              "importantWarnings": {
                "title": "重要警告"
              },
              "courtPreparation": {
                "title": "出庭准备"
              },
              "actionsToAvoid": {
                "title": "应避免的行为"
              },
              "privacyNotice": {
                "title": "你的隐私受到保护",
                "text": "本指导根据你的输入生成，会在你的会话结束后自动删除。不会永久存储任何个人信息。",
                "encrypted": "所有数据在传输和存储时均已加密",
                "autoDelete": "会话数据在24小时后自动删除",
                "piiRedacted": "个人信息在AI处理前已脱敏",
                "deleteNow": "立即删除我的数据",
                "deleteNote": "永久删除所有会话数据"
              }
            }
          },
          "getStartedMenu": {
            "main": {
              "title": "你需要什么帮助？",
              "caseGuidance": {
                "title": "获取案件指导",
                "description": "基于你的情况提供个性化法律指导"
              },
              "immigration": {
                "title": "移民执法",
                "description": "ICE遭遇和驱逐出境时的权利"
              },
              "legalRights": {
                "title": "法律权利信息",
                "description": "宪法权利和法律程序"
              },
              "legalAid": {
                "title": "法律援助资源与支持",
                "description": "查找法律帮助和支持服务"
              },
              "lawsRecords": {
                "title": "法律与文件",
                "description": "查找法规、判例法、法院记录和文件指南"
              },
              "attorneyTools": {
                "title": "律师工具",
                "description": "面向法律专业人士的文件起草和资源"
              },
              "resources": {
                "title": "资源",
                "description": "法律援助、支持服务、法律、法院记录和文件"
              }
            },
            "resourcesSubmenu": {
              "title": "资源",
              "backButton": "返回主菜单",
              "legalAid": "法律援助资源与支持",
              "lawsRecords": "法律与文件"
            },
            "legalRightsSubmenu": {
              "title": "法律权利信息",
              "backButton": "返回主菜单",
              "constitutionalRights": "你的法律权利",
              "criminalJusticeProcess": "刑事司法流程",
              "caseTimeline": "案件时间线",
              "quickReference": "快速参考卡",
              "searchSeizure": "搜查与扣押",
              "assistingFriends": "帮助亲友",
              "legalGlossary": "法律术语表"
            },
            "legalAidSubmenu": {
              "title": "法律援助资源与支持",
              "backButton": "返回资源页",
              "publicDefender": "查找公设辩护人",
              "legalAidOrgs": "法律援助组织",
              "diversionPrograms": "转处计划",
              "recordsExpungement": "犯罪记录消除"
            },
            "lawsRecordsSubmenu": {
              "title": "法律与文件",
              "backButton": "返回资源页",
              "courtRecords": "法院记录搜索",
              "statutes": "法规搜索",
              "documentLibrary": "文件库"
            },
            "immigrationSubmenu": {
              "title": "移民执法",
              "backButton": "返回主菜单",
              "generalInfo": "一般信息",
              "situationalGuides": "情景指南",
              "knowYourRights": "了解你的权利",
              "findDetained": "查找被拘留的人",
              "findLawyer": "查找律师"
            }
          },
          "case": {
            "hero": {
              "title": "案件指导",
              "subtitle": "获取个性化法律指导",
              "description": "回答几个关于你情况的问题，获取法律帮助、下一步建议和案件相关资源。",
              "startButton": "开始使用",
              "privacyNote": "你的回答是私密的，会在会话结束后自动删除"
            },
            "howItWorks": {
              "title": "个性化指导是如何运作的",
              "step1Title": "回答问题",
              "step1Desc": "告诉我们你的州、指控和目前的法律程序阶段",
              "step2Title": "我们分析你的情况",
              "step2Desc": "我们的系统使用法律数据库和以往案例来分析你的情况",
              "step3Title": "获取指导",
              "step3Desc": "获得针对性的下一步建议、截止日期和相关法律信息",
              "step4Title": "连接帮助",
              "step4Desc": "获取当地资源、律师和支持组织的信息"
            },
            "benefits": {
              "title": "你将获得什么",
              "nextStepsTitle": "下一步行动",
              "nextStepsDesc": "基于你案件阶段和情况的清晰、可执行的步骤",
              "deadlinesTitle": "重要截止日期",
              "deadlinesDesc": "你需要了解的你所在州的重要日期和截止日期",
              "rightsTitle": "你的权利",
              "rightsDesc": "适用于你情况的权利以及如何行使这些权利",
              "resourcesTitle": "当地资源",
              "resourcesDesc": "你所在地区的公设辩护人、法律援助组织和支持服务",
              "warningsTitle": "重要警告",
              "warningsDesc": "针对你情况的注意事项和需要避免的问题",
              "legalInfoTitle": "法律信息",
              "legalInfoDesc": "适用于你情况的法律和以往案例"
            },
            "privacy": {
              "title": "你的隐私受到保护",
              "subtitle": "我们重视你的隐私。以下是我们如何保护你的信息。",
              "noStorageTitle": "不存储数据",
              "noStorageDesc": "个人信息不会保存到我们的服务器",
              "sessionOnlyTitle": "仅限会话期间",
              "sessionOnlyDesc": "数据仅在你的活跃会话期间存在",
              "autoDeleteTitle": "自动删除",
              "autoDeleteDesc": "当你离开时，所有信息自动删除",
              "anonymousTitle": "匿名使用",
              "anonymousDesc": "不需要创建账户，完全匿名使用",
              "disclaimer": "本工具仅提供一般性法律信息和指导。它不能替代专业法律建议。请务必就你案件的具体情况咨询合格的律师。",
              "getStartedButton": "立即开始",
              "learnRightsButton": "先了解你的权利",
              "footerBanner": "我们不存储你的个人数据——所有输入在会话结束后删除。"
            },
            "exitWarning": {
              "title": "离开之前",
              "message": "你的个性化指导还没有导出。为了保护你的隐私，我们不保存这些信息。如果你现在离开，它将会丢失。",
              "export": "导出",
              "proceed": "继续离开"
            }
          },
          "rights": {
            "hero": {
              "title": "了解你的法律权利",
              "subtitle": "了解你的法律权利是在法律系统中保护自己的第一步。"
            },
            "quickRights": {
              "title": "每个人都应知道的基本权利",
              "silent": {
                "title": "沉默权",
                "description": "除了基本身份信息外，你不需要回答问题",
                "detailedExplanation": "法律保护你免于被迫说出对你案件不利的话。你只需要提供姓名和地址等基本信息——除此之外，你可以在没有律师在场的情况下拒绝回答警察的任何问题。你说的任何话都可能在法庭上被用来对付你，所以行使这项权利可以保护你不会说出可能损害你辩护的话，即使你认为自己是无辜的。"
              },
              "attorney": {
                "title": "律师权",
                "description": "如果你负担不起，可以获得免费的法律代理",
                "detailedExplanation": "法律保障你在刑事案件中有权获得律师。如果你请不起律师，法院必须为你免费指定一位公设辩护人——这适用于任何你可能面临监禁的刑事案件。你应该在被逮捕后立即要求律师，在回答任何问题之前就这样做，因为从一开始就有律师能大大提高你获得公正结果的机会。"
              },
              "phoneCall": {
                "title": "打电话的权利",
                "description": "被捕后可以联系家人、律师或保释担保人",
                "detailedExplanation": "在被逮捕和登记后，你有权打合理数量的电话联系律师、家人或保释担保人。由于律师-客户特权，警察不能监听你与律师的通话，但他们可能会监听其他通话。明智地使用这项权利很重要——如果可能的话，先联系你的律师，并避免在可能被录音的电话中讨论你案件的细节。"
              },
              "knowCharges": {
                "title": "知情权",
                "description": "必须被告知对你的指控",
                "detailedExplanation": "法律要求你被正式告知对你的刑事指控，通常是在被捕后48-72小时内的第一次出庭时。你有权知道你被指控的具体罪行、他们说你违反了哪些法律，以及你可能面临的处罚。这些信息让你和你的律师能够准备辩护，并确保你不会因为未被正式告知的罪行而受审。"
              }
            },
            "detailedRights": {
              "title": "你的法律权利详解",
              "tabs": {
                "miranda": "米兰达警告",
                "arrest": "逮捕期间",
                "court": "在法庭上",
                "prison": "如果被定罪"
              },
              "miranda": {
                "title": "米兰达警告",
                "completeWarning": "完整的米兰达警告：",
                "warning1": "你有权保持沉默。",
                "warning2": "你所说的一切都可以而且将会在法庭上被用作对你不利的证据。",
                "warning3": "你有权请律师。",
                "warning4": "如果你请不起律师，将为你指定一位。",
                "warning5": "你是否理解我刚才宣读的这些权利？",
                "warning6": "了解这些权利后，你是否愿意与我交谈？",
                "whenApply": "米兰达警告的适用情况：",
                "apply1": "当你被警方拘留并且正在接受讯问时",
                "apply2": "不适用于交通拦停或自愿回答问题",
                "apply3": "必须在拘留讯问开始之前告知",
                "apply4": "你可以在讯问过程中随时行使这些权利",
                "alertTitle": "重要：",
                "alertText": "如果警察没有向你宣读米兰达警告，你在拘留期间所说的话可能不被法庭采纳，但这并不会自动撤销你的案件。"
              },
              "arrest": {
                "title": "逮捕期间的权利",
                "shouldDo": "你应该做的：",
                "do1": "保持冷静，不要抗拒逮捕",
                "do2": "让你的双手保持可见",
                "do3": "行使你的沉默权",
                "do4": "立即要求律师",
                "do5": "记住细节，之后告诉你的律师",
                "shouldNotDo": "你不应该做的：",
                "dont1": "不要跑或进行身体反抗",
                "dont2": "不要和警察争论",
                "dont3": "不要同意搜查",
                "dont4": "没有律师不要回答问题",
                "dont5": "不要签署任何文件",
                "policePowers": "逮捕期间的警察权力：",
                "power1": "可以搜查你和你身边区域以寻找武器/证据",
                "power2": "可以扣押视线范围内的物品",
                "power3": "如果在交通拦停中被逮捕，可以搜查你的车辆",
                "power4": "在大多数情况下，未经搜查令不能搜查你的手机"
              },
              "court": {
                "title": "法庭上的权利",
                "constitutional": "法律权利：",
                "right1": "获得公正和快速审判的权利",
                "right2": "获得公正、不偏不倚的陪审团的权利",
                "right3": "质询证人的权利",
                "right4": "提出辩护的权利",
                "right5": "对定罪提出上诉的权利",
                "burdenProof": "举证责任：",
                "burden1": "检察官必须证明有罪达到排除合理怀疑的标准",
                "burden2": "在被证明有罪之前，你被推定为无罪",
                "burden3": "你不需要证明自己的清白",
                "burden4": "你有权不出庭作证",
                "etiquetteTitle": "法庭礼仪：",
                "etiquetteText": "穿着得体，准时到达，法官进场时起立，称呼法官为\"法官大人\"，让你的律师代你发言。"
              },
              "prison": {
                "title": "被定罪后的权利",
                "continuing": "持续享有的权利：",
                "right1": "对定罪提出上诉的权利",
                "right2": "上诉时获得律师代理的权利",
                "right3": "在监狱中获得人道待遇的权利",
                "right4": "获得医疗服务的权利",
                "right5": "宗教信仰自由的权利",
                "right6": "与家人联络的权利（有一定限制）",
                "afterRelease": "释放后：",
                "after1": "可能需要接受缓刑或假释监管",
                "after2": "可能面临就业限制",
                "after3": "可能失去某些公民权利（投票权、持枪权）",
                "after4": "对非公民可能产生移民方面的后果",
                "after5": "可能申请犯罪记录消除或封存",
                "collateralTitle": "附带后果：",
                "collateralText": "刑事定罪可能影响就业、住房、专业执照、学生资助和移民身份。请与你的律师讨论这些问题。"
              }
            },
            "disclaimer": {
              "title": "重要：",
              "text": "本信息仅供学习参考，不构成法律建议。各州法律不同，且会随时变化。请务必就你的具体情况咨询真正的律师。",
              "needHelp": "需要紧急法律帮助？",
              "emergencyAid": "紧急法律援助",
              "caseGuidance": "获取案件指导"
            }
          },
          "immigration": {
            "common": {
              "importantLabel": "重要："
            },
            "hero": {
              "title1": "移民执法",
              "title2": "了解你的权利",
              "subtitle": "在ICE遭遇和驱逐出境程序中，公民和非公民都需要了解的基本权利信息"
            },
            "criticalAlert": {
              "title": "关键提示：",
              "text": "这些权利适用于在美国的所有人，无论你的公民身份如何。即使在移民执法行动中，你也享有法律保护。"
            },
            "emergencyRights": {
              "title": "ICE遭遇时的即时权利",
              "subtitle": "这些权利适用于所有人——公民、非公民、有身份者和无身份者",
              "constitutionalTitle": "你的法律权利",
              "constitutionalRights": {
                "silent": {
                  "title": "沉默权：",
                  "text": "你不必回答关于你的移民身份、国籍或出生地的问题。"
                },
                "refuseSearch": {
                  "title": "拒绝搜查的权利：",
                  "text": "你可以拒绝同意对你本人、随身物品、汽车或住宅的搜查。"
                },
                "attorney": {
                  "title": "律师权：",
                  "text": "你有权在回答问题之前与律师交谈。"
                },
                "interpreter": {
                  "title": "翻译权：",
                  "text": "你在诉讼程序中有权获得翻译。"
                }
              },
              "whatNotToDoTitle": "不要做什么",
              "whatNotToDo": {
                "lie": {
                  "title": "不要撒谎或提供虚假文件：",
                  "text": "这可能在移民法庭上被用来对你不利。"
                },
                "run": {
                  "title": "不要逃跑或反抗：",
                  "text": "这可能导致额外的刑事指控。"
                },
                "sign": {
                  "title": "不要签署任何文件：",
                  "text": "在理解文件内容或与律师交谈之前不要签字。"
                },
                "carryDocuments": {
                  "title": "不要携带外国证件：",
                  "text": "除非法律要求（如驾驶执照）。"
                }
              }
            },            "deportationPhases": {
              "title": "驱逐出境流程阶段",
              "subtitle": "了解移民执法程序的每个阶段",
              "phase1": {
                "title": "第一阶段：初次遇到 ICE",
                "rightsTitle": "您的权利：",
                "rights": {
                  "askLeave": "询问您是否可以自由离开",
                  "warrant": "在允许进入您的住所之前，要求查看搜查令",
                  "silent": "对您的移民身份保持沉默",
                  "attorney": "立即要求律师"
                },
                "expectTitle": "可能会发生什么：",
                "expect": {
                  "approach": "ICE 探员可能会在您家、工作地点或公共场所接近您",
                  "documents": "他们可能会要求您出示身份证件和移民文件",
                  "adminWarrant": "行政令 ≠ 司法令",
                  "detention": "如果他们认为您可以被驱逐，您可能会被拘留"
                }
              },
              "phase2": {
                "title": "第二阶段：移民拘留",
                "rightsTitle": "您在拘留中的权利：",
                "rights": {
                  "phone": "有权打电话给家人和律师",
                  "consulate": "有权联系您的领事馆（非公民）",
                  "interpreter": "在程序中有权获得翻译",
                  "charges": "有权被告知对您的指控",
                  "bond": "有权要求保释金听证会（大多数情况下）"
                },
                "importantTitle": "重要须知：",
                "important": {
                  "duration": "拘留可能持续数周、数月或更长时间",
                  "nta": "您将收到出庭通知 (NTA)",
                  "mandatory": "某些人必须被强制拘留",
                  "bondAmount": "保释金金额差异很大（$1,500 - $25,000+）",
                  "criminal": "某些刑事定罪会影响保释金资格"
                }
              },
              "phase3": {
                "title": "第三阶段：移民法庭诉讼",
                "rightsTitle": "法庭权利：",
                "rights": {
                  "attorney": "有权聘请律师（自费）",
                  "interpreter": "有权获得翻译",
                  "examine": "有权查看对您不利的证据",
                  "present": "有权提出证据和证人",
                  "appeal": "有权对不利裁决提出上诉"
                },
                "outcomesTitle": "可能的结果：",
                "outcomes": {
                  "relief": "免除驱逐：庇护、取消驱逐、身份调整",
                  "voluntary": "自愿离境：自费离开美国",
                  "removal": "驱逐令：强制驱逐出境",
                  "continuances": "延期：案件因各种原因被推迟",
                  "closure": "行政关闭：案件暂时关闭"
                }
              },
              "phase4": {
                "title": "第四阶段：上诉和最终驱逐",
                "rightsTitle": "上诉权利：",
                "rights": {
                  "deadline": "必须在30天内向移民上诉委员会 (BIA) 提交上诉",
                  "federal": "BIA 裁决后可能进行联邦法院审查",
                  "stay": "上诉期间暂停驱逐（如已申请）",
                  "motions": "在特定情况下可以提出重新审理/重新考虑的动议"
                },
                "processTitle": "最终驱逐流程：",
                "process": {
                  "schedule": "最终命令下达后，ICE 安排驱逐日期",
                  "period": "90天驱逐期（可延长）",
                  "refusal": "某些国家可能拒绝接收被遣返者",
                  "supervision": "部分人可能在监管下被释放",
                  "bar": "未来可能被禁止入境美国数年"
                }
              }
            },
            "specialProtections": {
              "title": "特殊保护",
              "subtitle": "针对弱势群体的额外权利和保护",
              "usCitizens": {
                "title": "美国公民",
                "items": {
                  "noDeportation": "不能被驱逐出境（宪法保护）",
                  "detained": "如果身份受到质疑，可能会被拘留",
                  "proof": "应随身携带公民身份证明",
                  "contact": "如被拘留，立即联系家人/律师",
                  "complaints": "如果权利受到侵犯，可以投诉"
                }
              },
              "vulnerable": {
                "title": "弱势群体",
                "pregnant": "孕妇：特殊羁押裁定",
                "nursing": "哺乳期母亲：扩展的家庭拘留替代方案",
                "minors": "未成年人：特殊程序和保护",
                "mentallyIll": "精神疾病患者：需要进行行为能力评估",
                "trafficking": "人口贩卖受害者：特殊签证保护"
              },
              "sanctuary": {
                "title": "庇护管辖区",
                "items": {
                  "policies": "限制与 ICE 合作的地方政策",
                  "notice": "ICE 行动的提前通知（某些地区）",
                  "know": "了解您所在地区的政策",
                  "canOperate": "ICE 仍然可以在庇护区域内执法",
                  "contact": "联系当地移民权利组织"
                }
              }
            },
            "resources": {
              "title": "紧急资源和联系方式",
              "subtitle": "移民紧急情况的重要电话号码和资源",
              "hotlines": {
                "title": "全国热线",
                "nif": {
                  "name": "National Immigration Forum",
                  "number": "1-800-954-6287",
                  "description": "24/7 驱逐防御热线"
                },
                "aclu": {
                  "name": "ACLU",
                  "number": "Text \"IMMIGRANT\" to 88823",
                  "description": "了解您的权利信息"
                },
                "doj": {
                  "name": "DOJ Executive Office for Immigration Review",
                  "number": "1-800-898-7180",
                  "description": "律师名单和听证会信息"
                }
              },
              "locators": {
                "title": "查找服务",
                "iceDetainee": {
                  "name": "ICE 被拘留者查找",
                  "url": "ice.gov/detain/ice-ero/locate-detainee",
                  "description": "查找被 ICE 拘留的人员"
                },
                "legalServices": {
                  "name": "Immigration Advocates Network",
                  "url": "immigrationadvocates.org/nonprofit/legaldirectory",
                  "description": "查找免费和低费用的移民法律服务"
                },
                "consulate": {
                  "name": "领事馆查找",
                  "url": "state.gov/foreign-embassies",
                  "description": "查找您所在国家在美国的领事馆"
                }
              },
              "prepareTitle": "提前准备",
              "prepare": {
                "plan": "制定家庭紧急计划",
                "documents": "将重要文件存放在安全的地方",
                "attorney": "记住移民律师的联系方式",
                "redCard": "随身携带写有您权利的移民\"红卡\"",
                "trustee": "指定一位信任的人来做儿童照顾决定"
              }
            },
            "finalCta": {
              "title": "获取更多帮助",
              "rights": "了解您的基本权利",
              "local": "查找当地资源"
            },
            "hub": {
              "detailedGuides": {
                "title": "详细指南",
                "subtitle": "关于特定移民主题的深入信息",
                "dacaCard": {
                  "title": "DACA 和 TPS 信息",
                  "description": "资格要求、续期截止日期以及身份失效后怎么办"
                },
                "raidsCard": {
                  "title": "工作场所搜查",
                  "description": "ICE 执法期间您的权利，以及雇主必须做什么"
                },
                "familyCard": {
                  "title": "混合身份家庭规划",
                  "description": "紧急计划、看护人授权、文件准备"
                },
                "bondCard": {
                  "title": "保释金听证会",
                  "description": "资格、听证流程以及被拒后怎么办"
                },
                "attorneyCard": {
                  "title": "寻找和验证律师",
                  "description": "避免欺诈、验证资质、寻找免费法律帮助"
                },
                "findDetainedCard": {
                  "title": "查找被拘留者",
                  "description": "使用 ICE 被拘留者查找工具，了解 A-Number、保释金信息和设施联系方式"
                },
                "kyrCard": {
                  "title": "了解您的权利资料",
                  "description": "可打印的红卡、ICE 遭遇应对脚本、搜查令识别指南"
                },
                "raidsToolkitCard": {
                  "title": "社区搜查应对工具包",
                  "description": "安全检查清单、紧急联系卡、针对不同情况的应对指南"
                }
              },
              "backButton": "返回移民中心"
            },
            "daca": {
              "badge": "移民保护",
              "title": "DACA 和 TPS 信息",
              "subtitle": "了解童年入境暂缓遣返 (DACA) 和临时保护身份 (TPS) 计划、资格要求和续期流程。",
              "disclaimer": "移民法经常变化。在采取行动之前，请务必在 USCIS.gov 或向移民律师确认当前要求。",
              "dacaSection": {
                "title": "DACA（童年入境暂缓遣返）",
                "whatIs": "什么是 DACA？",
                "whatIsText": "DACA 为儿童时期来到美国的个人提供临时免驱逐保护和工作许可。它不提供入籍或合法永久居留的途径。",
                "eligibility": "基本资格要求",
                "req1": "截至2012年6月15日未满31岁",
                "req2": "16岁之前来到美国",
                "req3": "自2007年6月15日以来持续居住在美国",
                "req4": "2012年6月15日在美国境内",
                "req5": "目前在校、已毕业或拥有 GED",
                "req6": "无重罪、重大轻罪或3次以上轻罪",
                "renewal": "续期时间表",
                "renewalText": "在当前 DACA 到期前120-150天提交续期申请。处理通常需要3-6个月。"
              },
              "tpsSection": {
                "title": "TPS（临时保护身份）",
                "whatIs": "什么是 TPS？",
                "whatIsText": "TPS 授予正在经历持续武装冲突、环境灾害或其他特殊情况的指定国家的公民。它提供临时合法身份和工作许可。",
                "countries": "当前指定国家",
                "countriesNote": "*名单可能会变化。请在 USCIS.gov 确认最新指定国家",
                "benefits": "TPS 福利",
                "benefit1": "TPS 有效期内免受驱逐",
                "benefit2": "就业授权文件 (EAD)",
                "benefit3": "可以申请旅行授权",
                "reregistration": "重新注册",
                "reregistrationText": "TPS 持有者必须在 USCIS 公布的每个重新注册期间进行重新注册。错过截止日期可能导致身份丧失。"
              },
              "statusLapse": {
                "title": "如果您的身份失效了怎么办？",
                "dontPanic": "不要慌张",
                "dontPanicText": "身份失效并不意味着会立即被驱逐。请立即咨询移民律师，了解您的选择。",
                "gatherDocs": "收集文件",
                "gatherDocsText": "收集您所有的移民文件、持续居留证明以及 USCIS 的任何通信。这些对于任何补救措施都至关重要。",
                "seekHelp": "寻求法律帮助",
                "seekHelpText": "联系经认证的代表或移民律师。许多组织为 DACA/TPS 持有者提供免费或低费用咨询。"
              },
              "resources": "官方资源"
            },
            "raids": {
              "badge": "工作场所权利",
              "title": "工作场所搜查和您的权利",
              "subtitle": "了解 ICE 工作场所执法行动期间您的权利。了解执法人员能做什么和不能做什么有助于保护您。",
              "criticalAlert": "如果 ICE 现在在您的工作场所：",
              "criticalAlertText": "保持冷静。您有权利。不要逃跑。不要提供虚假文件。",
              "yourRights": {
                "title": "工作场所搜查期间您的权利",
                "silent": "沉默权",
                "silentText": "您不必回答关于您出生地、移民身份或如何进入美国的问题。",
                "refuse": "拒绝同意的权利",
                "refuseText": "除了就业验证所需的文件外，您可以拒绝出示其他文件。",
                "attorney": "律师权",
                "attorneyText": "在回答任何问题之前，您可以要求与律师交谈。",
                "basis": "知情权",
                "basisText": "如果被拘留，您可以询问原因并要求查看逮捕令或相关文件。"
              },
              "whatNotToDo": {
                "title": "不应该做什么",
                "run": "不要逃跑或躲藏",
                "runText": "逃跑可能被用来对您不利，并可能导致额外的指控。",
                "falseDocs": "不要提供虚假文件",
                "falseDocsText": "使用假文件是联邦犯罪，可能导致监禁并阻碍未来的移民救济。",
                "lie": "不要谎报身份",
                "lieText": "向联邦执法人员提供虚假信息是犯罪。保持沉默更好。",
                "sign": "不要签署您不理解的文件",
                "signText": "某些表格可能是自愿离境协议。要求有时间咨询律师。"
              },
              "employer": {
                "title": "雇主的义务",
                "mustProvide": "雇主必须提供的",
                "must1": "只有持有司法令（非行政令）才能进入非公共区域",
                "must2": "给员工合理时间咨询律师（如有）",
                "must3": "如被要求审计，在3天通知期（72小时）内提供 I-9 表格",
                "canDo": "雇主可以做的",
                "can1": "要求查看搜查令并确认其由法官签署",
                "can2": "在允许进入非公共区域之前联系自己的律师",
                "can3": "记录搜查过程（执法人员姓名、警徽号码、采取的行动）",
                "can4": "在工作场所张贴\"了解您的权利\"信息"
              },
              "afterRaid": {
                "title": "工作场所搜查之后",
                "detained": "如果您被拘留",
                "detained1": "记住或写下您的 A-Number",
                "detained2": "联系家人告知您的位置",
                "detained3": "要求打电话 - 这是您的权利",
                "detained4": "不理解的文件不要签字",
                "detained5": "如果符合条件，要求保释金听证会",
                "notDetained": "如果您没有被拘留",
                "notDetained1": "记录您所目击的一切",
                "notDetained2": "记下警徽号码和执法人员姓名",
                "notDetained3": "咨询移民律师",
                "notDetained4": "向社区组织报告民权侵犯行为",
                "notDetained5": "制定家庭紧急计划"
              },
              "emergency": {
                "title": "紧急联系方式",
                "subtitle": "将这些号码保存在您的手机中",
                "nilc": "National Immigration Law Center",
                "aclu": "ACLU Immigrants' Rights"
              }
            },
            "family": {
              "badge": "家庭保护",
              "title": "混合身份家庭规划",
              "subtitle": "通过提前规划来保护您的家人。制定紧急计划、指定看护人并整理重要文件。",
              "planningAlert": "提前规划保护您的家人。",
              "planningAlertText": "即使什么都没有发生，有一个计划也能减轻压力，确保您的孩子得到照顾。",
              "documents": {
                "title": "需要准备的重要文件",
                "poa": {
                  "title": "委托书",
                  "description": "如果您被拘留，指定某人代您做出法律和财务决定。",
                  "item1": "用于财务事项的一般委托书",
                  "item2": "持久委托书（在丧失行为能力后仍然有效）",
                  "item3": "必须经过公证才有效"
                },
                "caregiver": {
                  "title": "看护人授权书",
                  "description": "允许信任的人照顾您的孩子并做出日常决定。",
                  "item1": "授权入学登记",
                  "item2": "允许同意医疗治疗",
                  "item3": "临时性的（通常6-12个月）"
                },
                "guardianship": {
                  "title": "监护人提名",
                  "description": "如果您无法长期照顾孩子，指定您希望的监护人。",
                  "item1": "法院会考虑但不一定遵循",
                  "item2": "也要指定备选监护人",
                  "item3": "应经过公证"
                }
              },
              "emergencyPlan": {
                "title": "制定家庭紧急计划",
                "communication": {
                  "title": "通讯计划",
                  "step1": "记住重要电话号码",
                  "step1Text": "让孩子记住一位信任的成年人的电话号码，以防你们分开。",
                  "step2": "建立联系人名单",
                  "step2Text": "列出3-5位可以在紧急情况下联系的信任的人。将此名单分享给孩子的学校。",
                  "step3": "暗号",
                  "step3Text": "制定一个家庭暗号，信任的成年人在接孩子时使用。"
                },
                "documentPrep": {
                  "title": "文件准备",
                  "step1": "收集出生证明",
                  "step1Text": "备份所有家庭成员的出生证明，包括美国公民子女的。",
                  "step2": "护照信息",
                  "step2Text": "将所有护照（母国和美国（如适用））的副本保存在安全的地方。",
                  "step3": "移民记录",
                  "step3Text": "保存所有移民文件的副本，包括被拘留家庭成员的 A-Number。"
                }
              },
              "financial": {
                "title": "财务和实际考虑事项",
                "bank": "银行账户",
                "bankText": "将信任的人添加到您的银行账户，或开设联名账户，以便您被拘留时可以支付账单。",
                "property": "房屋使用",
                "propertyText": "将备用钥匙留给信任的邻居或朋友。记录家中重要物品的位置。",
                "medical": "医疗信息",
                "medicalText": "将孩子的药物、过敏情况和医生联系方式清单与看护人授权书放在一起。"
              },
              "freeHelp": "可获得的免费帮助：",
              "freeHelpText": "许多移民援助组织提供免费的家庭紧急规划帮助。请联系您当地的法律援助组织或移民权利团体，获取帮助来准备这些文件。"
            },
            "bond": {
              "badge": "拘留与释放",
              "title": "移民保释金听证会",
              "subtitle": "了解保释金流程、资格要求以及如何为移民法庭的保释金听证会做准备。",
              "importantAlert": "并非所有人都有资格获得保释金。某些人必须被强制拘留。移民律师可以帮助确定资格。",
              "whatIsBond": {
                "title": "什么是移民保释金？",
                "delivery": {
                  "title": "交付保释金",
                  "description": "允许在移民案件审理期间从拘留中释放。当事人必须出席所有听证会。",
                  "amount": "典型金额：",
                  "amountValue": "$1,500 - $25,000+",
                  "setter": "由谁设定：",
                  "setterValue": "ICE 或移民法官"
                },
                "voluntary": {
                  "title": "自愿离境保释金",
                  "description": "允许某人自费自愿离开美国。如果在截止日期前离境，保释金将退还。",
                  "amount": "典型金额：",
                  "amountValue": "$500 - $5,000",
                  "benefit": "好处：",
                  "benefitValue": "避免被驱逐令"
                }
              },
              "eligibility": {
                "title": "保释金资格",
                "mayBeEligible": "可能有资格",
                "eligible1": "没有严重犯罪记录的人",
                "eligible2": "不被视为逃跑风险的人",
                "eligible3": "与社区有紧密联系的人",
                "eligible4": "有美国公民家庭成员的人",
                "eligible5": "有稳定就业历史的人",
                "mandatoryDetention": "强制拘留（不可保释）",
                "mandatory1": "严重重罪定罪",
                "mandatory2": "某些毒品犯罪",
                "mandatory3": "枪支犯罪",
                "mandatory4": "与恐怖主义相关的指控",
                "mandatory5": "先前的驱逐令（在某些情况下）"
              },
              "process": {
                "title": "保释金听证会流程",
                "step1": "申请保释金听证会",
                "step1Text": "您或您的律师必须向移民法官申请保释金听证会。ICE 也可能设定初始保释金金额，该金额可以被质疑。",
                "step2": "收集证据",
                "step2Text": "准备证明社区联系的文件：家人的信、就业证明、租约、水电费账单、税单和品格证明信。",
                "step3": "出席听证会",
                "step3Text": "法官将考虑您是否有逃跑风险或对社区构成威胁。有律师代理会显著改善结果。",
                "step4": "支付保释金",
                "step4Text": "如果获批，保释金必须通过 ICE（而非法庭）支付。家人或朋友可以代您支付。一些组织提供保释金基金。"
              },
              "denied": {
                "title": "如果保释金被拒",
                "options": "您还有其他选择",
                "option1": "向移民上诉委员会 (BIA) 提出上诉",
                "option2": "如果情况发生变化，申请重新考虑",
                "option3": "向联邦法院提交人身保护令申请",
                "timeline": "时间线",
                "time1": "BIA 上诉必须在30天内提交",
                "time2": "BIA 裁决可能需要数月",
                "time3": "请立即咨询律师"
              },
              "resources": {
                "title": "保释金基金资源",
                "subtitle": "付不起保释金？这些组织也许可以帮助您：",
                "bailFund": "National Bail Fund Network",
                "bailFundText": "帮助家庭支付移民保释金的地方保释金基金目录。",
                "raices": "RAICES Bond Fund",
                "raicesText": "为在德克萨斯州及其他地区被拘留的移民提供保释金援助。"
              }
            },
            "attorney": {
              "badge": "法律代理",
              "title": "寻找和验证移民律师",
              "subtitle": "如何找到合法的移民法律帮助并保护自己免受欺诈。",
              "scamWarning": "小心 Notario 欺诈！",
              "scamWarningText": "在美国，\"notarios\" 没有资格提供法律建议。只有持牌律师和 DOJ 认证的代表才能在移民法庭代表您。",
              "whoCanHelp": {
                "title": "谁可以合法帮助处理移民案件？",
                "attorneys": {
                  "title": "持牌律师",
                  "description": "获得任何美国州律师执照的律师都可以在移民事务中代表您，即使他们是在另一个州获得执照的。",
                  "item1": "可以在法庭上代表您",
                  "item2": "可以向 USCIS 提交申请",
                  "item3": "受职业道德规则和纪律约束"
                },
                "accredited": {
                  "title": "DOJ 认证代表",
                  "description": "经过培训并获得司法部授权代表移民的非律师。他们在认可的组织中工作。",
                  "item1": "通常提供免费或低费用服务",
                  "item2": "可以在移民法庭代表您",
                  "item3": "在非营利组织工作"
                }
              },
              "verify": {
                "title": "如何验证移民律师",
                "stateBar": {
                  "title": "查询州律师协会",
                  "description": "每个州都有律师协会网站，您可以在那里验证律师是否持有执照且信誉良好。",
                  "link": "ABA Bar Directory"
                },
                "eoir": {
                  "title": "EOIR 认可名单",
                  "description": "DOJ 维护着一份获授权提供移民服务的认可组织和认证代表名单。",
                  "link": "EOIR Roster"
                },
                "aila": {
                  "title": "AILA 律师搜索",
                  "description": "美国移民律师协会 (AILA) 有一个专门从事移民法的会员律师目录。",
                  "link": "AILA Lawyer Search"
                }
              },
              "redFlags": {
                "title": "危险信号：移民欺诈的迹象",
                "warnings": {
                  "title": "警告信号",
                  "item1": "保证特定结果或批准",
                  "item2": "声称与 USCIS 或法官有特殊关系",
                  "item3": "要求您签署空白表格",
                  "item4": "不提供书面合同",
                  "item5": "鼓励您在申请中撒谎",
                  "item6": "扣留您的原始文件",
                  "item7": "使用 \"notario\" 或 \"移民顾问\" 的头衔"
                },
                "legitimate": {
                  "title": "合法律师的特征",
                  "item1": "提供书面收费协议",
                  "item2": "诚实地解释风险和可能的结果",
                  "item3": "给您所有提交文件的副本",
                  "item4": "归还您的原始文件",
                  "item5": "回复您的问题和电话",
                  "item6": "可以通过州律师协会或 EOIR 验证",
                  "item7": "让您自己审查和签署表格"
                }
              },
              "freeHelp": {
                "title": "免费和低费用法律帮助",
                "organizations": "法律援助组织",
                "org1": "Catholic Charities 移民服务",
                "org2": "CLINIC (Catholic Legal Immigration Network)",
                "org3": "当地法律援助协会",
                "org4": "法学院移民诊所",
                "findingHelp": "寻找帮助",
                "find1": "搜索 ImmigrationAdvocates.org",
                "find2": "联系您当地的律师协会",
                "find3": "咨询社区组织"
              },
              "reportFraud": {
                "title": "举报移民欺诈",
                "subtitle": "如果您是移民欺诈的受害者，请举报：",
                "ftc": "FTC Complaint",
                "eoir": "EOIR Complaint"
              }
            }
          },
          "courtRecords": {
            "hero": {
              "title": "法庭记录搜索",
              "subtitle": "从 RECAP Archive 和判例法数据库中搜索免费的法庭记录"
            },
            "freeFirstAlert": {
              "title": "免费优先政策：",
              "text1": "我们首先搜索免费的 RECAP Archive。如果文件无法免费获取，我们会告诉您在 PACER（收费）上哪里可以找到。安装",
              "linkText": "RECAP 浏览器扩展",
              "text2": "可以将您的 PACER 购买内容自动保存到免费档案中。"
            },
            "searchParams": {
              "title": "搜索条件",
              "description": "请至少输入一个搜索条件",
              "searchTerm": "搜索词",
              "searchTermPlaceholder": "关键词、当事人名称...",
              "caseName": "案件名称",
              "caseNamePlaceholder": "Smith v. Jones",
              "docketNumber": "案卷编号",
              "docketNumberPlaceholder": "1:20-cv-12345",
              "searchButton": "搜索法庭记录"
            },
            "results": {
              "title": "搜索结果",
              "totalResults": "{{count}} 条结果",
              "noResults": "未找到结果",
              "searchFailed": "搜索失败。请重试或调整搜索条件。",
              "recapSection": "RECAP Archive - 联邦法庭文件 ({{count}})",
              "opinionsSection": "判例法意见 ({{count}})",
              "filed": "提交日期：{{date}}",
              "decided": "裁决日期：{{date}}",
              "free": "免费",
              "viewOnPacer": "在 PACER 上查看",
              "viewOpinion": "查看意见书",
              "downloadFree": "免费下载 PDF",
              "natureOfSuit": "诉讼性质：",
              "assignedTo": "指派给：",
              "referredTo": "转交给：",
              "dateTerminated": "结案日期：",
              "citedBy": "被 {{count}} 个案件引用",
              "citations": "引用：",
              "status": "状态：",
              "precedentialStatus": "法院判决类型："
            },
            "partialFailure": {
              "title": "部分搜索失败：",
              "text": "某些搜索服务暂时不可用。",
              "recapFailed": "RECAP 案卷搜索失败。",
              "opinionsFailed": "判例法意见搜索失败。",
              "incomplete": "显示的结果可能不完整。"
            }
          },
          "legalGlossary": {
            "hero": {
              "title": "法律术语表",
              "subtitle": "了解法律术语和概念，帮助您理解刑事司法系统"
            },
            "navigation": {
              "backToHome": "返回首页",
              "termsCount": "{{total}} 个术语中的第 {{count}} 个"
            },
            "search": {
              "placeholder": "搜索法律术语、定义或关键词...",
              "browseByLetter": "按字母浏览：",
              "filterByCategory": "按类别筛选：",
              "clearFilters": "清除所有筛选"
            },
            "terms": {
              "title": "法律术语和定义",
              "relatedTerms": "相关术语：",
              "commonUsage": "常见用法：",
              "examples": "示例：",
              "legalContext": "法律语境：",
              "aliases": "又称：",
              "categories": "类别："
            }
          },
          "process": {
            "hero": {
              "title": "刑事司法流程时间线",
              "subtitle": "逮捕、首次出庭、审判和量刑的详细步骤指南"
            },
            "crossLinks": {
              "timeline": "互动指南 — 选择您的阶段查看权利和建议",
              "quickRef": "可打印的卡片，列出每个阶段的权利"
            },
            "alert": {
              "important": "重要提示：",
              "text": "具体的时间和步骤在每个州和不同案件中可能有所不同。请务必咨询真正的律师来获取针对您具体情况的帮助。"
            },
            "steps": {
              "yourRights": "您在此阶段的权利：",
              "whatToExpect": "需要了解的内容：",
              "step1": {
                "title": "逮捕",
                "description": "执法人员根据合理理由或逮捕令将您拘留。",
                "timeframe": "即时",
                "rights": [
                  "沉默权",
                  "律师权",
                  "打电话的权利",
                  "被告知指控的权利"
                ]
              },
              "step2": {
                "title": "登记入册",
                "description": "在警察局进行处理，包括指纹采集、拍照和个人信息登记。",
                "timeframe": "1-3小时",
                "rights": [
                  "有需要时获得医疗救助的权利",
                  "联系律师或家人的权利",
                  "获得人道对待的权利"
                ]
              },
              "step3": {
                "title": "首次出庭",
                "description": "第一次出庭，正式宣读指控并由您做出答辩。",
                "timeframe": "24-72小时",
                "rights": [
                  "被告知指控的权利",
                  "律师在场的权利",
                  "要求公设辩护人的权利",
                  "获得合理保释的权利"
                ]
              },
              "step4": {
                "title": "初步听证",
                "description": "法庭确定是否有合理理由认为您犯了罪。",
                "timeframe": "1-2周",
                "rights": [
                  "质疑证据的权利",
                  "盘问证人的权利",
                  "律师代理的权利"
                ]
              },
              "step5": {
                "title": "证据开示",
                "description": "双方交换证据、证人名单和其他案件信息。",
                "timeframe": "数周到数月",
                "rights": [
                  "查看控方证据的权利",
                  "提出辩护证据的权利",
                  "聘请专家证人的权利"
                ]
              },
              "step6": {
                "title": "审判",
                "description": "在法官或陪审团面前正式出示证据，以确定有罪或无罪。",
                "timeframe": "视情况而定",
                "rights": [
                  "陪审团审判的权利",
                  "与证人对质的权利",
                  "沉默权",
                  "提出辩护的权利"
                ]
              },
              "step7": {
                "title": "量刑",
                "description": "如果被定罪，法庭决定适当的处罚。",
                "timeframe": "审判后2-6周",
                "rights": [
                  "在量刑时发言的权利",
                  "上诉权",
                  "获得公正和适当处罚的权利"
                ]
              }
            },
            "additionalInfo": {
              "title": "重要说明",
              "pleaBargains": {
                "title": "认罪协议",
                "text": "大多数刑事案件（约90-95%）通过认罪协议而非审判来解决。这通常发生在证据开示阶段，检察官和辩护律师就减少指控或量刑进行谈判，以换取认罪。"
              },
              "speedyTrial": {
                "title": "快速审判权",
                "text": "法律保障您获得快速审判的权利。联邦案件通常必须在被起诉或首次出庭后70天内开庭。各州规定不同，通常为60到180天。"
              },
              "publicDefender": {
                "title": "获得公设辩护人",
                "text": "如果您请不起律师，您有合法权利获得一位。公设辩护人在您第一次出庭时被指派。您可能需要填写一份表格来证明您无力负担律师费。"
              },
              "bondBail": {
                "title": "保释金",
                "text": "保释金是向法院支付的金额，以确保您会回来出庭。如果您付不起保释金，您可能需要留在拘留所或申请保释听证会。一些司法管辖区为低风险被告提供具结释放（ROR）。"
              }
            },
            "guides": {
              "title": "了解关键法律程序",
              "subtitle": "了解您在案件中可能面临的重要决定。点击每个部分展开了解更多。",
              "bail": {
                "title": "现金保释",
                "intro": "保释金是法院持有的金额，用来确保您会回来出庭。以下是作为被告您需要知道的信息。",
                "whatIs": {
                  "title": "什么是保释金？",
                  "description": "保释金是在等待案件结案期间从监狱释放的一种方式。您支付金额（或由他人代付），法院持有该金额直到案件结束。",
                  "points": [
                    "保释金不是罚款或处罚 - 它就像一笔押金",
                    "如果您每次出庭都到场，您可以拿回这笔钱（扣除手续费）",
                    "目的是确保您在审判前不会逃跑"
                  ]
                },
                "howSet": {
                  "title": "保释金金额如何确定",
                  "description": "法官根据以下几个因素决定您的保释金金额：",
                  "factors": [
                    "指控的严重程度",
                    "您的犯罪记录（如有）",
                    "您是否与社区有紧密联系（工作、家庭、住所）",
                    "您是否被视为逃跑风险",
                    "您的支付能力",
                    "公共安全考虑"
                  ]
                },
                "options": {
                  "title": "您的保释选项",
                  "types": [
                    {
                      "name": "现金保释",
                      "description": "您向法院支付全部保释金额。案件结束后如果您每次都到庭，您可以拿回全部金额。"
                    },
                    {
                      "name": "保释担保（通过保释担保人）",
                      "description": "您向保释担保人支付保释金额的约10-15%。他们支付全部保释金。您的付款不退还 - 那是他们的费用。"
                    },
                    {
                      "name": "财产保释",
                      "description": "您用财产（如房屋）作为抵押代替现金。如果您不出庭，法院可以没收该财产。"
                    },
                    {
                      "name": "具结释放 (ROR)",
                      "description": "仅凭承诺回来出庭就可被释放 - 无需支付金额。这适用于低风险且与社区有紧密联系的被告。"
                    }
                  ]
                },
                "cantAfford": {
                  "title": "如果付不起保释金怎么办？",
                  "description": "不要失去希望。您可以采取以下步骤：",
                  "options": [
                    "让您的律师申请降低保释金的听证会",
                    "收集社区联系的证据（工作证明信、家庭支持、租约）",
                    "了解保释金基金 - 帮助支付保释金的非营利组织",
                    "询问家人或朋友是否可以帮助支付保释担保",
                    "在某些地区，有审前服务项目作为替代方案"
                  ]
                },
                "conditions": {
                  "title": "释放条件",
                  "description": "即使您缴纳了保释金，法官也可能设定您在外期间必须遵守的规则：",
                  "examples": [
                    "定期向审前官员报到",
                    "留在本地区（未经许可不得外出）",
                    "避免与某些人接触（如证人或受害者）",
                    "禁止饮酒或吸毒，可能需要接受检测",
                    "佩戴电子脚镣",
                    "保持或找到工作",
                    "遵守宵禁"
                  ]
                },
                "missCourt": {
                  "title": "如果您错过出庭会怎样？",
                  "description": "缺席出庭是很严重的事。以下是可能发生的后果：",
                  "consequences": [
                    "法院将发出逮捕令",
                    "您将失去保释金（或保释担保人会来找您）",
                    "您可能面临因未到庭而被追加的刑事指控",
                    "再次获得保释会变得更加困难",
                    "法官在审理您的案件时可能认为您不可信赖"
                  ]
                }
              },
              "plea": {
                "title": "认罪协议",
                "intro": "大约90-95%的刑事案件通过认罪协议解决。了解这个过程有助于您做出明智的决定。",
                "whatIs": {
                  "title": "什么是认罪协议？",
                  "description": "认罪协议是您（被告）和检察官之间的协议。您同意对某项指控认罪，作为交换，您可以获得一些好处 - 通常是较轻的判决或更少的指控。",
                  "points": [
                    "这是一种谈判 - 您的律师代表您进行协商",
                    "法官必须批准这个协议",
                    "接受后，您就放弃了审判的权利",
                    "一旦接受，很难撤回"
                  ]
                },
                "types": {
                  "title": "认罪协议的类型",
                  "deals": [
                    {
                      "name": "指控协商",
                      "description": "您对较轻的指控认罪。例如，重罪可能被降为轻罪。"
                    },
                    {
                      "name": "刑期协商",
                      "description": "您对原始指控认罪，但检察官向法官建议较轻的判决。"
                    },
                    {
                      "name": "罪名数量协商",
                      "description": "如果您面临多项指控，部分指控会被撤销以换取您对其他指控认罪。"
                    },
                    {
                      "name": "事实协商",
                      "description": "某些事实从案件中省略，这可能影响量刑（较不常见）。"
                    }
                  ]
                },
                "rights": {
                  "title": "认罪谈判中的权利",
                  "description": "请记住，您在这个过程中有重要的权利：",
                  "list": [
                    "您始终可以拒绝任何认罪协议 - 没人能强迫您接受",
                    "您有权选择去审判",
                    "在认罪之前必须被告知移民后果（如适用）",
                    "您可以要求时间来考虑提议",
                    "做决定之前应该咨询律师"
                  ]
                },
                "questions": {
                  "title": "接受前应该问的问题",
                  "description": "在同意任何认罪协议之前，确保您理解：",
                  "list": [
                    "我到底要对什么认罪？",
                    "我可能面临的最高刑罚是什么？",
                    "检察官建议的刑期是什么？",
                    "法官是否必须遵循这个建议？",
                    "我会有犯罪记录吗？能否被消除？",
                    "这会如何影响我的移民身份（如适用）？",
                    "我还能拥有枪支吗？",
                    "我是否需要登记为性犯罪者（如适用）？",
                    "如果我违反缓刑会怎样？"
                  ]
                },
                "collateral": {
                  "title": "附带后果",
                  "description": "认罪可能会在判决之外影响您的生活。这些被称为「附带后果」：",
                  "consequences": [
                    "移民：可能导致驱逐、拒绝入籍或签证问题",
                    "就业：某些工作需要背景调查；某些职业可能不允许从事",
                    "住房：公共住房和某些房东可能拒绝您",
                    "教育：可能影响助学金或学校录取",
                    "投票权：在某些州，重罪犯失去投票权",
                    "枪支权利：重罪和某些轻罪会阻止拥有枪支",
                    "专业执照：某些定罪会阻止成为护士、教师等",
                    "子女监护权：可能在家事法庭裁决中被考虑"
                  ]
                },
                "decide": {
                  "title": "接受协议还是去审判？",
                  "description": "这是您案件中最重要的决定之一。以下是需要考虑的因素：",
                  "acceptTitle": "考虑接受如果：",
                  "acceptReasons": [
                    "对您不利的证据很强",
                    "该协议大幅减少了您可能面临的刑罚",
                    "去审判可能导致更严重的后果",
                    "该协议让您避免某些有严重附带后果的指控",
                    "您的律师强烈建议接受"
                  ],
                  "trialTitle": "考虑去审判如果：",
                  "trialReasons": [
                    "您确实是无辜的",
                    "对您不利的证据很弱",
                    "您的宪法权利被侵犯了（非法搜查、被迫供述）",
                    "认罪协议并不比审判结果好多少",
                    "您愿意为争取无罪的机会承担风险"
                  ]
                }
              }
            },
            "legalDisclaimer": {
              "title": "法律免责声明：",
              "text": "本信息仅供教育目的，不构成法律建议。各州和联邦管辖区的法律和程序各有不同。请务必咨询合格的律师以获取针对您具体情况的建议。"
            }
          },
          "caseTimeline": {
            "title": "案件时间线",
            "subtitle": "从头到尾跟踪刑事案件的各个阶段。选择您当前的阶段，了解会发生什么以及您的权利。",
            "selectStage": "选择一个阶段，了解会发生什么以及您有什么权利",
            "yourRights": "您的权利",
            "whatToKnow": "须知事项",
            "viewQuickRef": "速查卡片",
            "disclaimer": {
              "title": "重要提示：",
              "text": "每个案件都不一样。这里展示的阶段是典型刑事案件的一般指南。您的案件可能有更多或更少的步骤。请务必就您的具体情况咨询您的律师。"
            },
            "stages": {
              "arrest": {
                "title": "逮捕",
                "timeframe": "几分钟到几小时",
                "description": "逮捕是指警方将您拘留。您可能会被戴上手铐并带到警察局。这可以在有或没有逮捕令的情况下发生。警察必须有合理理由相信您犯了罪。",
                "rights": [
                  "您有权保持沉默",
                  "您有权聘请律师",
                  "您不必同意搜查",
                  "您有权知道为什么被逮捕"
                ],
                "tips": [
                  "保持冷静，不要反抗，即使您觉得逮捕不公平",
                  "明确说出：'我行使我的沉默权'",
                  "说：'我要找律师'——然后停止说话",
                  "记住警察的警徽号码和巡逻车号码",
                  "没有律师在场，不要签署任何文件"
                ]
              },
              "booking": {
                "title": "入案登记",
                "timeframe": "1-4小时",
                "description": "逮捕后，您会被带到看守所或警察局进行入案登记。这是记录您信息的行政程序。您的个人物品会被收走保管。",
                "rights": [
                  "您仍然有权保持沉默",
                  "您有权打电话（通常在几小时内）",
                  "如果需要，您可以要求医疗救治",
                  "您被释放时，您的物品必须归还给您"
                ],
                "tips": [
                  "您会被按指纹和拍照",
                  "利用您的电话机会联系律师或家人",
                  "不要在拘留区与任何人讨论您的案件",
                  "对登记人员保持礼貌——这不会影响您的案件",
                  "询问什么时候能见到法官"
                ]
              },
              "firstAppearance": {
                "title": "首次出庭",
                "timeframe": "逮捕后24-72小时",
                "description": "您第一次出现在法官面前。正式宣读指控，法官决定保释事宜。如果您请不起律师，您可以在这个阶段申请公设辩护人。",
                "rights": [
                  "有权被告知指控内容",
                  "有权聘请律师（如果请不起可以申请公设辩护人）",
                  "有权要求合理的保释金",
                  "有权做无罪答辩"
                ],
                "tips": [
                  "在这个阶段几乎总是应该做'无罪'答辩",
                  "如果您请不起律师，就申请公设辩护人",
                  "穿着得体，称呼法官为'法官大人'",
                  "不要在公开法庭上讨论案件事实",
                  "带上您与社区联系的相关信息，用于保释辩论"
                ]
              },
              "pretrial": {
                "title": "审前阶段",
                "timeframe": "数周到数月",
                "description": "从首次出庭到审判之间的时期。您的律师审查证据、提交动议，并可能与检察官协商。认罪协商通常在这个阶段进行。",
                "rights": [
                  "有权查看检方掌握的所有证据（证据开示）",
                  "有权获得快速审判",
                  "有权让律师代您提交动议",
                  "有权拒绝任何认罪协议"
                ],
                "tips": [
                  "与您的律师保持密切联系",
                  "每次开庭日期都要到场——缺席会导致法院签发逮捕令",
                  "仔细遵守所有保释条件",
                  "不要在社交媒体上发布与案件有关的内容",
                  "大约90-95%的案件通过认罪协商解决"
                ]
              },
              "discovery": {
                "title": "证据开示",
                "timeframe": "审前阶段的一部分",
                "description": "双方交换证据。检方必须将所有证据与您的辩护律师共享，包括任何可能有助于证明您无罪的证据（这叫做Brady规则）。",
                "rights": [
                  "有权查看所有不利于您的证据",
                  "有权获得可能证明您无罪的证据（Brady材料）",
                  "有权通过动议对证据提出质疑",
                  "有权让律师审查所有证据开示材料"
                ],
                "tips": [
                  "与律师分享所有信息——律师-客户保密特权保护您",
                  "帮助律师找到可能的证人",
                  "收集任何支持您案件的文件、短信或记录",
                  "您的律师可能会提交动议，排除非法获取的证据",
                  "记下您对事件的所有记忆"
                ]
              },
              "trial": {
                "title": "审判",
                "timeframe": "数天到数周",
                "description": "如果您的案件进入审判，双方在法官或陪审团面前陈述案情。检方必须排除合理怀疑地证明您有罪。您有权作证或保持沉默。",
                "rights": [
                  "有权接受陪审团审判（适用于大多数刑事案件）",
                  "有权与证人对质和交叉询问",
                  "有权提出自己的证据和证人",
                  "有权作证或保持沉默（不能因此对您不利）",
                  "在被证明有罪之前推定无罪"
                ],
                "tips": [
                  "信任律师的策略——他们了解流程",
                  "穿着正式，在法庭上保持礼貌",
                  "不要对证词或证据做出情绪化反应",
                  "由律师决定您是否应该作证",
                  "举证责任在检方，不在您"
                ]
              },
              "sentencing": {
                "title": "量刑",
                "timeframe": "判决后立即或数周后",
                "description": "如果被判有罪，法官会根据量刑指南、犯罪严重程度、犯罪记录和其他因素来决定您的处罚。您有权在量刑前发言。",
                "rights": [
                  "有权在量刑时发言（最后陈述权）",
                  "有权让律师提出从轻情节",
                  "有权对定罪或刑期提起上诉",
                  "有权获得公正、适当的处罚（第八修正案）"
                ],
                "tips": [
                  "表现出真诚的悔过——法官会注意到",
                  "强调改过自新的步骤（心理咨询、就业、教育）",
                  "让家人或社区成员写支持信",
                  "询问律师是否有替代刑罚选项（缓刑、社区服务）",
                  "了解您的上诉权利——有截止日期"
                ]
              }
            }
          },
          "quickRef": {
            "title": "速查卡片",
            "subtitle": "简洁、可打印的权利指南，涵盖每个阶段。保存到手机或打印出来。",
            "printAll": "打印所有卡片",
            "tabs": {
              "police": "警察盘问",
              "court": "法庭阶段",
              "all": "所有卡片"
            },
            "disclaimer": {
              "title": "重要提示：",
              "text": "这些卡片提供关于您权利的一般信息。各州法律和具体情况有所不同。这不是法律建议。请务必就您的具体案件咨询律师。"
            },
            "police": {
              "title": "如果您被警察拦下",
              "stay": "保持冷静并记住",
              "stay1": "您有权保持沉默。说：\"我行使我的沉默权。\"",
              "stay2": "您有权拒绝搜查。说：\"我不同意搜查。\"",
              "stay3": "问：\"我可以离开吗？\"如果可以，冷静地走开。",
              "stay4": "您有权聘请律师。说：\"我要找律师。\"",
              "doHeading": "应该做的",
              "do1": "始终让双手保持在可见位置",
              "do2": "如果被要求，提供您的姓名和身份证件",
              "do3": "保持冷静，说话清楚",
              "do4": "记住警察的警徽号码和巡逻车号码",
              "do5": "事后立即写下所有经过",
              "dontHeading": "不应该做的",
              "dont1": "不要抗拒逮捕，即使您认为不公平",
              "dont2": "不要逃跑、争论或做突然的动作",
              "dont3": "不要同意搜查您的人身、车辆或住所",
              "dont4": "没有律师在场不要回答问题",
              "dont5": "没有阅读并咨询律师，不要签署任何文件",
              "ifArrested": "如果您被逮捕",
              "arrested1": "明确说出：\"我要找律师\"——然后停止说话",
              "arrested2": "您至少有一次打电话的机会——用来联系律师或家人",
              "arrested3": "除了律师以外，不要与任何人讨论您的案件",
              "arrested4": "您必须在48-72小时内被带到法官面前"
            },
            "arraignment": {
              "title": "传讯",
              "expect": "会发生什么",
              "expect1": "法官宣读对您的指控",
              "expect2": "您做出答辩：有罪、无罪或不争辩",
              "expect3": "可能会设定或调整保释金额",
              "expect4": "如果需要，您的律师可以申请公设辩护人",
              "say": "应该说什么",
              "say1": "\"无罪\"——这几乎总是最好的初始答辩",
              "say2": "\"我想申请法庭指定的律师\"——如果您请不起律师",
              "say3": "\"是的，法官大人\" / \"不是，法官大人\"——称呼法官时使用",
              "dontSay": "不应该说什么",
              "dontSay1": "不要在公开法庭上讨论案件事实",
              "dontSay2": "没有先和律师谈过，不要做有罪答辩",
              "dontSay3": "不要与法官或检察官争论",
              "rights": "您的权利",
              "right1": "有权聘请律师（请不起可以免费获得）",
              "right2": "有权知道对您的指控",
              "right3": "有权获得合理的保释",
              "right4": "有权获得快速审判"
            },
            "bail": {
              "title": "保释听证",
              "expect": "会发生什么",
              "expect1": "法官决定是否准予保释以及金额",
              "expect2": "考虑因素：指控严重程度、逃跑风险、社区联系、犯罪记录",
              "expect3": "您或您的律师可以争取降低保释金或释放",
              "expect4": "可能会设定释放条件（宵禁、禁止接触令等）",
              "say": "应该说什么",
              "say1": "强调社区联系：家庭、工作、居住时间",
              "say2": "表示您会遵守所有出庭日期",
              "say3": "如果保释金太高，提出替代方案（电子脚环、定期报到）",
              "dontSay": "不应该说什么",
              "dontSay1": "不要讨论案件细节",
              "dontSay2": "不要做出无法兑现的承诺",
              "dontSay3": "不要对法庭表现出沮丧或愤怒",
              "rights": "您的权利",
              "right1": "有权获得合理的保释（第八修正案）",
              "right2": "有权参加保释听证",
              "right3": "有权对保释决定提出上诉"
            },
            "pretrial": {
              "title": "审前 / 证据开示",
              "expect": "会发生什么",
              "expect1": "双方交换证据（证据开示程序）",
              "expect2": "您的律师可能会提交动议，要求排除证据或撤销指控",
              "expect3": "认罪协商通常在这个阶段进行",
              "expect4": "这个阶段可能持续数周到数月",
              "say": "应该怎么做",
              "do1": "与律师保持密切联系",
              "do2": "每次开庭都要到场——缺席可能导致法院签发逮捕令",
              "do3": "严格遵守所有保释条件",
              "do4": "收集任何有助于案件的证据或证人",
              "dontSay": "不应该做的",
              "dont1": "不要在社交媒体上或与他人讨论您的案件",
              "dont2": "不要直接联系证人或受害者",
              "dont3": "不要在没有完全了解后果的情况下接受认罪协议",
              "rights": "您的权利",
              "right1": "有权查看所有不利于您的证据（Brady规则）",
              "right2": "有权获得快速审判",
              "right3": "有权提出自己的证据和证人"
            },
            "plea": {
              "title": "认罪听证",
              "expect": "会发生什么",
              "expect1": "法官询问您是否理解认罪及其后果",
              "expect2": "您必须确认认罪是自愿的，不是被强迫的",
              "expect3": "法官说明可能的最高刑期",
              "expect4": "量刑可能立即进行或安排在以后",
              "say": "应该说什么",
              "say1": "\"是的，我理解\"——当法官解释认罪条款时",
              "say2": "\"是的，这是我自愿的决定\"——确认您没有被强迫",
              "say3": "让律师解释您不理解的任何内容",
              "dontSay": "不应该说什么",
              "dontSay1": "在做有罪答辩时不要说\"我没有做\"——法官可能会驳回认罪",
              "dontSay2": "如果您不了解附带后果（移民、住房、就业），不要同意认罪",
              "dontSay3": "不要着急——您可以要求更多时间来决定",
              "rights": "您的权利",
              "right1": "在某些情况下有权撤回有罪答辩",
              "right2": "在认罪前有权知道全部后果",
              "right3": "有权拒绝任何认罪协议并选择审判"
            },
            "sentencing": {
              "title": "量刑",
              "expect": "会发生什么",
              "expect1": "法官考虑量刑指南、受害者影响陈述和您的背景",
              "expect2": "您的律师可以提出从轻情节（初犯、就业、家庭责任）",
              "expect3": "可能的结果：罚款、缓刑、社区服务、监禁或组合处罚",
              "expect4": "您可能有机会向法庭陈述",
              "say": "应该说什么",
              "say1": "如果被判有罪，表达真诚的悔意",
              "say2": "提到您采取的改过步骤（心理咨询、课程、就业）",
              "say3": "描述您的责任（子女、家庭、社区）",
              "dontSay": "不应该说什么",
              "dontSay1": "不要指责受害者或淡化犯罪行为",
              "dontSay2": "不要与法官的提问争论",
              "dontSay3": "不要找借口——在适当的时候承担责任",
              "rights": "您的权利",
              "right1": "有权在量刑时发言（最后陈述权）",
              "right2": "有权对刑期提出上诉",
              "right3": "有权获得公正、适当的处罚（第八修正案）",
              "right4": "有权让律师在场"
            }
          },
          "diversionPrograms": {
            "hero": {
              "title": "转处计划",
              "subtitle": "寻找替代方案，避免定罪并获得所需帮助"
            },
            "navigation": {
              "backToHome": "返回首页",
              "programsCount": "{{total}} 个计划中的 {{count}} 个"
            },
            "search": {
              "placeholder": "输入您的邮编、县或城市...",
              "filterByState": "按州筛选：",
              "allStates": "所有州",
              "federalPrograms": "联邦计划",
              "filterByProgramType": "按计划类型筛选：",
              "allProgramTypes": "所有计划类型",
              "clearAllFilters": "清除所有筛选条件"
            },
            "infoBanner": {
              "title": "什么是转处计划？",
              "description": "转处计划允许符合条件的被告通过完成治疗、社区服务或其他要求来避免传统起诉。成功完成后通常会撤销指控或减轻处罚。"
            },
            "programCard": {
              "location": "地点",
              "county": "县",
              "moreLocations": "+{{count}} 个更多地点",
              "programTypes": "计划类型",
              "eligibility": "资格条件",
              "contactInformation": "联系信息",
              "visitWebsite": "访问网站"
            },
            "emptyState": {
              "title": "未找到计划",
              "description": "请尝试调整您的搜索位置或筛选条件，以查找您所在地区的计划。",
              "clearFilters": "清除筛选条件"
            },
            "quickNav": {
              "legalGuidanceTitle": "需要法律指导？",
              "legalGuidanceDesc": "获取针对您的具体指控和情况的个性化法律建议。",
              "legalGuidanceButton": "获取法律指导",
              "recordClearingTitle": "了解消除记录",
              "recordClearingDesc": "检查您是否有资格消除或封存犯罪记录。",
              "recordClearingButton": "检查资格"
            }
          },
          "recordExpungement": {
            "hero": {
              "title": "犯罪记录消除",
              "subtitle": "检查您是否有资格清除犯罪记录，获得全新开始"
            },
            "navigation": {
              "backToHome": "返回首页"
            },
            "infoBanner": {
              "title": "什么是犯罪记录消除？",
              "description": "犯罪记录消除是将犯罪记录从公开查询中删除或封存，帮助您不再因过去的定罪影响就业、住房或其他机会而继续前行。",
              "stateNote": "每个州有不同的规定、等待期和资格要求。"
            },
            "eligibilityForm": {
              "title": "检查您的资格",
              "stateQuestion": "您的定罪是在哪个州？",
              "statePlaceholder": "选择您所在的州...",
              "federalCourt": "联邦法院",
              "offenseTypeQuestion": "犯罪类型是什么？",
              "misdemeanor": "轻罪",
              "felony": "重罪",
              "completionDateQuestion": "您何时完成了刑期/缓刑？",
              "offenseCategoryQuestion": "犯罪类别是什么？（如持有毒品、酒驾、盗窃、人身伤害）",
              "offenseCategoryPlaceholder": "如持有毒品、盗窃、酒驾、人身伤害",
              "multipleConvictions": "我有多次定罪记录",
              "checkEligibility": "检查资格",
              "reset": "重置"
            },
            "eligibilityResult": {
              "likelyEligible": "很可能符合资格",
              "possiblyEligible": "可能符合资格",
              "unlikelyEligible": "不太可能符合资格",
              "nextSteps": "下一步",
              "stateInfo": "{{state}} 犯罪记录消除信息",
              "overview": "概述",
              "commonExclusions": "常见排除情况",
              "moreExclusions": "+{{count}} 个更多",
              "legalSources": "法律来源",
              "disclaimerTitle": "重要提示：",
              "disclaimerText": "这只是初步评估。资格取决于许多因素，包括具体情况、当地规定和法官裁量权。请咨询合格律师，获取关于您情况的明确法律建议。"
            },
            "quickNav": {
              "legalHelpTitle": "需要法律帮助？",
              "legalHelpDesc": "获取针对您具体情况的个性化法律指导。",
              "legalHelpButton": "获取法律指导",
              "diversionProgramsTitle": "查找转处计划",
              "diversionProgramsDesc": "探索可能帮助避免定罪的替代方案。",
              "diversionProgramsButton": "探索选项"
            }
          },
          "friendsFamily": {
            "hero": {
              "title": "帮助被捕的亲友",
              "subtitle": "您可以采取的实际步骤，帮助被逮捕或拘留的人"
            },
            "criticalAlert": {
              "title": "最初24小时至关重要：",
              "text": "迅速行动可以对帮助您的亲人产生重大影响。重点收集信息、确保法律代理和提供支持。"
            },
            "sectionTitle": "分步行动计划",
            "step1": {
              "title": "找到他们被关在哪里",
              "description": "第一步是找到关押您亲人的设施。",
              "howToFindTitle": "如何找到他们：",
              "howToFind1": "致电当地警察局或县看守所",
              "howToFind2": "在线查看在押人员查询系统（县治安官网站）",
              "howToFind3": "致电法院书记官办公室",
              "howToFind4": "联邦逮捕：致电联邦监狱局",
              "infoToProvideTitle": "需要提供的信息：",
              "infoToProvide1": "完整法定姓名",
              "infoToProvide2": "出生日期",
              "infoToProvide3": "大约逮捕日期/时间",
              "infoToProvide4": "逮捕地点（如果知道的话）"
            },
            "step2": {
              "title": "确保法律代理",
              "description": "尽早让律师介入是您能做的最重要的事情之一。",
              "alertTitle": "重要提示：",
              "alertText": "如果他们请不起律师，他们有权获得公设辩护人。不要拖延——在他们第一次见法官时就提出申请。",
              "publicDefenderTitle": "公设辩护人",
              "publicDefenderDesc": "请不起律师的人可以免费获得。在首次出庭时或通过法院书记官申请。",
              "legalAidTitle": "法律援助机构",
              "legalAidDesc": "为符合条件的个人提供免费或低价法律服务。",
              "privateAttorneyTitle": "私人律师",
              "privateAttorneyDesc": "聘请的代理人。费用可能较高，但可能提供更个性化的服务。"
            },
            "step3": {
              "title": "收集重要信息",
              "description": "收集有助于律师和法庭程序准备的详细信息。",
              "keyInfoTitle": "需要记录的关键信息：",
              "keyInfo1": "入案编号/在押人员编号",
              "keyInfo2": "对他们提出的指控",
              "keyInfo3": "开庭日期和时间",
              "keyInfo4": "保释金额（如果已设定）",
              "keyInfo5": "逮捕警察的姓名",
              "keyInfo6": "案件编号",
              "keyInfo7": "指定公设辩护人的姓名（如适用）",
              "keyInfo8": "证人联系方式"
            },
            "step4": {
              "title": "了解保释和担保",
              "description": "保释允许在等待审判期间从看守所临时释放。",
              "bailOptionsTitle": "保释选项：",
              "cashBailTitle": "现金保释：",
              "cashBailDesc": "向法院支付全额（案件结束后退还）",
              "bailBondTitle": "保释担保：",
              "bailBondDesc": "向保释担保人支付10-15%（不退还）",
              "propertyBondTitle": "财产担保：",
              "propertyBondDesc": "用财产作为抵押",
              "rorTitle": "自行具结释放：",
              "rorDesc": "无需付款即可释放（逃跑风险低）",
              "warningTitle": "保释担保人警告：",
              "warningText": "如果您使用保释担保人，当事人不出庭时您要承担责任。您可能会失去抵押品或被要求支付全额保释金。"
            },
            "step5": {
              "title": "提供持续支持",
              "description": "被逮捕是一件压力很大的事。以下是您在整个过程中可以提供帮助的方式。",
              "practicalHelpTitle": "实际帮助：",
              "practicalHelp1": "参加法庭听证以表示支持",
              "practicalHelp2": "帮助收集品格证明",
              "practicalHelp3": "收集就业记录",
              "practicalHelp4": "保管重要文件",
              "practicalHelp5": "在拘留期间代为处理事务",
              "practicalHelp6": "为狱中消费账户/电话充值",
              "emotionalSupportTitle": "情感支持：",
              "emotionalSupport1": "通过批准的渠道保持联系",
              "emotionalSupport2": "如果无法探视，就写信",
              "emotionalSupport3": "保持积极和鼓励的态度",
              "emotionalSupport4": "不要在监控电话中讨论案件细节",
              "emotionalSupport5": "帮助他们与家人保持联系",
              "emotionalSupport6": "关注心理健康需求"
            },
            "warnings": {
              "title": "重要提醒",
              "jailCallsTitle": "绝对不要在看守所电话中讨论案件细节：",
              "jailCallsText": "看守所的所有电话都会被录音，并可作为证据使用。只通过批准的保密渠道与律师讨论案件。",
              "interferenceTitle": "不要试图干预：",
              "interferenceText": "绝不要试图联系证人、销毁证据或干预调查。这可能导致您和您的亲人面临额外的指控。"
            },
            "disclaimer": {
              "title": "法律免责声明：",
              "text": "此信息仅供教育目的，不构成法律建议。每种情况都不同。请咨询合格律师，获取针对您亲人案件的具体指导。"
            },
            "privacyBanner": {
              "title": "隐私优先：",
              "text": "我们不存储您的个人数据——所有输入在会话结束后删除。"
            }
          },
          "courtLocator": {
            "hero": {
              "title": "查找您当地的法院",
              "subtitle": "使用免费的政府数据源和OpenStreetMap查找附近的法院。获取联系信息、办公时间和您所在地区可用的服务。"
            },
            "search": {
              "inputPlaceholder": "输入邮编",
              "searchButton": "搜索",
              "searching": "搜索中...",
              "error": "请输入有效的5位数邮编",
              "errorGeneral": "无法搜索法院。请重试或联系您当地法院获取信息。",
              "limitedData": "该地区的法院数据有限。显示示例结果。",
              "sampleData": "使用示例数据。该地区的部分法院信息可能有限。"
            },
            "results": {
              "title": "法院搜索结果",
              "foundCourts": "在您所在地区找到 {{count}} 个法院{{plural}}",
              "noCourts": "未找到法院",
              "tryDifferent": "请尝试使用不同的邮编搜索"
            },
            "sections": {
              "stateTitle": "州和地方法院 ({{count}})",
              "stateDesc": "按县组织的法院，同县法院排在前面",
              "federalTitle": "联邦法院 ({{count}})",
              "federalDesc": "联邦法院处理联邦犯罪和民事案件"
            },
            "courtTypes": {
              "federal": "联邦法院",
              "state": "州法院",
              "municipal": "市法院",
              "traffic": "交通法院",
              "bankruptcy": "破产法院",
              "court": "法院"
            },
            "courtCard": {
              "phone": "电话",
              "hours": "办公时间",
              "services": "服务",
              "directions": "获取路线",
              "milesAway": "{{distance}} 英里"
            },
            "info": {
              "title": "了解法院类型",
              "subtitle": "不同的法院处理不同类型的案件。以下是您需要了解的内容。",
              "federal": {
                "title": "联邦法院",
                "desc": "处理违反联邦法律的案件，包括联邦犯罪、破产以及涉及联邦机构或宪法问题的案件。",
                "examples": "银行抢劫、跨州贩毒、联邦逃税、移民违规"
              },
              "state": {
                "title": "州法院",
                "desc": "处理大多数刑事和民事案件，包括重罪、轻罪、家庭法和违反州法律的案件。",
                "examples": "人身伤害、盗窃、酒驾、家庭暴力、遗嘱认证、家庭法院事务"
              },
              "municipal": {
                "title": "市法院",
                "desc": "处理市区范围内的地方法规违规和轻微犯罪。",
                "examples": "噪音投诉、分区违规、轻微交通违规、市政法规违规"
              }
            },
            "faq": {
              "title": "常见问题",
              "q1": "我怎么知道哪个法院处理我的案件？",
              "a1": "指控的类型决定了哪个法院有管辖权。联邦犯罪由联邦法院审理，州犯罪由州法院审理。如果不确定，请查看您的传票或联系法院书记官。",
              "q2": "我可以在开庭日之前去法院看看吗？",
              "a2": "可以，大多数法院在工作时间对公众开放。这可以帮助您找到正确的法庭，让您在正式开庭时更加自在。",
              "q3": "去法院应该带什么？",
              "a3": "带上您的传票、有效身份证件、与案件相关的任何文件，以及记事用的纸笔。穿着正式并提前到达。"
            },
            "courtInformation": {
              "title": "重要法院信息",
              "courtTypesCard": {
                "title": "法院类型",
                "description": "不同的法院处理不同类型的案件。联邦法院处理联邦犯罪，州法院处理大多数刑事案件，市法院处理地方违规。"
              },
              "courtHoursCard": {
                "title": "法院办公时间",
                "description": "大多数法院在工作日的工作时间内运作。部分法院针对特定事务有延长时间或周末开放。"
              },
              "dataSourcesCard": {
                "title": "数据来源",
                "description": "法院位置来自OpenStreetMap和CourtListener（Free Law Project）。请务必提前致电确认时间和流程，因为数据可能有所不同。"
              }
            }
          },
          "developmentRoadmap": {
            "hero": {
              "title": "开发路线图",
              "subtitle": "我们的未来愿景",
              "description": "跟踪我们构建最全面的免费法律援助平台的进展。这个路线图是透明的、数据驱动的，专注于扩大司法公正的可及性。",
              "openSourceNote": "本项目是开源的（代码采用MIT许可证，文档采用CC0许可证），公开开发。我们致力于开发和决策过程中的透明性。"
            },
            "mission": {
              "title": "我们的使命与原则",
              "accessToJustice": {
                "title": "司法公正",
                "description": "让每个人都能获得法律指导，无论经济状况或所在位置"
              },
              "privacyFirst": {
                "title": "隐私优先",
                "description": "通过临时会话和不保留数据来保护用户隐私"
              },
              "continuousImprovement": {
                "title": "持续改进",
                "description": "根据用户反馈和不断变化的法律环境持续迭代"
              }
            },
            "stats": {
              "completed": "已完成",
              "inProgress": "进行中",
              "planned": "已规划",
              "researching": "研究中"
            },
            "categories": {
              "all": "所有类别",
              "data": "数据来源",
              "features": "功能",
              "infrastructure": "基础设施",
              "ai": "AI 与机器学习",
              "legal": "法律内容"
            },
            "filters": {
              "title": "按类别筛选",
              "viewAll": "查看全部"
            },
            "progress": {
              "overall": "总体进度",
              "completion": "{{percent}}% 完成"
            },
            "status": {
              "completed": "已完成",
              "inProgress": "进行中",
              "planned": "已规划",
              "researching": "研究中"
            },
            "priority": {
              "critical": "关键",
              "high": "高",
              "medium": "中",
              "low": "低"
            },
            "roadmapItem": {
              "estimatedCompletion": "预计完成时间",
              "dependencies": "依赖项",
              "challenges": "挑战",
              "impact": "影响",
              "progress": "进度"
            },
            "items": {
              "attorneyTools": {
                "title": "律师工具门户",
                "description": "为持牌律师提供的专属板块，包含法院记录查询、文件资源和专业工具。律师专属功能的基础。",
                "impact": "为法律专业人士提供专属功能，同时保持核心资源的共享访问"
              },
              "courtlistener": {
                "title": "CourtListener API 集成",
                "description": "与 Free Law Project 的 CourtListener API 完整集成，可访问840万+法院意见和联邦案卷",
                "impact": "提供对联邦判例法和法院记录的基础访问"
              },
              "pacer": {
                "title": "PACER 认证与数据访问",
                "description": "实现 PACER 认证 API 和经济高效的文件检索系统",
                "impact": "访问5亿+联邦法院文件和实时案件更新",
                "challenges": {
                  "cost": "每页$0.10的成本管理",
                  "rateLimit": "速率限制合规",
                  "bulk": "批量数据优化"
                }
              },
              "stateStatutes": {
                "title": "州法律数据库",
                "description": "已实现50个州加哥伦比亚特区的完整覆盖，涵盖12个犯罪类别的1,255项刑事法规，包括杀人、人身伤害、盗窃、欺诈、毒品犯罪等。713个经验证的指控-法规匹配，链接至官方立法网站。",
                "impact": "全国范围内州刑事法规的完整覆盖"
              },
              "aiGuidance": {
                "title": "AI 法律指导引擎",
                "description": "基于案件参数生成个性化法律指导的先进AI系统。目前由 Claude Sonnet 4 驱动，支持管辖区感知提示。",
                "impact": "个性化法律援助的核心功能",
                "challenges": {
                  "accuracy": "法律准确性验证",
                  "bias": "偏见检测和缓解",
                  "jurisdiction": "管辖区特定的细微差别"
                }
              },
              "attorneyDocGen": {
                "title": "律师文件生成",
                "description": "为持牌律师提供28个AI驱动的文件模板：17个刑事动议（覆盖50个州加哥伦比亚特区，按县/区划分）和11个移民动议（EOIR格式，按区/分区划分）。涵盖从初始文件到量刑后的所有案件阶段。",
                "impact": "减轻处理大量案件的公设辩护人和法律援助律师的时间负担"
              },
              "publicApiV1": {
                "title": "公共 REST API v1",
                "description": "开放API，为第三方提供法律内容、刑事指控、转处计划、术语表和犯罪记录消除规则的访问。包括OpenAPI规范、可嵌入组件、CORS支持和速率限制。",
                "impact": "使法律援助机构和开发者能够将我们的数据集成到他们自己的工具中"
              },
              "securityAudit": {
                "title": "安全与代码审计",
                "description": "全面的安全加固：从AI提示中移除个人信息、将API密钥从URL迁移至安全头部、结构化生产安全日志、移除1,400多行无用代码并卸载未使用的依赖项。",
                "impact": "更强的数据隐私保护和更干净、更易维护的代码库"
              },
              "bilingualSupport": {
                "title": "英语/西班牙语/中文三语支持",
                "description": "在整个平台上提供完整的三语支持，包括案件指导、权利信息、刑事指控、术语表、移民指导、案件时间线、速查卡片和全站搜索。每种语言超过3,150个翻译键。",
                "impact": "为使用西班牙语和中文的社区提供可访问的法律信息，帮助他们了解司法系统"
              },
              "additionalLanguages": {
                "title": "更多语言支持",
                "description": "在英语、西班牙语和中文之外扩展到越南语、韩语、他加禄语以及移民社区中常用的其他语言。",
                "impact": "为不讲英语的个人提供更广泛的司法系统导航支持"
              },
              "expandedJurisdictions": {
                "title": "扩展管辖区覆盖",
                "description": "增加法院专属规则、当地程序和针对更多州和县的管辖区特定指导。",
                "impact": "为全国各地用户提供更准确、更贴近当地的指导"
              },
              "judgeAnalytics": {
                "title": "法官与法院分析",
                "description": "对量刑模式、认罪协议和司法决策的统计分析",
                "impact": "为案件策略和结果提供预测性见解",
                "challenges": {
                  "privacy": "数据隐私问题",
                  "significance": "统计显著性",
                  "historicalBias": "历史数据中的偏见"
                }
              },
              "mobileApp": {
                "title": "移动应用",
                "description": "适用于iOS和Android的原生移动应用，具备紧急情况下的离线功能",
                "impact": "在逮捕和紧急情况下的可及性"
              },
              "privacyEncryption": {
                "title": "高级隐私与加密",
                "description": "完整的隐私保护：基于NLP的个人信息检测、匿名同意跟踪、传输加密（HTTPS）、静态加密（数据库）以及基于会话的临时性和用户可控的数据删除。",
                "impact": "为弱势用户提供最大程度的隐私保护"
              },
              "clientE2E": {
                "title": "客户端端到端加密",
                "description": "高级未来功能：基于浏览器的加密，用户数据在离开设备前即被加密，确保零知识架构。",
                "impact": "为极其敏感的咨询提供终极隐私保护",
                "challenges": {
                  "keyManagement": "在浏览器中安全生成和存储密钥，无需服务器访问",
                  "aiCompatibility": "AI处理需要明文——加密与指导质量之间的权衡"
                }
              }
            },
            "badges": {
              "quickWin": "速赢"
            },
            "getInvolved": {
              "title": "参与其中",
              "subtitle": "这是一个社区驱动的项目。以下是您可以贡献的方式：",
              "contribute": {
                "title": "在GitHub上贡献",
                "description": "提交代码、报告错误或提出改进建议"
              },
              "feedback": {
                "title": "分享反馈",
                "description": "告诉我们哪些功能对您最有帮助"
              },
              "spread": {
                "title": "帮助传播",
                "description": "将此工具分享给需要法律援助的人"
              }
            },
            "featureRequest": {
              "modalTitle": "请求新功能",
              "description": "对于如何更好地服务正在了解法律系统的个人，您有什么想法吗？我们很乐意听取您的意见。",
              "nameLabel": "您的姓名",
              "namePlaceholder": "输入您的姓名",
              "emailLabel": "邮箱地址",
              "emailPlaceholder": "输入您的邮箱",
              "descriptionLabel": "功能描述",
              "descriptionPlaceholder": "描述您想看到的功能...",
              "submitButton": "提交请求",
              "cancelButton": "取消",
              "requestButton": "请求新功能",
              "validationName": "信息不完整",
              "validationNameDesc": "请填写所有字段。",
              "validationEmail": "邮箱无效",
              "validationEmailDesc": "请输入有效的邮箱地址。",
              "successTitle": "邮件客户端已打开",
              "successDesc": "您的默认邮件客户端应该已打开。请发送邮件以提交您的请求。",
              "disclaimer": "提交功能请求即表示您同意我们就您的建议与您联系。我们尊重您的隐私，不会分享您的信息。"
            },
            "transparency": {
              "title": "透明承诺",
              "description": "我们相信开放式开发。所有进展、挑战和决策都会公开分享，以保持问责制并与我们服务的社区建立信任。"
            }
          },
          "missionStatement": {
            "hero": {
              "title": "使命宣言",
              "subtitle": "Public Defender AI 是一项公益服务，致力于利用人工智能、法律数据和自动化技术，为美国境内被指控犯罪且可能无法立即获得法律顾问的个人提供及时、准确、便捷的帮助。本平台基于开源原则构建，代码采用 MIT 许可证，文档采用 CC0（知识共享零权利）许可证，确保所有需要帮助的人都能免费使用。"
            },
            "goals": {
              "title": "我们的主要目标",
              "expandAccess": {
                "title": "扩大司法服务覆盖面",
                "description": "免费为被告提供初步法律信息、指导和案件相关分析，减少弱势群体获取法律帮助的障碍。"
              },
              "supportDefenders": {
                "title": "支持公设辩护人的工作",
                "description": "帮助公设辩护人快速获取汇总的法律数据、案件统计和程序要求，协助他们制定更有效的辩护策略。"
              },
              "empowerDecisions": {
                "title": "帮助做出明智的决定",
                "description": "通过基于可靠数据的清晰易懂的解释，帮助被告更好地了解自己的权利、法律选项和可能的结果。"
              },
              "increaseFairness": {
                "title": "提高效率和公平性",
                "description": "自动收集和整合公共法律数据，帮助被告和律师快速找到相关判例、程序规则以及认罪协议或量刑趋势。"
              }
            },
            "principles": {
              "title": "指导原则",
              "description": "本项目以公平、透明、数据隐私以及遵守适用法律和法律执业道德准则为指导原则。",
              "disclaimer": "本 AI 工具不能替代持证律师，而是作为辅助工具来补充人工法律咨询，并改善获得公平辩护资源的途径。"
            }
          },
          "privacyPolicy": {
            "hero": {
              "title": "隐私政策",
              "subtitle": "我们致力于保护您的隐私。本政策说明我们如何处理您的信息。",
              "lastUpdated": "最后更新：2026年2月4日"
            },
            "notice": {
              "title": "隐私优先平台：",
              "description": "我们不收集或存储个人数据。您的隐私默认受到保护。"
            },
            "principles": {
              "title": "我们的隐私原则",
              "noPersonalData": {
                "title": "不收集个人数据",
                "description": "我们不收集、存储或保留任何可识别个人身份的信息。这包括姓名、地址、案件详情、指控或任何其他可能识别您个人身份的信息。您与本平台的所有互动都是匿名的。"
              },
              "anonymizedData": {
                "title": "仅使用匿名数据",
                "description": "我们可能会收集匿名的汇总数据，用于以下目的：",
                "usage": {
                  "metrics": "了解平台使用情况以改善用户体验",
                  "improvements": "确定哪些功能和资源最有帮助",
                  "integrations": "为希望将我们的服务集成到其平台的第三方提供匿名分析"
                }
              },
              "noSharing": {
                "title": "不分享或出售数据",
                "description": "我们不会向任何第三方分享、出售或提供您的数据。由于我们不收集个人数据，即使想分享也做不到。任何共享的匿名数据都已完全去除识别信息。"
              }
            },
            "caseData": {
              "title": "我们如何保护您的案件信息",
              "summary": "当您使用我们的法律指导工具时，您的案件信息受到多层保护。以下是您的数据处理方式的详细说明：",
              "memoryOnly": {
                "title": "仅内存存储",
                "description": "您的案件信息仅存储在临时服务器内存中——不会写入数据库或保存到磁盘。这意味着您的数据仅在处理期间存在，会话结束后无法恢复。"
              },
              "piiRedaction": {
                "title": "自动移除个人信息",
                "description": "在您的案件详情被我们的 AI 处理之前，我们会自动检测并移除姓名、电话号码、电子邮件地址和社会安全号码等个人信息。此脱敏处理在我们的服务器上通过机器学习本地完成——您的个人详细信息不会发送到外部 AI 服务。"
              },
              "autoDelete": {
                "title": "24小时自动删除",
                "description": "即使在内存中，您的案件数据最长保留时间也只有24小时。之后将自动永久删除。您不需要采取任何操作——删除会自动进行。"
              },
              "serverRestart": {
                "title": "服务器重启时清除",
                "description": "由于数据仅存储在内存中，任何服务器重启或更新都会完全清除所有会话数据。这在我们改进平台时会定期发生，提供了额外的数据短暂性保护层。"
              }
            },
            "technical": {
              "title": "技术详情",
              "sessions": {
                "title": "会话数据",
                "description": "临时会话数据用于在单次访问期间维护您的浏览体验。当您关闭浏览器或结束会话时，此数据会自动删除。不会永久存储任何会话信息。"
              },
              "logs": {
                "title": "服务器日志",
                "description": "我们的网络服务器可能会临时收集标准技术信息，如 IP 地址、浏览器类型和访问时间，用于安全和故障排除目的。这些日志保留时间有限，不会用于识别个人用户。"
              },
              "external": {
                "title": "外部数据源",
                "description": "我们的平台访问公共法律数据库和服务来为您提供信息：",
                "services": {
                  "anthropic": "Anthropic Claude Sonnet 4 - 用于生成法律指导和文件摘要。您的个人信息在处理前会被移除。Anthropic 可能会出于运营和安全目的保留数据最多30天，之后自动删除。这些数据不会用于训练 AI 模型。",
                  "govInfo": "GovInfo.gov API - 用于联邦刑事法规（美国法典第18编）",
                  "courtListener": "CourtListener API - 用于判例法和法院数据",
                  "recap": "RECAP Archive - 用于联邦法院文件",
                  "cornell": "Cornell Legal Information Institute - 用于法律法规",
                  "openLaws": "OpenLaws API - 用于州法规文本和法律数据"
                },
                "note": "当您使用我们的平台搜索这些数据库时，您的查询可能会被传输到这些服务。个人信息在发送到 AI 服务之前会自动脱敏。如果您对外部数据访问有疑虑，我们建议您查阅它们的隐私政策。"
              }
            },
            "rights": {
              "title": "您的隐私权利",
              "description": "由于我们不收集或存储个人数据，您自动享有以下保护：",
              "list": {
                "noDataStored": "没有需要访问、修改或删除的数据——我们从一开始就不存储它",
                "sessionControl": "完全控制会话数据——只需关闭浏览器即可结束所有追踪",
                "noTracking": "没有跨站追踪、Cookie 或持久性标识符"
              }
            },
            "changes": {
              "title": "本政策的变更",
              "description": "我们可能会不时更新本隐私政策。最后更新日期显示在本页顶部。在变更后继续使用我们的平台即表示接受更新后的政策。"
            },
            "contact": {
              "title": "关于隐私的问题？",
              "description": "如果您对我们如何保护您的隐私有疑问，请通过我们的公开 GitHub 仓库或社区渠道联系我们。"
            }
          },
          "documentLibrary": {
            "title": "案件文件库",
            "subtitle": "了解您在案件过程中可能收到的文件。每个部分都用通俗易懂的语言进行了解释。",
            "importance": {
              "critical": "关键",
              "important": "重要",
              "informational": "参考信息"
            },
            "card": {
              "purpose": "用途",
              "whatToDo": "收到这份文件后该怎么做",
              "sections": "文件各部分"
            },
            "filter": {
              "label": "筛选条件：",
              "phase": "案件阶段",
              "category": "类别",
              "allPhases": "所有阶段",
              "allCategories": "所有类别",
              "criminal": "刑事司法",
              "immigration": "移民",
              "showing": "{{count}} 份文件"
            },
            "tabs": {
              "criminal": "刑事司法",
              "immigration": "移民"
            },
            "noDocuments": "没有符合您筛选条件的文件。",
            "cta": {
              "title": "需要个性化指导？",
              "description": "我们的 AI 助手可以帮助您了解在您的具体情况下应该拥有哪些文件。",
              "button": "获取指导"
            }
          },
          "documents": {
            "citationTicket": {
              "title": "传票/罚单",
              "description": "针对轻微违法行为发出的书面通知，代替实际逮捕。",
              "purpose": "本文件正式通知您被指控的罪名，并告诉您何时何地出庭。它相当于法院传唤通知。",
              "whatToDo": "妥善保管这份文件！记下开庭日期和案件编号。如果在规定日期未到庭，可能会被发出逮捕令。",
              "sections": {
                "charges": { "label": "罪名/指控", "explanation": "这部分显示了您被指控的行为。它引用了您涉嫌违反的具体法律或法规。" },
                "courtDate": { "label": "出庭日期", "explanation": "这是您必须出庭的日期和时间。错过这个日期可能会导致额外指控和逮捕令。" },
                "caseNumber": { "label": "案件/传票编号", "explanation": "您案件的唯一标识号。您在网上查询案件或致电法院时需要用到这个编号。" },
                "bailAmount": { "label": "保释金金额", "explanation": "您可能需要支付的释放或免于入狱的金额。并非所有传票都包含此项。" }
              }
            },
            "arrestWarrant": {
              "title": "逮捕令",
              "description": "授权警察逮捕您的法院命令。",
              "purpose": "这份由法官签署的文件赋予警察逮捕您的法律权力。它意味着法官发现有足够证据（合理理由）相信您实施了犯罪。",
              "whatToDo": "如果有人向您出示逮捕令，不要抗拒。要求获得副本并记下法官姓名和所列指控。立即联系律师。",
              "sections": {
                "probableCause": { "label": "合理理由陈述", "explanation": "这解释了法官为什么认为您可能犯了罪。它概述了针对您的证据或指控。" },
                "judgeSignature": { "label": "法官签名", "explanation": "有效的逮捕令必须由法官或地方法官签署。没有签名，逮捕令可能无效。" },
                "chargesListed": { "label": "所列指控", "explanation": "您被指控的具体犯罪。这决定了您案件的严重程度以及您可能面临的处罚。" }
              }
            },
            "propertyVoucher": {
              "title": "财物收据",
              "description": "列出逮捕时从您身上没收的所有个人物品的收据。",
              "purpose": "这是警察在逮捕您时拿走的物品的证明。案件结案后，您需要凭此取回财物。",
              "whatToDo": "保管好这份文件！检查所有物品是否正确列出。您需要凭收据编号取回财物。如有物品遗漏请立即报告。",
              "sections": {
                "itemsList": { "label": "物品清单", "explanation": "从您身上没收的所有物品的详细清单——钱包、手机、首饰、现金等。签字前请核实是否准确。" },
                "voucherNumber": { "label": "收据编号", "explanation": "取回财物时需要的唯一编号。请另外记下，以防丢失原件。" },
                "officerInfo": { "label": "警官信息", "explanation": "没收您财物的警官的姓名和警号。如果对物品有争议，这些信息会有帮助。" }
              }
            },
            "bookingPapers": {
              "title": "入监文件",
              "description": "您被送入看守所时创建的文件。",
              "purpose": "这些文件记录了您的逮捕信息、针对您的指控和您的个人信息。它们将成为您逮捕记录的一部分。",
              "whatToDo": "检查是否准确。入监文件中的错误可能会在以后造成问题。记下您的入监编号——家人可以用它来找到您或办理保释。",
              "sections": {
                "personalInfo": { "label": "个人信息", "explanation": "您的姓名、地址、出生日期和体貌特征。请确保这些信息准确，以避免身份问题。" },
                "arrestDetails": { "label": "逮捕详情", "explanation": "您被逮捕的时间、地点和原因。这些信息对您的辩护很重要。" },
                "bookingNumber": { "label": "入监编号", "explanation": "您在看守所的唯一标识号。家人可以用它在看守所系统中找到您或安排保释。" }
              }
            },
            "mirandaAcknowledgment": {
              "title": "米兰达权利告知书",
              "description": "记录您已被告知权利的表格。",
              "purpose": "此文件证明警察在询问您之前已告知您享有沉默权和获得律师帮助的权利。",
              "whatToDo": "您不必签署此文件。即使签了，也不代表您放弃了权利——您仍然可以随时保持沉默并要求律师。",
              "sections": {
                "rightsListed": { "label": "所列权利", "explanation": "您的米兰达权利：沉默权、您所说的任何话都可能在法庭上被用作不利于您的证据、获得律师帮助的权利、如果无力负担可获得免费律师的权利。" },
                "waiverSection": { "label": "弃权部分", "explanation": "这询问您是否自愿放弃这些权利。您不必签署。即使签了，在讯问过程中您也可以随时行使这些权利。" }
              }
            },
            "criminalComplaint": {
              "title": "刑事起诉书",
              "description": "正式指控您犯罪的文件。",
              "purpose": "这是检察官对您被指控的犯罪及其声称证明您有罪的基本事实的正式陈述。它开启了您的刑事案件。",
              "whatToDo": "与您的律师仔细阅读此文件。它会准确告诉您被指控的罪名。您的辩护策略将围绕回应这些指控来制定。",
              "sections": {
                "charges": { "label": "刑事指控", "explanation": "您被指控的具体犯罪，包括程度（轻罪与重罪）。每项指控有不同的潜在处罚。" },
                "factsAlleged": { "label": "事实陈述", "explanation": "检察官版本的事件经过。这是他们在审判中将试图证明的内容。您的律师会寻找这个叙述中的漏洞。" },
                "statuteCitations": { "label": "法规引用", "explanation": "您涉嫌违反的具体法律条文。这些法规定义了检察官必须证明什么才能给您定罪。" }
              }
            },
            "arraignmentNotice": {
              "title": "提审通知",
              "description": "逮捕后首次出庭的通知。",
              "purpose": "此通知告诉您何时何地参加提审——在提审中您将被正式告知指控并被要求做出答辩。",
              "whatToDo": "不要错过这个日期！提早到达。如果没有律师，告诉法官您想要一名公设辩护人。在这个阶段通常会做「无罪「答辩。",
              "sections": {
                "courtLocation": { "label": "法院地点", "explanation": "您必须出席的具体法院、房间号和地址。提早到达以通过安检并找到正确的法庭。" },
                "dateTime": { "label": "日期和时间", "explanation": "您必须出庭的确切时间。错过这个日期很可能会导致发出逮捕令。" },
                "caseNumber": { "label": "案件编号", "explanation": "您的唯一案件标识号。到达时用此号码向法院书记员报到。" }
              }
            },
            "bailBondOrder": {
              "title": "保释/担保令",
              "description": "法院关于保释和释放条件的决定。",
              "purpose": "本文件说明您需要支付多少保释金、释放期间必须遵守的条件以及违反这些条件的后果。",
              "whatToDo": "严格遵守所有条件。违反可能导致重新逮捕和保释被撤销。保管好这份文件——上面列有您的下次开庭日期。",
              "sections": {
                "bailAmount": { "label": "保释金金额", "explanation": "释放您所需的金额。您可以支付全额（案件结束后退还），也可以找保释担保人（通常需支付10%的不可退还费用）。" },
                "conditions": { "label": "释放条件", "explanation": "保释期间必须遵守的规则——比如不得联系某些人、不得离开本州或接受药物检测。违反这些规定可能会让您重新入狱。" },
                "nextCourtDate": { "label": "下次开庭日期", "explanation": "您下次必须出庭的时间。缺席将导致保释金被没收并发出逮捕令。" }
              }
            },
            "discoveryDocuments": {
              "title": "证据开示文件",
              "description": "检方必须与辩方分享的证据。",
              "purpose": "这些是检察官计划在审判中用来指控您的所有材料。您的律师有权查看这些证据以准备辩护。",
              "whatToDo": "与您的律师仔细审阅这些文件。证据开示可以揭示检方案件中的薄弱环节或支持您无罪的证据。",
              "sections": {
                "policeReports": { "label": "警察报告", "explanation": "警官对事件的书面描述。这些报告中通常包含可以被质疑或被其他证据反驳的细节。" },
                "witnessStatements": { "label": "证人陈述", "explanation": "证人对警察所说的话。您的律师将分析这些内容的不一致之处，并为交叉询问做准备。" },
                "evidenceList": { "label": "证据清单", "explanation": "实物证据、视频、照片、实验室结果等。您的律师可以质疑这些证据的收集或解读方式。" }
              }
            },
            "pleaOffer": {
              "title": "认罪协议",
              "description": "检察官提出的不经审判解决案件的书面提议。",
              "purpose": "这是一项交易提议：对某些指控认罪以换取减轻处罚或撤销部分指控。大约90%的案件是通过认罪协议解决的。",
              "whatToDo": "在回复前与律师仔细讨论。考虑证据的强度、可能的审判结果和个人情况。您不必接受。",
              "sections": {
                "offeredCharges": { "label": "认罪的指控", "explanation": "您将承认有罪的具体指控。这些可能比您最初的指控轻。" },
                "recommendedSentence": { "label": "建议刑罚", "explanation": "检察官建议的处罚。注意：法官不一定要遵循这个建议。" },
                "deadline": { "label": "提议截止日期", "explanation": "您有多长时间接受这个协议。截止日期过后，提议可能会被撤回或变得更不利。" }
              }
            },
            "subpoena": {
              "title": "传票",
              "description": "要求您出庭或提供文件的法院命令。",
              "purpose": "这在法律上强制您作为证人作证或提交文件/记录。无视传票可能导致藐视法庭的指控。",
              "whatToDo": "请认真对待！如果您对作证有顾虑，请联系律师。除非法官准许，您必须在规定日期出庭。",
              "sections": {
                "appearanceRequired": { "label": "出庭要求", "explanation": "您必须出庭的时间和地点。这不是可选的——未出庭可能导致被逮捕。" },
                "documentsRequested": { "label": "要求提供的文件", "explanation": "您必须携带的具体记录或物品。「文件传票「要求您提交相关文件。" }
              }
            },
            "sentencingOrder": {
              "title": "判决令/判决书",
              "description": "定罪后写明您刑罚的正式文件。",
              "purpose": "这是法院对您处罚的最终决定——监禁时间、罚款、缓刑、社区服务等。它将成为您永久记录的一部分。",
              "whatToDo": "检查是否准确。了解您必须遵守的所有条件。知道上诉截止日期（通常为30天）。保管好这份文件。",
              "sections": {
                "sentenceImposed": { "label": "判处的刑罚", "explanation": "您的具体处罚——监禁时间、是否缓期执行，以及执行方式（直接服刑 vs. 工作释放等）。" },
                "finesRestitution": { "label": "罚款和赔偿", "explanation": "您需要支付的费用——法庭费用、罚款和对受害者的赔偿。这些是具有法律约束力的债务。" },
                "probationTerms": { "label": "缓刑条件", "explanation": "缓刑期间必须遵守的规则——向缓刑监督官报到、药物检测、旅行限制等。违反可能导致入狱。" },
                "appealRights": { "label": "上诉权利", "explanation": "关于您对定罪或刑罚提出上诉的权利的信息。您通常有30天时间提起上诉。" }
              }
            },
            "noticeToAppearI862": {
              "title": "出庭通知 (NTA)",
              "description": "启动驱逐程序的主要指控文件。",
              "purpose": "这是 ICE 正式通知您他们要驱逐您的文件。它要求您在移民法官面前出庭，并列出他们声称可以将您从美国遣返的理由。",
              "whatToDo": "立即找移民律师！记下您的 A 号码和听证日期。查看提供的免费法律服务清单。千万不要错过听证——缺席会导致自动驱逐令。",
              "sections": {
                "aNumber": { "label": "外国人登记号 (A-Number)", "explanation": "您在移民系统中的唯一9位数标识号。您需要用它在网上或电话查询案件状态。" },
                "charges": { "label": "移民指控", "explanation": "ICE 声称可以驱逐您的法律理由——签证过期、未经检查入境、刑事定罪等。" },
                "hearingInfo": { "label": "听证信息", "explanation": "移民法庭听证的日期、时间和地点。有时会显示「待定」，届时您会收到单独通知。" },
                "legalServices": { "label": "免费法律服务清单", "explanation": "您所在地区免费或低成本移民律师的联系信息。请立即联系。" }
              }
            },
            "recordDeportableAlienI213": {
              "title": "可驱逐/不可入境外国人记录",
              "description": "ICE 对您被逮捕和拘留原因的记录。",
              "purpose": "此文件记录了移民官员逮捕您的方式和原因，包括您所做的任何陈述。它经常被用作不利于您的证据。",
              "whatToDo": "与律师仔细审查此文件。检查事实中的错误。如果您未被适当告知权利，您所做的任何陈述都可以被质疑。",
              "sections": {
                "arrestCircumstances": { "label": "逮捕情况", "explanation": "ICE 逮捕您的方式、时间和地点。这可能包括他们是否持有适当的逮捕令。" },
                "statementsRecorded": { "label": "记录的陈述", "explanation": "ICE 说您在被逮捕时告诉他们的话。这些陈述可能被用来对付您，因此请与律师核实其准确性。" }
              }
            },
            "bondHearingNotice": {
              "title": "保释听证通知",
              "description": "关于您请求从移民拘留中释放的听证通知。",
              "purpose": "此通知告诉您何时可以请求移民法官设定保释金，以便在案件审理期间被释放。",
              "whatToDo": "准备证明您不会逃跑或构成危险的证据——社区关系、就业情况、在美国的家人等。律师可以大大提高您的机会。",
              "sections": {
                "hearingDate": { "label": "听证日期", "explanation": "您可以提出释放申请的时间。错过此日期意味着您将被拘留直到遣返听证。" },
                "eligibilityInfo": { "label": "资格信息", "explanation": "由于犯罪记录或其他因素，有些人可能没有资格获得保释。律师可以解释您的具体情况。" }
              }
            },
            "warrantOfRemovalI205": {
              "title": "遣返/驱逐令",
              "description": "授权 ICE 实际驱逐您的命令。",
              "purpose": "这意味着移民法官已下令遣返您，ICE 现在可以执行驱逐。此令在您败诉或放弃抗辩权之后发出。",
              "whatToDo": "立即联系律师了解上诉选项。您可能只有有限的时间（向 BIA 上诉的期限为30天）。查看您是否有资格获得任何救济或保护。",
              "sections": {
                "removalOrder": { "label": "遣返令", "explanation": "要求您离开美国的正式命令。它包括遣返您的法律依据。" },
                "appealDeadline": { "label": "上诉截止日期", "explanation": "您有多长时间来质疑此命令。错过截止日期可能会失去留下来抗辩的机会。" }
              }
            },
            "orderOfSupervisionI220B": {
              "title": "监管令",
              "description": "当您有遣返令但无法立即被驱逐时的释放条件。",
              "purpose": "如果您有最终驱逐令，但您的祖国不接受您或存在其他障碍，ICE 可能会在严格条件下释放您并进行监管。",
              "whatToDo": "严格遵守所有条件。按要求报到。违规可能导致重新拘留。继续与律师合作寻找其他选项。",
              "sections": {
                "reportingRequirements": { "label": "报到要求", "explanation": "您需要多久以及在哪里向 ICE 报到。错过报到可能导致立即被拘留。" },
                "travelRestrictions": { "label": "旅行限制", "explanation": "对您旅行范围的限制。通常未经许可不能离开所在地区，绝对不能离开美国。" }
              }
            },
            "expeditedRemovalI860": {
              "title": "快速遣返通知",
              "description": "无需法庭听证即可快速驱逐的命令。",
              "purpose": "此命令适用于在边境或边境附近被截获的没有有效入境文件的人。它允许在不见移民法官的情况下进行驱逐。",
              "whatToDo": "如果您担心回国后会受到迫害，您必须立即告诉官员。说「我害怕回到我的国家。「这将触发可信恐惧面谈。",
              "sections": {
                "removalGrounds": { "label": "遣返理由", "explanation": "ICE 声称可以快速遣返您的原因——通常是未经检查入境或使用伪造文件。" },
                "fearClaim": { "label": "恐惧申诉", "explanation": "如果您害怕回到自己的国家（担心暴力、迫害等），您必须表达这种恐惧才能获得听证机会。这是您避免立即被遣返的唯一机会。" }
              }
            },
            "guidance": {
              "documentsSection": {
                "title": "您应该拥有的文件",
                "description": "根据您的案件阶段，您应该已经收到了这些重要文件。点击任何文件了解更多。",
                "noneFound": "此阶段没有特定的预期文件。",
                "learnMore": "了解更多",
                "viewLibrary": "查看所有文件"
              }
            }
          },
          "chat": {
            "openChat": "打开法律指导对话",
            "progress": {
              "step": "第 {{current}} 步，共 {{total}} 步",
              "safety": "安全",
              "safetyDesc": "检查您是否需要紧急帮助",
              "location": "地点",
              "locationDesc": "告诉我们您的案件在哪里",
              "charges": "指控",
              "chargesDesc": "选择您面临的指控",
              "situation": "情况",
              "situationDesc": "您的案件阶段和当前状态",
              "details": "详情",
              "detailsDesc": "描述发生了什么以获取个性化指导"
            },
            "messages": {
              "welcome": "您好！我可以帮您了解您的法律状况。我们的对话内容是保密的，会在您的会话结束后被删除。\n\n您现在是否处于紧急情况？",
              "emergencyAdviceFull": "🚨 **如果您现在正在被逮捕或拘留：**\n\n**✅ 保持冷静**\n不要抗拒、逃跑或争辩。保持双手可见。抗拒可能导致额外指控，即使原来的逮捕后来被认定为不合法。\n\n**🔇 行使沉默权**\n清楚地说：「我行使我的沉默权。「\n您不需要回答关于您要去哪里、在做什么或住在哪里的问题。\n\n**⚖️ 要求律师**\n说：「我要找律师。「一旦您要求律师，警察必须停止对您的讯问。\n如果您负担不起律师费，可以在首次出庭时要求公设辩护人。\n\n**🚫 不要同意搜查**\n说：「我不同意任何搜查。「\n警察可能仍会搜查，但表明态度可以在以后保护您的权利。\n\n**📝 记住这些细节**\n记下警官的警号、巡逻车号和任何目击者信息。这些以后可能对您的案件有帮助。\n\n---\n**您接下来想做什么？**",
              "mainMenu": "有什么我可以帮助您的？",
              "stateQuestion": "让我为您提供个性化的指导。首先，您的案件在哪个州？",
              "chargeQuestion": "收到，{{state}}。您面临什么指控？请选择所有适用的。",
              "stageQuestion": "您的案件目前处于什么阶段？",
              "custodyQuestion": "您目前是被拘留还是已被释放？",
              "attorneyQuestion": "您是否已有律师或公设辩护人？",
              "descriptionPrompt": "感谢您提供的信息。现在，请简要描述发生了什么——这有助于我给您更有针对性的指导。\n\n（您的信息将由 AI 分析以提供指导。个人详细信息在处理前会被自动移除。会话结束后不会保存任何内容。）",
              "descriptionPromptWithWarning": "感谢您提供的信息。\n\n⚠️ **在您分享细节之前**\n\n我们希望您分享案件的具体信息以获得个性化指导。与和律师交谈不同，您在这里输入的内容不受保密特权保护，如果您在法庭上被问到，可能会被用来对付您。\n\n我们建议您先咨询律师。这一步是可选的——跳过此步仍然可以获得一般性指导。",
              "privilegeWarning": "⚠️ **在您分享细节之前**\n\n与和律师交谈不同，您在这里输入的内容不受保密特权保护，如果您在法庭上被问到，可能会被用来对付您。\n\n我们建议您先咨询律师。这一步是可选的——跳过此步仍然可以获得一般性指导。",
              "privilegeAcknowledged": "明白了。请描述发生了什么——不用着急。",
              "concernsQuestion": "您最担心什么？有什么具体问题吗？\n\n（例如：担心失去工作、负担不起律师费、什么时候必须出庭）",
              "generating": "谢谢。我现在正在分析您的情况并准备个性化指导。这可能需要一些时间……",
              "stillWorking": "仍在准备您的指导……复杂的法律情况需要仔细分析。感谢您的耐心。",
              "guidanceReady": "您的法律指导已准备好！我为您整理了情况摘要、重要截止日期、您的权利和建议的下一步行动。\n\n您可以导出保存以备记录。",
              "error": "抱歉，生成指导时遇到了问题。请重试或在问题持续时联系支持。",
              "immigrationSummary": "**移民执法信息**\n\n如果您担心移民执法，以下是您应该了解的：\n\n**您的权利：**\n• 您有权对自己的移民身份保持沉默\n• 没有司法搜查令，您不必给移民官员开门\n• 在回答问题之前，您有权与律师交谈\n\n**如果被 ICE 接触：**\n• 保持冷静，不要跑\n• 询问您是否可以自由离开\n• 未与律师交谈前不要签署任何文件\n• 记住接触过程的细节\n\n如需全面的移民指导，请访问我们的 [移民指导](/immigration-guidance) 页面。\n\n**还有什么我可以帮您的？**",
              "immigrationMenu": "关于移民方面有什么可以帮助您的？",
              "immigrationSituation": "我可以帮助您解答移民相关问题。**哪个最符合您的情况？**",
              "immigrationUrgent": {
                "reminder": "🚨 **紧急权利提醒：**\n\n• **保持冷静** - 不要跑或抗拒\n• **您有权保持沉默** - 您不必回答有关身份的问题\n• **询问您是否可以自由离开** - 如果可以，平静地走开\n• **不要签署任何东西** 除非您完全理解\n• **要求律师** 然后再回答问题\n\n**这发生在哪里？**",
                "atHome": "🏠 **您在家中的权利：**\n\n• **不要开门** 除非他们出示司法搜查令（由法官签署）\n• ICE 行政令（I-200 表格）不赋予他们进入的权利\n• 说：「我不同意你们进入我的家」\n• 如果他们强行进入，不要抗拒但声明您不同意\n• 如果可能，收集姓名和警号\n\n📞 **紧急联系方式：**\n• National Immigration Forum: 1-800-954-6287\n• ACLU: 发短信 \"IMMIGRANT\" 到 88823\n\n**立即联系移民律师：**",
                "atWork": "💼 **您在工作场所的权利：**\n\n• 您有权保持沉默\n• 要求查看搜查令——仔细阅读\n• 不要逃跑、撒谎或使用假证件\n• 您可以拒绝回答有关身份的问题\n• 记住：您可以要求律师在场\n\n📋 您的雇主不能因为您行使权利而报复您。\n\n**了解更多关于工作场所突袭和雇主责任的信息：**",
                "inPublic": "🚶 **您在公共场所/检查站的权利：**\n\n• 保持冷静，不要跑\n• 在检查站，可能会被问到公民身份\n• 您可以对移民身份保持沉默\n• 不要携带假证件\n• 如果被拘留，立即要求律师\n\n📞 **紧急联系方式：**\n• National Immigration Forum: 1-800-954-6287\n• DOJ Immigration Review: 1-800-898-7180\n\n**联系移民律师：**"
              },
              "immigrationPlanning": {
                "question": "**您在为谁做准备？**\n\n我们有资源帮助您做好准备：",
                "myself": "个人准备方面，请考虑：\n\n• 在任何接触之前**了解您的权利**\n• **准备一张紧急联系卡** 上面有律师信息\n• **将重要文件** 保存在安全且方便取用的地方\n• **制定家庭沟通计划**\n\n如果您有 DACA、TPS 或其他受保护身份，请关注续期和截止日期：",
                "family": "**家庭计划资源：**\n\n为家庭准备应对可能的移民执法：\n\n• 指定一个可信赖的人负责子女照顾决策\n• 准备授权委托书\n• 将重要文件的副本放在方便取用的地方\n• 制定家庭应急计划\n• 了解您孩子在学校的权利\n\n访问我们全面的家庭计划指南：",
                "workplace": "**工作场所准备：**\n\n为工作场所准备应对可能的 ICE 执法：\n\n• 了解司法搜查令和行政令的区别\n• 了解雇主和雇员的权利\n• 制定工作场所应对计划\n• 知道在哪里获得法律帮助\n\n访问我们的工作场所突袭指南："
              },
              "immigrationDetained": {
                "question": "**目前的拘留情况是什么？**",
                "iceDetention": "**如果在 ICE 拘留中：**\n\n📞 **您在拘留中的权利：**\n• 有权给家人和律师打电话\n• 有权联系您的领事馆\n• 有权要求保释听证（在大多数情况下）\n• 有权获得翻译\n\n💰 **保释信息：**\n• 保释金通常在 $1,500 到 $25,000 以上\n• 某些刑事定罪可能使您没有资格获得保释\n• 法官会考虑社区关系、逃跑风险和危险性\n\n**了解保释听证及如何准备：**",
                "countyJail": "**如果因移民拘押在县看守所：**\n\n📋 **这意味着什么：**\n• ICE 已要求看守所在您的刑事案件结束后将您拘留最多48小时\n• 这是一个请求，不是命令（在许多州）\n• 一些看守所拒绝执行这些拘留请求\n\n⚖️ **您的权利：**\n• 您仍然可以在刑事案件中申请保释\n• 询问您的刑事辩护律师关于移民后果\n• 您有权与移民律师交谈\n\n**了解保释听证：",
                "portOfEntry": "**在入境口岸（机场/边境）：**\n\n🛂 **重要信息：**\n• 在入境口岸适用不同的规则\n• CBP 在边境有更大的权力\n• 您仍然可以要求与律师交谈\n• 不要在不理解的情况下签署任何文件\n\n📞 **如果您是美国公民/绿卡持有者：**\n不能拒绝您入境，但可能会有延误。\n\n**立即联系移民律师：**",
                "result": "**重要提示：** 移民法非常复杂。一位有经验的移民律师可以对您的案件产生重大影响。\n\n📍 **查找经过验证的移民律师：**"
              },
              "rightsMenu": "您想了解哪个权利话题？",
              "rightsInfo": "**您的主要宪法权利：**\n\n🛡️ **沉默权**（第五修正案）\n您不能被强迫自证其罪。您所说的任何话都可能在法庭上被用作不利于您的证据。\n\n⚖️ **获得律师帮助的权利**（第六修正案）\n您有权获得律师帮助。如果您负担不起，法院将指定一名公设辩护人。\n\n📞 **打电话的权利**\n大多数州允许被登记入监后至少打一个电话联系家人或律师。\n\n📜 **知悉指控的权利**\n您必须被告知被指控的罪名。\n\n---\n如需更详细的信息，请访问我们的 [了解您的权利](/rights-info) 页面。\n\n**您接下来想做什么？**",
              "processInfo": "**刑事司法流程：**\n\n**1. 逮捕和入监**（0-48小时）\n您被拘留、采集指纹和拍照。可能被关押直到提审。\n\n**2. 提审**（逮捕后24-72小时）\n首次出庭，宣读指控，您做出答辩，设定保释金。\n\n**3. 审前阶段**（数周到数月）\n证据开示、认罪协商以及提交各种动议。\n\n**4. 审判**（如果没有认罪协议）\n在法官或陪审团面前出示证据，由他们决定是否有罪。\n\n**5. 量刑**（如果被定罪）\n法官根据量刑指南和案件情况决定处罚。\n\n**6. 上诉**（可选）\n您可以通过上级法院对判决或刑罚提出质疑。\n\n---\n如需完整指南，请访问我们的 [刑事司法流程](/process) 页面。\n\n**您接下来想做什么？**",
              "resourcesCategoryMenu": "您在寻找什么类型的资源？",
              "resourcesMenu": "您在寻找什么类型的资源？",
              "lawsMenu": "您想搜索什么？",
              "enterZipPD": "请输入您的邮政编码以查找附近的公设辩护人办公室：",
              "enterZipLegalAid": "请输入您的邮政编码以查找附近的法律援助组织：",
              "invalidZip": "请输入有效的5位数邮政编码。",
              "noPDFound": "未能在 {{zip}} 附近找到公设辩护人办公室。请尝试其他邮政编码或访问我们的 [资源页面](/diversion-programs) 了解更多选项。\n\n**还有什么我可以帮您的？**",
              "noLegalAidFound": "未能在 {{zip}} 附近找到法律援助组织。请尝试其他邮政编码或访问我们的 [资源页面](/diversion-programs) 了解更多选项。\n\n**还有什么我可以帮您的？**",
              "pdResults": "以下是 {{zip}} 附近的公设辩护人办公室：\n\n{{results}}\n\n**还有什么我可以帮您的？**",
              "legalAidResults": "以下是 {{zip}} 附近的法律援助组织：\n\n{{results}}\n\n**还有什么我可以帮您的？**",
              "searchError": "搜索时遇到了问题。您可以重试或查看其他选项。",
              "whatElse": "还有什么我可以帮您的？",
              "exportedWhatElse": "您的 PDF 已下载。\n\n**还有什么我可以帮您的？**",
              "followUpResponse": "这是个很好的问题。根据您告诉我的情况，以下是我的建议……",
              "whatToDoNow": "**您接下来想做什么？**",
              "verifiedAgainst": "✓ 已根据 {{state}} 刑事法规验证",
              "verifiedGeneric": "✓ 已根据官方刑事法规验证",
              "askFollowUpPrompt": "您现在可以在下方输入任何后续问题。"
            },
            "replies": {
              "urgentYes": "是的，我现在需要帮助",
              "urgentNo": "不急，我有时间慢慢说",
              "getHelp": "获取案件帮助",
              "knowRights": "了解我的权利",
              "findResources": "查找资源",
              "legalAidResources": "法律援助资源和支持",
              "personalizedGuidance": "个性化指导",
              "immigrationEnforcement": "移民执法",
              "rightsInfo": "权利信息",
              "resources": "资源",
              "lawsRecords": "法律和文件",
              "attorneyTools": "律师工具",
              "myRights": "我的权利",
              "criminalJusticeProcess": "刑事司法流程",
              "constitutionalRights": "宪法权利",
              "justiceProcess": "司法流程",
              "searchSeizure": "搜查和扣押",
              "helpingFamily": "帮助家人",
              "legalGlossary": "法律词汇表",
              "findPublicDefender": "查找公设辩护人",
              "legalAidOrgs": "法律援助机构",
              "diversionPrograms": "转处计划",
              "recordExpungement": "前科消除",
              "documentSummarizer": "文件摘要工具",
              "courtRecords": "法院记录搜索",
              "statutesSearch": "法规搜索",
              "documentLibrary": "文件库",
              "stageArrest": "刚被逮捕/正在调查中",
              "stageArraignment": "即将提审",
              "stagePretrial": "审前程序",
              "stageTrial": "已安排审判/审判进行中",
              "stageSentencing": "量刑阶段",
              "stageUnsure": "我不确定",
              "inCustody": "是的，在押中",
              "onBail": "已保释",
              "ownRecognizance": "自行释放",
              "notInCustody": "未被拘留",
              "hasAttorney": "是的，我有律师代理",
              "noAttorney": "没有，我需要找一个",
              "privilegeContinue": "我理解了，继续",
              "privilegeSkip": "跳过，获取一般性指导",
              "viewGuidance": "查看我的指导",
              "exportPdf": "导出为 PDF",
              "saveGuidance": "保存此指导",
              "findPublicDefenderAction": "查找公设辩护人",
              "findLegalAidAction": "查找附近的法律援助",
              "askFollowUp": "提出后续问题",
              "moreOptions": "探索其他话题",
              "retry": "重试",
              "tryAgain": "尝试其他邮政编码",
              "immUrgent": "正在经历执法行动",
              "immPlanning": "计划/准备中",
              "immDetained": "已被拘留/在诉讼中",
              "immGeneralInfo": "只想了解一般信息",
              "immAtHome": "在家中",
              "immAtWork": "在工作中",
              "immInPublic": "在公共场所/检查站",
              "immMyself": "我自己",
              "immFamily": "我的家人",
              "immWorkplace": "我的工作场所",
              "immIceDetention": "在 ICE 拘留中",
              "immCountyJail": "因移民拘押在县看守所",
              "immPortOfEntry": "在入境口岸",
              "immFindAttorney": "查找移民律师",
              "immDacaTps": "DACA/TPS 信息",
              "immFamilyPlanning": "家庭计划指南",
              "immWorkplaceRaids": "工作场所突袭指南",
              "immBondHearings": "保释听证信息",
              "immBackToHub": "返回移民中心",
              "immGeneralHub": "一般信息",
              "immSituationalGuides": "情景指南",
              "immKnowYourRights": "了解您的权利",
              "immFindDetained": "查找被拘留人员",
              "immFindLawyer": "查找律师"
            },
            "header": {
              "title": "法律指导对话",
              "subtitle": "私密且安全"
            },
            "input": {
              "placeholder": "提出后续问题……",
              "selectOption": "选择上方的选项以继续",
              "answering": "完成当前步骤以继续",
              "descriptionPlaceholder": "描述发生了什么……",
              "concernsPlaceholder": "您最担心什么？",
              "zipPlaceholder": "输入5位数邮政编码……"
            },
            "voice": {
              "listening": "正在听……",
              "startListening": "开始语音输入",
              "stopListening": "停止语音输入",
              "recordingHint": "请说话……完成后再次点击麦克风。",
              "notSupported": "不支持语音输入",
              "notSupportedDesc": "您的浏览器不支持语音输入。请使用 Chrome、Edge 或 Safari 等现代浏览器。",
              "permissionDenied": "麦克风权限被拒绝",
              "permissionDeniedDesc": "请在浏览器设置中允许麦克风权限以使用语音输入。",
              "networkError": "语音输入不可用",
              "networkErrorDesc": "语音识别需要网络连接。请改为输入文字。",
              "error": "语音输入错误",
              "errorDesc": "语音输入出现错误，请重试。"
            },
            "footer": {
              "privacy": "您的信息是私密的，会话结束后将被删除"
            },
            "exitWarning": {
              "title": "您有尚未导出的指导内容",
              "description": "如果您在未导出的情况下离开，您的指导内容将丢失。"
            },
            "export": {
              "noData": "没有可导出的指导内容",
              "success": "PDF 下载成功",
              "error": "导出 PDF 失败"
            },
            "stateSelector": {
              "placeholder": "搜索您所在的州……",
              "noResults": "未找到相关州"
            },
            "chargeSelector": {
              "title": "选择指控",
              "selected": "已选",
              "available": "可选",
              "searchPlaceholder": "搜索所有指控……",
              "loading": "正在加载指控……",
              "noResults": "未找到匹配的指控",
              "noCharges": "没有可用的指控",
              "selectAtLeast": "请至少选择一项指控",
              "continue": "继续，已选 {{count}} 项指控",
              "categories": {
                "all": "全部",
                "felony": "重罪",
                "misdemeanor": "轻罪",
                "infraction": "违章"
              }
            },
            "casePanel": {
              "title": "您的案件信息",
              "state": "州",
              "charges": "指控",
              "stage": "阶段",
              "custody": "拘留状态",
              "attorney": "律师",
              "hasAttorney": "有",
              "noAttorney": "没有",
              "urgentSituation": "紧急情况",
              "stages": {
                "arrest": "调查/逮捕",
                "arraignment": "提审",
                "pretrial": "审前",
                "trial": "审判",
                "sentencing": "量刑",
                "appeal": "上诉",
                "unsure": "未知"
              },
              "custody_status": {
                "yes": "在押中",
                "bail": "已保释",
                "recognizance": "自行释放",
                "no": "未被拘留"
              }
            }
          },
          "exportWarning": {
            "title": "重要提示：导出前请注意",
            "intro": "本文件包含您提供的法律情况详情。请注意以下事项：",
            "notLegalAdvice": "这不是法律建议",
            "notLegalAdviceDesc": "仅为一般性法律信息",
            "notPrivileged": "不受律师-客户保密特权保护",
            "notPrivilegedDesc": "您创建和分享的文件可能会在法律诉讼中被对方要求提供",
            "shareWithAttorney": "仅与您的律师分享",
            "shareWithAttorneyDesc": "如果您有律师，请先与他们分享，然后再给其他人",
            "recommendation": "我们建议在采取任何行动之前，先与持证律师讨论此指导内容。",
            "confirmButton": "我已了解，导出 PDF"
          },
          "attorneyPortal": {
            "hero": {
              "title": "律师工具",
              "subtitle": "为代理刑事和移民案件的持证律师提供的资源和工具。"
            },
            "disclaimer": "这些工具专为持证律师设计。文件生成功能需要确认律师执照资格。",
            "comingSoon": "即将推出",
            "documentGeneration": {
              "title": "文件生成",
              "description": "AI 驱动的常见刑事和移民文书起草工具。生成针对您客户案件量身定制的动议、通知和其他文件。",
              "feature1": "延期动议、证据开示动议、减少保释金动议",
              "feature2": "移民法庭文书（EOIR-28、保释备忘录）",
              "feature3": "特定管辖区格式",
              "getStarted": "开始使用",
              "button": "即将推出"
            },
            "courtRecords": {
              "title": "法院记录查询",
              "description": "通过 PACER 搜索联邦法院记录，并通过 RECAP 免费获取文件。研究案件历史、案卷条目和已提交的文件。",
              "feature1": "联邦法院 PACER 集成",
              "feature2": "通过 RECAP 档案免费访问",
              "feature3": "案卷搜索和文件检索",
              "button": "搜索法院记录"
            },
            "sharedResources": {
              "title": "共享资源",
              "description": "这些资源对所有人开放，可能对您的执业有所帮助。",
              "statutes": "法规查询",
              "statutesDesc": "搜索州和联邦法律",
              "documents": "文件库",
              "documentsDesc": "法律表格和模板",
              "glossary": "法律词汇表",
              "glossaryDesc": "法律术语定义",
              "courts": "法院定位",
              "courtsDesc": "查找法院位置"
            },
            "guidanceNote": {
              "title": "个性化指导",
              "description": "我们的 AI 指导对话也面向律师开放，可以快速了解客户情况或查询权利和程序。",
              "button": "获取指导"
            },
            "verify": {
              "title": "律师身份验证",
              "subtitle": "请验证您的律师执照以使用文件生成工具。",
              "backToPortal": "返回律师门户",
              "formTitle": "律师身份验证",
              "formDescription": "确认所需的认证声明以使用律师文件工具。",
              "attestationsTitle": "所需认证声明",
              "attestation1": "我是一名持有有效执照的律师，目前在州律师协会中信誉良好，我正在代表我的客户使用这些工具。",
              "attestation2": "我正在代表我的客户使用这些工具。",
              "attestation3": "我理解律师-客户保密特权的保护取决于对这些工具的正确使用。",
              "attestation4": "我接受",
              "termsOfService": "服务条款",
              "tosTitle": "律师工具服务条款",
              "tosSubtitle": "请在接受前仔细阅读。",
              "tosContent": "使用这些律师工具即表示您确认并同意以下内容：",
              "privacyNotice": "您的会话数据将在30分钟后自动删除。",
              "verifying": "正在验证……",
              "submit": "验证并继续"
            },
            "session": {
              "expiresIn": "会话到期时间",
              "checking": "正在检查会话……",
              "redirecting": "正在跳转到验证页面……"
            },
            "documents": {
              "title": "文件生成",
              "subtitle": "AI 驱动的刑事和移民案件文书起草工具。",
              "barState": "执照所在州",
              "criminal": "刑事",
              "immigration": "移民",
              "sessionNote": "您的会话将在30分钟无活动后自动结束。",
              "endSession": "结束会话",
              "comingSoonTitle": "模板即将推出",
              "criminalComingSoon": "刑事法律模板包括延期动议、证据开示请求和减少保释金动议，正在开发中。",
              "immigrationComingSoon": "移民模板包括 EOIR-28 表格、保释备忘录和变更审理地点动议，正在开发中。"
            }
          }        }
      }
    }
  });

export default i18n;
