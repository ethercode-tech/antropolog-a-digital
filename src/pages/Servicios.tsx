import { type ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  GraduationCap,
  FileText,
  Users,
  ClipboardList,
  DollarSign,
  Award,
  Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type IconType = ComponentType<{ className?: string }>;

type Tramite = {
  href: string;
  label: string;
  icon: IconType;
  description: string;
};

type Servicio = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
};

const tramites: Tramite[] = [
  {
    href: "/tramites/matriculacion",
    label: "Matriculación",
    icon: ClipboardList,
    description: "Inicie su solicitud de matrícula profesional de forma online.",
  },
  {
    href: "/tramites/deuda",
    label: "Consulta de Deuda",
    icon: DollarSign,
    description: "Consulte el estado actualizado de sus cuotas y obligaciones.",
  },
  {
    href: "/tramites/constancia",
    label: "Tramitar Constancia",
    icon: Award,
    description: "Solicite constancias de habilitación y estado de colegiación.",
  },
  {
    href: "/tramites/facturas",
    label: "Descarga de Facturas",
    icon: Receipt,
    description: "Acceda y descargue sus facturas emitidas por el Colegio.",
  },
];

const serviciosRelacionados: Servicio[] = [
  {
    id: "gestion-matriculas",
    title: "Gestión Administrativa de Matrículas",
    description:
      "Actualización de datos, altas, bajas y renovaciones de matrícula, centralizado en una misma plataforma.",
    icon: Briefcase,
  },
  {
    id: "asesoramiento-profesional",
    title: "Asesoramiento al Profesional",
    description:
      "Orientación sobre requisitos, documentación y procesos vinculados a los trámites del Colegio.",
    icon: Users,
  },
  {
    id: "capacitaciones",
    title: "Capacitaciones y Actualización",
    description:
      "Acceso a información sobre cursos, jornadas y eventos para fortalecer el desarrollo profesional.",
    icon: GraduationCap,
  },
  {
    id: "documentacion-oficial",
    title: "Emisión de Documentación Oficial",
    description:
      "Gestión de resoluciones, notas formales y certificados asociados a la actividad profesional.",
    icon: FileText,
  },
];

type TramiteCardProps = {
  tramite: Tramite;
  index: number;
};

function TramiteCard({ tramite, index }: TramiteCardProps) {
  const Icon = tramite.icon;

  return (
    <Link to={tramite.href}>
      <Card
        className="card-hover h-full border-primary/20 hover:border-primary/40 animate-fade-in-up"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardContent className="p-6 text-center">
          <div className="w-14 h-14 mb-4 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            {tramite.label}
          </h3>
          <p className="text-sm text-muted-foreground">
            {tramite.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

type ServicioCardProps = {
  servicio: Servicio;
  index: number;
};

function ServicioCard({ servicio, index }: ServicioCardProps) {
  const Icon = servicio.icon;

  return (
    <Card
      className="card-hover border-border bg-card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6 md:p-8">
        <div className="w-14 h-14 mb-5 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
          {servicio.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {servicio.description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function TramitesEnLineaPage() {
  return (
    <div className="animate-fade-in">
      {/* Header: Trámites en línea */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Trámites en Línea</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Gestione sus trámites principales del Colegio de Antropología
            de forma ágil, segura y completamente online.
          </p>
        </div>
      </section>

      {/* Trámites Grid */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container-main">
          {/* <h2 className="section-title text-center mb-4">
            Accesos directos a trámites
          </h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-12">
            Seleccione el trámite que desea iniciar o consultar. Cada flujo
            está diseñado para ser simple y claro en cada paso.
          </p> */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tramites.map((tramite, index) => (
              <TramiteCard
                key={tramite.href}
                tramite={tramite}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Relacionados */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <h2 className="section-title text-center mb-4">
            Servicios relacionados al módulo de trámites
          </h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-12">
            Además de los trámites en línea, el Colegio brinda servicios de
            acompañamiento y gestión para garantizar una experiencia integral
            al profesional.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviciosRelacionados.map((servicio, index) => (
              <ServicioCard
                key={servicio.id}
                servicio={servicio}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">¿Necesitás más información?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Si tenés dudas sobre los requisitos de algún trámite o necesitás
              asistencia durante el proceso, podés contactarte con la
              administración del Colegio para recibir soporte personalizado.
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
