
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Download, BookOpen, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EstadisticasCards } from '@/components/migracion/EstadisticasCards';
import { HistorialMigraciones } from '@/components/migracion/HistorialMigraciones';
import { estadisticasMock, historialMock } from '@/data/migracionData';

const Migraciones = () => {
  const navigate = useNavigate();

  const handleNuevaCarga = () => {
    navigate('/migraciones/nueva');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Migración Masiva</h1>
          <p className="text-muted-foreground">
            Sistema de carga masiva de servicios desde archivos externos
          </p>
        </div>
        <Button onClick={handleNuevaCarga} className="bg-primary hover:bg-primary-dark">
          <FileUp className="h-4 w-4 mr-2" />
          Nueva Carga Masiva
        </Button>
      </div>

      {/* Estadísticas */}
      <EstadisticasCards estadisticas={estadisticasMock} />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historial */}
        <div className="lg:col-span-2">
          <HistorialMigraciones historial={historialMock} />
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Enlaces rápidos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enlaces Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Descargar template
                  const headers = [
                    'fecha_servicio',
                    'marca_vehiculo', 
                    'modelo_vehiculo',
                    'patente',
                    'ubicacion_origen',
                    'ubicacion_destino',
                    'cliente_nombre',
                    'cliente_rut',
                    'grua_patente',
                    'operador_nombre',
                    'tipo_servicio',
                    'valor_servicio',
                    'observaciones'
                  ];

                  const csvContent = headers.join(',') + '\n' +
                    '2025-06-15,Toyota,Corolla,ABCD12,"Av. Providencia 123","Av. Las Condes 456","Empresa Transporte A",76123456-7,EFGH34,"Juan Pérez","Remolque Completo",50000,"Servicio de ejemplo"';

                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'template_servicios_sgg.csv';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Template
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentación
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Soporte Técnico
              </Button>
            </CardContent>
          </Card>

          {/* Información importante */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-400">Información Importante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Formato requerido: Excel (.xlsx) o CSV</p>
              <p>• Tamaño máximo: 10MB por archivo</p>
              <p>• Campos obligatorios: 11 campos mínimos</p>
              <p>• Validación automática de datos</p>
              <p>• Backup automático antes de migrar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Migraciones;
