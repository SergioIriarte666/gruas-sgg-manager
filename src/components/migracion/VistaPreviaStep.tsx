
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FileResult {
  data: any[];
  headers: string[];
  totalRows: number;
}

interface VistaPreviaStepProps {
  result: FileResult;
  onCambiarArchivo: () => void;
  onContinuar: () => void;
}

export const VistaPreviaStep: React.FC<VistaPreviaStepProps> = ({
  result,
  onCambiarArchivo,
  onContinuar
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline">{result.totalRows} registros</Badge>
              <Badge variant="outline">{result.headers.length} columnas</Badge>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {result.headers.slice(0, 6).map((header, index) => (
                      <th key={index} className="text-left p-2 font-medium">
                        {header}
                      </th>
                    ))}
                    {result.headers.length > 6 && <th className="text-left p-2">...</th>}
                  </tr>
                </thead>
                <tbody>
                  {result.data.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-b">
                      {result.headers.slice(0, 6).map((header, colIndex) => (
                        <td key={colIndex} className="p-2 text-muted-foreground">
                          {String(row[header] || '').substring(0, 20)}
                          {String(row[header] || '').length > 20 ? '...' : ''}
                        </td>
                      ))}
                      {result.headers.length > 6 && <td className="p-2 text-muted-foreground">...</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {result.data.length > 5 && (
              <p className="text-muted-foreground text-sm">
                Mostrando 5 de {result.data.length} registros
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCambiarArchivo}>
          Cambiar Archivo
        </Button>
        <Button onClick={onContinuar}>
          Continuar a Validación
        </Button>
      </div>
    </div>
  );
};
