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
  const d = new Date(date);
  // Force the date to be interpreted in local timezone
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to summarize transactions by category
const summarizeByCategory = (transactions) => {
  const summary = transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = 0;
    }
    acc[t.category] += Number(t.amount);
    return acc;
  }, {});

  // Renamed these variables to avoid conflict
  const transactionDates = transactions.map((t) => new Date(t.date)).filter((d) => !isNaN(d));
  const minDate = transactionDates.length > 0 ? new Date(Math.min(...transactionDates)) : new Date();
  const maxDate = transactionDates.length > 0 ? new Date(Math.max(...transactionDates)) : new Date();
  
  return {
    categorySummary: summary,
    dateRange: {
      start: minDate,
      end: maxDate
    }
  };
};

// PDF Generation Functions
const generatePDF = (data, reportType) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    
    doc.setFontSize(20);
    doc.text('AccuTrack Financial Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(reportType, pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(12);
    
    if (reportType === "Inventory Summary") {
      doc.text(`Generated on: ${formatDate(data.generationDate)}`, pageWidth / 2, 40, { align: 'center' });
    } else if (data.dateRange) {
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
    } else if (reportType === "Sales Tax Report") {
      // Summary Table
      autoTable(doc, {
        startY: 50,
        body: [
          ['Total Sales Tax Collected:', formatCurrency(data.totalTaxCollected)],
          ['Total Sales Tax Paid:', formatCurrency(data.totalTaxPaid)],
          ['Net Sales Tax Remittance:', formatCurrency(data.netTaxRemittance)]
        ],
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: 'right' }
        }
      });

      // Income Transactions Table
      if (data.taxableTransactions.income.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 8,
          head: [
            [{ content: 'Sales Tax Collected from Income Transactions', colSpan: 5 }],
            ['Date', 'Description', 'Amount', 'Tax Rate', 'Tax Collected']
          ],
          body: data.taxableTransactions.income.map(t => [
            formatDate(t.date),
            t.description,
            formatCurrency(Number(t.amount)),
            t.taxRate + '%',
            formatCurrency(Number(t.taxAmount))
          ]),
          theme: 'grid',
          headStyles: { 
            fillColor: [41, 128, 185],
            halign: 'center',
            fontSize: 8,
            cellPadding: 2,
            minCellHeight: 6
          },
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak'
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 70 },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 20, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' }
          }
        });
      }

      // Expense Transactions Table
      if (data.taxableTransactions.expenses.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 8,
          head: [
            [{ content: 'Sales Tax Paid on Expense Transactions', colSpan: 5 }],
            ['Date', 'Description', 'Amount', 'Tax Rate', 'Tax Paid']
          ],
          body: data.taxableTransactions.expenses.map(t => [
            formatDate(t.date),
            t.description,
            formatCurrency(Number(t.amount)),
            t.taxRate + '%',
            formatCurrency(Number(t.taxAmount))
          ]),
          theme: 'grid',
          headStyles: { 
            fillColor: [41, 128, 185],
            halign: 'center',
            fontSize: 8,
            cellPadding: 2,
            minCellHeight: 6
          },
          styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak'
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 70 },
            2: { cellWidth: 25, halign: 'right' },
            3: { cellWidth: 20, halign: 'right' },
            4: { cellWidth: 25, halign: 'right' }
          }
        });
      }
    } else {
      // Transaction Summary format (Income or Expense)
      if (data.transactions && data.transactions.length > 0) {
        const taxColumnName = reportType === "Income Transactions" ? "Sales Tax Collected" : "Sales Tax Paid";
        const totalTax = data.transactions.reduce((sum, t) => sum + Number(t.taxAmount || 0), 0);
        
        // Main transactions table
        autoTable(doc, {
          startY: 50,
          head: [['Date', 'Category', 'Description', 'Amount', taxColumnName]],
          body: data.transactions.map(t => [
            formatDate(t.date),
            t.category,
            t.description,
            formatCurrency(Number(t.amount)),
            formatCurrency(Number(t.taxAmount || 0))
          ]),
          theme: 'grid',
          headStyles: { 
            fillColor: [41, 128, 185],
            fontSize: 8
          },
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 },
            2: { cellWidth: 50 },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          }
        });

        // Totals (with proper labeling)
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 4,
          body: [
            [
              reportType === "Income Transactions" ? 'Total Income:' : 'Total Expenses:', 
              '', 
              '', 
              formatCurrency(data.total),
              ''
            ],
            [
              reportType === "Income Transactions" ? 'Total Sales Tax Collected:' : 'Total Sales Tax Paid:', 
              '', 
              '', 
              '',
              formatCurrency(totalTax)
            ]
          ],
          theme: 'plain',
          styles: {
            fontSize: 10,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 35 },
            2: { cellWidth: 50 },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
          }
        });

        // Category Summary table (keeping the close spacing)
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 4,
          head: [['Category', 'Amount']],
          body: Object.entries(data.categorySummary).map(([category, amount]) => [
            category,
            formatCurrency(amount)
          ]),
          theme: 'grid',
          headStyles: { 
            fillColor: [41, 128, 185],
            fontSize: 8
          },
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 50, halign: 'right' }
          }
        });
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
  try {
    if (reportType === "Inventory Summary") {
      const json2csvParser = new Parser({ header: false }); // Disable automatic headers
      
      const csvData = [
        // Column headers
        {
          Name: 'Name',
          SKU: 'SKU',
          Category: 'Category',
          Quantity: 'Quantity',
          'Unit Price': 'Unit Price',
          'Total Value': 'Total Value'
        },
        
        // Inventory Items
        ...data.inventory.map(item => ({
          Name: item.name,
          SKU: item.skuId,
          Category: item.category,
          Quantity: item.quantity,
          'Unit Price': formatCurrency(Number(item.unitPrice)),
          'Total Value': formatCurrency(Number(item.totalValue))
        })),
        
        // Blank line
        {
          Name: '',
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': ''
        },
        
        // Total row
        {
          Name: 'Total Inventory Value',
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': formatCurrency(Number(data.total))
        },
        
        // Blank line before metadata
        {
          Name: '',
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': ''
        },
        
        // Report metadata at the bottom
        {
          Name: 'AccuTrack Financial Report',
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': ''
        },
        {
          Name: 'Inventory Summary',
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': ''
        },
        {
          Name: 'Generated: ' + new Date().toLocaleDateString(),
          SKU: '',
          Category: '',
          Quantity: '',
          'Unit Price': '',
          'Total Value': ''
        }
      ];

      return json2csvParser.parse(csvData);
    } else {
      let csvData = [];
      let fields = [];

      if (reportType === "Income Statement") {
        const rows = [
          // Transactions first
          { Category: 'Total Income', Amount: formatCurrency(data.totalIncome) },
          { Category: 'Total Expenses', Amount: formatCurrency(data.totalExpenses) },
          { Category: '', Amount: '' }, // blank line
          { Category: 'Net Income', Amount: formatCurrency(data.netIncome) },
          { Category: '', Amount: '' }, // blank line
          
          // Report metadata at the bottom
          { Category: 'AccuTrack Financial Report', Amount: '' },
          { Category: 'Income Statement', Amount: '' },
          { Category: `Generated: ${new Date().toLocaleDateString()}`, Amount: '' },
          { Category: `Period: ${formatDate(data.dateRange.start)} to ${formatDate(data.dateRange.end)}`, Amount: '' }
        ];

        return new Parser({ fields: ['Category', 'Amount'] }).parse(rows);

      } else if (reportType === "Income Transactions" || reportType === "Expense Transactions") {
        const taxColumnName = reportType === "Income Transactions" ? "Sales Tax Collected" : "Sales Tax Paid";
        
        // Debug log to check the data
        console.log("Transaction data:", data.transactions);
        
        const totalTax = data.transactions.reduce((sum, t) => sum + Number(t.taxAmount || 0), 0);
        
        const rows = [
          // Transactions first
          ...data.transactions.map(t => {
            // Debug log for each transaction
            console.log("Processing transaction:", t);
            console.log("Tax amount:", t.taxAmount);
            
            return {
              Date: formatDate(t.date),
              Category: t.category,
              Description: t.description,
              Amount: formatCurrency(t.amount),
              [taxColumnName]: formatCurrency(Number(t.taxAmount) || 0)
            };
          }),
          { Date: '', Category: '', Description: '', Amount: '', [taxColumnName]: '' }, // blank line
          
          // Category Summary
          { Date: 'Category Summary', Category: '', Description: '', Amount: '', [taxColumnName]: '' },
          ...Object.entries(data.categorySummary).map(([category, amount]) => ({
            Date: '',
            Category: category,
            Description: 'Total',
            Amount: formatCurrency(amount),
            [taxColumnName]: ''
          })),
          { Date: '', Category: '', Description: '', Amount: '', [taxColumnName]: '' }, // blank line
          
          // Total and Tax Total
          { Date: '', Category: 'Total', Description: '', Amount: formatCurrency(data.total), [taxColumnName]: '' },
          { Date: '', Category: 'Total Tax', Description: '', Amount: '', [taxColumnName]: formatCurrency(totalTax) },
          { Date: '', Category: '', Description: '', Amount: '', [taxColumnName]: '' }, // blank line
          
          // Report metadata at the bottom
          { Date: 'AccuTrack Financial Report', Category: '', Description: '', Amount: '', [taxColumnName]: '' },
          { Date: reportType, Category: '', Description: '', Amount: '', [taxColumnName]: '' },
          { Date: `Period: ${formatDate(data.dateRange.start)} to ${formatDate(data.dateRange.end)}`, Category: '', Description: '', Amount: '', [taxColumnName]: '' }
        ];

        return new Parser({
          fields: ['Date', 'Category', 'Description', 'Amount', taxColumnName]
        }).parse(rows);
      } else if (reportType === "Inventory Summary") {
        // Keep existing inventory summary CSV generation if it exists
        // ... existing inventory CSV code ...
      } else if (reportType === "Sales Tax Report") {
        const json2csvParser = new Parser({ header: false });
        let csvData = [
          // Summary section at the top
          ['Summary'],
          ['Total Sales Tax Collected:', '', '', '', formatCurrency(data.totalTaxCollected)],
          ['Total Sales Tax Paid:', '', '', '', formatCurrency(data.totalTaxPaid)],
          ['Net Sales Tax Remittance:', '', '', '', formatCurrency(data.netTaxRemittance)],
          ['']
        ];

        // Add Income Transactions if they exist
        if (data.taxableTransactions.income.length > 0) {
          csvData = csvData.concat([
            ['Sales Tax Collected from Income Transactions'],
            ['Date', 'Description', 'Amount', 'Tax Rate', 'Tax Collected'],
            ...data.taxableTransactions.income.map(t => [
              formatDate(t.date),
              t.description,
              formatCurrency(Number(t.amount)),
              t.taxRate + '%',
              formatCurrency(Number(t.taxAmount))
            ]),
            [''] // blank line
          ]);
        }

        // Add Expense Transactions if they exist
        if (data.taxableTransactions.expenses.length > 0) {
          csvData = csvData.concat([
            ['Sales Tax Paid on Expense Transactions'],
            ['Date', 'Description', 'Amount', 'Tax Rate', 'Tax Paid'],
            ...data.taxableTransactions.expenses.map(t => [
              formatDate(t.date),
              t.description,
              formatCurrency(Number(t.amount)),
              t.taxRate + '%',
              formatCurrency(Number(t.taxAmount))
            ]),
            [''] // blank line
          ]);
        }

        // Add metadata at the bottom
        csvData = csvData.concat([
          ['AccuTrack Financial Report'],
          ['Sales Tax Report'],
          [`Generated: ${formatDate(new Date())}`],
          [`Period: ${formatDate(data.dateRange.start)} to ${formatDate(data.dateRange.end)}`]
        ]);

        return json2csvParser.parse(csvData);
      }

      return new Parser({ fields: fields }).parse(csvData);
    }
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};

