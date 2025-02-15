"use client";  // This forces the file to be a Client Component
import React, { useState } from "react"; // Import the React library
import Header from "../../_components/Header"; // Import the Header component
import Footer from "../../_components/Footer"; // Import the Footer component
import 
{ 
  IconFileText, 
  IconClipboardList, 
  IconChartPie, 
  IconSettings, 
  IconChevronDown, 
  IconChevronUp 
} from "@tabler/icons-react"; 

const dashboardButtons = 
[
  {
    title: "Reports",
    description: "View and generate financial reports",
    icon: <IconFileText className="h-8 w-8 text-teal-300" />,
    link: "/reports"
  },
  {
    title: "Transactions", 
    description: "Manage and review income & expenses",
    icon: <IconClipboardList className="h-8 w-8 text-blue-300" />,
    link: "/transactions"
  },
  {
    title: "Analytics",
    description: "Analyze financial data trends",
    icon: <IconChartPie className="h-8 w-8 text-purple-300" />,
    link: "/analytics"
  },
  {
    title: "Settings",
    description: "Customize your preferences",
    icon: <IconSettings className="h-8 w-8 text-gray-300" />,
    link: "/settings"
  },
];

function Dashboard() 
{
  const [showGraph, setShowGraph] = useState(true); // To use for toggling the graph
  
  return (
    <div className="min-h-screen bg-[#1c2230] text-[#bbbbbb]">
      <Header />
      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <p className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
        Welcome Back to AccuTrack
        </p>
      </div>

      {/* Hide the dashboard */}
      <div className="max-w-6xl mx-auto px-4 mt-4 flex justify-end">
        <button 
          onClick={() => setShowGraph(!showGraph)} 
          className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition flex items-center gap-1 text-xs" 
        > {/*text-xs (smallest one) /sm /lg*/}
          {showGraph ? "Hide Graph" : "Show Graph"}
          {showGraph ? <IconChevronUp className="h-3 w-3" /> : <IconChevronDown className="h-3 w-3" />}  {/* h-# w-# for size of button */}
        </button>
      </div>

      {/* Graph Section - Appears Below the Toggle Button [max-w-6xl mx-auto px-6 mt-8*/}
      {showGraph && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <img 
            src="/finance-cover.jpg" 
            alt="Spanning Item" 
            className="w-full h-full object-cover rounded-xl transition-all duration-500" 
          />
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 mt-10">
        {dashboardButtons.map((item, i) => (
          <a key={i} href={item.link} className="group bg-gray-900 p-6 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300">
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-teal-300 transition">{item.title}</h2>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <Footer />
    </div>    
  );
}

export default Dashboard;
