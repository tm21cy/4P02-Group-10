'use client'

import React from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Inventory() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <Header />
            <main className="flex-grow container mx-auto p-4 pt-20">
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6 transition-transform hover:scale-105 duration-300">
                            <div className="bg-purple-500/20 p-5 rounded-full ring-2 ring-purple-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent py-2">
                            Inventory Management
                        </h1>
                        <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                            Track and manage your company's inventory
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <Link href="/inventory/manage" className="block h-full transform transition-all duration-300 hover:scale-102">
                            <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-pink-500/50 transition-all duration-300 h-full group">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-purple-500/20 p-4 rounded-full mb-6 group-hover:bg-purple-500/40 transition-all duration-300 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />   
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Manage Inventory</h2>
                                    <p className="text-gray-300 text-center text-lg">View and manage your inventory items</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/inventory/add" className="block h-full transform transition-all duration-300 hover:scale-102">
                            <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-pink-500/50 transition-all duration-300 h-full group">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-purple-500/20 p-4 rounded-full mb-6 group-hover:bg-purple-500/40 transition-all duration-300 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Add Inventory</h2>
                                    <p className="text-gray-300 text-center text-lg">Add new items to your inventory</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Inventory;