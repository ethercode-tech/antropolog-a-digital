import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FileText,
  Mail,
  Phone,
  Calendar,
  User,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { EstadoSolicitud } from "@/data/profesionalesData";

type MatriculacionSolicitud = {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: EstadoSolicitud;
  observaciones: string | null;
  numeroMatriculaAsignado: string | null;
  documentos: { url: string; nombre?: string; tipo?: string }[] | null;
  creadoEn: string;
};

const estadoLabels: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  observado: "Observado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

const estadoClasses: Record<EstadoSolicitud, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  observado: "bg-orange-100 text-orange-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800",
};

// ───────────────────────────────
// Helpers BFF + token admin
// ───────────────────────────────
async function getAdminToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No hay sesión de administrador");
  return session.access_token;
}

async function fetchSolicitudById(id: string): Promise<MatriculacionSolicitud> {
  const token = await getAdminToken();

  const res = await fetch(`/api/admin/matriculacion/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "No se pudo cargar la solicitud de matriculación");
  }

  return res.json();
}

type UpdatePayload = {
  estado: EstadoSolicitud;
  observaciones?: string | null;
  numeroMatriculaAsignado?: string | null;
};

async function updateSolicitud(id: string, data: UpdatePayload) {
  const token = await getAdminToken();

  const res = await fetch(`/api/admin/matriculacion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "No se pudo actualizar la solicitud");
  }

  return res.json() as Promise<MatriculacionSolicitud>;
}

// ───────────────────────────────
// Page
// ───────────────────────────────

export default function AdminMatriculacionDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: solicitud,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-matriculacion-solicitud", id],
    queryFn: () => fetchSolicitudById(id as string),
    enabled: !!id,
  });

  const [estado, setEstado] = useState<EstadoSolicitud>("pendiente");
  const [observaciones, setObservaciones] = useState("");
  const [numeroMatricula, setNumeroMatricula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronizar estado local cuando llega la data
  useEffect(() => {
    if (solicitud) {
      setEstado(solicitud.estado);
      setObservaciones(solicitud.observaciones || "");
      setNumeroMatricula(solicitud.numeroMatriculaAsignado || "");
    }
  }, [solicitud]);

  const mutation = useMutation({
    mutationFn: (payload: UpdatePayload) =>
      updateSolicitud(id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-matriculacion-solicitudes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-matriculacion-solicitud", id],
      });
      toast({
        title: "Solicitud actualizada",
        description: "Los cambios han sido guardados correctamente",
      });
      navigate("/admin/matriculacion");
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al actualizar",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar los cambios",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleSave = async () => {
    if (estado === "aprobado" && !numeroMatricula.trim()) {
      toast({
        title: "Matrícula requerida",
        description:
          "Debe asignar un número de matrícula para aprobar la solicitud",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload: UpdatePayload = {
      estado,
      observaciones: observaciones.trim() || null,
      numeroMatriculaAsignado: numeroMatricula.trim() || null,
    };

    await mutation.mutateAsync(payload);
    setIsSubmitting(false);
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">Cargando solicitud…</p>
      </div>
    );
  }

  if (isError || !solicitud) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-serif font-semibold mb-4">
          Solicitud no encontrada
        </h1>
        {error && (
          <p className="mb-4 text-sm text-red-500">
            {(error as Error).message}
          </p>
        )}
        <Link to="/admin/matriculacion">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </Link>
      </div>
    );
  }

  const primeraDoc =
    solicitud.documentos && solicitud.documentos.length > 0
      ? solicitud.documentos[0]
      : null;

  return (
    <div className="animate-fade-in">
      <Link
        to="/admin/matriculacion"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al listado
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Info */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-serif text-xl">
                    {solicitud.nombre}
                  </CardTitle>
                  <CardDescription>Solicitud #{solicitud.id}</CardDescription>
                </div>
                <Badge className={estadoClasses[estado]}>
                  {estadoLabels[estado]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">DNI</p>
                    <p className="font-medium">{solicitud.dni}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium break-all">
                      {solicitud.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{solicitud.telefono}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de solicitud
                    </p>
                    <p className="font-medium">
                      {new Date(solicitud.creadoEn).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Especialidad
                </p>
                <p className="font-medium">{solicitud.especialidad}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Documentación Adjunta</CardTitle>
              <CardDescription>
                Archivos cargados por la persona solicitante
              </CardDescription>
            </CardHeader>
            <CardContent>
              {primeraDoc ? (
                <a
                  href={primeraDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">
                      {primeraDoc.nombre || "Documentación del solicitante"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {primeraDoc.tipo ||
                        "Título, DNI, certificados u otros documentos"}
                    </p>
                  </div>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay documentación registrada para esta solicitud.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="lg:w-96 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Gestionar Solicitud</CardTitle>
              <CardDescription>
                Actualice el estado y agregue observaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado de la solicitud</Label>
                <Select
                  value={estado}
                  onValueChange={(v) => setEstado(v as EstadoSolicitud)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_revision">En Revisión</SelectItem>
                    <SelectItem value="observado">Observado</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {estado === "aprobado" && (
                <div className="space-y-2">
                  <Label htmlFor="matricula">Número de matrícula *</Label>
                  <Input
                    id="matricula"
                    value={numeroMatricula}
                    onChange={(e) => setNumeroMatricula(e.target.value)}
                    placeholder="ANT-2024-XXX"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Agregue notas o comentarios sobre la solicitud..."
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSubmitting || mutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting || mutation.isPending
                  ? "Guardando..."
                  : "Guardar Cambios"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
