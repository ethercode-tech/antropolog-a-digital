import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EstadoDeuda } from "@/data/profesionalesData";
import { mockDeudas, mockProfesionales } from "@/data/profesionalesData";

export default function AdminDeudaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const existingDeuda = isEditing ? mockDeudas.find(d => d.id === id) : null;

  const [formData, setFormData] = useState({
    profesionalId: existingDeuda?.profesionalId || "",
    mes: existingDeuda?.mes || "",
    monto: existingDeuda?.monto.toString() || "",
    estado: existingDeuda?.estado || "pendiente"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.profesionalId || !formData.mes || !formData.monto) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isEditing ? "Deuda actualizada" : "Deuda creada",
      description: isEditing 
        ? "Los datos han sido actualizados correctamente" 
        : "El registro de deuda ha sido creado"
    });
    
    navigate("/admin/deudas");
  };

  return (
    <div className="animate-fade-in">
      <Link 
        to="/admin/deudas"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a deudas
      </Link>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif">
            {isEditing ? "Editar Deuda" : "Nueva Deuda"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Modifique los datos del registro de deuda"
              : "Complete los datos para crear un nuevo registro de deuda"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Profesional *</Label>
              <Select 
                value={formData.profesionalId} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, profesionalId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar profesional" />
                </SelectTrigger>
                <SelectContent>
                  {mockProfesionales.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.nombre} ({prof.matricula})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mes">Período (mes) *</Label>
                <Input
                  id="mes"
                  name="mes"
                  type="month"
                  value={formData.mes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto *</Label>
                <Input
                  id="monto"
                  name="monto"
                  type="number"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado *</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, estado: v as EstadoDeuda }))}
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

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Deuda"}
              </Button>
              <Link to="/admin/deudas">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
