
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ValidacionResultado } from '@/types/migracion';
import { ValidationBadge } from './ValidationBadge';

interface ValidationDetailsTableProps {
  validaciones: ValidacionResultado[];
}

export const ValidationDetailsTable: React.FC<ValidationDetailsTableProps> = ({ validaciones }) => {
  return (
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
                <TableCell>
                  <ValidationBadge nivel={validacion.nivel} />
                </TableCell>
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
  );
};
