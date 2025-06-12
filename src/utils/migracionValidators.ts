
// Expresiones regulares para validación
export const patenteRegex = /^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/;
export const rutRegex = /^\d{7,8}-[\dkK]$/;
export const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
export const telefonoRegex = /^\+569\d{8}$/;

export const validarPatente = (patente: string): boolean => {
  return patenteRegex.test(patente?.toUpperCase());
};

export const validarRut = (rut: string): boolean => {
  if (!rutRegex.test(rut)) return false;
  
  const [numero, dv] = rut.split('-');
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = numero.length - 1; i >= 0; i--) {
    suma += parseInt(numero[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = suma % 11;
  const dvCalculado = resto < 2 ? resto.toString() : resto === 10 ? 'K' : (11 - resto).toString();
  
  return dvCalculado === dv.toUpperCase();
};

export const validarFecha = (fecha: string): boolean => {
  if (!fechaRegex.test(fecha)) return false;
  
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(hoy.getDate() + 30);
  
  return fechaObj <= maxFecha && fechaObj >= new Date('2020-01-01');
};

export const validarTelefono = (telefono: string): boolean => {
  return telefonoRegex.test(telefono);
};

export const formatearRut = (rut: string): string => {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length < 2) return rut;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1);
  
  return `${cuerpo}-${dv.toUpperCase()}`;
};

export const formatearPatente = (patente: string): string => {
  return patente.toUpperCase().replace(/[^A-Z0-9]/g, '');
};
