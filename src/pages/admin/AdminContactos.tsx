// src/pages/admin/AdminContactos.tsx
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Mail, Calendar, MessageSquare, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  fetchContactMessages,
  type ContactMessage,
} from "@/lib/contactApi";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContactos() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useQuery<ContactMessage[], Error>({
    queryKey: ["admin-contact-messages"],
    queryFn: fetchContactMessages,
  });

  // Evitá disparar el toast en cada render
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error al cargar consultas",
        description: error?.message ?? "No se pudieron cargar los mensajes de contacto.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const handleOpenDialog = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          Consultas de contacto
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualizá los mensajes enviados desde el formulario de contacto.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Listado de consultas</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Total: {messages.length} consultas
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">
              Cargando consultas…
            </div>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No hay consultas registradas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Nombre</TableHead>
                    <TableHead className="w-[220px]">Correo</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead className="w-[190px]">Fecha</TableHead>
                    <TableHead className="w-[110px] text-right">
                      Ver
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="align-top">
                        <div className="font-medium">{msg.full_name}</div>
                        {msg.source_page && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            Origen: {msg.source_page}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <a
                            href={`mailto:${msg.email}`}
                            className="underline underline-offset-2 text-foreground"
                          >
                            {msg.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm text-muted-foreground line-clamp-3 max-w-xl">
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(msg.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(msg)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mini modal para ver la consulta completa */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>Consulta de contacto</DialogTitle>
                <DialogDescription className="space-y-1">
                  <div className="font-medium text-foreground">
                    {selectedMessage.full_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="underline underline-offset-2"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  {selectedMessage.source_page && (
                    <div className="text-xs text-muted-foreground">
                      Origen: {selectedMessage.source_page}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <p className="text-sm text-foreground whitespace-pre-wrap max-h-64 overflow-y-auto border border-border/60 rounded-md p-3 bg-muted/40">
                  {selectedMessage.message}
                </p>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
