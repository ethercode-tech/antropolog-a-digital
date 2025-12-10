import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  User,
  Briefcase,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Pencil,
} from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import {
  Profesional,
  ProfesionalEstadoMatricula,
  ProfesionalTipo,
  getEstadoMatriculaLabel,
  getTipoProfesionalLabel,
} from "@/lib/types/profesionales";

type FormMode = "create" | "edit";

type ProfesionalFormState = Omit<
  Profesional,
  "id" | "fechaAlta" | "fechaActualizacion"
> & {
  solicitudMatriculacionId?: string | null;
};

// ───────────────────────────────
// Helpers para llamar al BFF admin
// ───────────────────────────────

async function getAdminToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log('session', session);
  if (!session) throw new Error("No hay sesión de administrador");
  return session.access_token;
}

async function fetchProfesionales(): Promise<Profesional[]> {
  const token = await getAdminToken();
  const URL = import.meta.env.VITE_API_BASE_URL ?? ""
  const res = await fetch(`${URL}/api/admin/profesionales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudieron cargar los profesionales");
  }

  const data = await res.json();
  // Aseguramos array aunque venga null/undefined
  return Array.isArray(data) ? data : [];
}

async function createProfesionalRequest(
  payload: ProfesionalFormState
): Promise<Profesional> {
  const token = await getAdminToken();

  const res = await fetch("/api/admin/profesionales", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || "No se pudo crear el profesional en la base de datos"
    );
  }

  return res.json();
}

async function updateProfesionalRequest(params: {
  id: string;
  data: ProfesionalFormState;
}): Promise<Profesional> {
  const token = await getAdminToken();

  const res = await fetch(`/api/admin/profesionales/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params.data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || "No se pudo actualizar el profesional en la base de datos"
    );
  }

  return res.json();
}

// ───────────────────────────────
// Page
// ───────────────────────────────

