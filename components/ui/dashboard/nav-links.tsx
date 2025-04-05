'use client';
import { useAuthStore } from '@/store/auth/auth.store';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ServerIcon,
  ServerStackIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  // {
  //   name: 'Invoices',
  //   href: '/dashboard/invoices',
  //   icon: DocumentDuplicateIcon,
  // },
  { name: 'Servicios', href: '/dashboard/servicios', icon: UserGroupIcon },
  { name: 'Eventos', href: '/dashboard/events', icon: CalendarIcon },
  { name: 'Mensajes', href: '/dashboard/mensajes', icon: ChatBubbleLeftRightIcon },
  { name: 'Admin Page', href: 'https://ucse-iw-2024.onrender.com/admin', icon: ServerIcon, role: 'Administrador' },
  { name: 'Gestion de Servicios', href: '/gestion-servicios', icon: ServerStackIcon, role: 'Colaborador' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated, token, initializeAuth } = useAuthStore(state => ({
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    token: state.token,
    initializeAuth: state.initializeAuth
  }));

  // Inicializar la autenticación al cargar el componente si hay un token pero no hay usuario
  useEffect(() => {
    if (token && !user) {
      initializeAuth();
    }
  }, [token, user, initializeAuth]);

  // Mostrar estado de carga
  if (isLoading) {
    return <div>Cargando información del usuario...</div>;
  }

  // Mostrar error si no hay información de usuario disponible
  if (!isAuthenticated || !user || !user.rol_info) {
    return <div>Error: Datos del usuario no disponibles</div>;
  }

  return (
    <>
      {links
      .filter((link) => !link.role || link.role === user.rol_info?.rol)
      .map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-accent",
              pathname === link.href ? 'bg-sky-100 text-blue-600' : ''
            )}
            // className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm 
            // font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
            // ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
