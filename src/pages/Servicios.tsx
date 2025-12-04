import { Link } from "react-router-dom";
import { Briefcase, GraduationCap, BookOpen, Search, FileText, Users, ClipboardList, DollarSign, Award, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { services } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  GraduationCap,
  BookOpen,
  Search,
  FileText,
  Users,
};

const tramites = [
  { href: "/tramites/matriculacion", label: "Matriculación", icon: ClipboardList, description: "Solicite su matrícula profesional" },
  { href: "/tramites/deuda", label: "Consulta de Deuda", icon: DollarSign, description: "Consulte el estado de sus cuotas" },
  { href: "/tramites/constancia", label: "Tramitar Constancia", icon: Award, description: "Solicite constancia de habilitación" },
  { href: "/tramites/facturas", label: "Descarga de Facturas", icon: Receipt, description: "Acceda a sus facturas" },
];

export default function Servicios() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Servicios y Áreas de Trabajo</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            El Colegio de Antropología ofrece diversos servicios para el desarrollo profesional de sus colegiados.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || BookOpen;
              return (
                <Card 
                  key={service.id} 
                  className="card-hover border-border bg-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 md:p-8">
                    <div className="w-14 h-14 mb-5 rounded-xl bg-primary/10 flex items-center justify-center">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trámites Section */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container-main">
          <h2 className="section-title text-center mb-4">Trámites en Línea</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-12">
            Acceda a los principales trámites del Colegio de forma rápida y sencilla
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tramites.map((tramite, index) => (
              <Link key={tramite.href} to={tramite.href}>
                <Card className="card-hover h-full border-primary/20 hover:border-primary/40 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mb-4 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <tramite.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{tramite.label}</h3>
                    <p className="text-sm text-muted-foreground">{tramite.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">¿Necesitas más información?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Si deseas conocer más sobre nuestros servicios o estás interesado en colegiarte, no dudes en contactarnos.
            </p>
            <Link to="/contacto">
              <Button size="lg">Ir a Contacto</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
