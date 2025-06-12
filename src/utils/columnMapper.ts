
export const mapearColumnas = (headers: string[]): Record<string, string> => {
  const mapeo: Record<string, string> = {};
  
  headers.forEach(header => {
    const headerLower = header.toLowerCase().trim().replace(/[_\s\-\.]/g, '');
    
    // Mapeo para fecha_servicio - más patrones
    if (headerLower.includes('fecha') && (headerLower.includes('servic') || headerLower.includes('atencion'))) {
      mapeo['fecha_servicio'] = header;
    } else if (headerLower === 'fecha') {
      mapeo['fecha_servicio'] = header;
    }
    
    // Mapeo para marca_vehiculo - más patrones
    if ((headerLower.includes('marca') && (headerLower.includes('vehic') || headerLower.includes('auto'))) || 
        headerLower === 'marca') {
      mapeo['marca_vehiculo'] = header;
    }
    
    // Mapeo para modelo_vehiculo - más patrones
    if ((headerLower.includes('modelo') && (headerLower.includes('vehic') || headerLower.includes('auto'))) || 
        headerLower === 'modelo') {
      mapeo['modelo_vehiculo'] = header;
    }
    
    // Mapeo para patente - más patrones
    if (headerLower.includes('patente') || headerLower.includes('placa')) {
      mapeo['patente'] = header;
    }
    
    // Mapeo para ubicacion_origen - más patrones
    if ((headerLower.includes('ubicacion') && headerLower.includes('or')) || 
        headerLower.includes('origen') || 
        (headerLower.includes('desde') || headerLower.includes('retiro'))) {
      mapeo['ubicacion_origen'] = header;
    }
    
    // Mapeo para ubicacion_destino - más patrones
    if ((headerLower.includes('ubicacion') && headerLower.includes('de')) || 
        headerLower.includes('destino') || 
        (headerLower.includes('hasta') || headerLower.includes('entrega'))) {
      mapeo['ubicacion_destino'] = header;
    }
    
    // Mapeo para cliente_nombre - más patrones
    if ((headerLower.includes('cliente') && headerLower.includes('nom')) ||
        (headerLower.includes('razon') && headerLower.includes('social')) ||
        headerLower.includes('empresa')) {
      mapeo['cliente_nombre'] = header;
    }
    
    // Mapeo para cliente_rut - más patrones flexibles
    if ((headerLower.includes('cliente') && headerLower.includes('rut')) ||
        (headerLower.includes('rut') && headerLower.includes('cliente')) ||
        headerLower === 'rut' ||
        headerLower === 'rutcliente' ||
        headerLower.includes('rutempresa')) {
      mapeo['cliente_rut'] = header;
    }
    
    // Mapeo para grua_patente - más patrones
    if ((headerLower.includes('grua') && headerLower.includes('pat')) ||
        (headerLower.includes('camion') && headerLower.includes('pat')) ||
        headerLower.includes('patentagrua')) {
      mapeo['grua_patente'] = header;
    }
    
    // Mapeo para operador_nombre - más patrones
    if ((headerLower.includes('operador') && headerLower.includes('nom')) ||
        (headerLower.includes('conductor') && headerLower.includes('nom')) ||
        headerLower.includes('chofer') ||
        headerLower.includes('operadornombre')) {
      mapeo['operador_nombre'] = header;
    }
    
    // Mapeo para tipo_servicio - más patrones
    if ((headerLower.includes('tipo') && headerLower.includes('servic')) ||
        headerLower.includes('tiposervicio') ||
        headerLower.includes('servicio')) {
      mapeo['tipo_servicio'] = header;
    }
    
    // Mapeo para valor_servicio - más patrones
    if ((headerLower.includes('valor') && headerLower.includes('servic')) ||
        headerLower.includes('precio') ||
        headerLower.includes('monto') ||
        headerLower.includes('costo')) {
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
  
  console.log('Mapeo de columnas detectado:', mapeo);
  return mapeo;
};
