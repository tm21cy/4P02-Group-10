"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../_components/Header";
import { useSubscriptionStore } from "@/lib/store";
import { IconCrown, IconAlertCircle } from "@tabler/icons-react";
import { useUser } from "@clerk/nextjs";

export default function SubscriptionPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const setSubscribed = useSubscriptionStore((state) => state.setSubscribed);
  const isSubscribed = useSubscriptionStore((state) => 
    state.subscriptions[user?.id] || false
  );

  const handleCancel = () => {
    setSubscribed(user.id, false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />
      
      <div className="max-w-2xl mx-auto pt-24 px-4">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <IconCrown className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Subscription Management
            </h1>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-2">Current Plan</h2>
              <p className="text-gray-300">
                {isSubscribed ? "Pro Plan" : "Free Plan"}
              </p>
            </div>

            {isSubscribed && !showConfirm && (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition-all duration-200"
              >
                Cancel Subscription
              </button>
            )}

            {showConfirm && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <IconAlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-1">Confirm Cancellation</h3>
                      <p className="text-gray-300 text-sm">
                        Are you sure you want to cancel your Pro subscription? You'll lose access to:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-300">
                        <li>• AI-powered financial insights</li>
                        <li>• Premium support</li>
                        <li>• Advanced features</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all duration-200"
                  >
                    Yes, Cancel Subscription
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 p-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all duration-200"
                  >
                    Keep Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
