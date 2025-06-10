import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Servicio } from "@/types";

export const useServicios = () => {
  return useQuery({
    queryKey: ['servicios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(razon_social, rut, telefono, email, direccion, activo),
          grua:gruas(patente, marca, modelo, tipo, activo),
          operador:operadores(nombre_completo, rut, telefono, numero_licencia, activo),
          tipo_servicio:tipos_servicio(nombre, descripcion, activo)
        `)
        .order('fecha', { ascending: false });
      
      if (error) throw error;
      
      return data.map(servicio => ({
        id: servicio.id,
        fecha: new Date(servicio.fecha),
        folio: servicio.folio,
        clienteId: servicio.cliente_id,
        cliente: servicio.cliente ? {
          id: servicio.cliente_id,
          razonSocial: servicio.cliente.razon_social,
          rut: servicio.cliente.rut,
          telefono: servicio.cliente.telefono,
          email: servicio.cliente.email,
          direccion: servicio.cliente.direccion,
          activo: servicio.cliente.activo,
          createdAt: new Date(),
          updatedAt: new Date()
        } : undefined,
        ordenCompra: servicio.orden_compra,
        marcaVehiculo: servicio.marca_vehiculo,
        modeloVehiculo: servicio.modelo_vehiculo,
        patente: servicio.patente,
        ubicacionOrigen: servicio.ubicacion_origen,
        ubicacionDestino: servicio.ubicacion_destino,
        valor: Number(servicio.valor),
        gruaId: servicio.grua_id,
        grua: servicio.grua ? {
          id: servicio.grua_id,
          patente: servicio.grua.patente,
          marca: servicio.grua.marca,
          modelo: servicio.grua.modelo,
          tipo: servicio.grua.tipo as 'Liviana' | 'Mediana' | 'Pesada',
          activo: servicio.grua.activo,
          createdAt: new Date(),
          updatedAt: new Date()
        } : undefined,
        operadorId: servicio.operador_id,
        operador: servicio.operador ? {
          id: servicio.operador_id,
          nombreCompleto: servicio.operador.nombre_completo,
          rut: servicio.operador.rut,
          telefono: servicio.operador.telefono,
          numeroLicencia: servicio.operador.numero_licencia,
          activo: servicio.operador.activo,
          createdAt: new Date(),
          updatedAt: new Date()
        } : undefined,
        tipoServicioId: servicio.tipo_servicio_id,
        tipoServicio: servicio.tipo_servicio ? {
          id: servicio.tipo_servicio_id,
          nombre: servicio.tipo_servicio.nombre,
          descripcion: servicio.tipo_servicio.descripcion,
          activo: servicio.tipo_servicio.activo,
          createdAt: new Date(),
          updatedAt: new Date()
        } : undefined,
        estado: servicio.estado as 'en_curso' | 'cerrado' | 'facturado',
        observaciones: servicio.observaciones,
        cierreId: servicio.cierre_id,
        facturaId: servicio.factura_id,
        createdAt: new Date(servicio.created_at),
        updatedAt: new Date(servicio.updated_at)
      })) as Servicio[];
    }
  });
};

export const useCreateServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servicio: {
      fecha: Date;
      clienteId: string;
      ordenCompra?: string;
      marcaVehiculo: string;
      modeloVehiculo: string;
      patente: string;
      ubicacionOrigen: string;
      ubicacionDestino: string;
      valor: number;
      gruaId: string;
      operadorId: string;
      tipoServicioId: string;
      estado: 'en_curso' | 'cerrado' | 'facturado';
      observaciones?: string;
    }) => {
      // Generar folio automáticamente
      const { data: folioData, error: folioError } = await supabase
        .rpc('generate_folio', { prefix: 'SV' });
      
      if (folioError) throw folioError;
      
      const { data, error } = await supabase
        .from('servicios')
        .insert({
          folio: folioData,
          fecha: servicio.fecha.toISOString().split('T')[0],
          cliente_id: servicio.clienteId,
          orden_compra: servicio.ordenCompra,
          marca_vehiculo: servicio.marcaVehiculo,
          modelo_vehiculo: servicio.modeloVehiculo,
          patente: servicio.patente,
          ubicacion_origen: servicio.ubicacionOrigen,
          ubicacion_destino: servicio.ubicacionDestino,
          valor: servicio.valor,
          grua_id: servicio.gruaId,
          operador_id: servicio.operadorId,
          tipo_servicio_id: servicio.tipoServicioId,
          estado: servicio.estado,
          observaciones: servicio.observaciones
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    }
  });
};

export const useUpdateServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string } & {
      fecha: Date;
      clienteId: string;
      ordenCompra?: string;
      marcaVehiculo: string;
      modeloVehiculo: string;
      patente: string;
      ubicacionOrigen: string;
      ubicacionDestino: string;
      valor: number;
      gruaId: string;
      operadorId: string;
      tipoServicioId: string;
      estado: 'en_curso' | 'cerrado' | 'facturado';
      observaciones?: string;
    }) => {
      const { id, ...servicio } = params;
      const updateData: any = {};
      
      updateData.fecha = servicio.fecha.toISOString().split('T')[0];
      updateData.cliente_id = servicio.clienteId;
      updateData.orden_compra = servicio.ordenCompra;
      updateData.marca_vehiculo = servicio.marcaVehiculo;
      updateData.modelo_vehiculo = servicio.modeloVehiculo;
      updateData.patente = servicio.patente;
      updateData.ubicacion_origen = servicio.ubicacionOrigen;
      updateData.ubicacion_destino = servicio.ubicacionDestino;
      updateData.valor = servicio.valor;
      updateData.grua_id = servicio.gruaId;
      updateData.operador_id = servicio.operadorId;
      updateData.tipo_servicio_id = servicio.tipoServicioId;
      updateData.estado = servicio.estado;
      updateData.observaciones = servicio.observaciones;
      
      const { data, error } = await supabase
        .from('servicios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    }
  });
};

export const useDeleteServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('servicios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    }
  });
};

export const useEstadisticasServicios = () => {
  return useQuery({
    queryKey: ['estadisticas-servicios'],
    queryFn: async () => {
      const { data: servicios, error } = await supabase
        .from('servicios')
        .select('estado, valor');
      
      if (error) throw error;
      
      const totalServicios = servicios.length;
      const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
      const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
      const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
      const ingresosTotales = servicios.reduce((acc, s) => acc + Number(s.valor), 0);
      
      return {
        totalServicios,
        serviciosEnCurso,
        serviciosCerrados,
        serviciosFacturados,
        ingresosTotales
      };
    }
  });
};
