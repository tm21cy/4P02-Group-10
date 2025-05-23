"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import Footer from "@/app/_components/Footer";
import React from "react";
export default function BillingForm() {
  // State management for the page router, search parameters, page loading state, selected plan, selected price, billing form, subscription status, and user authentication status.
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState('monthly');
  const [amount, setAmount] = useState('$5/month');
  const [formData, setFormData] = useState({
    workEmail: '',
    fullName: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
  });

  const setSubscribed = useSubscriptionStore((state) => state.setSubscribed);
  const { user } = useUser();

  /**
   * On initial load, see if the search parameters have recommended a plan - fallback to monthly.
   * Use this same information to set the billing amount.
   */
  useEffect(() => {
    try {
      const planType = searchParams?.get('plan') || 'monthly';
      setPlan(planType);
      setAmount(planType === 'monthly' ? '$5/month' : '$30/year');
    } catch (error) {
      console.error('Error reading search params:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  /**
   * On submission, initializes a subscription with the appropriate user data.
   * @param {*} e Context for the billing form.
   * @returns A new subscription and a redirect to the premium AI chat page.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSubscribed(user.id, true);
    router.push('/ai-chat');
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto pt-24 px-4">Loading...</div>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Complete Your Subscription
            </h1>
            <p className="text-gray-400">
              {plan === 'monthly' ? 'Monthly' : 'Annual'} Plan - {amount}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields */}
            <div>
              <label htmlFor="workEmail" className="text-gray-300 text-sm font-medium mb-1 block">
                Work Email
              </label>
              <input
                id="workEmail"
                type="email"
                required
                value={formData.workEmail}
                onChange={(e) => setFormData({...formData, workEmail: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label htmlFor="name" className="text-gray-300 text-sm font-medium mb-1 block">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="company" className="text-gray-300 text-sm font-medium mb-1 block">
                Company Name
              </label>
              <input
                id="company"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label htmlFor="job" className="text-gray-300 text-sm font-medium mb-1 block">
                Job Title
              </label>
              <input
                id="job"
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Financial Manager"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-gray-300 text-sm font-medium mb-1 block">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
