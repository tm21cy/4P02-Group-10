'use client'

import React from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import Link from "next/link";

function Expenses() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900">
            <Header />
            <main className="flex-grow container mx-auto p-4 pt-20">
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6 transition-transform hover:scale-105 duration-300">
                            <div className="bg-teal-500/20 p-5 rounded-full ring-2 ring-teal-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-purple-500 to-teal-600 bg-clip-text text-transparent py-2">
                            Expense Management
                        </h1>
                        <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                            Track and manage your expenses efficiently
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <Link href="/expenses/manage" className="block h-full transform transition-all duration-300 hover:scale-102">
                            <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300 h-full group">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-teal-500/20 p-4 rounded-full mb-6 group-hover:bg-teal-500/40 transition-all duration-300 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors">Manage Expenses</h2>
                                    <p className="text-gray-300 text-center text-lg">View, edit, and analyze your expense history</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/expenses/add" className="block h-full transform transition-all duration-300 hover:scale-102">
                            <div className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-gray-700 hover:border-teal-500/50 transition-all duration-300 h-full group">
                                <div className="flex flex-col items-center h-full">
                                    <div className="bg-teal-500/20 p-4 rounded-full mb-6 group-hover:bg-teal-500/40 transition-all duration-300 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors">Add Expense</h2>
                                    <p className="text-gray-300 text-center text-lg">Record a new expense entry</p>
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

export default Expenses;