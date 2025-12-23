// src/pages/admin/AdminFacturas.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  FileText,
  Download,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// ───────────────────────────────
// Tipos locales
// ───────────────────────────────

type FacturaAdmin = {
  id: string;
  profesionalId: string;
  numero: string;
  fechaEmision: string;
  periodo: string | null;
  concepto: string;
  importe: number;
  estado: string;
  urlPdf: string | null;
  creadoEn: string;
};

type ProfesionalBasic = {
  id: string;
  nombreCompleto: string;
  matricula: string;
  dni: string | null;
};

// ───────────────────────────────
// Mappers
// ───────────────────────────────

function mapRowToFactura(row: any): FacturaAdmin {
  return {
    id: row.id,
    profesionalId: row.profesional_id,
    numero: row.numero,
    fechaEmision: row.fecha_emision,
    periodo: row.periodo,
    concepto: row.concepto,
    importe: Number(row.importe),
    estado: row.estado,
    urlPdf: row.url_pdf,
    creadoEn: row.creado_en,
  };
}

function mapRowToProfesionalBasic(row: any): ProfesionalBasic {
  const nombre = row.nombre || "";
  const apellido = row.apellido || "";
  const nombreCompleto =
    nombre && apellido ? `${apellido}, ${nombre}` : nombre || apellido || "";

  return {
    id: row.id,
    nombreCompleto,
    matricula: row.matricula || "",
    dni: row.dni || null,
  };
}

// ───────────────────────────────
// Data access Supabase
// ───────────────────────────────

async function fetchFacturas(): Promise<FacturaAdmin[]> {
  const { data, error } = await supabase
    .from("profesional_facturas")
    .select("*")
    .order("fecha_emision", { ascending: false });

  if (error) {
    console.error("[AdminFacturas] Error fetchFacturas:", error);
    throw new Error("No se pudieron cargar las facturas");
  }

  return (data ?? []).map(mapRowToFactura);
}

async function fetchProfesionalesBasic(): Promise<ProfesionalBasic[]> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("id, nombre, apellido, matricula, dni")
    .order("apellido", { ascending: true });

  if (error) {
    console.error("[AdminFacturas] Error fetchProfesionalesBasic:", error);
    throw new Error("No se pudieron cargar los profesionales");
  }

  return (data ?? []).map(mapRowToProfesionalBasic);
}

async function deleteFacturaRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("profesional_facturas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[AdminFacturas] Error deleteFactura:", error);
    throw new Error("No se pudo eliminar la factura");
  }
}

// ───────────────────────────────
// Page
// ───────────────────────────────

export default function AdminFacturas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: facturas = [],
    isLoading: isLoadingFacturas,
    isError: isErrorFacturas,
    error: errorFacturas,
  } = useQuery({
    queryKey: ["admin-facturas"],
    queryFn: fetchFacturas,
  });

  const {
    data: profesionales = [],
    isLoading: isLoadingProfesionales,
    isError: isErrorProfesionales,
    error: errorProfesionales,
  } = useQuery({
    queryKey: ["admin-facturas-profesionales"],
    queryFn: fetchProfesionalesBasic,
  });

  const deleteFactura = useMutation({
    mutationFn: (id: string) => deleteFacturaRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-facturas"] });
      toast({
        title: "Factura eliminada",
        description: "La factura fue eliminada correctamente.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al eliminar factura",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al eliminar la factura.",
        variant: "destructive",
      });
    },
  });

  const profesionalesMap = useMemo(() => {
    const map = new Map<string, ProfesionalBasic>();
    profesionales.forEach((p) => map.set(p.id, p));
    return map;
  }, [profesionales]);

  const getProfesional = (id: string): ProfesionalBasic | undefined =>
    profesionalesMap.get(id);

  const formatMes = (periodo: string | null) => {
    if (!periodo) return "-";
    const [year, month] = periodo.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    if (Number.isNaN(date.getTime())) return periodo;
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long" });
  };

  const filteredFacturas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return facturas;

    return facturas.filter((f) => {
      const prof = getProfesional(f.profesionalId);
      const nombre = prof?.nombreCompleto.toLowerCase() ?? "";
      const matricula = prof?.matricula.toLowerCase() ?? "";
      const numero = f.numero.toLowerCase();

      return (
        nombre.includes(term) ||
        matricula.includes(term) ||
        numero.includes(term)
      );
    });
  }, [facturas, searchTerm, profesionalesMap]);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteFactura.mutateAsync(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Gestión de Facturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las facturas emitidas a profesionales matriculados.
          </p>
        </div>
        <Link to="/admin/facturas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </Link>
      </div>

      {/* Mensajes de error de datos base */}
      {isErrorFacturas && (
        <p className="text-sm text-red-500 mb-2">
          {(errorFacturas as Error)?.message ||
            "No se pudieron cargar las facturas."}
        </p>
      )}
      {isErrorProfesionales && (
        <p className="text-sm text-red-500 mb-4">
          {(errorProfesionales as Error)?.message ||
            "No se pudieron cargar los profesionales."}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {isLoadingFacturas ? "…" : facturas.length}
            </p>
            <p className="text-xs text-muted-foreground">Total de facturas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {isLoadingFacturas
                ? "…"
                : new Set(facturas.map((f) => f.profesionalId)).size}
            </p>
            <p className="text-xs text-muted-foreground">
              Profesionales con facturas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, matrícula o número de factura…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Listado de facturas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingFacturas || isLoadingProfesionales ? (
            <p className="text-sm text-muted-foreground">
              Cargando facturas…
            </p>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profesional</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Fecha emisión</TableHead>
                      <TableHead>Importe</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFacturas.map((factura) => {
                      const prof = getProfesional(factura.profesionalId);
                      return (
                        <TableRow key={factura.id}>
                          <TableCell className="font-medium">
                            {prof?.nombreCompleto || "—"}
                          </TableCell>
                          <TableCell>{prof?.matricula || "—"}</TableCell>
                          <TableCell>{prof?.dni || "—"}</TableCell>
                          <TableCell>{factura.numero}</TableCell>
                          <TableCell>{formatMes(factura.periodo)}</TableCell>
                          <TableCell>
                            {new Date(
                              factura.fechaEmision
                            ).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell>
                            ${factura.importe.toLocaleString("es-AR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {factura.urlPdf && (
                                <a
                                  href={factura.urlPdf}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              <Link to={`/admin/facturas/${factura.id}`}>
                                <Button variant="outline" size="sm">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(factura.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredFacturas.map((factura) => {
                  const prof = getProfesional(factura.profesionalId);
                  return (
                    <div
                      key={factura.id}
                      className="bg-secondary/50 rounded-lg p-4"
                    >
                      <div className="mb-3">
                        <p className="font-medium">
                          {prof?.nombreCompleto || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {prof?.matricula || "—"} • DNI: {prof?.dni || "—"}
                        </p>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {formatMes(factura.periodo)}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Emitida:{" "}
                        {new Date(
                          factura.fechaEmision
                        ).toLocaleDateString("es-ES")}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Importe: $
                        {factura.importe.toLocaleString("es-AR")}
                      </p>
                      <div className="flex gap-2">
                        {factura.urlPdf && (
                          <a
                            href={factura.urlPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              PDF
                            </Button>
                          </a>
                        )}
                        <Link to={`/admin/facturas/${factura.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(factura.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredFacturas.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No se encontraron facturas con los filtros actuales.
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación de borrado */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La factura será eliminada
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteFactura.isPending}
            >
              {deleteFactura.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
