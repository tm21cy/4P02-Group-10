'use client'

import React, { useEffect, useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useClerk, useSession, useUser } from "@clerk/nextjs";
import { deleteExpenses, getExpenses, patchExpenses } from "@/lib/db";

function ManageExpenses() {
    const { isSignedIn, user, isLoaded } = useUser()
    const [expenses, setExpenses] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    
    // Add state for inventory fields in edit mode
    const [editInventoryData, setEditInventoryData] = useState({
        addToInventory: false,
        inventoryItemId: "",
        inventoryQuantity: ""
    });

    // Add state for sales tax fields
    const [editSalesTaxData, setEditSalesTaxData] = useState({
        hasSalesTax: false,
        taxRate: 13, // Default to 13%
        taxAmount: 0
    });

    useEffect(() => {
        if (!isLoaded) return console.error("User not loaded.")
        if (!user) return console.error("No valid session.")
        updateEntries()
    }, [isLoaded, user])

    const updateEntries = () => {
        getExpenses(user.id).then(data => {
            setExpenses(data)
        })
    }

    const handleEdit = (expense) => {
        setEditingExpense({
            ...expense,
            amount: parseFloat(expense.amount) || 0 // Ensure amount is a number
        });
        // Initialize inventory data when opening edit modal
        setEditInventoryData({
            addToInventory: false,
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
        deleteExpenses(user.id, id).then(() => {
            updateEntries()
        })
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // BACKEND INTEGRATION NOTE FOR TYLER:
        // 1. Update the expenses table schema to include:
        //    - add_to_inventory (boolean)
        //    - inventory_item_id (string/uuid)
        //    - inventory_quantity (integer)
        // 2. Modify the updateExpense API endpoint to:
        //    - Accept these new fields
        //    - Update inventory quantities when add_to_inventory is true
        //    - Add validation for inventory item existence
        //    - Add inventory transaction logging
        // 3. Consider adding a separate inventory_transactions table for tracking

        try {
            // Only send the original expense data to backend for now
            const updatedExpense = {
                ...editingExpense,
                amount: parseFloat(editingExpense.amount),
                tag: editingExpense.tag === "Other" ? editingExpense.customTag : editingExpense.tag
            };
            
            await patchExpenses(user.id, editingExpense.id, updatedExpense);
            setMessage("Expense updated successfully!");
            updateEntries(); // Refresh the list
            setEditingExpense(null);
        } catch (error) {
            console.error(error);
            setMessage("Error updating expense.");
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
                    <h1 className="text-2xl font-bold text-white">Manage Expenses</h1>
                    <Link href="/expenses">
                        <Button className="bg-gray-800/50 text-white hover:bg-gray-700/50">
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                    <div className="w-full">
                        {!isLoaded ? (
                            <p className="text-gray-300 text-center py-4">Loading expense data...</p>
                        ) : !expenses || expenses.length === 0 ? (
                            <p className="text-gray-300 text-center py-4">No expenses to track.</p>
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
                                            {expenses.map(expense => (
                                                <tr key={expense.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                                    <td className="p-4 text-gray-300">{expense.date.toISOString().split("T")[0]}</td>
                                                    <td className="p-4 text-gray-300">{expense.description}</td>
                                                    <td className="p-4 text-teal-300">${expense.amount || "0.00"}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                            ${expense.tag === "Bills" ? 'bg-teal-500/20 text-teal-300' :
                                                            expense.tag === "Food" ? 'bg-orange-500/20 text-orange-300' :
                                                            'bg-purple-500/20 text-purple-300'}`}>
                                                            {expense.tag}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <Button
                                                            onClick={() => handleEdit(expense)}
                                                            className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(expense.id)}
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
                                    {expenses.map(expense => (
                                        <div key={expense.id} className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-gray-300 text-sm">{expense.date.toISOString().split("T")[0]}</p>
                                                    <p className="text-white font-medium">{expense.description}</p>
                                                    <p className="text-teal-300 text-lg font-semibold">${expense.amount || "0.00"}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                    ${expense.tag === "Bills" ? 'bg-teal-500/20 text-teal-300' :
                                                    expense.tag === "Food" ? 'bg-orange-500/20 text-orange-300' :
                                                    'bg-purple-500/20 text-purple-300'}`}>
                                                    {expense.tag}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleEdit(expense)}
                                                    className="flex-1 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(expense.id)}
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
            </div>
            {editingExpense && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Expense</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Form fields for editing */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingExpense.amount}
                                    onChange={e => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={editingExpense.description}
                                    onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={editingExpense.date}
                                    onChange={e => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                />
                            </div>
                            <div className="space-y-4 mb-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="editAddToInventory"
                                        checked={editInventoryData.addToInventory}
                                        onChange={(e) => setEditInventoryData(prev => ({
                                            ...prev,
                                            addToInventory: e.target.checked
                                        }))}
                                        className="w-4 h-4 text-teal-500 bg-gray-800/50 border-gray-700 rounded"
                                    />
                                    <label htmlFor="editAddToInventory" className="text-sm font-medium text-gray-300">
                                        This expense adds to inventory
                                    </label>
                                </div>

                                {editInventoryData.addToInventory && (
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
                                                    Quantity
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
                                            This will update the inventory quantity for the specified item
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
                                                taxAmount: e.target.checked ? (editingExpense.amount * (prev.taxRate / 100)) : 0
                                            }));
                                        }}
                                        className="w-4 h-4 text-teal-500 bg-gray-800/50 border-gray-700 rounded"
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
                                                            taxAmount: editingExpense.amount * (newRate / 100)
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
                                            <span className="text-white">${formatAmount(editingExpense.amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-300">Total with Tax:</span>
                                            <span className="text-white">${formatAmount(parseFloat(editingExpense.amount) + editSalesTaxData.taxAmount)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setEditingExpense(null)}
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

export default ManageExpenses;
