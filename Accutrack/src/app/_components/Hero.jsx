"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import {
  IconChartPie,
  IconBoxSeam,
  IconReportMoney,
  IconFileAnalytics,
} from "@tabler/icons-react";

function Hero() {
  const router = useRouter();

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
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-[#1c2230] to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8 animate-fadeIn">
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
              onClick={() => router.push('/dashboard')}
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

        {/* Showcase Section */}
        <div className="mt-32 space-y-32">
          {showcaseItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 animate-fadeIn opacity-0 hover:scale-[1.02] transition-transform duration-500`}
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="flex-1">
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-2xl shadow-2xl shadow-purple-500/10 hover:scale-105 transition-transform duration-300 border border-gray-700/50"
                />
              </div>
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-300 text-lg">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Hero;

