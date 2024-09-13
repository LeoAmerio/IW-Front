'use client';
import { useAuthStore } from '@/services/auth.service';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from "js-cookie";
import { useQuery } from 'react-query';

const fetchUserById = async (user_id: number) => {
  const response = await fetch(`https://ucse-iw-2024.onrender.com/auth/usuarios/${user_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${Cookies.get("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el usuario");
  }

  return response.json();
};

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Admin Page', href: 'https://ucse-iw-2024.onrender.com/admin', icon: ServerIcon, role: 'Administrador' },
];

export default function NavLinks() {
  const pathname = usePathname();
  const user_id = useAuthStore((state) => state.user_id);

  const { data, isLoading } = useQuery(
    ['user', user_id], 
    () => fetchUserById(user_id!), 
    {
      enabled: !!user_id,
      refetchOnWindowFocus: false
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // console.log('User data', data.rol_info.rol);

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
