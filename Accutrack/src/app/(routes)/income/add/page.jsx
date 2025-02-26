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

    // Separate state for inventory fields
    const [inventoryData, setInventoryData] = useState({
        deductFromInventory: false,
        inventoryItemId: "",
        inventoryQuantity: ""
    });

    // Add state for sales tax
    const [salesTaxData, setSalesTaxData] = useState({
        hasSalesTax: false,
        taxRate: 13, // Default to 13%
        taxAmount: 0
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Add helper function for formatting amounts
    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "amount") {
            setFormData(prev => {
                const newAmount = parseFloat(value) || 0;
                // Update tax amount if sales tax is enabled
                if (salesTaxData.hasSalesTax) {
                    setSalesTaxData(prev => ({
                        ...prev,
                        taxAmount: newAmount * (prev.taxRate / 100)
                    }));
                }
                return { ...prev, [name]: newAmount };
            });
            return;
        }

        // Handle inventory-related fields separately
        if (name === "deductFromInventory" || name === "inventoryItemId" || name === "inventoryQuantity") {
            setInventoryData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }));
            return;
        }

        // Handle original form fields
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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
            tag: formData.tag === "Other" ? formData.customTag : formData.tag
        };

        try {
            await postNewIncome(updatedFormData);
            setMessage("Income added successfully!");
            // Reset form data
            setFormData({
                amount: "",
                description: "",
                tag: "",
                customTag: "",
                date: new Date().toISOString().split("T")[0],
                userId: ""
            });
            // Reset inventory data
            setInventoryData({
                deductFromInventory: false,
                inventoryItemId: "",
                inventoryQuantity: ""
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

                        <div className="flex items-center space-x-2 mb-4">
                            <input
                                type="checkbox"
                                name="deductFromInventory"
                                id="deductFromInventory"
                                className="w-4 h-4 text-blue-500 bg-gray-800/50 border-gray-700 rounded focus:ring-blue-500"
                                onChange={handleChange}
                                checked={inventoryData.deductFromInventory}
                            />
                            <label htmlFor="deductFromInventory" className="text-sm font-medium text-gray-300">
                                This income is tied to an inventory item
                            </label>
                        </div>

                        {inventoryData.deductFromInventory && (
                            <div className="space-y-4 mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-medium text-white">Inventory Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Item ID
                                        </label>
                                        <input
                                            type="text"
                                            name="inventoryItemId"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                            placeholder="Enter inventory item ID"
                                            onChange={handleChange}
                                            value={inventoryData.inventoryItemId || ""}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Quantity Sold
                                        </label>
                                        <input
                                            type="number"
                                            name="inventoryQuantity"
                                            min="1"
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                            placeholder="Enter quantity"
                                            onChange={handleChange}
                                            value={inventoryData.inventoryQuantity || ""}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">
                                    This will deduct the specified quantity from inventory
                                </p>
                            </div>
                        )}

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

                        <div className="space-y-4 mb-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasSalesTax"
                                    checked={salesTaxData.hasSalesTax}
                                    onChange={(e) => {
                                        setSalesTaxData(prev => ({
                                            ...prev,
                                            hasSalesTax: e.target.checked,
                                            taxAmount: e.target.checked ? (formData.amount * (prev.taxRate / 100)) : 0
                                        }));
                                    }}
                                    className="w-4 h-4 text-blue-500 bg-gray-800/50 border-gray-700 rounded"
                                />
                                <label htmlFor="hasSalesTax" className="text-sm font-medium text-gray-300">
                                    Sales tax was charged
                                </label>
                            </div>

                            {salesTaxData.hasSalesTax && (
                                <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                                    <h3 className="text-lg font-medium text-white">Sales Tax Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Tax Rate (%)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.1"
                                                value={salesTaxData.taxRate}
                                                onChange={(e) => {
                                                    const newRate = parseFloat(e.target.value) || 0;
                                                    setSalesTaxData(prev => ({
                                                        ...prev,
                                                        taxRate: newRate,
                                                        taxAmount: formData.amount * (newRate / 100)
                                                    }));
                                                }}
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                                                placeholder="Enter tax rate"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Tax Amount
                                            </label>
                                            <input
                                                type="number"
                                                value={formatAmount(salesTaxData.taxAmount)}
                                                readOnly
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between text-sm">
                                        <span className="text-gray-300">Subtotal:</span>
                                        <span className="text-white">${formatAmount(formData.amount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-gray-300">Total with Tax:</span>
                                        <span className="text-white">${formatAmount(parseFloat(formData.amount) + salesTaxData.taxAmount)}</span>
                                    </div>
                                </div>
                            )}
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
