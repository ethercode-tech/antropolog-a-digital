import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { getUsefulLinks } from "@/lib/dataAdapter";
import { useEffect, useState } from "react";

export function Footer() {
  const [usefulLinks, setUsefulLinks] = useState<{title:string,url:string}[]>([]);

  useEffect(() => {
    getUsefulLinks().then((links) => {
      setUsefulLinks(links);
    });
  }, []);
  
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-lg">Colegio de Antropología</h3>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Institución que agrupa a los profesionales de la antropología, promoviendo el ejercicio ético y el desarrollo de la disciplina.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: "/historia", label: "Historia" },
                { href: "/servicios", label: "Servicios" },
                { href: "/noticias", label: "Noticias" },
                { href: "/publicaciones", label: "Publicaciones" },
                { href: "/galeria", label: "Galería" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Enlaces útiles</h4>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 text-primary" />
                <span className="text-primary-foreground/70 text-sm">
                  Av. Universidad 1234, San Salvador de Jujuy
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-primary-foreground/70 text-sm">+54 (388) 000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-primary-foreground/70 text-sm">info@cgajujuy.org.ar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-primary-foreground/60 text-sm flex items-center gap-2">
            © {new Date().getFullYear()} Colegio de Antropología de Jujuy
            <span className="opacity-50">•</span>
            Hecho en Jujuy 
            <span className="inline-block">🌵</span>
            por 
            <a
              href="https://ethercode.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline text-primary-foreground/70 ml-1"
            >
              EtherCode
            </a>
          </p>

          <a
            href="/admin/login"
            className="text-primary-foreground/40 hover:text-primary-foreground/60 text-xs transition-colors"
          >
            Acceso administrador
          </a>

        </div>
        </div>


      </div>
    </footer>
  );
}
