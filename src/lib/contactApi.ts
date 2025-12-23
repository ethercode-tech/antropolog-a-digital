// src/lib/contactApi.ts
import { supabase } from "@/integrations/supabase/client";

export type ContactMessage = {
  id: string;
  full_name: string;
  email: string;
  message: string;
  status: string;
  source_page: string | null;
  created_at: string;
  handled_at: string | null;
  created_by: string | null;
};

export type ContactMessageInput = {
  full_name: string;
  email: string;
  message: string;
  source_page?: string;
};

export async function createContactMessage(input: ContactMessageInput) {
  const payload = {
    full_name: input.full_name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    source_page: input.source_page ?? null,
  };

  const { data, error } = await supabase
    .from("contact_messages")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

// NUEVO: listar mensajes para admin
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}
