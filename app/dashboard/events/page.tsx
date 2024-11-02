import React from "react";
import MyCalendar from "@/components/calendar/calendar";
import { Button } from "@/components/ui/servicios/button";
import Link from "next/link";

export default function page() {
  return (
    <div>
      <MyCalendar />
      <div className="justify-center align-middle flex mt-2">
        <Link href="/dashboard/events/listado-eventos">
          <Button children={"Ir a eventos"} />
        </Link>
      </div>
    </div>
  );
}
