
import { supabase } from "@/integrations/supabase/client";

export const facturasApi = {
  // Obtener todas las facturas
  getAll: async () => {
    console.log('Obteniendo todas las facturas...');
    
    try {
      const { data, error } = await supabase
        .from('facturas')
        .select(`
          *,
          cierres(
            id,
            cliente_id,
            clientes(
              razon_social,
              rut,
              telefono,
              email
            )
          )
        `)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error al obtener facturas:', error);
        throw new Error(`Error al obtener facturas: ${error.message}`);
      }

      console.log('Facturas obtenidas:', data);
      return data || [];
    } catch (error) {
      console.error('Error en getAll facturas:', error);
      throw error;
    }
  },

  // Crear factura desde cierre
  createFromCierre: async (cierreId: string) => {
    console.log('Creando factura desde cierre:', cierreId);

    try {
      // Obtener datos del cierre
      const { data: cierre, error: cierreError } = await supabase
        .from('cierres')
        .select(`
          *,
          clientes(
            razon_social,
            rut,
            email,
            telefono,
            direccion
          )
        `)
        .eq('id', cierreId)
        .single();

      if (cierreError) {
        console.error('Error al obtener cierre:', cierreError);
        throw new Error(`No se pudo obtener el cierre: ${cierreError.message}`);
      }

      if (!cierre) {
        throw new Error('Cierre no encontrado');
      }

      if (cierre.facturado) {
        throw new Error('Este cierre ya ha sido facturado');
      }

      console.log('Cierre obtenido:', cierre);

      // Generar folio automático para factura
      let folio;
      try {
        const { data: folioData, error: folioError } = await supabase.rpc('generate_folio', {
          prefix: 'F'
        });

        if (folioError) {
          console.error('Error al generar folio de factura:', folioError);
          // Usar fallback
          folio = `F${String(Date.now()).slice(-6)}`;
        } else {
          folio = folioData;
        }
        
        console.log('Folio de factura generado:', folio);
      } catch (folioErr) {
        console.error('Error en generación de folio:', folioErr);
        // Fallback: generar folio manual temporal
        folio = `F${String(Date.now()).slice(-6)}`;
        console.log('Usando folio temporal:', folio);
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
        throw new Error(`No se pudo crear la factura: ${facturaError.message}`);
      }

      console.log('Factura creada exitosamente:', factura);
      return factura;
    } catch (error) {
      console.error('Error en createFromCierre:', error);
      throw error;
    }
  },

  // Generar folio automático para factura
  generateFolio: async (): Promise<string> => {
    console.log('Generando folio automático para factura...');
    
    try {
      const { data, error } = await supabase.rpc('generate_folio', {
        prefix: 'F'
      });

      if (error) {
        console.error('Error al generar folio de factura:', error);
        throw new Error(`Error al generar folio: ${error.message}`);
      }

      console.log('Folio de factura generado:', data);
      return data;
    } catch (error) {
      console.error('Error en generateFolio:', error);
      // Fallback: generar folio temporal
      return `F${String(Date.now()).slice(-6)}`;
    }
  }
};
