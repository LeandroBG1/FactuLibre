// components/invoice/InvoiceForm/index.tsx
"use client";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Importar useRouter
import CustomerFields from "./CustomerFields";
import ItemsTable from "./ItemsTable";
import Totals from "./Totals";
import ActionsBar from "./ActionsBar";
import { InvoiceFormSchema, type InvoiceFormInput } from "@/lib/validators/invoice.schema";
import { useMemo } from "react";

// El Formulario principal ahora es solo la estructura, la lógica está dentro
export default function InvoiceForm() {
  const router = useRouter(); // Inicializar el router
  const { handleSubmit, watch, reset, formState: { isSubmitting } } = useFormContext<InvoiceFormInput>();

  const items = watch("items");

  const { subtotal, tax, total } = useMemo(() => {
    const sub = (items || []).reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    const taxVal = +(sub * 0.16).toFixed(2);
    const totalVal = +(sub + taxVal).toFixed(2);
    return { subtotal: +sub.toFixed(2), tax: taxVal, total: totalVal };
  }, [items]);

  const onSubmit = async (data: InvoiceFormInput) => {
    const loadingToast = toast.loading("Generando factura...");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "No se pudo generar la factura");
      }
      
      const { base64 } = await res.json();

      // Descargar el PDF
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

      toast.success("Factura creada y PDF descargado");

      // Opcional: Enviar por correo en segundo plano (sin esperar respuesta)
      fetch("/api/send-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail: data.clientEmail,
            filename: `factura_${data.clientName}_${data.date}.pdf`,
            pdfBufferBase64: base64,
          }),
        }).catch(e => console.error("Error enviando email en segundo plano:", e));
      
      // ✅ Redirigir al dashboard
      router.push('/dashboard');
      router.refresh(); // Actualiza los datos del dashboard
      
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Error inesperado al crear la factura");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Crear Nueva Factura</h2>
      <CustomerFields />
      <ItemsTable />
      <Totals subtotal={subtotal} tax={tax} total={total} />
      <ActionsBar />
    </form>
  );
}