import React from 'react';
import { useRouter } from 'next/navigation';
import { IconX, IconCheck } from '@tabler/icons-react';

const PricingModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  const selectPlan = (plan) => {
    router.push(`/billing?plan=${plan}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <IconX size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Choose Your Professional Plan
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Get personalized financial insights powered by AI
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly Plan */}
            <div className="p-6 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Monthly Plan</h3>
              <p className="text-3xl font-bold text-purple-400 mb-4">$5<span className="text-sm text-gray-400">/month</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-purple-400 mr-2" />
                  Unlimited AI conversations
                </li>
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-purple-400 mr-2" />
                  Financial insights
                </li>
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-purple-400 mr-2" />
                  Cancel anytime
                </li>
              </ul>
              <button
                onClick={() => selectPlan('monthly')}
                className="w-full py-2 px-4 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg border border-purple-500/40 transition-all duration-200"
              >
                Select Monthly Plan
              </button>
            </div>

            {/* Annual Plan */}
            <div className="p-6 rounded-xl bg-white/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">Annual Plan</h3>
                <div className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full">
                  Save 50%
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-400 mb-4">$30<span className="text-sm text-gray-400">/year</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-blue-400 mr-2" />
                  All monthly features
                </li>
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-blue-400 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <IconCheck className="h-5 w-5 text-blue-400 mr-2" />
                  50% discount
                </li>
              </ul>
              <button
                onClick={() => selectPlan('annual')}
                className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/40 transition-all duration-200"
              >
                Select Annual Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
