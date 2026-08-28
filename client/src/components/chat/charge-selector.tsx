import { useState, useEffect } from "react";
import { JuryInstructionBadge } from "@/components/legal/jury-instruction-badge";
import { motion } from "framer-motion";
import { Search, Check, ChevronDown, ChevronUp, Scale, Loader2, Filter, ExternalLink, FileCheck2, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getInstructionPaywall } from "@shared/criminal-charges";

interface Charge {
  id: string;
  /** Present only when the entry has a verified high-confidence citation.
   *  Absent for unverified/synthesized codes — use `citation` instead. */
  code?: string | null;
  /** Verified statute citation string, or null when unverified. */
  citation?: string | null;
  name: string;
  category: 'felony' | 'misdemeanor' | 'infraction';
  description: string;
  maxPenalty: string;
  instructionRef?: string;
  instructionUrl?: string;
}

interface ChargeProvenanceSource {
  citation: string;
  section: string;
  sourceUrl: string;
  publisher: string;
  sourceType: string;
  retrievedAt: string | null;
  manifestImportedAt: string;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
  contentAvailable: boolean;
  contentHash: string;
  hashBasis: string;
  status: string;
  supportRole: string;
  subdivision: string | null;
}

interface ChargeProvenance {
  chargeId: string;
  officialTitle: string;
  citation: string;
  sources: ChargeProvenanceSource[];
}

interface ChargeSelectorProps {
  jurisdiction: string;
  onSelect: (charges: ChargeSelection[]) => void;
}

export type ChargeSelection = {
  id: string;
  name: string;
};

const CATEGORY_KEYS = ['All', 'felony', 'misdemeanor', 'infraction'] as const;

const CHARGE_GROUPS = [
  'All Groups',
  'Violent Crimes',
  'Assault Crimes',
  'Homicide Crimes',
  'Sexual Offenses',
  'Theft & Property',
  'Burglary Crimes',
  'Robbery Crimes',
  'Drug Offenses',
  'Weapons',
  'Fraud',
  'Public Order',
  'DUI & Traffic',
  'Other',
] as const;

