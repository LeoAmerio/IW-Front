import AcmeLogo from "@/components/ui/acme-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { LinkPreview } from "@/components/ui/link-preview";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (

    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>

    // <>
    //   <main className="flex min-h-screen flex-col p-6 dark:bg-gray-900">
    //     <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52 ">
    //       <AcmeLogo />
    //     </div>
    //     <div className="mt-4 flex grow flex-col gap-4 md:flex-row dark:bg-gray-800 bg-gray-50 rounded-lg">
    //       <div className="flex flex-col justify-center gap-6 px-6 py-10 md:w-2/5 md:px-20 dark:bg-gray-800 bg-gray-50 rounded-lg">
    //         <p
    //           className={`text-xl text-gray-800 md:text-3xl md:leading-normal 
    //                       dark:text-white  // This ensures other text is white in dark mode
    //                     `}
    //         >
    //           <strong>
    //             Bienvenido a{" "}
    //             <LinkPreview
    //               url="/login?nextUrl=/dashboard"
    //               imageSrc="/CapturaTrampa.png"
    //               isStatic={true}
    //               className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500 
    //                       dark:from-purple-500 dark:to-pink-500 dark:text-transparent"
    //             >
    //               Housinger.{" "}
    //             </LinkPreview>
    //           </strong>
    //           La mejor herramienta de administracion{" "}
    //           <LinkPreview
    //             url="/login?nextUrl=/dashboard/events"
    //             isStatic={true}
    //             imageSrc="/imgCalendar.svg"
    //             className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500 
    //                     dark:from-purple-500 dark:to-pink-500 dark:text-transparent"
    //           >
    //             para su edificio
    //           </LinkPreview>
    //           , creado por nuestro quipo, con amor.
    //         </p>
    //         <Link
    //           href="/login"
    //           className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
    //         >
    //           <span>Iniciar Sesion</span>{" "}
    //           <ArrowRightIcon className="w-5 md:w-6" />
    //         </Link>
    //         <Link
    //           href="/signup"
    //           className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
    //         >
    //           <span>Registrarse</span> <ArrowRightIcon className="w-5 md:w-6" />
    //         </Link>
    //       </div>
    //       <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
    //         <Image
    //           src="/Diseño sin título.png"
    //           alt="Screenshot of the dash"
    //           width={1000}
    //           height={760}
    //           className="hidden md:block"
    //         />
    //         <Image
    //           src="/Diseño sin título (2).png"
    //           alt="Screenshot of the dash"
    //           width={560}
    //           height={620}
    //           className="block md:hidden"
    //         />
    //       </div>
    //     </div>
    //     <br />
    //   </main>
      
    // </>
  );
}
