import { useState } from "react";
import {
  Search,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getProfesionalByDniMatricula,
  getDeudasByProfesional,
  Deuda as DeudaType,
  ProfesionalPublico,
} from "@/lib/dataAdapter";

export default function Deuda() {
  const { toast } = useToast();
  const [dni, setDni] = useState("");
  const [matricula, setMatricula] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<
    { profesional: ProfesionalPublico; deudas: DeudaType[] } | "not_found" | null
  >(null);

  const handleConsulta = async () => {
    if (!matricula) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingrese matrícula",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const profesional = await getProfesionalByDniMatricula(dni, matricula);

      if (profesional) {
        const deudas = await getDeudasByProfesional(profesional.id);
        setResult({ profesional, deudas });
      } else {
        setResult("not_found");
      }
    } catch (err) {
      console.error("[Deuda] error consulta:", err);
      toast({
        title: "Error al consultar",
        description: "Intente nuevamente en unos minutos",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatMes = (mes: string) => {
    const [year, month] = mes.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  };

  const totalDeuda =
    result && result !== "not_found"
      ? result.deudas
          .filter((d) => d.estado === "pendiente")
          .reduce((acc, d) => acc + d.monto, 0)
      : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Consulta de Deuda</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Consulte el estado de sus cuotas y pagos pendientes
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
                Complete los campos para consultar su estado de cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
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
                  <Button
                    onClick={handleConsulta}
                    disabled={isSearching}
                    className="w-full"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? "Buscando..." : "Consultar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {result && result !== "not_found" && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Total Pendiente
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ${totalDeuda.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cuotas Pendientes
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        result.deudas.filter(
                          (d) => d.estado === "pendiente"
                        ).length
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Cuotas Pagadas
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        result.deudas.filter((d) => d.estado === "pagado")
                          .length
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detail Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Detalle de Cuotas</CardTitle>
                  <CardDescription>
                    {result.profesional.nombre} - Matrícula:{" "}
                    {result.profesional.matricula}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.deudas.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Período</TableHead>
                          <TableHead>Concepto</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.deudas.map((deuda) => (
                          <TableRow key={deuda.id}>
                            <TableCell className="font-medium">
                              {formatMes(deuda.periodo)}
                            </TableCell>
                            <TableCell>{deuda.concepto}</TableCell>
                            <TableCell>
                              ${deuda.monto.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  deuda.estado === "pagado"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {deuda.estado === "pagado"
                                  ? "Pagado"
                                  : "Pendiente"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No hay registros de cuotas
                    </p>
                  )}
                </CardContent>
              </Card>

              {totalDeuda > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-2">
                      Para regularizar su situación, comuníquese con la
                      administración del Colegio.
                    </p>
                    <Button>Contactar Administración</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {result === "not_found" && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">
                  No se encontraron datos
                </p>
                <p className="text-muted-foreground">
                  Verifique que la matrícula ingresada sea correcta
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
