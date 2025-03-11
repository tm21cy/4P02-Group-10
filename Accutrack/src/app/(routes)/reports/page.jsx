"use client";
import React, { useEffect, useState } from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { useUser } from "@clerk/nextjs";
import { getIncome, getExpenses, getInventoryByUser } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Eye, 
  BarChart4, 
  ArrowUpDown,
  Receipt,
  Package
} from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Parser } from 'json2csv';

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
};

// Helper function to format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to summarize transactions by category
const summarizeByCategory = (transactions) => {
  return transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += Number(t.amount);
    return acc;
  }, {});
};

// PDF Generation Functions
const generatePDF = (data, reportType) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.text('AccuTrack Financial Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(reportType, pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(12);
    
    if (data.dateRange) {
      doc.text(`Period: ${formatDate(data.dateRange.start)} to ${formatDate(data.dateRange.end)}`, pageWidth / 2, 40, { align: 'center' });
    }

    if (reportType === "Income Statement") {
      // Income Statement format
      const yStart = 60;
      doc.setFontSize(12);
      
      doc.text('Total Income:', 30, yStart);
      doc.text(formatCurrency(data.totalIncome), 150, yStart, { align: 'right' });
      
      doc.text('Total Expenses:', 30, yStart + 20);
      doc.text(formatCurrency(data.totalExpenses), 150, yStart + 20, { align: 'right' });
      
      doc.setLineWidth(0.5);
      doc.line(30, yStart + 30, 170, yStart + 30);
      
      doc.setFontSize(14);
      doc.text('Net Taxable Income:', 30, yStart + 40);
      doc.text(formatCurrency(data.netIncome), 150, yStart + 40, { align: 'right' });
    } else if (reportType === "Inventory Summary") {
      if (data.inventory && data.inventory.length > 0) {
        autoTable(doc, {
          startY: 50,
          head: [['Item Name', 'SKU', 'Quantity', 'Unit Cost', 'Total Value']],
          body: data.inventory.map(item => [
            item.name,
            item.skuId.toString(),
            item.quantity.toString(),
            formatCurrency(item.unitPrice),
            formatCurrency(item.totalValue)
          ]),
          foot: [['Total Value', '', '', '', formatCurrency(data.total)]],
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          footStyles: { fillColor: [52, 73, 94] },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 30 },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 40, halign: 'right' }
          }
        });
      } else {
        doc.text('No inventory items found.', 20, 60);
      }
    } else {
      // Transaction Summary format (Income or Expense)
      if (data.transactions && data.transactions.length > 0) {
        autoTable(doc, {
          startY: 50,
          head: [['Date', 'Category', 'Description', 'Amount']],
          body: data.transactions.map(t => [
            formatDate(t.date),
            t.category,
            t.description,
            formatCurrency(Number(t.amount))
          ]),
          foot: [['Total', '', '', formatCurrency(data.total)]],
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          footStyles: { fillColor: [52, 73, 94] },
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 40 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 40, halign: 'right' }
          }
        });

        // Add category summary
        if (Object.keys(data.categorySummary).length > 0) {
          const summaryStartY = doc.lastAutoTable.finalY + 20;
          doc.setFontSize(14);
          doc.text('Category Summary', 20, summaryStartY);

          autoTable(doc, {
            startY: summaryStartY + 10,
            head: [['Category', 'Total']],
            body: Object.entries(data.categorySummary).map(([category, amount]) => [
              category,
              formatCurrency(Number(amount))
            ]),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
          });
        }
      } else {
        doc.text('No transactions found for the selected period.', 20, 60);
      }
    }

    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// CSV Generation Function
