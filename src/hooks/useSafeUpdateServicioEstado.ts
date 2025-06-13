
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";
import { useSafeHook } from "@/hooks/useSafeHooks";

export const useSafeUpdateServicioEstado = () => {
  return useSafeHook(
    () => {
      const queryClient = useQueryClient();
      
      return useMutation({
        mutationFn: ({ id, estado }: { id: string; estado: 'en_curso' | 'cerrado' | 'facturado' }) => {
          return serviciosApi.update({
            id,
            fecha: new Date(),
            clienteId: '',
            marcaVehiculo: '',
            modeloVehiculo: '',
            patente: '',
            ubicacionOrigen: '',
            ubicacionDestino: '',
            valor: 0,
            gruaId: '',
            operadorId: '',
            tipoServicioId: '',
            estado
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['servicios'] });
          queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
        }
      });
    },
    { 
      mutate: () => {},
      mutateAsync: async () => undefined as any,
      isPending: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      status: 'idle' as const,
      data: undefined,
      error: null,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      reset: () => {},
      submittedAt: 0
    }
  );
};
