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
              "title": "Free Legal Guidance When You Need It Most",
              "subtitle": "Access your rights, understand your options, and find legal resources — all at no cost.",
              "urgentHelpButton": "Need Urgent Help?",
              "getStartedButton": "Get Started"
            },
            "urgentHelp": {
              "title": "Need Immediate Legal Assistance?",
              "subtitle": "If you're facing arrest or detention, these resources can help right now:",
              "publicDefender": "Find Public Defender",
              "publicDefenderDesc": "Search for public defender offices near you",
              "legalAid": "Legal Aid Organizations",
              "legalAidDesc": "Find free legal assistance in your area",
              "knowRights": "Know Your Rights",
              "knowRightsDesc": "Understand your constitutional protections",
              "closeButton": "Close"
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
              "title": "Orientación Legal Gratuita Cuando Más lo Necesita",
              "subtitle": "Acceda a sus derechos, entienda sus opciones y encuentre recursos legales — todo sin costo alguno.",
              "urgentHelpButton": "¿Necesita Ayuda Urgente?",
              "getStartedButton": "Comenzar"
            },
            "urgentHelp": {
              "title": "¿Necesita Asistencia Legal Inmediata?",
              "subtitle": "Si enfrenta arresto o detención, estos recursos pueden ayudarle ahora mismo:",
              "publicDefender": "Encontrar Defensor Público",
              "publicDefenderDesc": "Buscar oficinas de defensor público cerca de usted",
              "legalAid": "Organizaciones de Asistencia Legal",
              "legalAidDesc": "Encontrar asistencia legal gratuita en su área",
              "knowRights": "Conozca sus Derechos",
              "knowRightsDesc": "Entienda sus protecciones constitucionales",
              "closeButton": "Cerrar"
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
