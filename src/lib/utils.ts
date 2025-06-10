
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSafeDate(date: string | Date | null | undefined, formatString: string = "dd/MM/yyyy"): string {
  if (!date) {
    return "Fecha no disponible";
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar si la fecha es válida
    if (isNaN(dateObj.getTime())) {
      return "Fecha inválida";
    }

    return format(dateObj, formatString, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error, 'Date value:', date);
    return "Error en fecha";
  }
}
