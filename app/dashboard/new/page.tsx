// app/dashboard/new/page.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { InvoiceFormSchema, type InvoiceFormInput } from "@/lib/validators/invoice.schema";

const DEFAULT_VALUES: InvoiceFormInput = {
  clientName: "",
  clientEmail: "",
  date: new Date().toISOString().slice(0, 10),
  items: [{ description: "", quantity: 1, price: 0 }],
};

export default function NewInvoicePage() {
  const methods = useForm<InvoiceFormInput>({
    mode: "onChange", // 'watch' para que la vista previa se actualice en tiempo real
    resolver: zodResolver(InvoiceFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const watchedValues = methods.watch();

  return (
    <FormProvider {...methods}>
      <main className="p-4 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Columna del Formulario */}
        <div className="lg:w-1/2 w-full">
          <InvoiceForm />
        </div>

        {/* Columna de la Vista Previa */}
        <div className="lg:w-1/2 w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Vista Previa</h2>
            <InvoicePreview 
                clientName={watchedValues.clientName || ''}
                date={watchedValues.date || ''}
                items={watchedValues.items || []}
            />
        </div>
      </main>
    </FormProvider>
  );
}