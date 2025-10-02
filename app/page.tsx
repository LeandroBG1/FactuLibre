'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F1F8ED] to-white flex flex-col items-center px-6 pt-16">

      {/* Hero principal */}
      <section className="text-center max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Bienvenido a <span className="text-[#2157DE]">FactuLibre</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Tu solución simple y confiable para generar facturas profesionales en segundos.
        </p>
        <Link
          href="/signup"
          className="bg-[#199473] hover:bg-[#157A61] text-white px-6 py-3 rounded-md transition"
        >
          Crear cuenta gratis
        </Link>
      </section>

      {/* Sección de beneficios */}
      <section className="max-w-5xl w-full text-center mb-16">
        <h2 className="text-2xl font-semibold mb-6">¿Por qué usar FactuLibre?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg text-blue-600 mb-2">Fácil de usar</h3>
            <p className="text-gray-600">Diseñado para que cualquier persona pueda generar facturas sin complicaciones.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg text-blue-600 mb-2">Descarga y envío en segundos</h3>
            <p className="text-gray-600">Genera PDFs y envíalos directamente por correo.</p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-lg text-blue-600 mb-2">Historial centralizado</h3>
            <p className="text-gray-600">Consulta todas tus facturas desde un solo lugar.</p>
          </div>
        </div>
      </section>

      {/* Comparativa de planes */}
      <section className="max-w-5xl w-full text-center mb-20">
        <h2 className="text-2xl font-semibold mb-8">Elige tu plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Gratis */}
          <div className="border rounded-lg p-6 shadow-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Gratis</h3>
            <p className="text-gray-600 mb-4">Ideal para usuarios individuales y uso ocasional.</p>
            <ul className="text-left text-sm text-gray-700 space-y-2 mb-4">
              <li>✔️ Hasta 5 facturas por mes</li>
              <li>✔️ Envío por correo</li>
              <li>✔️ Historial de facturas</li>
              <li>❌ Personalización de marca</li>
              <li>❌ Soporte prioritario</li>
            </ul>
            <Link
              href="/signup?plan=free"
              className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
            >
              Elegir Gratis
            </Link>
          </div>

          {/* Plan Premium */}
          <div className="border rounded-lg p-6 shadow-md bg-white">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Plan Premium</h3>
            <p className="text-gray-600 mb-4">Para negocios o freelancers que facturan constantemente.</p>
            <ul className="text-left text-sm text-gray-700 space-y-2 mb-4">
              <li>✔️ Facturación ilimitada</li>
              <li>✔️ Personaliza tu logo y colores</li>
              <li>✔️ Soporte prioritario</li>
              <li>✔️ Estadísticas y exportación CSV</li>
              <li>✔️ Backup automático</li>
            </ul>
            <Link
              href="/signup?plan=premium"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Elegir Premium
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-400 pb-6">
        © {new Date().getFullYear()} FactuLibre. Todos los derechos reservados.
      </footer>
    </main>
  );
}
