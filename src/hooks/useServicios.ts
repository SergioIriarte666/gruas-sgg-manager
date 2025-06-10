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
      console.log('Iniciando creación de servicio con datos:', servicio);
      
      // Validar que todos los campos requeridos estén presentes
      if (!servicio.clienteId || servicio.clienteId.trim() === '') {
        throw new Error('El cliente es requerido');
      }
      if (!servicio.gruaId || servicio.gruaId.trim() === '') {
        throw new Error('La grúa es requerida');
      }
      if (!servicio.operadorId || servicio.operadorId.trim() === '') {
        throw new Error('El operador es requerido');
      }
      if (!servicio.tipoServicioId || servicio.tipoServicioId.trim() === '') {
        throw new Error('El tipo de servicio es requerido');
      }
      if (!servicio.marcaVehiculo || servicio.marcaVehiculo.trim() === '') {
        throw new Error('La marca del vehículo es requerida');
      }
      if (!servicio.modeloVehiculo || servicio.modeloVehiculo.trim() === '') {
        throw new Error('El modelo del vehículo es requerido');
      }
      if (!servicio.patente || servicio.patente.trim() === '') {
        throw new Error('La patente es requerida');
      }
      if (servicio.valor <= 0) {
        throw new Error('El valor debe ser mayor a 0');
      }

      // Verificar que el cliente exista y esté activo
      console.log('Verificando cliente:', servicio.clienteId);
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .select('id, activo')
        .eq('id', servicio.clienteId)
        .eq('activo', true)
        .single();
      
      if (clienteError || !cliente) {
        console.error('Error al verificar cliente:', clienteError);
        throw new Error('El cliente seleccionado no existe o no está activo');
      }

      // Verificar que la grúa exista y esté activa
      console.log('Verificando grúa:', servicio.gruaId);
      const { data: grua, error: gruaError } = await supabase
        .from('gruas')
        .select('id, activo')
        .eq('id', servicio.gruaId)
        .eq('activo', true)
        .single();
      
      if (gruaError || !grua) {
        console.error('Error al verificar grúa:', gruaError);
        throw new Error('La grúa seleccionada no existe o no está activa');
      }

      // Verificar que el operador exista y esté activo
      console.log('Verificando operador:', servicio.operadorId);
      const { data: operador, error: operadorError } = await supabase
        .from('operadores')
        .select('id, activo')
        .eq('id', servicio.operadorId)
        .eq('activo', true)
        .single();
      
      if (operadorError || !operador) {
        console.error('Error al verificar operador:', operadorError);
        throw new Error('El operador seleccionado no existe o no está activo');
      }

      // Verificar que el tipo de servicio exista y esté activo
      console.log('Verificando tipo de servicio:', servicio.tipoServicioId);
      const { data: tipoServicio, error: tipoError } = await supabase
        .from('tipos_servicio')
        .select('id, activo')
        .eq('id', servicio.tipoServicioId)
        .eq('activo', true)
        .single();
      
      if (tipoError || !tipoServicio) {
        console.error('Error al verificar tipo de servicio:', tipoError);
        throw new Error('El tipo de servicio seleccionado no existe o no está activo');
      }

      // Generar folio automáticamente
      console.log('Generando folio...');
      const { data: folioData, error: folioError } = await supabase
        .rpc('generate_folio', { prefix: 'SV' });
      
      if (folioError) {
        console.error('Error al generar folio:', folioError);
        throw new Error('Error al generar el folio del servicio');
      }

      console.log('Folio generado:', folioData);

      // Preparar datos para inserción
      const fechaFormatted = servicio.fecha.toISOString().split('T')[0];
      console.log('Fecha formateada:', fechaFormatted);

      const insertData = {
        folio: folioData,
        fecha: fechaFormatted,
        cliente_id: servicio.clienteId,
        orden_compra: servicio.ordenCompra || null,
        marca_vehiculo: servicio.marcaVehiculo,
        modelo_vehiculo: servicio.modeloVehiculo,
        patente: servicio.patente.toUpperCase(),
        ubicacion_origen: servicio.ubicacionOrigen,
        ubicacion_destino: servicio.ubicacionDestino,
        valor: servicio.valor,
        grua_id: servicio.gruaId,
        operador_id: servicio.operadorId,
        tipo_servicio_id: servicio.tipoServicioId,
        estado: servicio.estado,
        observaciones: servicio.observaciones || null
      };

      console.log('Datos para insertar:', insertData);

      // Insertar el servicio
      const { data, error } = await supabase
        .from('servicios')
        .insert(insertData)
        .select()
        .single();
      
      if (error) {
        console.error('Error al insertar servicio:', error);
        console.error('Detalles del error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Proporcionar mensajes de error más específicos
        if (error.code === '23505') {
          throw new Error('Ya existe un servicio con este folio');
        } else if (error.code === '23503') {
          throw new Error('Error de referencia: verifique que todos los datos seleccionados sean válidos');
        } else if (error.code === '23502') {
          throw new Error('Faltan campos requeridos en el servicio');
        } else {
          throw new Error(`Error al crear el servicio: ${error.message}`);
        }
      }

      console.log('Servicio creado exitosamente:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
    },
    onError: (error) => {
      console.error('Error en la mutación de crear servicio:', error);
    }
  });
};

export const useUpdateServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; fecha: Date; clienteId: string; ordenCompra?: string; marcaVehiculo: string; modeloVehiculo: string; patente: string; ubicacionOrigen: string; ubicacionDestino: string; valor: number; gruaId: string; operadorId: string; tipoServicioId: string; estado: 'en_curso' | 'cerrado' | 'facturado'; observaciones?: string }) => {
      const { id, ...servicio } = params;
      
      const { data, error } = await supabase
        .from('servicios')
        .update({
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
