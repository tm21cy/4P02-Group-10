'use client'

import React, { useEffect, useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { deleteIncome, getIncome, patchIncome } from "@/lib/db";

// Page for viewing and editing income entries
function ManageIncome() {
    // Sample data until we connect to DB
    const [incomes, setIncomes] = useState(null);
    const [editingIncome, setEditingIncome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    
    // Add state for inventory fields in edit mode
    const [editInventoryData, setEditInventoryData] = useState({
        deductFromInventory: false,
        inventoryItemId: "",
        inventoryQuantity: ""
    });

    // Add state for sales tax fields
    const [editSalesTaxData, setEditSalesTaxData] = useState({
        hasSalesTax: false,
        taxRate: 13, // Default to 13%
        taxAmount: 0
    });

    const { isSignedIn, user, isLoaded } = useUser()

    useEffect(() => {
        if (!isLoaded) return console.error("User not loaded.")
        if (!user) return console.error("No valid session.")
        updateEntries()
    }, [isLoaded, user])

    const updateEntries = () => {
        getIncome(user.id).then(data => {
            setIncomes(data)
        })
    }
    // Functions for editing/deleting/saving
    const handleEdit = (income) => {
        setEditingIncome({
            ...income,
            amount: parseFloat(income.amount) || 0 // Ensure amount is a number
        });
        // Initialize inventory data when opening edit modal
        setEditInventoryData({
            deductFromInventory: false,
            inventoryItemId: "",
            inventoryQuantity: ""
        });
        // Initialize sales tax data
        setEditSalesTaxData({
            hasSalesTax: false,
            taxRate: 13,
            taxAmount: 0
        });
    };

    const handleDelete = (id) => {
        deleteIncome(user.id, id).then(() => {
            updateEntries()
        })
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // BACKEND INTEGRATION NOTE FOR TYLER:
        // 1. Update the income table schema to include:
        //    - deduct_from_inventory (boolean)
        //    - inventory_item_id (string/uuid)
        //    - inventory_quantity (integer)
        // 2. Modify the updateIncome API endpoint to:
        //    - Accept these new fields
        //    - Update inventory quantities when deduct_from_inventory is true
        //    - Add validation for inventory item existence
        //    - Add validation for sufficient inventory quantity
        // 3. Add inventory transaction logging for audit trail

        try {
            // Only send the original income data to backend for now
            const updatedIncome = {
                ...editingIncome,
                amount: parseFloat(editingIncome.amount),
                tag: editingIncome.tag === "Other" ? editingIncome.customTag : editingIncome.tag
            };
            
            await patchIncome(user.id, editingIncome.id, updatedIncome);
            setMessage("Income updated successfully!");
            updateEntries(); // Refresh the list
            setEditingIncome(null);
        } catch (error) {
            console.error(error);
            setMessage("Error updating income.");
        }
        setLoading(false);
    };

    // Add this helper function
    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div className="container mx-auto p-4">
            <Header />

            <div className="mt-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Manage Income</h1>
                    <Link href="/income">
                        <Button className="bg-gray-800/50 text-white hover:bg-gray-700/50">
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Show loading UI if incomes data is not ready */}
                {!incomes || incomes.length === 0 ? (
                    <div className="text-gray-300">Loading income data...</div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                        <div className="w-full">
                            {!isLoaded ? (
                                <p className="text-gray-300 text-center py-4">Loading income data...</p>
                            ) : !incomes || incomes.length === 0 ? (
                                <p className="text-gray-300 text-center py-4">No income to track.</p>
                            ) : (
                                <>
                                    {/* Table for larger screens */}
                                    <div className="hidden md:block">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-700">
                                                    <th className="text-left p-4 text-gray-300">Date</th>
                                                    <th className="text-left p-4 text-gray-300">Description</th>
                                                    <th className="text-left p-4 text-gray-300">Amount</th>
                                                    <th className="text-left p-4 text-gray-300">Category</th>
                                                    <th className="text-right p-4 text-gray-300">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomes.map(income => (
                                                    <tr key={income.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                                        <td className="p-4 text-gray-300">{income.date.toISOString().split("T")[0]}</td>
                                                        <td className="p-4 text-gray-300">{income.description}</td>
                                                        <td className="p-4 text-blue-300">${income.amount || "0.00"}</td>
                                                        <td className="p-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                                ${income.tag === "Salary" ? 'bg-green-500/20 text-green-300' :
                                                                income.tag === "Freelance" ? 'bg-blue-500/20 text-blue-300' :
                                                                income.tag === "Investment" ? 'bg-purple-500/20 text-purple-300' :
                                                                income.tag === "Business" ? 'bg-orange-500/20 text-orange-300' :
                                                                income.tag === "Rental" ? 'bg-pink-500/20 text-pink-300' :
                                                                income.tag === "Dividends" ? 'bg-yellow-500/20 text-yellow-300' :
                                                                income.tag === "Commission" ? 'bg-indigo-500/20 text-indigo-300' :
                                                                income.tag === "Bonus" ? 'bg-teal-500/20 text-teal-300' :
                                                                income.tag === "Royalties" ? 'bg-cyan-500/20 text-cyan-300' :
                                                                'bg-gray-500/20 text-gray-300'}`}>
                                                                {income.tag}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right space-x-2">
                                                            <Button
                                                                onClick={() => handleEdit(income)}
                                                                className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(income.id)}
                                                                className="bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Card view for mobile screens */}
                                    <div className="md:hidden space-y-4">
                                        {incomes.map(income => (
                                            <div key={income.id} className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <p className="text-gray-300 text-sm">{income.date.toISOString().split("T")[0]}</p>
                                                        <p className="text-white font-medium">{income.description}</p>
                                                        <p className="text-blue-300 text-lg font-semibold">${income.amount || "0.00"}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                        ${income.tag === "Salary" ? 'bg-green-500/20 text-green-300' :
                                                        income.tag === "Freelance" ? 'bg-blue-500/20 text-blue-300' :
                                                        income.tag === "Investment" ? 'bg-purple-500/20 text-purple-300' :
                                                        income.tag === "Business" ? 'bg-orange-500/20 text-orange-300' :
                                                        income.tag === "Rental" ? 'bg-pink-500/20 text-pink-300' :
                                                        income.tag === "Dividends" ? 'bg-yellow-500/20 text-yellow-300' :
                                                        income.tag === "Commission" ? 'bg-indigo-500/20 text-indigo-300' :
                                                        income.tag === "Bonus" ? 'bg-teal-500/20 text-teal-300' :
                                                        income.tag === "Royalties" ? 'bg-cyan-500/20 text-cyan-300' :
                                                        'bg-gray-500/20 text-gray-300'}`}>
                                                        {income.tag}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        onClick={() => handleEdit(income)}
                                                        className="flex-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(income.id)}
                                                        className="flex-1 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {editingIncome && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-bold text-white mb-4">Edit Income</h2>
                                    <form onSubmit={handleEditSubmit} className="space-y-4">
                                        {/* Form fields for editing */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Amount
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingIncome.amount}
                                                onChange={e => setEditingIncome({ ...editingIncome, amount: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                value={editingIncome.description}
                                                onChange={e => setEditingIncome({ ...editingIncome, description: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                value={editingIncome.date}
                                                onChange={e => setEditingIncome({ ...editingIncome, date: e.target.value })}
                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
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
                                                onChange={e => setEditingIncome({ ...editingIncome, tag: e.target.value })}
                                                value={editingIncome.tag}
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
                                        </div>
                                        {editingIncome.tag === "Other" && (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    name="customTag"
                                                    required
                                                    placeholder="Enter custom category name"
                                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                                    onChange={e => setEditingIncome({ ...editingIncome, customTag: e.target.value })}
                                                    value={editingIncome.customTag || ""}
                                                />
                                                <p className="text-sm text-gray-400">
                                                    This category will be saved for future use
                                                </p>
                                            </div>
                                        )}
                                        <div className="space-y-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="editDeductFromInventory"
                                                    checked={editInventoryData.deductFromInventory}
                                                    onChange={(e) => setEditInventoryData(prev => ({
                                                        ...prev,
                                                        deductFromInventory: e.target.checked
                                                    }))}
                                                    className="w-4 h-4 text-blue-500 bg-gray-800/50 border-gray-700 rounded"
                                                />
                                                <label htmlFor="editDeductFromInventory" className="text-sm font-medium text-gray-300">
                                                    This income is tied to an inventory item
                                                </label>
                                            </div>

                                            {editInventoryData.deductFromInventory && (
                                                <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                                                    <h3 className="text-lg font-medium text-white">Inventory Details</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Item ID
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={editInventoryData.inventoryItemId}
                                                                onChange={(e) => setEditInventoryData(prev => ({
                                                                    ...prev,
                                                                    inventoryItemId: e.target.value
                                                                }))}
                                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                                                                placeholder="Enter inventory item ID"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                Quantity Sold
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={editInventoryData.inventoryQuantity}
                                                                onChange={(e) => setEditInventoryData(prev => ({
                                                                    ...prev,
                                                                    inventoryQuantity: e.target.value
                                                                }))}
                                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                                                                placeholder="Enter quantity"
                                                            />
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-400">
                                                        This will deduct the specified quantity from inventory
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="editHasSalesTax"
                                                    checked={editSalesTaxData.hasSalesTax}
                                                    onChange={(e) => {
                                                        setEditSalesTaxData(prev => ({
                                                            ...prev,
                                                            hasSalesTax: e.target.checked,
                                                            taxAmount: e.target.checked ? (editingIncome.amount * (prev.taxRate / 100)) : 0
                                                        }));
                                                    }}
                                                    className="w-4 h-4 text-blue-500 bg-gray-800/50 border-gray-700 rounded"
                                                />
                                                <label htmlFor="editHasSalesTax" className="text-sm font-medium text-gray-300">
                                                    Sales tax was charged
                                                </label>
                                            </div>

                                            {editSalesTaxData.hasSalesTax && (
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
                                                                value={editSalesTaxData.taxRate}
                                                                onChange={(e) => {
                                                                    const newRate = parseFloat(e.target.value) || 0;
                                                                    setEditSalesTaxData(prev => ({
                                                                        ...prev,
                                                                        taxRate: newRate,
                                                                        taxAmount: editingIncome.amount * (newRate / 100)
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
                                                                value={formatAmount(editSalesTaxData.taxAmount)}
                                                                readOnly
                                                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex justify-between text-sm">
                                                        <span className="text-gray-300">Subtotal:</span>
                                                        <span className="text-white">${formatAmount(editingIncome.amount)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span className="text-gray-300">Total with Tax:</span>
                                                        <span className="text-white">${formatAmount(parseFloat(editingIncome.amount) + editSalesTaxData.taxAmount)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button
                                                type="button"
                                                onClick={() => setEditingIncome(null)}
                                                className="bg-gray-700 text-white hover:bg-gray-600"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-teal-500 hover:bg-teal-600 text-white"
                                            >
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
        </div>
    );
}

export default ManageIncome; 
