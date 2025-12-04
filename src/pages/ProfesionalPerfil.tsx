import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, FileText, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockProfesionales, EstadoMatricula } from "@/data/profesionalesData";

const estadoLabels: Record<EstadoMatricula, string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_revision: "En Revisión",
  suspendido: "Suspendido"
};

const estadoColors: Record<EstadoMatricula, string> = {
  activo: "bg-green-100 text-green-800",
  inactivo: "bg-gray-100 text-gray-800",
  en_revision: "bg-yellow-100 text-yellow-800",
  suspendido: "bg-red-100 text-red-800"
};

export default function ProfesionalPerfil() {
  const { id } = useParams();
  const profesional = mockProfesionales.find(p => p.id === id);

  if (!profesional) {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-serif font-semibold mb-4">Profesional no encontrado</h1>
        <Link to="/matriculados">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container-main">
          <Link 
            to="/matriculados" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al listado
          </Link>
          
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                {profesional.nombre}
              </h1>
              <p className="text-xl text-primary font-medium mb-3">
                Matrícula: {profesional.matricula}
              </p>
              <Badge className={`${estadoColors[profesional.estadoMatricula]}`}>
                {estadoLabels[profesional.estadoMatricula]}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Información Profesional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Especialidad</p>
                      <p className="font-medium">{profesional.especialidad}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Lugar de trabajo</p>
                      <p className="font-medium">{profesional.lugarTrabajo}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Matriculado desde</p>
                      <p className="font-medium">
                        {new Date(profesional.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profesional.cvPdfUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Currículum Vitae</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={profesional.cvPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Descargar CV (PDF)
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Datos de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a 
                        href={`mailto:${profesional.email}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {profesional.email}
                      </a>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{profesional.telefono}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-serif font-semibold mb-2">¿Necesitas una constancia?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Si eres este profesional, puedes solicitar una constancia de habilitación.
                  </p>
                  <Link to="/tramites/constancia">
                    <Button size="sm" className="w-full">
                      Solicitar constancia
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
