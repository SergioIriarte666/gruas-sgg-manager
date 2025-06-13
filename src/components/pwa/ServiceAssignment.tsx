
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Truck, Users, Settings } from 'lucide-react';
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
          Selecciona los recursos para el servicio
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Grúa Selection */}
          <div>
            <Label className="text-primary">Grúa *</Label>
            {selectedGrua ? (
              <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {selectedGrua.patente} - {selectedGrua.marca} {selectedGrua.modelo} ({selectedGrua.tipo})
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onClearSelection('gruaId')}
                    className="text-primary border-primary/30 hover:bg-red-500/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={gruaId} onValueChange={onGruaSelect}>
                <SelectTrigger className="w-full border-2 border-dashed border-primary/30 text-primary bg-black">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Seleccionar Grúa" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  {gruas.filter(grua => grua.activo).map((grua) => (
                    <SelectItem key={grua.id} value={grua.id} className="text-primary hover:bg-primary/10">
                      {grua.patente} - {grua.marca} {grua.modelo} ({grua.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Operador Selection */}
          <div>
            <Label className="text-primary">Operador *</Label>
            {selectedOperador ? (
              <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {selectedOperador.nombreCompleto} - {selectedOperador.rut}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onClearSelection('operadorId')}
                    className="text-primary border-primary/30 hover:bg-red-500/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={operadorId} onValueChange={onOperadorSelect}>
                <SelectTrigger className="w-full border-2 border-dashed border-primary/30 text-primary bg-black">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Seleccionar Operador" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  {operadores.filter(operador => operador.activo).map((operador) => (
                    <SelectItem key={operador.id} value={operador.id} className="text-primary hover:bg-primary/10">
                      {operador.nombreCompleto} - {operador.rut}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tipo de Servicio Selection */}
          <div>
            <Label className="text-primary">Tipo de Servicio</Label>
            {selectedTipoServicio ? (
              <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {selectedTipoServicio.nombre}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onClearSelection('tipoServicioId')}
                    className="text-primary border-primary/30 hover:bg-red-500/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ) : (
              <Select value={tipoServicioId} onValueChange={onTipoServicioSelect}>
                <SelectTrigger className="w-full border-2 border-dashed border-primary/30 text-primary bg-black">
                  <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Seleccionar Tipo de Servicio" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-black border-primary/30">
                  {tiposServicio.filter(tipo => tipo.activo).map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id} className="text-primary hover:bg-primary/10">
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
