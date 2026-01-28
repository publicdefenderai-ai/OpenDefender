import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Phone,
  Building2,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  detentionFacilities,
  getStatesWithFacilities,
  searchFacilities,
  searchFacilitiesByState,
  getFacilityTypeName,
  type DetentionFacility
} from '../../../../shared/data/detention-facilities';

export function FacilitySearch() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [expandedFacility, setExpandedFacility] = useState<string | null>(null);

  const states = useMemo(() => getStatesWithFacilities(), []);

  const filteredFacilities = useMemo(() => {
    let results: DetentionFacility[] = [];

    if (searchQuery.trim()) {
      results = searchFacilities(searchQuery);
    } else if (selectedState) {
      results = searchFacilitiesByState(selectedState);
    } else {
      results = detentionFacilities;
    }

    return results;
  }, [searchQuery, selectedState]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SPC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'CDF': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'IGSA': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'FRC': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          {lang === 'es' ? 'Buscar Centros de Detención' : 'Search Detention Facilities'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedState('');
            }}
            placeholder={lang === 'es' ? 'Buscar por nombre, ciudad o estado...' : 'Search by name, city, or state...'}
            className="pl-10"
          />
        </div>

        {/* State filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedState('');
              setSearchQuery('');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedState && !searchQuery
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {lang === 'es' ? 'Todos' : 'All'}
          </button>
          {states.map(state => (
            <button
              key={state}
              onClick={() => {
                setSelectedState(state);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedState === state
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {lang === 'es'
            ? `Mostrando ${filteredFacilities.length} centros`
            : `Showing ${filteredFacilities.length} facilities`}
        </p>

        {/* Facilities list */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredFacilities.map(facility => (
            <div
              key={facility.id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedFacility(
                  expandedFacility === facility.id ? null : facility.id
                )}
                className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{facility.name}</h3>
                      <Badge className={`text-xs ${getTypeColor(facility.type)}`}>
                        {getFacilityTypeName(facility.type, lang)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {facility.city}, {facility.state}
                    </p>
                  </div>
                  {expandedFacility === facility.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </div>
              </button>

              {expandedFacility === facility.id && (
                <div className="px-4 pb-4 space-y-3 border-t bg-muted/30">
                  <div className="pt-3 grid gap-3">
                    {/* Address */}
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {lang === 'es' ? 'Dirección' : 'Address'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {facility.address}<br />
                          {facility.city}, {facility.state} {facility.zipCode}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {lang === 'es' ? 'Teléfono' : 'Phone'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {facility.phone}
                        </p>
                        {facility.detaineePhone && (
                          <p className="text-sm text-muted-foreground">
                            {lang === 'es' ? 'Línea de detenidos:' : 'Detainee line:'} {facility.detaineePhone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {lang === 'es' ? 'Capacidad Aproximada' : 'Approximate Capacity'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ~{facility.averageCapacity.toLocaleString()} {lang === 'es' ? 'personas' : 'persons'}
                        </p>
                      </div>
                    </div>

                    {/* Visitation Info */}
                    {facility.visitationInfo && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                          {lang === 'es' ? 'Información de Visitas' : 'Visitation Info'}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          {facility.visitationInfo[lang]}
                        </p>
                      </div>
                    )}

                    {/* Field Office */}
                    <p className="text-xs text-muted-foreground">
                      {lang === 'es' ? 'Oficina de campo ICE:' : 'ICE Field Office:'} {facility.fieldOffice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ICE Locator link */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            {lang === 'es'
              ? 'Para buscar a una persona específica en custodia de ICE:'
              : 'To search for a specific person in ICE custody:'}
          </p>
          <a
            href="https://locator.ice.gov/odls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {lang === 'es' ? 'Localizador de Detenidos de ICE' : 'ICE Online Detainee Locator'}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
