"use client";  // This forces the file to be a Client Component
import React, { useEffect, useState } from "react"; // Import the React library
import Header from "../../_components/Header"; // Import the Header component
import Footer from "../../_components/Footer"; // Import the Footer component
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses } from "@/lib/db";
import {
  IconMessageChatbot,
  IconClipboardList,
  IconFileText,
  IconCrown,
  IconChevronDown,
} from "@tabler/icons-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const dateRanges = [
  "Week to Date",
  "Month to Date",
  "Year to Date",
  "Last 3 Months",
  "Last 6 Months",
  "Whole Year"
];

function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedRange, setSelectedRange] = useState("Month to Date");
  const [transactions, setTransactions] = useState([]);
  const [graphData, setGraphData] = useState({ 
    areaChart: [],
    barChart: [] 
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchData();
  }, [isLoaded, user, selectedRange]);

  const fetchData = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);

      // Combine and sort transactions
      const combinedTransactions = [
        ...incomeData.map(inc => ({ ...inc, type: 'income' })),
        ...expenseData.map(exp => ({ ...exp, type: 'expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

      setTransactions(combinedTransactions);

      // Process data for graph based on selected range
      processGraphData(incomeData, expenseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processGraphData = (incomeData, expenseData) => {
    // Process data based on selected range
    const today = new Date();
    let startDate = new Date();
    
    switch(selectedRange) {
      case "Week to Date":
        startDate.setDate(today.getDate() - 7);
        break;
      case "Month to Date":
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "Year to Date":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      // Add other cases as needed
    }

    // Create daily data points for area chart
    const dailyData = {};
    const monthlyData = {};

    incomeData.forEach(inc => {
      const date = new Date(inc.date);
      if (date >= startDate) {
        const dateStr = date.toISOString().split('T')[0];
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        dailyData[dateStr] = dailyData[dateStr] || { date: dateStr, income: 0, expenses: 0 };
        monthlyData[monthStr] = monthlyData[monthStr] || { month: monthStr, income: 0, expenses: 0 };
        
        dailyData[dateStr].income += Number(inc.amount);
        monthlyData[monthStr].income += Number(inc.amount);
      }
    });

    expenseData.forEach(exp => {
      const date = new Date(exp.date);
      if (date >= startDate) {
        const dateStr = date.toISOString().split('T')[0];
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        dailyData[dateStr] = dailyData[dateStr] || { date: dateStr, income: 0, expenses: 0 };
        monthlyData[monthStr] = monthlyData[monthStr] || { month: monthStr, income: 0, expenses: 0 };
        
        dailyData[dateStr].expenses += Number(exp.amount);
        monthlyData[monthStr].expenses += Number(exp.amount);
      }
    });

    setGraphData({
      areaChart: Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date)),
      barChart: Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
    });
  };

  return (
    <div className="min-h-screen bg-[#1c2230] text-[#bbbbbb]">
      <Header />
      
      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
          Welcome Back to AccuTrack
        </h1>
      </div>

      {/* Graphs Section */}
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Trends Graph */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Daily Trends</h2>
            <div className="flex gap-2 flex-wrap">
              {dateRanges.map((range) => (
                <Button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`text-xs px-3 py-1 ${
                    selectedRange === range
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData.areaChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2} 
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Comparison Graph */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-6">Monthly Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graphData.barChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar dataKey="income" fill="#3B82F6" fillOpacity={0.8} />
                <Bar dataKey="expenses" fill="#10B981" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Assistant Button */}
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-6 rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <IconMessageChatbot className="h-8 w-8 text-purple-400" />
              <IconCrown className="h-4 w-4 text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">AI Assistant</h2>
            <p className="text-gray-400 text-sm mb-2">Get AI-powered financial insights</p>
            <p className="text-xs text-purple-400 mt-auto">Premium Feature</p>
          </div>
        </div>

        {/* Transactions Button */}
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-xl shadow-lg border border-blue-500/20 hover:border-blue-500/40 transition-all">
          <div className="flex flex-col h-full">
            <IconClipboardList className="h-8 w-8 text-blue-400 mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Transactions</h2>
            <p className="text-gray-400 text-sm">View all your transactions</p>
          </div>
        </div>

        {/* Reports Button */}
        <div className="bg-gradient-to-br from-teal-900/50 to-emerald-900/50 p-6 rounded-xl shadow-lg border border-teal-500/20 hover:border-teal-500/40 transition-all">
          <div className="flex flex-col h-full">
            <IconFileText className="h-8 w-8 text-teal-400 mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Reports</h2>
            <p className="text-gray-400 text-sm">Generate financial reports</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No recent transactions</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
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

export default Dashboard;
