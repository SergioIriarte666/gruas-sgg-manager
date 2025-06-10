import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facturasApi } from "@/api/facturasApi";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FacturaWithDetails {
  id: string;
  folio: string;
  fecha: string;
  fechaVencimiento: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  fechaPago?: string;
  cliente: string;
  diasVencimiento: number;
}

export const useFacturas = () => {
  return useQuery({
    queryKey: ["facturas"],
    queryFn: async () => {
      try {
        console.log('useFacturas: Obteniendo facturas...');
        const data = await facturasApi.getAll();

        if (!data || data.length === 0) {
          console.log('useFacturas: No hay facturas disponibles');
          return [];
        }

        // Transform data to match expected format
        const facturas = data.map((factura: any) => {
          console.log('useFacturas: Procesando factura:', factura);
          
          // Safe date parsing
          const fechaFactura = factura.fecha ? new Date(factura.fecha) : new Date();
          const fechaVencimiento = factura.fecha_vencimiento ? new Date(factura.fecha_vencimiento) : new Date();
          const fechaPago = factura.fecha_pago ? new Date(factura.fecha_pago) : null;

          // Calculate days until expiration
          const diasVencimiento = Math.ceil((fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

          // Determine estado
          let estado = factura.estado || 'pendiente';
          if (estado === 'pendiente' && diasVencimiento < 0) {
            estado = 'vencida';
          }

          // Get client name safely - handle cases where there's no client
          let clienteNombre = 'Sin cliente asignado';
          try {
            // Check if we have cierres data and client information
            if (factura.cierres && factura.cierres.clientes && factura.cierres.clientes.razon_social) {
              clienteNombre = factura.cierres.clientes.razon_social;
            } else if (factura.cierres && factura.cierres.cliente_id) {
              // If there's a cliente_id but no client data loaded, show a loading message
              clienteNombre = 'Cliente no disponible';
            }
            // If no cierres or cliente_id is null, keep default "Sin cliente asignado"
          } catch (err) {
            console.warn('useFacturas: Error al obtener nombre del cliente:', err);
            clienteNombre = 'Error al cargar cliente';
          }

          const transformedFactura = {
            id: factura.id,
            folio: factura.folio || 'Sin folio',
            fecha: fechaFactura.toISOString().split('T')[0],
            fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
            cliente: clienteNombre,
            subtotal: Number(factura.subtotal) || 0,
            iva: Number(factura.iva) || 0,
            total: Number(factura.total) || 0,
            estado: estado as 'pendiente' | 'pagada' | 'vencida',
            fechaPago: fechaPago ? fechaPago.toISOString().split('T')[0] : undefined,
            diasVencimiento
          };

          console.log('useFacturas: Factura transformada:', transformedFactura);
          return transformedFactura;
        });

        console.log('useFacturas: Facturas procesadas exitosamente:', facturas);
        return facturas;
      } catch (error) {
        console.error("useFacturas: Error fetching facturas:", error);
        throw new Error(`Error al obtener facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateFacturaEstado = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ facturaId, fechaPago }: { facturaId: string; fechaPago: string }) => {
      console.log('Actualizando estado de factura:', { facturaId, fechaPago });
      
      const { data, error } = await supabase
        .from("facturas")
        .update({
          estado: "pagada",
          fecha_pago: fechaPago,
        })
        .eq("id", facturaId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar factura:', error);
        throw new Error(`Error al actualizar factura: ${error.message}`);
      }
      
      console.log('Factura actualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      toast({
        title: "Factura actualizada",
        description: "La factura ha sido marcada como pagada exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error("Error updating factura:", error);
      const errorMessage = error?.message || "No se pudo actualizar la factura. Intenta nuevamente.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
