import Header from "../../_components/Header";
import ClientBillingWrapper from "./ClientBillingWrapper";

/**
 * Basic wrapper for serving and formatting the billing page. Delegated to the ClientBillingWrapper.
 * @returns JSX component.
 */
export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />
      <ClientBillingWrapper />
    </div>
  );
}
