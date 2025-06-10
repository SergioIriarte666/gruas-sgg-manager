import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Wrench, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useTiposServicio, useDeleteTipoServicio } from "@/hooks/useTiposServicio";
import { FormularioTipoServicio } from "@/components/FormularioTipoServicio";
import { TipoServicio } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function TiposServicio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoServicio | undefined>();
  const [alertaEliminar, setAlertaEliminar] = useState<string | null>(null);
  
  const { data: tiposServicio = [], isLoading, error } = useTiposServicio();
  const deleteMutation = useDeleteTipoServicio();
  
  const tiposFiltrados = tiposServicio.filter(tipo =>
    tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando tipos de servicio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar tipos de servicio: {error.message}
      </div>
    );
  }

  const handleNuevoTipo = () => {
    setTipoSeleccionado(undefined);
    setModalAbierto(true);
  };

  const handleEditarTipo = (tipo: TipoServicio) => {
    setTipoSeleccionado(tipo);
    setModalAbierto(true);
  };

  const handleEliminarTipo = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Tipo de servicio desactivado exitosamente");
      setAlertaEliminar(null);
    } catch (error) {
      toast.error("Error al desactivar el tipo de servicio");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Tipos de Servicio</h1>
          <p className="text-muted-foreground">Gestión de categorías de servicios</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleNuevoTipo}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Tipo
        </Button>
      </div>

      {/* Filtros */}
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
                placeholder="Buscar por nombre o descripción..."
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

      {/* Tabla de Tipos de Servicio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Lista de Tipos de Servicio ({tiposFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Descripción</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiposFiltrados.map((tipo) => (
                  <tr key={tipo.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-primary">{tipo.nombre}</div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {tipo.descripcion}
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={tipo.activo ? "default" : "secondary"}
                        className={tipo.activo ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
                      >
                        {tipo.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => handleEditarTipo(tipo)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-red-400 hover:text-red-300"
                          onClick={() => setAlertaEliminar(tipo.id)}
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
          
          {tiposFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron tipos de servicio que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid de Tipos de Servicio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiposFiltrados.map((tipo) => (
          <Card key={tipo.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-primary">{tipo.nombre}</CardTitle>
                <Badge 
                  variant={tipo.activo ? "default" : "secondary"}
                  className={tipo.activo ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
                >
                  {tipo.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {tipo.descripcion}
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEditarTipo(tipo)}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-400 hover:text-red-300"
                  onClick={() => setAlertaEliminar(tipo.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Tipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiposServicio.length}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Tipos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tiposServicio.filter(t => t.activo).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-500/30 bg-gray-500/5">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Tipos Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tiposServicio.filter(t => !t.activo).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {tipoSeleccionado ? "Editar Tipo de Servicio" : "Crear Nuevo Tipo de Servicio"}
            </DialogTitle>
          </DialogHeader>
          <FormularioTipoServicio
            tipoServicio={tipoSeleccionado}
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
              Esta acción desactivará el tipo de servicio. No podrá ser utilizado en nuevos servicios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alertaEliminar && handleEliminarTipo(alertaEliminar)}
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
