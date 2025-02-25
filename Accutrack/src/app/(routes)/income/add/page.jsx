"use client"

import React, { useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { postNewIncome } from "@/lib/db";
import { useUser } from "@clerk/nextjs";

function AddIncome() {
    const { isSignedIn, user, isLoaded } = useUser()
    const [formData, setFormData] = useState({
        amount: "", // Empty string to avoid input issues
        description: "",
        tag: "",
        customTag: "",
        date: new Date().toISOString().split("T")[0], // Default to today (YYYY-MM-DD)
        userId: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Convert number input properly
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "amount" ? parseFloat(value) || "" : 
            value,
            // Reset customTag when tag changes to non-Other
            customTag: name === "tag" && value !== "Other" ? "" : prevData.customTag
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        
        const updatedFormData = { 
            ...formData, 
            userId: user.id,
            // Use customTag if "Other" is selected, otherwise use selected tag
            tag: formData.tag === "Other" ? formData.customTag : formData.tag
        };

        try {
            await postNewIncome(updatedFormData);
            setMessage("Income added successfully!");
            setFormData({
                amount: "",
                description: "",
                tag: "",
                customTag: "",
                date: new Date().toISOString().split("T")[0],
                userId: ""
            });
        } catch (e) {
            console.log(e);
            setMessage("Error adding income.");
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-4">
            <Header />

            <div className="mt-8 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-white">Add New Income</h1>
                        <Link href="/income">
                            <Button variant="ghost" className="text-gray-400 hover:text-white">
                                Cancel
                            </Button>
                        </Link>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                name="amount"
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="0.00"
                                onChange={handleChange}
                                value={formData.amount}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <input
                                type="text"
                                required
                                name="description"
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                placeholder="What is this income for?"
                                onChange={handleChange}
                                value={formData.description}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                name="tag"
                                required
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white mb-2"
                                onChange={handleChange}
                                value={formData.tag}
                            >
                                <option value="">Select a category</option>
                                <option value="Salary">Salary</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Investment">Investment</option>
                                <option value="Business">Business</option>
                                <option value="Rental">Rental Income</option>
                                <option value="Dividends">Dividends</option>
                                <option value="Commission">Commission</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Royalties">Royalties</option>
                                <option value="Other">+ Add Custom Category</option>
                            </select>
                            
                            {formData.tag === "Other" && (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="customTag"
                                        required
                                        placeholder="Enter custom category name"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                        onChange={handleChange}
                                        value={formData.customTag}
                                    />
                                    <p className="text-sm text-gray-400">
                                        This category will be saved for future use
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                name="date"
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                onChange={handleChange}
                                value={formData.date}
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/income">
                                <Button className="bg-gray-700 text-white hover:bg-gray-600">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add Income"}
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
    );
}

export default AddIncome;
