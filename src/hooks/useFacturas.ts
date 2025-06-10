
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
        console.log('Obteniendo facturas...');
        const data = await facturasApi.getAll();

        if (!data || data.length === 0) {
          console.log('No hay facturas disponibles');
          return [];
        }

        // Transform data to match expected format with safe data handling
        const facturas = data.map((factura: any) => {
          console.log('Procesando factura:', factura);
          
          // Helper function to safely parse dates
          const safeParseDate = (dateValue: any) => {
            if (!dateValue) return null;
            try {
              const parsed = new Date(dateValue);
              return isNaN(parsed.getTime()) ? null : parsed;
            } catch {
              return null;
            }
          };

          const fechaFactura = safeParseDate(factura.fecha);
          const fechaVencimiento = safeParseDate(factura.fecha_vencimiento);
          const fechaPago = factura.fecha_pago ? safeParseDate(factura.fecha_pago) : null;

          // Calculate days until expiration safely
          let diasVencimiento = 0;
          if (fechaVencimiento) {
            diasVencimiento = Math.ceil((fechaVencimiento.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          }

          // Determine estado based on dates
          let estado = factura.estado || 'pendiente';
          if (estado === 'pendiente' && diasVencimiento < 0) {
            estado = 'vencida';
          }

          // Get client name safely with better error handling
          let clienteNombre = 'Cliente no encontrado';
          try {
            if (factura.cierres?.clientes?.razon_social) {
              clienteNombre = factura.cierres.clientes.razon_social;
            } else if (factura.cierres && factura.cierres.clientes && factura.cierres.clientes.razon_social) {
              clienteNombre = factura.cierres.clientes.razon_social;
            }
          } catch (err) {
            console.warn('Error al obtener nombre del cliente para factura:', factura.id, err);
          }

          return {
            id: factura.id,
            folio: factura.folio || 'Sin folio',
            fecha: fechaFactura ? fechaFactura.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            fechaVencimiento: fechaVencimiento ? fechaVencimiento.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            cliente: clienteNombre,
            subtotal: Number(factura.subtotal) || 0,
            iva: Number(factura.iva) || 0,
            total: Number(factura.total) || 0,
            estado: estado as 'pendiente' | 'pagada' | 'vencida',
            fechaPago: fechaPago ? fechaPago.toISOString().split('T')[0] : undefined,
            diasVencimiento
          };
        });

        console.log('Facturas procesadas:', facturas);
        return facturas;
      } catch (error) {
        console.error("Error fetching facturas:", error);
        throw new Error(`Error al obtener facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
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
