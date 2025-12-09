"use client";

import { useMemo, useState,useEffect } from "react";
import { Search, User, Briefcase, MapPin, Clipboard, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { getProfesionales } from "@/lib/dataAdapter";

type TipoProfesional = "Licenciado" | "Técnico / Otro";

type Profesional = {
  id: string;
  nombre: string;
  matricula: string;
  tipo: TipoProfesional;
  especialidad: string;
  lugarTrabajo: string;
  estadoMatricula: "Activa" | "Inactiva" | "En revisión";
  email?: string;
  telefono?: string;
  cvPdfUrl?: string;
};
// Mock de PROFESIONALES COMENTADO 
// const MOCK_PROFESIONALES: Profesional[] = [
//   {
//     id: "1",
//     nombre: "María López",
//     matricula: "ANT-00123",
//     tipo: "Licenciado",
//     especialidad: "Antropología Social",
//     lugarTrabajo: "San Salvador de Jujuy",
//     estadoMatricula: "Activa",
//     email: "maria.lopez@example.com",
//     telefono: "+54 9 388 555 0101",
//     cvPdfUrl: "https://ejemplo.com/cv/maria-lopez.pdf",
//   },
//   {
//     id: "2",
//     nombre: "Juan Pérez",
//     matricula: "ANT-00124",
//     tipo: "Técnico / Otro",
//     especialidad: "Gestión Cultural",
//     lugarTrabajo: "Palpalá",
//     estadoMatricula: "En revisión",
//     email: "juan.perez@example.com",
//   },
//   // TODO: reemplazar MOCK_PROFESIONALES por datos reales desde la base de datos
// ];

export default function MatriculadosPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const { toast } = useToast();

  const [searchNombre, setSearchNombre] = useState("");
  const [searchEspecialidad, setSearchEspecialidad] = useState("");
  const [searchLugar, setSearchLugar] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoProfesional | "Todos">(
    "Licenciado"
  );
  const [selected, setSelected] = useState<Profesional | null>(null);


  useEffect(() => {
    getProfesionales().then((profesionales) => {
      setProfesionales(profesionales);
    });
  }, []);

  const profesionalesFiltrados = useMemo(() => {
    return profesionales.filter((p) => {
      const matchTipo =
        tipoFilter === "Todos" ? true : p.tipo === tipoFilter;

      const matchNombre = p.nombre
        .toLowerCase()
        .includes(searchNombre.toLowerCase());

      const matchEspecialidad = p.especialidad
        .toLowerCase()
        .includes(searchEspecialidad.toLowerCase());

      const matchLugar = p.lugarTrabajo
        .toLowerCase()
        .includes(searchLugar.toLowerCase());

      return matchTipo && matchNombre && matchEspecialidad && matchLugar;
    });
  }, [profesionales, tipoFilter, searchNombre, searchEspecialidad, searchLugar]);

  const handleCopy = async (profesional: Profesional) => {
    const lines = [
      `Nombre: ${profesional.nombre}`,
      `Matrícula: ${profesional.matricula}`,
      `Tipo: ${profesional.tipo}`,
      `Estado de matrícula: ${profesional.estadoMatricula}`,
      `Especialidad: ${profesional.especialidad}`,
      `Lugar de trabajo: ${profesional.lugarTrabajo}`,
      profesional.email ? `Correo: ${profesional.email}` : "",
      profesional.telefono ? `Teléfono: ${profesional.telefono}` : "",
      profesional.cvPdfUrl ? `CV: ${profesional.cvPdfUrl}` : "",
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast({
        title: "Datos copiados",
        description: "La información del profesional se copió al portapapeles.",
      });
    } catch {
      toast({
        title: "No se pudo copiar",
        description: "Ocurrió un problema al copiar los datos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Profesionales matriculados</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Consultá el padrón público de profesionales matriculados, filtrá por
            nombre, especialidad o lugar de trabajo y accedé al perfil básico
            de cada uno.
          </p>
        </div>
      </section>

      {/* Filters + List */}
      <section className="py-16 md:py-24">
        <div className="container-main space-y-10">
          {/* Filters */}
          <div className="grid gap-4 lg:grid-cols-[1.2fr,1.2fr,1.2fr,auto] items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar por nombre
              </label>
              <Input
                placeholder="Ejemplo: María, Juan…"
                value={searchNombre}
                onChange={(e) => setSearchNombre(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Especialidad
              </label>
              <Input
                placeholder="Antropología social, forense…"
                value={searchEspecialidad}
                onChange={(e) => setSearchEspecialidad(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Lugar de trabajo
              </label>
              <Input
                placeholder="Ciudad, institución, región…"
                value={searchLugar}
                onChange={(e) => setSearchLugar(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tipo
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={tipoFilter === "Licenciado" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipoFilter("Licenciado")}
                >
                  Licenciados
                </Button>
                <Button
                  type="button"
                  variant={
                    tipoFilter === "Técnico / Otro" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTipoFilter("Técnico / Otro")}
                >
                  Otros
                </Button>
                <Button
                  type="button"
                  variant={tipoFilter === "Todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipoFilter("Todos")}
                >
                  Todos
                </Button>
              </div>
            </div>
          </div>

          {/* Results summary */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-muted-foreground">
              Se encontraron{" "}
              <span className="font-semibold">
                {profesionalesFiltrados.length}
              </span>{" "}
              profesionales según los filtros aplicados.
            </p>
          </div>

          {/* List */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {profesionalesFiltrados.map((profesional) => (
              <Card
                key={profesional.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelected(profesional)}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold text-foreground">
                          {profesional.nombre}
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Matrícula{" "}
                        <span className="font-medium">
                          {profesional.matricula}
                        </span>
                      </p>
                    </div>
                    <Badge
                      variant={
                        profesional.estadoMatricula === "Activa"
                          ? "default"
                          : profesional.estadoMatricula === "En revisión"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {profesional.estadoMatricula}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      <span>{profesional.especialidad}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{profesional.lugarTrabajo}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      {profesional.tipo}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(profesional);
                      }}
                    >
                      Ver perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {profesionalesFiltrados.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No se encontraron profesionales con los filtros actuales.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Modal de detalle */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-3">
                  <span>{selected.nombre}</span>
                  <Badge
                    variant={
                      selected.estadoMatricula === "Activa"
                        ? "default"
                        : selected.estadoMatricula === "En revisión"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {selected.estadoMatricula}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Ficha pública del profesional matriculado.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Matrícula: </span>
                    {selected.matricula}
                  </p>
                  <p>
                    <span className="font-semibold">Tipo: </span>
                    {selected.tipo}
                  </p>
                  <p>
                    <span className="font-semibold">Especialidad: </span>
                    {selected.especialidad}
                  </p>
                  <p>
                    <span className="font-semibold">Lugar de trabajo: </span>
                    {selected.lugarTrabajo}
                  </p>
                  {selected.email && (
                    <p>
                      <span className="font-semibold">Correo: </span>
                      {selected.email}
                    </p>
                  )}
                  {selected.telefono && (
                    <p>
                      <span className="font-semibold">Teléfono: </span>
                      {selected.telefono}
                    </p>
                  )}
                  {selected.cvPdfUrl && (
                    <p>
                      <span className="font-semibold">CV: </span>
                      <a
                        href={selected.cvPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Ver CV en PDF
                      </a>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopy(selected)}
                  >
                    <Clipboard className="w-4 h-4 mr-2" />
                    Copiar datos
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => setSelected(null)}
                  >
                    <X className="w-4 h-4" />
                    Cerrar
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
