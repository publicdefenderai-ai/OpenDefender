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
              "getGuidance": "Get Guidance",
              "getGuidanceDesc": "Start personalized legal assessment",
              "learnRights": "Learn Your Rights",
              "learnRightsDesc": "Understand your constitutional rights",
              "immigration": "Immigration Assistance",
              "immigrationDesc": "Immigration enforcement guidance",
              "courtRecords": "Court Records Search",
              "courtRecordsDesc": "Search free RECAP archive & case law",
              "recapExtensions": "RECAP Extensions",
              "recapExtensionsDesc": "Free browser tools for PACER"
            },
            "language": "Language"
          },
          "home": {
            "hero": {
              "title1": "Know Your Rights.",
              "title2": "Protect Your Future.",
              "subtitle": "Get free legal guidance, understand court processes, and access resources to help navigate the criminal justice system.",
              "urgentHelpButton": "URGENT HELP NEEDED",
              "getStartedButton": "GET STARTED",
              "navigatingToolButton": "Navigating This Tool",
              "urgentHelpNotice": "If you're being arrested or in court now, click \"Urgent Help\" for immediate rights information."
            },
            "features": {
              "title": "Powered by Real Legal Data",
              "subtitle": "Our AI agent uses comprehensive legal databases and court records to provide accurate, up-to-date information.",
              "federalCourts": "Federal Court Records",
              "federalCourtsDesc": "Access to 500M+ federal court documents through PACER and CourtListener APIs, including case law, dockets, and judicial data.",
              "federalCourtsStatus": "Live Data Integration",
              "stateLaws": "State & Local Laws",
              "stateLawsDesc": "Federal and state statutes from Cornell LII, GovInfo.gov, and state legislature websites with regular updates.",
              "stateLawsStatus": "Updated Monthly",
              "analytics": "Criminal Justice Analytics",
              "analyticsDesc": "DOJ APIs, Bureau of Justice Statistics, and state-specific datasets for sentencing guidelines and case outcomes.",
              "analyticsStatus": "Mock Data (Development)"
            },
            "trust": {
              "title": "Built on Trust & Transparency",
              "subtitle": "Every piece of legal information is backed by credible sources",
              "verifiedTitle": "Verified Citations",
              "verifiedDesc": "All legal statements include proper citations to statutes, case law, and regulations",
              "privacyTitle": "Privacy Protected",
              "privacyDesc": "No personal information stored, all session data automatically deleted",
              "currentTitle": "Current Information",
              "currentDesc": "Legal databases updated regularly to reflect the latest laws and procedures",
              "disclaimerTitle": "Important Legal Disclaimer:",
              "disclaimerText": "This AI agent provides general legal information only and is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific situation. The information provided may not reflect the most recent legal developments and should not be relied upon as legal counsel."
            },
            "urgentHelp": {
              "modalTitle": "Urgent Legal Situation",
              "arrestWarning": "If you are being arrested RIGHT NOW:",
              "arrestWarningText": "You have the right to remain silent and the right to an attorney. Exercise these rights immediately.",
              "immediateActions": "Immediate Actions:",
              "stayCalmTitle": "1. Stay Calm",
              "stayCalmText": "Do not resist arrest. Keep your hands visible. Follow instructions calmly.",
              "assertRightsTitle": "2. Assert Your Rights",
              "assertRightsText1": "Say clearly: \"I am exercising my right to remain silent. I want to speak to an attorney.\"",
              "assertRightsText2": "Then stop talking to police. Do not answer questions until you have a lawyer.",
              "noConsentTitle": "3. Do NOT Consent to Searches",
              "noConsentText": "Say: \"I do not consent to any searches.\" Do not physically resist, but make your refusal clear.",
              "publicDefenderTitle": "4. Request a Public Defender",
              "publicDefenderText": "If you cannot afford an attorney, you have the right to a free public defender. Request one immediately at your first court appearance.",
              "rememberTitle": "Remember:",
              "rememberText": "Anything you say can and will be used against you in court. The best protection is to remain silent until you have legal representation."
            },
            "whatWeDo": {
              "title": "What We Do",
              "subtitle": "Public Defender AI helps individuals understand their legal rights and navigate the criminal justice system.",
              "card1Title": "AI Legal Guidance",
              "card1Desc": "Get personalized legal information based on your specific situation",
              "card2Title": "Rights Information",
              "card2Desc": "Learn about your constitutional rights during arrest and court proceedings",
              "card3Title": "Find Resources",
              "card3Desc": "Locate public defenders, legal aid organizations, and court information"
            },
            "cta": {
              "title": "Ready to Get Started?",
              "subtitle": "Access free legal guidance and resources tailored to your situation.",
              "button": "Start Legal Assessment"
            },
            "knowRights": {
              "title": "Know Your Rights",
              "subtitle": "Understanding your constitutional rights is the first step to protecting yourself.",
              "rightToRemainSilent": "Right to Remain Silent",
              "rightToRemainSilentDesc": "You don't have to answer questions without a lawyer present",
              "rightToAttorney": "Right to an Attorney",
              "rightToAttorneyDesc": "You have the right to legal representation, even if you can't afford it",
              "rightToFairTrial": "Right to a Fair Trial",
              "rightToFairTrialDesc": "You're entitled to due process and an impartial jury",
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
              "cornellDesc": "US Constitution, federal statutes, and legal resources"
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
              "servicesOffered": "Services Offered"
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
            "termsOfService": "Terms of Service",
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
            "save": "Save"
          }
        }
      },
      es: {
        translation: {
          "header": {
            "title": "Defensor Público IA",
            "subtitle": "Orientación Legal Gratuita e Información sobre sus Derechos",
            "menu": {
              "getGuidance": "Obtener Orientación",
              "getGuidanceDesc": "Iniciar evaluación legal personalizada",
              "learnRights": "Conozca sus Derechos",
              "learnRightsDesc": "Entienda sus derechos constitucionales",
              "immigration": "Asistencia Migratoria",
              "immigrationDesc": "Orientación sobre cumplimiento de inmigración",
              "courtRecords": "Búsqueda de Registros Judiciales",
              "courtRecordsDesc": "Buscar en archivo RECAP gratuito y jurisprudencia",
              "recapExtensions": "Extensiones RECAP",
              "recapExtensionsDesc": "Herramientas gratuitas para navegador PACER"
            },
            "language": "Idioma"
          },
          "home": {
            "hero": {
              "title1": "Conozca sus Derechos.",
              "title2": "Proteja su Futuro.",
              "subtitle": "Obtenga orientación legal gratuita, entienda los procesos judiciales y acceda a recursos para navegar el sistema de justicia penal.",
              "urgentHelpButton": "AYUDA URGENTE NECESARIA",
              "getStartedButton": "COMENZAR",
              "navigatingToolButton": "Cómo Usar Esta Herramienta",
              "urgentHelpNotice": "Si está siendo arrestado o está en la corte ahora, haga clic en \"Ayuda Urgente\" para información inmediata sobre sus derechos."
            },
            "features": {
              "title": "Respaldado por Datos Legales Reales",
              "subtitle": "Nuestro agente de IA utiliza bases de datos legales exhaustivas y registros judiciales para proporcionar información precisa y actualizada.",
              "federalCourts": "Registros Judiciales Federales",
              "federalCourtsDesc": "Acceso a más de 500M de documentos judiciales federales a través de las API de PACER y CourtListener, incluyendo jurisprudencia, expedientes y datos judiciales.",
              "federalCourtsStatus": "Integración de Datos en Vivo",
              "stateLaws": "Leyes Estatales y Locales",
              "stateLawsDesc": "Estatutos federales y estatales del Instituto Legal Cornell, GovInfo.gov y sitios web de legislaturas estatales con actualizaciones regulares.",
              "stateLawsStatus": "Actualizado Mensualmente",
              "analytics": "Análisis de Justicia Penal",
              "analyticsDesc": "API del DOJ, Oficina de Estadísticas de Justicia y conjuntos de datos específicos del estado para pautas de sentencia y resultados de casos.",
              "analyticsStatus": "Datos Simulados (Desarrollo)"
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
              "disclaimerTitle": "Descargo de Responsabilidad Legal Importante:",
              "disclaimerText": "Este agente de IA proporciona información legal general únicamente y no sustituye el asesoramiento legal profesional. Siempre consulte con un abogado calificado para su situación específica. La información proporcionada puede no reflejar los desarrollos legales más recientes y no debe utilizarse como asesoría legal."
            },
            "urgentHelp": {
              "modalTitle": "Situación Legal Urgente",
              "arrestWarning": "Si está siendo arrestado AHORA MISMO:",
              "arrestWarningText": "Tiene derecho a permanecer en silencio y derecho a un abogado. Ejerza estos derechos inmediatamente.",
              "immediateActions": "Acciones Inmediatas:",
              "stayCalmTitle": "1. Mantenga la Calma",
              "stayCalmText": "No resista el arresto. Mantenga sus manos visibles. Siga las instrucciones con calma.",
              "assertRightsTitle": "2. Haga Valer sus Derechos",
              "assertRightsText1": "Diga claramente: \"Estoy ejerciendo mi derecho a permanecer en silencio. Quiero hablar con un abogado.\"",
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
              "servicesOffered": "Servicios Ofrecidos"
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
            "termsOfService": "Términos de Servicio",
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
            "learnMore": "Más Información",
            "getStarted": "Comenzar",
            "back": "Atrás",
            "next": "Siguiente",
            "save": "Guardar"
          }
        }
      }
    }
  });

export default i18n;
