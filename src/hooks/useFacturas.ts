
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  cierre: {
    cliente: {
      razonSocial: string;
    };
  };
}

export const useFacturas = () => {
  return useQuery({
    queryKey: ["facturas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facturas")
        .select(`
          id,
          folio,
          fecha,
          fecha_vencimiento,
          subtotal,
          iva,
          total,
          estado,
          fecha_pago,
          cierre_id,
          cierres!inner(
            cliente_id,
            clientes!inner(
              razon_social
            )
          )
        `)
        .order("fecha", { ascending: false });

      if (error) {
        console.error("Error fetching facturas:", error);
        throw error;
      }

      // Transform data to match expected format with safe date handling
      return data.map((factura: any) => {
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

        return {
          id: factura.id,
          folio: factura.folio,
          fecha: fechaFactura || new Date(),
          fechaVencimiento: fechaVencimiento || new Date(),
          cliente: factura.cierres.clientes.razon_social,
          subtotal: Number(factura.subtotal),
          iva: Number(factura.iva),
          total: Number(factura.total),
          estado: factura.estado as 'pendiente' | 'pagada' | 'vencida',
          fechaPago: fechaPago,
          diasVencimiento
        };
      });
    },
  });
};

export const useUpdateFacturaEstado = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ facturaId, fechaPago }: { facturaId: string; fechaPago: string }) => {
      const { data, error } = await supabase
        .from("facturas")
        .update({
          estado: "pagada",
          fecha_pago: fechaPago,
        })
        .eq("id", facturaId)
        .select()
        .single();

      if (error) throw error;
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
