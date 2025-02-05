'use client'

import React from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Form for adding new income
function AddIncome() {
    return (
        <div className="container mx-auto p-4">
            <Header />
            
            {/* Main form container */}
            <div className="mt-8 max-w-2xl mx-auto">
                {/* Transparent card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                    {/* Header and back button */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white">Add New Income</h1>
                        <Link href="/income">
                            <Button variant="ghost" className="text-gray-400 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                    </div>

                    {/* Income entry form */}
                    <form className="space-y-6">
                        {/* Amount input field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Description input field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="What is this income for?"
                            />
                        </div>

                        {/* Category selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <select 
                                required
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            >
                                <option value="">Select a category</option>
                                <option value="1">Salary</option>
                                <option value="2">Freelance</option>
                                <option value="3">Investments</option>
                                <option value="4">Business</option>
                                <option value="5">Other</option>
                            </select>
                        </div>

                        {/* Date input field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>

                        {/* Form buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/income">
                                <Button className="bg-gray-700 text-white hover:bg-gray-600">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
                                Add Income
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddIncome; 