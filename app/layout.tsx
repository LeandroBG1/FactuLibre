import type { Metadata } from "next";
// ✅ CAMBIAMOS LA IMPORTACIÓN DE LA FUENTE
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from "@/components/Navbar";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ✅ CONFIGURAMOS LA NUEVA FUENTE
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // La usaremos como la fuente principal
});

export const metadata: Metadata = {
  title: "FactuLibre - Generador de Facturas",
  description: "Crea y gestiona tus facturas de forma fácil y rápida.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  return (
    <html lang="es">
      {/* ✅ APLICAMOS LA CLASE DE LA FUENTE */}
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <Navbar user={user} />
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}