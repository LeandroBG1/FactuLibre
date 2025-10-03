// app/api/invoices/route.ts
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import InvoicePDF from "@/components/invoice/InvoicePDF";
import type { DocumentProps } from "@react-pdf/renderer";
import { InvoiceCreateSchema } from "@/lib/validators/invoice.schema";
import { uploadPdfToSupabase } from "@/lib/uploadPdfToSupabase";
import { saveInvoiceToSupabase } from "@/lib/saveInvoiceToSupabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// FUNCIÓN POST PARA CREAR UNA FACTURA
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const { clientName, clientEmail, date, items } = InvoiceCreateSchema.parse(payload);

    const subtotal = items.reduce((acc: number, it: any) => acc + it.quantity * it.price, 0);
    const tax = Math.round(subtotal * 0.16 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const element = React.createElement(InvoicePDF, { clientName, date, items, total });
    const pdfBuffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);

    const filename = `factura-${clientName}-${Date.now()}`.replace(/\s+/g, "_");
    const pdfUrl = await uploadPdfToSupabase(pdfBuffer, filename);

    // ✅ Guardar la factura ASOCIADA AL USUARIO
    await saveInvoiceToSupabase({
      user_id: session.user.id, // ID del usuario autenticado
      client_name: clientName,
      client_email: clientEmail,
      date,
      items,
      subtotal,
      tax,
      total,
      pdf_url: pdfUrl ?? undefined,
    });

    return NextResponse.json({
      success: true,
      pdfUrl,
      base64: Buffer.from(pdfBuffer).toString("base64"),
    }, { status: 201 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e?.message ?? "Error creando factura" }, { status: 400 });
  }
}

// FUNCIÓN GET PARA OBTENER EL HISTORIAL DEL USUARIO
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
  }

  try {
    // ✅ Obtener solo las facturas del usuario actual
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq('user_id', session.user.id) // Filtro por user_id
      .order("date", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ invoices: data });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e?.message ?? "Error obteniendo facturas" }, { status: 500 });
  }
}