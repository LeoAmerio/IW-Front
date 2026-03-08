"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";
import { IconSettings, IconSettings2 } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/ThemeSwitcher/theme-toggle";

export default function Header() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const handleLogOut = async () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-end border-b px-4 py-2 m-2">
      {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            2
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <IconSettings size={18} />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleLogOut}>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