export default function AdminMatriculacion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Listado desde API (por ahora vendrá vacío y está bien)
  const {
    data: profesionales = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-profesionales"],
    queryFn: fetchProfesionales,
  });

  // Mutaciones
  const createProfesional = useMutation({
    mutationFn: createProfesionalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profesionales"] });
      toast({
        title: "Profesional creado",
        description:
          "El profesional se registró correctamente en el padrón interno.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al crear profesional",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar en la base de datos.",
        variant: "destructive",
      });
    },
  });

  const updateProfesional = useMutation({
    mutationFn: updateProfesionalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profesionales"] });
      toast({
        title: "Profesional actualizado",
        description: "Los datos del profesional fueron modificados.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al actualizar profesional",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar en la base de datos.",
        variant: "destructive",
      });
    },
  });

  // Filtros / formulario
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] =
    useState<ProfesionalEstadoMatricula | "todos">("todos");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ProfesionalFormState>({
    matricula: "",
    apellido: "",
    nombre: "",
    tipo: "licenciado",
    especialidadPrincipal: "",
    otrasEspecialidades: "",
    lugarTrabajo: "",
    institucion: "",
    localidad: "",
    provincia: "",
    email: "",
    telefono: "",
    estadoMatricula: "activa",
    habilitadoEjercer: true,
    tieneDeuda: false,
    ultimoPeriodoPago: "",
    cvPdfUrl: "",
    notasInternas: "",
    solicitudMatriculacionId: null,
  });

  const filteredProfesionales = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return profesionales.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(term) ||
        p.apellido.toLowerCase().includes(term) ||
        p.matricula.toLowerCase().includes(term);

      const matchEstado =
        estadoFilter === "todos" ? true : p.estadoMatricula === estadoFilter;

      return matchSearch && matchEstado;
    });
  }, [profesionales, searchTerm, estadoFilter]);

  const resetForm = () => {
    setFormState({
      matricula: "",
      apellido: "",
      nombre: "",
      tipo: "licenciado",
      especialidadPrincipal: "",
      otrasEspecialidades: "",
      lugarTrabajo: "",
      institucion: "",
      localidad: "",
      provincia: "",
      email: "",
      telefono: "",
      estadoMatricula: "activa",
      habilitadoEjercer: true,
      tieneDeuda: false,
      ultimoPeriodoPago: "",
      cvPdfUrl: "",
      notasInternas: "",
      solicitudMatriculacionId: null,
    });
    setEditingId(null);
    setFormMode("create");
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode("create");
    setDialogOpen(true);
  };

  const openEditDialog = (profesional: Profesional) => {
    const { id, fechaAlta, fechaActualizacion, ...rest } = profesional;
    setFormState({
      ...rest,
      ultimoPeriodoPago: rest.ultimoPeriodoPago ?? "",
      otrasEspecialidades: rest.otrasEspecialidades ?? "",
      institucion: rest.institucion ?? "",
      localidad: rest.localidad ?? "",
      provincia: rest.provincia ?? "",
      email: rest.email ?? "",
      telefono: rest.telefono ?? "",
      cvPdfUrl: rest.cvPdfUrl ?? "",
      notasInternas: rest.notasInternas ?? "",
    });
    setEditingId(id);
    setFormMode("edit");
    setDialogOpen(true);
  };

  const handleChange =
    (field: keyof ProfesionalFormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCheckboxChange =
    (field: keyof ProfesionalFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.matricula || !formState.apellido || !formState.nombre) {
      toast({
        title: "Campos obligatorios faltantes",
        description:
          "Matrícula, apellido y nombre son obligatorios para registrar un profesional.",
        variant: "destructive",
      });
      return;
    }

    const payload: ProfesionalFormState = {
      ...formState,
      ultimoPeriodoPago: formState.ultimoPeriodoPago || "",
      notasInternas: formState.notasInternas || "",
      otrasEspecialidades: formState.otrasEspecialidades || "",
      institucion: formState.institucion || "",
      localidad: formState.localidad || "",
      provincia: formState.provincia || "",
      email: formState.email || "",
      telefono: formState.telefono || "",
      cvPdfUrl: formState.cvPdfUrl || "",
    };

    if (formMode === "create") {
      await createProfesional.mutateAsync(payload);
    } else if (formMode === "edit" && editingId) {
      await updateProfesional.mutateAsync({ id: editingId, data: payload });
    }

    setDialogOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Matriculación y padrón
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestión interna de profesionales matriculados. Desde aquí se
            controla el padrón público, el estado de matrícula y la relación con
            deudas y facturación.
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo profesional
        </Button>
      </div>

      {/* Filtros y resumen */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o matrícula…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Estado:</span>
          <Button
            type="button"
            size="sm"
            variant={estadoFilter === "todos" ? "default" : "outline"}
            onClick={() => setEstadoFilter("todos")}
          >
            Todos
          </Button>
          <Button
            type="button"
            size="sm"
            variant={estadoFilter === "activa" ? "default" : "outline"}
            onClick={() => setEstadoFilter("activa")}
          >
            Activa
          </Button>
          <Button
            type="button"
            size="sm"
            variant={estadoFilter === "en_revision" ? "default" : "outline"}
            onClick={() => setEstadoFilter("en_revision")}
          >
            En revisión
          </Button>
          <Button
            type="button"
            size="sm"
            variant={estadoFilter === "inactiva" ? "default" : "outline"}
            onClick={() => setEstadoFilter("inactiva")}
          >
            Inactiva
          </Button>
        </div>
      </div>

      {/* Estado de carga / error */}
      {isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          Cargando profesionales…
        </p>
      )}
      {isError && (
        <p className="text-sm text-red-500 mb-4">
          {(error as Error)?.message ||
            "No se pudieron cargar los profesionales."}
        </p>
      )}

      {/* Tabla/Grilla */}
      <Card className="border-border">
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left py-3 px-4">Profesional</th>
                  <th className="text-left py-3 px-4">Matrícula</th>
                  <th className="text-left py-3 px-4">Especialidad</th>
                  <th className="text-left py-3 px-4">Lugar</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Deuda</th>
                  <th className="text-right py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfesionales.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">
                            {p.apellido}, {p.nombre}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {getTipoProfesionalLabel(p.tipo)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs">{p.matricula}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <span>{p.especialidadPrincipal}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{p.lugarTrabajo || p.localidad || "-"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.estadoMatricula === "activa"
                            ? "default"
                            : p.estadoMatricula === "en_revision"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {getEstadoMatriculaLabel(p.estadoMatricula)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {p.tieneDeuda ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <AlertTriangle className="w-3 h-3" />
                          Con deuda
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <ShieldCheck className="w-3 h-3" />
                          Al día
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(p)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {!isLoading && filteredProfesionales.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-sm text-muted-foreground"
                    >
                      No se encontraron profesionales con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modal alta/edición */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create"
                ? "Nuevo profesional matriculado"
                : "Editar profesional"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Registrá un nuevo profesional en el padrón. Estos datos alimentan la sección pública de matriculados y los módulos de deudas, constancias y facturación."
                : "Actualizá los datos de este profesional. Se verán reflejados en la sección pública y en los módulos internos."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-2">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="matricula">Matrícula</Label>
                <Input
                  id="matricula"
                  value={formState.matricula}
                  onChange={handleChange("matricula")}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formState.apellido}
                  onChange={handleChange("apellido")}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formState.nombre}
                  onChange={handleChange("nombre")}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="tipo">Tipo</Label>
                <select
                  id="tipo"
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={formState.tipo}
                  onChange={handleChange("tipo")}
                >
                  <option value="licenciado">Licenciado</option>
                  <option value="tecnico_otro">Técnico / Otro</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="estadoMatricula">Estado matrícula</Label>
                <select
                  id="estadoMatricula"
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={formState.estadoMatricula}
                  onChange={handleChange("estadoMatricula")}
                >
                  <option value="activa">Activa</option>
                  <option value="en_revision">En revisión</option>
                  <option value="inactiva">Inactiva</option>
                  <option value="suspendida">Suspendida</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label>Condición</Label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formState.habilitadoEjercer}
                      onChange={handleCheckboxChange("habilitadoEjercer")}
                    />
                    Habilitado para ejercer
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={formState.tieneDeuda}
                      onChange={handleCheckboxChange("tieneDeuda")}
                    />
                    Registra deuda
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="especialidadPrincipal">
                  Especialidad principal
                </Label>
                <Input
                  id="especialidadPrincipal"
                  value={formState.especialidadPrincipal}
                  onChange={handleChange("especialidadPrincipal")}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="otrasEspecialidades">
                  Otras especialidades (opcional)
                </Label>
                <Input
                  id="otrasEspecialidades"
                  value={formState.otrasEspecialidades}
                  onChange={handleChange("otrasEspecialidades")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="lugarTrabajo">Lugar de trabajo</Label>
                <Input
                  id="lugarTrabajo"
                  value={formState.lugarTrabajo}
                  onChange={handleChange("lugarTrabajo")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="institucion">Institución</Label>
                <Input
                  id="institucion"
                  value={formState.institucion}
                  onChange={handleChange("institucion")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="localidad">Localidad</Label>
                <Input
                  id="localidad"
                  value={formState.localidad}
                  onChange={handleChange("localidad")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={formState.provincia}
                  onChange={handleChange("provincia")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange("email")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formState.telefono}
                  onChange={handleChange("telefono")}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="ultimoPeriodoPago">
                  Último período pago (AAAA-MM)
                </Label>
                <Input
                  id="ultimoPeriodoPago"
                  placeholder="2025-01"
                  value={formState.ultimoPeriodoPago}
                  onChange={handleChange("ultimoPeriodoPago")}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="cvPdfUrl">URL CV (PDF)</Label>
                <Input
                  id="cvPdfUrl"
                  value={formState.cvPdfUrl}
                  onChange={handleChange("cvPdfUrl")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="notasInternas">Notas internas</Label>
              <Textarea
                id="notasInternas"
                rows={3}
                placeholder="Información solo visible en el panel de administración (no se publica)."
                value={formState.notasInternas}
                onChange={handleChange("notasInternas")}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border/70">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  createProfesional.isPending || updateProfesional.isPending
                }
              >
                {formMode === "create"
                  ? createProfesional.isPending
                    ? "Creando…"
                    : "Crear profesional"
                  : updateProfesional.isPending
                  ? "Guardando…"
                  : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
