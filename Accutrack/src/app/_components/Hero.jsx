"use client";
import React, { useEffect, useRef, useState, Fragment} from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  Transition,
  TransitionChild,
} from '@headlessui/react'; //npm install @headlessui/react @tabler/icons-react @clerk/nextjs
import { Button } from '@/components/ui/button';
import {
  IconChartPie,
  IconBoxSeam,
  IconReportMoney,
  IconFileAnalytics,
} from "@tabler/icons-react";

function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
}

function Hero() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      icon: <IconChartPie className="h-6 w-6" />,
      title: "Financial Analytics",
      description: "Real-time tracking of expenses and income",
    },
    {
      icon: <IconBoxSeam className="h-6 w-6" />,
      title: "Inventory Control",
      description: "Smart inventory management system",
    },
    {
      icon: <IconReportMoney className="h-6 w-6" />,
      title: "Tax Management",
      description: "Automated sales tax calculations",
    },
    {
      icon: <IconFileAnalytics className="h-6 w-6" />,
      title: "Reports & Insights",
      description: "Generate comprehensive financial reports",
    },
  ];

  const showcaseItems = [
    {
      image: "/dashboard.png",
      title: "Intuitive Dashboard",
      description: "Get a comprehensive overview of your financial health with our intuitive dashboard. Track expenses, monitor cash flow, and visualize trends at a glance."
    },
    {
      image: "/income.png",
      title: "Manage Finances",
      description: "Take control of your finances with our comprehensive management tools. Track income, expenses, and cash flow with ease and precision."
    },
    {
      image: "/inventory.png",
      title: "Smart Inventory",
      description: "Manage your inventory effortlessly with real-time stock tracking, automated reordering, and detailed product analytics."
    },
    {
      image: "/reports.png",
      title: "Detailed Reports",
      description: "Generate professional financial reports with just a few clicks. Export data in multiple formats and gain valuable insights into your business performance."
    }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden isolate">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float mix-blend-overlay" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed mix-blend-overlay" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse mix-blend-overlay" />
        {/* Additional modern blur elements */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 to-gray-900/30 backdrop-blur-[2px]" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 backdrop-blur-sm">
        <div className="text-center space-y-8 animate-fadeIn pt-10">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-purple-500 animate-gradient pb-2 leading-tight hover:scale-105 transition-transform duration-300">
            Welcome to AccuTrack
            <br />
          </h1>
          
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            AccuTrack brings intelligent financial tracking, automated tax management, 
            and real-time analytics together in one powerful platform.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push(isSignedIn ? '/dashboard' : '/sign-up')}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium 
              hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
              active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveFeature(feature)}
              className={`p-6 rounded-2xl bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 
                hover:border-gray-600 transition-all group animate-fadeIn opacity-0 hover:bg-gray-800/40
                hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 
                flex items-center justify-center mb-4 group-hover:scale-110 transition-transform 
                shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
                <div className="text-white group-hover:animate-pulse">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Popup Modal */}
        <Transition appear show={!!activeFeature} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setActiveFeature(null)}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </TransitionChild>

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className={"w-full max-w-md rounded-2xl bg-gray-900 border border-gray-700/50 p-6 text-white shadow-xl"}>
                  {activeFeature && (
                    <>
                      {/* Does this need a exit button? */}

                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-blue-500/20 text-blue-300">{activeFeature.icon}</div>
                        <DialogTitle 
                          className="text-lg font-bold">{activeFeature.title}
                        </DialogTitle>
                      </div>

                      <DialogDescription 
                        className="text-gray-400 mb-4">
                        {activeFeature.description}
                      </DialogDescription>

                      {/* Placeholder for dynamic feature logic */}
                      <div className="text-gray-400 mb-4">
                        Maybe some more words or a picture?
                      </div>

                    
                      <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => router.push(isSignedIn ? '/dashboard' : '/sign-up')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-200"
                      >
                        Start Using {activeFeature.title}
                      </Button>
                    </div>
                    </>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition> 


        {/* Showcase Section */}
        <div className="mt-32 space-y-32">
          {showcaseItems.map((item, index) => {
            const [ref, isInView] = useInView();
            return (
              <div
                key={index}
                ref={ref}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center gap-12 opacity-0 transform translate-y-10 transition-all duration-700
                ${isInView ? 'opacity-100 translate-y-0' : ''}`}
              >
                <div className="flex-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`rounded-2xl shadow-2xl shadow-purple-500/10 transition-all duration-500 delay-200
                    ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} 
                    hover:scale-105 border border-gray-700/50`}
                  />
                </div>
                <div className={`flex-1 space-y-6 transition-all duration-500 delay-300
                  ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}

export default Hero;

