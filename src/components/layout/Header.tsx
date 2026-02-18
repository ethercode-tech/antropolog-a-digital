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
  Users,
  History,
  FileText,
  Image,
  UsersRound,
  MessageSquare 
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
        href: "/comision-directiva",
        label: "Comisión Directiva",
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
      {
        href: "/formacion/cursos",
        label: "Cursos, Seminarios y Capacitaciones",
        description: "Propuestas de formación y actualización continua.",
        icon: BookOpen,
      },
    ],
  },
  {
    type: "link",
    href: "/contacto",
    label: "Solicitudes y contacto",
    icon: MessageSquare 
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<Record<string, boolean>>({});
  const location = useLocation();

  // ==========================================
  // CONFIGURACIÓN DE COLORES (CAMBIA AQUÍ)
  // ==========================================
  const isPrimaryBg = true; // true = Fondo Azul (Primary) | false = Fondo Blanco
  // ==========================================

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActiveHref = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isDropdownActive = (entry: DropdownLink) =>
    entry.items.some((item) => isActiveHref(item.href));

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setOpenDesktopDropdown(null);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 shadow-sm",
      isPrimaryBg ? "bg-primary/80 border-white/10" : "bg-white/95 border-slate-200"
    )}>
      <div className="container-main">
        <div className="flex items-center justify-between min-h-16 md:min-h-20 gap-4">
          
          <Link to="/" className="flex items-center group shrink-0" onClick={closeAllMenus}>
            <img
              src={isPrimaryBg ? "/logo/logo.co.blanco.svg" : "/logo/logo.conletras.principal.svg"}
              alt="Logo Colegio"
              className="h-10 w-auto md:h-12 lg:h-14 xl:h-16 object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-end gap-x-1 xl:gap-x-2">
            <div className="flex items-center gap-x-1">
              {navEntries.map((entry) => {
                const active = entry.type === "link" ? isActiveHref(entry.href) : isDropdownActive(entry);
                const isOpen = openDesktopDropdown === entry.label;

                const navItemClasses = cn(
                  "px-1.5 py-2 rounded-md text-[11px] xl:text-[12px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                  // Si el fondo es Primary: activo=blanco/texto-azul, inactivo=texto-blanco
                  // Si el fondo es Blanco: activo=azul/texto-blanco, inactivo=texto-gris
                  isPrimaryBg 
                    ? (active || isOpen ? "bg-white text-primary" : "text-white hover:bg-white/10")
                    : (active || isOpen ? "bg-primary text-white" : "text-slate-600 hover:text-primary hover:bg-slate-50")
                );

                if (entry.type === "link") {
                  return (
                    <Link key={entry.href} to={entry.href} onClick={closeAllMenus} className={navItemClasses}>
                      {entry.label}
                    </Link>
                  );
                }

                return (
                  <div 
                    key={entry.label} 
                    className="relative py-4"
                    onMouseEnter={() => setOpenDesktopDropdown(entry.label)}
                    onMouseLeave={() => setOpenDesktopDropdown(null)}
                  >
                    <button type="button" className={cn("inline-flex items-center gap-1", navItemClasses)}>
                      <span>{entry.label}</span>
                      <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    
                    {isOpen && (
                      <div className={cn(
                        "absolute top-[80%] left-0 mt-2 w-72 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden text-left",
                        isPrimaryBg ? "bg-primary border border-white/20" : "bg-primary shadow-xl" 
                      )}>
                        <div className="py-2">
                          {entry.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeAllMenus}
                              className={cn(
                                "flex items-start gap-3 px-4 py-3 text-sm transition-colors normal-case",
                                isPrimaryBg
                                  ? (isActiveHref(item.href) ? "bg-white/20 text-white" : "text-white/90 hover:bg-white/10")
                                  : (isActiveHref(item.href) ? "bg-primary/5 text-primary" : "text-secondary hover:text-primary hover:bg-slate-50")
                              )}
                            >
                              {item.icon && <item.icon className={cn("w-4 h-4 mt-0.5 shrink-0", isPrimaryBg ? "text-white/70" : "text-terciary")} />}
                              <div>
                                <p className="font-semibold leading-none">{item.label}</p>
                                {item.description && (
                                  <p className={cn("text-[11px] mt-1.5 leading-tight", isPrimaryBg ? "text-white/60" : "text-slate-500")}>
                                    {item.description}
                                  </p>
                                )}
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
            
            <div className="ml-2">
              <Button asChild size="sm" className={cn(
                "font-bold uppercase tracking-widest text-[11px] px-5 h-10 shadow-md",
                isPrimaryBg ? "bg-white text-primary hover:bg-slate-100" : "bg-primary hover:bg-primary/90 text-white"
              )}>
                <Link to="/matriculados" onClick={closeAllMenus}>
                  Padrón <Users className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("lg:hidden", isPrimaryBg ? "text-white hover:bg-white/10" : "text-primary hover:bg-primary/10")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className={cn(
            "lg:hidden py-4 border-t animate-in slide-in-from-top-2",
            isPrimaryBg ? "border-white/10" : "border-slate-100"
          )}>
            <div className="flex flex-col gap-2 px-2">
              {navEntries.map((entry) => {
                const baseMobileClasses = "flex items-center gap-3 px-4 py-3 rounded-md font-bold uppercase tracking-wide text-xs transition-colors";
                
                if (entry.type === "link") {
                  return (
                    <Link
                      key={entry.href}
                      to={entry.href}
                      onClick={closeAllMenus}
                      className={cn(
                        baseMobileClasses,
                        isActiveHref(entry.href) 
                          ? (isPrimaryBg ? "bg-white text-primary" : "bg-primary text-white") 
                          : (isPrimaryBg ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-50")
                      )}
                    >
                      {entry.icon && <entry.icon className={cn("w-5 h-5", isActiveHref(entry.href) ? (isPrimaryBg ? "text-primary" : "text-white") : (isPrimaryBg ? "text-white" : "text-primary"))} />}
                      {entry.label}
                    </Link>
                  );
                }

                const open = !!openMobileDropdowns[entry.label];
                return (
                  <div key={entry.label} className="mb-1">
                    <button
                      type="button"
                      className={cn(
                        "w-full justify-between", 
                        baseMobileClasses, 
                        isPrimaryBg ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-50"
                      )}
                      onClick={() => toggleMobileDropdown(entry.label)}
                    >
                      <span className="flex items-center gap-3">
                        {entry.icon && <entry.icon className={cn("w-5 h-5", isPrimaryBg ? "text-white" : "text-primary")} />}
                        {entry.label}
                      </span>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", isPrimaryBg ? "text-white/50" : "text-slate-400", open && "rotate-180")} />
                    </button>
                    {open && (
                      <div className={cn(
                        "rounded-lg mt-1 ml-4 border-l-2",
                        isPrimaryBg ? "bg-white/5 border-white/30" : "bg-slate-50 border-primary/30"
                      )}>
                        {entry.items.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={closeAllMenus}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 text-[13px] normal-case",
                              isPrimaryBg ? "text-white/80" : "text-slate-600",
                              isActiveHref(item.href) && (isPrimaryBg ? "text-white font-bold bg-white/10" : "text-primary font-bold bg-primary/5")
                            )}
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

              <div className={cn("mt-4 pt-4 border-t", isPrimaryBg ? "border-white/10" : "border-slate-100")}>
                <Link
                  to="/matriculados"
                  onClick={closeAllMenus}
                  className={cn(
                    "mx-2 py-4 px-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-transform",
                    isPrimaryBg ? "bg-white text-primary" : "bg-primary text-white"
                  )}
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