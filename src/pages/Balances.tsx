import { Card, CardContent } from "@/components/ui/card";

export default function Balances() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">
            Balances institucionales
          </h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Información económica y financiera del Colegio de Graduados en
            Antropología de Jujuy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">

            {/* Introducción */}
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Transparencia institucional
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-4">
                  El Colegio de Graduados en Antropología de Jujuy publica sus
                  balances institucionales como parte de su política de
                  transparencia y rendición de cuentas frente a las y los
                  profesionales matriculados.
                </p>

                <p className="text-muted-foreground leading-relaxed">
                  En esta sección se ponen a disposición los documentos
                  correspondientes a cada período de gestión, con información
                  sobre ingresos, gastos y estado económico de la institución.
                </p>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card>
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Documentos disponibles
                </h2>

                <p className="text-muted-foreground mb-6">
                  Los balances institucionales pueden consultarse o descargarse
                  en formato PDF.
                </p>

                <div className="space-y-3">

                  <a
                    href="/documentos/balance-2025.pdf"
                    className="block text-primary hover:underline"
                  >
                    Balance institucional 2024
                  </a>

                  <a
                    href="/documentos/balance-2023.pdf"
                    className="block text-primary hover:underline"
                  >
                    Balance institucional 2023
                  </a>

                  <a
                    href="/documentos/balance-2022.pdf"
                    className="block text-primary hover:underline"
                  >
                    Balance institucional 2022
                  </a>

                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Los documentos se publican a medida que son aprobados por las
                  instancias institucionales correspondientes.
                </p>

              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
}