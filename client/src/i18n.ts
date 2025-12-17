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
              }
            },
            "dashboard": {
              "title": "Legal Guidance Dashboard",
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
                "title": "Case Timeline"
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
                "title": "Laws and Records",
                "description": "Find statutes, case law, and court records"
              }
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
              "backButton": "Back to Main Menu",
              "publicDefender": "Find Public Defender",
              "legalAidOrgs": "Legal Aid Organizations",
              "diversionPrograms": "Diversion Programs",
              "recordsExpungement": "Records Expungement"
            },
            "lawsRecordsSubmenu": {
              "title": "Laws and Records",
              "backButton": "Back to Main Menu",
              "courtRecords": "Court Records Search",
              "statutes": "Statutes Search"
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
                "description": "Advanced AI system for generating personalized legal guidance based on case parameters",
                "impact": "Core functionality for personalized legal assistance",
                "challenges": {
                  "accuracy": "Legal accuracy validation",
                  "bias": "Bias detection and mitigation",
                  "jurisdiction": "Jurisdiction-specific nuances"
                }
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
              "multilingual": {
                "title": "Multi-language Support",
                "description": "Translation system for Spanish, French, and other common languages in criminal justice",
                "impact": "Expanded access for non-English speaking defendants"
              },
              "legalAidDirectory": {
                "title": "Legal Aid Organization Directory",
                "description": "Comprehensive database of public defenders and legal aid organizations nationwide",
                "impact": "Direct connection to legal representation resources"
              },
              "realTimeAlerts": {
                "title": "Real-time Case Alerts",
                "description": "Notification system for court dates, deadline changes, and case updates",
                "impact": "Prevention of missed court appearances and deadlines"
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
              "lastUpdated": "Last Updated: December 5, 2025"
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
                  "anthropic": "Anthropic Claude AI - for generating legal guidance (with PII redacted before processing)",
                  "govInfo": "GovInfo.gov API - for federal criminal statutes (Title 18 USC)",
                  "courtListener": "CourtListener API - for case law and court data",
                  "recap": "RECAP Archive - for federal court documents",
                  "cornell": "Cornell Legal Information Institute - for legal statutes",
                  "openLaws": "OpenLaws API - for state statute metadata"
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
          "chat": {
          "messages": {
            "welcome": "Hi! I'm here to help you understand your legal situation. Everything we discuss stays private and is deleted after your session.\n\nAre you in an urgent situation right now?",
            "emergencyAdviceFull": "🚨 **If you're being arrested or detained right now:**\n\n**✅ Stay Calm**\nDo not resist, run, or argue. Keep your hands visible. Resisting can lead to additional charges, even if the original arrest is later found to be unlawful.\n\n**🔇 Exercise Your Right to Remain Silent**\nSay clearly: \"I am exercising my right to remain silent.\"\nYou do NOT have to answer questions about where you're going, what you're doing, or where you live.\n\n**⚖️ Request an Attorney**\nSay: \"I want a lawyer.\" Police must stop questioning you once you ask for an attorney.\nIf you can't afford one, you can request a public defender at your first court appearance.\n\n**🚫 Do Not Consent to Searches**\nSay: \"I do not consent to any searches.\"\nPolice may search anyway, but stating this protects your rights for later.\n\n**📝 Remember These Details**\nNote the officers' badge numbers, patrol car numbers, and any witness information. This can help your case later.\n\n---\n**What would you like to do next?**",
            "mainMenu": "What can I help you with?",
            "stateQuestion": "Let's get you personalized guidance. First, what state is your case in?",
            "chargeQuestion": "Got it, {{state}}. What charges are you facing? Select all that apply.",
            "stageQuestion": "What stage is your case in?",
            "custodyQuestion": "Are you currently in custody or have you been released?",
            "attorneyQuestion": "Do you have an attorney or public defender?",
            "descriptionPrompt": "Thanks for that information. Now, briefly describe what happened - this helps me give you more relevant guidance.\n\n(Your description is kept private and deleted after this session)",
            "concernsQuestion": "What are you most worried about? Any specific questions?\n\n(For example: losing your job, affording a lawyer, when you have to go to court)",
            "generating": "Thank you. I'm now reviewing your situation and preparing your personalized guidance. This may take a moment...",
            "guidanceReady": "Your legal guidance is ready! I've put together a summary of your situation, important deadlines, your rights, and recommended next steps.\n\nYou can export this to keep for your records.",
            "error": "I'm sorry, I encountered an issue generating your guidance. Please try again or contact support if the problem continues.",
            "immigrationSummary": "**Immigration Enforcement Information**\n\nIf you're worried about immigration enforcement, here's what you should know:\n\n**Your Rights:**\n• You have the right to remain silent about your immigration status\n• You don't have to open your door to immigration officers without a judicial warrant\n• You have the right to speak to a lawyer before answering questions\n\n**If Approached by ICE:**\n• Stay calm and don't run\n• Ask if you are free to leave\n• Don't sign any documents without speaking to a lawyer\n• Remember details about the encounter\n\nFor comprehensive immigration guidance, visit our full [Immigration Guidance](/immigration-guidance) page.\n\n**What else can I help you with?**",
            "rightsMenu": "Which rights topic would you like to learn about?",
            "rightsInfo": "**Your Key Constitutional Rights:**\n\n🛡️ **Right to Remain Silent** (5th Amendment)\nYou cannot be forced to testify against yourself. Anything you say can be used against you in court.\n\n⚖️ **Right to an Attorney** (6th Amendment)\nYou have the right to a lawyer. If you can't afford one, the court will appoint a public defender.\n\n📞 **Right to a Phone Call**\nMost states allow at least one phone call after booking to contact family or an attorney.\n\n📜 **Right to Know the Charges**\nYou must be told what crimes you're accused of.\n\n---\nFor more detailed information, visit our [Know Your Rights](/rights-info) page.\n\n**What would you like to do next?**",
            "processInfo": "**The Criminal Justice Process:**\n\n**1. Arrest & Booking** (0-48 hours)\nYou're taken into custody, fingerprinted, and photographed. You may be held until arraignment.\n\n**2. Arraignment** (24-72 hours after arrest)\nFirst court appearance where charges are read, you enter a plea, and bail is set.\n\n**3. Pre-Trial** (Weeks to months)\nDiscovery of evidence, plea negotiations, and motions are filed.\n\n**4. Trial** (If no plea deal)\nEvidence is presented before a judge or jury who decides guilt.\n\n**5. Sentencing** (If convicted)\nJudge determines punishment based on guidelines and circumstances.\n\n**6. Appeal** (Optional)\nYou can challenge the verdict or sentence through higher courts.\n\n---\nFor a complete guide, visit our [Criminal Justice Process](/process) page.\n\n**What would you like to do next?**",
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
            "followUpResponse": "That's a great question. Based on what you've told me, here's what I'd suggest..."
          },
          "replies": {
            "urgentYes": "Yes, I need help right now",
            "urgentNo": "No, I have time to talk",
            "getHelp": "Get Help with My Case",
            "knowRights": "Know My Rights",
            "findResources": "Find Resources",
            "personalizedGuidance": "Personalized Guidance",
            "immigrationEnforcement": "Immigration Enforcement",
            "rightsInfo": "Rights Info",
            "resources": "Resources",
            "lawsRecords": "Laws & Records",
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
            "viewGuidance": "View My Guidance",
            "exportPdf": "Export as PDF",
            "retry": "Try Again",
            "tryAgain": "Try Another ZIP Code"
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
              }
            },
            "dashboard": {
              "title": "Panel de Orientación Legal",
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
                "title": "Cronología del Caso"
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
                "title": "Leyes y Registros",
                "description": "Buscar estatutos, jurisprudencia y registros judiciales"
              }
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
              "backButton": "Volver al Menú Principal",
              "publicDefender": "Encontrar Defensor Público",
              "legalAidOrgs": "Organizaciones de Asistencia Legal",
              "diversionPrograms": "Programas de Desviación",
              "recordsExpungement": "Eliminación de Antecedentes"
            },
            "lawsRecordsSubmenu": {
              "title": "Leyes y Registros",
              "backButton": "Volver al Menú Principal",
              "courtRecords": "Búsqueda de Registros Judiciales",
              "statutes": "Búsqueda de Estatutos"
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
                "description": "Sistema avanzado de IA para generar orientación legal personalizada basada en parámetros de caso",
                "impact": "Funcionalidad central para asistencia legal personalizada",
                "challenges": {
                  "accuracy": "Validación de precisión legal",
                  "bias": "Detección y mitigación de sesgos",
                  "jurisdiction": "Matices específicos de jurisdicción"
                }
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
              "multilingual": {
                "title": "Soporte Multilingüe",
                "description": "Sistema de traducción para español, francés y otros idiomas comunes en justicia penal",
                "impact": "Acceso ampliado para acusados que no hablan inglés"
              },
              "legalAidDirectory": {
                "title": "Directorio de Organizaciones de Asistencia Legal",
                "description": "Base de datos completa de defensores públicos y organizaciones de asistencia legal a nivel nacional",
                "impact": "Conexión directa a recursos de representación legal"
              },
              "realTimeAlerts": {
                "title": "Alertas de Casos en Tiempo Real",
                "description": "Sistema de notificaciones para fechas de audiencia, cambios de plazos y actualizaciones de casos",
                "impact": "Prevención de ausencias a comparecencias judiciales y plazos vencidos"
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
              "lastUpdated": "Última actualización: 5 de diciembre de 2025"
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
                  "anthropic": "Anthropic Claude AI - para generar orientación legal (con información personal eliminada antes del procesamiento)",
                  "govInfo": "API de GovInfo.gov - para estatutos penales federales (Título 18 USC)",
                  "courtListener": "API de CourtListener - para jurisprudencia y datos judiciales",
                  "recap": "Archivo RECAP - para documentos judiciales federales",
                  "cornell": "Instituto de Información Legal de Cornell - para estatutos legales",
                  "openLaws": "API de OpenLaws - para metadatos de estatutos estatales"
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
          "chat": {
          "messages": {
            "welcome": "¡Hola! Estoy aquí para ayudarle a entender su situación legal. Todo lo que hablemos es privado y se elimina después de su sesión.\n\n¿Está en una situación urgente ahora mismo?",
            "emergencyAdviceFull": "🚨 **Si está siendo arrestado o detenido ahora mismo:**\n\n**✅ Mantenga la Calma**\nNo resista, corra ni discuta. Mantenga las manos visibles. Resistirse puede resultar en cargos adicionales, incluso si el arresto original luego se considera ilegal.\n\n**🔇 Ejerza su Derecho a Permanecer en Silencio**\nDiga claramente: \"Estoy ejerciendo mi derecho a permanecer en silencio.\"\nNO tiene que responder preguntas sobre adónde va, qué está haciendo o dónde vive.\n\n**⚖️ Solicite un Abogado**\nDiga: \"Quiero un abogado.\" La policía debe dejar de interrogarlo una vez que pida un abogado.\nSi no puede pagar uno, puede solicitar un defensor público en su primera comparecencia ante el tribunal.\n\n**🚫 No Consienta Registros**\nDiga: \"No consiento ningún registro.\"\nLa policía puede registrar de todos modos, pero decir esto protege sus derechos para después.\n\n**📝 Recuerde Estos Detalles**\nAnote los números de placa de los oficiales, números de patrulla y cualquier información de testigos. Esto puede ayudar su caso después.\n\n---\n**¿Qué le gustaría hacer ahora?**",
            "mainMenu": "¿En qué puedo ayudarle?",
            "stateQuestion": "Vamos a darle orientación personalizada. Primero, ¿en qué estado está su caso?",
            "chargeQuestion": "Entendido, {{state}}. ¿Qué cargos enfrenta? Seleccione todos los que apliquen.",
            "stageQuestion": "¿En qué etapa está su caso?",
            "custodyQuestion": "¿Está actualmente bajo custodia o ha sido liberado?",
            "attorneyQuestion": "¿Tiene un abogado o defensor público?",
            "descriptionPrompt": "Gracias por esa información. Ahora, describa brevemente lo que pasó - esto me ayuda a darle orientación más relevante.\n\n(Su descripción se mantiene privada y se elimina después de esta sesión)",
            "concernsQuestion": "¿Qué es lo que más le preocupa? ¿Alguna pregunta específica?\n\n(Por ejemplo: perder su trabajo, pagar un abogado, cuándo tiene que ir a la corte)",
            "generating": "Gracias. Ahora estoy revisando su situación y preparando su orientación personalizada. Esto puede tomar un momento...",
            "guidanceReady": "¡Su orientación legal está lista! He preparado un resumen de su situación, plazos importantes, sus derechos y próximos pasos recomendados.\n\nPuede exportar esto para guardarlo en sus registros.",
            "error": "Lo siento, encontré un problema al generar su orientación. Por favor intente de nuevo o contacte soporte si el problema continúa.",
            "immigrationSummary": "**Información sobre Aplicación de Inmigración**\n\nSi le preocupa la aplicación de inmigración, esto es lo que debe saber:\n\n**Sus Derechos:**\n• Tiene derecho a permanecer en silencio sobre su estatus migratorio\n• No tiene que abrir su puerta a oficiales de inmigración sin una orden judicial\n• Tiene derecho a hablar con un abogado antes de responder preguntas\n\n**Si es Abordado por ICE:**\n• Mantenga la calma y no corra\n• Pregunte si es libre de irse\n• No firme ningún documento sin hablar con un abogado\n• Recuerde detalles sobre el encuentro\n\nPara orientación completa sobre inmigración, visite nuestra página de [Guía de Inmigración](/immigration-guidance).\n\n**¿En qué más puedo ayudarle?**",
            "rightsMenu": "¿Sobre qué tema de derechos le gustaría aprender?",
            "rightsInfo": "**Sus Derechos Constitucionales Clave:**\n\n🛡️ **Derecho a Permanecer en Silencio** (5ta Enmienda)\nNo puede ser obligado a testificar contra sí mismo. Todo lo que diga puede usarse en su contra en la corte.\n\n⚖️ **Derecho a un Abogado** (6ta Enmienda)\nTiene derecho a un abogado. Si no puede pagar uno, la corte le asignará un defensor público.\n\n📞 **Derecho a una Llamada Telefónica**\nLa mayoría de los estados permiten al menos una llamada después del registro para contactar a la familia o un abogado.\n\n📜 **Derecho a Conocer los Cargos**\nDebe ser informado de qué crímenes se le acusa.\n\n---\nPara información más detallada, visite nuestra página [Conozca sus Derechos](/rights-info).\n\n**¿Qué le gustaría hacer ahora?**",
            "processInfo": "**El Proceso de Justicia Penal:**\n\n**1. Arresto y Registro** (0-48 horas)\nEs llevado a custodia, le toman huellas y fotografías. Puede ser retenido hasta la lectura de cargos.\n\n**2. Lectura de Cargos** (24-72 horas después del arresto)\nPrimera comparecencia ante el tribunal donde se leen los cargos, usted declara y se fija la fianza.\n\n**3. Pre-Juicio** (Semanas a meses)\nDescubrimiento de evidencia, negociaciones de acuerdo y se presentan mociones.\n\n**4. Juicio** (Si no hay acuerdo)\nSe presenta evidencia ante un juez o jurado que decide la culpabilidad.\n\n**5. Sentencia** (Si es condenado)\nEl juez determina el castigo basándose en guías y circunstancias.\n\n**6. Apelación** (Opcional)\nPuede impugnar el veredicto o sentencia a través de tribunales superiores.\n\n---\nPara una guía completa, visite nuestra página [Proceso de Justicia Penal](/process).\n\n**¿Qué le gustaría hacer ahora?**",
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
            "followUpResponse": "Esa es una gran pregunta. Basándome en lo que me ha dicho, esto es lo que sugeriría..."
          },
          "replies": {
            "urgentYes": "Sí, necesito ayuda ahora mismo",
            "urgentNo": "No, tengo tiempo para hablar",
            "getHelp": "Ayuda con Mi Caso",
            "knowRights": "Conocer Mis Derechos",
            "findResources": "Encontrar Recursos",
            "personalizedGuidance": "Orientación Personalizada",
            "immigrationEnforcement": "Aplicación de Inmigración",
            "rightsInfo": "Info de Derechos",
            "resources": "Recursos",
            "lawsRecords": "Leyes y Registros",
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
            "viewGuidance": "Ver Mi Orientación",
            "exportPdf": "Exportar como PDF",
            "retry": "Intentar de Nuevo",
            "tryAgain": "Probar Otro Código Postal"
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
        }
        }
      }
    }
  });

export default i18n;