const generateCSV = (data, reportType) => {
  if (reportType === "Income Statement") {
    return `Category,Amount
Total Income,${data.totalIncome}
Total Expenses,${data.totalExpenses}
Net Taxable Income,${data.netIncome}`;
  }
  let fields = [];
  let csvData = [];
  
  switch (reportType) {
    case "Income Transactions":
    case "Expense Transactions":
      fields = ['Date', 'Category', 'Description', 'Amount', 'Tax'];
      csvData = data.transactions.map(t => ({
        Date: formatDate(t.date),
        Category: t.category,
        Description: t.description,
        Amount: t.amount,
        Tax: t.tax || 0
      }));
      break;
    case "Inventory Summary":
      fields = ['Item Name', 'SKU', 'Quantity', 'Unit Cost', 'Total Value'];
      csvData = data.inventory.map(item => ({
        'Item Name': item.name,
        'SKU': item.skuId,
        'Quantity': item.quantity,
        'Unit Cost': item.unitPrice,
        'Total Value': item.totalValue
      }));
      break;
  }
  
  const parser = new Parser({ fields });
  return parser.parse(csvData);
};

// Report generation functions
const generateIncomeStatement = (incomeData, expenseData) => {
  const totalIncome = incomeData.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpenses = expenseData.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const netIncome = totalIncome - totalExpenses;

  // Get the date range from the filtered data
  const allDates = [...incomeData, ...expenseData].map(t => new Date(t.date));
  const startDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
  const endDate = allDates.length > 0 ? new Date(Math.max(...allDates)) : new Date();

  return {
    reportType: "Income Statement",
    totalIncome,
    totalExpenses,
    netIncome,
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
};

const generateTransactionsSummary = (transactions, type) => {
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Use tag instead of type for categorization
  const processedTransactions = transactions.map(t => ({
    id: t.id,
    date: t.date,
    category: t.tag || 'Uncategorized', // Changed from t.type to t.tag
    amount: t.amount,
    description: t.description || ''
  }));

  // Generate category summary using tag
  const categorySummary = processedTransactions.reduce((acc, t) => {
    const category = t.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += Number(t.amount);
    return acc;
  }, {});

  const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d));
  const startDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  const endDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

  return {
    reportType: type === "income" ? "Income Transactions" : "Expense Transactions",
    transactions: processedTransactions,
    total,
    categorySummary,
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
};

const generateInventorySummary = (inventoryData) => {
  const processedInventory = inventoryData.map(item => ({
    id: item.id,
    name: item.name,
    skuId: item.skuId,
    quantity: item.amount,
    unitPrice: Number(item.unitPrice),
    totalValue: Number(item.amount) * Number(item.unitPrice),
    description: item.description,
    category: item.category
  }));

  const total = processedInventory.reduce((sum, item) => sum + item.totalValue, 0);

  return {
    reportType: "Inventory Summary",
    inventory: processedInventory,
    total,
  };
};

function ReportsPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [reportType, setReportType] = useState("income-statement");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [category, setCategory] = useState("all");
  const [format, setFormat] = useState("pdf");
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchCategories();
  }, [isLoaded, user]);

  const fetchCategories = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);

      // Extract unique categories from tags
      const incomeCategories = [...new Set(incomeData.map(inc => inc.tag))].filter(Boolean);
      const expenseCategories = [...new Set(expenseData.map(exp => exp.tag))].filter(Boolean);

      setCategories({
        income: incomeCategories,
        expense: expenseCategories
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterTransactions = (transactions) => {
    let filtered = [...transactions];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }

    if (category !== "all") {
      filtered = filtered.filter(t => t.category === category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "amount-desc":
          return Number(b.amount) - Number(a.amount);
        case "amount-asc":
          return Number(a.amount) - Number(b.amount);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const downloadReport = (reportData) => {
    try {
      const fileName = `accutrack-${reportType}-${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'pdf') {
        const doc = generatePDF(reportData, reportData.reportType);
        doc.save(`${fileName}.pdf`);
      } else {
        const csv = generateCSV(reportData, reportData.reportType);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const generateReport = async (preview = false) => {
    try {
      let reportData;
      
      switch (reportType) {
        case "income-statement":
          const incomeData = await getIncome(user.id);
          const expenseData = await getExpenses(user.id);
          const filteredIncome = filterTransactions(incomeData);
          const filteredExpenses = filterTransactions(expenseData);
          reportData = generateIncomeStatement(filteredIncome, filteredExpenses);
          break;
        case "income-summary":
          const incomeTransactions = await getIncome(user.id);
          reportData = generateTransactionsSummary(filterTransactions(incomeTransactions), "income");
          break;
        case "expense-summary":
          const expenseTransactions = await getExpenses(user.id);
          reportData = generateTransactionsSummary(filterTransactions(expenseTransactions), "expense");
          break;
        case "inventory-summary":
          const inventoryData = await getInventoryByUser(user.id);
          let sortedInventory = [...inventoryData];
          
          // Apply sorting
          switch (sortBy) {
            case "name":
              sortedInventory.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "sku":
              sortedInventory.sort((a, b) => a.skuId - b.skuId);
              break;
            case "quantity":
              sortedInventory.sort((a, b) => b.amount - a.amount);
              break;
            case "value":
              sortedInventory.sort((a, b) => 
                (Number(b.amount) * Number(b.unitPrice)) - 
                (Number(a.amount) * Number(a.unitPrice))
              );
              break;
          }
          
          reportData = generateInventorySummary(sortedInventory);
          break;
      }

      if (preview) {
        setPreviewData(reportData);
      } else {
        downloadReport(reportData);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c2230] text-[#bbbbbb]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12 space-y-2">
          <h1 className="text-3xl font-bold text-white">Generate Reports</h1>
          <p className="text-gray-400">Create and download financial reports in PDF or CSV format</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800 mb-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-6">Report Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "income-statement",
                    title: "Income Statement",
                    description: "Summary of financial performance",
                    icon: BarChart4
                  },
                  {
                    id: "income-summary",
                    title: "Income Transactions",
                    description: "Detailed income transaction report",
                    icon: ArrowUpDown
                  },
                  {
                    id: "expense-summary",
                    title: "Expense Transactions",
                    description: "Detailed expense transaction report",
                    icon: Receipt
                  },
                  {
                    id: "inventory-summary",
                    title: "Inventory Summary",
                    description: "Detailed inventory status report",
                    icon: Package
                  }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-6 rounded-lg border ${
                      reportType === type.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 bg-gray-800/50"
                    } hover:border-blue-500/50 transition-colors text-left`}
                  >
                    {React.createElement(type.icon, {
                      className: "h-8 w-8 mb-3 text-blue-400"
                    })}
                    <h4 className="text-white font-medium mb-2">{type.title}</h4>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200"
                />
              </div>
            </div>

            {reportType !== "income-statement" && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200"
                >
                  <option key="all" value="all">All Categories</option>
                  {categories[reportType === "income-summary" ? "income" : "expense"].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-gray-200"
              >
                <option key="date-desc" value="date-desc">Date (Newest First)</option>
                <option key="date-asc" value="date-asc">Date (Oldest First)</option>
                <option key="amount-desc" value="amount-desc">Amount (Highest First)</option>
                <option key="amount-asc" value="amount-asc">Amount (Lowest First)</option>
                {reportType !== "income-statement" && (
                  <option key="category" value="category">Category</option>
                )}
                {reportType === "inventory-summary" && (
                  <>
                    <option value="name">Item Name</option>
                    <option value="sku">SKU</option>
                    <option value="quantity">Quantity</option>
                    <option value="value">Total Value</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Format</label>
              <div className="flex gap-4">
                <Button
                  key="pdf"
                  onClick={() => setFormat("pdf")}
                  className={format === "pdf" ? "bg-blue-500" : "bg-gray-800"}
                >
                  PDF
                </Button>
                <Button
                  key="csv"
                  onClick={() => setFormat("csv")}
                  className={format === "csv" ? "bg-blue-500" : "bg-gray-800"}
                >
                  CSV
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => generateReport(true)}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Report
              </Button>
              <Button
                onClick={() => generateReport(false)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {previewData && (
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">Report Preview</h2>
            <pre className="bg-gray-800/50 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ReportsPage; 