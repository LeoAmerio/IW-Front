import AcmeLogo from "@/components/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { CardWithBackground } from "../components/ui/dashboard/cards";
import { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <>
      <main className="flex min-h-screen flex-col p-6">
        {/* <CardWithBackground img='/cat.png' alt='desde home' classNamesDivLogo='flex h-20 shrink-0 items-end rounded-lg p-4 md:h-52 w-32 text-white md:w-40 z-10 relative' /> */}
        <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52 ">
          <AcmeLogo />
        </div>
        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
            <p
              className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}
            >
              <strong>Bienvenido a Housinger.</strong> La mejor herramienta de
              administracion{" "}
              <a href="https://nextjs.org/learn/" className="text-blue-500">
                para su edificio
              </a>
              , creado por nuestro quipo, con amor.
            </p>
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Iniciar Sesion</span>{" "}
              <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Registrarse</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
            <Image
              src="/Diseño sin título.png"
              alt="Screenshot of the dash"
              width={1000}
              height={760}
              className="hidden md:block"
            />
            <Image
              src="/Diseño sin título (2).png"
              alt="Screenshot of the dash"
              width={560}
              height={620}
              className="block md:hidden"
            />
          </div>
        </div>
        <br />
      </main>
      <div className="w-full h-auto max-h-screen">
        <Link href="/signup">
          <Image
            src="/CapturaTrampa.png"
            alt="Muestra sitio web"
            layout="cover"
            width={9000}
            height={900}
          />
        </Link>
      </div>
    </>
  );
}
