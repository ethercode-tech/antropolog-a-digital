// src/pages/admin/AdminDeudaForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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

type EstadoDeuda = "pagado" | "pendiente";

type ProfesionalOption = {
  id: string;
  nombre: string;
  matricula: string;
};

const EMPTY_FORM = {
  profesionalId: "",
  periodo: "",
  concepto: "Cuota mensual",
  monto: "",
  estado: "pendiente" as EstadoDeuda,
  fechaVencimiento: "",
};

export default function AdminDeudaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [profesionales, setProfesionales] = useState<ProfesionalOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = isEditing
    ? `admin-deuda-form-${id}`
    : "admin-deuda-form-new";

  const clearDraft = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Profesionales para el select
        const { data: profs, error: profError } = await supabase
          .from("profesionales")
          .select("id, nombre, apellido, matricula")
          .order("apellido");

        if (profError) throw profError;

        setProfesionales(
          (profs || []).map((p: any) => ({
            id: p.id,
            nombre: `${p.apellido}, ${p.nombre}`,
            matricula: p.matricula,
          }))
        );

        // Base por defecto
        let baseForm = { ...EMPTY_FORM };

        // Si edita, cargar la deuda desde Supabase
        if (isEditing && id) {
          const { data, error } = await supabase
            .from("profesional_deudas")
            .select("*")
            .eq("id", id)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            baseForm = {
              profesionalId: data.profesional_id,
              periodo: data.periodo, // "YYYY-MM"
              concepto: data.concepto,
              monto: data.monto.toString(),
              estado: data.estado as EstadoDeuda,
              fechaVencimiento: data.fecha_vencimiento || "",
            };
          }
        }

        // Si hay borrador en localStorage, pisa lo anterior
        try {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
              const parsed = JSON.parse(stored);
              baseForm = { ...baseForm, ...parsed };
            }
          }
        } catch {
          // si rompe el JSON, ignoramos
        }

        setFormData(baseForm);
      } catch (err: any) {
        console.error("[AdminDeudaForm] load error:", err);
        toast({
          title: "Error al cargar datos",
          description: err?.message || "Intente nuevamente",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing, storageKey]);

  // Persistir borrador cada vez que cambia el form
  useEffect(() => {
    if (loading) return;
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(formData));
      }
    } catch {
      // no-op
    }
  }, [formData, loading, storageKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.profesionalId || !formData.periodo || !formData.monto) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      profesional_id: formData.profesionalId,
      periodo: formData.periodo,
      concepto: formData.concepto,
      monto: parseFloat(formData.monto),
      estado: formData.estado,
      fecha_vencimiento: formData.fechaVencimiento || null,
    };

    try {
      let error;
      if (isEditing && id) {
        const result = await supabase
          .from("profesional_deudas")
          .update(payload)
          .eq("id", id);
        error = result.error;
      } else {
        const result = await supabase
          .from("profesional_deudas")
          .insert(payload);
        error = result.error;
      }

      if (error) throw error;

      clearDraft();

      toast({
        title: isEditing ? "Deuda actualizada" : "Deuda creada",
        description: isEditing
          ? "Los datos han sido actualizados correctamente"
          : "El registro de deuda ha sido creado",
      });

      navigate("/admin/deudas");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo guardar la deuda",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="container-main max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            to="/admin/deudas"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a deudas
          </Link>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif">
              {isEditing ? "Editar Deuda" : "Nueva Deuda"}
            </CardTitle>
            <CardDescription>
              {isEditing
                ? "Modifique los datos del registro de deuda"
                : "Complete los datos para crear un nuevo registro de deuda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                        {prof.nombre} ({prof.matricula})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo">Período *</Label>
                  <Input
                    id="periodo"
                    name="periodo"
                    type="month"
                    value={formData.periodo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monto">Monto *</Label>
                  <Input
                    id="monto"
                    name="monto"
                    type="number"
                    step="0.01"
                    value={formData.monto}
                    onChange={handleInputChange}
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto *</Label>
                <Input
                  id="concepto"
                  name="concepto"
                  value={formData.concepto}
                  onChange={handleInputChange}
                  placeholder="Cuota mensual"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        estado: v as EstadoDeuda,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaVencimiento">
                    Fecha de vencimiento
                  </Label>
                  <Input
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4 border-t border-border/70">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    clearDraft();
                    navigate("/admin/deudas");
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Guardando..." : "Guardar Deuda"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
