
export const mapearColumnas = (headers: string[]): Record<string, string> => {
  const mapeo: Record<string, string> = {};
  
  headers.forEach(header => {
    const headerLower = header.toLowerCase().trim().replace(/[_\s\-\.]/g, '');
    
    // Mapeo para fecha_servicio
    if (headerLower.includes('fecha') && (headerLower.includes('servic') || headerLower.includes('atencion'))) {
      mapeo['fecha_servicio'] = header;
    } else if (headerLower === 'fecha' || headerLower === 'fechaservicio') {
      mapeo['fecha_servicio'] = header;
    }
    
    // Mapeo para marca_vehiculo
    if ((headerLower.includes('marca') && (headerLower.includes('vehic') || headerLower.includes('auto'))) || 
        headerLower === 'marca' || headerLower === 'marcavehiculo') {
      mapeo['marca_vehiculo'] = header;
    }
    
    // Mapeo para modelo_vehiculo
    if ((headerLower.includes('modelo') && (headerLower.includes('vehic') || headerLower.includes('auto'))) || 
        headerLower === 'modelo' || headerLower === 'modelovehiculo') {
      mapeo['modelo_vehiculo'] = header;
    }
    
    // Mapeo para grua_patente - PRIMERO Y MÁS ESPECÍFICO
    if ((headerLower.includes('grua') && headerLower.includes('pat')) ||
        (headerLower.includes('camion') && headerLower.includes('pat')) ||
        headerLower.includes('patentagrua') || 
        headerLower === 'gruapatente' ||
        headerLower === 'patentegrua') {
      mapeo['grua_patente'] = header;
      console.log(`Mapeando grua_patente: ${header} -> ${headerLower}`);
    }
    // Mapeo para patente del vehículo - SEGUNDO Y EXCLUYENDO GRÚAS
    else if (headerLower.includes('patente') || headerLower.includes('placa')) {
      // Solo mapear si NO es una patente de grúa
      if (!headerLower.includes('grua') && !headerLower.includes('camion')) {
        mapeo['patente'] = header;
        console.log(`Mapeando patente vehículo: ${header} -> ${headerLower}`);
      }
    }
    
    // Mapeo para ubicacion_origen
    if ((headerLower.includes('ubicacion') && headerLower.includes('or')) || 
        headerLower.includes('origen') || headerLower === 'ubicacionorigen' ||
        (headerLower.includes('desde') || headerLower.includes('retiro'))) {
      mapeo['ubicacion_origen'] = header;
    }
    
    // Mapeo para ubicacion_destino
    if ((headerLower.includes('ubicacion') && headerLower.includes('de')) || 
        headerLower.includes('destino') || headerLower === 'ubicaciondestino' ||
        (headerLower.includes('hasta') || headerLower.includes('entrega'))) {
      mapeo['ubicacion_destino'] = header;
    }
    
    // Mapeo para cliente_nombre
    if ((headerLower.includes('cliente') && headerLower.includes('nom')) ||
        (headerLower.includes('razon') && headerLower.includes('social')) ||
        headerLower.includes('empresa') || headerLower === 'clientenombre') {
      mapeo['cliente_nombre'] = header;
    }
    
    // Mapeo para cliente_rut - CORREGIDO para detectar "cliente_rut" exacto
    if (headerLower === 'clienterut' || 
        headerLower === 'rut' ||
        headerLower === 'rutcliente' ||
        headerLower.includes('rutempresa') ||
        (headerLower.includes('cliente') && headerLower.includes('rut')) ||
        (headerLower.includes('rut') && headerLower.includes('cliente'))) {
      mapeo['cliente_rut'] = header;
    }
    
    // Mapeo para operador_nombre
    if ((headerLower.includes('operador') && headerLower.includes('nom')) ||
        (headerLower.includes('conductor') && headerLower.includes('nom')) ||
        headerLower.includes('chofer') ||
        headerLower.includes('operadornombre') || headerLower === 'operadornombre') {
      mapeo['operador_nombre'] = header;
    }
    
    // Mapeo para tipo_servicio
    if ((headerLower.includes('tipo') && headerLower.includes('servic')) ||
        headerLower.includes('tiposervicio') ||
        headerLower.includes('servicio') || headerLower === 'tiposervicio') {
      mapeo['tipo_servicio'] = header;
    }
    
    // Mapeo para valor_servicio
    if ((headerLower.includes('valor') && headerLower.includes('servic')) ||
        headerLower.includes('precio') ||
        headerLower.includes('monto') ||
        headerLower.includes('costo') ||
        headerLower === 'total') {
      mapeo['valor_servicio'] = header;
    }

    // Mapeo para orden_compra
    if (headerLower.includes('orden') && headerLower.includes('compra') ||
        headerLower.includes('oc') ||
        headerLower.includes('ordencompra')) {
      mapeo['orden_compra'] = header;
    }

    // Mapeo para observaciones
    if (headerLower.includes('observ') ||
        headerLower.includes('comentari') ||
        headerLower.includes('nota')) {
      mapeo['observaciones'] = header;
    }
  });
  
  console.log('Headers originales:', headers);
  console.log('Mapeo de columnas detectado:', mapeo);
  
  // Validación adicional para evitar conflictos
  if (mapeo['patente'] && mapeo['grua_patente']) {
    console.log(`✅ Mapeo correcto detectado:
      - Patente vehículo: ${mapeo['patente']}
      - Patente grúa: ${mapeo['grua_patente']}`);
  } else if (!mapeo['patente']) {
    console.warn('⚠️ No se detectó columna para patente del vehículo');
  } else if (!mapeo['grua_patente']) {
    console.warn('⚠️ No se detectó columna para patente de grúa');
  }
  
  return mapeo;
};
