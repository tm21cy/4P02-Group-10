'use client'

import React, { useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Page for adding new expenses
function AddExpense() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Header />
            
            <div className="container mx-auto p-4">
                {/* Page header section */}
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        {/* Icon in a circle */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-teal-500/20 p-5 rounded-full ring-2 ring-teal-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        {/* Page title with gradient effect */}
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                            Add New Expense
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Record your latest expense
                        </p>
                    </div>

                    {/* Expense form card */}
                    <div className="w-full max-w-2xl">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                            <form className="space-y-6">
                                {/* Amount field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Description field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        placeholder="What was this expense for?"
                                    />
                                </div>

                                {/* Category field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white">
                                        <option value="">Select a category</option>
                                        <option value="1">Groceries</option>
                                        <option value="2">Transport</option>
                                        <option value="3">Bills</option>
                                        <option value="4">Entertainment</option>
                                        <option value="5">Other</option>
                                    </select>
                                </div>

                                {/* Date field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                    />
                                </div>

                                {/* Form buttons */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href="/expenses">
                                        <Button className="bg-gray-700 text-white hover:bg-gray-600">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white">
                                        Add Expense
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpense; 
