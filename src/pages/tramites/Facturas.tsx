import { useState } from "react";
import { Search, FileText, Download, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getUltimaFacturaPorMatricula, ProfesionalPublico, Factura } from "@/lib/dataAdapter";
import { Label } from "@radix-ui/react-label";

type ResultadoConsulta =
  | { profesional: ProfesionalPublico; factura: Factura | null }
  | "not_found"
  | null;

export default function Facturas() {
  const { toast } = useToast();
  const [matricula, setMatricula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<ResultadoConsulta>(null);

  const handleConsulta = async () => {
    if (!matricula.trim()) {
      toast({
        title: "Matrícula requerida",
        description: "Ingrese su número de matrícula para consultar",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    const res = await getUltimaFacturaPorMatricula(matricula.trim());

    if (!res) {
      setResult("not_found");
    } else {
      setResult(res);
    }

    setIsSearching(false);
  };

  const formatMes = (mes: string | null | undefined) => {
    if (!mes) return "-";
    const [year, month] = mes.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Descarga de Facturas</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Ingrese su número de matrícula para acceder a su última factura emitida.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-main max-w-3xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Consulta de factura</CardTitle>
              <CardDescription>
                Ingrese solo su número de matrícula, sin DNI ni otros datos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    placeholder="ANT-2024-001"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleConsulta} disabled={isSearching} className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? "Buscando..." : "Buscar factura"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultado encontrado */}
          {result && result !== "not_found" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-serif">Última factura emitida</CardTitle>
                <CardDescription>
                  {result.profesional.nombre} – Matrícula: {result.profesional.matricula}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.factura ? (
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          Factura {result.factura.numero}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Emitida el{" "}
                          {new Date(result.factura.fechaEmision).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Período: {formatMes(result.factura.periodo)} – Monto: $
                        {result.factura.importe.toLocaleString()}
                      </span>
                    </div>

                    {result.factura.urlPdf ? (
                      <a
                        href={result.factura.urlPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="mt-2 w-full sm:w-auto">
                          <Download className="w-4 h-4 mr-2" />
                          Descargar PDF
                        </Button>
                      </a>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        Esta factura aún no tiene un PDF asociado.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">Sin facturas emitidas</p>
                    <p className="text-sm text-muted-foreground">
                      Todavía no se registran facturas para esta matrícula.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* No encontrado */}
          {result === "not_found" && (
            <Card>
              <CardContent className="p-10 text-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">No se encontraron datos</p>
                <p className="text-sm text-muted-foreground">
                  Verifique que el número de matrícula ingresado sea correcto.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
