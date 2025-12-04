import { ReactNode } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Layout responsive */}
      <div className="flex flex-col lg:flex-row">
        {/* Imagen a la izquierda solo en desktop */}
        <div className="w-full lg:w-1/2 h-screen hidden lg:flex flex-col items-center justify-center bg-gray-900">
          <div className="relative w-full h-full">
            <img
              src="./frontb&w.jpg"
              alt="Living by Arild Aarnes on 500px.com"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-slate-900/40" />
          </div>
        </div>
        {/* Formulario a la derecha */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-gray-900">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
