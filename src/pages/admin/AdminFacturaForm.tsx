// src/pages/admin/AdminFacturaForm.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProfesionalBasic = {
  id: string;
  nombreCompleto: string;
  matricula: string;
  dni: string | null;
};

type FacturaDb = {
  id: string;
  profesional_id: string;
  numero: string;
  fecha_emision: string;
  periodo: string | null;
  concepto: string;
  importe: number;
  estado: string;
  url_pdf: string | null;
};

type FacturaFormState = {
  profesionalId: string;
  numero: string;
  fechaEmision: string;
  periodo: string;
  concepto: string;
  importe: string;
  estado: "emitida" | "anulada";
  pdfUrl: string;
};

function mapRowToProfesionalBasic(row: any): ProfesionalBasic {
  const nombre = row.nombre || "";
  const apellido = row.apellido || "";
  const nombreCompleto =
    nombre && apellido ? `${apellido}, ${nombre}` : nombre || apellido || "";

  return {
    id: row.id,
    nombreCompleto,
    matricula: row.matricula || "",
    dni: row.dni || null,
  };
}

async function fetchProfesionalesBasic(): Promise<ProfesionalBasic[]> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("id, nombre, apellido, matricula, dni")
    .order("apellido", { ascending: true });

  if (error) {
    console.error("[AdminFacturaForm] Error fetchProfesionalesBasic:", error);
    throw new Error("No se pudieron cargar los profesionales");
  }

  return (data ?? []).map(mapRowToProfesionalBasic);
}

async function fetchFacturaById(id: string): Promise<FacturaDb | null> {
  const { data, error } = await supabase
    .from("profesional_facturas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[AdminFacturaForm] Error fetchFacturaById:", error);
    throw new Error("No se pudo cargar la factura");
  }

  return data as FacturaDb | null;
}

async function createFacturaRequest(payload: FacturaFormState): Promise<void> {
  const { error } = await supabase.from("profesional_facturas").insert({
    profesional_id: payload.profesionalId,
    numero: payload.numero,
    fecha_emision: payload.fechaEmision,
    periodo: payload.periodo || null,
    concepto: payload.concepto,
    importe: Number(payload.importe),
    estado: payload.estado,
    url_pdf: payload.pdfUrl || null,
  });

  if (error) {
    console.error("[AdminFacturaForm] Error createFactura:", error);
    throw new Error("No se pudo crear la factura");
  }
}

async function updateFacturaRequest(params: {
  id: string;
  data: FacturaFormState;
}): Promise<void> {
  const { id, data } = params;

  const { error } = await supabase
    .from("profesional_facturas")
    .update({
      profesional_id: data.profesionalId,
      numero: data.numero,
      fecha_emision: data.fechaEmision,
      periodo: data.periodo || null,
      concepto: data.concepto,
      importe: Number(data.importe),
      estado: data.estado,
      url_pdf: data.pdfUrl || null,
    })
    .eq("id", id);

  if (error) {
    console.error("[AdminFacturaForm] Error updateFactura:", error);
    throw new Error("No se pudo actualizar la factura");
  }
}

