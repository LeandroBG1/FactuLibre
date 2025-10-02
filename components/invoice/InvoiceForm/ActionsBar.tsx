"use client";
export default function ActionsBar() {
  return (
    <div className="flex gap-2 justify-end">
      <button type="reset" className="px-3 py-2 rounded border">Limpiar</button>
      <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Guardar y generar PDF</button>
    </div>
  );
}
