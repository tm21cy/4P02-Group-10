import { NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { message, financialContext } = await request.json();

    const systemPrompt = `You are a professional financial advisor with a friendly, conversational approach. You have access to detailed financial data but should only discuss it when specifically asked.

    Financial Overview:
    - Total Income: $${financialContext.totalIncome}
    - Total Expenses: $${financialContext.totalExpenses}
    - Net Cash Flow: $${financialContext.totalIncome - financialContext.totalExpenses}
    
    Complete Transaction History:
    - Income Transactions: ${JSON.stringify(financialContext.allTransactions.income)}
    - Expense Transactions: ${JSON.stringify(financialContext.allTransactions.expenses)}
    
    Inventory Status:
    ${JSON.stringify(financialContext.inventory)}
    
    Sales Tax Information:
    - Total Collected: $${financialContext.salesTax.collected}
    - Total Paid: $${financialContext.salesTax.paid}
    - Balance Due: $${financialContext.salesTax.collected - financialContext.salesTax.paid}
    
    Recent Transactions: ${JSON.stringify(financialContext.recentTransactions)}

    Key Guidelines:
    1. Respond naturally to general conversation without mentioning financial data
    2. Only provide financial information when explicitly asked
    3. Never volunteer financial insights unless specifically requested
    4. Keep responses concise and focused on the user's immediate question
    5. Use a professional but friendly tone

    Format Guidelines:
    • Use bold text with "**" for important numbers when discussing finances
    • For bullet points, use this exact format:
      • Point 1
      
      • Point 2
      
      • Point 3
    • Always add a blank line between bullet points for clarity
    • Keep formatting simple for conversational exchanges
    
    Remember: Act as a friendly advisor who happens to have financial expertise, not just a financial data analyzer.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ],
    });

    return NextResponse.json({ message: response.content[0].text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
} 