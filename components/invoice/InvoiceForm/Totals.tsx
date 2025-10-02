"use client";
type Props = { subtotal: number; tax: number; total: number };
export default function Totals({ subtotal, tax, total }: Props) {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
      <div className="flex justify-between text-sm"><span>IVA (16%):</span><span>${tax.toFixed(2)}</span></div>
      <div className="flex justify-between text-base font-semibold mt-1"><span>Total:</span><span>${total.toFixed(2)}</span></div>
    </div>
  );
}
