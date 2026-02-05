import { Card, CardContent } from "@/components/ui/card";

type Autoridad = {
  nombre: string;
  cargo: string;
  imagen: string;
};

const autoridades: Autoridad[] = [
  {
    nombre: "Lic. Rafael Carrillo",
    cargo: "Presidente",
    imagen: "/autoridades/carrillo.jpg",
  },
  {
    nombre: "Lic. Marcela Fernández",
    cargo: "Vicepresidenta",
    imagen: "/autoridades/fernandez.jpg",
  },
  {
    nombre: "Lic. Guillermo Chauque",
    cargo: "Secretario",
    imagen: "/autoridades/chauque.jpg",
  },
  {
    nombre: "Lic. Martín Valda",
    cargo: "Prosecretario",
    imagen: "/autoridades/valda.jpg",
  },
  {
    nombre: "Lic. Lorena García",
    cargo: "Tesorera",
    imagen: "/autoridades/garcia.jpg",
  },
  {
    nombre: "Lic. Lucas Caucota",
    cargo: "Protesorero",
    imagen: "/autoridades/caucota.jpg",
  },
  {
    nombre: "Lic. Aníbal Villarroel",
    cargo: "Vocal",
    imagen: "/autoridades/villarroel.jpg",
  },
  {
    nombre: "Lic. Jorge Morales",
    cargo: "Vocal",
    imagen: "/autoridades/morales.jpg",
  },
  {
    nombre: "Lic. Ignacio Bejarano",
    cargo: "Vocal",
    imagen: "/autoridades/bejarano.jpg",
  },
  {
    nombre: "Dra. Mónica Montenegro",
    cargo: "Vocal",
    imagen: "/autoridades/montenegro.jpg",
  },
  {
    nombre: "Lic. Emilia Vargas",
    cargo: "Vocal",
    imagen: "/autoridades/vargas.jpg",
  },
  {
    nombre: "Lic. Fernando Sadir",
    cargo: "Vocal",
    imagen: "/autoridades/sadir.jpg",
  },
];

export default function ConsejoDirectivo() {
  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="bg-secondary py-20">
        <div className="container-main text-center">
          <h1 className="section-title">Consejo Directivo</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Autoridades del Colegio de Graduados en Antropología de Jujuy.
          </p>
        </div>
      </section>

      {/* AUTORIDADES */}
      <section className="py-20">
        <div className="container-main">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-14">
            Autoridades del Consejo Directivo
          </h2>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {autoridades.map((autoridad) => (
              <Card
                key={autoridad.nombre}
                className="border-border bg-card text-center card-hover"
              >
                <CardContent className="p-8 flex flex-col items-center">
                  <div className="w-40 h-40 mb-6 rounded-full overflow-hidden border border-border shadow-sm">
                    <img
                      src={autoridad.imagen}
                      alt={autoridad.nombre}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {autoridad.nombre}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {autoridad.cargo}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
