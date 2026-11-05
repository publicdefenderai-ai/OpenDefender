import { officialCaregiverForms } from "../../../../shared/templates/official-caregiver-forms";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertTriangle } from 'lucide-react';

// Retain the exported name for existing page imports; all forms are issued externally.
export function POAGenerator() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [selectedState, setSelectedState] = useState<string>('');
  const states = Object.keys(officialCaregiverForms);
  const official = officialCaregiverForms[selectedState];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {lang === 'es' ? 'Formularios de autorización de cuidadores' : 'Caregiver authorization forms'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disclaimer */}
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>{lang === 'es' ? 'AVISO IMPORTANTE:' : 'IMPORTANT NOTICE:'}</strong>{' '}
            {lang === 'es'
              ? 'La autoridad disponible y los requisitos de firma dependen del estado y del documento. NO transfiere la custodia legal; solo un tribunal puede hacer eso. Esta información NO constituye asesoría legal. Siempre consulte con un abogado calificado para su situación específica. Los requisitos legales varían por estado.'
              : 'The available authority and signing requirements depend on the state and the document. It does NOT transfer legal custody; only a court can do that. This information does NOT constitute legal advice. Always consult with a qualified attorney for your specific situation. Legal requirements vary by state.'}
          </AlertDescription>
        </Alert>

        {/* State Selection */}
        <div className="space-y-2">
          <Label className="font-semibold">
            {lang === 'es' ? 'Seleccione su estado' : 'Select your state'}
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {states.map(state => {
              const stateName = officialCaregiverForms[state].stateName;
              return (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  aria-pressed={selectedState === state}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedState === state
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold">{state}</span>
                  <span className="block text-xs text-muted-foreground">{stateName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {official && <section data-testid="official-caregiver-form" lang={lang} className="space-y-4">
          <h3 className="text-xl font-semibold">{official.title}</h3>
          <p>{lang === 'es' ? 'El enlace abre el formulario oficial en inglés. Complete y firme el formulario siguiendo sus instrucciones.' : 'The link opens the official English form. Complete and sign the form according to its instructions.'}</p>
          <ul className="list-disc pl-5 space-y-3">{official[lang].map(text => <li key={text}>{text}</li>)}</ul>
          <a className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4" href={official.url} target="_blank" rel="noopener noreferrer">{lang === 'es' ? `Abrir formulario gubernamental (${official.format})` : `Open government form (${official.format})`}</a>
          <p><a className="underline underline-offset-4" href={official.source} target="_blank" rel="noopener noreferrer">{lang === 'es' ? 'Fuente e instrucciones' : 'Source and instructions'}</a></p>
        </section>}
      </CardContent>
    </Card>
  );
}
