
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Users, Settings, X } from 'lucide-react';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';

interface ServiceAssignmentProps {
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
  onGruaSelect: (id: string) => void;
  onOperadorSelect: (id: string) => void;
  onTipoServicioSelect: (id: string) => void;
  onClearSelection: (field: 'gruaId' | 'operadorId' | 'tipoServicioId') => void;
}

export function ServiceAssignment({
  gruaId,
  operadorId,
  tipoServicioId,
  onGruaSelect,
  onOperadorSelect,
  onTipoServicioSelect,
  onClearSelection
}: ServiceAssignmentProps) {
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();

  const selectedGrua = gruas.find(g => g.id === gruaId);
  const selectedOperador = operadores.find(o => o.id === operadorId);
  const selectedTipoServicio = tiposServicio.find(t => t.id === tipoServicioId);

  return (
    <Card className="bg-black border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Asignación del Servicio</CardTitle>
        <p className="text-primary/70 text-sm">
          Selecciona los recursos para el servicio (arrastra y suelta o selecciona)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grúa Selection */}
        <div className="space-y-2">
          <Label className="text-primary flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Grúa *
          </Label>
          {selectedGrua ? (
            <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="text-primary font-medium block">
                      {selectedGrua.patente}
                    </span>
                    <span className="text-primary/70 text-sm">
                      {selectedGrua.marca} {selectedGrua.modelo} ({selectedGrua.tipo})
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClearSelection('gruaId')}
                  className="text-primary border-primary/30 hover:bg-red-500/20 hover:border-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
            >
              <Select value={gruaId} onValueChange={onGruaSelect}>
                <SelectTrigger className="w-full border-none bg-transparent text-primary">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <SelectValue placeholder="Seleccionar Grúa" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30 z-50">
                  {gruas.filter(grua => grua.activo).map((grua) => (
                    <SelectItem key={grua.id} value={grua.id} className="text-primary hover:bg-primary/10">
                      {grua.patente} - {grua.marca} {grua.modelo} ({grua.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Operador Selection */}
        <div className="space-y-2">
          <Label className="text-primary flex items-center gap-2">
            <Users className="h-4 w-4" />
            Operador *
          </Label>
          {selectedOperador ? (
            <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <span className="text-primary font-medium block">
                      {selectedOperador.nombreCompleto}
                    </span>
                    <span className="text-primary/70 text-sm">
                      {selectedOperador.rut}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClearSelection('operadorId')}
                  className="text-primary border-primary/30 hover:bg-red-500/20 hover:border-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
            >
              <Select value={operadorId} onValueChange={onOperadorSelect}>
                <SelectTrigger className="w-full border-none bg-transparent text-primary">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <SelectValue placeholder="Seleccionar Operador" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30 z-50">
                  {operadores.filter(operador => operador.activo).map((operador) => (
                    <SelectItem key={operador.id} value={operador.id} className="text-primary hover:bg-primary/10">
                      {operador.nombreCompleto} - {operador.rut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Tipo de Servicio Selection */}
        <div className="space-y-2">
          <Label className="text-primary flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Tipo de Servicio
          </Label>
          {selectedTipoServicio ? (
            <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-green-500" />
                  <span className="text-primary font-medium">
                    {selectedTipoServicio.nombre}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onClearSelection('tipoServicioId')}
                  className="text-primary border-primary/30 hover:bg-red-500/20 hover:border-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10"
            >
              <Select value={tipoServicioId} onValueChange={onTipoServicioSelect}>
                <SelectTrigger className="w-full border-none bg-transparent text-primary">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <SelectValue placeholder="Seleccionar Tipo de Servicio" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30 z-50">
                  {tiposServicio.filter(tipo => tipo.activo).map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id} className="text-primary hover:bg-primary/10">
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
