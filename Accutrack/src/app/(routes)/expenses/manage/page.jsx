'use client'

import React, { useEffect, useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getExpenses } from "@/lib/db";

function ManageExpenses() {
    const [expenses, setExpenses] = useState(null);
    const clerkUser = useUser();
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        getExpenses(clerkUser.id).then(data => {
            setExpenses(data)
        })
    }, [])

    const handleEdit = (expense) => {
        setEditingExpense(expense);
    };

    const handleDelete = (id) => {
        setExpenses(expenses.filter(expense => expense.id !== id));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setExpenses(expenses.map(exp =>
            exp.id === editingExpense.id ? editingExpense : exp
        ));
        setEditingExpense(null);
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
                    <div className="overflow-x-auto">
                        {/* Show loading message if no expenses */}
                        {!expenses || expenses.length === 0 ? (
                            <p className="text-gray-300 text-center py-4">Loading expense data...</p>
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
                                    {expenses.map(expense => (
                                        <tr key={expense.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                            <td className="p-4 text-gray-300">{expense.date.toISOString().split("T")[0]}</td>
                                            <td className="p-4 text-gray-300">{expense.description}</td>
                                            <td className="p-4 text-teal-300">${parseInt(expense.amount).toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                    ${expense.tag === "Groceries" ? 'bg-teal-500/20 text-teal-300' :
                                                        expense.tag === "Transport" ? 'bg-blue-500/20 text-blue-300' :
                                                            'bg-purple-500/20 text-purple-300'}`}>
                                                    {expense.tag}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <Button
                                                    onClick={() => handleEdit(expense)}
                                                    className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageExpenses;
