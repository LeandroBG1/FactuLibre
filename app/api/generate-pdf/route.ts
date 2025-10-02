import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import InvoicePDF from "@/components/invoice/InvoicePDF";
import { DocumentProps } from "@react-pdf/renderer";
import { uploadPdfToSupabase } from '@/lib/uploadPdfToSupabase';
import { saveInvoiceToSupabase } from '@/lib/saveInvoiceToSupabase';

export async function POST(req: NextRequest) {
  const { clientName, clientEmail, date, items } = await req.json();

  const subtotal = items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  // 1. Crear componente PDF
  const element = React.createElement(InvoicePDF, {
    clientName,
    date,
    items,
    total,
  });

  // 2. Generar buffer PDF
  const pdfBuffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);

  // 3. Subir a Supabase Storage
  const filename = `factura-${clientName}-${Date.now()}`;
  const pdfUrl = await uploadPdfToSupabase(pdfBuffer, filename);

  // 4. Guardar en Supabase DB
  await saveInvoiceToSupabase({
    client_name: clientName,
    client_email: clientEmail,
    date,
    items,
    subtotal,
    tax,
    total,
    pdf_url: pdfUrl ?? undefined,
  });

  // 5. Devolver base64 para descarga o email
  return NextResponse.json({
    base64: pdfBuffer.toString("base64"),
    pdfUrl,
  });
}
