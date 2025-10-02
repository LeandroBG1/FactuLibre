export type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

export type InvoiceType = {
  client_name: string;
  client_email: string;
  date: string; // ISO format
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  pdf_url?: string;
};