'use client'

import React, { useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Page for viewing and editing income entries
function ManageIncome() {
    // Sample data until we connect to DB
    const [incomes, setIncomes] = useState([
        { id: 1, amount: 2500.00, description: "Monthly Salary", tag: 1, date: "2024-02-20" },
        { id: 2, amount: 500.00, description: "Freelance Project", tag: 2, date: "2024-02-19" },
    ]);

    // Track which entry we're editing
    const [editingIncome, setEditingIncome] = useState(null);

    // Functions for editing/deleting/saving
    const handleEdit = (income) => {
        setEditingIncome(income);
    };

    const handleDelete = (id) => {
        setIncomes(incomes.filter(income => income.id !== id));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIncomes(incomes.map(inc => 
            inc.id === editingIncome.id ? editingIncome : inc
        ));
        setEditingIncome(null);
    };

    return (
        <div className="container mx-auto p-4">
            <Header />
            
            {/* Main content area */}
            <div className="mt-8 max-w-4xl mx-auto">
                {/* Page header and back button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Manage Income</h1>
                    <Link href="/income">
                        <Button className="bg-gray-800/50 text-white hover:bg-gray-700/50">
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Table container with glass effect */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                    <div className="overflow-x-auto">
                        {/* Income records table */}
                        <table className="w-full">
                            {/* Column headers */}
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left p-4 text-gray-300">Date</th>
                                    <th className="text-left p-4 text-gray-300">Description</th>
                                    <th className="text-left p-4 text-gray-300">Amount</th>
                                    <th className="text-left p-4 text-gray-300">Category</th>
                                    <th className="text-right p-4 text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            {/* Table rows with income data */}
                            <tbody>
                                {incomes.map(income => (
                                    <tr key={income.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                        <td className="p-4 text-gray-300">{income.date}</td>
                                        <td className="p-4 text-gray-300">{income.description}</td>
                                        <td className="p-4 text-blue-300">${income.amount.toFixed(2)}</td>
                                        {/* Category tag with color coding */}
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${income.tag === 1 ? 'bg-green-500/20 text-green-300' :
                                                income.tag === 2 ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-purple-500/20 text-purple-300'}`}>
                                                {["Salary", "Freelance", "Investments", "Business", "Other"][income.tag - 1]}
                                            </span>
                                        </td>
                                        {/* Edit and delete buttons */}
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
                </div>
            </div>

            {/* Edit modal - appears when editing an income entry */}
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
                                    onChange={e => setEditingIncome({...editingIncome, amount: parseFloat(e.target.value)})}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                />
                            </div>
                            {/* Description field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={editingIncome.description}
                                    onChange={e => setEditingIncome({...editingIncome, description: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                />
                            </div>
                            {/* Date field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={editingIncome.date}
                                    onChange={e => setEditingIncome({...editingIncome, date: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                />
                            </div>
                            {/* Save and cancel buttons */}
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
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
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