"use client";  // This forces the file to be a Client Component
import React, { useEffect, useState } from "react"; // Import the React library
import Header from "../../_components/Header"; // Import the Header component
import Footer from "../../_components/Footer"; // Import the Footer component
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses, getInventoryByUser } from "@/lib/db";
import {
  IconClipboardList,
  IconFileText,
  IconCrown,
  IconRobot
} from "@tabler/icons-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Link from "next/link";
import PricingModal from '@/components/PricingModal';
import { useSubscriptionStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const dateRanges = [
  "Week to Date",
  "Month to Date",
  "Year to Date",
  "Last 3 Months",
  "Last 6 Months"
];

/**
 * JSX template for the user dashboard.
 * Renders information about financial history, transactions, routing to management pages, and other useful data.
 * @returns JSX component.
 */
function Dashboard() {
  // State management for user authentication, the selected filter range, transactions, graphs, cards, subscriptions, routing, recent transactions, and inventory status.
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedRange, setSelectedRange] = useState("Month to Date");
  const [transactions, setTransactions] = useState([]);
  const [graphData, setGraphData] = useState({ 
    areaChart: [],
    barChart: [] 
  });
  const [cardsData, setCardsData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netCashFlow: 0
  });
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const isSubscribed = useSubscriptionStore((state) => 
    state.subscriptions[user?.id] || false
  );
  const router = useRouter();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [inventoryValue, setInventoryValue] = useState(0);

  /**
   * On page load, render information about transactions in a certain range.
   */
  useEffect(() => {
    if (!isLoaded || !user) return;
    console.log("Fetching new data for range: ", selectedRange);
    fetchData();
  }, [isLoaded, user, selectedRange]);  

  /**
   * On page load, fetch recent transactions.
   */
  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchRecentTransactions();
  }, [isLoaded, user]);

  /**
 * On page load, render statistics and information about user inventory data.
 */
  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchInventoryStats();
  }, [isLoaded, user]);

  /**
   * Fetches and prepares state for user financial data.
   */
  const fetchData = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);

      // Combine and prepare transactions data with proper type mapping
      const combinedTransactions = [
        ...incomeData.map(inc => ({ ...inc, type: 'income' })),
        ...expenseData.map(exp => ({ ...exp, type: 'expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(combinedTransactions);

      // Process data for graphs
      processGraphData(incomeData, expenseData);
  
      // Calculate summary card values
      const today = new Date();
      let cardStartDate = new Date();
  
      switch(selectedRange) {
        case "Week to Date":
          cardStartDate = new Date(today);
          cardStartDate.setDate(today.getDate() - 6); // Last 7 days including today
          cardStartDate.setHours(0, 0, 0, 0); // Start of the day
          break;
        case "Month to Date":
          // Set to first day of current month
          cardStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case "Year to Date":
          cardStartDate = new Date(today.getFullYear(), 0, 1); // Start of current year
          break;
        case "Last 3 Months":
          cardStartDate.setMonth(today.getMonth() - 3);
          break;
        case "Last 6 Months":
          cardStartDate.setMonth(today.getMonth() - 6);
          break;
        default:
          cardStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
      }
  
      const incomeSum = incomeData.reduce((sum, inc) => {
        const incDate = new Date(inc.date);
        return incDate >= cardStartDate ? sum + Number(inc.amount) : sum;
      }, 0);
  
      const expensesSum = expenseData.reduce((sum, exp) => {
        const expDate = new Date(exp.date);
        return expDate >= cardStartDate ? sum + Number(exp.amount) : sum;
      }, 0);
  
      console.log(`Updated Income Sum for "${selectedRange}": `, incomeSum);
      console.log(`Updated Expenses Sum for "${selectedRange}": `, expensesSum);

      setCardsData({
        totalIncome: incomeSum,
        totalExpenses: expensesSum,
        netCashFlow: incomeSum - expensesSum
      });
      setTransactions([...incomeData, ...expenseData]);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  /**
   * Grabs recent user transactions and renders them appropriately.
   */
  const fetchRecentTransactions = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);

      const combined = [
        ...incomeData.map(inc => ({ ...inc, type: 'income', date: new Date(inc.date) })),
        ...expenseData.map(exp => ({ ...exp, type: 'expense', date: new Date(exp.date) }))
      ]
      .sort((a, b) => b.date - a.date) // Sort in descending order (newest first)
      .map(transaction => ({
        ...transaction,
        date: transaction.date.toISOString() // Convert back to ISO string for display
      }));

      setRecentTransactions(combined);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  /**
   * Grabs inventory statistics from user inventory pool and renders them accordingly.
   */
  const fetchInventoryStats = async () => {
    try {
      const inventory = await getInventoryByUser(user.id);
      const totalValue = inventory.reduce((sum, item) => {
        return sum + (Number(item.unitPrice) * Number(item.amount));
      }, 0);
      setInventoryValue(totalValue);
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    }
  };

  /**
   * Pre-processing for information to be passed to financial history graphs.
   * @param {*} incomeData Data regarding the user's income activity.
   * @param {*} expenseData Data regarding the user's expense activity.
   */
  const processGraphData = (incomeData, expenseData) => {
    const today = new Date();
    let startDate = new Date();
    
    switch(selectedRange) {
      case "Week to Date":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "Month to Date":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "Year to Date":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case "Last 3 Months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "Last 6 Months":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
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

    setGraphData(() => ({
      areaChart: [...Object.values(dailyData)].sort((a, b) => new Date(a.date) - new Date(b.date)),
      barChart: [...Object.values(monthlyData)].sort((a, b) => a.month.localeCompare(b.month))
    }));
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
                    
                    
      <Header />
      
      {/* Welcome Banner */}
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-20">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <div className="flex gap-2 flex-wrap">
            {dateRanges.map((range) => (
              <Button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`text-xs px-4 py-2 rounded-full transition-all duration-200 ${
                selectedRange === range
                  ? "bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/50 border border-gray-700/30"
              }`}
            >
              {range}
            </Button>
            
            ))}
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-200 hover:border-white/20">
          <h3 className="text-lg font-bold text-gray-200">Total Income</h3>
          <p className="text-3xl font-bold text-sky-400">${cardsData.totalIncome.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-200 hover:border-white/20">
          <h3 className="text-lg font-bold text-gray-200">Total Expenses</h3>
          <p className="text-3xl font-bold text-rose-400">${cardsData.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-200 hover:border-white/20">
          <h3 className="text-lg font-bold text-gray-200">Net Cash Flow</h3>
          <p className="text-3xl font-bold text-emerald-400">${cardsData.netCashFlow.toFixed(2)}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10 transition-all duration-200 hover:border-white/20">
          <h3 className="text-lg font-bold text-gray-200">Inventory Value</h3>
          <p className="text-3xl font-bold text-purple-400">${inventoryValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10">
          <h2 className="text-xl font-bold text-gray-200 mb-6">Trends</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData.areaChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: "1px solid #374151",
                    borderRadius: '0.5rem',
                    color: '#9CA3AF'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl shadow-xl border border-white/10">
          <h2 className="text-xl font-bold text-gray-200 mb-6">Monthly Comparison</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={graphData.barChart}
                margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  dy={10}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9CA3AF" />
                {graphData.barChart.length > 0 && (
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#9CA3AF',
                    }}
                    wrapperStyle={{ outline: 'none', pointerEvents: 'auto' }}
                    isAnimationActive={false}
                    formatter={(value) => (value > 0 ? value.toFixed(2) : null)}
                  />
                )}
                <Legend />
                <Bar dataKey="income" name="Income" stackId="a" fill="#3B82F6" fillOpacity={0.8} />
                <Bar dataKey="expenses" name="Expenses" stackId="a" fill="#10B981" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-7xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => isSubscribed ? router.push('/ai-chat') : setIsPricingOpen(true)} 
          className="block group cursor-pointer"
        >
          <div className="group backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-2xl shadow-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
              <IconRobot className="h-8 w-8 text-purple-400 group-hover:scale-105 transition-transform duration-200" />
              <IconCrown className="h-4 w-4 text-amber-400 group-hover:scale-105 transition-transform duration-200" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">AI Assistant</h2>
              <p className="text-gray-400 text-sm mb-2">Get AI-powered financial insights</p>
              <p className="text-xs text-purple-400 mt-auto">Premium Feature</p>
            </div>
          </div>
        </div>

        <Link href="/transactions" className="block group">
          <div className="h-full backdrop-blur-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 p-6 rounded-2xl shadow-xl border border-sky-500/20 hover:border-sky-500/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <IconClipboardList className="h-8 w-8 text-sky-400 mb-3 group-hover:scale-105 transition-transform duration-200" />
              <h2 className="text-xl font-bold text-white mb-2">Transactions</h2>
              <p className="text-gray-400 text-sm">View all your transactions</p>
            </div>
          </div>
        </Link>

        <Link href="/reports" className="block group">
          <div className="h-full backdrop-blur-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 rounded-2xl shadow-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <IconFileText className="h-8 w-8 text-emerald-400 mb-3 group-hover:scale-105 transition-transform duration-200" />
              <h2 className="text-xl font-bold text-white mb-2">Reports</h2>
              <p className="text-gray-400 text-sm">Generate financial reports</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Recent Transactions</h2>
          {recentTransactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex justify-between items-center p-5 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 transition-all duration-300 hover:border-white/20 group mb-4 last:mb-0"
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
                    {new Date(transaction.date).toISOString().split('T')[0]}
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
      </div>

      <PricingModal 
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <Footer />
    </div>  
    
    
    
  );
}

export default Dashboard;
