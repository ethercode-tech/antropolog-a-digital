import { Link } from "react-router-dom";
import { Newspaper, FileText, Image, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockNews, mockDocuments, mockGalleryImages } from "@/data/mockData";

const stats = [
  {
    label: "Noticias",
    value: mockNews.length,
    icon: Newspaper,
    href: "/admin/noticias",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Documentos",
    value: mockDocuments.length,
    icon: FileText,
    href: "/admin/documentos",
    color: "bg-green-500/10 text-green-600",
  },
  {
    label: "Imágenes",
    value: mockGalleryImages.length,
    icon: Image,
    href: "/admin/galeria",
    color: "bg-amber-500/10 text-amber-600",
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
          Bienvenido al panel de administración del Colegio de Antropología.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="card-hover border-border animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <Link
                to={stat.href}
                className="mt-4 text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Gestionar <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
            Acciones rápidas
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/admin/noticias/nueva"
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
            >
              <Newspaper className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">Nueva noticia</p>
            </Link>
            <Link
              to="/admin/documentos/nuevo"
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">Nuevo documento</p>
            </Link>
            <Link
              to="/admin/galeria/nueva"
              className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
            >
              <Image className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground">Nueva imagen</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
