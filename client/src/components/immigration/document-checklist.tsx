import { BrandShieldIcon } from "@/components/brand-logo";
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
  
  AlertTriangle
} from 'lucide-react';

type Lang = 'en' | 'es' | 'zh';

interface LocalizedString {
  en: string;
  es: string;
  zh: string;
}

interface DocumentCategory {
  id: string;
  title: LocalizedString;
  icon: React.ReactNode;
  documents: {
    id: string;
    name: LocalizedString;
    description: LocalizedString;
    priority: 'critical' | 'high' | 'medium';
  }[];
}

const documentCategories: DocumentCategory[] = [
  {
    id: 'identity',
    title: { en: 'Identity Documents', es: 'Documentos de Identidad', zh: '身份证件' },
    icon: <User className="h-5 w-5" />,
    documents: [
      {
        id: 'id-1',
        name: { en: 'Birth certificates (all family members)', es: 'Actas de nacimiento (todos los miembros de la familia)', zh: '所有家庭成员的出生证明' },
        description: { en: 'Get certified copies from the issuing country/state', es: 'Obtenga copias certificadas del país/estado emisor', zh: '从发证国家/州获取经认证的副本' },
        priority: 'critical'
      },
      {
        id: 'id-2',
        name: { en: 'Passports', es: 'Pasaportes', zh: '护照' },
        description: { en: 'Valid passports for all family members', es: 'Pasaportes válidos para todos los miembros de la familia', zh: '所有家庭成员的有效护照' },
        priority: 'critical'
      },
      {
        id: 'id-3',
        name: { en: 'State ID / Driver\'s licenses', es: 'Identificaciones estatales / Licencias de conducir', zh: '州政府颁发的身份证/驾照' },
        description: { en: 'Current government-issued ID', es: 'Identificación gubernamental actual', zh: '当前有效的政府颁发身份证' },
        priority: 'high'
      },
      {
        id: 'id-4',
        name: { en: 'Social Security cards', es: 'Tarjetas de Seguro Social', zh: '社会安全卡' },
        description: { en: 'Or documentation of ITIN numbers', es: 'O documentación de números ITIN', zh: '或ITIN号码的相关文件' },
        priority: 'high'
      },
      {
        id: 'id-5',
        name: { en: 'Marriage certificate', es: 'Acta de matrimonio', zh: '结婚证' },
        description: { en: 'If applicable', es: 'Si aplica', zh: '如适用' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'immigration',
    title: { en: 'Immigration Documents', es: 'Documentos de Inmigración', zh: '移民文件' },
    icon: <BrandShieldIcon size={20} />,
    documents: [
      {
        id: 'imm-1',
        name: { en: 'Immigration status documents', es: 'Documentos de estatus migratorio', zh: '移民身份文件' },
        description: { en: 'Visa, green card, EAD, or DACA approval notice', es: 'Visa, tarjeta verde, EAD o notificación de aprobación DACA', zh: '签证、绿卡、EAD或DACA批准通知' },
        priority: 'critical'
      },
      {
        id: 'imm-2',
        name: { en: 'A-Number documentation', es: 'Documentación del Número A', zh: 'A号码文件' },
        description: { en: 'Any document showing your A-Number', es: 'Cualquier documento que muestre su Número A', zh: '任何显示您A号码的文件' },
        priority: 'critical'
      },
      {
        id: 'imm-3',
        name: { en: 'Immigration court notices', es: 'Notificaciones del tribunal de inmigración', zh: '移民法庭通知' },
        description: { en: 'All court dates and hearing notices', es: 'Todas las fechas de corte y notificaciones de audiencias', zh: '所有开庭日期和听证通知' },
        priority: 'critical'
      },
      {
        id: 'imm-4',
        name: { en: 'Entry/exit records', es: 'Registros de entrada/salida', zh: '入境/出境记录' },
        description: { en: 'I-94 or travel stamps in passport', es: 'I-94 o sellos de viaje en pasaporte', zh: '护照中的I-94表或旅行盖章' },
        priority: 'high'
      },
      {
        id: 'imm-5',
        name: { en: 'Previous immigration applications', es: 'Solicitudes de inmigración anteriores', zh: '之前的移民申请' },
        description: { en: 'Copies of any filed applications', es: 'Copias de cualquier solicitud presentada', zh: '任何已提交申请的副本' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'children',
    title: { en: 'Children\'s Documents', es: 'Documentos de los Niños', zh: '儿童文件' },
    icon: <Heart className="h-5 w-5" />,
    documents: [
      {
        id: 'child-1',
        name: { en: 'Birth certificates for all children', es: 'Actas de nacimiento de todos los niños', zh: '所有子女的出生证明' },
        description: { en: 'Certified copies - proves citizenship if US-born', es: 'Copias certificadas - prueba ciudadanía si nacieron en EE.UU.', zh: '经认证的副本——如在美国出生可证明公民身份' },
        priority: 'critical'
      },
      {
        id: 'child-2',
        name: { en: 'School enrollment records', es: 'Registros de inscripción escolar', zh: '学校入学记录' },
        description: { en: 'Current school and grade information', es: 'Información de escuela y grado actual', zh: '当前学校和年级信息' },
        priority: 'high'
      },
      {
        id: 'child-3',
        name: { en: 'Immunization records', es: 'Registros de vacunación', zh: '免疫接种记录' },
        description: { en: 'Complete vaccination history', es: 'Historial completo de vacunación', zh: '完整的疫苗接种历史' },
        priority: 'high'
      },
      {
        id: 'child-4',
        name: { en: 'Medical records', es: 'Registros médicos', zh: '医疗记录' },
        description: { en: 'Especially for any ongoing conditions', es: 'Especialmente para cualquier condición continua', zh: '尤其是任何持续性疾病的记录' },
        priority: 'high'
      },
      {
        id: 'child-5',
        name: { en: 'Custody documents (if applicable)', es: 'Documentos de custodia (si aplica)', zh: '监护文件（如适用）' },
        description: { en: 'Court orders regarding custody', es: 'Órdenes judiciales sobre custodia', zh: '关于监护权的法院命令' },
        priority: 'high'
      }
    ]
  },
  {
    id: 'financial',
    title: { en: 'Financial Documents', es: 'Documentos Financieros', zh: '财务文件' },
    icon: <DollarSign className="h-5 w-5" />,
    documents: [
      {
        id: 'fin-1',
        name: { en: 'Bank account information', es: 'Información de cuentas bancarias', zh: '银行账户信息' },
        description: { en: 'Account numbers, bank name, authorized users', es: 'Números de cuenta, nombre del banco, usuarios autorizados', zh: '账号、银行名称、授权用户' },
        priority: 'critical'
      },
      {
        id: 'fin-2',
        name: { en: 'Property documents', es: 'Documentos de propiedad', zh: '房产文件' },
        description: { en: 'Deeds, rental agreements, mortgage info', es: 'Escrituras, contratos de alquiler, información de hipoteca', zh: '房产契约、租赁协议、抵押贷款信息' },
        priority: 'high'
      },
      {
        id: 'fin-3',
        name: { en: 'Vehicle titles', es: 'Títulos de vehículos', zh: '车辆所有权证书' },
        description: { en: 'Registration and insurance information', es: 'Información de registro y seguro', zh: '登记和保险信息' },
        priority: 'high'
      },
      {
        id: 'fin-4',
        name: { en: 'Tax returns (last 3 years)', es: 'Declaraciones de impuestos (últimos 3 años)', zh: '纳税申报单（过去3年）' },
        description: { en: 'Can help prove length of time in US', es: 'Puede ayudar a probar tiempo en EE.UU.', zh: '可帮助证明在美国居住的年限' },
        priority: 'medium'
      },
      {
        id: 'fin-5',
        name: { en: 'Insurance policies', es: 'Pólizas de seguro', zh: '保险单' },
        description: { en: 'Health, life, auto insurance information', es: 'Información de seguro médico, de vida, auto', zh: '医疗、人寿、汽车保险信息' },
        priority: 'medium'
      }
    ]
  },
  {
    id: 'legal',
    title: { en: 'Legal Documents', es: 'Documentos Legales', zh: '法律文件' },
    icon: <Scale className="h-5 w-5" />,
    documents: [
      {
        id: 'legal-1',
        name: { en: 'Power of Attorney for children', es: 'Poder notarial para los niños', zh: '子女授权书' },
        description: { en: 'Designating caregiver authority', es: 'Designando autoridad del cuidador', zh: '指定看护人权限' },
        priority: 'critical'
      },
      {
        id: 'legal-2',
        name: { en: 'Immigration attorney contact', es: 'Contacto del abogado de inmigración', zh: '移民律师联系方式' },
        description: { en: 'Name, phone, address, case number', es: 'Nombre, teléfono, dirección, número de caso', zh: '姓名、电话、地址、案件号' },
        priority: 'critical'
      },
      {
        id: 'legal-3',
        name: { en: 'Financial power of attorney', es: 'Poder notarial financiero', zh: '财务授权书' },
        description: { en: 'For managing finances if detained', es: 'Para administrar finanzas si es detenido', zh: '被拘留时用于管理财务' },
        priority: 'high'
      },
      {
        id: 'legal-4',
        name: { en: 'Healthcare directive', es: 'Directiva de atención médica', zh: '医疗指令' },
        description: { en: 'Healthcare decisions if unable to make them', es: 'Decisiones de salud si no puede tomarlas', zh: '无法做出决定时的医疗决策' },
        priority: 'medium'
      }
    ]
  }
];

const STORAGE_KEY = 'immigration-document-checklist';

function t3(obj: LocalizedString, lang: Lang): string {
  return obj[lang] ?? obj.en;
}

const labels: Record<string, Record<Lang, string>> = {
  all:          { en: 'All', es: 'Todos', zh: '全部' },
  title:        { en: 'Important Documents Checklist', es: 'Lista de Documentos Importantes', zh: '重要文件清单' },
  progress:     { en: 'Progress', es: 'Progreso', zh: '进度' },
  privacy:      { en: 'Your progress is saved only on your device. We do not send data to our servers.', es: 'Su progreso se guarda solo en su dispositivo. No enviamos datos a nuestros servidores.', zh: '您的进度仅保存在您的设备上，我们不会将数据发送到服务器。' },
  storageTips:  { en: 'Storage Tips', es: 'Consejos de Almacenamiento', zh: '存储建议' },
  tip1:         { en: 'Make digital copies and store in secure cloud storage', es: 'Haga copias digitales y guárdelas en almacenamiento seguro en la nube', zh: '制作数字副本并存储在安全的云存储中' },
  tip2:         { en: "Give copies to a trusted person who doesn't live with you", es: 'Dé copias a una persona de confianza que no viva con usted', zh: '将副本交给不与您同住的可信赖人员' },
  tip3:         { en: 'Consider a bank safe deposit box for originals', es: 'Considere una caja de seguridad bancaria para originales', zh: '考虑将原件存放在银行保险柜中' },
  tip4:         { en: 'Never carry all original documents at the same time', es: 'Nunca lleve todos los documentos originales al mismo tiempo', zh: '切勿同时携带所有原始文件' },
  printBtn:     { en: 'Print Checklist', es: 'Imprimir Lista', zh: '打印清单' },
  printTitle:   { en: 'Important Documents Checklist', es: 'Lista de Documentos', zh: '重要文件清单' },
  critical:     { en: 'Critical', es: 'Crítico', zh: '关键' },
  high:         { en: 'High', es: 'Alto', zh: '重要' },
  medium:       { en: 'Medium', es: 'Medio', zh: '一般' },
};

export function DocumentChecklist() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('zh') ? 'zh' : i18n.language?.startsWith('es') ? 'es' : 'en';
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
          <title>${labels.printTitle[lang]}</title>
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
          <h1>${labels.title[lang]}</h1>
          <p class="progress">${labels.progress[lang]}: ${completedCount}/${totalCount} (${progress}%)</p>

          ${documentCategories.map(cat => `
            <h2>${t3(cat.title, lang)}</h2>
            <ul>
              ${cat.documents.map(doc => `
                <li>
                  <div class="checkbox ${checkedDocs.has(doc.id) ? 'checked' : ''}"></div>
                  <div>
                    <span>${t3(doc.name, lang)}</span>
                    <span class="priority ${doc.priority}">${labels[doc.priority][lang]}</span>
                    <p class="description">${t3(doc.description, lang)}</p>
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
          {labels.title[lang]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Privacy note */}
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
            {labels.privacy[lang]}
          </AlertDescription>
        </Alert>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{labels.progress[lang]}</span>
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
            {labels.all[lang]}
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
              {t3(cat.title, lang)}
            </button>
          ))}
        </div>

        {/* Document list */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto">
          {filteredDocs.map(category => (
            <div key={category.id}>
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                {category.icon}
                {t3(category.title, lang)}
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
                        {t3(doc.name, lang)}
                      </p>
                      <p className="text-xs text-muted-foreground">{t3(doc.description, lang)}</p>
                      <span className={`text-xs ${getPriorityColor(doc.priority)}`}>
                        {labels[doc.priority][lang]}
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
            {labels.storageTips[lang]}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {labels.tip1[lang]}</li>
            <li>• {labels.tip2[lang]}</li>
            <li>• {labels.tip3[lang]}</li>
            <li>• {labels.tip4[lang]}</li>
          </ul>
        </div>

        <Button onClick={handlePrint} variant="outline" className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          {labels.printBtn[lang]}
        </Button>
      </CardContent>
    </Card>
  );
}
