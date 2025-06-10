
import { supabase } from "@/integrations/supabase/client";

export const cierresApi = {
  // Obtener todos los cierres
  getAll: async () => {
    console.log('Obteniendo todos los cierres...');
    
    const { data, error } = await supabase
      .from('cierres')
      .select(`
        *,
        clientes(
          razon_social,
          rut,
          telefono,
          email,
          direccion
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener cierres:', error);
      throw error;
    }

    console.log('Cierres obtenidos:', data);
    return data || [];
  },

  // Obtener cierre por ID
  getById: async (id: string) => {
    console.log('Obteniendo cierre por ID:', id);
    
    const { data, error } = await supabase
      .from('cierres')
      .select(`
        *,
        clientes(
          razon_social,
          rut,
          telefono,
          email,
          direccion
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener cierre:', error);
      throw error;
    }

    return data;
  },

  // Obtener servicios elegibles para cierre
  getServiciosElegibles: async (fechaInicio: string, fechaFin: string, clienteId?: string) => {
    console.log('Obteniendo servicios elegibles:', { fechaInicio, fechaFin, clienteId });
    
    let query = supabase
      .from('servicios')
      .select(`
        *,
        clientes(razon_social, rut),
        gruas(patente, marca, modelo),
        operadores(nombre_completo),
        tipos_servicio(nombre)
      `)
      .eq('estado', 'cerrado')
      .is('cierre_id', null)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin);

    if (clienteId) {
      query = query.eq('cliente_id', clienteId);
    }

    const { data, error } = await query.order('fecha', { ascending: false });

    if (error) {
      console.error('Error al obtener servicios elegibles:', error);
      throw error;
    }

    console.log('Servicios elegibles obtenidos:', data);
    return data || [];
  },

  // Crear cierre
  create: async (cierreData: {
    fechaInicio: string;
    fechaFin: string;
    clienteId?: string;
    servicioIds: string[];
    total: number;
  }) => {
    console.log('Creando cierre con datos:', cierreData);

    try {
      // Generar folio automático
      const { data: folio, error: folioError } = await supabase.rpc('generate_folio', {
        prefix: 'C'
      });

      if (folioError) {
        console.error('Error al generar folio:', folioError);
        throw new Error('No se pudo generar el folio del cierre: ' + folioError.message);
      }

      if (!folio) {
        throw new Error('No se recibió un folio válido');
      }

      console.log('Folio generado para cierre:', folio);

      // Crear el cierre
      const { data: cierre, error: cierreError } = await supabase
        .from('cierres')
        .insert({
          folio,
          fecha_inicio: cierreData.fechaInicio,
          fecha_fin: cierreData.fechaFin,
          cliente_id: cierreData.clienteId || null,
          total: cierreData.total,
          facturado: false
        })
        .select()
        .single();

      if (cierreError) {
        console.error('Error al crear cierre:', cierreError);
        throw new Error('No se pudo crear el cierre: ' + cierreError.message);
      }

      console.log('Cierre creado:', cierre);

      // Actualizar servicios con el cierre_id
      const { error: serviciosError } = await supabase
        .from('servicios')
        .update({ cierre_id: cierre.id })
        .in('id', cierreData.servicioIds);

      if (serviciosError) {
        console.error('Error al actualizar servicios:', serviciosError);
        // Si falla la actualización de servicios, eliminar el cierre creado
        await supabase.from('cierres').delete().eq('id', cierre.id);
        throw new Error('No se pudieron actualizar los servicios: ' + serviciosError.message);
      }

      console.log('Servicios actualizados con cierre_id:', cierre.id);
      return cierre;
    } catch (error) {
      console.error('Error en creación de cierre:', error);
      throw error;
    }
  },

  // Marcar cierre como facturado
  markAsFacturado: async (cierreId: string, facturaId: string) => {
    console.log('Marcando cierre como facturado:', { cierreId, facturaId });

    const { data, error } = await supabase
      .from('cierres')
      .update({
        facturado: true,
        factura_id: facturaId
      })
      .eq('id', cierreId)
      .select()
      .single();

    if (error) {
      console.error('Error al marcar cierre como facturado:', error);
      throw error;
    }

    console.log('Cierre marcado como facturado:', data);
    return data;
  }
};
