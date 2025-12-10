// src/pages/admin/AdminMatriculacion.tsx
import type React from "react";
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
// Tipos para solicitudes de matriculación
// ───────────────────────────────

type SolicitudEstado =
  | "pendiente"
  | "en_revision"
  | "observado"
  | "aprobado"
  | "rechazado";

type SolicitudMatriculacion = {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: SolicitudEstado;
  observaciones: string | null;
  numeroMatriculaAsignado: string | null;
  profesionalId: string | null;
  creadoEn: string;
};

// ───────────────────────────────
// Mappers Supabase ↔ tipos front
// ───────────────────────────────

function mapRowToProfesional(row: any): Profesional {
  return {
    id: row.id,
    matricula: row.matricula,
    apellido: row.apellido,
    nombre: row.nombre,
    tipo: row.tipo as ProfesionalTipo,
    especialidadPrincipal: row.especialidad_principal,
    otrasEspecialidades: row.otras_especialidades || "",
    lugarTrabajo: row.lugar_trabajo || "",
    institucion: row.institucion || "",
    localidad: row.localidad || "",
    provincia: row.provincia || "",
    email: row.email || "",
    telefono: row.telefono || "",
    estadoMatricula: row.estado_matricula as ProfesionalEstadoMatricula,
    habilitadoEjercer: row.habilitado_ejercer,
    tieneDeuda: row.tiene_deuda,
    ultimoPeriodoPago: row.ultimo_periodo_pago || "",
    cvPdfUrl: row.cv_pdf_url || "",
    notasInternas: row.notas_internas || "",
    fechaAlta: row.fecha_alta,
    fechaActualizacion: row.fecha_actualizacion,
    solicitudMatriculacionId: row.solicitud_matriculacion_id ?? null,
  };
}

function mapFormToDbPayload(form: ProfesionalFormState) {
  return {
    matricula: form.matricula,
    apellido: form.apellido,
    nombre: form.nombre,
    tipo: form.tipo,
    especialidad_principal: form.especialidadPrincipal,
    otras_especialidades: form.otrasEspecialidades || null,
    lugar_trabajo: form.lugarTrabajo || null,
    institucion: form.institucion || null,
    localidad: form.localidad || null,
    provincia: form.provincia || null,
    email: form.email || null,
    telefono: form.telefono || null,
    estado_matricula: form.estadoMatricula,
    habilitado_ejercer: form.habilitadoEjercer,
    tiene_deuda: form.tieneDeuda,
    ultimo_periodo_pago: form.ultimoPeriodoPago || null,
    cv_pdf_url: form.cvPdfUrl || null,
    notas_internas: form.notasInternas || null,
    solicitud_matriculacion_id: form.solicitudMatriculacionId || null,
  };
}

// ───────────────────────────────
// Data access directo a Supabase
// ───────────────────────────────

async function fetchProfesionales(): Promise<Profesional[]> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .order("apellido", { ascending: true });

  if (error) {
    console.error("[AdminMatriculacion] Error fetchProfesionales:", error);
    throw new Error("No se pudieron cargar los profesionales");
  }

  return (data ?? []).map(mapRowToProfesional);
}

async function fetchSolicitudesMatriculacion(): Promise<SolicitudMatriculacion[]> {
  const { data, error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .select("*")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("[AdminMatriculacion] Error fetchSolicitudesMatriculacion:", error);
    throw new Error("No se pudieron cargar las solicitudes de matriculación");
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    dni: row.dni,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono,
    especialidad: row.especialidad,
    estado: row.estado as SolicitudEstado,
    observaciones: row.observaciones ?? null,
    numeroMatriculaAsignado: row.numero_matricula_asignado ?? null,
    profesionalId: row.profesional_id ?? null,
    creadoEn: row.creado_en,
  }));
}

async function createProfesionalRequest(
  payload: ProfesionalFormState
): Promise<Profesional> {
  const dbPayload = mapFormToDbPayload(payload);

  const { data, error } = await supabase
    .from("profesionales")
    .insert(dbPayload)
    .select("*")
    .single(); // devuelve exactamente una fila

  if (error) {
    console.error("[AdminMatriculacion] Error createProfesional:", error);
    throw new Error("No se pudo crear el profesional en la base de datos");
  }

  return mapRowToProfesional(data);
}

async function updateProfesionalRequest(params: {
  id: string;
  data: ProfesionalFormState;
}): Promise<Profesional> {
  const dbPayload = mapFormToDbPayload(params.data);

  const { data, error } = await supabase
    .from("profesionales")
    .update(dbPayload)
    .eq("id", params.id)
    .select("*")
    .single(); // devuelve exactamente una fila

  if (error) {
    console.error("[AdminMatriculacion] Error updateProfesional:", error);
    throw new Error("No se pudo actualizar el profesional en la base de datos");
  }

  return mapRowToProfesional(data);
}

