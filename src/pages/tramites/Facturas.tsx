import { useState } from "react";
import { Search, FileText, Download, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getProfesionalByDniMatricula, getFacturasByProfesional } from "@/lib/dataAdapter";

export default function Facturas() {
  const { toast } = useToast();
  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const profesional = getProfesionalByDniMatricula(dni, matricula);
    
    if (profesional) {
      const facturas = getFacturasByProfesional(profesional.id);
      setResult({ profesional, facturas });
    } else {
      setResult("not_found");
    }
    
    setIsSearching(false);
  };

  const formatMes = (mes: string) => {
    const [year, month] = mes.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Descarga de Facturas</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Acceda al historial de facturas emitidas por el Colegio
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container-main max-w-4xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif">Ingrese sus datos</CardTitle>
              <CardDescription>
                Complete los campos para acceder a sus facturas
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
                    {isSearching ? "Buscando..." : "Buscar Facturas"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && result !== "not_found" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="font-serif">Historial de Facturas</CardTitle>
                <CardDescription>
                  {result.profesional.nombre} - Matrícula: {result.profesional.matricula}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.facturas.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Período</TableHead>
                            <TableHead>Fecha de Emisión</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.facturas.map((factura: any) => (
                            <TableRow key={factura.id}>
                              <TableCell className="font-medium">
                                {formatMes(factura.mes)}
                              </TableCell>
                              <TableCell>
                                {new Date(factura.createdAt).toLocaleDateString('es-ES')}
                              </TableCell>
                              <TableCell className="text-right">
                                <a 
                                  href={factura.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar PDF
                                  </Button>
                                </a>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {result.facturas.map((factura: any) => (
                        <div 
                          key={factura.id}
                          className="bg-secondary/50 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-medium">{formatMes(factura.mes)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Calendar className="w-4 h-4" />
                            Emitida: {new Date(factura.createdAt).toLocaleDateString('es-ES')}
                          </div>
                          <a 
                            href={factura.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              Descargar PDF
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No hay facturas disponibles</p>
                    <p className="text-muted-foreground">
                      Aún no se han emitido facturas para su cuenta
                    </p>
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
