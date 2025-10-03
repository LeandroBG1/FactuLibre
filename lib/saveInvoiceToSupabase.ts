import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define tu tipo de factura según tus datos
export type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

export type InvoicePayload = {
  user_id: string;
  client_name: string;
  client_email: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdf_url?: string; // nuevo
};

export const saveInvoiceToSupabase = async (invoice: InvoicePayload) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice]);

  if (error) {
    console.error('Error al guardar factura:', error.message);
    return null;
  }

  return data;
};