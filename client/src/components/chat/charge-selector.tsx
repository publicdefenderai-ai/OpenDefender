import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Check, ChevronDown, ChevronUp, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChargeSelectorProps {
  jurisdiction: string;
  onSelect: (charges: Array<{ code: string; name: string }>) => void;
}

const COMMON_CHARGES = [
  { code: "ASSAULT", name: "Assault", category: "Violent" },
  { code: "BATTERY", name: "Battery", category: "Violent" },
  { code: "DUI", name: "DUI / DWI", category: "Traffic" },
  { code: "DRUG_POSS", name: "Drug Possession", category: "Drug" },
  { code: "THEFT", name: "Theft / Larceny", category: "Property" },
  { code: "BURGLARY", name: "Burglary", category: "Property" },
  { code: "ROBBERY", name: "Robbery", category: "Violent" },
  { code: "FRAUD", name: "Fraud", category: "Financial" },
  { code: "DOMESTIC", name: "Domestic Violence", category: "Violent" },
  { code: "TRESPASS", name: "Trespassing", category: "Property" },
  { code: "DISORDERLY", name: "Disorderly Conduct", category: "Public Order" },
  { code: "VANDALISM", name: "Vandalism / Criminal Mischief", category: "Property" },
  { code: "RESISTING", name: "Resisting Arrest", category: "Public Order" },
  { code: "WEAPONS", name: "Weapons Violation", category: "Weapons" },
  { code: "PROBATION", name: "Probation Violation", category: "Other" },
  { code: "OTHER", name: "Other / Not Listed", category: "Other" },
];

const CATEGORIES = ["All", "Violent", "Property", "Drug", "Traffic", "Financial", "Public Order", "Weapons", "Other"];

export function ChargeSelector({ jurisdiction, onSelect }: ChargeSelectorProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharges, setSelectedCharges] = useState<Array<{ code: string; name: string }>>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredCharges = useMemo(() => {
    return COMMON_CHARGES.filter(charge => {
      const matchesSearch = charge.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || charge.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const toggleCharge = (charge: { code: string; name: string }) => {
    setSelectedCharges(prev => {
      const exists = prev.some(c => c.code === charge.code);
      if (exists) {
        return prev.filter(c => c.code !== charge.code);
      }
      return [...prev, charge];
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
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isExpanded && (
        <>
          <div className="p-3 space-y-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('chat.chargeSelector.searchPlaceholder', 'Search charges...')}
                className="pl-9"
                data-testid="input-charge-search"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  data-testid={`category-${category.toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-48">
            <div className="p-2 space-y-1">
              {filteredCharges.map((charge, index) => {
                const isSelected = selectedCharges.some(c => c.code === charge.code);
                return (
                  <motion.button
                    key={charge.code}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => toggleCharge(charge)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left",
                      "transition-colors text-sm",
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted border border-transparent"
                    )}
                    data-testid={`charge-option-${charge.code}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      )}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <span className={cn(isSelected && "font-medium")}>{charge.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {charge.category}
                    </Badge>
                  </motion.button>
                );
              })}
              {filteredCharges.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  {t('chat.chargeSelector.noResults', 'No charges found')}
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
