"use client";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function ItemsTable() {
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ name: "items", control });
  const items = watch("items") || [];

  const lineTotal = (i: number) => {
    const it = items[i] || { quantity: 0, price: 0 };
    const t = (Number(it.quantity) || 0) * (Number(it.price) || 0);
    return t.toFixed(2);
  };

  return (
    <div className="space-y-2">
      <div className="hidden md:flex text-sm font-medium text-gray-600">
        <div className="flex-1">Descripción</div>
        <div className="w-24 text-center">Cant.</div>
        <div className="w-32 text-center">Precio</div>
        <div className="w-32 text-right">Total</div>
      </div>

      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex flex-col md:flex-row gap-2 items-stretch md:items-center border rounded p-2">
            <input className="flex-1 border rounded p-2" placeholder="Descripción" {...register(`items.${idx}.description`)} />
            <input type="number" step="1" min="1" className="md:w-24 border rounded p-2" placeholder="1" {...register(`items.${idx}.quantity`, { valueAsNumber: true })} />
            <input type="number" step="0.01" min="0" className="md:w-32 border rounded p-2" placeholder="0.00" {...register(`items.${idx}.price`, { valueAsNumber: true })} />
            <div className="md:w-32 md:text-right font-medium">${lineTotal(idx)}</div>
            <button type="button" onClick={() => remove(idx)} className="text-red-600 text-sm ml-auto md:ml-2">Eliminar</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => append({ description: "", quantity: 1, price: 0 })} className="bg-blue-600 text-white text-sm px-3 py-2 rounded">
        + Añadir ítem
      </button>
    </div>
  );
}
