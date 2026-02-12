import { Card, CardContent } from "@/components/ui/card";

type Autoridad = {
  nombre: string;
  cargo: string;
  imagen: string;
  nivel: number; // 1: Presidencia, 2: Secretarías, 3: Vocales
};

const autoridades: Autoridad[] = [
  { nombre: "Lic. Rafael Carrillo", cargo: "Presidente", imagen: "/autoridades/carrillo.jpeg", nivel: 1 },
  { nombre: "Lic. Marcela Fernández", cargo: "Vicepresidenta", imagen: "/autoridades/fernandez.jpeg", nivel: 1 },
  { nombre: "Lic. Guillermo Chauque", cargo: "Secretario", imagen: "/autoridades/chauque.jpeg", nivel: 2 },
  { nombre: "Lic. Martín Valda", cargo: "Prosecretario", imagen: "/autoridades/valda.jpeg", nivel: 2 },
  { nombre: "Lic. Lorena García", cargo: "Tesorera", imagen: "/autoridades/garcia.jpeg", nivel: 2 },
  { nombre: "Lic. Lucas Caucota", cargo: "Protesorero", imagen: "/autoridades/caucota.jpeg", nivel: 2 },
  { nombre: "Lic. Aníbal Villarroel", cargo: "Vocal", imagen: "/autoridades/villarroel.jpeg", nivel: 3 },
  { nombre: "Lic. Jorge Morales", cargo: "Vocal", imagen: "/autoridades/morales.jpeg", nivel: 3 },
  { nombre: "Lic. Ignacio Bejarano", cargo: "Vocal", imagen: "/autoridades/bejarano.jpeg", nivel: 3 },
  { nombre: "Dra. Mónica Montenegro", cargo: "Vocal", imagen: "/autoridades/montenegro.jpeg", nivel: 3 },
  { nombre: "Lic. Emilia Vargas", cargo: "Vocal", imagen: "/autoridades/vargas.jpeg", nivel: 3 },
  { nombre: "Lic. Fernando Sadir", cargo: "Vocal", imagen: "/autoridades/sadir.jpeg", nivel: 3 },
];

export default function ConsejoDirectivo() {
  // Filtramos por niveles para la organización en desktop
  const presidencia = autoridades.filter(a => a.nivel === 1);
  const secretarias = autoridades.filter(a => a.nivel === 2);
  const vocales = autoridades.filter(a => a.nivel === 3);

  const AutoridadCard = ({ autoridad }: { autoridad: Autoridad }) => (
    <Card className="group overflow-hidden border-none bg-card card-hover shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={autoridad.imagen}
            alt={autoridad.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6 text-center">
          <div className="inline-block px-2 py-0.5 mb-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-sm">
            {autoridad.cargo}
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground leading-tight">
            {autoridad.nombre}
          </h3>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      {/* HERO ORIGINAL (Mantenido tal cual) */}
      <section className="bg-secondary py-20">
        <div className="container-main text-center">
          <h1 className="section-title">Consejo Directivo</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Autoridades del Colegio de Graduados en Antropología de Jujuy.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE AUTORIDADES CON JERARQUÍA */}
      <section className="py-20 bg-background">
        <div className="container-main">
          
          {/* Nivel 1: Presidencia - Cards un poco más grandes en Desktop */}
          <div className="flex justify-center mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
              {presidencia.map((a) => (
                <AutoridadCard key={a.nombre} autoridad={a} />
              ))}
            </div>
          </div>

          {/* Nivel 2: Secretarías y Tesorería */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {secretarias.map((a) => (
              <AutoridadCard key={a.nombre} autoridad={a} />
            ))}
          </div>

          {/* Separador sutil */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-[1px] bg-border flex-1"></div>
            <h2 className="font-serif text-2xl text-muted-foreground italic">Vocales</h2>
            <div className="h-[1px] bg-border flex-1"></div>
          </div>

          {/* Nivel 3: Vocales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vocales.map((a) => (
              <AutoridadCard key={a.nombre} autoridad={a} />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}