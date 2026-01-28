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
              "privacyNotice": "Your responses are not stored and are deleted when you close your session",
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
                "notPrivate": "Unlike talking to a lawyer, what you type here is not private and could be used against you if you're ever asked about it in court.",
                "recommendation": "We recommend speaking with a lawyer first. This step is optional—skip it to still receive general guidance.",
                "continueAnyway": "Continue Anyway",
                "skipAndGetGuidance": "Skip & Get General Guidance",
                "findLawyer": "Help Me Find a Lawyer"
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
                "description": "AI-powered document drafting for licensed attorneys. Motions, notices, and filings for criminal and immigration cases with jurisdiction-specific formatting (CA, NY, TX, FL initially).",
                "impact": "Reduces time burden on public defenders and legal aid attorneys handling high caseloads"
              },
              "additionalLanguages": {
                "title": "Additional Language Support",
                "description": "Expand beyond English and Spanish to include Chinese, Vietnamese, Korean, Tagalog, and other languages common in immigrant communities.",
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
              "lastUpdated": "Last Updated: January 21, 2026"
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
                  "anthropic": "Anthropic Claude Sonnet 4 - for generating legal guidance. Your personal information is removed before processing. Anthropic may retain redacted data for up to 7 days for safety monitoring, then it is permanently deleted. This data is never used to train AI models.",
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
            "immBackToHub": "Back to Immigration Hub"
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
            "feature3": "Jurisdiction-specific formatting (CA, NY, TX, FL)",
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
            "attestation1": "I am a licensed attorney in good standing with my state bar association.",
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
              "privacyNotice": "Sus respuestas no se almacenan y se eliminan cuando cierra su sesión",
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
                "notPrivate": "A diferencia de hablar con un abogado, lo que escriba aquí no es privado y podría usarse en su contra si alguna vez se le pregunta en la corte.",
                "recommendation": "Recomendamos hablar primero con un abogado. Este paso es opcional—omítalo para recibir orientación general.",
                "continueAnyway": "Continuar de Todos Modos",
                "skipAndGetGuidance": "Omitir y Obtener Orientación General",
                "findLawyer": "Ayúdeme a Encontrar un Abogado"
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
                "description": "Redacción de documentos impulsada por IA para abogados licenciados. Mociones, notificaciones y presentaciones para casos penales e inmigratorios con formato específico de jurisdicción (CA, NY, TX, FL inicialmente).",
                "impact": "Reduce la carga de tiempo para defensores públicos y abogados de asistencia legal con altas cargas de casos"
              },
              "additionalLanguages": {
                "title": "Soporte de Idiomas Adicionales",
                "description": "Expandir más allá del inglés y español para incluir chino, vietnamita, coreano, tagalo y otros idiomas comunes en comunidades inmigrantes.",
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
              "lastUpdated": "Última actualización: 21 de enero de 2026"
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
                  "anthropic": "Anthropic Claude Sonnet 4 - para generar orientación legal. Su información personal se elimina antes del procesamiento. Anthropic puede retener los datos anonimizados hasta 7 días para monitoreo de seguridad, luego se eliminan permanentemente. Estos datos nunca se usan para entrenar modelos de IA.",
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
            "immBackToHub": "Volver al Centro de Inmigración"
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
            "feature3": "Formato específico por jurisdicción (CA, NY, TX, FL)",
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
            "attestation1": "Soy un abogado con licencia en buena posición con mi colegio de abogados estatal.",
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
    }
  });

export default i18n;