type SolicitudUpdatePayload = {
  estado: SolicitudEstado;
  numeroMatriculaAsignado?: string | null;
  observaciones?: string | null;
};

async function updateSolicitudRequest(params: {
  id: string;
  data: SolicitudUpdatePayload;
}): Promise<void> {
  const { id, data } = params;

  const { error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .update({
      estado: data.estado,
      numero_matricula_asignado: data.numeroMatriculaAsignado ?? null,
      observaciones: data.observaciones ?? null,
    })
    .eq("id", id);

  if (error) {
    console.error("[AdminMatriculacion] Error updateSolicitud:", error);
    throw new Error("No se pudo actualizar la solicitud de matriculación");
  }
}


// ───────────────────────────────
// Page
// ───────────────────────────────

export default function AdminMatriculacion() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profesionales
  const {
    data: profesionales = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-profesionales"],
    queryFn: fetchProfesionales,
  });

  // Solicitudes de matriculación
  const {
    data: solicitudes = [],
    isLoading: isLoadingSolicitudes,
    isError: isErrorSolicitudes,
    error: errorSolicitudes,
  } = useQuery({
    queryKey: ["admin-matriculacion-solicitudes"],
    queryFn: fetchSolicitudesMatriculacion,
  });

  const createProfesional = useMutation({
    mutationFn: (payload: ProfesionalFormState) =>
      createProfesionalRequest(payload),
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
    mutationFn: (params: { id: string; data: ProfesionalFormState }) =>
      updateProfesionalRequest(params),
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
  const [solicitudDialogOpen, setSolicitudDialogOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudMatriculacion | null>(null);
  const [solicitudForm, setSolicitudForm] = useState<{
    numeroMatricula: string;
    estado: SolicitudEstado;
    observaciones: string;
  }>({
    numeroMatricula: "",
    estado: "pendiente",
    observaciones: "",
  });

  const updateSolicitud = useMutation({
    mutationFn: (params: { id: string; data: SolicitudUpdatePayload }) =>
      updateSolicitudRequest(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-matriculacion-solicitudes"],
      });
      toast({
        title: "Solicitud actualizada",
        description: "El estado de la solicitud fue actualizado correctamente.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al actualizar solicitud",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  const openSolicitudDialog = (s: SolicitudMatriculacion) => {
    setSolicitudSeleccionada(s);
    setSolicitudForm({
      numeroMatricula: s.numeroMatriculaAsignado || "",
      estado: s.estado,
      observaciones: s.observaciones || "",
    });
    setSolicitudDialogOpen(true);
  };

  const handleSolicitudChange =
    (field: keyof typeof solicitudForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setSolicitudForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    const handleSolicitudSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!solicitudSeleccionada) return;
    
      // Regla de negocio: no se puede aprobar sin matrícula
      if (
        solicitudForm.estado === "aprobado" &&
        !solicitudForm.numeroMatricula.trim()
      ) {
        toast({
          title: "Matrícula requerida",
          description:
            "No podés marcar la solicitud como aprobada sin asignar una matrícula.",
          variant: "destructive",
        });
        return;
      }
    
      // Si se aprueba y todavía no hay profesional vinculado, lo creamos
      if (
        solicitudForm.estado === "aprobado" &&
        !solicitudSeleccionada.profesionalId
      ) {
        // separar nombre completo en nombre / apellido de forma simple
        const parts = solicitudSeleccionada.nombre.trim().split(" ");
        const apellido =
          parts.length > 1 ? parts[parts.length - 1] : "";
        const nombre =
          parts.length > 1 ? parts.slice(0, parts.length - 1).join(" ") : parts[0];
    
        const nuevoProfesionalPayload: ProfesionalFormState = {
          matricula: solicitudForm.numeroMatricula.trim(),
          apellido,
          nombre,
          tipo: "licenciado", // o lo que corresponda por defecto
          especialidadPrincipal: solicitudSeleccionada.especialidad,
          otrasEspecialidades: "",
          lugarTrabajo: "",
          institucion: "",
          localidad: "",
          provincia: "",
          email: solicitudSeleccionada.email,
          telefono: solicitudSeleccionada.telefono,
          estadoMatricula: "activa",
          habilitadoEjercer: true,
          tieneDeuda: false,
          ultimoPeriodoPago: "",
          cvPdfUrl: "",
          notasInternas: "",
          solicitudMatriculacionId: solicitudSeleccionada.id,
        };
    
        // 1) Creamos el profesional en la tabla general
        const nuevoProfesional = await createProfesional.mutateAsync(
          nuevoProfesionalPayload
        );
    
        // 2) Vinculamos la solicitud con ese profesional
        const { error: linkError } = await supabase
          .from("profesional_matriculacion_solicitudes")
          .update({ profesional_id: nuevoProfesional.id })
          .eq("id", solicitudSeleccionada.id);
    
        if (linkError) {
          console.error("[AdminMatriculacion] Error link solicitud→profesional:", linkError);
          toast({
            title: "Profesional creado, pero hubo un problema al vincular",
            description:
              "Revisá manualmente la solicitud, el profesional ya fue creado.",
            variant: "destructive",
          });
        }
      }
    
      // 3) Actualizamos el estado / observaciones / matrícula de la solicitud
      await updateSolicitud.mutateAsync({
        id: solicitudSeleccionada.id,
        data: {
          estado: solicitudForm.estado,
          numeroMatriculaAsignado: solicitudForm.numeroMatricula.trim() || null,
          observaciones: solicitudForm.observaciones.trim() || null,
        },
      });
    
      // 4) Refrescamos ambas listas
      queryClient.invalidateQueries({
        queryKey: ["admin-matriculacion-solicitudes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-profesionales"],
      });
    
      setSolicitudDialogOpen(false);
    };
    


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
      solicitudMatriculacionId: rest.solicitudMatriculacionId ?? null,
    });
    setEditingId(id);
    setFormMode("edit");
    setDialogOpen(true);
  };

  // Crear profesional desde una solicitud
  const handleCreateFromSolicitud = (solicitud: SolicitudMatriculacion) => {
    // Partir nombre completo en nombre / apellido de forma básica
    const parts = solicitud.nombre.trim().split(" ");
    const apellido =
      parts.length > 1 ? parts[parts.length - 1] : "";
    const nombre =
      parts.length > 1 ? parts.slice(0, parts.length - 1).join(" ") : parts[0];

    resetForm();
    setFormState((prev) => ({
      ...prev,
      apellido,
      nombre,
      email: solicitud.email,
      telefono: solicitud.telefono,
      especialidadPrincipal: solicitud.especialidad,
      solicitudMatriculacionId: solicitud.id,
      // El resto queda vacío por ahora, el admin completa
    }));
    setFormMode("create");
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
      solicitudMatriculacionId: formState.solicitudMatriculacionId || null,
    };

    if (formMode === "create") {
      await createProfesional.mutateAsync(payload);
    } else if (formMode === "edit" && editingId) {
      await updateProfesional.mutateAsync({ id: editingId, data: payload });
    }

    setDialogOpen(false);
  };

  const formatFecha = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoSolicitudBadgeClasses = (estado: SolicitudEstado) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "en_revision":
        return "bg-blue-100 text-blue-800";
      case "observado":
        return "bg-orange-100 text-orange-800";
      case "aprobado":
        return "bg-emerald-100 text-emerald-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
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

      {/* Bloque de solicitudes de matriculación */}
      <Dialog open={solicitudDialogOpen} onOpenChange={setSolicitudDialogOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSolicitudSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Revisión de solicitud</DialogTitle>
              <DialogDescription>
                Revisá los datos del formulario, asigná la matrícula y actualizá el
                estado de la solicitud.
              </DialogDescription>
            </DialogHeader>

            {solicitudSeleccionada && (
              <div className="space-y-3">
                {/* Datos de la persona, solo lectura */}
                <div className="rounded-md bg-muted/60 p-3 text-xs space-y-1">
                  <p className="font-medium text-sm">
                    {solicitudSeleccionada.nombre}
                  </p>
                  <p className="text-muted-foreground">
                    DNI {solicitudSeleccionada.dni}
                  </p>
                  <p className="text-muted-foreground">
                    {solicitudSeleccionada.email}
                    {solicitudSeleccionada.telefono &&
                      ` · ${solicitudSeleccionada.telefono}`}
                  </p>
                  <p className="text-muted-foreground">
                    Especialidad: {solicitudSeleccionada.especialidad || "-"}
                  </p>
                </div>

                {/* Matrícula asignada */}
                <div className="space-y-1">
                  <Label htmlFor="numeroMatricula">Matrícula asignada</Label>
                  <Input
                    id="numeroMatricula"
                    value={solicitudForm.numeroMatricula}
                    onChange={handleSolicitudChange("numeroMatricula")}
                    placeholder="Ej: 00123"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Obligatorio si vas a marcar la solicitud como aprobada.
                  </p>
                </div>

                {/* Estado de la solicitud */}
                <div className="space-y-1">
                  <Label htmlFor="estadoSolicitud">Estado de la solicitud</Label>
                  <select
                    id="estadoSolicitud"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={solicitudForm.estado}
                    onChange={handleSolicitudChange("estado")}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_revision">En revisión</option>
                    <option value="observado">Observado</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>

                {/* Observaciones */}
                <div className="space-y-1">
                  <Label htmlFor="observacionesSolicitud">Observaciones</Label>
                  <Textarea
                    id="observacionesSolicitud"
                    rows={3}
                    placeholder="Notas internas sobre esta solicitud, motivos de observación o rechazo, etc."
                    value={solicitudForm.observaciones}
                    onChange={handleSolicitudChange("observaciones")}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSolicitudDialogOpen(false)}
                disabled={updateSolicitud.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateSolicitud.isPending}>
                {updateSolicitud.isPending ? "Guardando…" : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

                    {/* Bloque de solicitudes de matriculación - LISTADO */}
      <Card className="border-border mb-6">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">
                Solicitudes de matriculación recibidas
              </h2>
              <p className="text-xs text-muted-foreground">
                Formularios enviados desde la web pública. Desde aquí podés
                revisar, aprobar y vincular la solicitud con un profesional.
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {isLoadingSolicitudes
                ? "Cargando solicitudes…"
                : isErrorSolicitudes
                ? (errorSolicitudes as Error)?.message ??
                  "Error al cargar solicitudes"
                : `${solicitudes.length} solicitudes`}
            </div>
          </div>

          {solicitudes.length === 0 &&
            !isLoadingSolicitudes &&
            !isErrorSolicitudes && (
              <p className="text-xs text-muted-foreground">
                No hay solicitudes de matriculación registradas.
              </p>
            )}

          {solicitudes.length > 0 && !isLoadingSolicitudes && (
            <ScrollArea className="w-full max-h-[260px] mt-2">
              <table className="w-full text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-[11px] text-muted-foreground uppercase tracking-wide">
                    <th className="text-left py-2 px-3">Persona</th>
                    <th className="text-left py-2 px-3">Especialidad</th>
                    <th className="text-left py-2 px-3">Estado</th>
                    <th className="text-left py-2 px-3 hidden md:table-cell">
                      Creado
                    </th>
                    <th className="text-right py-2 px-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                    >
                      <td className="py-2 px-3 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-xs md:text-sm">
                            {s.nombre}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            DNI {s.dni}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {s.email} {s.telefono && `· ${s.telefono}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 align-top">
                        <span className="text-xs">
                          {s.especialidad || "-"}
                        </span>
                      </td>
                      <td className="py-2 px-3 align-top">
                        <Badge
                          className={`${getEstadoSolicitudBadgeClasses(
                            s.estado
                          )} text-[11px] font-medium`}
                        >
                          {s.estado === "pendiente" && "Pendiente"}
                          {s.estado === "en_revision" && "En revisión"}
                          {s.estado === "observado" && "Observado"}
                          {s.estado === "aprobado" && "Aprobado"}
                          {s.estado === "rechazado" && "Rechazado"}
                        </Badge>
                        {s.observaciones && (
                          <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                            {s.observaciones}
                          </p>
                        )}
                      </td>
                      <td className="py-2 px-3 align-top hidden md:table-cell">
                        <span className="text-[11px] text-muted-foreground">
                          {formatFecha(s.creadoEn)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right align-top">
                        <div className="flex flex-col items-end gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="text-[11px] h-7 px-2"
                            onClick={() => openSolicitudDialog(s)}
                          >
                            Aprobar / editar
                          </Button>

                          {!s.profesionalId ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="text-[11px] h-7 px-2"
                              onClick={() => handleCreateFromSolicitud(s)}
                            >
                              Crear profesional
                            </Button>
                          ) : (
                            <span className="text-[11px] text-emerald-600">
                              Profesional vinculado
                            </span>
                          )}

                          {s.numeroMatriculaAsignado && (
                            <span className="text-[11px] text-muted-foreground">
                              Matrícula {s.numeroMatriculaAsignado}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Filtros y resumen padrón */}
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

      {/* Estado de carga / error padrón */}
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

      {/* Tabla/Grilla padrón */}
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
        <DialogContent className="max-w-4xl p-0">
          <form
            onSubmit={handleSubmit}
            className="flex max-h-[80vh] flex-col"
          >
            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
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

            {/* Campos scrollables */}
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-6">
                {/* Identificación básica */}
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

                {/* Tipo, estado y condición */}
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
                    <div className="flex flex-col gap-2 text-xs md:flex-row md:items-center">
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

                {/* Especialidades */}
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

                {/* Lugar de trabajo */}
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

                {/* Ubicación y contacto */}
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

                {/* Pago y CV */}
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

                {/* Notas internas */}
                <div className="space-y-1 pb-2">
                  <Label htmlFor="notasInternas">Notas internas</Label>
                  <Textarea
                    id="notasInternas"
                    rows={3}
                    placeholder="Información solo visible en el panel de administración (no se publica)."
                    value={formState.notasInternas}
                    onChange={handleChange("notasInternas")}
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Footer fijo con botones */}
            <div className="flex justify-end gap-3 border-t border-border bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={
                  createProfesional.isPending || updateProfesional.isPending
                }
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
