"use client";

import LoginForm from "@/components/forms/login-form";
import SignupForm from "@/components/forms/signup-form";
import { lusitana } from "@/components/ui/fonts";
import AcmeLogo from "@/components/ui/acme-logo";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";
import { Progress } from "../ui/progress";

export default function LoginClient() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener estado de autenticación del store
  const { isAuthenticated, token, isLoading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    isLoading: state.isLoading
  }));
  
  // Obtener la URL de retorno de los parámetros de consulta
  // Compatibilidad con ambos formatos: returnUrl y nextUrl
  const returnUrl = searchParams?.get('returnUrl') || searchParams?.get('nextUrl') || '/dashboard';

  // Verificar si el usuario ya está autenticado y redireccionar si es necesario
  useEffect(() => {
    // Esperar a que termine la carga inicial del estado de autenticación
    if (!isLoading) {
      if (isAuthenticated && token) {
        const decodedUrl = decodeURIComponent(returnUrl);
        console.log(`Usuario ya autenticado. Redirigiendo a: ${decodedUrl}`);
        router.push(decodedUrl);
      }
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router, returnUrl, token, isLoading]);

  // Función que se ejecuta después de un login exitoso
  const handleLoginSuccess = () => {
    const decodedUrl = decodeURIComponent(returnUrl);
    console.log(`Login exitoso. Redirigiendo a: ${decodedUrl}`);
    router.push(decodedUrl);
  };

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  // Mostrar spinner mientras se verifica la autenticación
  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Progress value={33} />
        <span className="ml-2 text-gray-600">Verificando sesión...</span>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center md:h-screen dark:bg-gray-900">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
       
        {isRegistering ? (
          <SignupForm
            onSignupSuccess={handleLoginSuccess} 
            onGoBack={handleToggleForm}
          />
        ) : (
          <LoginForm
            onLoginSuccess={handleLoginSuccess} 
            onGoBack={handleGoBack}
          />
        )}
      </div>
    </main>
  );
}
