'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/providers/auth-provider';
import RequireAuth from '@/components/auth/require-auth';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Crear QueryClient fuera del componente para evitar recreación en cada render
const queryClient = new QueryClient();

// Rutas públicas que no requieren autenticación
const publicPaths = [
    '/',
    '/login',
    '/signup',
    '/recuperar-password',
    '/acerca-de',
    '/contacto'
];

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    // Estado para controlar la inicialización del lado del cliente
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    // Verificar si la ruta actual es pública
    const isPublicRoute = publicPaths.some(path => 
        pathname === path || pathname?.startsWith(`${path}/`)
    );

    // Asegurar hidratación del lado del cliente para prevenir problemas 
    // con el renderizado del servidor
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Si no está montado, renderizar un placeholder o nada
    // Esto evita errores de hidratación con el localStorage usado por Zustand
    if (!isMounted) {
        return null; // O un placeholder loading
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {isPublicRoute ? (
                        // Rutas públicas no requieren autenticación
                        children
                    ) : (
                        // Rutas protegidas pasan por RequireAuth
                        <RequireAuth>
                            {children}
                        </RequireAuth>
                    )}
                </AuthProvider>
                <Toaster />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
