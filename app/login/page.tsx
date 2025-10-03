// app/login/page.tsx
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormInputs = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    const toastId = toast.loading("Iniciando sesión...");
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    toast.dismiss(toastId);

    if (error) {
      toast.error(error.message || "No se pudo iniciar sesión.");
    } else {
      toast.success("¡Bienvenido!");
      router.push("/dashboard");
      router.refresh(); // Importante para recargar el estado del servidor
    }
  };

  const handleSignUp: SubmitHandler<LoginFormInputs> = async (data) => {
    const toastId = toast.loading("Creando cuenta...");
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    toast.dismiss(toastId);

    if (error) {
        toast.error(error.message || "No se pudo crear la cuenta.");
    } else {
        toast.success("¡Cuenta creada! Revisa tu email para confirmar.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          FactuLibre
        </h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full border rounded p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className="w-full border rounded p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
             <button
              type="submit"
              className="w-full px-4 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold transition"
            >
              Iniciar Sesión
            </button>
             <button
              type="button"
              onClick={handleSubmit(handleSignUp)}
              className="w-full px-4 py-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold transition"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}