// Report generation functions
const generateIncomeStatement = (incomeData, expenseData, startDate, endDate) => {
  const totalIncome = incomeData.reduce((sum, inc) => sum + Number(inc.amount), 0);
  const totalExpenses = expenseData.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const netIncome = totalIncome - totalExpenses;

  return {
    reportType: "Income Statement",
    totalIncome,
    totalExpenses,
    netIncome,
    incomeBreakdown: summarizeByCategory(incomeData),
    expenseBreakdown: summarizeByCategory(expenseData),
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
};

const generateTransactionsSummary = (transactions, type, reportStartDate, reportEndDate) => {
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Use tag for categorization
  const processedTransactions = transactions.map(t => ({
    id: t.id,
    date: t.date,
    category: t.tag || 'Uncategorized',
    amount: t.amount,
    description: t.description || '',
    taxAmount: t.taxAmount || 0,
    taxRate: t.taxRate
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

  // Create proper Date objects with timezone adjustment
  const start = new Date(reportStartDate);
  start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
  
  const end = new Date(reportEndDate);
  end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
  
  return {
    reportType: type === "income" ? "Income Transactions" : "Expense Transactions",
    transactions: processedTransactions,
    total,
    categorySummary,
    dateRange: {
      start: start,
      end: end
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
  const generationDate = new Date();

  return {
    reportType: "Inventory Summary",
    inventory: processedInventory,
    total,
    generationDate
  };
};

// Add this function alongside your other report generation functions
const generateSalesTaxSummary = (incomeData, expenseData, startDate, endDate) => {
  // Filter transactions with tax
  const taxableIncome = incomeData.filter(inc => Number(inc.taxAmount) > 0);
  const taxableExpenses = expenseData.filter(exp => Number(exp.taxAmount) > 0);

  // Calculate totals
  const totalTaxCollected = taxableIncome.reduce((sum, inc) => sum + Number(inc.taxAmount || 0), 0);
  const totalTaxPaid = taxableExpenses.reduce((sum, exp) => sum + Number(exp.taxAmount || 0), 0);
  const netTaxRemittance = totalTaxCollected - totalTaxPaid;

  return {
    reportType: "Sales Tax Report",
    totalTaxCollected,
    totalTaxPaid,
    netTaxRemittance,
    taxableTransactions: {
      income: taxableIncome.map(inc => ({
        date: inc.date,
        type: 'Income',
        description: inc.description,
        amount: inc.amount,
        taxAmount: Number(inc.taxAmount || 0),
        taxRate: inc.taxRate
      })),
      expenses: taxableExpenses.map(exp => ({
        date: exp.date,
        type: 'Expense',
        description: exp.description,
        amount: exp.amount,
        taxAmount: Number(exp.taxAmount || 0),
        taxRate: exp.taxRate
      }))
    },
    dateRange: {
      start: startDate,
      end: endDate
    }
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
  const [categories, setCategories] = useState({ income: [], expense: [], inventory: [] });
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetchCategories();
  }, [isLoaded, user]);

  const fetchCategories = async () => {
    try {
      const incomeData = await getIncome(user.id);
      const expenseData = await getExpenses(user.id);
      const inventoryData = await getInventoryByUser(user.id);

      // Extract unique categories from tags for income/expense and category for inventory
      const incomeCategories = [...new Set(incomeData.map(inc => inc.tag))].filter(Boolean);
      const expenseCategories = [...new Set(expenseData.map(exp => exp.tag))].filter(Boolean);
      const inventoryCategories = [...new Set(inventoryData.map(item => item.category))].filter(Boolean);

      setCategories({
        income: incomeCategories,
        expense: expenseCategories,
        inventory: inventoryCategories
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterTransactions = (transactions, isInventory = false) => {
    let filtered = [...transactions];

    if (!isInventory && (startDate || endDate)) {
      // Handle null dates by using min/max possible dates
      const start = startDate ? new Date(startDate) : new Date(0);
      start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
      start.setHours(0, 0, 0, 0);
      
      const end = endDate ? new Date(endDate) : new Date();
      end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }

    // Apply category filtering
    if (category !== "all") {
      filtered = filtered.filter(t => 
        isInventory ? t.category === category : t.tag === category
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (!isInventory) {
        // Existing non-inventory sorting logic
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
            return (a.tag || '').localeCompare(b.tag || '');
          default:
            return 0;
        }
      } else {
        // Enhanced inventory sorting logic
        const [field, direction] = sortBy.split('-');
        const isAsc = direction === 'asc';
        
        switch (field) {
          case "name":
            return isAsc ? 
              (a.name || '').localeCompare(b.name || '') :
              (b.name || '').localeCompare(a.name || '');
          
          case "sku":
            return isAsc ?
              (Number(a.skuId) || 0) - (Number(b.skuId) || 0) :
              (Number(b.skuId) || 0) - (Number(a.skuId) || 0);
          
          case "quantity":
            return isAsc ?
              (Number(a.amount) || 0) - (Number(b.amount) || 0) :
              (Number(b.amount) || 0) - (Number(a.amount) || 0);
          
          case "value":
            const aValue = (Number(a.amount) || 0) * (Number(a.unitPrice) || 0);
            const bValue = (Number(b.amount) || 0) * (Number(b.unitPrice) || 0);
            return isAsc ? aValue - bValue : bValue - aValue;
          
          case "category":
            return isAsc ?
              (a.category || '').localeCompare(b.category || '') :
              (b.category || '').localeCompare(a.category || '');
          
          default:
            return 0;
        }
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
      // Add strict date validation for non-inventory reports
      if (reportType !== "inventory-summary") {
        // Check for null/empty dates
        if (!startDate || !endDate) {
          alert("Please select both start and end dates to generate the report.");
          return;
        }

        // Validate date order
        const effectiveStartDate = new Date(startDate);
        const effectiveEndDate = new Date(endDate);
        
        if (effectiveStartDate > effectiveEndDate) {
          alert("Start date cannot be after end date. Please adjust your date range.");
          return;
        }
      }

      let reportData;
      
      switch (reportType) {
        case "income-statement":
          const incomeData = await getIncome(user.id);
          const expenseData = await getExpenses(user.id);
          const filteredIncome = filterTransactions(incomeData);
          const filteredExpenses = filterTransactions(expenseData);
          reportData = generateIncomeStatement(
            filteredIncome, 
            filteredExpenses, 
            new Date(startDate),
            new Date(endDate)
          );
          break;
        case "income-summary":
          const incomeTransactions = await getIncome(user.id);
          reportData = generateTransactionsSummary(
            filterTransactions(incomeTransactions), 
            "income",
            new Date(startDate),
            new Date(endDate)
          );
          break;
        case "expense-summary":
          const expenseTransactions = await getExpenses(user.id);
          reportData = generateTransactionsSummary(
            filterTransactions(expenseTransactions), 
            "expense",
            new Date(startDate),
            new Date(endDate)
          );
          break;
        case "inventory-summary":
          const inventoryData = await getInventoryByUser(user.id);
          let filteredInventory = filterTransactions(inventoryData, true);
          reportData = generateInventorySummary(filteredInventory);
          break;
        case "sales-tax":
          const taxIncomeData = await getIncome(user.id);
          const taxExpenseData = await getExpenses(user.id);
          reportData = generateSalesTaxSummary(
            filterTransactions(taxIncomeData), 
            filterTransactions(taxExpenseData), 
            new Date(startDate), 
            new Date(endDate)
          );
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

  // Add date validation on input change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      alert("Start date cannot be after end date");
      return;
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && new Date(startDate) > new Date(newEndDate)) {
      alert("End date cannot be before start date");
      return;
    }
    setEndDate(newEndDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent pt-20">
            Generate Reports
          </h1>
          <p className="text-gray-400">Create and download financial reports in PDF or CSV format</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 mb-8 transition-all duration-300 hover:border-white/20">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-200 mb-6">Report Type</h3>
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
                  },
                  {
                    id: "sales-tax",
                    title: "Sales Tax Report",
                    description: "Detailed sales tax transaction report",
                    icon: FileText
                  }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-6 rounded-xl backdrop-blur-sm ${
                      reportType === type.id
                        ? "bg-blue-500/20 border-blue-500/30"
                        : "bg-white/5 border-white/10"
                    } border hover:border-blue-500/30 transition-all duration-300`}
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
              {reportType !== "inventory-summary" && (
                <>
                  <div>
                    <label htmlFor="start-date" className="block text-sm text-gray-300 mb-1">Start Date</label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm text-gray-300 mb-1">End Date</label>
                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [color-scheme:dark]"
                    />
                  </div>
                </>
              )}
            </div>

            {reportType !== "income-statement" && reportType !== "sales-tax" && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  <option key="all" value="all">All Categories</option>
                  {categories[
                    reportType === "income-summary" ? "income" : 
                    reportType === "expense-summary" ? "expense" : 
                    "inventory"
                  ].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {reportType !== "income-statement" && reportType !== "sales-tax" && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 [&>option]:text-gray-900 [&>option]:bg-white"
                >
                  {reportType === "inventory-summary" ? (
                    <>
                      <option value="name-asc">Item Name (A-Z)</option>
                      <option value="name-desc">Item Name (Z-A)</option>
                      <option value="sku-asc">SKU (Low to High)</option>
                      <option value="sku-desc">SKU (High to Low)</option>
                      <option value="quantity-desc">Quantity (High to Low)</option>
                      <option value="quantity-asc">Quantity (Low to High)</option>
                      <option value="value-desc">Total Value (High to Low)</option>
                      <option value="value-asc">Total Value (Low to High)</option>
                      <option value="category-asc">Category (A-Z)</option>
                      <option value="category-desc">Category (Z-A)</option>
                    </>
                  ) : (
                    <>
                      <option value="date-desc">Date (Newest First)</option>
                      <option value="date-asc">Date (Oldest First)</option>
                      <option value="amount-desc">Amount (High to Low)</option>
                      <option value="amount-asc">Amount (Low to High)</option>
                      <option value="category-asc">Category (A-Z)</option>
                      <option value="category-desc">Category (Z-A)</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-1">Format</label>
              <div className="flex gap-4">
                <Button
                  key="pdf"
                  onClick={() => setFormat("pdf")}
                  className={`transition-all duration-200 ${
                    format === "pdf"
                      ? "bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  PDF
                </Button>
                <Button
                  key="csv"
                  onClick={() => setFormat("csv")}
                  className={`transition-all duration-200 ${
                    format === "csv"
                      ? "bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  CSV
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => generateReport(true)}
                className="bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Report
              </Button>
              <Button
                onClick={() => generateReport(false)}
                className="bg-blue-500/30 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-500/20 transition-all duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {previewData && (
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10 transition-all duration-300 hover:border-white/20">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Report Preview</h2>
            <pre className="bg-white/5 p-4 rounded-xl border border-white/10 overflow-x-auto text-gray-300">
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