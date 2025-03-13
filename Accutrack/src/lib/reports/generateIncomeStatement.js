export function generateIncomeStatement(incomeData, expenseData) {
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
      start: incomeData[0]?.date,
      end: incomeData[incomeData.length - 1]?.date
    }
  };
} 