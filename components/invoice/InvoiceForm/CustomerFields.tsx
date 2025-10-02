"use client";
import { useFormContext } from "react-hook-form";

export default function CustomerFields() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <input type="text" placeholder="Nombre del cliente" className="w-full border rounded p-2" {...register("clientName")} />
        {"clientName" in errors && <p className="text-red-600 text-xs mt-1">{String((errors as any).clientName.message)}</p>}
      </div>
      <div>
        <input type="email" placeholder="Email del cliente" className="w-full border rounded p-2" {...register("clientEmail")} />
        {"clientEmail" in errors && <p className="text-red-600 text-xs mt-1">{String((errors as any).clientEmail.message)}</p>}
      </div>
      <div>
        <input type="date" className="w-full border rounded p-2" {...register("date")} />
        {"date" in errors && <p className="text-red-600 text-xs mt-1">{String((errors as any).date.message)}</p>}
      </div>
    </div>
  );
}
