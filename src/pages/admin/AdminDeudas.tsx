// src/pages/admin/AdminDeudas.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  DollarSign,
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type EstadoDeuda = "pagado" | "pendiente";

type DeudaRow = {
  id: string;
  profesionalId: string;
  periodo: string; // "YYYY-MM"
  concepto: string;
  monto: number;
  estado: EstadoDeuda;
  fechaVencimiento?: string | null; // date
  fechaPago?: string | null;        // date
};

type DeudaUpdatePayload = {
  periodo: string;
  concepto: string;
  monto: number;
  estado: EstadoDeuda;
  fechaVencimiento: string | null;
  fechaPago: string | null;
};

type DeudaFormState = {
  periodo: string;
  concepto: string;
  monto: string;
  estado: EstadoDeuda;
  fechaVencimiento: string;
  fechaPago: string;
};

type ProfesionalOption = {
  id: string;
  nombre: string;
  matricula: string;
};

// ───────────────────────────────
// Data access
// ───────────────────────────────

async function fetchDeudas(): Promise<DeudaRow[]> {
  const { data, error } = await supabase
    .from("profesional_deudas")
    .select("*")
    .order("periodo", { ascending: false });

  if (error) {
    console.error("[AdminDeudas] fetchDeudas error:", error);
    throw new Error("No se pudieron cargar las deudas");
  }

  return (data ?? []).map((d: any) => ({
    id: d.id,
    profesionalId: d.profesional_id,
    periodo: d.periodo,
    concepto: d.concepto,
    monto: Number(d.monto),
    estado: d.estado as EstadoDeuda,
    fechaVencimiento: d.fecha_vencimiento,
    fechaPago: d.fecha_pago,
  }));
}

async function fetchProfesionalesBasic(): Promise<ProfesionalOption[]> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("id, nombre, apellido, matricula")
    .order("apellido", { ascending: true });

  if (error) {
    console.error("[AdminDeudas] fetchProfesionales error:", error);
    throw new Error("No se pudieron cargar los profesionales");
  }

  return (data ?? []).map((p: any) => ({
    id: p.id,
    nombre: `${p.apellido}, ${p.nombre}`,
    matricula: p.matricula,
  }));
}

async function deleteDeudaRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from("profesional_deudas")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[AdminDeudas] deleteDeuda error:", error);
    throw new Error("No se pudo eliminar la deuda");
  }
}

async function updateDeudaRequest(params: {
  id: string;
  data: DeudaUpdatePayload;
}): Promise<void> {
  const { id, data } = params;

  const { error } = await supabase
    .from("profesional_deudas")
    .update({
      periodo: data.periodo,
      concepto: data.concepto,
      monto: data.monto,
      estado: data.estado,
      fecha_vencimiento: data.fechaVencimiento,
      fecha_pago: data.fechaPago,
    })
    .eq("id", id);

  if (error) {
    console.error("[AdminDeudas] updateDeuda error:", error);
    throw new Error("No se pudo actualizar la deuda");
  }
}

// ───────────────────────────────
// Page
// ───────────────────────────────

