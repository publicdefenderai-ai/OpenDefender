import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  CheckCircle2,
  Circle,
  Printer,
  Lock,
  Cloud,
  User,
  Heart,
  Scale,
  DollarSign,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface DocumentCategory {
  id: string;
  title: {
    en: string;
    es: string;
  };
  icon: React.ReactNode;
  documents: {
    id: string;
    name: {
      en: string;
      es: string;
    };
    description: {
      en: string;
      es: string;
    };
    priority: 'critical' | 'high' | 'medium';
  }[];
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'identity',
    title: { en: 'Identity Documents', es: 'Documentos de Identidad' },
    icon: <User className="h-5 w-5" />,
    documents: [
      {
        id: 'id-1',
        name: { en: 'Birth certificates (all family members)', es: 'Actas de nacimiento (todos los miembros de la familia)' },
        description: { en: 'Get certified copies from the issuing country/state', es: 'Obtenga copias certificadas del país/estado emisor' },
        priority: 'critical'
      },
      {
        id: 'id-2',
        name: { en: 'Passports', es: 'Pasaportes' },
        description: { en: 'Valid passports for all family members', es: 'Pasaportes válidos para todos los miembros de la familia' },
        priority: 'critical'
      },
      {
        id: 'id-3',
        name: { en: 'State ID / Driver\'s licenses', es: 'Identificaciones estatales / Licencias de conducir' },
        description: { en: 'Current government-issued ID', es: 'Identificación gubernamental actual' },
        priority: 'high'
      },
      {
        id: 'id-4',
        name: { en: 'Social Security cards', es: 'Tarjetas de Seguro Social' },
        description: { en: 'Or documentation of ITIN numbers', es: 'O documentación de números ITIN' },
        priority: 'high'
      },
      {
        id: 'id-5',
        name: { en: 'Marriage certificate', es: 'Acta de matrimonio' },
        description: { en: 'If applicable', es: 'Si aplica' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'immigration',
    title: { en: 'Immigration Documents', es: 'Documentos de Inmigración' },
    icon: <Shield className="h-5 w-5" />,
    documents: [
      {
        id: 'imm-1',
        name: { en: 'Immigration status documents', es: 'Documentos de estatus migratorio' },
        description: { en: 'Visa, green card, EAD, or DACA approval notice', es: 'Visa, tarjeta verde, EAD o notificación de aprobación DACA' },
        priority: 'critical'
      },
      {
        id: 'imm-2',
        name: { en: 'A-Number documentation', es: 'Documentación del Número A' },
        description: { en: 'Any document showing your A-Number', es: 'Cualquier documento que muestre su Número A' },
        priority: 'critical'
      },
      {
        id: 'imm-3',
        name: { en: 'Immigration court notices', es: 'Notificaciones del tribunal de inmigración' },
        description: { en: 'All court dates and hearing notices', es: 'Todas las fechas de corte y notificaciones de audiencias' },
        priority: 'critical'
      },
      {
        id: 'imm-4',
        name: { en: 'Entry/exit records', es: 'Registros de entrada/salida' },
        description: { en: 'I-94 or travel stamps in passport', es: 'I-94 o sellos de viaje en pasaporte' },
        priority: 'high'
      },
      {
        id: 'imm-5',
        name: { en: 'Previous immigration applications', es: 'Solicitudes de inmigración anteriores' },
        description: { en: 'Copies of any filed applications', es: 'Copias de cualquier solicitud presentada' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'children',
    title: { en: 'Children\'s Documents', es: 'Documentos de los Niños' },
    icon: <Heart className="h-5 w-5" />,
    documents: [
      {
        id: 'child-1',
        name: { en: 'Birth certificates for all children', es: 'Actas de nacimiento de todos los niños' },
        description: { en: 'Certified copies - proves citizenship if US-born', es: 'Copias certificadas - prueba ciudadanía si nacieron en EE.UU.' },
        priority: 'critical'
      },
      {
        id: 'child-2',
        name: { en: 'School enrollment records', es: 'Registros de inscripción escolar' },
        description: { en: 'Current school and grade information', es: 'Información de escuela y grado actual' },
        priority: 'high'
      },
      {
        id: 'child-3',
        name: { en: 'Immunization records', es: 'Registros de vacunación' },
        description: { en: 'Complete vaccination history', es: 'Historial completo de vacunación' },
        priority: 'high'
      },
      {
        id: 'child-4',
        name: { en: 'Medical records', es: 'Registros médicos' },
        description: { en: 'Especially for any ongoing conditions', es: 'Especialmente para cualquier condición continua' },
        priority: 'high'
      },
      {
        id: 'child-5',
        name: { en: 'Custody documents (if applicable)', es: 'Documentos de custodia (si aplica)' },
        description: { en: 'Court orders regarding custody', es: 'Órdenes judiciales sobre custodia' },
        priority: 'high'
      }
    ]
  },
  {
    id: 'financial',
    title: { en: 'Financial Documents', es: 'Documentos Financieros' },
    icon: <DollarSign className="h-5 w-5" />,
    documents: [
      {
        id: 'fin-1',
        name: { en: 'Bank account information', es: 'Información de cuentas bancarias' },
        description: { en: 'Account numbers, bank name, authorized users', es: 'Números de cuenta, nombre del banco, usuarios autorizados' },
        priority: 'critical'
      },
      {
        id: 'fin-2',
        name: { en: 'Property documents', es: 'Documentos de propiedad' },
        description: { en: 'Deeds, rental agreements, mortgage info', es: 'Escrituras, contratos de alquiler, información de hipoteca' },
        priority: 'high'
      },
      {
        id: 'fin-3',
        name: { en: 'Vehicle titles', es: 'Títulos de vehículos' },
        description: { en: 'Registration and insurance information', es: 'Información de registro y seguro' },
        priority: 'high'
      },
      {
        id: 'fin-4',
        name: { en: 'Tax returns (last 3 years)', es: 'Declaraciones de impuestos (últimos 3 años)' },
        description: { en: 'Can help prove length of time in US', es: 'Puede ayudar a probar tiempo en EE.UU.' },
        priority: 'medium'
      },
      {
        id: 'fin-5',
        name: { en: 'Insurance policies', es: 'Pólizas de seguro' },
        description: { en: 'Health, life, auto insurance information', es: 'Información de seguro médico, de vida, auto' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'legal',
    title: { en: 'Legal Documents', es: 'Documentos Legales' },
    icon: <Scale className="h-5 w-5" />,
    documents: [
      {
        id: 'legal-1',
        name: { en: 'Power of Attorney for children', es: 'Poder notarial para los niños' },
        description: { en: 'Designating caregiver authority', es: 'Designando autoridad del cuidador' },
        priority: 'critical'
      },
      {
        id: 'legal-2',
        name: { en: 'Immigration attorney contact', es: 'Contacto del abogado de inmigración' },
        description: { en: 'Name, phone, address, case number', es: 'Nombre, teléfono, dirección, número de caso' },
        priority: 'critical'
      },
      {
        id: 'legal-3',
        name: { en: 'Financial power of attorney', es: 'Poder notarial financiero' },
        description: { en: 'For managing finances if detained', es: 'Para administrar finanzas si es detenido' },
        priority: 'high'
      },
      {
        id: 'legal-4',
        name: { en: 'Healthcare directive', es: 'Directiva de atención médica' },
        description: { en: 'Healthcare decisions if unable to make them', es: 'Decisiones de salud si no puede tomarlas' },
        priority: 'medium'
      }
    ]
  }
];

const STORAGE_KEY = 'immigration-document-checklist';

export function DocumentChecklist() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCheckedDocs(new Set(JSON.parse(saved)));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedDocs]));
  }, [checkedDocs]);

  const toggleDoc = (id: string) => {
    setCheckedDocs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allDocs = documentCategories.flatMap(c => c.documents);
  const filteredDocs = activeCategory === 'all'
    ? documentCategories
    : documentCategories.filter(c => c.id === activeCategory);

  const completedCount = checkedDocs.size;
  const totalCount = allDocs.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-amber-600 dark:text-amber-400';
      case 'medium': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lang === 'es' ? 'Lista de Documentos' : 'Document Checklist'}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 20px; }
            h2 { font-size: 16px; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
            .progress { font-size: 14px; color: #666; }
            ul { list-style: none; padding: 0; }
            li { padding: 6px 0; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #f5f5f5; }
            .checkbox { width: 14px; height: 14px; border: 2px solid #666; border-radius: 2px; }
            .checked { background: #22c55e; border-color: #22c55e; }
            .priority { font-size: 9px; padding: 2px 6px; border-radius: 8px; }
            .critical { background: #fee2e2; color: #dc2626; }
            .high { background: #fef3c7; color: #d97706; }
            .medium { background: #dbeafe; color: #2563eb; }
            .description { font-size: 11px; color: #666; margin-left: 22px; }
          </style>
        </head>
        <body>
          <h1>${lang === 'es' ? 'Lista de Documentos Importantes' : 'Important Documents Checklist'}</h1>
          <p class="progress">${lang === 'es' ? 'Progreso' : 'Progress'}: ${completedCount}/${totalCount} (${progress}%)</p>

          ${documentCategories.map(cat => `
            <h2>${cat.title[lang]}</h2>
            <ul>
              ${cat.documents.map(doc => `
                <li>
                  <div class="checkbox ${checkedDocs.has(doc.id) ? 'checked' : ''}"></div>
                  <div>
                    <span>${doc.name[lang]}</span>
                    <span class="priority ${doc.priority}">${doc.priority}</span>
                    <p class="description">${doc.description[lang]}</p>
                  </div>
                </li>
              `).join('')}
            </ul>
          `).join('')}
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          {lang === 'es' ? 'Lista de Documentos Importantes' : 'Important Documents Checklist'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Privacy note */}
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            {lang === 'es'
              ? 'Su progreso se guarda solo en su dispositivo. No enviamos datos a nuestros servidores.'
              : 'Your progress is saved only on your device. We do not send data to our servers.'}
          </AlertDescription>
        </Alert>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{lang === 'es' ? 'Progreso' : 'Progress'}</span>
            <span className="font-medium">{completedCount}/{totalCount} ({progress}%)</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {lang === 'es' ? 'Todos' : 'All'}
          </button>
          {documentCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {cat.icon}
              {cat.title[lang]}
            </button>
          ))}
        </div>

        {/* Document list */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {filteredDocs.map(category => (
            <div key={category.id}>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                {category.icon}
                {category.title[lang]}
              </h3>
              <div className="space-y-2">
                {category.documents.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                      checkedDocs.has(doc.id) ? 'bg-green-50 dark:bg-green-950/30' : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {checkedDocs.has(doc.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${checkedDocs.has(doc.id) ? 'line-through text-muted-foreground' : ''}`}>
                        {doc.name[lang]}
                      </p>
                      <p className="text-xs text-muted-foreground">{doc.description[lang]}</p>
                      <span className={`text-xs ${getPriorityColor(doc.priority)}`}>
                        {doc.priority === 'critical' && (lang === 'es' ? 'Crítico' : 'Critical')}
                        {doc.priority === 'high' && (lang === 'es' ? 'Alto' : 'High')}
                        {doc.priority === 'medium' && (lang === 'es' ? 'Medio' : 'Medium')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Storage tips */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            {lang === 'es' ? 'Consejos de Almacenamiento' : 'Storage Tips'}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {lang === 'es' ? 'Haga copias digitales y guárdelas en almacenamiento seguro en la nube' : 'Make digital copies and store in secure cloud storage'}</li>
            <li>• {lang === 'es' ? 'Dé copias a una persona de confianza que no viva con usted' : 'Give copies to a trusted person who doesn\'t live with you'}</li>
            <li>• {lang === 'es' ? 'Considere una caja de seguridad bancaria para originales' : 'Consider a bank safe deposit box for originals'}</li>
            <li>• {lang === 'es' ? 'Nunca lleve todos los documentos originales al mismo tiempo' : 'Never carry all original documents at the same time'}</li>
          </ul>
        </div>

        <Button onClick={handlePrint} variant="outline" className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          {lang === 'es' ? 'Imprimir Lista' : 'Print Checklist'}
        </Button>
      </CardContent>
    </Card>
  );
}
