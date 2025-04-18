'use client'

import React, { useEffect, useState } from "react";
import Header from "../../../_components/Header";
import Footer from "../../../_components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { deleteIncome, getIncome, patchIncome, getValidTags } from "@/lib/db";

// Page for viewing and editing income entries
function ManageIncome() {
    // Sample data until we connect to DB
    const [incomes, setIncomes] = useState(null);
    const [editingIncome, setEditingIncome] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

    // Add state for sales tax fields
    const [editSalesTaxData, setEditSalesTaxData] = useState({
        hasSalesTax: false,
        taxRate: 13, // Default to 13%
        taxAmount: 0
    });

    const [tags, setTags] = useState([]);

    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded) return console.error("User not loaded.");
        if (!user) return console.error("No valid session.");
        updateEntries();
    }, [isLoaded, user]);

    const updateEntries = () => {
        getIncome(user.id).then(data => {
            const sortedData = [...data].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            setIncomes(sortedData);
        });
        getValidTags(user.id).then(data => {
            const filtered = data.map(e => e.name);
            setTags(filtered);
        });
    };

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...incomes].sort((a, b) => {
            if (key === 'amount' || key === 'taxAmount') {
                return direction === 'ascending' 
                    ? parseFloat(a[key]) - parseFloat(b[key])
                    : parseFloat(b[key]) - parseFloat(a[key]);
            }
            if (key === 'date') {
                return direction === 'ascending'
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            }
            return direction === 'ascending'
                ? a[key].toString().localeCompare(b[key].toString())
                : b[key].toString().localeCompare(a[key].toString());
        });
        setIncomes(sortedData);
    };

    const clearSort = () => {
        setSortConfig({ key: 'date', direction: 'descending' });
        const sortedData = [...incomes].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        setIncomes(sortedData);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return '';
    };

    // Functions for editing/deleting/saving
    const handleEdit = (income) => {
        const parsedAmount = parseFloat(income.amount) || 0;
        const existingTaxRate = income.taxAmount > 0 ? income.taxRate : 13;
        const computedTaxAmount = parsedAmount * (existingTaxRate / 100);

        setEditingIncome({
            ...income,
            amount: parsedAmount
        });

        setEditSalesTaxData({
            hasSalesTax: income.taxAmount > 0,
            taxRate: existingTaxRate,
            taxAmount: income.taxAmount > 0 ? computedTaxAmount : 0
        });
    };

    const handleDelete = (id) => {
        deleteIncome(user.id, id).then(() => {
            updateEntries();
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedIncome = {
                ...editingIncome,
                amount: parseFloat(editingIncome.amount),
                tag: editingIncome.tag === "Other" ? editingIncome.customTag : editingIncome.tag
            };
            const taxRate = editSalesTaxData.hasSalesTax ? editSalesTaxData.taxRate : 13;
            const taxAmount = editSalesTaxData.hasSalesTax ? editSalesTaxData.taxAmount : 0;
            await patchIncome(user.id, editingIncome.id, {
                ...updatedIncome,
                taxRate,
                taxAmount
            });
            setMessage("Income updated successfully!");
            updateEntries(); // Refresh the list
            setEditingIncome(null);
        } catch (error) {
            console.error(error);
            setMessage("Error updating income.");
        }
        setLoading(false);
    };

    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8 pt-20">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Manage Income</h1>
                        <div className="flex gap-2">
                            <Link href="/income/add">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-all">
                                    Add Income
                                </Button>
                            </Link>
                            <Button 
                                onClick={clearSort}
                                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                            >
                                Reset Sort
                            </Button>
                            <Link href="/income">
                                <Button className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all">
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
                        <div className="w-full">
                            {!isLoaded ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                                </div>
                            ) : !incomes || incomes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="text-gray-400 text-lg mb-4">No income entries found</div>
                                    <Link href="/income/add">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                            Add Your First Income
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="hidden md:block overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th onClick={() => sortData('date')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Date {getSortIndicator('date')}
                                                    </th>
                                                    <th onClick={() => sortData('description')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Description {getSortIndicator('description')}
                                                    </th>
                                                    <th onClick={() => sortData('amount')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Amount {getSortIndicator('amount')}
                                                    </th>
                                                    <th onClick={() => sortData('taxAmount')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Tax {getSortIndicator('taxAmount')}
                                                    </th>
                                                    <th onClick={() => sortData('tag')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Category {getSortIndicator('tag')}
                                                    </th>
                                                    <th className="text-center p-5 text-gray-400 font-medium">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {incomes.map(income => (
                                                    <tr key={income.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="p-5 text-gray-300 text-center">{income.date.toISOString().split("T")[0]}</td>
                                                        <td className="p-5 text-gray-300 text-center">{income.description}</td>
                                                        <td className="p-5 text-blue-400 font-medium text-center">${income.amount || "0.00"}</td>
                                                        <td className="p-5 text-blue-400 font-medium text-center">${income.taxAmount > 0 ? `${parseFloat(income.taxAmount).toFixed(2)} (${income.taxRate}%)` : "0.00"}</td>
                                                        <td className="p-5 flex justify-center">
                                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center
                                                                ${income.tag === "Salary" ? 'bg-green-500/10 text-green-400 ring-1 ring-green-400/30' :
                                                                income.tag === "Freelance" ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/30' :
                                                                income.tag === "Investment" ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-400/30' :
                                                                income.tag === "Business" ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-400/30' :
                                                                'bg-gray-500/10 text-gray-400 ring-1 ring-gray-400/30'}`}>
                                                                {income.tag}
                                                            </span>
                                                        </td>
                                                        <td className="p-5">
                                                            <div className="flex justify-center space-x-2">
                                                                <Button
                                                                    onClick={() => handleEdit(income)}
                                                                    className="bg-white/10 text-white hover:bg-white/20 transition-colors"
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleDelete(income.id)}
                                                                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
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
                </div>
            </div>
            <Footer />
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
                                    type="text"
                                    step="0.01"
                                    min="0"
                                    value={editingIncome.amount}
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(value)) {
                                            setEditingIncome({ ...editingIncome, amount: value });
                                        }
                                    }}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white"
                                    placeholder="0.00"
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
                                    {tags.map(tag => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
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
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 text-white text-white [color-scheme:dark]"
                                />
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
                                                    type="text"
                                                    inputMode="decimal"
                                                    pattern="^\d*\.?\d{0,2}$"
                                                    value={editSalesTaxData.taxRate}
                                                    required={editSalesTaxData.hasSalesTax}
                                                    min="0"
                                                    max="100"
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) <= 100) {
                                                            setEditSalesTaxData(prev => ({
                                                                ...prev,
                                                                taxRate: value,
                                                                taxAmount: editingIncome.amount * (parseFloat(value) / 100)
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
