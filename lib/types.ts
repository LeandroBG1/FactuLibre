export type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

export type InvoiceType = {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  date: string; // ISO format
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdf_url?: string;
};