import { Card, CardContent } from "@/components/ui/card";

export default function Historia() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Historia del Colegio de Antropología</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Más de cinco décadas al servicio de la profesión antropológica y el desarrollo social.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Los orígenes</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  El Colegio de Antropología fue fundado en 1968 por un grupo de profesionales visionarios que comprendieron la necesidad de contar con una institución que agrupara y representara a los antropólogos del país. En sus inicios, la organización contaba con apenas una veintena de miembros fundadores, todos ellos egresados de las primeras promociones de las escuelas de antropología nacionales.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Durante sus primeros años, el Colegio se concentró en establecer las bases institucionales, definir los principios éticos de la profesión y promover el reconocimiento legal del ejercicio profesional de la antropología.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Consolidación institucional</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  En la década de 1980, el Colegio experimentó un período de notable crecimiento. Se establecieron las primeras comisiones permanentes de trabajo, se creó la Revista de Estudios Antropológicos y se iniciaron los programas de formación continua para los colegiados.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Durante este período, el Colegio también fortaleció su presencia internacional, estableciendo convenios con instituciones académicas de América Latina, Europa y Norteamérica, lo que permitió el intercambio de profesionales y la realización de investigaciones conjuntas.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">La antropología en el siglo XXI</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Con la llegada del nuevo milenio, el Colegio de Antropología renovó su compromiso con la profesión y con la sociedad. Se actualizaron los estatutos, se modernizaron los procesos administrativos y se implementaron nuevas tecnologías para facilitar la comunicación con los colegiados.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoy, el Colegio cuenta con más de 500 miembros activos y continúa trabajando en la promoción del ejercicio ético de la profesión, la defensa de los derechos profesionales y la vinculación de la antropología con los grandes desafíos de la sociedad contemporánea.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">Nuestra misión hacia el futuro</h2>
                <p className="text-muted-foreground leading-relaxed">
                  El Colegio de Antropología se proyecta como una institución líder en la promoción de la disciplina antropológica, comprometida con la formación de nuevas generaciones de profesionales y con el aporte de la mirada antropológica a la comprensión y solución de los problemas sociales contemporáneos. Seguiremos trabajando por una antropología al servicio de la humanidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