export default function AdminFacturaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = Boolean(id);

  // Profesionales
  const {
    data: profesionales = [],
    isLoading: isLoadingProfesionales,
    isError: isErrorProfesionales,
    error: errorProfesionales,
  } = useQuery({
    queryKey: ["admin-facturas-profesionales"],
    queryFn: fetchProfesionalesBasic,
  });

  // Factura existente (modo edición)
  const {
    data: facturaExistente,
    isLoading: isLoadingFactura,
    isError: isErrorFactura,
    error: errorFactura,
  } = useQuery({
    queryKey: ["admin-factura-detalle", id],
    queryFn: () => fetchFacturaById(id as string),
    enabled: isEditing && Boolean(id),
  });

  const hoy = new Date();
  const defaultFecha = hoy.toISOString().split("T")[0]; // YYYY-MM-DD
  const defaultPeriodo = `${hoy.getFullYear()}-${String(
    hoy.getMonth() + 1
  ).padStart(2, "0")}`;

  const [formData, setFormData] = useState<FacturaFormState>({
    profesionalId: "",
    numero: "",
    fechaEmision: defaultFecha,
    periodo: defaultPeriodo,
    concepto: "",
    importe: "",
    estado: "emitida",
    pdfUrl: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  // Inicializar form cuando se carga la factura
  useEffect(() => {
    if (isEditing && facturaExistente) {
      setFormData({
        profesionalId: facturaExistente.profesional_id,
        numero: facturaExistente.numero,
        fechaEmision: facturaExistente.fecha_emision,
        periodo: facturaExistente.periodo || "",
        concepto: facturaExistente.concepto,
        importe: String(facturaExistente.importe),
        estado:
          (facturaExistente.estado as "emitida" | "anulada") || "emitida",
        pdfUrl: facturaExistente.url_pdf || "",
      });
    }
  }, [isEditing, facturaExistente]);

  const createFactura = useMutation({
    mutationFn: (payload: FacturaFormState) => createFacturaRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facturas"] });
      toast({
        title: "Factura creada",
        description: "La factura fue registrada correctamente.",
      });
      navigate("/admin/facturas");
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al crear factura",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar la factura.",
        variant: "destructive",
      });
    },
  });

  const updateFactura = useMutation({
    mutationFn: (params: { id: string; data: FacturaFormState }) =>
      updateFacturaRequest(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facturas"] });
      toast({
        title: "Factura actualizada",
        description: "Los datos de la factura fueron modificados.",
      });
      navigate("/admin/facturas");
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al actualizar factura",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al guardar los cambios.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange =
    (field: keyof FacturaFormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.profesionalId ||
      !formData.numero.trim() ||
      !formData.fechaEmision ||
      !formData.concepto.trim() ||
      !formData.importe.trim()
    ) {
      toast({
        title: "Campos requeridos",
        description:
          "Profesional, número, fecha, concepto e importe son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (Number.isNaN(Number(formData.importe))) {
      toast({
        title: "Importe inválido",
        description: "El importe debe ser un número válido.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.pdfUrl.trim()) {
      toast({
        title: "PDF requerido",
        description:
          "Subí el archivo PDF o ingresá la URL antes de guardar la factura.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && id) {
      await updateFactura.mutateAsync({ id, data: formData });
    } else {
      await createFactura.mutateAsync(formData);
    }
  };

  // Upload a bucket 'facturas_pdfs'
  const handleSelectFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      if (!formData.profesionalId) {
        toast({
          title: "Seleccioná un profesional",
          description:
            "Antes de subir el PDF, seleccioná el profesional al que corresponde.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsUploading(true);

        const filePath = `${formData.profesionalId}/${Date.now()}.pdf`;

        const { data, error } = await supabase.storage
          .from("facturas_pdfs")
          .upload(filePath, file, {
            cacheControl: "360000",
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("facturas_pdfs")
          .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        if (!publicUrl) {
          throw new Error("No se pudo obtener la URL pública del PDF.");
        }

        setFormData((prev) => ({
          ...prev,
          pdfUrl: publicUrl,
        }));

        toast({
          title: "Archivo subido",
          description: "El PDF se subió correctamente y quedó vinculado.",
        });
      } catch (err) {
        toast({
          title: "Error al subir PDF",
          description:
            err instanceof Error
              ? err.message
              : "Ocurrió un error al subir el archivo.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    };

    input.click();
  };

  const selectedProfesional = profesionales.find(
    (p) => p.id === formData.profesionalId
  );

  const isLoadingAll = isLoadingProfesionales || (isEditing && isLoadingFactura);

  return (
    <div className="animate-fade-in">
      <Link
        to="/admin/facturas"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a facturas
      </Link>

      {isErrorProfesionales && (
        <p className="text-sm text-red-500 mb-4">
          {(errorProfesionales as Error)?.message ||
            "No se pudieron cargar los profesionales."}
        </p>
      )}
      {isEditing && isErrorFactura && (
        <p className="text-sm text-red-500 mb-4">
          {(errorFactura as Error)?.message || "No se pudo cargar la factura."}
        </p>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif">
            {isEditing ? "Editar factura" : "Nueva factura"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Modificá los datos de la factura seleccionada."
              : "Registrá una nueva factura y vinculá el PDF al profesional."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAll ? (
            <p className="text-sm text-muted-foreground">Cargando datos…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Profesional *</Label>
                <Select
                  value={formData.profesionalId}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, profesionalId: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar profesional" />
                  </SelectTrigger>
                  <SelectContent>
                    {profesionales.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.nombreCompleto} ({prof.matricula})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProfesional && (
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Matrícula:</span>{" "}
                    <span className="font-medium">
                      {selectedProfesional.matricula}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">DNI:</span>{" "}
                    <span className="font-medium">
                      {selectedProfesional.dni || "—"}
                    </span>
                  </p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de factura *</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={handleInputChange("numero")}
                    placeholder="Ej: 0001-00001234"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaEmision">Fecha de emisión *</Label>
                  <Input
                    id="fechaEmision"
                    type="date"
                    value={formData.fechaEmision}
                    onChange={handleInputChange("fechaEmision")}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período (AAAA-MM)</Label>
                  <Input
                    id="periodo"
                    type="month"
                    value={formData.periodo}
                    onChange={handleInputChange("periodo")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: e.target.value as "emitida" | "anulada",
                      }))
                    }
                  >
                    <option value="emitida">Emitida</option>
                    <option value="anulada">Anulada</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Input
                  id="concepto"
                  value={formData.concepto}
                  onChange={handleInputChange("concepto")}
                  placeholder="Ej: Cuota mensual, matrícula anual, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="importe">Importe *</Label>
                <Input
                  id="importe"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.importe}
                  onChange={handleInputChange("importe")}
                  placeholder="Ej: 15000.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdfUrl">Archivo PDF *</Label>
                <div className="flex gap-2">
                  <Input
                    id="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange("pdfUrl")}
                    placeholder="URL del PDF o usar el botón para subir"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSelectFile}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Podés pegar una URL de un PDF existente o subir el archivo al
                  bucket <code>facturas_pdfs</code>.
                </p>
                {isUploading && (
                  <p className="text-xs text-muted-foreground">
                    Subiendo archivo…
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={
                    createFactura.isPending || updateFactura.isPending
                  }
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createFactura.isPending || updateFactura.isPending
                    ? "Guardando…"
                    : "Guardar factura"}
                </Button>
                <Link to="/admin/facturas">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
