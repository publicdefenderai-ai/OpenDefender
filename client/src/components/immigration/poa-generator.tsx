import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Printer,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  poaTemplates,
  getAvailableStates,
  getPOATemplate,
  type POATemplate
} from '../../../../shared/templates/poa-child-custody';

interface FormData {
  parentName: string;
  parentAddress: string;
  parentPhone: string;
  caregiverName: string;
  caregiverAddress: string;
  caregiverPhone: string;
  caregiverDob: string;
  caregiverId: string;
  relationship: string;
  childName: string;
  childDob: string;
  childAddress: string;
  schoolName: string;
  grade: string;
  startDate: string;
  endDate: string;
}

const initialFormData: FormData = {
  parentName: '',
  parentAddress: '',
  parentPhone: '',
  caregiverName: '',
  caregiverAddress: '',
  caregiverPhone: '',
  caregiverDob: '',
  caregiverId: '',
  relationship: '',
  childName: '',
  childDob: '',
  childAddress: '',
  schoolName: '',
  grade: '',
  startDate: '',
  endDate: ''
};

export function POAGenerator() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [selectedState, setSelectedState] = useState<string>('');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showInstructions, setShowInstructions] = useState(true);

  const states = getAvailableStates();
  const template = selectedState ? getPOATemplate(selectedState) : null;

  const updateForm = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateDocument = () => {
    if (!template) return '';

    let doc = template.template[lang];

    // Replace placeholders
    const replacements: Record<string, string> = {
      '[PARENT_NAME]': formData.parentName || '_________________',
      '[PARENT_ADDRESS]': formData.parentAddress || '_________________',
      '[PARENT_PHONE]': formData.parentPhone || '_________________',
      '[CAREGIVER_NAME]': formData.caregiverName || '_________________',
      '[CAREGIVER_ADDRESS]': formData.caregiverAddress || '_________________',
      '[CAREGIVER_PHONE]': formData.caregiverPhone || '_________________',
      '[CAREGIVER_DOB]': formData.caregiverDob || '_________________',
      '[CAREGIVER_ID]': formData.caregiverId || '_________________',
      '[RELATIONSHIP]': formData.relationship || '_________________',
      '[CHILD_NAME]': formData.childName || '_________________',
      '[CHILD_DOB]': formData.childDob || '_________________',
      '[CHILD_ADDRESS]': formData.childAddress || formData.parentAddress || '_________________',
      '[SCHOOL_NAME]': formData.schoolName || '_________________',
      '[GRADE]': formData.grade || '_________________',
      '[START_DATE]': formData.startDate || '_________________',
      '[END_DATE]': formData.endDate || '_________________',
      '[SIGN_DATE]': '_________________',
      '[NOTARY_DATE]': '_________________'
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      doc = doc.replace(new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g'), value);
    }

    return doc;
  };

  const handlePrint = () => {
    const doc = generateDocument();
    if (!doc || !template) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lang === 'es' ? 'Poder Notarial para Custodia' : 'Power of Attorney for Child Custody'} - ${template.stateName}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 12pt;
              line-height: 1.5;
              margin: 1in;
              color: #000;
            }
            pre {
              white-space: pre-wrap;
              font-family: inherit;
              font-size: inherit;
              margin: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .disclaimer {
              border: 1px solid #000;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 10pt;
              background: #f5f5f5;
            }
            .instructions {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px dashed #999;
              font-size: 10pt;
            }
            @media print {
              .disclaimer { background: #eee; -webkit-print-color-adjust: exact; }
              .instructions { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="disclaimer">
            <strong>${lang === 'es' ? 'AVISO LEGAL' : 'LEGAL DISCLAIMER'}:</strong>
            ${lang === 'es'
              ? 'Este documento es solo una plantilla y NO constituye asesoría legal. Consulte con un abogado antes de usar este formulario. Las leyes varían por estado y pueden cambiar.'
              : 'This document is a template only and does NOT constitute legal advice. Consult with an attorney before using this form. Laws vary by state and may change.'}
          </div>

          <div class="header">
            <strong>${template.stateName}</strong><br>
            <em>${template.legalCitation}</em>
          </div>

          <pre>${doc}</pre>

          <div class="instructions">
            <h3>${lang === 'es' ? 'INSTRUCCIONES' : 'INSTRUCTIONS'}</h3>
            <ul>
              ${template.instructions[lang].map(i => `<li>${i}</li>`).join('')}
            </ul>
            <h4>${lang === 'es' ? 'Requisitos:' : 'Requirements:'}</h4>
            <ul>
              <li>${lang === 'es' ? 'Notarización requerida:' : 'Notarization required:'} ${template.notarizationRequired ? (lang === 'es' ? 'SÍ' : 'YES') : 'NO'}</li>
              <li>${lang === 'es' ? 'Testigos requeridos:' : 'Witnesses required:'} ${template.witnessesRequired}</li>
              <li>${lang === 'es' ? 'Duración máxima:' : 'Maximum duration:'} ${template.maxDuration}</li>
            </ul>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {lang === 'es' ? 'Generador de Poder Notarial para Custodia' : 'Child Custody Power of Attorney Generator'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disclaimer */}
        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>{lang === 'es' ? 'AVISO IMPORTANTE:' : 'IMPORTANT NOTICE:'}</strong>{' '}
            {lang === 'es'
              ? 'Este es solo un formulario de plantilla. NO constituye asesoría legal. Siempre consulte con un abogado calificado para su situación específica. Los requisitos legales varían por estado.'
              : 'This is a template form only. It does NOT constitute legal advice. Always consult with a qualified attorney for your specific situation. Legal requirements vary by state.'}
          </AlertDescription>
        </Alert>

        {/* State Selection */}
        <div className="space-y-2">
          <Label className="font-semibold">
            {lang === 'es' ? 'Seleccione su estado' : 'Select your state'}
          </Label>
          <div className="grid grid-cols-5 gap-2">
            {states.map(state => {
              const t = poaTemplates[state];
              return (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    selectedState === state
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold">{state}</span>
                  <span className="block text-xs text-muted-foreground">{t.stateName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {template && (
          <>
            {/* State Requirements */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                {template.stateName} {lang === 'es' ? 'Requisitos' : 'Requirements'}
              </h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {lang === 'es' ? 'Notarización:' : 'Notarization:'}{' '}
                  {template.notarizationRequired ? (lang === 'es' ? 'Requerida' : 'Required') : (lang === 'es' ? 'No requerida' : 'Not required')}
                </Badge>
                <Badge variant="outline">
                  {lang === 'es' ? 'Testigos:' : 'Witnesses:'} {template.witnessesRequired}
                </Badge>
                <Badge variant="outline">
                  {lang === 'es' ? 'Duración:' : 'Duration:'} {template.maxDuration}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{template.legalCitation}</p>
            </div>

            {/* Instructions toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {lang === 'es' ? 'Ver instrucciones y advertencias' : 'View instructions and warnings'}
            </button>

            {showInstructions && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {lang === 'es' ? 'Instrucciones' : 'Instructions'}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {template.instructions[lang].map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {lang === 'es' ? 'Advertencias' : 'Warnings'}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {template.warnings[lang].map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Parent/Guardian Info */}
              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">
                  {lang === 'es' ? 'Información del Padre/Tutor' : 'Parent/Guardian Information'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Nombre completo' : 'Full Name'}</Label>
                    <Input
                      value={formData.parentName}
                      onChange={(e) => updateForm('parentName', e.target.value)}
                      placeholder={lang === 'es' ? 'Nombre del padre/tutor' : 'Parent/guardian name'}
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
                    <Input
                      value={formData.parentPhone}
                      onChange={(e) => updateForm('parentPhone', e.target.value)}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Dirección' : 'Address'}</Label>
                  <Input
                    value={formData.parentAddress}
                    onChange={(e) => updateForm('parentAddress', e.target.value)}
                    placeholder={lang === 'es' ? 'Dirección completa' : 'Full address'}
                  />
                </div>
              </div>

              {/* Child Info */}
              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">
                  {lang === 'es' ? 'Información del Menor' : 'Child Information'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Nombre completo del niño' : 'Child\'s Full Name'}</Label>
                    <Input
                      value={formData.childName}
                      onChange={(e) => updateForm('childName', e.target.value)}
                      placeholder={lang === 'es' ? 'Nombre del niño' : 'Child\'s name'}
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Fecha de nacimiento' : 'Date of Birth'}</Label>
                    <Input
                      type="date"
                      value={formData.childDob}
                      onChange={(e) => updateForm('childDob', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Escuela (opcional)' : 'School (optional)'}</Label>
                    <Input
                      value={formData.schoolName}
                      onChange={(e) => updateForm('schoolName', e.target.value)}
                      placeholder={lang === 'es' ? 'Nombre de la escuela' : 'School name'}
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Grado (opcional)' : 'Grade (optional)'}</Label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => updateForm('grade', e.target.value)}
                      placeholder={lang === 'es' ? 'Grado actual' : 'Current grade'}
                    />
                  </div>
                </div>
              </div>

              {/* Caregiver Info */}
              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">
                  {lang === 'es' ? 'Información del Cuidador' : 'Caregiver Information'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Nombre completo' : 'Full Name'}</Label>
                    <Input
                      value={formData.caregiverName}
                      onChange={(e) => updateForm('caregiverName', e.target.value)}
                      placeholder={lang === 'es' ? 'Nombre del cuidador' : 'Caregiver name'}
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Relación con el niño' : 'Relationship to Child'}</Label>
                    <Input
                      value={formData.relationship}
                      onChange={(e) => updateForm('relationship', e.target.value)}
                      placeholder={lang === 'es' ? 'Ej: Abuela, Tía' : 'E.g., Grandmother, Aunt'}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
                    <Input
                      value={formData.caregiverPhone}
                      onChange={(e) => updateForm('caregiverPhone', e.target.value)}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Fecha de nacimiento' : 'Date of Birth'}</Label>
                    <Input
                      type="date"
                      value={formData.caregiverDob}
                      onChange={(e) => updateForm('caregiverDob', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Dirección' : 'Address'}</Label>
                  <Input
                    value={formData.caregiverAddress}
                    onChange={(e) => updateForm('caregiverAddress', e.target.value)}
                    placeholder={lang === 'es' ? 'Dirección completa' : 'Full address'}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">
                  {lang === 'es' ? 'Período de Validez' : 'Valid Period'}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{lang === 'es' ? 'Fecha de inicio' : 'Start Date'}</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateForm('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>{lang === 'es' ? 'Fecha de fin' : 'End Date'}</Label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateForm('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <Button onClick={handlePrint} className="w-full" size="lg">
              <Printer className="h-4 w-4 mr-2" />
              {lang === 'es' ? 'Generar e Imprimir Documento' : 'Generate and Print Document'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
