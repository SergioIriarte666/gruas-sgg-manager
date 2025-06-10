
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

        // Transform data to match expected format with safe date handling
        const facturas = data.map((factura: any) => {
          console.log('Procesando factura:', factura);
          
          // Helper function to safely parse dates
          const safeParseDate = (dateValue: any) => {
            if (!dateValue) return null;
            const parsed = new Date(dateValue);
            return isNaN(parsed.getTime()) ? null : parsed;
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
          let estado = factura.estado;
          if (estado === 'pendiente' && diasVencimiento < 0) {
            estado = 'vencida';
          }

          // Get client name safely
          let clienteNombre = 'Cliente no encontrado';
          if (factura.cierres?.clientes?.razon_social) {
            clienteNombre = factura.cierres.clientes.razon_social;
          } else if (factura.cierres && Array.isArray(factura.cierres) && factura.cierres[0]?.clientes?.razon_social) {
            clienteNombre = factura.cierres[0].clientes.razon_social;
          }

          return {
            id: factura.id,
            folio: factura.folio,
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
        throw error;
      }
    },
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
        throw error;
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
    onError: (error) => {
      console.error("Error updating factura:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la factura. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });
};
