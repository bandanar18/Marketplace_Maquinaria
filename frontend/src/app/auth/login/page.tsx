"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión. Por favor verifica tus credenciales.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center pt-12 px-4">
      {/* Header Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="bg-[#E85D04] text-white w-10 h-10 rounded flex items-center justify-center font-black text-xl shadow-sm">
          M
        </div>
        <span className="text-2xl font-black text-[#1C2B3A] tracking-tight">
          maquinaria
        </span>
      </Link>

      <div className="w-full max-w-[480px]">
        <div className="bg-white border border-[#E2E6EA] rounded-lg shadow-md p-8 md:p-10">
          <h1 className="text-2xl font-bold text-[#1C2B3A] text-center mb-2">
            Inicia sesión en Maquinaria
          </h1>
          <p className="text-center text-[#5C6370] text-sm mb-8">
            ¿Eres nuevo en Maquinaria?{" "}
            <Link href="/auth/register" className="text-[#0073BB] font-bold hover:underline">
              Regístrate
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-bold text-[#1C2B3A]">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                {...register("email")}
                className={`h-11 border-[#E2E6EA] focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold text-[#1C2B3A]">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  {...register("password")}
                  className={`h-11 border-[#E2E6EA] focus:border-[#E85D04] focus:ring-1 focus:ring-[#E85D04] pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1C2B3A] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
              <div className="text-right">
                <Link href="/auth/forgot-password" className="text-xs text-[#0073BB] font-bold hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#E85D04] hover:bg-[#C44B03] text-white font-bold h-12 text-base mt-2 shadow-sm transition-colors" 
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E2E6EA]" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white px-3 text-[#9099A6]">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <Button variant="outline" className="h-11 border-[#E2E6EA] text-[#1C2B3A] font-bold hover:bg-gray-50 flex items-center justify-center gap-3">
               <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
               Continuar con Google
             </Button>
             <Button variant="outline" className="h-11 border-[#E2E6EA] text-[#1C2B3A] font-bold hover:bg-gray-50 flex items-center justify-center gap-3">
               <img src="https://www.linkedin.com/favicon.ico" className="w-4 h-4" alt="LinkedIn" />
               Continuar con LinkedIn
             </Button>
          </div>
        </div>

        <p className="text-center text-xs text-[#9099A6] mt-8 px-6">
          Al iniciar sesión, aceptas los Términos de Servicio de Maquinaria y la Política de Privacidad, incluida la Política de Cookies.
        </p>
      </div>
    </div>
  );
}
