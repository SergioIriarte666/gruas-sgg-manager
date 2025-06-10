
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EstadoBadgeProps {
  estado: 'en_curso' | 'cerrado' | 'facturado' | 'pendiente' | 'pagada' | 'vencida';
  className?: string;
}

const estadoConfig = {
  en_curso: { label: 'En Curso', className: 'status-en-curso' },
  cerrado: { label: 'Cerrado', className: 'status-cerrado' },
  facturado: { label: 'Facturado', className: 'status-facturado' },
  pendiente: { label: 'Pendiente', className: 'status-pendiente' },
  pagada: { label: 'Pagada', className: 'status-pagada' },
  vencida: { label: 'Vencida', className: 'status-vencida' }
};

export function EstadoBadge({ estado, className }: EstadoBadgeProps) {
  const config = estadoConfig[estado];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, "px-2 py-1 text-xs border", className)}
    >
      {config.label}
    </Badge>
  );
}
