"use client";

import dynamic from "next/dynamic";

const BillingForm = dynamic(() => import('./BillingForm'), { ssr: false });

export default function ClientBillingWrapper() {
  return <BillingForm />;
}
