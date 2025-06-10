
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Search, Edit, Trash2 } from "lucide-react";
import { mockClientes } from "@/lib/mockData";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const clientesFiltrados = mockClientes.filter(cliente =>
    cliente.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Clientes</h1>
          <p className="text-muted-foreground">Gestión de clientes del sistema</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
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
                placeholder="Buscar por razón social, RUT o email..."
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

      {/* Tabla de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({clientesFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Razón Social</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">RUT</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Contacto</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Dirección</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{cliente.razonSocial}</div>
                    </td>
                    <td className="p-3 font-mono text-sm">{cliente.rut}</td>
                    <td className="p-3">
                      <div>
                        <div className="text-sm">{cliente.telefono}</div>
                        <div className="text-sm text-muted-foreground">{cliente.email}</div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{cliente.direccion}</td>
                    <td className="p-3">
                      <Badge 
                        variant={cliente.activo ? "default" : "secondary"}
                        className={cliente.activo ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
                      >
                        {cliente.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2 text-red-400 hover:text-red-300">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {clientesFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron clientes que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClientes.length}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClientes.filter(c => c.activo).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-500/30 bg-gray-500/5">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Clientes Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockClientes.filter(c => !c.activo).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
