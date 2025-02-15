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
        setEditingIncome(income);
    };

    const handleDelete = (id) => {
        deleteIncome(user.id, id).then(() => {
            updateEntries()
        })
    };

    const handleSave = (e) => {
        e.preventDefault();
        patchIncome(user.id, editingIncome.id, {
            amount: editingIncome.amount,
            description: editingIncome.description,
            tag: editingIncome.tag,
            date: editingIncome.date
        }).then(() => {
            updateEntries()
            setEditingIncome(null)
        })
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
                        <div className="overflow-x-auto">
                                {!isLoaded ? (
                                    <p className="text-gray-300 text-center py-4">Loading income data...</p>
                                ) : !incomes || incomes.length === 0 ? (
                                        <p className="text-gray-300 text-center py-4">No income to track.</p>
                                ) : (
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
                                                                'bg-purple-500/20 text-purple-300'}`}>
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
                            )}
                        </div>
                    </div>
                )}
            </div>
            {editingIncome && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
                                    <h2 className="text-xl font-bold text-white mb-4">Edit Income</h2>
                                    <form onSubmit={handleSave} className="space-y-4">
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
