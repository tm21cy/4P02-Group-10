'use client'

import React, { useState } from "react";
import Header from "../../../_components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function ManageInventory() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [inventory, setInventory] = useState([]); // Will be populated by backend
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")

    const handleEdit = (item) => {
        setEditingItem({
            ...item,
            addAsExpense: false
        });
    };

    const handleDelete = async (id) => {
        // Frontend only - backend integration will be done by others
        console.log("Delete item:", id);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // Frontend only - backend integration will be done by others
        setEditingItem(null);
    };

    return (
        <div className="container mx-auto p-4">
            <Header />

            <div className="mt-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Manage Inventory</h1>
                    <Link href="/inventory">
                        <Button className="bg-gray-800/50 text-white hover:bg-gray-700/50">
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                    <div className="w-full">
                        {!isLoaded ? (
                            <p className="text-gray-300 text-center py-4">Loading inventory data...</p>
                        ) : inventory.length === 0 ? (
                            <p className="text-gray-300 text-center py-4">No inventory items to display.</p>
                        ) : (
                            <>
                                {/* Table for larger screens */}
                                <div className="hidden md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left p-4 text-gray-300">ID</th>
                                                <th className="text-left p-4 text-gray-300">Name</th>
                                                <th className="text-left p-4 text-gray-300">Category</th>
                                                <th className="text-left p-4 text-gray-300">Quantity</th>
                                                <th className="text-left p-4 text-gray-300">Unit Price</th>
                                                <th className="text-right p-4 text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventory.map(item => (
                                                <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                                    <td className="p-4 text-gray-300">{item.itemId}</td>
                                                    <td className="p-4 text-gray-300">{item.name}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                            ${item.category === "Raw Materials" ? 'bg-blue-500/20 text-blue-300' :
                                                            item.category === "Finished Goods" ? 'bg-green-500/20 text-green-300' :
                                                            item.category === "Work in Progress" ? 'bg-yellow-500/20 text-yellow-300' :
                                                            item.category === "Maintenance" ? 'bg-purple-500/20 text-purple-300' :
                                                            item.category === "Office Supplies" ? 'bg-pink-500/20 text-pink-300' :
                                                            'bg-gray-500/20 text-gray-300'}`}>
                                                            {item.category}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-300">{item.quantity}</td>
                                                    <td className="p-4 text-purple-300">${item.unitPrice}</td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <Button
                                                            onClick={() => handleEdit(item)}
                                                            className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(item.id)}
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
                                    {inventory.map(item => (
                                        <div key={item.id} className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <p className="text-gray-300 text-sm">ID: {item.itemId}</p>
                                                    <p className="text-white font-medium">{item.name}</p>
                                                    <p className="text-purple-300 text-lg font-semibold">
                                                        ${item.unitPrice} × {item.quantity}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                    ${item.category === "Raw Materials" ? 'bg-blue-500/20 text-blue-300' :
                                                    item.category === "Finished Goods" ? 'bg-green-500/20 text-green-300' :
                                                    item.category === "Work in Progress" ? 'bg-yellow-500/20 text-yellow-300' :
                                                    item.category === "Maintenance" ? 'bg-purple-500/20 text-purple-300' :
                                                    item.category === "Office Supplies" ? 'bg-pink-500/20 text-pink-300' :
                                                    'bg-gray-500/20 text-gray-300'}`}>
                                                    {item.category}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleEdit(item)}
                                                    className="flex-1 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(item.id)}
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

            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Inventory Item</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editingItem.description}
                                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    rows="3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingItem.quantity}
                                        onChange={e => setEditingItem({ ...editingItem, quantity: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Unit Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingItem.unitPrice}
                                        onChange={e => setEditingItem({ ...editingItem, unitPrice: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={editingItem.category}
                                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                >
                                    <option value="Raw Materials">Raw Materials</option>
                                    <option value="Finished Goods">Finished Goods</option>
                                    <option value="Work in Progress">Work in Progress</option>
                                    <option value="Maintenance">Maintenance Items</option>
                                    <option value="Office Supplies">Office Supplies</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-purple-500 hover:bg-purple-600 text-white"
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

export default ManageInventory; 