export default function AdminDeudas() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: deudas = [],
    isLoading: isLoadingDeudas,
    isError: isErrorDeudas,
    error: errorDeudas,
  } = useQuery({
    queryKey: ["admin-deudas"],
    queryFn: fetchDeudas,
  });

  const {
    data: profesionales = [],
    isLoading: isLoadingProfes,
    isError: isErrorProfes,
  } = useQuery({
    queryKey: ["admin-deudas-profesionales"],
    queryFn: fetchProfesionalesBasic,
  });

  const deleteDeuda = useMutation({
    mutationFn: deleteDeudaRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deudas"] });
      toast({
        title: "Deuda eliminada",
        description: "El registro de deuda ha sido eliminado correctamente",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al eliminar",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al eliminar la deuda",
        variant: "destructive",
      });
    },
  });

  const updateDeuda = useMutation({
    mutationFn: updateDeudaRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-deudas"] });
      toast({
        title: "Deuda actualizada",
        description: "El registro de deuda se actualizó correctamente",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al actualizar",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al actualizar la deuda",
        variant: "destructive",
      });
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Estado para modal de edición
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDeuda, setEditingDeuda] = useState<DeudaRow | null>(null);
  const [formState, setFormState] = useState<DeudaFormState>({
    periodo: "",
    concepto: "",
    monto: "",
    estado: "pendiente",
    fechaVencimiento: "",
    fechaPago: "",
  });

  const profById = useMemo(() => {
    const map = new Map<string, ProfesionalOption>();
    profesionales.forEach((p) => map.set(p.id, p));
    return map;
  }, [profesionales]);

  const getProfesionalName = (id: string) => {
    const prof = profById.get(id);
    return prof?.nombre || "Desconocido";
  };

  const getProfesionalMatricula = (id: string) => {
    const prof = profById.get(id);
    return prof?.matricula || "-";
  };

  const formatMes = (periodo: string) => {
    const [year, month] = periodo.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    });
  };

  const filteredDeudas = useMemo(
    () =>
      deudas.filter((d) => {
        const profName = getProfesionalName(d.profesionalId).toLowerCase();
        const matchSearch = profName.includes(searchTerm.toLowerCase());
        const matchEstado =
          filterEstado === "todos" || d.estado === filterEstado;
        return matchSearch && matchEstado;
      }),
    [deudas, searchTerm, filterEstado, profById]
  );

  const totalPendiente = deudas
    .filter((d) => d.estado === "pendiente")
    .reduce((acc, d) => acc + d.monto, 0);

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteDeuda.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleOpenEdit = (deuda: DeudaRow) => {
    setEditingDeuda(deuda);
    setFormState({
      periodo: deuda.periodo, // "YYYY-MM"
      concepto: deuda.concepto,
      monto: deuda.monto.toString(),
      estado: deuda.estado,
      fechaVencimiento: deuda.fechaVencimiento ?? "",
      fechaPago: deuda.fechaPago ?? "",
    });
    setEditDialogOpen(true);
  };

  const handleEditInputChange =
    (field: keyof DeudaFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setFormState((prev) => ({
        ...prev,
        [field]: value as any,
      }));
    };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeuda) return;

    if (!formState.periodo || !formState.monto) {
      toast({
        title: "Campos requeridos",
        description: "Período y monto son obligatorios",
        variant: "destructive",
      });
      return;
    }

    const montoNumber = parseFloat(formState.monto);
    if (Number.isNaN(montoNumber) || montoNumber < 0) {
      toast({
        title: "Monto inválido",
        description: "Ingrese un monto numérico válido",
        variant: "destructive",
      });
      return;
    }

    const payload: DeudaUpdatePayload = {
      periodo: formState.periodo,
      concepto: formState.concepto || "Cuota mensual",
      monto: montoNumber,
      estado: formState.estado,
      fechaVencimiento: formState.fechaVencimiento || null,
      fechaPago: formState.fechaPago || null,
    };

    await updateDeuda.mutateAsync({
      id: editingDeuda.id,
      data: payload,
    });

    setEditDialogOpen(false);
    setEditingDeuda(null);
  };

  if (isLoadingDeudas || isLoadingProfes) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        Cargando deudas…
      </div>
    );
  }

  if (isErrorDeudas || isErrorProfes) {
    return (
      <div className="py-16 text-center text-sm text-red-500">
        {(errorDeudas as Error)?.message ||
          "No se pudieron cargar los datos de deudas."}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Gestión de Deudas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las cuotas y pagos de los profesionales
          </p>
        </div>
        <Link to="/admin/deudas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Deuda
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {deudas.length}
            </p>
            <p className="text-xs text-muted-foreground">Total Registros</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {deudas.filter((d) => d.estado === "pendiente").length}
            </p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {deudas.filter((d) => d.estado === "pagado").length}
            </p>
            <p className="text-xs text-muted-foreground">Pagados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-primary">
              ${totalPendiente.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Pendiente</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre del profesional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Listado de Deudas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeudas.map((deuda) => (
                  <TableRow key={deuda.id}>
                    <TableCell className="font-medium">
                      {getProfesionalName(deuda.profesionalId)}
                    </TableCell>
                    <TableCell>
                      {getProfesionalMatricula(deuda.profesionalId)}
                    </TableCell>
                    <TableCell>{formatMes(deuda.periodo)}</TableCell>
                    <TableCell>${deuda.monto.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          deuda.estado === "pagado"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {deuda.estado === "pagado" ? "Pagado" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(deuda)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(deuda.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredDeudas.map((deuda) => (
              <div
                key={deuda.id}
                className="bg-secondary/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">
                      {getProfesionalName(deuda.profesionalId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getProfesionalMatricula(deuda.profesionalId)}
                    </p>
                  </div>
                  <Badge
                    className={
                      deuda.estado === "pagado"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {deuda.estado === "pagado" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {formatMes(deuda.periodo)}
                </p>
                <p className="text-lg font-semibold text-primary mb-3">
                  ${deuda.monto.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenEdit(deuda)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(deuda.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredDeudas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron registros de deuda
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal eliminación */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar deuda?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro de deuda será
              eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteDeuda.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteDeuda.isPending}
            >
              {deleteDeuda.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal edición */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingDeuda(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar deuda</DialogTitle>
            <DialogDescription>
              Actualizá los datos de la cuota seleccionada. El profesional no se modifica desde aquí.
            </DialogDescription>
          </DialogHeader>

          {editingDeuda && (
            <form
              onSubmit={handleEditSubmit}
              className="space-y-5 mt-2"
            >
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {getProfesionalName(editingDeuda.profesionalId)}
                </p>
                <p className="text-muted-foreground">
                  Matrícula: {getProfesionalMatricula(editingDeuda.profesionalId)}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="periodo">
                    Período
                  </label>
                  <Input
                    id="periodo"
                    type="month"
                    value={formState.periodo}
                    onChange={handleEditInputChange("periodo")}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="monto">
                    Monto
                  </label>
                  <Input
                    id="monto"
                    type="number"
                    step="0.01"
                    value={formState.monto}
                    onChange={handleEditInputChange("monto")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="concepto">
                  Concepto
                </label>
                <Input
                  id="concepto"
                  value={formState.concepto}
                  onChange={handleEditInputChange("concepto")}
                  placeholder="Cuota mensual"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="estado">
                    Estado
                  </label>
                  <select
                    id="estado"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={formState.estado}
                    onChange={handleEditInputChange("estado")}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label
                    className="text-sm font-medium"
                    htmlFor="fechaVencimiento"
                  >
                    Fecha de vencimiento
                  </label>
                  <Input
                    id="fechaVencimiento"
                    type="date"
                    value={formState.fechaVencimiento}
                    onChange={handleEditInputChange("fechaVencimiento")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="fechaPago">
                  Fecha de pago
                </label>
                <Input
                  id="fechaPago"
                  type="date"
                  value={formState.fechaPago}
                  onChange={handleEditInputChange("fechaPago")}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setEditingDeuda(null);
                  }}
                  disabled={updateDeuda.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateDeuda.isPending}
                >
                  {updateDeuda.isPending ? "Guardando…" : "Guardar cambios"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
