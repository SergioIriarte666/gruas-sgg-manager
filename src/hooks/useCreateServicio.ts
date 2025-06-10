
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { validateServicioData, validateRelatedEntities } from "@/utils/servicioValidation";
import { serviciosApi } from "@/api/serviciosApi";

export const useCreateServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servicio: {
      fecha: Date;
      folio?: string;
      clienteId: string;
      ordenCompra?: string;
      marcaVehiculo: string;
      modeloVehiculo: string;
      patente: string;
      ubicacionOrigen: string;
      ubicacionDestino: string;
      valor: number;
      gruaId: string;
      operadorId: string;
      tipoServicioId: string;
      estado: 'en_curso' | 'cerrado' | 'facturado';
      observaciones?: string;
    }) => {
      console.log('Iniciando creación de servicio con datos:', servicio);
      
      // Validar datos básicos
      validateServicioData(servicio);

      // Validar entidades relacionadas
      await validateRelatedEntities(supabase, servicio);

      // Generar folio automáticamente si no se proporciona uno manual
      let folio = servicio.folio;
      if (!folio || folio.trim() === '') {
        folio = await serviciosApi.generateFolio();
      } else {
        // Validar que el folio manual no exista ya
        const { data: existingService } = await supabase
          .from('servicios')
          .select('id')
          .eq('folio', folio.trim())
          .single();
        
        if (existingService) {
          throw new Error(`Ya existe un servicio con el folio ${folio}`);
        }
      }

      // Crear el servicio
      return await serviciosApi.create(servicio, folio);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    },
    onError: (error) => {
      console.error('Error en la mutación de crear servicio:', error);
    }
  });
};
