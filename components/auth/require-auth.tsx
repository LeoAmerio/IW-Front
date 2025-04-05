'use client';

import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState, ReactNode } from "react";
import { useAuthStore } from '@/store/auth/auth.store';
import { useAuth } from '@/components/providers/auth-provider';
import { Progress } from '@/components/ui/progress';

// Rutas que no requieren autenticación
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/recuperar-password',
  '/acerca-de',
  '/contacto'
];

// Tipos definidos para las props del componente
interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode; // Componente opcional para mostrar durante la carga
}

export default function RequireAuth({ 
  children, 
  fallback = <div className="flex justify-center items-center min-h-screen"><Progress value={33} /></div>
}: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isInitialized } = useAuth();
  const { isAuthenticated, isLoading, token } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    token: state.token
  }));
  
  // Estado local para controlar si se muestra el contenido protegido
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    // No hacer nada hasta que la autenticación se haya inicializado
    if (!isInitialized) {
      return;
    }

    // Verificar si la ruta actual es pública
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isPublicRoute) {
      // Si es una ruta pública, permitir acceso sin importar el estado de autenticación
      setCanAccess(true);
      return;
    }

    // Para rutas protegidas, verificar autenticación
    if (!isAuthenticated && !isLoading && !token) {
      // Guardar la ruta actual para redireccionar después del login
      const returnUrl = encodeURIComponent(pathname);
      
      console.log(`Redirigiendo a login desde: ${pathname}`);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Si está autenticado o en proceso de carga, permitir acceso
    setCanAccess(true);
  }, [isInitialized, isAuthenticated, isLoading, pathname, router, token]);

  // Si no se puede acceder aún, mostrar el fallback
  if (!canAccess || isLoading) {
    return <>{fallback}</>;
  }

  // Si todo está bien, mostrar el contenido protegido
  return <>{children}</>;
}

