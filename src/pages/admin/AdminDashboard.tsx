import { Link } from "react-router-dom";
import {
  Newspaper,
  FileText,
  Image,
  ArrowRight,
  Users,
  ClipboardList,
  FileWarning,
  Award,
  Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockNews, mockDocuments, mockGalleryImages } from "@/lib/dataAdapter";

type StatCardConfig = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  value?: number;
};

type QuickActionConfig = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const stats: StatCardConfig[] = [
  // {
  //   label: "Usuarios",
  //   href: "/admin/usuarios",
  //   icon: Users,
  //   color: "bg-sky-500/10 text-sky-500",
  //   // TODO: reemplazar con conteo real
  // },
  {
    label: "Matriculación",
    href: "/admin/matriculacion",
    icon: ClipboardList,
    color: "bg-emerald-500/10 text-emerald-500",
    // value: pendientes de revisión, cuando tengas API
  },
  {
    label: "Deudas",
    href: "/admin/deudas",
    icon: FileWarning,
    color: "bg-amber-500/10 text-amber-500",
  },
  // {
  //   label: "Constancias",
  //   href: "/admin/constancias",
  //   icon: Award,
  //   color: "bg-purple-500/10 text-purple-500",
  // },
  {
    label: "Facturas",
    href: "/admin/facturas",
    icon: Receipt,
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    label: "Noticias",
    href: "/admin/noticias",
    icon: Newspaper,
    color: "bg-blue-500/10 text-blue-500",
    value: mockNews.length,
  },
  {
    label: "Documentos",
    href: "/admin/documentos",
    icon: FileText,
    color: "bg-green-500/10 text-green-500",
    value: mockDocuments.length,
  },
  {
    label: "Imágenes",
    href: "/admin/galeria",
    icon: Image,
    color: "bg-amber-500/10 text-amber-500",
    value: mockGalleryImages.length,
  },
];

const quickActions: QuickActionConfig[] = [
  {
    label: "Ver solicitudes de matriculación",
    href: "/admin/matriculacion",
    icon: ClipboardList,
    description: "Revisar y aprobar nuevas matrículas",
  },
  {
    label: "Gestionar deudas",
    href: "/admin/deudas",
    icon: FileWarning,
    description: "Ver y actualizar estado de cuotas",
  },
  // {
  //   label: "Emitir constancias",
  //   href: "/admin/constancias",
  //   icon: Award,
  //   description: "Generar constancias para colegiados",
  // },
  {
    label: "Generar facturas",
    href: "/admin/facturas",
    icon: Receipt,
    description: "Emitir y revisar facturación",
  },
  {
    label: "Nueva noticia",
    href: "/admin/noticias/nueva",
    icon: Newspaper,
    description: "Publicar contenido en la web",
  },
  {
    label: "Nuevo documento",
    href: "/admin/documentos/nuevo",
    icon: FileText,
    description: "Subir normativa o material de consulta",
  },
  {
    label: "Nueva imagen de galería",
    href: "/admin/galeria/nueva",
    icon: Image,
    description: "Actualizar la galería institucional",
  },
];

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Panel general de gestión del Colegio de Antropología.
        </p>
      </div>

      {/* Módulos principales */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Módulos del sistema
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="card-hover border-border animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      {typeof stat.value === "number" ? (
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      ) : (
                        <p className="text-xl font-semibold text-muted-foreground">
                          —
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <Link
                    to={stat.href}
                    className="mt-4 text-xs text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Ir al módulo <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Acciones rápidas */}
      <section>
        <Card className="border-border">
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Acciones rápidas
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="p-4 rounded-lg border border-border hover:border-primary/60 hover:bg-primary/5 transition-colors flex flex-col items-start gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <p className="font-medium text-foreground text-sm">
                        {action.label}
                      </p>
                    </div>
                    {action.description && (
                      <p className="text-xs text-muted-foreground text-left">
                        {action.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
