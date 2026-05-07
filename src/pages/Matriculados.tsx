"use client";

import { useMemo, useState, useEffect } from "react";
import { Search, User, Briefcase, MapPin, Clipboard, X, Loader2 } from "lucide-react";
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
import { getProfesionales, ProfesionalPublico } from "@/lib/dataAdapter";

import {
  getTipoBadgeVariant,
  getTipoProfesionalLabel,
  getEstadoMatriculaLabel,
} from "@/lib/types/profesionales";
import { getDeudaUI } from "@/lib/utils/profesionales-ui";
type TipoProfesional = "licenciado" | "tecnico_otro" | "doctor" | "todos";

function getEstadoUI(
  estado: string,
  tieneDeuda: boolean
) {
  const estadoNormalizado = estado.toLowerCase();

  if (estadoNormalizado === "activa") {
    return {
      label: "Activa",
      variant: "default" as const,
      deuda: tieneDeuda,
    };
  }

  if (estadoNormalizado === "suspendida") {
    return {
      label: "Suspendido",
      variant: "destructive" as const,
      deuda: false,
    };
  }

  if (estadoNormalizado === "inactiva") {
    return {
      label: "Inactiva",
      variant: "outline" as const,
      deuda: false,
    };
  }

  return {
    label: "En revisión",
    variant: "secondary" as const,
    deuda: false,
  };
}

export default function MatriculadosPage() {
  const [profesionales, setProfesionales] = useState<ProfesionalPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [searchNombre, setSearchNombre] = useState("");
  const [searchEspecialidad, setSearchEspecialidad] = useState("");
  const [searchLugar, setSearchLugar] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoProfesional>("todos");
  const [selected, setSelected] = useState<ProfesionalPublico | null>(null);

  useEffect(() => {
    getProfesionales().then((data) => {
      setProfesionales(data);
      setLoading(false);
    });
  }, []);

  const profesionalesFiltrados = useMemo(() => {
    return profesionales.filter((p) => {
      const matchTipo =
        tipoFilter === "todos" ? true : p.tipo === tipoFilter;

      const matchNombre = p.nombre
        .toLowerCase()
        .includes(searchNombre.toLowerCase());

      const matchEspecialidad = p.especialidad
        .toLowerCase()
        .includes(searchEspecialidad.toLowerCase());

      const matchLugar = (p.lugarTrabajo || "")
        .toLowerCase()
        .includes(searchLugar.toLowerCase());

      return matchTipo && matchNombre && matchEspecialidad && matchLugar;
    });
  }, [profesionales, tipoFilter, searchNombre, searchEspecialidad, searchLugar]);

  const handleCopy = async (profesional: ProfesionalPublico) => {
    const lines = [
      `Nombre: ${profesional.nombre}`,
      `Matrícula: ${profesional.matricula}`,
      ` ${getTipoProfesionalLabel(profesional.tipo)}`,
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
                  variant={
                    tipoFilter === "tecnico_otro" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setTipoFilter("tecnico_otro")}
                >
                  Técnico / Otro
                </Button>
                <Button
                  type="button"
                  variant={tipoFilter === "licenciado" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipoFilter("licenciado")}
                >
                  Licenciados
                </Button>
                <Button
                  type="button"
                  variant={tipoFilter === "doctor" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipoFilter("doctor")}
                >
                  Doctor
                </Button>
                <Button
                  type="button"
                  variant={tipoFilter === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipoFilter("todos")}
                >
                  Todos
                </Button>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Cargando profesionales...</p>
            </div>
          )}

          {/* Results summary */}
          {!loading && (
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-muted-foreground">
                Se encontraron{" "}
                <span className="font-semibold">
                  {profesionalesFiltrados.length}
                </span>{" "}
                profesionales según los filtros aplicados.
              </p>
            </div>
          )}

          {/* List */}
          {!loading && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {profesionalesFiltrados.map((profesional) => {

                const estadoUI = getEstadoUI(
                  profesional.estadoMatricula,
                  profesional.tieneDeuda
                );
                console.log(estadoUI)

                const deudaUI = getDeudaUI(profesional.tieneDeuda);
                return (
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

                        {/* <Badge variant={getTipoBadgeVariant(profesional.tipo)}>
                          {getTipoProfesionalLabel(profesional.tipo)}
                        </Badge> */}
                        <Badge variant={estadoUI.variant}>
                          {estadoUI.label}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span>{profesional.especialidad}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>
                            {profesional.lugarTrabajo || "No especificado"}
                          </span>
                        </div>
                      </div>


                      {/* Estado + deuda */}
                      {/* 
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
                          */}
                      <div className="flex items-center gap-2 flex-wrap pt-1">

                        <span
                          className={`inline-flex items-center gap-1 text-xs ${deudaUI.className}`}
                        >
                          <deudaUI.Icon className="w-3 h-3" />
                          {deudaUI.label}
                        </span>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="w-full"
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
                );
              })}

              {profesionalesFiltrados.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-8">
                  No se encontraron profesionales con los filtros actuales.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal de detalle */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (() => {
            const deudaUI = getDeudaUI(selected.tieneDeuda);
            const estadoUI = getEstadoUI(
              selected.estadoMatricula,
              selected.tieneDeuda
            );

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between gap-3">
                    <span>{selected.nombre}</span>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={estadoUI.variant}>
                        {estadoUI.label}
                      </Badge>

                      <div
                        className={`inline-flex items-center gap-1 text-xs ${deudaUI.className}`}
                      >
                        <deudaUI.Icon className="w-3 h-3" />
                        {deudaUI.label}
                      </div>
                    </div>
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
                      {getTipoProfesionalLabel(selected.tipo)}
                    </p>
                    <p>
                      <span className="font-semibold">Especialidad: </span>
                      {selected.especialidad}
                    </p>
                    <p>
                      <span className="font-semibold">Lugar de trabajo: </span>
                      {selected.lugarTrabajo || "No especificado"}
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
            );
          })()}


        </DialogContent>
      </Dialog>
    </div>
  );
}
