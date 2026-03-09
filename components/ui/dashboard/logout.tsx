"use client";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";

const LogoutButton = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogOut = async () => {
    logout();
    router.push("/login");
  };

  return (
    <button onClick={handleLogOut} className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 dark:bg-[#020817]">
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Salir</div>
    </button>
  );
};

export default LogoutButton;
