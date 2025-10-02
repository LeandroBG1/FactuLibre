"use client";

import { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import CustomerFields from "./CustomerFields";
import ItemsTable from "./ItemsTable";
import Totals from "./Totals";
import ActionsBar from "./ActionsBar";
import { InvoiceFormSchema, type InvoiceFormInput } from "@/lib/validators/invoice.schema";

const DEFAULT_VALUES: InvoiceFormInput = {
  clientName: "",
  clientEmail: "",
  date: new Date().toISOString().slice(0,10),
  items: [{ description: "", quantity: 1, price: 0 }],
};

export default function InvoiceForm() {
  const methods = useForm<InvoiceFormInput>({
    mode: "onChange",
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { handleSubmit, watch, reset } = methods;
  const items = watch("items");

  const { subtotal, tax, total } = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    const tax = +(sub * 0.16).toFixed(2);
    const total = +(sub + tax).toFixed(2);
    return { subtotal: +sub.toFixed(2), tax, total };
  }, [items]);

  const onSubmit = async (data: InvoiceFormInput) => {
    const loading = toast.loading("Generando factura...");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error(t);
        toast.error("No se pudo generar la factura");
        return;
      }
      const { base64, pdfUrl } = await res.json();

      const buffer = Buffer.from(base64, "base64");
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `factura_${data.clientName}_${data.date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Factura creada y PDF generado");
      reset(DEFAULT_VALUES);
      
      try {
        await fetch("/api/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail: data.clientEmail,
            filename: `factura_${data.clientName}_${data.date}.pdf`,
            pdfBufferBase64: base64,
          }),
        });
      } catch {}
    } catch (e) {
      console.error(e);
      toast.error("Error inesperado");
    } finally {
      toast.dismiss(loading);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow w-full max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">Crear nueva factura</h2>
        <CustomerFields />
        <ItemsTable />
        <Totals subtotal={subtotal} tax={tax} total={total} />
        <ActionsBar />
      </form>
    </FormProvider>
  );
}
