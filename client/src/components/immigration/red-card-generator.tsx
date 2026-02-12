import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, CreditCard, DoorOpen, Square, Check } from 'lucide-react';

interface RedCardContent {
  id: string;
  type: 'wallet' | 'door' | 'window';
  title: {
    en: string;
    es: string;
    zh: string;
  };
  frontText: {
    en: string[];
    es: string[];
    zh: string[];
  };
  backText: {
    en: string[];
    es: string[];
    zh: string[];
  };
  instructions: {
    en: string;
    es: string;
    zh: string;
  };
}

interface RedCardGeneratorProps {
  cards: RedCardContent[];
}

export function RedCardGenerator({ cards }: RedCardGeneratorProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : i18n.language?.startsWith('zh') ? 'zh' : 'en';
  const [selectedCard, setSelectedCard] = useState<string>('wallet');
  const [printBilingual, setPrintBilingual] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const currentCard = cards.find(c => c.id === selectedCard) || cards[0];

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <CreditCard className="h-5 w-5" />;
      case 'door': return <DoorOpen className="h-5 w-5" />;
      case 'window': return <Square className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  const getCardLabel = (type: string) => {
    switch (type) {
      case 'wallet': return lang === 'es' ? 'Tarjeta de Billetera' : lang === 'zh' ? '钱包卡' : 'Wallet Card';
      case 'door': return lang === 'es' ? 'Colgador de Puerta' : lang === 'zh' ? '门挂牌' : 'Door Hanger';
      case 'window': return lang === 'es' ? 'Letrero de Ventana' : lang === 'zh' ? '窗户标识' : 'Window Sign';
      default: return type;
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        @media print {
          @page {
            size: ${selectedCard === 'wallet' ? '3.5in 2.5in' : 'letter'};
            margin: 0.25in;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 0;
        }
        .print-card {
          border: 2px solid #dc2626;
          border-radius: 8px;
          padding: 16px;
          margin: 8px;
          background: white;
          page-break-inside: avoid;
        }
        .wallet-card {
          width: 3.25in;
          min-height: 2in;
          font-size: 9px;
        }
        .door-card, .window-card {
          width: 100%;
          max-width: 5.5in;
          font-size: 14px;
        }
        .card-title {
          color: #dc2626;
          font-weight: bold;
          font-size: ${selectedCard === 'wallet' ? '11px' : '18px'};
          margin-bottom: 8px;
          text-align: center;
          text-transform: uppercase;
        }
        .card-content {
          margin: 8px 0;
        }
        .card-content p {
          margin: 4px 0;
        }
        .card-lang-label {
          font-weight: bold;
          color: #1d4ed8;
          font-size: ${selectedCard === 'wallet' ? '8px' : '12px'};
          margin-top: 8px;
          text-transform: uppercase;
        }
        .card-divider {
          border-top: 1px dashed #9ca3af;
          margin: 12px 0;
        }
        .instructions {
          font-size: ${selectedCard === 'wallet' ? '7px' : '11px'};
          color: #6b7280;
          font-style: italic;
          margin-top: 8px;
        }
      </style>
    `;

    const cardClass = selectedCard === 'wallet' ? 'wallet-card' :
                      selectedCard === 'door' ? 'door-card' : 'window-card';

    let cardHtml = '';

    // Front side
    cardHtml += `
      <div class="print-card ${cardClass}">
        <div class="card-title">${currentCard.title.en}</div>
        <div class="card-content">
          ${currentCard.frontText.en.map(text => `<p>${text}</p>`).join('')}
        </div>
        ${printBilingual ? `
          <div class="card-divider"></div>
          <div class="card-lang-label">ESPAÑOL</div>
          <div class="card-content">
            ${currentCard.frontText.es.map(text => `<p>${text}</p>`).join('')}
          </div>
        ` : ''}
        <div class="instructions">${currentCard.instructions.en}</div>
      </div>
    `;

    // Back side if there's content
    if (currentCard.backText.en.length > 0) {
      cardHtml += `
        <div class="print-card ${cardClass}">
          <div class="card-title">${lang === 'es' ? 'REVERSO' : lang === 'zh' ? '背面' : 'BACK'}</div>
          <div class="card-content">
            ${currentCard.backText.en.map(text => `<p>${text}</p>`).join('')}
          </div>
          ${printBilingual ? `
            <div class="card-divider"></div>
            <div class="card-lang-label">ESPAÑOL</div>
            <div class="card-content">
              ${currentCard.backText.es.map(text => `<p>${text}</p>`).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentCard.title.en}</title>
          ${styles}
        </head>
        <body>
          ${cardHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center ring-1 ring-red-500/20">
            <CreditCard className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          {lang === 'es' ? 'Generador de Tarjetas Rojas' : lang === 'zh' ? '红卡生成器' : 'Red Card Generator'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Card type selector */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {lang === 'es' ? 'Seleccione el tipo de tarjeta:' : lang === 'zh' ? '选择卡片类型：' : 'Select card type:'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedCard === card.id
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    : 'border-border hover:border-red-300 hover:bg-muted/50'
                }`}
              >
                {getCardIcon(card.type)}
                <span className="text-xs font-medium">{getCardLabel(card.type)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bilingual toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrintBilingual(!printBilingual)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              printBilingual
                ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                : 'border-border hover:border-green-300'
            }`}
          >
            {printBilingual && <Check className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {lang === 'es' ? 'Imprimir bilingüe (EN/ES)' : lang === 'zh' ? '打印双语 (EN/ES)' : 'Print bilingual (EN/ES)'}
            </span>
          </button>
        </div>

        {/* Card preview */}
        <div ref={printRef} className="border-2 border-red-500 rounded-lg p-4 bg-white dark:bg-gray-950">
          <div className="text-center mb-4">
            <Badge variant="destructive" className="text-xs uppercase tracking-wide">
              {currentCard.title[lang]}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">
                English
              </p>
              {currentCard.frontText.en.map((text, idx) => (
                <p key={idx} className="text-sm text-foreground mb-1">{text}</p>
              ))}
            </div>

            {printBilingual && (
              <>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-700" />
                <div>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">
                    Español
                  </p>
                  {currentCard.frontText.es.map((text, idx) => (
                    <p key={idx} className="text-sm text-foreground mb-1">{text}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-muted-foreground italic mt-4">
            {currentCard.instructions[lang]}
          </p>
        </div>

        {/* Print button */}
        <div className="flex gap-3">
          <Button onClick={handlePrint} className="flex-1 bg-red-600 hover:bg-red-700">
            <Printer className="h-4 w-4 mr-2" />
            {lang === 'es' ? 'Imprimir Tarjeta' : lang === 'zh' ? '打印卡片' : 'Print Card'}
          </Button>
        </div>

        {/* Attribution */}
        <p className="text-xs text-muted-foreground text-center">
          {lang === 'es'
            ? 'Basado en materiales del ILRC (Immigrant Legal Resource Center)'
            : lang === 'zh'
            ? '基于ILRC（移民法律资源中心）的材料'
            : 'Based on materials from the ILRC (Immigrant Legal Resource Center)'}
        </p>
      </CardContent>
    </Card>
  );
}
