export function generateTransactionsSummary(transactions, type) {
  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const categorySummary = summarizeByCategory(transactions);

  return {
    reportType: type === "income" ? "Income Transactions" : "Expense Transactions",
    transactions: transactions.map(t => ({
      id: t.id,
      date: t.date,
      category: t.category,
      amount: t.amount,
      description: t.description,
      tax: t.tax || 0
    })),
    total,
    categorySummary,
    dateRange: {
      start: transactions[0]?.date,
      end: transactions[transactions.length - 1]?.date
    }
  };
} 