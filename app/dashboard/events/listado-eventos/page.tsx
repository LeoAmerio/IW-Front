"use client";
import { lusitana } from "@/components/ui/fonts";
import EventsSections from "@/components/events/events-section";

export default async function Page() {
  return (
    <div>
      <h1 className={`${lusitana.className} m-4 text-xl md:text-2xl justify-center align-middle flex`}>
        Eventos
      </h1>
      <EventsSections />
    </div>
  );
}