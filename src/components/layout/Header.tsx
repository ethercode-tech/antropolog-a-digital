import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  ChevronDown,
  ClipboardList,
  DollarSign,
  Receipt,
  Award,
  Users,
  History,
  FileText,
  Image,
  UsersRound,
  MessageSquare // Nuevo icono para contacto
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SimpleLink = {
  type: "link";
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type DropdownLink = {
  type: "dropdown";
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: {
    href: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

type NavEntry = SimpleLink | DropdownLink;

const navEntries: NavEntry[] = [
  {
    type: "dropdown",
    label: "Quiénes somos",
    icon: History,
    items: [
      {
        href: "/historia",
        label: "Historia y marco institucional",
        description: "Origen del Colegio, objetivos y normativa vigente.",
        icon: History,
      },
      {
        href: "/marco-legal",
        label: "Marco legal",
        description: "Ley y decreto que regulan el ejercicio profesional.",
        icon: FileText,
      },
      {
        href: "/consejo-directivo",
        label: "Consejo Directivo",
        description: "Autoridades y órganos de conducción del Colegio",
        icon: UsersRound
      }
    ],
  },
  {
    type: "dropdown",
    label: "Ejercicio profesional",
    icon: Users,
    items: [
      {
        href: "/matriculados",
        label: "Padrón de matriculados",
        description: "Profesionales habilitados para el ejercicio.",
        icon: Users,
      },
      {
        href: "/honorarios",
        label: "Honorarios orientativos",
        description: "Referencias para el ejercicio profesional.",
        icon: DollarSign,
      },
      {
        href: "/balances",
        label: "Balances institucionales",
        description: "Información económica del Colegio.",
        icon: Receipt,
      },
    ],
  },
  {
    type: "dropdown",
    label: "Trámites de colegiado",
    icon: ClipboardList,
    items: [
      {
        href: "/tramites/matriculacion",
        label: "Matriculación profesional",
        description: "Iniciar o seguir el trámite de matrícula.",
        icon: ClipboardList,
      },
      {
        href: "/tramites/deuda",
        label: "Consulta de deuda",
        description: "Ver cuotas pendientes y estado de pagos.",
        icon: DollarSign,
      },
      {
        href: "/tramites/facturas",
        label: "Facturación y comprobantes",
        description: "Descargar facturas emitidas.",
        icon: Receipt,
      },
      {
        href: "/matriculados",
        label: "Padrón de matriculados",
        description: "Buscar profesionales habilitados.",
        icon: Users,
      },
    ],
  },
  {
    type: "dropdown",
    label: "Formación profesional",
    icon: BookOpen,
    items: [
      {
        href: "/formacion/cursos",
        label: "Cursos",
        description: "Propuestas de formación continua.",
        icon: BookOpen,
      },
      {
        href: "/formacion/seminarios",
        label: "Seminarios",
        description: "Seminarios y jornadas profesionales.",
        icon: Award,
      },
      {
        href: "/formacion/capacitaciones",
        label: "Capacitaciones",
        description: "Instancias de actualización profesional.",
        icon: ClipboardList,
      },
    ],
  },
  {
    type: "dropdown",
    label: "Novedades",
    icon: FileText,
    items: [
      {
        href: "/noticias",
        label: "Noticias",
        description: "Actualidad del Colegio.",
        icon: FileText,
      },
      {
        href: "/galeria",
        label: "Galería",
        description: "Registro fotográfico de actividades.",
        icon: Image,
      },
    ],
  },
  {
    type: "link",
    href: "/contacto",
    label: "Solicitudes y contacto",
    icon: MessageSquare // Icono agregado para mobile
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActiveHref = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isDropdownActive = (entry: DropdownLink) =>
    entry.items.some((item) => isActiveHref(item.href));

  const handleDesktopDropdownToggle = (label: string) => {
    setOpenDesktopDropdown((current) => (current === label ? null : label));
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setOpenDesktopDropdown(null);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container-main">
        <div className="flex items-center justify-between min-h-16 md:min-h-20 gap-2">
          
          {/* Logo Principal */}
          <Link to="/" className="flex items-center group shrink-0 mr-2 xl:mr-6" onClick={closeAllMenus}>
            <img
              src="/logo/logo.conletras.principal.svg"
              alt="Logo Colegio"
              className="h-12 w-auto md:h-12 lg:h-14 xl:h-16 object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-between">
            <div className="flex items-center gap-x-1 xl:gap-x-2">
              {navEntries.map((entry) => {
                const active = entry.type === "link" ? isActiveHref(entry.href) : isDropdownActive(entry);
                const isOpen = openDesktopDropdown === entry.label;

                const navItemClasses = cn(
                  "px-2 py-2 rounded-md text-[13px] xl:text-sm font-bold whitespace-nowrap transition-all",
                  active || isOpen ? "bg-primary text-white" : "text-slate-600 hover:text-primary hover:bg-slate-50"
                );

                if (entry.type === "link") {
                  return (
                    <Link key={entry.href} to={entry.href} onClick={closeAllMenus} className={navItemClasses}>
                      {entry.label}
                    </Link>
                  );
                }

                return (
                  <div key={entry.label} className="relative">
                    <button type="button" onClick={() => handleDesktopDropdownToggle(entry.label)} className={cn("inline-flex items-center gap-1", navItemClasses)}>
                      <span>{entry.label}</span>
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in z-50 overflow-hidden">
                        <div className="py-2">
                          {entry.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeAllMenus}
                              className={cn("flex items-start gap-3 px-4 py-3 text-sm transition-colors", isActiveHref(item.href) ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50")}
                            >
                              {item.icon && <item.icon className="w-4 h-4 mt-0.5 text-primary/70 shrink-0" />}
                              <div>
                                <p className="font-semibold leading-none">{item.label}</p>
                                {item.description && <p className="text-[11px] text-slate-500 mt-1.5 leading-tight">{item.description}</p>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="ml-4">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white font-bold px-4 h-10">
                <Link to="/matriculados" onClick={closeAllMenus}>
                  Padrón <Users className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button*/}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-primary hover:bg-primary/90 active:bg-primary/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-slate-100 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2 px-2">
              
              {/* Categorías Principales */}
              {navEntries.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <Link
                      key={entry.href}
                      to={entry.href}
                      onClick={closeAllMenus}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md font-bold transition-colors",
                        isActiveHref(entry.href) ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      {entry.icon && <entry.icon className={cn("w-5 h-5", isActiveHref(entry.href) ? "text-white" : "text-primary")} />}
                      {entry.label}
                    </Link>
                  );
                }

                const open = !!openMobileDropdowns[entry.label];
                return (
                  <div key={entry.label} className="mb-1">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 rounded-md"
                      onClick={() => toggleMobileDropdown(entry.label)}
                    >
                      <span className="flex items-center gap-3">
                        {entry.icon && <entry.icon className="w-5 h-5 text-primary" />}
                        {entry.label}
                      </span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform text-slate-400", open && "rotate-180")} />
                    </button>
                    {open && (
                      <div className="bg-slate-50 rounded-lg mt-1 ml-4 border-l-2 border-primary/30">
                        {entry.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={closeAllMenus}
                            className={cn("flex items-center gap-3 px-4 py-3 text-sm text-slate-600", isActiveHref(item.href) && "text-primary font-bold bg-primary/5")}
                          >
                            {item.icon && <item.icon className="w-4 h-4 shrink-0" />}
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Botón Padrón - AHORA AL FINAL */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  to="/matriculados"
                  onClick={closeAllMenus}
                  className="mx-2 py-4 px-4 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
                >
                  <Users className="w-5 h-5" />
                  <span>Padrón de Matriculados</span>
                </Link>
              </div>

            </div>
          </nav>
        )}
      </div>
    </header>
  );
}