export function ChargeSelector({ jurisdiction, onSelect }: ChargeSelectorProps) {
  const { t, i18n } = useTranslation();
  
  const getCategoryLabel = (key: string) => {
    const keyLower = key.toLowerCase();
    return t(`chat.chargeSelector.categories.${keyLower}`, key);
  };
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [selectedCharges, setSelectedCharges] = useState<ChargeSelection[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [provenanceChargeId, setProvenanceChargeId] = useState<string | null>(null);
  const [unavailableChargeIds, setUnavailableChargeIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setProvenanceChargeId(null);
    setUnavailableChargeIds(new Set());
  }, [jurisdiction]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery<{ charges: Charge[]; count: number; totalAvailable: number }>({
    queryKey: ['/api/criminal-charges', jurisdiction, debouncedSearch, selectedCategory, selectedGroup, i18n.language],
    queryFn: async () => {
      const params = new URLSearchParams({
        jurisdiction,
        limit: '200',
        language: i18n.language,
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedGroup !== 'All Groups') params.append('group', selectedGroup);
      
      const res = await fetch(`/api/criminal-charges?${params}`);
      if (!res.ok) throw new Error('Failed to fetch charges');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const charges = (data?.charges || []).sort((a, b) => a.name.localeCompare(b.name));
  const totalAvailable = data?.totalAvailable || 0;
  const isNewYork = jurisdiction.toUpperCase() === "NY";

  const {
    data: provenance,
    isLoading: isProvenanceLoading,
    isFetching: isProvenanceFetching,
    isError: isProvenanceError,
  } = useQuery<ChargeProvenance | null>({
    queryKey: ['/api/criminal-charges', provenanceChargeId, 'sources'],
    queryFn: async () => {
      if (!provenanceChargeId) return null;
      const res = await fetch(`/api/criminal-charges/${encodeURIComponent(provenanceChargeId)}/sources`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch charge provenance');
      const payload = await res.json() as { success: boolean; provenance?: ChargeProvenance };
      return payload.success && payload.provenance ? payload.provenance : null;
    },
    enabled: isNewYork && Boolean(provenanceChargeId),
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!provenanceChargeId || isProvenanceLoading || isProvenanceFetching || isProvenanceError || provenance !== null) return;
    setUnavailableChargeIds((previous) => {
      const next = new Set(previous);
      next.add(provenanceChargeId);
      return next;
    });
    setSelectedCharges((previous) => previous.filter((charge) => charge.id !== provenanceChargeId));
  }, [isProvenanceError, isProvenanceFetching, isProvenanceLoading, provenance, provenanceChargeId]);

  useEffect(() => {
    if (isLoading) return;
    if (charges.length === 0) {
      setAnnouncement(
        debouncedSearch
          ? t('chat.chargeSelector.noResults', 'No charges found matching your search')
          : t('chat.chargeSelector.noCharges', 'No charges available')
      );
    } else if (debouncedSearch) {
      setAnnouncement(
        t('chat.chargeSelector.resultsAnnouncement', {
          count: charges.length,
          query: debouncedSearch,
          defaultValue: `${charges.length} charge${charges.length === 1 ? '' : 's'} found matching ${debouncedSearch}`,
        })
      );
    } else {
      setAnnouncement(
        t('chat.chargeSelector.resultsCount', {
          count: charges.length,
          defaultValue: `${charges.length} charge${charges.length === 1 ? '' : 's'} available`,
        })
      );
    }
  }, [charges, debouncedSearch, isLoading, t]);

  const toggleCharge = (charge: Charge) => {
    if (unavailableChargeIds.has(charge.id)) return;
    setSelectedCharges(prev => {
      const exists = prev.some(c => c.id === charge.id);
      if (exists) {
        return prev.filter(c => c.id !== charge.id);
      }
      return [...prev, { id: charge.id, name: charge.name }];
    });
  };

  const formatProvenanceDate = (value: string | null, emptyLabel: string) => {
    if (!value) return emptyLabel;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return emptyLabel;
    return new Intl.DateTimeFormat(i18n.language === "zh" ? "zh-CN" : i18n.language, {
      dateStyle: "medium",
      timeZone: "UTC",
    }).format(date);
  };

  const formatEffectiveDate = (source: ChargeProvenanceSource) => {
    const start = formatProvenanceDate(source.effectiveDateStart, t("chat.chargeSelector.provenance.unknownDate", "Unknown"));
    const end = source.effectiveDateEnd
      ? formatProvenanceDate(source.effectiveDateEnd, t("chat.chargeSelector.provenance.unknownDate", "Unknown"))
      : t("chat.chargeSelector.provenance.present", "Present");
    return `${start} – ${end}`;
  };

  const provenanceStatusMessage = (chargeId: string) => {
    if (unavailableChargeIds.has(chargeId)) {
      return t(
        "chat.chargeSelector.provenance.unavailable",
        "Current source unavailable. This charge cannot be selected until current authority is restored.",
      );
    }
    if (provenanceChargeId !== chargeId) return null;
    if (isProvenanceLoading || isProvenanceFetching) {
      return t("chat.chargeSelector.provenance.loading", "Loading current source details…");
    }
    if (isProvenanceError) {
      return t("chat.chargeSelector.provenance.error", "Current source details could not be loaded. Please try again.");
    }
    return null;
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
      className="bg-background border border-border rounded-xl overflow-hidden w-full max-w-full"
    >
      {/* Visually-hidden live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label={isExpanded
          ? t('chat.chargeSelector.collapseLabel', 'Collapse charge selector')
          : t('chat.chargeSelector.expandLabel', 'Expand charge selector')}
        className="w-full flex items-center justify-between p-3 border-b border-border hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
        data-testid="button-charge-selector-toggle"
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
          <span className="text-xs text-muted-foreground">{totalAvailable} {t('chat.chargeSelector.available', 'available')}</span>
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
                placeholder={t('chat.chargeSelector.searchPlaceholder', 'Search charges (e.g. fare evasion, DUI, theft...)')}
                className="pl-9"
                data-testid="input-charge-search"
                aria-label="Search charges by name, code, or description"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('chat.chargeSelector.filterByCategory', 'Filter by category')}>
              {CATEGORY_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  aria-pressed={selectedCategory === key}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    selectedCategory === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  data-testid={`category-${key.toLowerCase()}`}
                >
                  {getCategoryLabel(key)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="h-8 text-xs" data-testid="select-charge-group">
                  <SelectValue placeholder={t('chat.chargeSelector.allGroups', 'All crime types')} />
                </SelectTrigger>
                <SelectContent>
                  {CHARGE_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {t(`chat.chargeSelector.groups.${group}`, group)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-56 overflow-x-hidden">
            <div className="p-2 space-y-1 overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">{t('chat.chargeSelector.loading', 'Loading charges...')}</span>
                </div>
              ) : charges.length > 0 ? (
                charges.map((charge, index) => {
                  const isSelected = selectedCharges.some(c => c.id === charge.id);
                  const isUnavailable = unavailableChargeIds.has(charge.id);
                  const isProvenanceOpen = isNewYork && provenanceChargeId === charge.id;
                  const statusMessage = isNewYork ? provenanceStatusMessage(charge.id) : null;
                  return (
                    <motion.div
                      key={charge.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.01, 0.3) }}
                      className={cn(
                        "w-full rounded-lg text-sm transition-colors",
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted border border-transparent",
                        isUnavailable && "border-amber-300/70 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20"
                      )}
                    >
                      <motion.button
                        type="button"
                        onClick={() => toggleCharge(charge)}
                        disabled={isUnavailable}
                        aria-pressed={isSelected}
                        aria-label={isSelected
                          ? t('chat.chargeSelector.removeCharge', { name: charge.name, defaultValue: `Remove ${charge.name}` })
                          : isUnavailable
                            ? t("chat.chargeSelector.unavailableCharge", { name: charge.name, defaultValue: `${charge.name} is unavailable` })
                            : t('chat.chargeSelector.addCharge', { name: charge.name, defaultValue: `Add ${charge.name}` })
                        }
                        className="w-full flex items-start gap-3 px-3 pt-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg disabled:cursor-not-allowed disabled:opacity-75"
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
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex flex-wrap items-start gap-1">
                            <span className={cn("break-words", isSelected && "font-medium")}>{charge.name}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs flex-shrink-0",
                                charge.category === 'felony' && "border-red-500/50 text-red-600",
                                charge.category === 'misdemeanor' && "border-yellow-500/50 text-yellow-600",
                                charge.category === 'infraction' && "border-green-500/50 text-green-600"
                              )}
                            >
                              {getCategoryLabel(charge.category)}
                            </Badge>
                          </div>
                          {charge.citation && (
                            <p className="text-xs font-mono text-primary/80 mt-0.5 break-words" data-testid={`charge-citation-${charge.id}`}>
                              {charge.citation}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5 break-words">{charge.description}</p>
                        </div>
                      </motion.button>
                      {isNewYork && (
                        <div className="ml-11 flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pb-2.5">
                          <button
                            type="button"
                            onClick={() => setProvenanceChargeId((current) => current === charge.id ? null : charge.id)}
                            aria-expanded={isProvenanceOpen}
                            aria-controls={`charge-provenance-${charge.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm"
                            data-testid={`button-charge-provenance-${charge.id}`}
                          >
                            <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {isProvenanceOpen
                              ? t("chat.chargeSelector.provenance.hide", "Hide current source details")
                              : t("chat.chargeSelector.provenance.show", "View current source details")}
                          </button>
                          {isUnavailable && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                              <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                              {t("chat.chargeSelector.provenance.unavailableShort", "Unavailable")}
                            </span>
                          )}
                        </div>
                      )}
                      {isProvenanceOpen && (
                        <div
                          id={`charge-provenance-${charge.id}`}
                          className="mx-3 mb-3 ml-11 rounded-lg border border-indigo-200/80 bg-indigo-50/50 p-3 text-xs dark:border-indigo-900 dark:bg-indigo-950/20"
                          data-testid={`charge-provenance-${charge.id}`}
                        >
                          {statusMessage ? (
                            <p className={cn(
                              "flex items-start gap-2 leading-5",
                              isUnavailable || isProvenanceError ? "text-amber-800 dark:text-amber-200" : "text-muted-foreground",
                            )}>
                              {(isUnavailable || isProvenanceError) && <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                              <span>{statusMessage}</span>
                            </p>
                          ) : provenance?.chargeId === charge.id ? (
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.officialTitle", "Official title")}</p>
                                <p className="mt-0.5 leading-5 text-foreground">{provenance.officialTitle}</p>
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                  <p className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.citation", "Official citation")}</p>
                                  <p className="mt-0.5 font-mono leading-5 text-foreground">{provenance.citation}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.currentness", "Currentness")}</p>
                                  <p className="mt-0.5 leading-5 text-foreground">
                                    {provenance.sources.map((source) => formatEffectiveDate(source)).join(" · ")}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3 border-t border-indigo-200/70 pt-3 dark:border-indigo-900/70">
                                {provenance.sources.map((source, sourceIndex) => (
                                  <div key={`${source.citation}-${sourceIndex}`} className="space-y-2">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="font-semibold text-foreground">
                                        {source.supportRole}
                                        {source.subdivision ? ` · ${source.subdivision}` : ""}
                                      </p>
                                      <Badge variant="outline" className="text-[11px]">
                                        {source.status === "current"
                                          ? t("chat.chargeSelector.provenance.current", "Current")
                                          : source.status}
                                      </Badge>
                                    </div>
                                    <a
                                      href={source.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex max-w-full items-center gap-1 break-all font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                                      data-testid={`link-charge-provenance-source-${charge.id}-${sourceIndex}`}
                                    >
                                      {t("chat.chargeSelector.provenance.openSource", "Open official source")}
                                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                      <span className="sr-only">{t("chat.chargeSelector.provenance.opensNewTab", "opens in a new tab")}</span>
                                    </a>
                                    <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                                      <div>
                                        <dt className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.retrieved", "Retrieved")}</dt>
                                        <dd className="text-muted-foreground">{formatProvenanceDate(source.retrievedAt, t("chat.chargeSelector.provenance.notAvailable", "Not available"))}</dd>
                                      </div>
                                      <div>
                                        <dt className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.imported", "Manifest imported")}</dt>
                                        <dd className="text-muted-foreground">{formatProvenanceDate(source.manifestImportedAt, t("chat.chargeSelector.provenance.notAvailable", "Not available"))}</dd>
                                      </div>
                                      <div>
                                        <dt className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.content", "Source content")}</dt>
                                        <dd className="text-muted-foreground">
                                          {source.contentAvailable
                                            ? t("chat.chargeSelector.provenance.contentAvailable", "Available")
                                            : t("chat.chargeSelector.provenance.contentUnavailable", "Not available")}
                                        </dd>
                                      </div>
                                      <div>
                                        <dt className="font-semibold text-foreground">{t("chat.chargeSelector.provenance.hash", "Content hash")}</dt>
                                        <dd className="break-all font-mono text-muted-foreground">{source.contentHash} ({source.hashBasis})</dd>
                                      </div>
                                    </dl>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                      {charge.instructionRef && (
                        <div className="ml-11 px-3 pb-2.5">
                          <JuryInstructionBadge
                            instructionRef={charge.instructionRef}
                            instructionUrl={charge.instructionUrl}
                            instructionPaywall={getInstructionPaywall(charge as any)}
                            chargeId={charge.id}
                            dataTestIdPrefix="link-instruction-selector"
                            onLinkClick={(e) => e.stopPropagation()}
                            label={t('legalGuidance.qaFlow.caseDetails.juryInstruction')}
                            tooltipText={t('legalGuidance.qaFlow.caseDetails.juryInstructionTooltip')}
                            tooltipAriaLabel={t('legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel')}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </motion.div>
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
                : t('chat.chargeSelector.continue', { count: selectedCharges.length, defaultValue: `Continue with ${selectedCharges.length} charge(s)` })
              }
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
}
