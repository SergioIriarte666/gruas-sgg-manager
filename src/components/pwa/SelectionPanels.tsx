
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
import { useToast } from '@/hooks/use-toast';

interface SelectionPanelsProps {
  showGruaSelection: boolean;
  showOperadorSelection: boolean;
  showTipoServicioSelection: boolean;
  onGruaSelect: (id: string) => void;
  onOperadorSelect: (id: string) => void;
  onTipoServicioSelect: (id: string) => void;
  onShowGruaSelection: (show: boolean) => void;
  onShowOperadorSelection: (show: boolean) => void;
  onShowTipoServicioSelection: (show: boolean) => void;
}

export function SelectionPanels({
  showGruaSelection,
  showOperadorSelection,
  showTipoServicioSelection,
  onGruaSelect,
  onOperadorSelect,
  onTipoServicioSelect,
  onShowGruaSelection,
  onShowOperadorSelection,
  onShowTipoServicioSelection
}: SelectionPanelsProps) {
  const { toast } = useToast();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();

  const handleGruaSelect = (gruaId: string) => {
    onGruaSelect(gruaId);
    onShowGruaSelection(false);
    toast({
      title: "Grúa seleccionada",
      description: "Grúa asignada correctamente"
    });
  };

  const handleOperadorSelect = (operadorId: string) => {
    onOperadorSelect(operadorId);
    onShowOperadorSelection(false);
    toast({
      title: "Operador seleccionado",
      description: "Operador asignado correctamente"
    });
  };

  const handleTipoServicioSelect = (tipoId: string) => {
    onTipoServicioSelect(tipoId);
    onShowTipoServicioSelection(false);
    toast({
      title: "Tipo de servicio seleccionado",
      description: "Tipo de servicio asignado correctamente"
    });
  };

  return (
    <div className="space-y-4">
      {/* Grúas Selection Panel */}
      {showGruaSelection && (
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-sm flex items-center justify-between">
              <span>Seleccionar Grúa</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowGruaSelection(false)}
                className="text-primary border-primary/30"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {gruas.filter(grua => grua.activo).map((grua) => (
              <Button
                key={grua.id}
                onClick={() => handleGruaSelect(grua.id)}
                variant="outline"
                className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
              >
                <div className="text-sm">
                  <div className="font-medium">{grua.patente}</div>
                  <div className="text-primary/70">{grua.marca} {grua.modelo} ({grua.tipo})</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Operadores Selection Panel */}
      {showOperadorSelection && (
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-sm flex items-center justify-between">
              <span>Seleccionar Operador</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowOperadorSelection(false)}
                className="text-primary border-primary/30"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {operadores.filter(operador => operador.activo).map((operador) => (
              <Button
                key={operador.id}
                onClick={() => handleOperadorSelect(operador.id)}
                variant="outline"
                className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
              >
                <div className="text-sm">
                  <div className="font-medium">{operador.nombreCompleto}</div>
                  <div className="text-primary/70">{operador.rut}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tipos de Servicio Selection Panel */}
      {showTipoServicioSelection && (
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-sm flex items-center justify-between">
              <span>Seleccionar Tipo de Servicio</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShowTipoServicioSelection(false)}
                className="text-primary border-primary/30"
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {tiposServicio.filter(tipo => tipo.activo).map((tipo) => (
              <Button
                key={tipo.id}
                onClick={() => handleTipoServicioSelect(tipo.id)}
                variant="outline"
                className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
              >
                <div className="text-sm">
                  <div className="font-medium">{tipo.nombre}</div>
                  {tipo.descripcion && (
                    <div className="text-primary/70 text-xs">{tipo.descripcion}</div>
                  )}
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Info Panel when no selection is active */}
      {!showGruaSelection && !showOperadorSelection && !showTipoServicioSelection && (
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Información</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary/70 text-sm">
              Selecciona los botones en "Asignación del Servicio" para elegir grúa, operador y tipo de servicio.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
