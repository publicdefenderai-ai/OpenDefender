import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  Circle,
  Printer,
  Save,
  RotateCcw,
  Shield,
  FileText,
  Users,
  Phone,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  text: {
    en: string;
    es: string;
  };
  priority: 'critical' | 'high' | 'medium';
}

const checklistItems: ChecklistItem[] = [
  // Documents Category
  {
    id: 'doc-1',
    category: 'documents',
    text: {
      en: 'Gather copies of important documents (birth certificates, passports, IDs)',
      es: 'Reúna copias de documentos importantes (actas de nacimiento, pasaportes, identificaciones)'
    },
    priority: 'critical'
  },
  {
    id: 'doc-2',
    category: 'documents',
    text: {
      en: 'Store documents in a safe place known to a trusted person',
      es: 'Guarde los documentos en un lugar seguro conocido por una persona de confianza'
    },
    priority: 'critical'
  },
  {
    id: 'doc-3',
    category: 'documents',
    text: {
      en: 'Make digital copies stored in secure cloud storage',
      es: 'Haga copias digitales guardadas en almacenamiento seguro en la nube'
    },
    priority: 'high'
  },
  {
    id: 'doc-4',
    category: 'documents',
    text: {
      en: 'Know your A-Number (if you have one) and keep it memorized',
      es: 'Conozca su Número A (si tiene uno) y memorícelo'
    },
    priority: 'high'
  },
  {
    id: 'doc-5',
    category: 'documents',
    text: {
      en: 'Prepare a folder with children\'s documents (school records, medical records)',
      es: 'Prepare una carpeta con documentos de los niños (registros escolares, registros médicos)'
    },
    priority: 'high'
  },

  // Emergency Contacts Category
  {
    id: 'contact-1',
    category: 'contacts',
    text: {
      en: 'Identify a trusted person who can care for your children if needed',
      es: 'Identifique a una persona de confianza que pueda cuidar a sus hijos si es necesario'
    },
    priority: 'critical'
  },
  {
    id: 'contact-2',
    category: 'contacts',
    text: {
      en: 'Share emergency contact information with your children (if age appropriate)',
      es: 'Comparta información de contacto de emergencia con sus hijos (si es apropiado para su edad)'
    },
    priority: 'critical'
  },
  {
    id: 'contact-3',
    category: 'contacts',
    text: {
      en: 'Save an immigration attorney\'s number in your phone',
      es: 'Guarde el número de un abogado de inmigración en su teléfono'
    },
    priority: 'critical'
  },
  {
    id: 'contact-4',
    category: 'contacts',
    text: {
      en: 'Program emergency hotline numbers (NILC, ACLU, United We Dream)',
      es: 'Programe números de líneas de emergencia (NILC, ACLU, United We Dream)'
    },
    priority: 'high'
  },
  {
    id: 'contact-5',
    category: 'contacts',
    text: {
      en: 'Know your consulate\'s emergency number',
      es: 'Conozca el número de emergencia de su consulado'
    },
    priority: 'medium'
  },

  // Family Plan Category
  {
    id: 'family-1',
    category: 'family',
    text: {
      en: 'Create a power of attorney for child custody',
      es: 'Cree un poder notarial para la custodia de los hijos'
    },
    priority: 'critical'
  },
  {
    id: 'family-2',
    category: 'family',
    text: {
      en: 'Discuss the emergency plan with your family members',
      es: 'Discuta el plan de emergencia con los miembros de su familia'
    },
    priority: 'critical'
  },
  {
    id: 'family-3',
    category: 'family',
    text: {
      en: 'Ensure children know trusted adults to contact',
      es: 'Asegúrese de que los niños conozcan adultos de confianza a contactar'
    },
    priority: 'high'
  },
  {
    id: 'family-4',
    category: 'family',
    text: {
      en: 'Prepare financial access for family (joint account, authorized user)',
      es: 'Prepare acceso financiero para la familia (cuenta conjunta, usuario autorizado)'
    },
    priority: 'high'
  },
  {
    id: 'family-5',
    category: 'family',
    text: {
      en: 'Create a communication plan (code word, check-in schedule)',
      es: 'Cree un plan de comunicación (palabra clave, horario de contacto)'
    },
    priority: 'medium'
  },

  // Know Your Rights Category
  {
    id: 'rights-1',
    category: 'rights',
    text: {
      en: 'Memorize: "I do not consent to a search" and "I want to speak to a lawyer"',
      es: 'Memorice: "No doy consentimiento para un registro" y "Quiero hablar con un abogado"'
    },
    priority: 'critical'
  },
  {
    id: 'rights-2',
    category: 'rights',
    text: {
      en: 'Carry a Know Your Rights card at all times',
      es: 'Lleve una tarjeta de Conozca Sus Derechos en todo momento'
    },
    priority: 'critical'
  },
  {
    id: 'rights-3',
    category: 'rights',
    text: {
      en: 'Post a Know Your Rights sign near your front door',
      es: 'Coloque un letrero de Conozca Sus Derechos cerca de su puerta principal'
    },
    priority: 'high'
  },
  {
    id: 'rights-4',
    category: 'rights',
    text: {
      en: 'Know the difference between judicial and administrative warrants',
      es: 'Conozca la diferencia entre órdenes judiciales y administrativas'
    },
    priority: 'high'
  },
  {
    id: 'rights-5',
    category: 'rights',
    text: {
      en: 'Practice what to say during an encounter',
      es: 'Practique qué decir durante un encuentro'
    },
    priority: 'medium'
  }
];

