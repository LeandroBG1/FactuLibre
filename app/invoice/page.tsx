"use client";

import { useState } from "react";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";

type Item = {
  description: string;
  quantity: number;
  price: number;
};

export default function DashboardPage() {
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [items, setItems] = useState<Item[]>([]);

  return (
    <main className="p-4 flex flex-col md:flex-row gap-4">
      <div className="md:w-1/2 w-full">
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
    </main>
  );
}
