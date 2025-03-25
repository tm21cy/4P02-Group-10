"use client";
import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import Header from "../../_components/Header";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses, getInventoryByUser, getSalesTax } from "@/lib/db";
import { IconSend, IconRobot, IconUser } from "@tabler/icons-react";

// Custom components for ReactMarkdown
const components = {
  p: ({children}) => <p className="text-gray-100 mb-2">{children}</p>,
  strong: ({children}) => <strong className="text-sky-300 font-semibold">{children}</strong>,
  ul: ({children}) => (
    <div className="space-y-1 my-2 text-gray-100">
      {children}
    </div>
  ),
  li: ({children}) => (
    <div className="flex text-gray-100">
      <span className="mr-2 text-purple-300">•</span>
      <span>{children}</span>
    </div>
  ),
};

function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage = inputMessage;
    setInputMessage("");

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      // Fetch financial context
      const income = await getIncome(user.id);
      const expenses = await getExpenses(user.id);
      const inventory = await getInventoryByUser(user.id);
      
      // Calculate sales tax totals from transactions
      const salesTaxCollected = income.reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);
      const salesTaxPaid = expenses.reduce((sum, t) => sum + (Number(t.taxAmount) || 0), 0);
      
      // Calculate totals with proper number conversion
      const financialContext = {
        totalIncome: income.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0),
        totalExpenses: expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0),
        allTransactions: {
          income: income.map(transaction => ({
            amount: parseFloat(transaction.amount) || 0,
            description: transaction.description,
            date: new Date(transaction.date).toLocaleDateString(),
            category: transaction.tag || 'Uncategorized',
            taxAmount: Number(transaction.taxAmount) || 0
          })),
          expenses: expenses.map(transaction => ({
            amount: parseFloat(transaction.amount) || 0,
            description: transaction.description,
            date: new Date(transaction.date).toLocaleDateString(),
            category: transaction.tag || 'Uncategorized',
            taxAmount: Number(transaction.taxAmount) || 0
          }))
        },
        inventory: inventory?.map(item => ({
          name: item.name,
          skuId: item.skuId,
          quantity: item.amount,
          unitPrice: Number(item.unitPrice),
          totalValue: Number(item.amount) * Number(item.unitPrice),
          description: item.description,
          category: item.category
        })) || [],
        salesTax: {
          collected: salesTaxCollected,
          paid: salesTaxPaid
        },
        recentTransactions: [...income, ...expenses]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(transaction => ({
            type: income.includes(transaction) ? 'income' : 'expense',
            amount: parseFloat(transaction.amount) || 0,
            description: transaction.description,
            date: new Date(transaction.date).toLocaleDateString(),
            category: transaction.tag || 'Uncategorized',
            taxAmount: Number(transaction.taxAmount) || 0
          }))
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          financialContext
        })
      });

      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden isolate">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float mix-blend-overlay" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed mix-blend-overlay" />
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl animate-pulse mix-blend-overlay" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/50 to-gray-900/30 backdrop-blur-[2px]" />
      </div>

      <Header />
      <main className="relative flex-grow container mx-auto p-4 pt-20">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Title Section with enhanced styling */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 transition-transform hover:scale-105 duration-300">
              <div className="bg-purple-500/20 p-5 rounded-full ring-2 ring-purple-500/30">
                <IconRobot className="h-14 w-14 text-purple-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Financial AI Assistant
            </h1>
            <p className="text-gray-400 mt-3 text-lg">Get personalized financial insights and advice</p>
          </div>

          {/* Enhanced Chat Container */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:border-white/20">
            {/* Messages Area with improved scrollbar */}
            <div className="h-[60vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
              <div className="p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-6 py-20">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 animate-pulse">
                      <IconRobot className="w-10 h-10 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold mb-3 text-white/80">Welcome to your AI Financial Assistant</p>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Ask questions about your finances, get insights on your spending, 
                        or request advice on financial planning.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-sm">
                      {["How's my spending this month?", "Analyze my cash flow", "Suggest ways to save"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role !== 'user' && (
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <IconRobot className="w-5 h-5 text-purple-400" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-purple-500/20 ml-auto max-w-[80%] rounded-tr-sm'
                            : 'bg-blue-500/20 mr-auto max-w-[80%] rounded-tl-sm'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <p className="text-white">{message.content}</p>
                        ) : (
                          <div className="prose dark:prose-invert max-w-none text-gray-100">
                            <ReactMarkdown 
                              components={{
                                ...components,
                                p: ({children}) => <p className="text-gray-100 mb-2">{children}</p>,
                                strong: ({children}) => <strong className="text-sky-300 font-semibold">{children}</strong>,
                                ul: ({children}) => (
                                  <div className="space-y-1 my-2 text-gray-100">
                                    {children}
                                  </div>
                                ),
                                li: ({children}) => (
                                  <div className="flex text-gray-100">
                                    <span className="mr-2 text-purple-300">•</span>
                                    <span>{children}</span>
                                  </div>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <IconUser className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <IconRobot className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="bg-blue-500/20 p-4 rounded-2xl rounded-tl-sm mr-auto max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="border-t border-white/10 p-4 backdrop-blur-md bg-white/5">
              <form onSubmit={sendMessage} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your financial assistant..."
                  className="flex-grow p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/40 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-4 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 rounded-xl text-white font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <IconSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIChatPage; 