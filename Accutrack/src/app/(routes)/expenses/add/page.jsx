'use client'

import React, { useState, useEffect } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getValidExpenseTags, postNewExpense, postNewTagIfNotExists, getInventoryItemBySkuId, patchInventoryAmountBuy, postNewSalesTax } from "@/lib/db";

// Page for adding new expenses
function AddExpense() {
    const { isSignedIn, user, isLoaded } = useUser();
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
        addToInventory: false,
        inventoryItemId: 0,
        inventoryQuantity: 0
    });

    // Add state for sales tax
    const [salesTaxData, setSalesTaxData] = useState({
        hasSalesTax: false,
        taxRate: 13, // Default to 13%
        taxAmount: 0
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [tags, setTags] = useState([])

    useEffect(() => {
        console.log(`isLoaded: ${isLoaded}`)
        console.log(`user: ${user}`)
        if (!isLoaded) return console.error("User not loaded.")
        if (!user) return console.error("No valid session.")
        updateEntries()
    }, [isLoaded, user])

    const updateEntries = () => {
        getValidExpenseTags(user.id).then(data => {
            const filtered = data.map(e => e.name)
            setTags(filtered)
        })
    }

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

        if (name === "addToInventory") {
            // Ensure boolean value for checkbox
            setInventoryData(prev => ({
                ...prev,
                [name]: checked
            }));
            return;
        }

        if (name === "inventoryItemId" || name === "inventoryQuantity") {
            // Ensure correct data type and default to empty string to avoid null issues
            setInventoryData(prev => ({
                ...prev,
                [name]: value || ""
            }));
            return;
        }

        setFormData(prevData => {
            const updatedFormData = { ...prevData, [name]: value };

            // Only reset `customTag` if the user selects something other than "Other"
            if (name === "tag" && value !== "Other") {
                updatedFormData.customTag = "";
            }

            return updatedFormData;
        });
        console.log(formData)
        console.log(inventoryData)
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
        await postNewTagIfNotExists(updatedFormData.tag, user.id, 1)
        try {
            let mergedData = {}
            if (inventoryData.addToInventory) {
                mergedData = { ...formData, ...inventoryData }
                const invItem = await getInventoryItemBySkuId(parseInt(inventoryData.inventoryItemId), user.id)
                if (!invItem) {
                    setLoading(false)
                    return setMessage("Inventory item not found.")
                }
                else await patchInventoryAmountBuy(invItem.skuId, invItem.userId, parseInt(inventoryData.inventoryQuantity))
            }
            const expense = await postNewExpense(updatedFormData);
            if (salesTaxData.hasSalesTax) {
                await postNewSalesTax(user.id, expense.id, salesTaxData.taxRate, salesTaxData.taxAmount, 1)
            }
            setMessage("Expense added successfully!");
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
                                <div className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="checkbox"
                                        name="addToInventory"
                                        id="addToInventory"
                                        className="w-4 h-4 text-teal-500 bg-gray-800/50 border-gray-700 rounded focus:ring-teal-500"
                                        onChange={handleChange}
                                        checked={inventoryData.addToInventory}
                                    />
                                    <label htmlFor="addToInventory" className="text-sm font-medium text-gray-300">
                                        This expense adds to inventory
                                    </label>
                                </div>
                                {inventoryData.addToInventory && (
                                    <div className="space-y-4 mb-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                                        <h3 className="text-lg font-medium text-white">Inventory Details</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Item ID
                                                </label>
                                                <input
                                                    type="number"
                                                    name="inventoryItemId"
                                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                                    placeholder="Enter inventory item ID"
                                                    onChange={handleChange}
                                                    value={inventoryData.inventoryItemId || ""}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    name="inventoryQuantity"
                                                    min="1"
                                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                                    placeholder="Enter quantity"
                                                    onChange={handleChange}
                                                    value={inventoryData.inventoryQuantity || ""}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            This will update the inventory quantity for the specified item
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        name="tag"
                                        required
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white mb-2"
                                        onChange={handleChange}
                                        value={formData.tag}
                                    >
                                        <option value="">Select a category</option>
                                        {tags.map(tag => {
                                            return <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        })}
                                        <option value="Other">+ Add Custom Category</option>
                                    </select>
                                    
                                    {formData.tag === "Other" && (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="customTag"
                                                required
                                                placeholder="Enter custom category name"
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
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
                                            Sales tax was paid
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
