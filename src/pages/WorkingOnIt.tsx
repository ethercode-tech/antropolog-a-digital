import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const WorkingOnIt = () => {
  const location = useLocation();

  useEffect(() => {
    console.info("Feature en desarrollo visitada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink">
          Estamos trabajando en esta funcionalidad
        </h1>

        <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
          Esta sección está en construcción, pronto vas a poder disfrutarla.
          Estamos puliendo la experiencia para que valga la pena.
        </p>

        <a
          href="/"
          className="inline-block rounded-md border border-primary px-5 py-2 text-primary hover:bg-primary hover:text-white transition"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default WorkingOnIt;
