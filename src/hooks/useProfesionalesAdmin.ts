import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import type { Profesional } from "@/lib/types/profesionales";

const ADMIN_HEADERS = {
  // Mientras no tengas auth real, esto es un parche, pero por lo menos
  // no exponés el service role. Cuando metas login serio, esto se reemplaza.
  "x-admin-token": import.meta.env.VITE_ADMIN_INTERNAL_TOKEN ?? "",
};

export function useProfesionalesAdmin(search?: string, estado?: string) {
  return useQuery<Profesional[]>({
    queryKey: ["profesionales", { search, estado }],
    queryFn: () =>
      apiFetch<Profesional[]>(
        `/api/profesionales?search=${encodeURIComponent(
          search ?? ""
        )}&estado=${encodeURIComponent(estado ?? "todos")}`,
        {
          headers: ADMIN_HEADERS,
        }
      ),
  });
}

export function useProfesionalesMutations() {
  const queryClient = useQueryClient();

  const createProfesional = useMutation({
    mutationFn: (payload: Partial<Profesional>) =>
      apiFetch<Profesional>("/api/profesionales", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: ADMIN_HEADERS,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesionales"] });
    },
  });

  const updateProfesional = useMutation({
    mutationFn: (payload: Partial<Profesional> & { id: string }) =>
      apiFetch<Profesional>(`/api/profesionales/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: ADMIN_HEADERS,
      }),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ["profesionales"] });
      queryClient.invalidateQueries({
        queryKey: ["profesionales", { id: payload.id }],
      });
    },
  });

  const deleteProfesional = useMutation({
    mutationFn: (id: string) =>
      apiFetch<never>(`/api/profesionales/${id}`, {
        method: "DELETE",
        headers: ADMIN_HEADERS,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesionales"] });
    },
  });

  return { createProfesional, updateProfesional, deleteProfesional };
}
