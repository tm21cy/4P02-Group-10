"use client"

import React, { useState, useEffect } from "react";
import Header from "../../../_components/Header";
import Footer from "../../../_components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInventoryItemBySkuId, getValidTags, patchInventoryAmountSell, postNewIncome,postNewTagIfNotExists } from "@/lib/db";
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
    const [tags, setTags] = useState([])

    // Add helper function for formatting amounts
    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };
    useEffect(() => {
        console.log(`isLoaded: ${isLoaded}`)
        console.log(`user: ${user}`)
        if (!isLoaded) return console.error("User not loaded.")
        if (!user) return console.error("No valid session.")
        updateEntries()
    }, [isLoaded, user])

    const updateEntries = () => {
        getValidTags(user.id).then(data => {
            const filtered = data.map(e => e.name)
            setTags(filtered)
        })
    }
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

    if (name === "deductFromInventory") {
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
        await postNewTagIfNotExists(updatedFormData.tag, user.id)
        try {
            let mergedData = {}
            if (inventoryData.deductFromInventory) {
                mergedData = { ...formData, ...inventoryData }
                const invItem = await getInventoryItemBySkuId(parseInt(inventoryData.inventoryItemId), user.id)
                if (!invItem) {
                    setLoading(false)
                    return setMessage("Inventory item not found.")
                }
                else if (invItem.amount <= 0) {
                    setLoading(false)
                    return setMessage("No remaining inventory to deduct!")
                }
                else if (invItem.amount < inventoryData.inventoryQuantity) {
                    setLoading(false)
                    return setMessage("You don't have enough of this item to sell!")
                }
                else await patchInventoryAmountSell(invItem.skuId, invItem.userId, inventoryData.inventoryQuantity)
            }
            
            const income = await postNewIncome({
                ...updatedFormData,
                taxRate: salesTaxData.taxRate,
                taxAmount: salesTaxData.taxAmount
            });
            
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
            // Reset sales tax data
            setSalesTaxData({
                hasSalesTax: false,
                taxRate: 13, // Default to 13%
                taxAmount: 0
            })
        } catch (e) {
            console.log(e);
            setMessage("Error adding income.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
            <Header />
            <div className="container mx-auto p-4 pt-20">
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-500/20 p-5 rounded-full ring-2 ring-blue-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                            Add New Income
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Record your latest income
                        </p>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="mb-4 flex justify-end">
                            <Link href="/income">
                                <Button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Amount
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        name="amount"
                                        inputMode="decimal"
                                        pattern="^\d*\.?\d{0,2}$"
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder="0.00"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                setFormData(prev => ({ ...prev, amount: value }));
                                            }
                                        }}
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
                                                    required={inventoryData.deductFromInventory}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                            setInventoryData(prev => ({
                                                                ...prev,
                                                                inventoryItemId: value
                                                            }));
                                                        }
                                                    }}
                                                    value={inventoryData.inventoryItemId}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Quantity Sold
                                                </label>
                                                <input
                                                    type="text"
                                                    name="inventoryQuantity"
                                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                    placeholder="Enter quantity"
                                                    required={inventoryData.deductFromInventory}
                                                    onChange={e => {
                                                        const value = e.target.value;
                                                        if (/^\d*$/.test(value)) {
                                                            setInventoryData(prev => ({
                                                                ...prev,
                                                                inventoryQuantity: value
                                                            }));
                                                        }
                                                    }}
                                                    value={inventoryData.inventoryQuantity}
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
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white [color-scheme:dark]"
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
                                                        type="text"
                                                        inputMode="decimal"
                                                        pattern="^\d*\.?\d{0,2}$"
                                                        value={salesTaxData.taxRate}
                                                        required={salesTaxData.hasSalesTax}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                                setSalesTaxData(prev => ({
                                                                    ...prev,
                                                                    taxRate: value,
                                                                    taxAmount: formData.amount * (parseFloat(value) / 100)
                                                                }));
                                                            }
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
            </div>
            <Footer />
        </div>
    );
}

export default AddIncome;
