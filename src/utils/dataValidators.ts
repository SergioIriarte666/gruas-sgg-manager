
export const validarRUT = (rut: string): boolean => {
  if (!rut) return false;
  
  // Remover puntos y guión
  const rutLimpio = rut.replace(/[.-]/g, '');
  
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toLowerCase();
  
  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) return false;
  
  // Calcular dígito verificador
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
  
  return dv === dvCalculado;
};

export const validarFecha = (fecha: string): boolean => {
  if (!fecha) return false;
  
  const fechaObj = new Date(fecha);
  return !isNaN(fechaObj.getTime()) && fechaObj <= new Date();
};
