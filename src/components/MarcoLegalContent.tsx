import { FileText, Download, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MarcoLegal() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Marco legal</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Normativa y disposiciones legales que regulan el funcionamiento
            institucional del Colegio de Graduados en Antropología de Jujuy.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid gap-12">
            {/* Introducción */}
            <div className="animate-fade-in-up max-w-3xl">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Marco normativo institucional
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                El Colegio de Graduados en Antropología de la Provincia de Jujuy
                se rige por la normativa provincial vigente. A continuación se
                encuentra disponible el decreto oficial que establece el marco
                legal aplicable a su creación y funcionamiento.
              </p>
            </div>

            {/* Documento legal */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Card className="border-border bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Scale className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        Decreto Provincial N.º 7751
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Decreto del Gobierno de la Provincia de Jujuy que regula
                        el marco legal del Colegio de Graduados en Antropología.
                      </p>

                      <Button asChild variant="outline">
                        <a
                          href="/docs/Decreto_7751_Jujuy.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Descargar decreto (PDF)
                          <Download className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
