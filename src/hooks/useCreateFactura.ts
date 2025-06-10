
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facturasApi } from "@/api/facturasApi";
import { cierresApi } from "@/api/cierresApi";
import { useToast } from "@/hooks/use-toast";

export const useCreateFactura = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cierreId: string) => {
      // Crear factura desde cierre
      const factura = await facturasApi.createFromCierre(cierreId);
      
      // Marcar cierre como facturado
      await cierresApi.markAsFacturado(cierreId, factura.id);
      
      return factura;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      queryClient.invalidateQueries({ queryKey: ['cierres'] });
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      toast({
        title: "Factura creada",
        description: "La factura se ha creado exitosamente desde el cierre.",
      });
    },
    onError: (error) => {
      console.error('Error al crear factura:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear la factura.",
        variant: "destructive",
      });
    },
  });
};
