
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";
import { useReactReady } from "@/hooks/useSafeHooks";

export const useSafeServicios = () => {
  const isReactReady = useReactReady();
  
  return useQuery({
    queryKey: ['servicios'],
    queryFn: serviciosApi.getAll,
    enabled: isReactReady
  });
};

export const useSafeUpdateServicio = () => {
  const isReactReady = useReactReady();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviciosApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    },
    mutationKey: ['update-servicio'],
    // Las mutaciones no tienen enabled, pero podemos controlar su uso desde el componente
  });
};

export const useSafeDeleteServicio = () => {
  const isReactReady = useReactReady();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviciosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    },
    mutationKey: ['delete-servicio'],
  });
};

export const useSafeEstadisticasServicios = () => {
  const isReactReady = useReactReady();
  
  return useQuery({
    queryKey: ['estadisticas-servicios'],
    queryFn: serviciosApi.getEstadisticas,
    enabled: isReactReady
  });
};
