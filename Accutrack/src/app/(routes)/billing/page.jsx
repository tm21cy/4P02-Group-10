"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../_components/Header";
import { useSubscriptionStore } from "@/lib/store";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planType = searchParams.get('plan');
  const amount = planType === 'monthly' ? '$5/month' : '$30/year';

  const [formData, setFormData] = useState({
    workEmail: '',
    fullName: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
  });

  const setSubscribed = useSubscriptionStore((state) => state.setSubscribed);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set subscription status
    setSubscribed(true);
    
    // Store user billing info if needed
    const billingInfo = {
      ...formData,
      planType,
      subscriptionDate: new Date().toISOString(),
    };
    
    // You could save this to your database here
    console.log('Billing info:', billingInfo);
    
    // Redirect to AI chat
    router.push('/ai-chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />
      
      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Complete Your Subscription
            </h1>
            <p className="text-gray-400">
              {planType === 'monthly' ? 'Monthly' : 'Annual'} Plan - {amount}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Work Email
              </label>
              <input
                type="email"
                required
                value={formData.workEmail}
                onChange={(e) => setFormData({...formData, workEmail: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Job Title
              </label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Financial Manager"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-1 block">
                Phone Number
              </label>
              <input
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
    </div>
  );
}
