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

  const judicialWarrant = warrantInfo.find(w => w.type === 'judicial');
  const administrativeWarrant = warrantInfo.find(w => w.type === 'administrative');

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription data-testid="warrant-observations">
          {lang === 'es'
            ? 'Observe quién firma, qué tribunal o agencia emite el documento, a quién o qué lugar identifica y las fechas o límites indicados. Estas características no determinan su validez ni autorizan toda entrada. La falta de un sello, dirección o fecha de vencimiento no prueba que sea una orden administrativa. Pida que un abogado revise el documento; no se resista físicamente.'
            : 'Look at who signed, which court or agency issued the document, the person or place identified, and any dates or limits. These features do not determine validity or authorize every entry. A missing seal, address, or expiration date does not prove it is an administrative warrant. Ask a lawyer to review the document; do not physically resist.'}
        </AlertDescription>
      </Alert>
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
                      {lang === 'es' ? 'REVISE EL ALCANCE' : 'CHECK THE SCOPE'}
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
                      {lang === 'es' ? 'NO ES UNA ORDEN JUDICIAL' : 'NOT A COURT WARRANT'}
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
