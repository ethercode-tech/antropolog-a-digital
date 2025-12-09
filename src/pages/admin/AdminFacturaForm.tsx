import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockFacturas, mockProfesionales } from "@/lib/dataAdapter";

export default function AdminFacturaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const existingFactura = isEditing ? mockFacturas.find(f => f.id === id) : null;

  const [formData, setFormData] = useState({
    profesionalId: existingFactura?.profesionalId || "",
    mes: existingFactura?.mes || "",
    pdfUrl: existingFactura?.pdfUrl || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.profesionalId || !formData.mes || !formData.pdfUrl) {
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
      title: isEditing ? "Factura actualizada" : "Factura creada",
      description: isEditing 
        ? "Los datos han sido actualizados correctamente" 
        : "La factura ha sido subida correctamente"
    });
    
    navigate("/admin/facturas");
  };

  const selectedProfesional = mockProfesionales.find(p => p.id === formData.profesionalId);

  return (
    <div className="animate-fade-in">
      <Link 
        to="/admin/facturas"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a facturas
      </Link>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif">
            {isEditing ? "Editar Factura" : "Nueva Factura"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Modifique los datos de la factura"
              : "Suba una nueva factura para un profesional"
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

            {selectedProfesional && (
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Matrícula:</span>{" "}
                  <span className="font-medium">{selectedProfesional.matricula}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">DNI:</span>{" "}
                  <span className="font-medium">{selectedProfesional.dni}</span>
                </p>
              </div>
            )}

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
              <Label htmlFor="pdfUrl">Archivo PDF *</Label>
              <div className="flex gap-2">
                <Input
                  id="pdfUrl"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/factura.pdf"
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Suba el archivo PDF o ingrese la URL del documento
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Factura"}
              </Button>
              <Link to="/admin/facturas">
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
