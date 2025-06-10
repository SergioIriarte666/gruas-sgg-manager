
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";

export const useServicios = () => {
  return useQuery({
    queryKey: ['servicios'],
    queryFn: serviciosApi.getAll
  });
};

export const useUpdateServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviciosApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    }
  });
};

export const useDeleteServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviciosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    }
  });
};

export const useEstadisticasServicios = () => {
  return useQuery({
    queryKey: ['estadisticas-servicios'],
    queryFn: serviciosApi.getEstadisticas
  });
};

// Re-export for backward compatibility
export { useCreateServicio } from './useCreateServicio';
