
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facturasApi } from "@/api/facturasApi";
import { cierresApi } from "@/api/cierresApi";
import { useToast } from "@/hooks/use-toast";

export const useCreateFactura = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cierreId: string) => {
      try {
        console.log('Iniciando creación de factura para cierre:', cierreId);
        
        // Crear factura desde cierre
        const factura = await facturasApi.createFromCierre(cierreId);
        console.log('Factura creada:', factura);
        
        // Marcar cierre como facturado
        await cierresApi.markAsFacturado(cierreId, factura.id);
        console.log('Cierre marcado como facturado');
        
        return factura;
      } catch (error) {
        console.error('Error en mutationFn de createFactura:', error);
        // Re-lanzar el error para que sea manejado por onError
        throw error;
      }
    },
    onSuccess: (factura) => {
      console.log('Factura creada exitosamente:', factura);
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.invalidateQueries({ queryKey: ['cierres'] });
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast({
        title: "Factura creada",
        description: `La factura ${factura.folio} se ha creado exitosamente desde el cierre.`,
      });
    },
    onError: (error: any) => {
      console.error('Error al crear factura:', error);
      const errorMessage = error?.message || "No se pudo crear la factura. Por favor, intenta nuevamente.";
      toast({
        title: "Error al crear factura",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
