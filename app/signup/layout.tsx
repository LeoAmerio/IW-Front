import { ReactNode } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-900 flex justify-center items-center min-h-screen h-auto">
      {/* Imagen a la izquierda solo en desktop */}
      <div className="w-1/2 h-screen hidden lg:flex flex-col items-center justify-center bg-gray-900">
        <img
          src="./frontb&w.jpg"
          alt="Living by Arild Aarnes on 500px.com"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        {children}
      </div>
    </div>
  );
}
