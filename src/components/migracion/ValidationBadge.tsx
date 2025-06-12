
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface ValidationBadgeProps {
  nivel: string;
}

export const ValidationBadge: React.FC<ValidationBadgeProps> = ({ nivel }) => {
  switch (nivel) {
    case 'error':
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Error</Badge>;
    case 'advertencia':
      return <Badge variant="secondary" className="gap-1"><AlertTriangle className="h-3 w-3" />Advertencia</Badge>;
    case 'valido':
      return <Badge className="gap-1 bg-green-500/20 text-green-300 border-green-500/30"><CheckCircle className="h-3 w-3" />Válido</Badge>;
    default:
      return <Badge variant="outline">{nivel}</Badge>;
  }
};
