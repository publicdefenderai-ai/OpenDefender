import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { legalDataApi } from "@/lib/legal-data";

export function useLegalResources(jurisdiction?: string, category?: string) {
  return useQuery({
    queryKey: ['/api/legal-resources', jurisdiction, category],
    queryFn: () => legalDataApi.getLegalResources(jurisdiction, category),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCourtData(jurisdiction: string) {
  return useQuery({
    queryKey: ['/api/court-data', jurisdiction],
    queryFn: () => legalDataApi.getCourtData(jurisdiction),
    enabled: !!jurisdiction,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCaseLawSearch() {
  return useMutation({
    mutationFn: ({ query, jurisdiction }: { query: string; jurisdiction?: string }) =>
      legalDataApi.searchCaseLaw(query, jurisdiction),
  });
}

export function useStatutes(jurisdiction: string) {
  return useQuery({
    queryKey: ['/api/statutes', jurisdiction],
    queryFn: () => legalDataApi.getStatutes(jurisdiction),
    enabled: !!jurisdiction,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useSentencingGuidelines(jurisdiction: string) {
  return useQuery({
    queryKey: ['/api/sentencing-guidelines', jurisdiction],
    queryFn: () => legalDataApi.getSentencingGuidelines(jurisdiction),
    enabled: !!jurisdiction,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useAIAvailability() {
  return useQuery({
    queryKey: ['/api/ai/status'],
    queryFn: async () => {
      const res = await fetch('/api/ai/status');
      if (!res.ok) return { available: true, reason: undefined };
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLegalGuidance() {
  const queryClient = useQueryClient();

  const generateGuidance = useMutation({
    mutationFn: legalDataApi.generateLegalGuidance,
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/legal-guidance', data.sessionId], data);
    },
  });

  const getGuidance = (sessionId: string) => useQuery({
    queryKey: ['/api/legal-guidance', sessionId],
    queryFn: () => legalDataApi.getLegalGuidance(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const deleteGuidance = useMutation({
    mutationFn: legalDataApi.deleteLegalGuidance,
    onSuccess: (_, sessionId) => {
      queryClient.removeQueries({ queryKey: ['/api/legal-guidance', sessionId] });
    },
  });

  return {
    generateGuidance,
    getGuidance,
    deleteGuidance,
  };
}
