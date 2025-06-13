
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare } from 'lucide-react';

interface EquipmentVerificationProps {
  equipmentVerification: Record<string, boolean>;
  onEquipmentToggle: (item: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const EQUIPAMIENTO_VEHICULO = [
  'Radio',
  'Espejo retrovisor',
  'Cenicero',
  'Encendedor',
  'Alfombras',
  'Tapasoles',
  'Guantera',
  'Consola central',
  'Aire acondicionado',
  'Calefacción',
  'Antena',
  'Espejos laterales',
  'Emblemas',
  'Molduras',
  'Parachoques',
  'Rejilla',
  'Tapacubos',
  'Llantas',
  'Faros delanteros',
  'Faros traseros',
  'Luces direccionales',
  'Luz de placa',
  'Luces de freno',
  'Luz de reversa',
  'Cinturones de seguridad',
  'Extintor',
  'Triángulos',
  'Botiquín',
  'Llanta de repuesto',
  'Gato',
  'Llave de ruedas',
  'Manual de usuario',
  'Tarjeta de propiedad',
  'Revisión técnica',
  'Seguro',
  'Llaves de contacto',
  'Control de alarma',
  'Estuche de llaves',
  'Tapa de combustible'
];

export function EquipmentVerification({
  equipmentVerification,
  onEquipmentToggle,
  onSelectAll,
  onDeselectAll
}: EquipmentVerificationProps) {
  return (
    <Card className="bg-black border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Verificación de Equipamiento ({Object.values(equipmentVerification).filter(Boolean).length}/{EQUIPAMIENTO_VEHICULO.length})
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={onSelectAll}
            variant="outline"
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            ✓ Seleccionar Todo
          </Button>
          <Button
            onClick={onDeselectAll}
            variant="outline"
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            ✗ Deseleccionar Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {EQUIPAMIENTO_VEHICULO.map(item => (
            <div key={item} className="flex items-center space-x-2 p-2 rounded border border-primary/20 hover:bg-primary/5">
              <input
                type="checkbox"
                id={`equipment-${item}`}
                checked={equipmentVerification[item] || false}
                onChange={() => onEquipmentToggle(item)}
                className="border-primary"
              />
              <label
                htmlFor={`equipment-${item}`}
                className="text-sm text-primary cursor-pointer flex-1"
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
