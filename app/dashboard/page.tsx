// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { InvoiceType } from "@/lib/types";

type Item = {
  description: string;
  quantity: number;
  price: number;
};

export default function DashboardPage() {
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [items, setItems] = useState<Item[]>([]);

  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data.invoices as InvoiceType[]);
      } catch (error) {
        console.error("❌ Error fetching invoices:", error);
        // Aquí podrías mostrar un toast de error al usuario
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) =>
    inv.client_name.toLowerCase().includes(filter.toLowerCase()) ||
    inv.date.includes(filter)
  );

  return (
    <main className="p-4 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Generador de facturas y vista previa */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2 w-full">
          {/* Este InvoiceForm tendrá que ser actualizado o eliminado si la lógica se mueve a otra página */}
          <InvoiceForm
            clientName={clientName}
            setClientName={setClientName}
            date={date}
            setDate={setDate}
            items={items}
            setItems={setItems}
          />
        </div>
        <InvoicePreview clientName={clientName} date={date} items={items} />
      </div>

      {/* Historial de facturas */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Historial de facturas generadas</h2>

        <input
          type="text"
          placeholder="Filtrar por cliente o fecha"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {loading ? (
          <p className="text-gray-600">Cargando facturas...</p>
        ) : filteredInvoices.length === 0 ? (
          <p className="mt-4 text-center text-gray-500">
            No se encontraron facturas con el filtro actual.
          </p>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">IVA</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((inv, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-3 font-medium">{inv.client_name}</td>
                    <td className="px-4 py-3">
                      {inv.client_email || (
                        <span className="italic text-gray-400">Sin email</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{inv.date}</td>
                    <td className="px-4 py-3 text-right">${inv.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${inv.tax.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                      ${inv.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {inv.pdf_url ? (
                        <a
                          href={inv.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">No disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}