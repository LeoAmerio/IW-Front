"use client";
import { lusitana } from "@/components/ui/fonts";
import EventsSections from "@/components/events/events-section";
import { BackButton } from "@/components/ui/BackButton";

export default async function Page() {
  return (
    <div>
      <div className="relative flex items-center mb-6">
        <div className="absolute left-0">
          <BackButton href="/dashboard/events" />
        </div>
        <h1
          className={`${lusitana.className} text-xl md:text-2xl w-full text-center`}
        >
          Eventos
        </h1>
      </div>
      <EventsSections />
    </div>
  );
}
