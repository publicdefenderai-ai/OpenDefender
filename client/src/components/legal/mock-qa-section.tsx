import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import type { MockQAItem, ProceedingType } from "@shared/mock-qa";
import { PROCEEDING_LABELS, getQAByProceeding } from "@shared/mock-qa";

interface MockQASectionProps {
  proceedingType: ProceedingType;
  className?: string;
  compact?: boolean;
}

interface QAItemProps {
  item: MockQAItem;
  index: number;
  compact?: boolean;
}

function QAItem({ item, index, compact = false }: QAItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`border-b border-border/50 last:border-b-0 ${compact ? 'py-3' : 'py-4'}`}
      data-testid={`qa-item-${item.id}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-foreground ${compact ? 'text-sm' : 'text-base'}`}>
            {t(item.questionKey)}
          </p>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 mt-2 text-primary hover:text-primary/80"
                data-testid={`button-toggle-response-${item.id}`}
              >
                {isOpen ? (
                  <>
                    {t('mockQA.hideResponse')}
                    <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    {t('mockQA.showResponse')}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 space-y-3"
                  >
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-1">
                        Suggested Response:
                      </p>
                      <p className={`text-foreground ${compact ? 'text-sm' : 'text-base'}`}>
                        "{t(item.suggestedResponseKey)}"
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'}`}>
                        {t(item.explanationKey)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export function MockQASection({ proceedingType, className = "", compact = false }: MockQASectionProps) {
  const { t, i18n } = useTranslation();
  const qaItems = getQAByProceeding(proceedingType);
  
  if (qaItems.length === 0) {
    return null;
  }

  const proceedingLabel = i18n.language === 'es' 
    ? PROCEEDING_LABELS[proceedingType].es 
    : PROCEEDING_LABELS[proceedingType].en;

  return (
    <Card className={`${className}`} data-testid={`mock-qa-section-${proceedingType}`}>
      <CardHeader className={compact ? 'pb-2' : 'pb-4'}>
        <CardTitle className={compact ? 'text-base' : 'text-lg'}>
          {t('mockQA.sectionTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t('mockQA.sectionSubtitle')}
        </p>
      </CardHeader>
      
      <CardContent className={compact ? 'pt-0' : ''}>
        <div className="divide-y divide-border/50">
          {qaItems.map((item, index) => (
            <QAItem 
              key={item.id} 
              item={item} 
              index={index}
              compact={compact}
            />
          ))}
        </div>
        
        <p className={`mt-4 text-muted-foreground italic ${compact ? 'text-xs' : 'text-sm'}`}>
          {t('mockQA.practiceNote')}
        </p>
      </CardContent>
    </Card>
  );
}

interface MockQAListProps {
  items: Array<{
    question: string;
    suggestedResponse: string;
    explanation: string;
  }>;
  title?: string;
  className?: string;
}

export function MockQAList({ items, title, className = "" }: MockQAListProps) {
  const { t } = useTranslation();
  
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className={className} data-testid="mock-qa-list">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {title || t('mockQA.sectionTitle')}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t('mockQA.sectionSubtitle')}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="divide-y divide-border/50">
          {items.map((item, index) => (
            <DynamicQAItem 
              key={index} 
              item={item} 
              index={index}
            />
          ))}
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground italic">
          {t('mockQA.practiceNote')}
        </p>
      </CardContent>
    </Card>
  );
}

interface DynamicQAItemProps {
  item: {
    question: string;
    suggestedResponse: string;
    explanation: string;
  };
  index: number;
}

function DynamicQAItem({ item, index }: DynamicQAItemProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="py-4 border-b border-border/50 last:border-b-0"
      data-testid={`dynamic-qa-item-${index}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">
            {item.question}
          </p>
          
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 mt-2 text-primary hover:text-primary/80"
                data-testid={`button-toggle-dynamic-response-${index}`}
              >
                {isOpen ? (
                  <>
                    {t('mockQA.hideResponse')}
                    <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    {t('mockQA.showResponse')}
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 space-y-3"
                  >
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                      <p className="text-sm font-medium text-primary mb-1">
                        Suggested Response:
                      </p>
                      <p className="text-foreground">
                        "{item.suggestedResponse}"
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        {item.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}

export default MockQASection;
