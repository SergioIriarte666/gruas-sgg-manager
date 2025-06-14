
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
  clientes: Map<string, string>; // rut normalizado -> id
  gruas: Map<string, string>; // patente normalizada -> id
  operadores: Map<string, string>; // nombre normalizado -> id
  tiposServicio: Map<string, string>; // nombre normalizado -> id
}

// Función para normalizar RUT
export const normalizeRut = (rut: string): string => {
  if (!rut) return '';
  return String(rut)
    .toLowerCase()
    .trim()
    .replace(/[.\s\-]/g, '') // Remover puntos, espacios y guiones
    .replace(/[^0-9k]/g, ''); // Solo números y k
};

// Función para normalizar texto general (más agresiva)
export const normalizeText = (text: string): string => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^\w\s]/g, '') // Remover caracteres especiales excepto espacios
    .replace(/\s+/g, ' ') // Normalizar espacios múltiples
    .trim();
};

// Función para normalizar patentes específicamente
export const normalizePatente = (patente: string): string => {
  if (!patente) return '';
  return String(patente)
    .toUpperCase()
    .trim()
    .replace(/[.\s\-]/g, '') // Remover puntos, espacios y guiones
    .replace(/[^A-Z0-9]/g, ''); // Solo letras y números
};

export const buildEntityCache = async (): Promise<EntityCache> => {
  console.log('migracionDataMapper: Construyendo cache de entidades...');
  
  const [clientesRes, gruasRes, operadoresRes, tiposRes] = await Promise.all([
    supabase.from('clientes').select('id, rut, razon_social').eq('activo', true),
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

  // Construir cache de clientes con RUT normalizado
  clientesRes.data?.forEach(cliente => {
    const rutNormalizado = normalizeRut(cliente.rut);
    if (rutNormalizado) {
      cache.clientes.set(rutNormalizado, cliente.id);
      console.log(`Cliente cacheado: ${cliente.razon_social} - RUT: ${cliente.rut} -> ${rutNormalizado} -> ID: ${cliente.id}`);
    }
  });

  // Construir cache de grúas con patente normalizada
  gruasRes.data?.forEach(grua => {
    const patenteNormalizada = normalizePatente(grua.patente);
    if (patenteNormalizada) {
      cache.gruas.set(patenteNormalizada, grua.id);
      console.log(`Grúa cacheada: ${grua.patente} -> ${patenteNormalizada} -> ID: ${grua.id}`);
    }
  });

  // Construir cache de operadores con nombre normalizado
  operadoresRes.data?.forEach(operador => {
    const nombreNormalizado = normalizeText(operador.nombre_completo);
    if (nombreNormalizado) {
      cache.operadores.set(nombreNormalizado, operador.id);
      console.log(`Operador cacheado: ${operador.nombre_completo} -> ${nombreNormalizado} -> ID: ${operador.id}`);
    }
  });

  // Construir cache de tipos de servicio con nombre normalizado
  tiposRes.data?.forEach(tipo => {
    const nombreNormalizado = normalizeText(tipo.nombre);
    if (nombreNormalizado) {
      cache.tiposServicio.set(nombreNormalizado, tipo.id);
      console.log(`Tipo servicio cacheado: ${tipo.nombre} -> ${nombreNormalizado} -> ID: ${tipo.id}`);
    }
  });

  console.log('migracionDataMapper: Cache construido exitosamente', {
    clientes: cache.clientes.size,
    gruas: cache.gruas.size,
    operadores: cache.operadores.size,
    tiposServicio: cache.tiposServicio.size
  });

  return cache;
};

// Función mejorada para búsqueda fuzzy de entidades
const buscarEntidadFuzzy = (cache: Map<string, string>, valorBusqueda: string, tipo: string): string | null => {
  let valorNormalizado: string;
  
  // Aplicar normalización específica según el tipo
  if (tipo === 'rut') {
    valorNormalizado = normalizeRut(valorBusqueda);
  } else if (tipo === 'patente') {
    valorNormalizado = normalizePatente(valorBusqueda);
  } else {
    valorNormalizado = normalizeText(valorBusqueda);
  }
  
  console.log(`Buscando ${tipo}: "${valorBusqueda}" -> normalizado: "${valorNormalizado}"`);
  
  // Búsqueda exacta primero
  if (cache.has(valorNormalizado)) {
    const id = cache.get(valorNormalizado)!;
    console.log(`✅ Encontrado exacto para ${tipo}: ${valorNormalizado} -> ${id}`);
    return id;
  }

  // Búsqueda fuzzy más agresiva
  const allKeys = Array.from(cache.keys());
  
  // Para RUTs, no hacer búsqueda fuzzy
  if (tipo === 'rut') {
    console.log(`❌ RUT no encontrado: "${valorBusqueda}" (normalizado: "${valorNormalizado}")`);
    console.log(`RUTs disponibles:`, allKeys.slice(0, 10));
    return null;
  }

  // Para otros tipos, intentar múltiples estrategias de búsqueda
  if (valorNormalizado.length > 2) {
    // 1. Buscar si alguna clave contiene el valor buscado
    for (const [cacheKey, id] of cache.entries()) {
      if (cacheKey.includes(valorNormalizado)) {
        console.log(`✅ Encontrado fuzzy (contiene) para ${tipo}: "${valorBusqueda}" -> "${cacheKey}" -> ${id}`);
        return id;
      }
    }
    
    // 2. Buscar si el valor buscado contiene alguna clave
    for (const [cacheKey, id] of cache.entries()) {
      if (valorNormalizado.includes(cacheKey) && cacheKey.length > 3) {
        console.log(`✅ Encontrado fuzzy (es contenido) para ${tipo}: "${valorBusqueda}" -> "${cacheKey}" -> ${id}`);
        return id;
      }
    }
    
    // 3. Búsqueda por palabras individuales (para nombres compuestos)
    if (tipo === 'nombre') {
      const palabrasBuscadas = valorNormalizado.split(' ').filter(p => p.length > 2);
      for (const [cacheKey, id] of cache.entries()) {
        const palabrasCache = cacheKey.split(' ');
        const coincidencias = palabrasBuscadas.filter(palabra => 
          palabrasCache.some(palabraCache => 
            palabraCache.includes(palabra) || palabra.includes(palabraCache)
          )
        );
        
        if (coincidencias.length >= Math.min(2, palabrasBuscadas.length)) {
          console.log(`✅ Encontrado fuzzy (palabras) para ${tipo}: "${valorBusqueda}" -> "${cacheKey}" -> ${id}`);
          return id;
        }
      }
    }
    
    // 4. Para tipos de servicio, buscar por palabras clave
    if (tipo === 'tipo') {
      for (const [cacheKey, id] of cache.entries()) {
        // Buscar palabras clave comunes
        const palabrasImportantes = ['remolque', 'grua', 'traslado', 'rescate', 'auxilio'];
        for (const palabra of palabrasImportantes) {
          if (valorNormalizado.includes(palabra) && cacheKey.includes(palabra)) {
            console.log(`✅ Encontrado fuzzy (palabra clave) para ${tipo}: "${valorBusqueda}" -> "${cacheKey}" -> ${id}`);
            return id;
          }
        }
      }
    }
  }

  console.log(`❌ No encontrado ${tipo}: "${valorBusqueda}" (normalizado: "${valorNormalizado}")`);
  console.log(`Valores disponibles en cache de ${tipo}:`, allKeys.slice(0, 5));
  return null;
};

export const mapearDatosMigracion = (fila: MigracionDataRow, cache: EntityCache) => {
  console.log('migracionDataMapper: Mapeando fila:', fila);
  
  // VALIDACIÓN CRÍTICA: Verificar que las patentes sean diferentes
  const patenteVehiculo = normalizePatente(String(fila.patente));
  const patenteGrua = normalizePatente(String(fila.grua_patente));
  
  console.log(`🚗 Patente vehículo: "${fila.patente}" -> normalizada: "${patenteVehiculo}"`);
  console.log(`🚛 Patente grúa: "${fila.grua_patente}" -> normalizada: "${patenteGrua}"`);
  
  if (patenteVehiculo === patenteGrua && patenteVehiculo !== '') {
    console.error(`❌ ERROR: La patente del vehículo y la grúa son iguales: "${patenteVehiculo}"`);
    console.error('Datos originales:', { patente: fila.patente, grua_patente: fila.grua_patente });
    throw new Error(`Las patentes del vehículo ("${fila.patente}") y la grúa ("${fila.grua_patente}") no pueden ser iguales. Verifica el mapeo de columnas.`);
  }

  // Validar que tenemos los datos mínimos requeridos
  if (!fila.cliente_rut) {
    throw new Error(`RUT del cliente es requerido pero está vacío o es undefined`);
  }
  if (!fila.grua_patente) {
    throw new Error(`Patente de grúa es requerida pero está vacía o es undefined`);
  }
  if (!fila.operador_nombre) {
    throw new Error(`Nombre del operador es requerido pero está vacío o es undefined`);
  }
  if (!fila.tipo_servicio) {
    throw new Error(`Tipo de servicio es requerido pero está vacío o es undefined`);
  }

  // Buscar IDs en el cache con búsqueda mejorada
  const clienteId = buscarEntidadFuzzy(cache.clientes, String(fila.cliente_rut), 'rut');
  const gruaId = buscarEntidadFuzzy(cache.gruas, String(fila.grua_patente), 'patente');
  const operadorId = buscarEntidadFuzzy(cache.operadores, String(fila.operador_nombre), 'nombre');
  const tipoServicioId = buscarEntidadFuzzy(cache.tiposServicio, String(fila.tipo_servicio), 'tipo');

  // Validar que encontramos todas las entidades
  if (!clienteId) {
    throw new Error(`Cliente no encontrado con RUT: "${fila.cliente_rut}". RUT normalizado: "${normalizeRut(String(fila.cliente_rut))}". Verifica que el cliente esté registrado y activo en el sistema.`);
  }
  if (!gruaId) {
    throw new Error(`Grúa no encontrada con patente: "${fila.grua_patente}". Patente normalizada: "${normalizePatente(String(fila.grua_patente))}". Verifica que la grúa esté registrada y activa en el sistema.`);
  }
  if (!operadorId) {
    throw new Error(`Operador no encontrado con nombre: "${fila.operador_nombre}". Nombre normalizado: "${normalizeText(String(fila.operador_nombre))}". Verifica que el operador esté registrado y activo en el sistema.`);
  }
  if (!tipoServicioId) {
    throw new Error(`Tipo de servicio no encontrado: "${fila.tipo_servicio}". Nombre normalizado: "${normalizeText(String(fila.tipo_servicio))}". Verifica que el tipo de servicio esté registrado y activo en el sistema.`);
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
    patente: patenteVehiculo, // Usar la patente normalizada del vehículo
    ubicacionOrigen: String(fila.ubicacion_origen).trim(),
    ubicacionDestino: String(fila.ubicacion_destino).trim(),
    valor,
    gruaId,
    operadorId,
    tipoServicioId,
    estado: 'en_curso' as const,
    observaciones: fila.observaciones?.trim() || undefined
  };

  console.log('migracionDataMapper: Servicio mapeado exitosamente:', servicioData);
  console.log(`✅ Patentes correctamente asignadas:
    - Vehículo: ${servicioData.patente}
    - Grúa ID: ${servicioData.gruaId} (patente original: ${fila.grua_patente})`);
    
  return servicioData;
};
