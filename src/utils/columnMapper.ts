
export const mapearColumnas = (headers: string[]): Record<string, string> => {
  const mapeo: Record<string, string> = {};
  
  headers.forEach(header => {
    const headerLower = header.toLowerCase().trim();
    
    // Mapeo para fecha_servicio
    if (headerLower.includes('fecha') && headerLower.includes('servic')) {
      mapeo['fecha_servicio'] = header;
    }
    
    // Mapeo para marca_vehiculo
    if (headerLower.includes('marca') && headerLower.includes('vehic')) {
      mapeo['marca_vehiculo'] = header;
    }
    
    // Mapeo para modelo_vehiculo
    if (headerLower.includes('modelo') && headerLower.includes('vehic')) {
      mapeo['modelo_vehiculo'] = header;
    }
    
    // Mapeo para patente
    if (headerLower.includes('patente')) {
      mapeo['patente'] = header;
    }
    
    // Mapeo para ubicacion_origen
    if ((headerLower.includes('ubicacion') && headerLower.includes('or')) || 
        (headerLower.includes('origen'))) {
      mapeo['ubicacion_origen'] = header;
    }
    
    // Mapeo para ubicacion_destino
    if ((headerLower.includes('ubicacion') && headerLower.includes('de')) || 
        (headerLower.includes('destino'))) {
      mapeo['ubicacion_destino'] = header;
    }
    
    // Mapeo para cliente_nombre
    if (headerLower.includes('cliente') && headerLower.includes('nom')) {
      mapeo['cliente_nombre'] = header;
    }
    
    // Mapeo para cliente_rut
    if (headerLower.includes('cliente') && headerLower.includes('rut')) {
      mapeo['cliente_rut'] = header;
    }
    
    // Mapeo para grua_patente
    if (headerLower.includes('grua') && headerLower.includes('pat')) {
      mapeo['grua_patente'] = header;
    }
    
    // Mapeo para operador_nombre
    if (headerLower.includes('operador') && headerLower.includes('nom')) {
      mapeo['operador_nombre'] = header;
    }
    
    // Mapeo para tipo_servicio
    if (headerLower.includes('tipo') && headerLower.includes('servic')) {
      mapeo['tipo_servicio'] = header;
    }
    
    // Mapeo para valor_servicio
    if (headerLower.includes('valor') && headerLower.includes('servic')) {
      mapeo['valor_servicio'] = header;
    }
  });
  
  return mapeo;
};
