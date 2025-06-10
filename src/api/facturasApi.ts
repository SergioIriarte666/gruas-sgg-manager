
import { supabase } from "@/integrations/supabase/client";

export const facturasApi = {
  // Crear factura desde cierre
  createFromCierre: async (cierreId: string) => {
    console.log('Creando factura desde cierre:', cierreId);

    // Obtener datos del cierre
    const { data: cierre, error: cierreError } = await supabase
      .from('cierres')
      .select('*')
      .eq('id', cierreId)
      .single();

    if (cierreError) {
      console.error('Error al obtener cierre:', cierreError);
      throw cierreError;
    }

    if (cierre.facturado) {
      throw new Error('Este cierre ya ha sido facturado');
    }

    // Generar folio automático para factura
    const { data: folio, error: folioError } = await supabase.rpc('generate_folio', {
      prefix: 'F'
    });

    if (folioError) {
      console.error('Error al generar folio de factura:', folioError);
      throw folioError;
    }

    // Calcular subtotal e IVA
    const subtotal = Number(cierre.total);
    const iva = subtotal * 0.19; // IVA 19%
    const total = subtotal + iva;

    // Crear fecha de vencimiento (30 días desde hoy)
    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);

    // Crear factura
    const { data: factura, error: facturaError } = await supabase
      .from('facturas')
      .insert({
        folio,
        fecha: new Date().toISOString().split('T')[0],
        fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
        cierre_id: cierreId,
        subtotal,
        iva,
        total,
        estado: 'pendiente'
      })
      .select()
      .single();

    if (facturaError) {
      console.error('Error al crear factura:', facturaError);
      throw facturaError;
    }

    console.log('Factura creada exitosamente:', factura);
    return factura;
  },

  // Generar folio automático para factura
  generateFolio: async (): Promise<string> => {
    console.log('Generando folio automático para factura...');
    
    const { data, error } = await supabase.rpc('generate_folio', {
      prefix: 'F'
    });

    if (error) {
      console.error('Error al generar folio de factura:', error);
      throw error;
    }

    console.log('Folio de factura generado:', data);
    return data;
  }
};
