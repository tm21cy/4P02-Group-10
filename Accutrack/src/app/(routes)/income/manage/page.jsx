'use client'

import React, { useEffect, useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { getIncome } from "@/lib/db";

// Page for viewing and editing income entries
function ManageIncome() {
    // Sample data until we connect to DB
    const [incomes, setIncomes] = useState(null);
    const clerkUser = useUser()

    useEffect(() => {
        getIncome(clerkUser.id).then(data => {
            setIncomes(data)
        })
    }, [])

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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageIncome; 
