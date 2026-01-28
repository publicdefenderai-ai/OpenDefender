import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  FileCheck,
  FileX,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Search,
  Scale,
  Building2,
  HelpCircle
} from 'lucide-react';

interface WarrantInfo {
  type: 'judicial' | 'administrative';
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
  characteristics: {
    en: string[];
    es: string[];
  };
  whatToDo: {
    en: string[];
    es: string[];
  };
  lookFor: {
    en: string[];
    es: string[];
  };
}

interface WarrantGuideProps {
  warrantInfo: WarrantInfo[];
}

export function WarrantGuide({ warrantInfo }: WarrantGuideProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [activeTab, setActiveTab] = useState<'compare' | 'checker'>('compare');

  const judicialWarrant = warrantInfo.find(w => w.type === 'judicial');
  const administrativeWarrant = warrantInfo.find(w => w.type === 'administrative');

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'compare'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="h-4 w-4" />
          {lang === 'es' ? 'Comparar Órdenes' : 'Compare Warrants'}
        </button>
        <button
          onClick={() => setActiveTab('checker')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'checker'
              ? 'bg-background shadow-sm text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Search className="h-4 w-4" />
          {lang === 'es' ? 'Verificador de Órdenes' : 'Warrant Checker'}
        </button>
      </div>

      {activeTab === 'compare' ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Judicial Warrant */}
          {judicialWarrant && (
            <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg">{judicialWarrant.title[lang]}</div>
                    <Badge variant="outline" className="mt-1 border-green-500 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {lang === 'es' ? 'PERMITE ENTRADA' : 'ALLOWS ENTRY'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {judicialWarrant.description[lang]}
                </p>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-green-600" />
                    {lang === 'es' ? 'Características:' : 'Characteristics:'}
                  </h4>
                  <ul className="space-y-1">
                    {judicialWarrant.characteristics[lang].map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-600" />
                    {lang === 'es' ? 'Qué buscar:' : 'Look for:'}
                  </h4>
                  <ul className="space-y-1">
                    {judicialWarrant.lookFor[lang].map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Search className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">
                    {lang === 'es' ? 'Qué hacer:' : 'What to do:'}
                  </h4>
                  <ul className="space-y-1">
                    {judicialWarrant.whatToDo[lang].map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Administrative Warrant */}
          {administrativeWarrant && (
            <Card className="border-red-500/50 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <FileX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-lg">{administrativeWarrant.title[lang]}</div>
                    <Badge variant="outline" className="mt-1 border-red-500 text-red-700 dark:text-red-400">
                      <XCircle className="h-3 w-3 mr-1" />
                      {lang === 'es' ? 'NO PERMITE ENTRADA' : 'DOES NOT ALLOW ENTRY'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {administrativeWarrant.description[lang]}
                </p>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-red-600" />
                    {lang === 'es' ? 'Características:' : 'Characteristics:'}
                  </h4>
                  <ul className="space-y-1">
                    {administrativeWarrant.characteristics[lang].map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-red-600" />
                    {lang === 'es' ? 'Qué buscar:' : 'Look for:'}
                  </h4>
                  <ul className="space-y-1">
                    {administrativeWarrant.lookFor[lang].map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Search className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">
                    {lang === 'es' ? 'Qué hacer:' : 'What to do:'}
                  </h4>
                  <ul className="space-y-1">
                    {administrativeWarrant.whatToDo[lang].map((item, idx) => (
                      <li key={idx} className="text-sm">• {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <WarrantChecker lang={lang} />
      )}

      {/* Important note */}
      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>{lang === 'es' ? 'Importante:' : 'Important:'}</strong>{' '}
          {lang === 'es'
            ? 'Siempre pida ver la orden a través de una ventana o por debajo de la puerta. NO abra la puerta para ver la orden.'
            : 'Always ask to see the warrant through a window or under the door. Do NOT open the door to see the warrant.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Interactive warrant checker component
function WarrantChecker({ lang }: { lang: 'en' | 'es' }) {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({
    judgeSignature: null,
    courtSeal: null,
    correctAddress: null,
    notExpired: null
  });

  const questions = [
    {
      id: 'judgeSignature',
      question: {
        en: 'Is it signed by a JUDGE (not an ICE or DHS officer)?',
        es: '¿Está firmada por un JUEZ (no un oficial de ICE o DHS)?'
      }
    },
    {
      id: 'courtSeal',
      question: {
        en: 'Does it have a COURT seal and court address (not DHS/ICE letterhead)?',
        es: '¿Tiene un sello del TRIBUNAL y dirección del tribunal (no membrete de DHS/ICE)?'
      }
    },
    {
      id: 'correctAddress',
      question: {
        en: 'Does it list YOUR correct address?',
        es: '¿Tiene SU dirección correcta?'
      }
    },
    {
      id: 'notExpired',
      question: {
        en: 'Is the date current (not expired)?',
        es: '¿La fecha es actual (no vencida)?'
      }
    }
  ];

  const allAnswered = Object.values(answers).every(a => a !== null);
  const allYes = Object.values(answers).every(a => a === true);
  const anyNo = Object.values(answers).some(a => a === false);

  const getResult = () => {
    if (!allAnswered) return null;
    if (allYes) return 'judicial';
    if (anyNo) return 'administrative';
    return null;
  };

  const result = getResult();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {lang === 'es' ? 'Verificador de Órdenes' : 'Warrant Checker'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          {lang === 'es'
            ? 'Responda estas preguntas para determinar si la orden es válida para entrar a su casa:'
            : 'Answer these questions to determine if the warrant is valid for entry into your home:'}
        </p>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-3">{q.question[lang]}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: true }))}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    answers[q.id] === true
                      ? 'bg-green-500 text-white'
                      : 'bg-background border border-border hover:border-green-500'
                  }`}
                >
                  {lang === 'es' ? 'SÍ' : 'YES'}
                </button>
                <button
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: false }))}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    answers[q.id] === false
                      ? 'bg-red-500 text-white'
                      : 'bg-background border border-border hover:border-red-500'
                  }`}
                >
                  {lang === 'es' ? 'NO' : 'NO'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {result && (
          <div className={`rounded-lg p-4 ${
            result === 'judicial'
              ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
              : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
          }`}>
            <div className="flex items-start gap-3">
              {result === 'judicial' ? (
                <FileCheck className="h-6 w-6 text-green-600 shrink-0" />
              ) : (
                <FileX className="h-6 w-6 text-red-600 shrink-0" />
              )}
              <div>
                <h4 className={`font-bold ${
                  result === 'judicial' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                }`}>
                  {result === 'judicial'
                    ? (lang === 'es' ? 'PARECE SER UNA ORDEN JUDICIAL' : 'THIS APPEARS TO BE A JUDICIAL WARRANT')
                    : (lang === 'es' ? 'ESTO NO ES UNA ORDEN JUDICIAL VÁLIDA' : 'THIS IS NOT A VALID JUDICIAL WARRANT')}
                </h4>
                <p className="text-sm mt-2">
                  {result === 'judicial'
                    ? (lang === 'es'
                        ? 'Si todos estos elementos están presentes, puede ser una orden judicial válida. Sin embargo, aún puede ejercer su derecho a guardar silencio.'
                        : 'If all these elements are present, it may be a valid judicial warrant. However, you can still exercise your right to remain silent.')
                    : (lang === 'es'
                        ? 'NO abra la puerta. Diga: "Esto no es una orden judicial. No doy mi consentimiento para que entren." Tiene derecho a no permitir la entrada.'
                        : 'Do NOT open the door. Say: "This is not a judicial warrant. I do not consent to entry." You have the right to refuse entry.')}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setAnswers({
            judgeSignature: null,
            courtSeal: null,
            correctAddress: null,
            notExpired: null
          })}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          {lang === 'es' ? 'Empezar de nuevo' : 'Start over'}
        </button>
      </CardContent>
    </Card>
  );
}
