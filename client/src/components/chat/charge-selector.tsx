import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Check, ChevronDown, ChevronUp, Scale, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Charge {
  id: string;
  code: string;
  name: string;
  category: 'felony' | 'misdemeanor' | 'infraction';
  description: string;
  maxPenalty: string;
}

interface ChargeSelectorProps {
  jurisdiction: string;
  onSelect: (charges: Array<{ code: string; name: string }>) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'All': 'All',
  'felony': 'Felony',
  'misdemeanor': 'Misdemeanor',
  'infraction': 'Infraction',
};

export function ChargeSelector({ jurisdiction, onSelect }: ChargeSelectorProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharges, setSelectedCharges] = useState<Array<{ code: string; name: string }>>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery<{ charges: Charge[]; count: number; totalAvailable: number }>({
    queryKey: ['/api/criminal-charges', jurisdiction, debouncedSearch, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        jurisdiction,
        limit: '100',
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      
      const res = await fetch(`/api/criminal-charges?${params}`);
      if (!res.ok) throw new Error('Failed to fetch charges');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const charges = data?.charges || [];
  const totalAvailable = data?.totalAvailable || 0;

  const toggleCharge = (charge: Charge) => {
    setSelectedCharges(prev => {
      const exists = prev.some(c => c.code === charge.code);
      if (exists) {
        return prev.filter(c => c.code !== charge.code);
      }
      return [...prev, { code: charge.code, name: charge.name }];
    });
  };

  const handleSubmit = () => {
    if (selectedCharges.length > 0) {
      onSelect(selectedCharges);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 border-b border-border hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm">
            {t('chat.chargeSelector.title', 'Select Charges')}
          </span>
          {selectedCharges.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedCharges.length} {t('chat.chargeSelector.selected', 'selected')}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{totalAvailable} available</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isExpanded && (
        <>
          <div className="p-3 space-y-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('chat.chargeSelector.searchPlaceholder', 'Search all charges...')}
                className="pl-9"
                data-testid="input-charge-search"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    selectedCategory === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  data-testid={`category-${key.toLowerCase()}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-56">
            <div className="p-2 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading charges...</span>
                </div>
              ) : charges.length > 0 ? (
                charges.map((charge, index) => {
                  const isSelected = selectedCharges.some(c => c.code === charge.code);
                  return (
                    <motion.button
                      key={charge.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.01, 0.3) }}
                      onClick={() => toggleCharge(charge)}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left",
                        "transition-colors text-sm",
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted border border-transparent"
                      )}
                      data-testid={`charge-option-${charge.id}`}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors mt-0.5",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn("truncate", isSelected && "font-medium")}>{charge.name}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs flex-shrink-0",
                              charge.category === 'felony' && "border-red-500/50 text-red-600",
                              charge.category === 'misdemeanor' && "border-yellow-500/50 text-yellow-600",
                              charge.category === 'infraction' && "border-green-500/50 text-green-600"
                            )}
                          >
                            {CATEGORY_LABELS[charge.category]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{charge.description}</p>
                      </div>
                    </motion.button>
                  );
                })
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {debouncedSearch 
                    ? t('chat.chargeSelector.noResults', 'No charges found matching your search')
                    : t('chat.chargeSelector.noCharges', 'No charges available')
                  }
                </p>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border bg-muted/30">
            <Button
              onClick={handleSubmit}
              disabled={selectedCharges.length === 0}
              className="w-full"
              data-testid="button-confirm-charges"
            >
              {selectedCharges.length === 0
                ? t('chat.chargeSelector.selectAtLeast', 'Select at least one charge')
                : t('chat.chargeSelector.continue', `Continue with ${selectedCharges.length} charge${selectedCharges.length > 1 ? 's' : ''}`)
              }
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}
