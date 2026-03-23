import { Card, CardContent } from "@/components/ui/card";

type Autoridad = {
  nombre: string;
  cargo: string;
  imagen: string;
  nivel: number; // 1: Presidencia, 2: Secretarías, 3: Vocales
  matricula?: string; // Campo nuevo solicitado
};

const autoridades: Autoridad[] = [
  { 
    nombre: "Lic. Rafael Carrillo", 
    cargo: "Presidente", 
    imagen: "/autoridades/carrillo.jpeg", 
    nivel: 1, 
    matricula: "MP 057" 
  },
  { 
    nombre: "Lic. Marcela Fernández", 
    cargo: "Vicepresidenta", 
    imagen: "/autoridades/fernandez.jpeg", 
    nivel: 1, 
    matricula: "MP 091" 
  },
  { 
    nombre: "Lic. Guillermo Chauque", 
    cargo: "Secretario", 
    imagen: "/autoridades/chauque.jpeg", 
    nivel: 2, 
    matricula: "MP 088" 
  },
  { 
    nombre: "Lic. Martín Darío Valda", 
    cargo: "Prosecretario", 
    imagen: "/autoridades/valda.jpeg", 
    nivel: 2, 
    matricula: "MP 046" 
  },
  { 
    nombre: "Lic. Lorena Claudia García", 
    cargo: "Tesorera", 
    imagen: "/autoridades/garcia.jpeg", 
    nivel: 2, 
    matricula: "MP 089" 
  },
  { 
    nombre: "Lic. Lucas Darío Caucota", 
    cargo: "Protesorero", 
    imagen: "/autoridades/caucota.jpeg", 
    nivel: 2, 
    matricula: "MP 094" 
  },
  { 
    nombre: "Lic. Aníbal Rolando Villarroel", 
    cargo: "Vocal", 
    imagen: "/autoridades/villarroel.jpeg", 
    nivel: 3, 
    matricula: "MP 100" 
  },
  { 
    nombre: "Lic. Jorge Luis Morales", 
    cargo: "Vocal", 
    imagen: "/autoridades/morales.jpeg", 
    nivel: 3, 
    matricula: "MP 042" 
  },
  { 
    nombre: "Lic. Ignacio Bejarano", 
    cargo: "Vocal", 
    imagen: "/autoridades/bejarano.jpeg", 
    nivel: 3, 
    matricula: "MP 011" 
  },
  { 
    nombre: "Dra. Mónica Elizabeth Montenegro", 
    cargo: "Vocal", 
    imagen: "/autoridades/montenegro.jpeg", 
    nivel: 3, 
    matricula: "MP 017" 
  },
  { 
    nombre: "Lic. Emilia Vargas", 
    cargo: "Vocal", 
    imagen: "/autoridades/vargas.jpeg", 
    nivel: 3, 
    matricula: "MP 008" 
  },
  { 
    nombre: "Lic. Marcelo Fernando Sadir", 
    cargo: "Vocal", 
    imagen: "/autoridades/sadir.jpeg", 
    nivel: 3, 
    matricula: "MP 018" 
  },
];

export default function ConsejoDirectivo() {
  const presidencia = autoridades.filter(a => a.nivel === 1);
  const secretarias = autoridades.filter(a => a.nivel === 2);
  const vocales = autoridades.filter(a => a.nivel === 3);

  const AutoridadCard = ({ autoridad }: { autoridad: Autoridad }) => (
    <Card className="group overflow-hidden border border-slate-100 bg-card shadow-md hover:shadow-xl transition-all duration-300">
      <CardContent className="p-0">
        {/* Cambiado a aspect-square para que las fotos sean más chicas */}
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={autoridad.imagen}
            alt={autoridad.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-4 md:p-5 text-center">
          <div className="inline-block px-2 py-0.5 mb-2 text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
            {autoridad.cargo}
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-800 leading-tight">
            {autoridad.nombre}
          </h3>
          {/* Muestra la matrícula si existe */}
          {autoridad.matricula && (
            <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide">
              {autoridad.matricula}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="bg-secondary py-12 md:py-20 border-b border-slate-100 ">
        <div className="container-main text-center">
          <h1 className="section-title text-3xl md:text-5xl">Comisión Directiva</h1>
          <p className="section-subtitle max-w-2xl mx-auto mt-4 text-slate-600">
            Autoridades vigentes del Colegio de Graduados en Antropología de Jujuy.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE AUTORIDADES */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-main">
          
          {/* Nivel 1: Presidencia - Centrados y un poco más amplios */}
          <div className="flex justify-center mb-12 md:mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-8 w-full max-w-2xl">
              {presidencia.map((a) => (
                <AutoridadCard key={a.nombre} autoridad={a} />
              ))}
            </div>
          </div>

          {/* Nivel 2: Secretarías y Tesorería */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {secretarias.map((a) => (
              <AutoridadCard key={a.nombre} autoridad={a} />
            ))}
          </div>

          {/* Separador de Vocales */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="h-[1px] bg-slate-200 flex-1"></div>
            <h2 className="font-serif text-xl md:text-2xl text-slate-400 italic font-medium">Vocales</h2>
            <div className="h-[1px] bg-slate-200 flex-1"></div>
          </div>

          {/* Nivel 3: Vocales - Grid más compacto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {vocales.map((a) => (
              <AutoridadCard key={a.nombre} autoridad={a} />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}