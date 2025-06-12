
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { ValidacionResultado } from '@/types/migracion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ValidacionDatosProps {
  datos: any[];
  validaciones: ValidacionResultado[];
  onContinuar: () => void;
  onVolver: () => void;
}

export const ValidacionDatos: React.FC<ValidacionDatosProps> = ({
  datos,
  validaciones,
  onContinuar,
  onVolver
}) => {
  const errores = validaciones.filter(v => v.nivel === 'error');
  const advertencias = validaciones.filter(v => v.nivel === 'advertencia');
  const validos = validaciones.filter(v => v.nivel === 'valido');

  const getNivelBadge = (nivel: string) => {
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

  return (
    <div className="space-y-6">
      {/* Resumen de validación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Resumen de Validación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{validos.length}</div>
              <div className="text-sm text-muted-foreground">Registros Válidos</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">{advertencias.length}</div>
              <div className="text-sm text-muted-foreground">Advertencias</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{errores.length}</div>
              <div className="text-sm text-muted-foreground">Errores</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de validaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Validaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fila</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Valor Original</TableHead>
                <TableHead>Sugerencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validaciones.slice(0, 20).map((validacion, index) => (
                <TableRow key={index}>
                  <TableCell>{validacion.fila}</TableCell>
                  <TableCell className="font-medium">{validacion.campo}</TableCell>
                  <TableCell>{getNivelBadge(validacion.nivel)}</TableCell>
                  <TableCell>{validacion.mensaje}</TableCell>
                  <TableCell className="max-w-32 truncate">
                    {String(validacion.valorOriginal || '').substring(0, 30)}
                    {String(validacion.valorOriginal || '').length > 30 ? '...' : ''}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {validacion.sugerencia || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {validaciones.length > 20 && (
            <div className="mt-4 text-center text-muted-foreground text-sm">
              Mostrando 20 de {validaciones.length} validaciones
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onVolver}>
          Volver a Vista Previa
        </Button>
        <Button 
          onClick={onContinuar}
          disabled={errores.length > 0}
          className={errores.length > 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          {errores.length > 0 ? 
            `No se puede continuar (${errores.length} errores)` : 
            'Continuar al Procesamiento'
          }
        </Button>
      </div>

      {errores.length > 0 && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Errores encontrados</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Debes corregir los errores en el archivo antes de continuar con el procesamiento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
