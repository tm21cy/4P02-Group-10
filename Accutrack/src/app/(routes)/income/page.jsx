import React from "react";
import Header from "../../_components/Header";
import Link from "next/link";

// Main page for managing income
function Income() {
    return (
        // Dark gradient background
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Header />
            
            <div className="container mx-auto p-4">
                {/* Page header section */}
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-12">
                        {/* Icon in a circle */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-blue-500/20 p-5 rounded-full ring-2 ring-blue-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        {/* Page title with gradient effect */}
                        <h1 className="text-5xl font-bold mb-2 leading-relaxed bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Income Management
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Monitor and manage your income streams effectively
                        </p>
                    </div>
                    
                    {/* Navigation cards grid */}
                    <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full">
                        {/* Manage Income Card */}
                        <Link 
                            href="/income/manage" 
                            className="group hover:scale-105 transition-all duration-300 h-full"
                        >
                            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500/50 transition-colors h-full">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-blue-500/20 p-4 rounded-full mb-4 group-hover:bg-blue-500/30 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Manage Income</h2>
                                    <p className="text-gray-400 text-center text-lg">View and manage your income records</p>
                                </div>
                            </div>
                        </Link>
                        
                        {/* Add New Income Card */}
                        <Link 
                            href="/income/add" 
                            className="group hover:scale-105 transition-all duration-300 h-full"
                        >
                            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-blue-500/50 transition-colors h-full">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-blue-500/20 p-4 rounded-full mb-6 group-hover:bg-blue-500/30 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Add Income</h2>
                                    <p className="text-gray-400 text-center text-lg">Record a new income entry</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Income;