const categories = [
  { id: 'documents', icon: FileText, label: { en: 'Documents', es: 'Documentos' } },
  { id: 'contacts', icon: Phone, label: { en: 'Emergency Contacts', es: 'Contactos de Emergencia' } },
  { id: 'family', icon: Users, label: { en: 'Family Plan', es: 'Plan Familiar' } },
  { id: 'rights', icon: Shield, label: { en: 'Know Your Rights', es: 'Conozca Sus Derechos' } }
];

const STORAGE_KEY = 'immigration-safety-checklist';

export function SafetyChecklist() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCheckedItems(new Set(parsed));
      } catch {
        // Invalid data, ignore
      }
    }
  }, []);

  // Save to localStorage when checkedItems changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedItems]));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetChecklist = () => {
    if (window.confirm(lang === 'es'
      ? '¿Está seguro de que desea reiniciar la lista?'
      : 'Are you sure you want to reset the checklist?')) {
      setCheckedItems(new Set());
    }
  };

  const filteredItems = activeCategory === 'all'
    ? checklistItems
    : checklistItems.filter(item => item.category === activeCategory);

  const completedCount = checkedItems.size;
  const totalCount = checklistItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-amber-600 dark:text-amber-400';
      case 'medium': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      critical: { en: 'Critical', es: 'Crítico' },
      high: { en: 'High', es: 'Alto' },
      medium: { en: 'Medium', es: 'Medio' }
    };
    return labels[priority as keyof typeof labels]?.[lang] || priority;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const checkedItemsList = checklistItems.filter(item => checkedItems.has(item.id));
    const uncheckedItemsList = checklistItems.filter(item => !checkedItems.has(item.id));

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lang === 'es' ? 'Lista de Preparación de Seguridad' : 'Safety Preparedness Checklist'}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 20px; color: #666; }
            .progress { font-size: 14px; color: #666; margin-bottom: 20px; }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; gap: 10px; }
            .checkbox { width: 18px; height: 18px; border: 2px solid #333; border-radius: 3px; flex-shrink: 0; }
            .checked { background: #22c55e; border-color: #22c55e; }
            .priority { font-size: 10px; padding: 2px 6px; border-radius: 10px; }
            .critical { background: #fee2e2; color: #dc2626; }
            .high { background: #fef3c7; color: #d97706; }
            .medium { background: #dbeafe; color: #2563eb; }
            .footer { margin-top: 30px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <h1>${lang === 'es' ? 'Lista de Preparación de Seguridad' : 'Safety Preparedness Checklist'}</h1>
          <p class="progress">${lang === 'es' ? 'Progreso' : 'Progress'}: ${completedCount}/${totalCount} (${progress}%)</p>

          ${uncheckedItemsList.length > 0 ? `
            <h2>${lang === 'es' ? 'Pendientes' : 'To Do'}</h2>
            <ul>
              ${uncheckedItemsList.map(item => `
                <li>
                  <div class="checkbox"></div>
                  <div>
                    ${item.text[lang]}
                    <span class="priority ${item.priority}">${getPriorityLabel(item.priority)}</span>
                  </div>
                </li>
              `).join('')}
            </ul>
          ` : ''}

          ${checkedItemsList.length > 0 ? `
            <h2>${lang === 'es' ? 'Completados' : 'Completed'}</h2>
            <ul>
              ${checkedItemsList.map(item => `
                <li>
                  <div class="checkbox checked"></div>
                  <div>${item.text[lang]}</div>
                </li>
              `).join('')}
            </ul>
          ` : ''}

          <p class="footer">
            ${lang === 'es'
              ? 'Generado por Public Defender AI - Guía de Inmigración'
              : 'Generated by Public Defender AI - Immigration Guidance'}
          </p>
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <span>{lang === 'es' ? 'Lista de Preparación de Seguridad' : 'Safety Preparedness Checklist'}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy note */}
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            {lang === 'es'
              ? 'Su progreso se guarda solo en su dispositivo. No enviamos ningún dato a nuestros servidores.'
              : 'Your progress is saved only on your device. We do not send any data to our servers.'}
          </AlertDescription>
        </Alert>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {lang === 'es' ? 'Progreso' : 'Progress'}
            </span>
            <span className="font-medium">{completedCount}/{totalCount} ({progress}%)</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {lang === 'es' ? 'Todos' : 'All'}
          </button>
          {categories.map(cat => {
            const Icon = cat.icon;
            const categoryItems = checklistItems.filter(i => i.category === cat.id);
            const categoryCompleted = categoryItems.filter(i => checkedItems.has(i.id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label[lang]}
                <span className="text-xs opacity-75">
                  {categoryCompleted}/{categoryItems.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Checklist items */}
        <div className="space-y-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                checkedItems.has(item.id)
                  ? 'bg-green-50 dark:bg-green-950/30'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="mt-0.5">
                {checkedItems.has(item.id) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}`}>
                  {item.text[lang]}
                </p>
                <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                  {getPriorityLabel(item.priority)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            {lang === 'es' ? 'Imprimir' : 'Print'}
          </Button>
          <Button onClick={resetChecklist} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            {lang === 'es' ? 'Reiniciar' : 'Reset'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
