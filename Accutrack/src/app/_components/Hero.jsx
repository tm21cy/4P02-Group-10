"use client"; // Ensures this is a Client Component

import React from 'react';
import { useRouter } from 'next/navigation';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { 
  IconArrowWaveRightUp, 
  IconClipboardCopy, 
  IconFileBroken, 
  IconSignature, 
  IconTableColumn 
} from "@tabler/icons-react";

const items = [
  {
    title: "Expense and Income Management",
    description: "Track and categorize finances",
    header: (
      <img 
        src="/exp-and-inc.jpg" 
        alt="Lifelong Learning" 
        className="w-full h-full object-cover rounded-xl" 
      />
    ),
    icon: <IconArrowWaveRightUp className="h-6 w-6 text-white" />,
    link: "/lifelong-learning",
    // Spans all 4 columns
    className: "md:col-span-4" 
  },
  {
    title: "Inventory Tracking",
    description: "Supervise inventory tracking and replenishment",
    header: (
      <img 
        src="/inventory.jpg" 
        alt="Big Picture" 
        className="w-full h-full object-cover rounded-xl" 
      />
    ),
    icon: <IconClipboardCopy className="h-6 w-6 text-white" />,
    link: "/big-picture"
  },
  {
    title: "Sales tax management",
    description: "Record collected and incurred sales tax on products",
    header: (
      <img 
        src="/finance.jpg" 
        alt="Finance" 
        className="w-full h-full object-cover rounded-xl" 
      />
    ),
    icon: <IconFileBroken className="h-6 w-6 text-white" />,
    link: "/finance"
  },
  {
    title: "Report Generation",
    description: "Generate income, expense, and tax statements",
    header: (
      <img 
        src="/report-gen.jpg" 
        alt="Design Thinking" 
        className="w-full h-full object-cover rounded-xl" 
      />
    ),
    icon: <IconSignature className="h-6 w-6 text-[#bbbbbb]" />,
    link: "/design-thinking"
  },
];

function Hero() {
  const router = useRouter();

  return (
    <section className="text-center py-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to AccuTrack
        </h1>


      {/* Another Grid with One Item That Spans 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto mt-10 py-10">
        <BentoGridItem
          title="The future of accounting and financial management is here"
          description=" Smarter, simpler, and built for those with the largest aspirations. Say hello to effortless financial management with a software built for you"
          header={
            <img 
              src="/finance-cover.jpg" 
              alt="Spanning Item" 
              className="w-full h-full object-cover rounded-xl" 
            />
          }
          className="md:col-span-4 cursor-pointer transition-transform transform hover:scale-105 active:scale-95"
        />
      </div>
        
        <div className="bg-[#1c2230] rounded-2xl py-6 px-8 text-center w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-[#bbbbbb] dark:text-[#bbbbbb]">
                Features
            </h1>
        </div>

      {/* Main Bento Grid */}
      <BentoGrid className="max-w-7xl mx-auto py-10 ">
        {items.map((item, i) => (
          <button 
            key={i}
            onClick={() => router.push(item.link)}
            className="w-full focus:outline-none"
          >
            <BentoGridItem
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              // Wrap the className string in backticks for correct interpolation
              className={`cursor-pointer transition-transform transform hover:scale-105 active:scale-95 ${item.className || ""}`}
            />
          </button>
        ))}
      </BentoGrid>

      
    </section>
  );
}

export default Hero;
