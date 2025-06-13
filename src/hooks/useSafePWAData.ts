
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
import { useConnectivity } from '@/hooks/useConnectivity';
import { getFallbackData } from '@/data/pwaFallbackData';
import { useQueryContextReady } from '@/hooks/useQueryContextReady';

export function useSafePWAData() {
  const { isReady: contextReady } = useQueryContextReady();
  const { isFullyConnected } = useConnectivity();
  
  // Only call hooks if context is ready
  const gruasQuery = contextReady ? useGruas() : { data: [], isLoading: false, error: null };
  const operadoresQuery = contextReady ? useOperadores() : { data: [], isLoading: false, error: null };
  const tiposServicioQuery = contextReady ? useTiposServicio() : { data: [], isLoading: false, error: null };

  // Determine if we're loading
  const isLoading = contextReady && (
    gruasQuery.isLoading || 
    operadoresQuery.isLoading || 
    tiposServicioQuery.isLoading
  );

  // Get fallback data if needed
  const fallbackData = getFallbackData();

  // Use real data if available and connected, otherwise use fallback
  const gruas = (isFullyConnected && gruasQuery.data?.length) 
    ? gruasQuery.data 
    : fallbackData.gruas;
    
  const operadores = (isFullyConnected && operadoresQuery.data?.length)
    ? operadoresQuery.data 
    : fallbackData.operadores;
    
  const tiposServicio = (isFullyConnected && tiposServicioQuery.data?.length)
    ? tiposServicioQuery.data 
    : fallbackData.tiposServicio;

  return {
    gruas,
    operadores,
    tiposServicio,
    isLoading: !contextReady || isLoading,
    isUsingFallbackData: !isFullyConnected || !gruasQuery.data?.length,
    contextReady,
    isFullyConnected
  };
}
