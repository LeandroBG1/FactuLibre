// components/Navbar.tsx
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
      <Link href={user ? "/dashboard" : "/"} className="font-bold text-xl">
        FactuLibre
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link href="/invoice" className="underline hover:text-blue-200">
            Crear Factura
          </Link>
        )}
      </div>
    </nav>
  );
}