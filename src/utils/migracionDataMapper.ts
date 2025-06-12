
import { supabase } from '@/integrations/supabase/client';

export interface MigracionDataRow {
  fecha_servicio: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  patente: string;
  ubicacion_origen: string;
  ubicacion_destino: string;
  cliente_nombre: string;
  cliente_rut: string;
  grua_patente: string;
  operador_nombre: string;
  tipo_servicio: string;
  valor_servicio?: string | number;
  orden_compra?: string;
  observaciones?: string;
}

export interface EntityCache {
  clientes: Map<string, string>; // rut -> id
  gruas: Map<string, string>; // patente -> id
  operadores: Map<string, string>; // nombre -> id
  tiposServicio: Map<string, string>; // nombre -> id
}

export const buildEntityCache = async (): Promise<EntityCache> => {
  console.log('migracionDataMapper: Construyendo cache de entidades...');
  
  const [clientesRes, gruasRes, operadoresRes, tiposRes] = await Promise.all([
    supabase.from('clientes').select('id, rut').eq('activo', true),
    supabase.from('gruas').select('id, patente').eq('activo', true),
    supabase.from('operadores').select('id, nombre_completo').eq('activo', true),
    supabase.from('tipos_servicio').select('id, nombre').eq('activo', true)
  ]);

  if (clientesRes.error) throw new Error(`Error cargando clientes: ${clientesRes.error.message}`);
  if (gruasRes.error) throw new Error(`Error cargando grúas: ${gruasRes.error.message}`);
  if (operadoresRes.error) throw new Error(`Error cargando operadores: ${operadoresRes.error.message}`);
  if (tiposRes.error) throw new Error(`Error cargando tipos de servicio: ${tiposRes.error.message}`);

  const cache: EntityCache = {
    clientes: new Map(),
    gruas: new Map(),
    operadores: new Map(),
    tiposServicio: new Map()
  };

  clientesRes.data?.forEach(cliente => {
    cache.clientes.set(cliente.rut.toLowerCase().trim(), cliente.id);
  });

  gruasRes.data?.forEach(grua => {
    cache.gruas.set(grua.patente.toLowerCase().trim(), grua.id);
  });

  operadoresRes.data?.forEach(operador => {
    cache.operadores.set(operador.nombre_completo.toLowerCase().trim(), operador.id);
  });

  tiposRes.data?.forEach(tipo => {
    cache.tiposServicio.set(tipo.nombre.toLowerCase().trim(), tipo.id);
  });

  console.log('migracionDataMapper: Cache construido exitosamente', {
    clientes: cache.clientes.size,
    gruas: cache.gruas.size,
    operadores: cache.operadores.size,
    tiposServicio: cache.tiposServicio.size
  });

  return cache;
};

export const mapearDatosMigracion = (fila: MigracionDataRow, cache: EntityCache) => {
  console.log('migracionDataMapper: Mapeando fila:', fila);

  // Buscar IDs en el cache
  const clienteId = cache.clientes.get(String(fila.cliente_rut).toLowerCase().trim());
  const gruaId = cache.gruas.get(String(fila.grua_patente).toLowerCase().trim());
  const operadorId = cache.operadores.get(String(fila.operador_nombre).toLowerCase().trim());
  const tipoServicioId = cache.tiposServicio.get(String(fila.tipo_servicio).toLowerCase().trim());

  if (!clienteId) {
    throw new Error(`Cliente no encontrado: ${fila.cliente_rut}`);
  }
  if (!gruaId) {
    throw new Error(`Grúa no encontrada: ${fila.grua_patente}`);
  }
  if (!operadorId) {
    throw new Error(`Operador no encontrado: ${fila.operador_nombre}`);
  }
  if (!tipoServicioId) {
    throw new Error(`Tipo de servicio no encontrado: ${fila.tipo_servicio}`);
  }

  // Parsear fecha
  let fecha: Date;
  try {
    fecha = new Date(fila.fecha_servicio);
    if (isNaN(fecha.getTime())) {
      throw new Error(`Fecha inválida: ${fila.fecha_servicio}`);
    }
  } catch (error) {
    throw new Error(`Error parseando fecha: ${fila.fecha_servicio}`);
  }

  // Parsear valor
  let valor = 0;
  if (fila.valor_servicio) {
    const valorString = String(fila.valor_servicio).replace(/[^\d.,]/g, '');
    valor = parseFloat(valorString.replace(',', '.')) || 0;
  }

  const servicioData = {
    fecha,
    clienteId,
    ordenCompra: fila.orden_compra?.trim() || undefined,
    marcaVehiculo: String(fila.marca_vehiculo).trim(),
    modeloVehiculo: String(fila.modelo_vehiculo).trim(),
    patente: String(fila.patente).toUpperCase().trim(),
    ubicacionOrigen: String(fila.ubicacion_origen).trim(),
    ubicacionDestino: String(fila.ubicacion_destino).trim(),
    valor,
    gruaId,
    operadorId,
    tipoServicioId,
    estado: 'en_curso' as const,
    observaciones: fila.observaciones?.trim() || undefined
  };

  console.log('migracionDataMapper: Servicio mapeado:', servicioData);
  return servicioData;
};
