
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
      console.log('useCreateServicio: Iniciando creación de servicio con datos:', servicio);
      
      try {
        // Validar datos básicos
        console.log('useCreateServicio: Validando datos básicos...');
        validateServicioData(servicio);

        // Validar entidades relacionadas
        console.log('useCreateServicio: Validando entidades relacionadas...');
        await validateRelatedEntities(supabase, servicio);

        // Generar folio automáticamente si no se proporciona uno manual
        let folio = servicio.folio;
        if (!folio || folio.trim() === '') {
          console.log('useCreateServicio: Generando folio automático...');
          folio = await serviciosApi.generateFolio();
          console.log('useCreateServicio: Folio generado:', folio);
        } else {
          // Validar que el folio manual no exista ya
          console.log('useCreateServicio: Validando folio manual:', folio);
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
        console.log('useCreateServicio: Creando servicio con folio:', folio);
        const result = await serviciosApi.create(servicio, folio);
        console.log('useCreateServicio: Servicio creado exitosamente:', result);
        return result;
      } catch (error) {
        console.error('useCreateServicio: Error en la creación:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('useCreateServicio: Creación exitosa, invalidando queries...');
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    },
    onError: (error) => {
      console.error('useCreateServicio: Error en la mutación:', error);
    }
  });
};
