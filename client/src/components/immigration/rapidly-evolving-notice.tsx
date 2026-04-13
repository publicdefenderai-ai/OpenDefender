import { AlertTriangle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

const ORGS = [
  { name: 'NILC', url: 'https://www.nilc.org' },
  { name: 'ILRC', url: 'https://www.ilrc.org' },
  { name: 'AILA', url: 'https://www.aila.org' },
  { name: 'CLINIC', url: 'https://cliniclegal.org' },
  { name: 'USCIS', url: 'https://www.uscis.gov' },
];

const CONTENT = {
  en: {
    title: 'Rapidly Evolving Area of Law',
    body: 'Immigration law and enforcement priorities change frequently. Information on this page reflects current guidance but may become outdated. Always verify with a trusted organization before relying on it.',
    verify: 'Verify with:',
  },
  es: {
    title: 'Área Legal en Rápida Evolución',
    body: 'La ley de inmigración y las prioridades de cumplimiento cambian con frecuencia. La información en esta página refleja la orientación actual, pero puede quedar desactualizada. Verifique siempre con una organización de confianza antes de basarse en ella.',
    verify: 'Verifique con:',
  },
  zh: {
    title: '快速变化的法律领域',
    body: '移民法律和执法优先事项经常变化。本页面信息反映当前指导方针，但可能会过时。在依据此信息行动之前，请务必向可信赖的机构核实。',
    verify: '请向以下机构核实：',
  },
};

export function RapidlyEvolvingNotice() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';
  const c = CONTENT[lang];

  return (
    <Alert className="max-w-4xl mx-auto px-4 mt-4 mb-8 bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-700">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <AlertDescription className="text-amber-900 dark:text-amber-200">
        <strong className="block mb-1">{c.title}</strong>
        <span className="text-sm">{c.body}</span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
          <span className="font-medium">{c.verify}</span>
          {ORGS.map((org) => (
            <a
              key={org.name}
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-amber-700 dark:text-amber-300 hover:underline"
            >
              {org.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </span>
      </AlertDescription>
    </Alert>
  );
}
