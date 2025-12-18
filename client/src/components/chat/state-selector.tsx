import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface StateSelectorProps {
  onSelect: (stateCode: string) => void;
}

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" },
];

export function StateSelector({ onSelect }: StateSelectorProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filteredStates = US_STATES.filter(state =>
    state.name.toLowerCase().includes(search.toLowerCase()) ||
    state.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background border border-border rounded-xl overflow-hidden w-full max-w-full"
    >
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chat.stateSelector.placeholder', 'Search for your state...')}
            className="pl-9"
            data-testid="input-state-search"
          />
        </div>
      </div>

      <ScrollArea className="h-64">
        <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {filteredStates.map((state, index) => (
            <motion.button
              key={state.code}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onSelect(state.code)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-left",
                "text-sm hover:bg-muted transition-colors",
                "border border-transparent hover:border-primary/30"
              )}
              data-testid={`state-option-${state.code}`}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{state.name}</span>
            </motion.button>
          ))}
          {filteredStates.length === 0 && (
            <p className="col-span-full text-center text-sm text-muted-foreground py-4">
              {t('chat.stateSelector.noResults', 'No states found')}
            </p>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
