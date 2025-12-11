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
  BookOpen as BookIcon,
  FileText,
  Image,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SimpleLink = {
  type: "link";
  href: string;
  label: string;
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
    label: "Trámites y servicios",
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
      // {
      //   href: "/tramites/constancia",
      //   label: "Constancias",
      //   description: "Solicitar constancias oficiales.",
      //   icon: Award,
      // },
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
    label: "Información institucional",
    icon: History,
    items: [
      {
        href: "/historia",
        label: "Historia y marco institucional",
        description: "Origen, objetivos y normativa.",
        icon: History,
      },
      {
        href: "/servicios",
        label: "Áreas y servicios",
        description: "Ámbitos de actuación y acompañamiento.",
        icon: BookIcon,
      },
      {
        href: "/publicaciones",
        label: "Publicaciones y documentos",
        description: "Material de consulta y resoluciones.",
        icon: FileText,
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
    label: "Contacto",
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(
    null
  );
  const [openMobileDropdowns, setOpenMobileDropdowns] =
    useState<Record<string, boolean>>({});
  const location = useLocation();

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={closeAllMenus}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif font-semibold text-lg md:text-xl text-foreground leading-tight">
                Colegio de Antropología
              </h1>
              <p className="text-xs text-muted-foreground">
                Portal de servicios profesionales
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3">
            {/* Bloque central */}
            <div className="flex items-center gap-2">
              {navEntries.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <Link
                      key={entry.href}
                      to={entry.href}
                      onClick={closeAllMenus}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                        isActiveHref(entry.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {entry.label}
                    </Link>
                  );
                }

                const Icon = entry.icon;
                const active = isDropdownActive(entry);
                const isOpen = openDesktopDropdown === entry.label;

                return (
                  <div key={entry.label} className="relative">
                    <button
                      type="button"
                      onClick={() => handleDesktopDropdownToggle(entry.label)}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                        active || isOpen
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{entry.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          isOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div
                        className={cn(
                          "absolute right-0 mt-2 rounded-lg border border-border bg-popover shadow-lg animate-fade-in z-50",
                          "max-w-[min(20rem,calc(100vw-2rem))]"
                        )}
                      >
                        <div className="py-2">
                          {entry.items.map((item) => {
                            const ItemIcon = item.icon;
                            const itemActive = isActiveHref(item.href);
                            return (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={closeAllMenus}
                                className={cn(
                                  "flex items-start gap-3 px-4 py-3 text-sm transition-colors",
                                  itemActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                                )}
                              >
                                {ItemIcon && (
                                  <div className="mt-0.5">
                                    <ItemIcon className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{item.label}</p>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTAs derecha */}
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <Button asChild size="sm" variant="secondary" className="whitespace-nowrap">
                <Link to="/tramites/matriculacion" onClick={closeAllMenus}>
                  Trámites en línea
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button asChild size="sm" className="whitespace-nowrap">
                <Link to="/matriculados" onClick={closeAllMenus}>
                  Buscar profesional
                  <Users className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Accesos prioritarios */}
              <Link
                to="/matriculados"
                onClick={closeAllMenus}
                className="px-4 py-3 rounded-md text-base font-semibold flex items-center justify-between bg-primary/10 text-primary"
              >
                <span>Padrón de matriculados</span>
                <Users className="w-4 h-4" />
              </Link>

              <Link
                to="/tramites/matriculacion"
                onClick={closeAllMenus}
                className="px-4 py-3 rounded-md text-base font-semibold flex items-center justify-between bg-primary/5 text-primary"
              >
                <span>Trámites en línea</span>
                <ClipboardList className="w-4 h-4" />
              </Link>

              {/* Resto del menú */}
              {navEntries.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <Link
                      key={entry.href}
                      to={entry.href}
                      onClick={closeAllMenus}
                      className={cn(
                        "px-4 py-3 rounded-md text-base font-medium transition-colors",
                        isActiveHref(entry.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      {entry.label}
                    </Link>
                  );
                }

                const Icon = entry.icon;
                const open = !!openMobileDropdowns[entry.label];

                return (
                  <div
                    key={entry.label}
                    className="rounded-md border border-border/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-foreground"
                      onClick={() => toggleMobileDropdown(entry.label)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-primary" />}
                        {entry.label}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          open ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {open && (
                      <div className="border-t border-border/60 bg-muted/40">
                        {entry.items.map((item) => {
                          const ItemIcon = item.icon;
                          const itemActive = isActiveHref(item.href);
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={closeAllMenus}
                              className={cn(
                                "flex items-center gap-2 px-5 py-2.5 text-sm",
                                itemActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                              )}
                            >
                              {ItemIcon && (
                                <ItemIcon className="w-4 h-4 text-primary/80" />
                              )}
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
