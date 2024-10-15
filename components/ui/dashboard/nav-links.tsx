'use client';
import { useAuthStore } from '@/services/auth.service';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ServerIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import { useQuery } from 'react-query';
import { User } from '@/interfaces/user.interface';
import { fetchUserById } from '@/api/user.api';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  // {
  //   name: 'Invoices',
  //   href: '/dashboard/invoices',
  //   icon: DocumentDuplicateIcon,
  // },
  { name: 'Servicios', href: '/dashboard/servicios', icon: UserGroupIcon },
  { name: 'Eventos', href: '/dashboard/events', icon: CalendarIcon },
  { name: 'Admin Page', href: 'https://ucse-iw-2024.onrender.com/admin', icon: ServerIcon, role: 'Administrador' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const user_id = useAuthStore((state) => state.user_id);

  const { data, isLoading } = useQuery(
    ['user', user_id], 
    () => fetchUserById(user_id), 
    {
      enabled: !!user_id,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onError: (error: Error) => {
        console.error(`Fetch error ${error.message}`)
      }
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.rol_info) {
    return <div>Error: Datos del usuario no disponibles</div>;
  }

  return (
    <>
      {links
      .filter((link) => !link.role || link.role === data.rol_info.rol)
      .map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm 
            font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
