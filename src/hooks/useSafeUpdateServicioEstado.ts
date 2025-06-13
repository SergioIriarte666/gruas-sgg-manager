
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";
import { useReactReady } from "@/hooks/useSafeHooks";

export const useSafeUpdateServicioEstado = () => {
  const isReactReady = useReactReady();
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
    },
    mutationKey: ['update-servicio-estado'],
  });
};
