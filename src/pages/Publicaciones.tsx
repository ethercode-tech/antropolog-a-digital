import { FileText, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/data/mockData";

export default function Publicaciones() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Publicaciones</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Documentos, revistas y materiales académicos del Colegio de Antropología disponibles para consulta y descarga.
          </p>
        </div>
      </section>

      {/* Documents List */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-4xl mx-auto space-y-4">
            {mockDocuments.map((doc, index) => (
              <Card 
                key={doc.id} 
                className="card-hover border-border bg-card animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={doc.publishedAt}>{formatDate(doc.publishedAt)}</time>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button asChild variant="outline" size="sm">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver PDF
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockDocuments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay publicaciones disponibles en este momento.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
