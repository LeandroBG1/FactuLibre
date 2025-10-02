import { z } from "zod";

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Descripción requerida"),
  quantity: z.number().positive("Cantidad > 0"),
  price: z.number().nonnegative("Precio inválido"),
});

export const InvoiceCreateSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  date: z.string().min(1),
  items: z.array(InvoiceItemSchema).min(1),
});

// -------- Extra: schema para formularios (coerce numbers) --------
export const InvoiceItemFormSchema = z.object({
  description: z.string().min(1, "Descripción requerida"),
  quantity: z.coerce.number().positive("Cantidad > 0"),
  price: z.coerce.number().nonnegative("Precio inválido"),
});
export const InvoiceFormSchema = z.object({
  clientName: z.string().min(1, "Cliente requerido"),
  clientEmail: z.string().email("Email inválido"),
  date: z.string().min(1, "Fecha requerida"),
  items: z.array(InvoiceItemFormSchema).min(1, "Agrega al menos un ítem"),
});

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;
export type InvoiceFormInput = z.infer<typeof InvoiceFormSchema>;
