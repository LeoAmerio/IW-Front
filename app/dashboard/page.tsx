import { fetchCardData } from "@/app/lib/data";
import { lusitana } from "@/components/ui/fonts";
import { Suspense, useState } from "react";
import { Posteo } from "@/interfaces/types";

import CardWrapper from "@/components/ui/dashboard/cards";
import PostsSection from "@/components/ui/dashboard/posts-section";

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
      </div>
      <PostsSection />
    </main>
  );
}

{
  /* <main>
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
        /> 
      </div>
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8"> 
      <div className="mt-6 grid grid-cols-1">
        <PostCard posteo={posteo} />
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense> 
      </div>
    </main> */
}
