import { Briefcase, GraduationCap, BookOpen, Search, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/data/mockData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  GraduationCap,
  BookOpen,
  Search,
  FileText,
  Users,
};

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

      {/* Additional Info */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">¿Necesitas más información?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Si deseas conocer más sobre nuestros servicios o estás interesado en colegiarte, no dudes en contactarnos. Nuestro equipo estará encantado de atenderte y resolver todas tus consultas.
            </p>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Ir a Contacto
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
