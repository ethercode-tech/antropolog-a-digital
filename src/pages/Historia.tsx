import { Card, CardContent } from "@/components/ui/card";

export default function Historia() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">
            Historia del Colegio de Graduados en Antropología de Jujuy
          </h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Institución creada por Ley Provincial N.º 5753, al servicio del
            ejercicio profesional de la antropología en Jujuy.
          </p>
        </div>
      </section>

        <img
    src="/logo/logo.conletras.principal.svg"
    alt="Colegio de Antropología"
    className="w-80 h-32 md:w-80 md:h-32 object-contain mx-auto mt-4"
  />
      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Orígenes y creación por ley
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  El Colegio de Graduados en Antropología de Jujuy tiene su
                  origen en la Ley Provincial N.º 5753, sancionada por la
                  Legislatura de Jujuy en 2012. Esta norma reconoce la
                  necesidad de contar con un organismo profesional específico
                  que matricule, regule y represente a quienes ejercen la
                  antropología en el ámbito de la provincia.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  A partir de esta ley se establece al Colegio como entidad con
                  sede en San Salvador de Jujuy, con facultades para llevar el
                  registro de profesionales habilitados, ordenar el ejercicio
                  de la profesión y resguardar el cumplimiento de las normas
                  éticas en el campo de las ciencias antropológicas.
                </p>
              </CardContent>

            </Card>

            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Puesta en marcha y consolidación institucional
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  En los años posteriores a la sanción de la ley se desarrollan
                  las primeras acciones de organización interna, presentación
                  pública del Colegio y convocatoria a las y los profesionales
                  graduados en antropología para su matriculación. En ese
                  proceso se fueron definiendo las instancias de gobierno
                  colegiado, los mecanismos de ingreso al padrón profesional y
                  las primeras líneas de trabajo institucional.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  La consolidación del Colegio se apoya en la construcción de
                  un ámbito de referencia para la profesión en Jujuy, tanto
                  frente a organismos públicos y privados como ante la propia
                  comunidad académica y profesional vinculada a las ciencias
                  sociales.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Rol actual y alcances
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  De acuerdo con la Ley 5753, el Colegio tiene a su cargo la
                  matriculación de las y los profesionales en antropología que
                  ejercen en la provincia, la defensa de sus derechos
                  profesionales y la promoción de un desempeño responsable y
                  ético. También puede intervenir como órgano consultor frente
                  a instituciones públicas y privadas que requieran aportes
                  especializados desde la antropología.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Entre sus objetivos se encuentra impulsar la jerarquización
                  de la profesión, favorecer la formación continua y promover
                  la articulación entre el trabajo antropológico, las políticas
                  públicas y las demandas sociales de las comunidades de
                  Jujuy. La escala y el ritmo de estas acciones pueden variar
                  según cada período de gestión, pero el marco legal y las
                  atribuciones institucionales se mantienen vigentes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 md:p-10">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  Misión y proyección hacia el futuro
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  La misión del Colegio es garantizar un ejercicio profesional
                  de la antropología que sea técnicamente competente, éticamente
                  responsable y socialmente comprometido con la realidad de
                  Jujuy. En esa dirección, el Colegio se proyecta como un
                  espacio de referencia para las nuevas generaciones de
                  graduadas y graduados, y como interlocutor válido ante el
                  Estado y la sociedad cuando se requiere la mirada
                  antropológica para comprender y abordar problemáticas
                  sociales, culturales y territoriales.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
