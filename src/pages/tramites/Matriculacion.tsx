// src/pages/Matriculacion.tsx
import { useState } from "react";
import {
  FileText,
  Upload,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type EstadoSolicitud =
  | "pendiente"
  | "en_revision"
  | "observado"
  | "aprobado"
  | "rechazado";

export type MatriculacionSolicitudPublica = {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: EstadoSolicitud;
  observaciones: string | null;
  numeroMatriculaAsignado: string | null;
  creadoEn: string;
};

const estadoIcons: Record<EstadoSolicitud, React.ReactNode> = {
  pendiente: <Clock className="w-6 h-6 text-yellow-500" />,
  en_revision: <Clock className="w-6 h-6 text-blue-500" />,
  observado: <AlertCircle className="w-6 h-6 text-orange-500" />,
  aprobado: <CheckCircle className="w-6 h-6 text-green-500" />,
  rechazado: <AlertCircle className="w-6 h-6 text-red-500" />,
};

const estadoLabels: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  observado: "Observado",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

// ───────────────────────────────
// Helpers a Supabase
// ───────────────────────────────
type NuevaSolicitudPayload = {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  documentos: any[];
};

export async function createMatriculacionSolicitud(
  payload: NuevaSolicitudPayload
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .insert({
      nombre: payload.nombre,
      dni: payload.dni,
      email: payload.email,
      telefono: payload.telefono,
      especialidad: payload.especialidad,
      documentos: payload.documentos,
    });

  if (error) {
    console.error("[createMatriculacionSolicitud] error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

async function getMatriculacionByDni(
  dni: string
): Promise<MatriculacionSolicitudPublica | null> {
  const { data, error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .select(
      `
      id,
      dni,
      nombre,
      email,
      telefono,
      especialidad,
      estado,
      observaciones,
      numero_matricula_asignado,
      creado_en
    `
    )
    .eq("dni", dni.trim())
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[Matriculacion] getMatriculacionByDni error:", error);
    throw new Error("No se pudo consultar la solicitud");
  }

  if (!data) return null;

  return {
    id: data.id,
    dni: data.dni,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    especialidad: data.especialidad,
    estado: data.estado as EstadoSolicitud,
    observaciones: data.observaciones,
    numeroMatriculaAsignado: data.numero_matricula_asignado,
    creadoEn: data.creado_en,
  };
}

// ───────────────────────────────
// Página pública
// ───────────────────────────────

export default function Matriculacion() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("solicitar");
  const [files, setFiles] = useState<File[]>([]);
  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    especialidad: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consulta state
  const [consultaDni, setConsultaDni] = useState("");
  const [consultaResult, setConsultaResult] = useState<
    MatriculacionSolicitudPublica | "not_found" | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.dni || !formData.email || !formData.telefono || !formData.especialidad) {
      toast({
        title: "Campos incompletos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
  
    if (files.length === 0) {
      toast({
        title: "Faltan documentos",
        description: "Debés adjuntar al menos un PDF con la documentación requerida.",
        variant: "destructive"
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const documentos: any[] = [];
      const dni = formData.dni.trim();
      const timestamp = Date.now();
  
      for (const file of files) {
        const extension = file.name.split(".").pop() || "pdf";
        const safeName = file.name.replace(/\s+/g, "_").toLowerCase();
        const path = `solicitudes/${dni}/${timestamp}-${safeName}`;
  
        const { error: uploadError } = await supabase
          .storage
          .from("matriculacion_docs")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
          });
  
        if (uploadError) {
          console.error("[Matriculacion] Error upload file:", uploadError);
          throw new Error("No se pudo subir uno de los archivos. Intente nuevamente.");
        }
  
        documentos.push({
          tipo: "desconocido", // después podés inferir por nombre o dejar que admin lo etiquete
          bucket: "matriculacion_docs",
          path,
          nombre_original: file.name,
          size: file.size,
        });
      }
  
      const payload = {
        ...formData,
        documentos,
      };
  
      const result = await createMatriculacionSolicitud(payload);
  
      if (result.success) {
        toast({
          title: "Solicitud enviada",
          description: "Su solicitud de matriculación ha sido recibida. Puede consultar el estado con su DNI.",
        });
  
        setFormData({
          nombre: "",
          dni: "",
          email: "",
          telefono: "",
          especialidad: "",
        });
        setFiles([]);
        setActiveTab("consultar");
      } else {
        toast({
          title: "Error al enviar",
          description: result.error || "No se pudo enviar la solicitud. Intente nuevamente.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({
        title: "Error al enviar",
        description: err instanceof Error ? err.message : "Ocurrió un error al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsulta = async () => {
    if (!consultaDni.trim()) {
      toast({
        title: "DNI requerido",
        description: "Por favor ingrese su DNI para consultar",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const result = await getMatriculacionByDni(consultaDni);
      setConsultaResult(result || "not_found");
    } catch (err: any) {
      toast({
        title: "Error al consultar",
        description:
          err?.message ||
          "No se pudo consultar el estado. Intente nuevamente.",
        variant: "destructive",
      });
      setConsultaResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">
            Matriculación Profesional
          </h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Solicite su matrícula profesional o consulte el estado de su
            solicitud
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-main max-w-3xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="solicitar">
                <FileText className="w-4 h-4 mr-2" />
                Solicitar Matrícula
              </TabsTrigger>
              <TabsTrigger value="consultar">
                <Search className="w-4 h-4 mr-2" />
                Consultar Estado
              </TabsTrigger>
            </TabsList>

            {/* Solicitud */}
            <TabsContent value="solicitar">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">
                    Formulario de Matriculación
                  </CardTitle>
                  <CardDescription>
                    Complete el formulario y adjunte los documentos requeridos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dni">DNI *</Label>
                        <Input
                          id="dni"
                          name="dni"
                          value={formData.dni}
                          onChange={handleInputChange}
                          placeholder="12345678"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono *</Label>
                        <Input
                          id="telefono"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="especialidad">Especialidad *</Label>
                      <Input
                        id="especialidad"
                        name="especialidad"
                        value={formData.especialidad}
                        onChange={handleInputChange}
                        placeholder="Ej: Antropología Social, Arqueología, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Documentación adjunta *</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Título universitario, DNI y certificado de antecedentes
                        </p>

                        <input
                          id="documentos"
                          type="file"
                          multiple
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const selected = Array.from(e.target.files || []);
                            setFiles(selected);
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.getElementById("documentos") as HTMLInputElement | null;
                            input?.click();
                          }}
                        >
                          Seleccionar archivos PDF
                        </Button>

                        <p className="text-xs text-muted-foreground mt-2">
                          Podés adjuntar varios PDFs.
                        </p>

                        {files.length > 0 && (
                          <ul className="mt-3 text-xs text-left max-h-32 overflow-auto">
                            {files.map((f) => (
                              <li key={f.name} className="text-muted-foreground">
                                • {f.name} ({Math.round(f.size / 1024)} KB)
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Enviando solicitud..."
                        : "Enviar Solicitud"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Consulta */}
            <TabsContent value="consultar">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">
                    Consultar Estado de Solicitud
                  </CardTitle>
                  <CardDescription>
                    Ingrese su DNI para ver el estado de su solicitud de
                    matriculación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-8">
                    <Input
                      placeholder="Ingrese su DNI"
                      value={consultaDni}
                      onChange={(e) => setConsultaDni(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleConsulta} disabled={isSearching}>
                      {isSearching ? "Buscando..." : "Consultar"}
                    </Button>
                  </div>

                  {consultaResult && consultaResult !== "not_found" && (
                    <div className="bg-secondary/50 rounded-lg p-6 animate-fade-in">
                      <div className="flex items-start gap-4 mb-4">
                        {estadoIcons[consultaResult.estado]}
                        <div>
                          <h3 className="font-semibold text-lg">
                            Estado: {estadoLabels[consultaResult.estado]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Solicitud #{consultaResult.id.slice(0, 8)} –{" "}
                            {consultaResult.nombre}
                          </p>
                        </div>
                      </div>

                      {consultaResult.observaciones && (
                        <div className="bg-background rounded p-4 mb-4">
                          <p className="text-sm font-medium mb-1">
                            Observaciones:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {consultaResult.observaciones}
                          </p>
                        </div>
                      )}

                      {consultaResult.estado === "aprobado" &&
                        consultaResult.numeroMatriculaAsignado && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="font-semibold text-green-800">
                              ¡Felicitaciones!
                            </p>
                            <p className="text-green-700">
                              Su matrícula asignada es:{" "}
                              <span className="font-bold text-lg">
                                {consultaResult.numeroMatriculaAsignado}
                              </span>
                            </p>
                          </div>
                        )}
                    </div>
                  )}

                  {consultaResult === "not_found" && (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p>
                        No se encontró ninguna solicitud con el DNI ingresado
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
