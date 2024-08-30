import { fetchCardData } from "@/app/lib/data";
import RevenueChart from "@/components/ui/dashboard/revenue-chart";
import LatestInvoices from "@/components/ui/dashboard/latest-invoices";
import { lusitana } from "@/components/ui/fonts";
import { Suspense } from "react";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/components/ui/skeletons";
import CardWrapper, { Card } from "@/components/ui/dashboard/cards";
import PostCard from "@/components/Posts/post-card";

export default async function Page() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} m-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper 
          numberOfCustomers={numberOfCustomers} 
          numberOfInvoices={numberOfInvoices}
          totalPaidInvoices={totalPaidInvoices}
          totalPendingInvoices={totalPendingInvoices}
        />
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> */}
      </div>
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8"> */}
      <div className="mt-6 grid grid-cols-1">
        <PostCard posteo={posteo} />
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense> */}
      </div>
    </main>
  );
}


const posteo = {
  "id": 12,
  "titulo": "probando hacer un posteo",
  "descripcion": "soy leo posteando en mi edificio :)",
  "usuario": { 
    "id": 38,
    "nombre": "leo",
    "apellido": "amerio",
    "piso": 2,
    "numero": "D"
  },
  "tipo_posteo": { 
    "id": 1,
    "tipo": "Reclamo"
  },
  "imagen": null,
  "fecha_creacion_legible": "29 de agosto de 2024 a las 22:25"
}
