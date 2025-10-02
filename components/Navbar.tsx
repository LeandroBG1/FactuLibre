'use client';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="font-bold">FactuLibre</h1>
      <a href="/invoice" className="underline">Crear Factura</a>
    </nav>
  );
}
