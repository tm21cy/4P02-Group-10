export function generateSalesTaxSummary(incomeData, expenseData, startDate, endDate) {
  // Filter transactions with tax
  const taxableIncome = incomeData.filter(inc => Number(inc.taxAmount) > 0);
  const taxableExpenses = expenseData.filter(exp => Number(exp.taxAmount) > 0);

  // Calculate totals
  const totalTaxCollected = taxableIncome.reduce((sum, inc) => sum + Number(inc.taxAmount), 0);
  const totalTaxPaid = taxableExpenses.reduce((sum, exp) => sum + Number(exp.taxAmount), 0);
  const netTaxRemittance = totalTaxCollected - totalTaxPaid;

  return {
    reportType: "Sales Tax Report",
    totalTaxCollected,
    totalTaxPaid,
    netTaxRemittance,
    taxableTransactions: {
      income: taxableIncome.map(inc => ({
        date: inc.date,
        description: inc.description,
        amount: inc.amount,
        taxAmount: inc.taxAmount,
        taxRate: inc.taxRate,
        type: 'Income'
      })),
      expenses: taxableExpenses.map(exp => ({
        date: exp.date,
        description: exp.description,
        amount: exp.amount,
        taxAmount: exp.taxAmount,
        taxRate: exp.taxRate,
        type: 'Expense'
      }))
    },
    dateRange: {
      start: startDate,
      end: endDate
    }
  };
} 