// src/components/layout/AdminLayout.tsx
import { useEffect, useState } from "react";
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Image,
  LogOut,
  Menu,
  X,
  BookOpen,
  // Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  // { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/matriculacion", label: "Matriculación", icon: FileText },
  { href: "/admin/deudas", label: "Deudas", icon: FileText },
  { href: "/admin/consultas", label: "Consultas generales", icon: FileText },
  // { href: "/admin/constancias", label: "Constancias", icon: FileText },
  { href: "/admin/facturas", label: "Facturas", icon: FileText },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/documentos", label: "Documentos", icon: FileText },
  { href: "/admin/galeria", label: "Galería", icon: Image },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Guard: verificar sesión real de Supabase al montar
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // limpieza por si quedó algo viejo
          localStorage.removeItem("adminAuth");
          if (isMounted) {
            navigate("/admin/login", { replace: true });
          }
        } else {
          // opcional: podrías validar que el mail sea admin
          localStorage.setItem("adminAuth", "true");
        }
      } catch (err) {
        // si algo falla, lo más seguro es sacarlo del panel
        localStorage.removeItem("adminAuth");
        if (isMounted) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // si falla igual limpiamos el front
    }
    localStorage.removeItem("adminAuth");
    navigate("/admin/login", { replace: true });
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Mientras chequea sesión, no mostramos el panel para evitar parpadeos raros
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Verificando sesión del administrador…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-3">
          <img
    src="/logo/logo.sinletras.blanco.svg"
    alt="Colegio de Antropología"
    className="w-14 h-10 md:w-12 md:h-12 object-contain"
  />
            <div>
              <h1 className="font-serif font-semibold text-sidebar-foreground">
                Admin
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Colegio de Antropología
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar sesión
          </Button>
          <Link
            to="/"
            className="block mt-2 text-center text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors"
          >
            Ver sitio público →
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-sidebar-foreground"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link
            to="/admin"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
           <img
    src="/logo/logo.sinletras.blanco.svg"
    alt="Colegio de Antropología"
    className="w-14 h-10 md:w-12 md:h-12 object-contain"
  />
            <div>
              <h1 className="font-serif font-semibold text-sidebar-foreground">
                Admin
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Colegio de Antropología
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-background border-b border-border p-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="font-serif font-semibold">
            Panel Administrativo
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
