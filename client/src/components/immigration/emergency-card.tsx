import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Printer,
  Phone,
  User,
  Scale,
  Globe,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { consulates, searchConsulates } from '../../../../shared/data/consulates';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyCardData {
  trustedPerson1: EmergencyContact;
  trustedPerson2: EmergencyContact;
  attorney: {
    name: string;
    phone: string;
    firm: string;
  };
  consulate: string;
  medicalInfo: string;
  childrenNames: string;
}

const initialData: EmergencyCardData = {
  trustedPerson1: { name: '', phone: '', relationship: '' },
  trustedPerson2: { name: '', phone: '', relationship: '' },
  attorney: { name: '', phone: '', firm: '' },
  consulate: '',
  medicalInfo: '',
  childrenNames: ''
};

export function EmergencyCard() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [data, setData] = useState<EmergencyCardData>(initialData);
  const [consulateSearch, setConsulateSearch] = useState('');

  const matchingConsulates = consulateSearch.length > 0
    ? searchConsulates(consulateSearch)
    : [];

  const selectedConsulate = consulates.find(c =>
    c.country === data.consulate || c.countryEs === data.consulate
  );

  const updateData = (path: string, value: string) => {
    setData(prev => {
      const parts = path.split('.');
      if (parts.length === 1) {
        return { ...prev, [path]: value };
      }
      const [parent, child] = parts;
      return {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof EmergencyCardData] as object),
          [child]: value
        }
      };
    });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const consulateInfo = selectedConsulate
      ? `${selectedConsulate.mainPhone}${selectedConsulate.emergencyPhone ? ` / ${selectedConsulate.emergencyPhone}` : ''}`
      : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${lang === 'es' ? 'Tarjeta de Contacto de Emergencia' : 'Emergency Contact Card'}</title>
          <style>
            @media print {
              @page { size: 4in 6in; margin: 0.25in; }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0;
              padding: 0;
            }
            .card {
              border: 3px solid #dc2626;
              border-radius: 12px;
              padding: 16px;
              max-width: 3.5in;
              background: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #dc2626;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .title {
              color: #dc2626;
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
              margin: 0;
            }
            .subtitle {
              font-size: 10px;
              color: #666;
              margin-top: 4px;
            }
            .section {
              margin-bottom: 10px;
            }
            .section-title {
              font-size: 10px;
              font-weight: bold;
              color: #1d4ed8;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .contact {
              font-size: 11px;
              margin-bottom: 4px;
            }
            .contact strong {
              color: #333;
            }
            .contact .phone {
              font-weight: bold;
              color: #dc2626;
            }
            .rights-box {
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 6px;
              padding: 8px;
              margin-top: 10px;
            }
            .rights-title {
              font-size: 9px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 4px;
            }
            .rights-text {
              font-size: 8px;
              color: #333;
              line-height: 1.3;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <p class="title">${lang === 'es' ? 'TARJETA DE CONTACTO DE EMERGENCIA' : 'EMERGENCY CONTACT CARD'}</p>
              <p class="subtitle">${lang === 'es' ? 'En caso de emergencia de inmigración' : 'In case of immigration emergency'}</p>
            </div>

            ${(data.trustedPerson1.name || data.trustedPerson2.name) ? `
              <div class="section">
                <p class="section-title">${lang === 'es' ? 'Personas de Confianza' : 'Trusted Persons'}</p>
                ${data.trustedPerson1.name ? `
                  <p class="contact">
                    <strong>${data.trustedPerson1.name}</strong>
                    ${data.trustedPerson1.relationship ? `(${data.trustedPerson1.relationship})` : ''}
                    <br><span class="phone">${data.trustedPerson1.phone}</span>
                  </p>
                ` : ''}
                ${data.trustedPerson2.name ? `
                  <p class="contact">
                    <strong>${data.trustedPerson2.name}</strong>
                    ${data.trustedPerson2.relationship ? `(${data.trustedPerson2.relationship})` : ''}
                    <br><span class="phone">${data.trustedPerson2.phone}</span>
                  </p>
                ` : ''}
              </div>
            ` : ''}

            ${data.attorney.name ? `
              <div class="section">
                <p class="section-title">${lang === 'es' ? 'Abogado' : 'Attorney'}</p>
                <p class="contact">
                  <strong>${data.attorney.name}</strong>
                  ${data.attorney.firm ? `<br>${data.attorney.firm}` : ''}
                  <br><span class="phone">${data.attorney.phone}</span>
                </p>
              </div>
            ` : ''}

            ${selectedConsulate ? `
              <div class="section">
                <p class="section-title">${lang === 'es' ? 'Consulado' : 'Consulate'}</p>
                <p class="contact">
                  <strong>${lang === 'es' ? selectedConsulate.countryEs : selectedConsulate.country}</strong>
                  <br><span class="phone">${consulateInfo}</span>
                </p>
              </div>
            ` : ''}

            ${data.childrenNames ? `
              <div class="section">
                <p class="section-title">${lang === 'es' ? 'Hijos' : 'Children'}</p>
                <p class="contact">${data.childrenNames}</p>
              </div>
            ` : ''}

            ${data.medicalInfo ? `
              <div class="section">
                <p class="section-title">${lang === 'es' ? 'Info Médica' : 'Medical Info'}</p>
                <p class="contact">${data.medicalInfo}</p>
              </div>
            ` : ''}

            <div class="section">
              <p class="section-title">${lang === 'es' ? 'Líneas de Emergencia' : 'Emergency Hotlines'}</p>
              <p class="contact">NILC: <span class="phone">213-639-3900</span></p>
              <p class="contact">United We Dream: <span class="phone">1-844-363-1423</span></p>
            </div>

            <div class="rights-box">
              <p class="rights-title">${lang === 'es' ? 'MIS DERECHOS' : 'MY RIGHTS'}</p>
              <p class="rights-text">
                ${lang === 'es'
                  ? 'Tengo derecho a guardar silencio. No doy consentimiento para entrar. Quiero hablar con un abogado.'
                  : 'I have the right to remain silent. I do not consent to entry. I want to speak to a lawyer.'}
              </p>
            </div>
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
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center ring-1 ring-red-500/20">
            <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          {lang === 'es' ? 'Tarjeta de Contacto de Emergencia' : 'Emergency Contact Card'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Privacy note */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <Lock className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            {lang === 'es'
              ? 'Esta información no se guarda en nuestros servidores. Solo se usa para generar su tarjeta imprimible.'
              : 'This information is not saved to our servers. It is only used to generate your printable card.'}
          </span>
        </div>

        {/* Trusted Person 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <Label className="font-semibold">
              {lang === 'es' ? 'Persona de Confianza #1' : 'Trusted Person #1'}
            </Label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Nombre' : 'Name'}</Label>
              <Input
                value={data.trustedPerson1.name}
                onChange={(e) => updateData('trustedPerson1.name', e.target.value)}
                placeholder={lang === 'es' ? 'Nombre completo' : 'Full name'}
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
              <Input
                value={data.trustedPerson1.phone}
                onChange={(e) => updateData('trustedPerson1.phone', e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Relación' : 'Relationship'}</Label>
              <Input
                value={data.trustedPerson1.relationship}
                onChange={(e) => updateData('trustedPerson1.relationship', e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Hermana' : 'E.g., Sister'}
              />
            </div>
          </div>
        </div>

        {/* Trusted Person 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <Label className="font-semibold">
              {lang === 'es' ? 'Persona de Confianza #2' : 'Trusted Person #2'}
            </Label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Nombre' : 'Name'}</Label>
              <Input
                value={data.trustedPerson2.name}
                onChange={(e) => updateData('trustedPerson2.name', e.target.value)}
                placeholder={lang === 'es' ? 'Nombre completo' : 'Full name'}
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
              <Input
                value={data.trustedPerson2.phone}
                onChange={(e) => updateData('trustedPerson2.phone', e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Relación' : 'Relationship'}</Label>
              <Input
                value={data.trustedPerson2.relationship}
                onChange={(e) => updateData('trustedPerson2.relationship', e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Vecino' : 'E.g., Neighbor'}
              />
            </div>
          </div>
        </div>

        {/* Attorney */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <Label className="font-semibold">
              {lang === 'es' ? 'Abogado de Inmigración' : 'Immigration Attorney'}
            </Label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Nombre' : 'Name'}</Label>
              <Input
                value={data.attorney.name}
                onChange={(e) => updateData('attorney.name', e.target.value)}
                placeholder={lang === 'es' ? 'Nombre del abogado' : 'Attorney name'}
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
              <Input
                value={data.attorney.phone}
                onChange={(e) => updateData('attorney.phone', e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
            <div>
              <Label className="text-xs">{lang === 'es' ? 'Firma/Oficina' : 'Firm/Office'}</Label>
              <Input
                value={data.attorney.firm}
                onChange={(e) => updateData('attorney.firm', e.target.value)}
                placeholder={lang === 'es' ? 'Nombre de la firma' : 'Firm name'}
              />
            </div>
          </div>
        </div>

        {/* Consulate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <Label className="font-semibold">
              {lang === 'es' ? 'Consulado' : 'Consulate'}
            </Label>
          </div>
          <div className="relative">
            <Input
              value={consulateSearch || data.consulate}
              onChange={(e) => {
                setConsulateSearch(e.target.value);
                if (!e.target.value) {
                  updateData('consulate', '');
                }
              }}
              placeholder={lang === 'es' ? 'Buscar país...' : 'Search country...'}
            />
            {matchingConsulates.length > 0 && consulateSearch && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {matchingConsulates.map(c => (
                  <button
                    key={c.country}
                    onClick={() => {
                      updateData('consulate', c.country);
                      setConsulateSearch('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                  >
                    {lang === 'es' ? c.countryEs : c.country}
                    <span className="text-muted-foreground ml-2">{c.mainPhone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedConsulate && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded p-2">
              <strong>{lang === 'es' ? selectedConsulate.countryEs : selectedConsulate.country}:</strong>{' '}
              {selectedConsulate.mainPhone}
              {selectedConsulate.emergencyPhone && ` / ${selectedConsulate.emergencyPhone}`}
            </div>
          )}
        </div>

        {/* Children */}
        <div className="space-y-3">
          <Label className="font-semibold">
            {lang === 'es' ? 'Nombres de los Hijos (opcional)' : 'Children\'s Names (optional)'}
          </Label>
          <Input
            value={data.childrenNames}
            onChange={(e) => updateData('childrenNames', e.target.value)}
            placeholder={lang === 'es' ? 'Ej: Maria (8), Carlos (5)' : 'E.g., Maria (8), Carlos (5)'}
          />
        </div>

        {/* Medical Info */}
        <div className="space-y-3">
          <Label className="font-semibold">
            {lang === 'es' ? 'Información Médica Importante (opcional)' : 'Important Medical Info (optional)'}
          </Label>
          <Input
            value={data.medicalInfo}
            onChange={(e) => updateData('medicalInfo', e.target.value)}
            placeholder={lang === 'es' ? 'Ej: Diabetes, alergias' : 'E.g., Diabetes, allergies'}
          />
        </div>

        {/* Print button */}
        <Button onClick={handlePrint} className="w-full bg-red-600 hover:bg-red-700">
          <Printer className="h-4 w-4 mr-2" />
          {lang === 'es' ? 'Imprimir Tarjeta de Emergencia' : 'Print Emergency Card'}
        </Button>

        {/* Tip */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
          <span>
            {lang === 'es'
              ? 'Consejo: Imprima múltiples copias. Dé una a cada persona de confianza y guarde una en su billetera.'
              : 'Tip: Print multiple copies. Give one to each trusted person and keep one in your wallet.'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
