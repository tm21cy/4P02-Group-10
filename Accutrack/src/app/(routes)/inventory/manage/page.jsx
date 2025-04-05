'use client'

import React, { useState, useEffect } from "react";
import Header from "../../../_components/Header";
import Footer from "../../../_components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { deleteInventoryItem, getInventoryByUser, getValidInventoryTags, patchInventoryItemDetails } from "@/lib/db";

function ManageInventory() {
    const { isSignedIn, user, isLoaded } = useUser();
    const [inventory, setInventory] = useState([]); // Will be populated by backend
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("")
    const [tags, setTags] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
            console.log(`isLoaded: ${isLoaded}`)
            console.log(`user: ${user}`)
            if (!isLoaded) return console.error("User not loaded.")
            if (!user) return console.error("No valid session.")
            updateEntries()
        }, [isLoaded, user])
    
    const updateEntries = () => {
        getValidInventoryTags(user.id).then(data => {
            const filtered = data.map(e => e.name)
            setTags(filtered)
        })
        getInventoryByUser(user.id).then(data => {
            const sortedData = [...data].sort((a, b) => 
                a.name.toString().localeCompare(b.name.toString())
            );
            setInventory(sortedData);
        })
    }

    const handleEdit = (item) => {
        setEditingItem({
            ...item,
            addAsExpense: false
        });
    };

    const handleDelete = async (id) => {
        await deleteInventoryItem(id)
        updateEntries()
        setEditingItem(null)
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await patchInventoryItemDetails(
            editingItem.id,
            editingItem.skuId,
            user.id,
            editingItem.name,
            editingItem.description,
            parseInt(editingItem.amount, 10), // Ensure amount is an integer
            parseFloat(editingItem.unitPrice), // Ensure unitPrice is a float
            editingItem.category
        );
        setMessage("Updated successfully!");
        updateEntries();
        setEditingItem(null);
    };

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...inventory].sort((a, b) => {
            if (key === 'unitPrice' || key === 'amount') {
                return direction === 'ascending' 
                    ? parseFloat(a[key]) - parseFloat(b[key])
                    : parseFloat(b[key]) - parseFloat(a[key]);
            }
            return direction === 'ascending'
                ? a[key].toString().localeCompare(b[key].toString())
                : b[key].toString().localeCompare(a[key].toString());
        });
        setInventory(sortedData);
    };

    const clearSort = () => {
        setSortConfig({ key: 'name', direction: 'ascending' });
        const sortedData = [...inventory].sort((a, b) => 
            a.name.toString().localeCompare(b.name.toString())
        );
        setInventory(sortedData);
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return '';
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
            <Header />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8 pt-20">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Manage Inventory</h1>
                        <div className="flex gap-2">
                            <Link href="/inventory/add">
                                <Button className="bg-purple-600 text-white hover:bg-purple-700 transition-all">
                                    Add Item
                                </Button>
                            </Link>
                            <Button 
                                onClick={clearSort}
                                className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                            >
                                Reset Sort
                            </Button>
                            <Link href="/inventory">
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
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
                                </div>
                            ) : inventory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="text-gray-400 text-lg mb-4">No inventory items found</div>
                                    <Link href="/inventory/add">
                                        <Button className="bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                                            Add Your First Item
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    {/* Table for larger screens */}
                                    <div className="hidden md:block overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-white/10">
                                                    <th onClick={() => sortData('skuId')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        ID {getSortIndicator('skuId')}
                                                    </th>
                                                    <th onClick={() => sortData('name')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Name {getSortIndicator('name')}
                                                    </th>
                                                    <th onClick={() => sortData('category')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Category {getSortIndicator('category')}
                                                    </th>
                                                    <th onClick={() => sortData('amount')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Quantity {getSortIndicator('amount')}
                                                    </th>
                                                    <th onClick={() => sortData('unitPrice')} className="text-center p-5 text-gray-400 font-medium cursor-pointer hover:text-white">
                                                        Unit Price {getSortIndicator('unitPrice')}
                                                    </th>
                                                    <th className="text-center p-5 text-gray-400 font-medium">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventory.map(item => (
                                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="p-5 text-gray-300 text-center">{item.skuId}</td>
                                                        <td className="p-5 text-white font-medium text-center">{item.name}</td>
                                                        <td className="p-5 flex justify-center">
                                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center
                                                                ${item.category === "Raw Materials" ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/30' :
                                                                item.category === "Finished Goods" ? 'bg-green-500/10 text-green-400 ring-1 ring-green-400/30' :
                                                                item.category === "Work in Progress" ? 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-400/30' :
                                                                item.category === "Maintenance" ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-400/30' :
                                                                item.category === "Office Supplies" ? 'bg-pink-500/10 text-pink-400 ring-1 ring-pink-400/30' :
                                                                'bg-gray-500/10 text-gray-400 ring-1 ring-gray-400/30'}`}>
                                                                {item.category}
                                                            </span>
                                                        </td>
                                                        <td className="p-5 text-gray-300 text-center">{item.amount}</td>
                                                        <td className="p-5 text-purple-400 font-medium text-center">${item.unitPrice}</td>
                                                        <td className="p-5 flex justify-center space-x-2">
                                                            <Button
                                                                onClick={() => handleEdit(item)}
                                                                className="bg-white/10 text-white hover:bg-white/20 transition-colors"
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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
                                    <div className="md:hidden space-y-4 p-4">
                                        {inventory.map(item => (
                                            <div key={item.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 space-y-4 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <p className="text-gray-400 text-sm">SKU: {item.skuId}</p>
                                                        <p className="text-white font-semibold text-lg">{item.name}</p>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-purple-400 text-lg font-semibold">${item.unitPrice}</span>
                                                            <span className="text-gray-400">×</span>
                                                            <span className="text-gray-300">{item.amount}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium
                                                        ${item.category === "Raw Materials" ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/30' :
                                                        item.category === "Finished Goods" ? 'bg-green-500/10 text-green-400 ring-1 ring-green-400/30' :
                                                        item.category === "Work in Progress" ? 'bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-400/30' :
                                                        item.category === "Maintenance" ? 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-400/30' :
                                                        item.category === "Office Supplies" ? 'bg-pink-500/10 text-pink-400 ring-1 ring-pink-400/30' :
                                                        'bg-gray-500/10 text-gray-400 ring-1 ring-gray-400/30'}`}>
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        onClick={() => handleEdit(item)}
                                                        className="flex-1 bg-white/10 text-white hover:bg-white/20 transition-colors"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
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
            {/* Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Edit Inventory Item</h2>
                            <form onSubmit={handleSave} className="space-y-5">
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
                                        Category
                                    </label>
                                    <select
                                        value={editingItem.category}
                                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    >
                                        {tags.map(tag => {
                                            return <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        })}
                                    </select>
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
                                            type="text"
                                            value={editingItem.amount}
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                    setEditingItem({ ...editingItem, amount: value });
                                                }
                                            }}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Unit Price
                                        </label>
                                        <input
                                            type="text"
                                            step="0.01"
                                            min="0"
                                            value={editingItem.unitPrice}
                                            onChange={e => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                    setEditingItem({ ...editingItem, unitPrice: value });
                                                }
                                            }}
                                            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>


                                <div className="flex justify-end gap-3 pt-6">
                                    <Button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="bg-white/10 text-white hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageInventory;
