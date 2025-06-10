import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Truck, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useGruas, useDeleteGrua } from "@/hooks/useGruas";
import { FormularioGrua } from "@/components/FormularioGrua";
import { Grua } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function Gruas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [gruaSeleccionada, setGruaSeleccionada] = useState<Grua | undefined>();
  const [alertaEliminar, setAlertaEliminar] = useState<string | null>(null);
  
  const { data: gruas = [], isLoading, error } = useGruas();
  const deleteMutation = useDeleteGrua();
  
  const gruasFiltradas = gruas.filter(grua =>
    grua.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grua.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grua.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grua.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorByTipo = (tipo: string) => {
    switch (tipo) {
      case 'Liviana':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Mediana':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Pesada':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando grúas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar grúas: {error.message}
      </div>
    );
  }

  const handleNuevaGrua = () => {
    setGruaSeleccionada(undefined);
    setModalAbierto(true);
  };

  const handleEditarGrua = (grua: Grua) => {
    setGruaSeleccionada(grua);
    setModalAbierto(true);
  };

  const handleEliminarGrua = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Grúa desactivada exitosamente");
      setAlertaEliminar(null);
    } catch (error) {
      toast.error("Error al desactivar la grúa");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Grúas</h1>
          <p className="text-muted-foreground">Gestión de flota de grúas</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleNuevaGrua}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Grúa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda y Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por patente, marca, modelo o tipo..."
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Lista de Grúas ({gruasFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Patente</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Marca</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Modelo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {gruasFiltradas.map((grua) => (
                  <tr key={grua.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium font-mono text-primary">{grua.patente}</div>
                    </td>
                    <td className="p-3 font-medium">{grua.marca}</td>
                    <td className="p-3">{grua.modelo}</td>
                    <td className="p-3">
                      <Badge 
                        variant="outline"
                        className={getColorByTipo(grua.tipo)}
                      >
                        {grua.tipo}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={grua.activo ? "default" : "secondary"}
                        className={grua.activo ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
                      >
                        {grua.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => handleEditarGrua(grua)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-red-400 hover:text-red-300"
                          onClick={() => setAlertaEliminar(grua.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {gruasFiltradas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron grúas que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Grúas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gruas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Livianas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gruas.filter(g => g.tipo === 'Liviana').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm">Medianas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gruas.filter(g => g.tipo === 'Mediana').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm">Pesadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gruas.filter(g => g.tipo === 'Pesada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {gruaSeleccionada ? "Editar Grúa" : "Crear Nueva Grúa"}
            </DialogTitle>
          </DialogHeader>
          <FormularioGrua
            grua={gruaSeleccionada}
            onSuccess={() => setModalAbierto(false)}
            onCancel={() => setModalAbierto(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!alertaEliminar} onOpenChange={() => setAlertaEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará la grúa. No podrá ser utilizada en nuevos servicios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alertaEliminar && handleEliminarGrua(alertaEliminar)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
