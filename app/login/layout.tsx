import { useAuthStore } from "@/store/auth/auth.store";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:flex lg:flex-col items-center justify-center bg-indigo-700">
        <img
          src="./frontw&b.jpg"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        /> 
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        {children}
      </div>
    </div>
  );
};
