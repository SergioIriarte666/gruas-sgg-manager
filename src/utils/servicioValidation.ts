
export const validateServicioData = (servicio: {
  clienteId: string;
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  patente: string;
  valor: number;
}) => {
  console.log('Validando datos del servicio:', servicio);
  
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
};

export const validateRelatedEntities = async (supabase: any, servicio: {
  clienteId: string;
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
}) => {
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
};
