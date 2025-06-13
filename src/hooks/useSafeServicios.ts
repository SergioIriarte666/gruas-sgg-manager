
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";
import { useSafeHook } from "@/hooks/useSafeHooks";

export const useSafeServicios = () => {
  return useSafeHook(
    () => useQuery({
      queryKey: ['servicios'],
      queryFn: serviciosApi.getAll
    }),
    { data: [], isLoading: true, error: null }
  );
};

export const useSafeUpdateServicio = () => {
  return useSafeHook(
    () => {
      const queryClient = useQueryClient();
      
      return useMutation({
        mutationFn: serviciosApi.update,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['servicios'] });
          queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
        }
      });
    },
    { mutate: () => {}, isPending: false }
  );
};

export const useSafeDeleteServicio = () => {
  return useSafeHook(
    () => {
      const queryClient = useQueryClient();
      
      return useMutation({
        mutationFn: serviciosApi.delete,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['servicios'] });
          queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
        }
      });
    },
    { mutate: () => {}, isPending: false }
  );
};

export const useSafeEstadisticasServicios = () => {
  return useSafeHook(
    () => useQuery({
      queryKey: ['estadisticas-servicios'],
      queryFn: serviciosApi.getEstadisticas
    }),
    { data: null, isLoading: true, error: null }
  );
};
