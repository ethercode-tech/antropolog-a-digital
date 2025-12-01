import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public pages
import Index from "./pages/Index";
import Historia from "./pages/Historia";
import Servicios from "./pages/Servicios";
import Noticias from "./pages/Noticias";
import NoticiaDetalle from "./pages/NoticiaDetalle";
import Publicaciones from "./pages/Publicaciones";
import Galeria from "./pages/Galeria";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNoticias from "./pages/admin/AdminNoticias";
import AdminNoticiaForm from "./pages/admin/AdminNoticiaForm";
import AdminDocumentos from "./pages/admin/AdminDocumentos";
import AdminDocumentoForm from "./pages/admin/AdminDocumentoForm";
import AdminGaleria from "./pages/admin/AdminGaleria";
import AdminGaleriaForm from "./pages/admin/AdminGaleriaForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />
            <Route path="/publicaciones" element={<Publicaciones />} />
            <Route path="/galeria" element={<Galeria />} />
            <Route path="/contacto" element={<Contacto />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="noticias" element={<AdminNoticias />} />
            <Route path="noticias/nueva" element={<AdminNoticiaForm />} />
            <Route path="noticias/:id" element={<AdminNoticiaForm />} />
            <Route path="documentos" element={<AdminDocumentos />} />
            <Route path="documentos/nuevo" element={<AdminDocumentoForm />} />
            <Route path="documentos/:id" element={<AdminDocumentoForm />} />
            <Route path="galeria" element={<AdminGaleria />} />
            <Route path="galeria/nueva" element={<AdminGaleriaForm />} />
            <Route path="galeria/:id" element={<AdminGaleriaForm />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
