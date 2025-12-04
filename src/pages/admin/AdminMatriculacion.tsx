import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock, CheckCircle, AlertCircle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMatriculacionSolicitudes, EstadoSolicitud } from "@/data/profesionalesData";

const estadoLabels: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  observado: "Observado",
  aprobado: "Aprobado",
  rechazado: "Rechazado"
};

const estadoColors: Record<EstadoSolicitud, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  observado: "bg-orange-100 text-orange-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800"
};

const estadoIcons: Record<EstadoSolicitud, React.ReactNode> = {
  pendiente: <Clock className="w-4 h-4" />,
  en_revision: <Clock className="w-4 h-4" />,
  observado: <AlertCircle className="w-4 h-4" />,
  aprobado: <CheckCircle className="w-4 h-4" />,
  rechazado: <XCircle className="w-4 h-4" />
};

export default function AdminMatriculacion() {
  const [solicitudes] = useState(mockMatriculacionSolicitudes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");

  const filteredSolicitudes = solicitudes.filter(s => {
    const matchSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.dni.includes(searchTerm);
    const matchEstado = filterEstado === "todos" || s.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const countByStatus = (status: EstadoSolicitud) => 
    solicitudes.filter(s => s.estado === status).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Solicitudes de Matriculación
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las solicitudes de alta de matrícula profesional
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{countByStatus("pendiente")}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{countByStatus("en_revision")}</p>
            <p className="text-xs text-muted-foreground">En Revisión</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{countByStatus("observado")}</p>
            <p className="text-xs text-muted-foreground">Observados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{countByStatus("aprobado")}</p>
            <p className="text-xs text-muted-foreground">Aprobados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{countByStatus("rechazado")}</p>
            <p className="text-xs text-muted-foreground">Rechazados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_revision">En Revisión</SelectItem>
                <SelectItem value="observado">Observado</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Listado de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitudes.map((solicitud) => (
                  <TableRow key={solicitud.id}>
                    <TableCell className="font-medium">{solicitud.nombre}</TableCell>
                    <TableCell>{solicitud.dni}</TableCell>
                    <TableCell>{solicitud.especialidad}</TableCell>
                    <TableCell>
                      {new Date(solicitud.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${estadoColors[solicitud.estado]} flex items-center gap-1 w-fit`}>
                        {estadoIcons[solicitud.estado]}
                        {estadoLabels[solicitud.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/matriculacion/${solicitud.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredSolicitudes.map((solicitud) => (
              <div key={solicitud.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{solicitud.nombre}</p>
                    <p className="text-sm text-muted-foreground">DNI: {solicitud.dni}</p>
                  </div>
                  <Badge className={`${estadoColors[solicitud.estado]} flex items-center gap-1`}>
                    {estadoIcons[solicitud.estado]}
                    {estadoLabels[solicitud.estado]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {solicitud.especialidad} • {new Date(solicitud.createdAt).toLocaleDateString('es-ES')}
                </p>
                <Link to={`/admin/matriculacion/${solicitud.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalle
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {filteredSolicitudes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron solicitudes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
