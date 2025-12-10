import { useState } from "react";
import { Search, FileText, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getProfesionalByDniMatricula, ProfesionalPublico, EstadoSolicitud } from "@/lib/dataAdapter";

const estadoLabels: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente de Aprobación",
  en_revision: "En Revisión",
  observado: "Observado",
  aprobado: "Aprobada",
  rechazado: "Rechazada"
};

type ConstanciaResult = {
  profesional: ProfesionalPublico;
  constancia: {
    id: string;
    estado: EstadoSolicitud;
    pdfFinalUrl?: string;
    createdAt: string;
  } | null;
};

export default function Constancia() {
  const { toast } = useToast();
  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [result, setResult] = useState<ConstanciaResult | "not_found" | null>(null);

  const handleConsulta = async () => {
    if (!dni || !matricula) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingrese su DNI y matrícula",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    const profesional = await getProfesionalByDniMatricula(dni, matricula);
    
    if (profesional) {
      // Por ahora retornamos sin constancia (se puede extender después)
      setResult({ profesional, constancia: null });
    } else {
      setResult("not_found");
    }
    
    setIsSearching(false);
  };

  const handleSolicitarConstancia = async () => {
    setIsRequesting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Solicitud enviada",
      description: "Su solicitud de constancia ha sido recibida. Será procesada en los próximos días hábiles.",
    });
    
    // Update result to show pending state
    if (result && result !== "not_found") {
      setResult({
        ...result,
        constancia: {
          id: "new",
          estado: "pendiente",
          createdAt: new Date().toISOString()
        }
      });
    }
    
    setIsRequesting(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Constancia de Habilitación</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Solicite o descargue su constancia de habilitación profesional
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-main max-w-3xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Verificar Identidad</CardTitle>
              <CardDescription>
                Ingrese sus datos para consultar o solicitar su constancia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    placeholder="12345678"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                  />
                </div>
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
                    {isSearching ? "Buscando..." : "Verificar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && result !== "not_found" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-serif">Estado de Constancia</CardTitle>
                <CardDescription>
                  {result.profesional.nombre} - Matrícula: {result.profesional.matricula}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.constancia ? (
                  <div className="space-y-6">
                    {/* Status */}
                    <div className={`rounded-lg p-6 text-center ${
                      result.constancia.estado === "aprobado" 
                        ? "bg-green-50 border border-green-200" 
                        : result.constancia.estado === "rechazado"
                        ? "bg-red-50 border border-red-200"
                        : "bg-yellow-50 border border-yellow-200"
                    }`}>
                      {result.constancia.estado === "aprobado" ? (
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      ) : result.constancia.estado === "rechazado" ? (
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                      ) : (
                        <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      )}
                      <p className="font-semibold text-lg mb-1">
                        {estadoLabels[result.constancia.estado]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Solicitud realizada el {new Date(result.constancia.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>

                    {/* Download Button */}
                    {result.constancia.estado === "aprobado" && result.constancia.pdfFinalUrl && (
                      <div className="text-center">
                        <a 
                          href={result.constancia.pdfFinalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button size="lg" className="w-full sm:w-auto">
                            <Download className="w-5 h-5 mr-2" />
                            Descargar Constancia PDF
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      No tiene constancias solicitadas
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Puede solicitar una constancia de habilitación profesional
                    </p>
                    <Button 
                      onClick={handleSolicitarConstancia} 
                      disabled={isRequesting}
                      size="lg"
                    >
                      {isRequesting ? "Enviando solicitud..." : "Solicitar Constancia"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {result === "not_found" && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No se encontraron datos</p>
                <p className="text-muted-foreground">
                  Verifique que el DNI y la matrícula ingresados sean correctos
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
