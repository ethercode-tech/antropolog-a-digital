import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, User, MapPin, GraduationCap, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProfesionales, TipoProfesional, EstadoMatricula } from "@/data/profesionalesData";

const tipoLabels: Record<TipoProfesional, string> = {
  licenciado: "Licenciado/a",
  tecnico: "Técnico/a",
  otro: "Otro"
};

const estadoLabels: Record<EstadoMatricula, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_revision: "En Revisión",
  suspendido: "Suspendido"
};

const estadoColors: Record<EstadoMatricula, string> = {
  activo: "bg-green-100 text-green-800",
  inactivo: "bg-gray-100 text-gray-800",
  en_revision: "bg-yellow-100 text-yellow-800",
  suspendido: "bg-red-100 text-red-800"
};

export default function Matriculados() {
  const [searchName, setSearchName] = useState("");
  const [searchEspecialidad, setSearchEspecialidad] = useState("");
  const [searchLugar, setSearchLugar] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  const filteredProfesionales = useMemo(() => {
    return mockProfesionales.filter(p => {
      const matchName = p.nombre.toLowerCase().includes(searchName.toLowerCase());
      const matchEspecialidad = p.especialidad.toLowerCase().includes(searchEspecialidad.toLowerCase());
      const matchLugar = p.lugarTrabajo.toLowerCase().includes(searchLugar.toLowerCase());
      const matchTipo = filterTipo === "todos" || p.tipo === filterTipo;
      return matchName && matchEspecialidad && matchLugar && matchTipo;
    });
  }, [searchName, searchEspecialidad, searchLugar, filterTipo]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Profesionales Matriculados</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Consulta el listado de profesionales matriculados en el Colegio de Antropología
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Especialidad..."
                value={searchEspecialidad}
                onChange={(e) => setSearchEspecialidad(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Lugar de trabajo..."
                value={searchLugar}
                onChange={(e) => setSearchLugar(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="licenciado">Licenciados</SelectItem>
                <SelectItem value="tecnico">Técnicos</SelectItem>
                <SelectItem value="otro">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 md:py-16">
        <div className="container-main">
          <p className="text-muted-foreground mb-6">
            Mostrando {filteredProfesionales.length} profesional(es)
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfesionales.map((profesional, index) => (
              <Card 
                key={profesional.id} 
                className="card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-foreground truncate">
                        {profesional.nombre}
                      </h3>
                      <p className="text-sm text-primary font-medium">
                        {profesional.matricula}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {profesional.especialidad}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profesional.lugarTrabajo}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {tipoLabels[profesional.tipo]}
                      </Badge>
                      <Badge className={`text-xs ${estadoColors[profesional.estadoMatricula]}`}>
                        {estadoLabels[profesional.estadoMatricula]}
                      </Badge>
                    </div>
                  </div>

                  <Link to={`/matriculados/${profesional.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Ver perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProfesionales.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron profesionales con los criterios de búsqueda</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
