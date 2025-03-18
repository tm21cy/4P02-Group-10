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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8 pt-20">
          Transactions
        </h1>

        {/* Filters Section */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 mb-8 transition-all duration-300 hover:border-white/20">
          <div className="space-y-8">
            {/* Transaction Type Filters */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-3">Transaction Type</h3>
              <div className="flex gap-3 flex-wrap">
                {["all", "income", "expense"].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`${
                      filterType === type
                        ? "bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                        : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 border border-gray-700/30"
                    } transition-all duration-300`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range Filters */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-3">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [color-scheme:dark]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-gray-400">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <Button
                    onClick={clearDateFilters}
                    className="bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 border border-gray-700/30 transition-all duration-300"
                  >
                    Clear Dates
                  </Button>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-lg font-bold text-gray-300 mb-3">Sort By</h3>
              <div className="flex gap-3 flex-wrap">
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
                        ? "bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                        : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 border border-gray-700/30"
                    } transition-all duration-300`}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
          {filteredTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No transactions found</p>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="flex justify-between items-center p-5 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === "income" 
                        ? "bg-sky-500/20 text-sky-400" 
                        : "bg-emerald-500/20 text-emerald-400"
                    } transition-all duration-300 group-hover:scale-110`}>
                      <div className="text-lg font-medium">
                        {transaction.type === "income" ? "+" : "-"}
                      </div>
                    </div>
                    <div>
                      <p className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors duration-300">
                        {transaction.description}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xl font-semibold ${
                    transaction.type === "income" 
                      ? "text-sky-400 group-hover:text-sky-300" 
                      : "text-emerald-400 group-hover:text-emerald-300"
                  } transition-colors duration-300`}>
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