'use client'

import React, { useState, useEffect } from "react";
import Header from "../../../_components/Header";
import Footer from "../../../_components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { postNewExpense, postNewInventoryItem, postNewTagIfNotExists, getValidInventoryTags } from "@/lib/db";

function AddInventory() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [tags, setTags] = useState([]);
    const [formData, setFormData] = useState({
        itemId: "",
        name: "",
        description: "",
        quantity: "",
        unitPrice: "",
        category: "",
        customCategory: "",
        addAsExpense: false,
        date: new Date().toISOString().split("T")[0],
        purchasePrice: "",
        hasSalesTax: false,
        taxRate: 13, // default
        taxAmount: 0
    });
    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!isLoaded || !user) return;
        getValidInventoryTags(user.id).then(data => {
            const filtered = data.map(e => e.name);
            setTags(filtered);
        });
    }, [isLoaded, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prevData => {
            const updated = {
                ...prevData,
                [name]: type === "checkbox"
                    ? checked
                    : (name === "quantity" || name === "unitPrice")
                        ? parseFloat(value) || ""
                        : value
            };

            // Only reset customCategory if the category is being changed
            if (name === "category" && value !== "Other") {
                updated.customCategory = "";
            }

            return updated;
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (parseInt(formData.quantity) <= 0) return setMessage("You can't add negative/zero items to your inventory!")
        if (parseFloat(formData.unitPrice) <= 0) return setMessage("Inventory items must have a positive, non-zero price!")
        if (formData.itemId.length == 0
            || formData.name.length == 0
            || formData.description.length == 0
            || formData.quantity.length == 0
            || (formData.category.length == 0 && formData.customCategory.length == 0)
        ) return setMessage("Missing fields - please fully fill out the form!")
        
        // Add validation for tax rate when sales tax is checked
        if (formData.hasSalesTax && (!formData.taxRate || parseFloat(formData.taxRate) <= 0)) {
            return setMessage("Please enter a valid tax rate!")
        }

        let category = formData.category
        if (formData.customCategory.length > 0) category = formData.customCategory
        if (formData.customCategory.length > 0) await postNewTagIfNotExists(formData.customCategory, user.id, 2)
        await postNewInventoryItem(parseInt(formData.itemId), user.id, formData.name, formData.description, parseInt(formData.quantity), parseFloat(formData.unitPrice), category)
        if (formData.addAsExpense) await postNewExpense({
            amount: formData.quantity * formData.purchasePrice,
            description: `Purchase of ${formData.quantity} inventory items, SKU ${formData.itemId}`,
            tag: "Inventory",
            date: formData.date,
            userId: user.id,
            taxRate: formData.taxRate,
            taxAmount: formData.taxAmount
        })
        setMessage("Added inventory item!")
        setFormData({
            itemId: "",
            name: "",
            description: "",
            quantity: "",
            unitPrice: "",
            category: "",
            customCategory: "",
            addAsExpense: false,
            date: new Date().toISOString().split("T")[0],
            purchasePrice: "",
            hasSalesTax: false,
            taxRate: 13, // default
            taxAmount: 0
        })
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <Header />
            <div className="container mx-auto p-4 pt-20 flex-grow">
                <div className="mt-12 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-purple-500/20 p-5 rounded-full ring-2 ring-purple-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            Add New Inventory Item
                        </h1>
                        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                            Add a new item to your inventory
                        </p>
                    </div>

                    <div className="w-full max-w-2xl">
                        <div className="mb-4 flex justify-end">
                            <Link href="/inventory">
                                <Button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-8">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Item ID
                                    </label>
                                    <input
                                        type="text"
                                        name="itemId"
                                        required
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                        placeholder="Enter unique item ID"
                                        onChange={handleChange}
                                        value={formData.itemId}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                        placeholder="Enter item name"
                                        onChange={handleChange}
                                        value={formData.name}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        required
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                        placeholder="Enter item description"
                                        rows="3"
                                        onChange={handleChange}
                                        value={formData.description}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Quantity
                                        </label>
                                        <input
                                            type="text"
                                            name="quantity"
                                            required
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                            placeholder="0"
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        quantity: value
                                                    }));
                                                }
                                            }}
                                            value={formData.quantity}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Unit Price
                                        </label>
                                        <input
                                            type="text"
                                            name="unitPrice"
                                            required
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                            placeholder="0.00"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        unitPrice: value
                                                    }));
                                                }
                                            }}
                                            value={formData.unitPrice}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white mb-2"
                                        onChange={handleChange}
                                        value={formData.category}
                                    >
                                        <option value="">Select a category</option>
                                        {tags.map(tag => (
                                            <option key={tag} value={tag}>{tag}</option>
                                        ))}
                                        <option value="Other">+ Add Custom Category</option>
                                    </select>

                                    {formData.category === "Other" && (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                name="customCategory"
                                                required
                                                placeholder="Enter custom category name"
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                                onChange={handleChange}
                                                value={formData.customCategory}
                                            />
                                            <p className="text-sm text-gray-400">
                                                This category will be saved for future use
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="addAsExpense"
                                        id="addAsExpense"
                                        className="w-4 h-4 text-purple-500 bg-gray-800/50 border-gray-700 rounded focus:ring-purple-500"
                                        onChange={handleChange}
                                        checked={formData.addAsExpense}
                                    />
                                    <label htmlFor="addAsExpense" className="text-sm font-medium text-gray-300">
                                        Add this as an expense
                                    </label>
                                </div>

                                {formData.addAsExpense && (
                                    <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Purchase Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                                onChange={handleChange}
                                                value={formData.date}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Purchase Price
                                            </label>
                                            <input
                                                type="text"
                                                name="purchasePrice"
                                                required
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                                placeholder="0.00"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            purchasePrice: value,
                                                            taxAmount: prev.hasSalesTax ? ((value * prev.quantity) * (prev.taxRate / 100)) : 0
                                                        }));
                                                    }
                                                }}
                                                value={formData.purchasePrice}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="hasSalesTax"
                                                checked={formData.hasSalesTax}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        hasSalesTax: e.target.checked,
                                                        taxAmount: e.target.checked ? ((formData.purchasePrice * formData.quantity) * (prev.taxRate / 100)) : 0
                                                    }));
                                                }}
                                                className="w-4 h-4 text-blue-500 bg-gray-800/50 border-gray-700 rounded"
                                            />
                                            <label htmlFor="hasSalesTax" className="text-sm font-medium text-gray-300">
                                                Sales tax was charged
                                            </label>
                                        </div>
                                        {formData.hasSalesTax && (
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
                                                            required={formData.hasSalesTax}
                                                            value={formData.taxRate}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        taxRate: value,
                                                                        taxAmount: (formData.quantity * formData.purchasePrice) * (parseFloat(value) / 100)
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
                                                            value={formatAmount(formData.taxAmount)}
                                                            readOnly
                                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex justify-between text-sm">
                                                    <span className="text-gray-300">Subtotal:</span>
                                                    <span className="text-white">${formatAmount(formData.purchasePrice * formData.quantity)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-gray-300">Total with Tax:</span>
                                                    <span className="text-white">${formatAmount(parseFloat(formData.purchasePrice * formData.quantity) + formData.taxAmount)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                    
                                )}

                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href="/inventory">
                                        <Button className="bg-gray-700 text-white hover:bg-gray-600">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        className="bg-purple-500 hover:bg-purple-600 text-white"
                                        disabled={loading}
                                    >
                                        {loading ? "Adding..." : "Add Item"}
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

export default AddInventory;
