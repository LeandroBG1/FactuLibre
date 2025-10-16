// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InvoiceType } from "@/lib/types";

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/invoices');
        if (!response.ok) throw new Error('Failed to fetch invoices');
        const data = await response.json();
        setInvoices(data.invoices as InvoiceType[]);
      } catch (error) {
        console.error("❌ Error fetching invoices:", error);
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
    <main className="p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Historial de Facturas</h2>
            <Link 
                href="/dashboard/new"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold transition shadow-sm"
            >
                + Crear Nueva Factura
            </Link>
        </div>

        <input
          type="text"
          placeholder="Filtrar por cliente o fecha..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-6 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {loading ? (
          <p className="text-gray-600">Cargando facturas...</p>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700">No hay facturas todavía</h3>
            <p className="text-gray-500 mt-2">¡Crea tu primera factura para empezar!</p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-center">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id} // Usar un id único si está disponible
                    className="hover:bg-blue-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-4 py-3 font-medium">{inv.client_name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {inv.client_email || <span className="italic text-gray-400">N/A</span>}
                    </td>
                    <td className="px-4 py-3">{inv.date}</td>
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