'use client'

import React, { useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { postNewExpense } from "@/lib/db";

// Page for adding new expenses
function AddExpense() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [formData, setFormData] = useState({
        amount: "", // Empty string to avoid input issues
        description: "",
        tag: "",
        date: new Date().toISOString().split("T")[0], // Default to today (YYYY-MM-DD)
        userId: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "amount" ? parseFloat(value) || "" : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        const updatedFormData = { ...formData, userId: user.id };

        try {
            await postNewExpense(updatedFormData);
            setMessage("Expense added successfully!");
            setFormData({
                amount: "",
                description: "",
                tag: "",
                date: new Date().toISOString().split("T")[0],
                userId: ""
            });
        } catch (e) {
            console.log(e);
            setMessage("Error adding expense.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <Header />
            <div className="container mx-auto p-4">
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-teal-500/20 p-5 rounded-full ring-2 ring-teal-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
                            Add New Expense
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Record your latest expense
                        </p>
                    </div>
                    <div className="w-full max-w-2xl">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="amount"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        value={formData.amount}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        placeholder="What was this expense for?"
                                        onChange={handleChange}
                                        value={formData.description}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        name="tag"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        onChange={handleChange}
                                        value={formData.tag}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Transport">Transport</option>
                                        <option value="Bills">Bills</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                        onChange={handleChange}
                                        value={formData.date}
                                    />
                                </div>
                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href="/expenses">
                                        <Button className="bg-gray-700 text-white hover:bg-gray-600">Cancel</Button>
                                    </Link>
                                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={loading}>
                                        {loading ? "Adding..." : "Add Expense"}
                                    </Button>
                                </div>
                                {message && (
                                    <p className={`text-center mt-4 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                                        {message}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddExpense;
