
import { supabase } from "@/integrations/supabase/client";
import type { Cierre } from "@/types";

export const cierresApi = {
  // Obtener todos los cierres
  getAll: async () => {
    console.log('Obteniendo todos los cierres...');
    
    const { data, error } = await supabase
      .from('cierres')
      .select(`
        *,
        clientes (
          razon_social
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener cierres:', error);
      throw error;
    }

    return data;
  },

  // Generar folio automático para cierre
  generateFolio: async (): Promise<string> => {
    console.log('Generando folio automático para cierre...');
    
    const { data, error } = await supabase.rpc('generate_folio', {
      prefix: 'C'
    });

    if (error) {
      console.error('Error al generar folio de cierre:', error);
      throw error;
    }

    console.log('Folio generado:', data);
    return data;
  },

  // Obtener servicios elegibles para cierre (estado 'cerrado' y sin cierre asignado)
  getServiciosElegibles: async (fechaInicio: string, fechaFin: string, clienteId?: string) => {
    console.log('Obteniendo servicios elegibles para cierre:', { fechaInicio, fechaFin, clienteId });
    
    let query = supabase
      .from('servicios')
      .select(`
        *,
        clientes!inner (
          id,
          razon_social
        ),
        gruas (
          patente
        ),
        operadores (
          nombre_completo
        ),
        tipos_servicio (
          nombre
        )
      `)
      .eq('estado', 'cerrado')
      .is('cierre_id', null)
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin);

    if (clienteId) {
      query = query.eq('cliente_id', clienteId);
    }

    const { data, error } = await query.order('fecha', { ascending: true });

    if (error) {
      console.error('Error al obtener servicios elegibles:', error);
      throw error;
    }

    return data;
  },

  // Crear nuevo cierre
  create: async (cierre: {
    fechaInicio: string;
    fechaFin: string;
    clienteId?: string;
    serviciosIds: string[];
    total: number;
  }) => {
    console.log('Creando nuevo cierre:', cierre);

    // Generar folio automático
    const folio = await cierresApi.generateFolio();

    const { data, error } = await supabase
      .from('cierres')
      .insert({
        folio,
        fecha_inicio: cierre.fechaInicio,
        fecha_fin: cierre.fechaFin,
        cliente_id: cierre.clienteId,
        total: cierre.total,
        facturado: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear cierre:', error);
      throw error;
    }

    // Actualizar servicios para asignarles el cierre_id
    const { error: updateError } = await supabase
      .from('servicios')
      .update({ 
        cierre_id: data.id,
        estado: 'cerrado' // Mantener estado cerrado pero ahora con cierre asignado
      })
      .in('id', cierre.serviciosIds);

    if (updateError) {
      console.error('Error al actualizar servicios con cierre_id:', updateError);
      throw updateError;
    }

    console.log('Cierre creado exitosamente:', data);
    return data;
  },

  // Obtener cierre por ID con servicios incluidos
  getById: async (id: string) => {
    console.log('Obteniendo cierre por ID:', id);
    
    const { data, error } = await supabase
      .from('cierres')
      .select(`
        *,
        clientes (
          razon_social,
          rut,
          direccion,
          telefono,
          email
        ),
        servicios (
          *,
          gruas (
            patente
          ),
          operadores (
            nombre_completo
          ),
          tipos_servicio (
            nombre
          )
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

    // También actualizar servicios para marcarlos como facturados
    const { error: serviciosError } = await supabase
      .from('servicios')
      .update({ 
        estado: 'facturado',
        factura_id: facturaId
      })
      .eq('cierre_id', cierreId);

    if (serviciosError) {
      console.error('Error al actualizar servicios como facturados:', serviciosError);
      throw serviciosError;
    }

    return data;
  }
};
