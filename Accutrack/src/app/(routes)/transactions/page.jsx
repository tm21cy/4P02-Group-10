"use client";
import React, { useEffect, useState } from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses } from "@/lib/db";
import { Button } from "@/components/ui/button";

function TransactionsPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchData();
  }, [isLoaded, user]);

  const fetchData = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);

      const combinedTransactions = [
        ...incomeData.map(inc => ({ ...inc, type: 'income' })),
        ...expenseData.map(exp => ({ ...exp, type: 'expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 20);

      setTransactions(combinedTransactions);
      setFilteredTransactions(combinedTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include the entire end date

      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "highest":
          return Number(b.amount) - Number(a.amount);
        case "lowest":
          return Number(a.amount) - Number(b.amount);
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    applyFilters();
  }, [filterType, sortOrder, startDate, endDate]);

  return (
    <div className="min-h-screen bg-[#1c2230] text-[#bbbbbb]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Transactions</h1>

        {/* Filters Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
          <div className="space-y-6">
            {/* Transaction Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Transaction Type</h3>
              <div className="flex gap-2 flex-wrap">
                {["all", "income", "expense"].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`${
                      filterType === type
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Button
                    onClick={clearDateFilters}
                    className="bg-gray-800 text-gray-400 hover:bg-gray-700"
                  >
                    Clear Dates
                  </Button>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Sort By</h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "highest", label: "Highest Amount" },
                  { value: "lowest", label: "Lowest Amount" }
                ].map((sort) => (
                  <Button
                    key={sort.value}
                    onClick={() => setSortOrder(sort.value)}
                    className={`${
                      sortOrder === sort.value
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === "income" ? "bg-blue-500/20" : "bg-teal-500/20"
                    }`}>
                      <div className={`text-sm font-medium ${
                        transaction.type === "income" ? "text-blue-400" : "text-teal-400"
                      }`}>
                        {transaction.type === "income" ? "+" : "-"}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.type === "income" ? "text-blue-400" : "text-teal-400"
                  }`}>
                    ${Number(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default TransactionsPage; 