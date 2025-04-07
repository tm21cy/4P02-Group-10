"use client";

import dynamic from "next/dynamic";

const BillingForm = dynamic(() => import('./BillingForm'), { ssr: false });

/**
 * Basic wrapper for serving the billing portal.
 * @returns JSX component.
 */
export default function ClientBillingWrapper() {
  return <BillingForm />;
}
