import { Shield, AlertTriangle, Phone } from "lucide-react";

interface RightsCardProps {
  language?: "en" | "es";
  theme?: "light" | "dark";
  variant?: "full" | "compact" | "mini";
  baseUrl?: string;
}

const rightsContent = {
  en: {
    title: "Know Your Rights",
    subtitle: "If stopped by police",
    rights: [
      { icon: "shield", text: "You have the right to remain silent" },
      { icon: "shield", text: "You have the right to an attorney" },
      { icon: "shield", text: "You do not have to consent to a search" },
      { icon: "alert", text: "Stay calm and do not resist" }
    ],
    emergency: "If arrested, ask for a lawyer immediately",
    cta: "Learn more about your rights",
    powered: "Powered by Public Defender AI"
  },
  es: {
    title: "Conozca Sus Derechos",
    subtitle: "Si lo detiene la policía",
    rights: [
      { icon: "shield", text: "Tiene derecho a guardar silencio" },
      { icon: "shield", text: "Tiene derecho a un abogado" },
      { icon: "shield", text: "No tiene que consentir a un registro" },
      { icon: "alert", text: "Mantenga la calma y no resista" }
    ],
    emergency: "Si lo arrestan, pida un abogado inmediatamente",
    cta: "Aprenda más sobre sus derechos",
    powered: "Desarrollado por Public Defender AI"
  }
};

export function RightsCard({
  language = "en",
  theme = "light",
  variant = "full",
  baseUrl = ""
}: RightsCardProps) {
  const content = rightsContent[language];
  const isDark = theme === "dark";
  
  const bgClass = isDark ? "bg-gray-900" : "bg-white";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const borderClass = isDark ? "border-gray-700" : "border-gray-200";
  const mutedClass = isDark ? "text-gray-400" : "text-gray-600";
  const accentBg = isDark ? "bg-blue-900/30" : "bg-blue-50";
  const accentBorder = isDark ? "border-blue-800" : "border-blue-200";

  if (variant === "mini") {
    return (
      <a
        href={`${baseUrl}/rights-info`}
        target="_blank"
        rel="noopener noreferrer"
        className={`pdai-widget inline-flex items-center gap-2 px-4 py-2 rounded-lg ${bgClass} border ${borderClass} ${textClass} hover:shadow-md transition-shadow`}
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", textDecoration: "none" }}
      >
        <Shield className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-sm">{content.title}</span>
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`pdai-widget ${bgClass} ${textClass} rounded-lg border ${borderClass} shadow-sm p-4`}
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "320px" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="font-bold">{content.title}</h3>
        </div>
        <ul className="space-y-2 text-sm mb-3">
          {content.rights.slice(0, 3).map((right, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{right.text}</span>
            </li>
          ))}
        </ul>
        <a
          href={`${baseUrl}/rights-info`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {content.cta} →
        </a>
      </div>
    );
  }

  return (
    <div
      className={`pdai-widget ${bgClass} ${textClass} rounded-xl border ${borderClass} shadow-lg overflow-hidden`}
      style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "400px" }}
    >
      <div className={`${accentBg} border-b ${accentBorder} px-5 py-4`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{content.title}</h3>
            <p className={`text-sm ${mutedClass}`}>{content.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <ul className="space-y-3 mb-4">
          {content.rights.map((right, i) => (
            <li key={i} className="flex items-start gap-3">
              {right.icon === "alert" ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{right.text}</span>
            </li>
          ))}
        </ul>

        <div className={`${accentBg} border ${accentBorder} rounded-lg p-3 mb-4`}>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{content.emergency}</span>
          </div>
        </div>

        <a
          href={`${baseUrl}/rights-info`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          style={{ textDecoration: "none" }}
        >
          {content.cta}
        </a>
      </div>

      <div className={`px-5 py-3 border-t ${borderClass} ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
        <span className={`text-xs ${mutedClass}`}>{content.powered}</span>
      </div>
    </div>
  );
}
