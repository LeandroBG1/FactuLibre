import React from "react";

type Item = {
  description: string;
  quantity: number;
  price: number;
};

type InvoicePreviewProps = {
  clientName: string;
  date: string;
  items: Item[];
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ clientName, date, items }) => {
  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return (
    <div className="border rounded p-4 bg-white shadow w-full md:w-1/2">
      <h2 className="text-xl font-bold mb-4">Factura</h2>
      <p><strong>Cliente:</strong> {clientName || "Nombre del cliente"}</p>
      <p><strong>Fecha:</strong> {date || "Fecha"}</p>
      <table className="w-full mt-4 border-t">
        <thead>
          <tr className="text-left">
            <th className="py-2">Descripción</th>
            <th className="py-2">Cantidad</th>
            <th className="py-2">Precio</th>
            <th className="py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={4} className="text-center py-4">No hay items aún.</td></tr>
          ) : (
            items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-1">{item.description}</td>
                <td className="py-1">{item.quantity}</td>
                <td className="py-1">${item.price.toFixed(2)}</td>
                <td className="py-1">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 text-right">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>IVA (16%): ${tax.toFixed(2)}</p>
        <p className="font-bold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default InvoicePreview;
