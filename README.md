# AccuTrack: Minimalistic Accounting Web App

## Overview
**AccuTrack** is a minimalist, full-featured accounting and inventory management solution tailored to **Canadian small business owners**. It bridges the gap between affordability, usability, and functionality—offering an intuitive web platform to manage **expenses, income, inventory, sales tax**, and **AI-driven financial insights**, while maintaining compliance with government reporting standards.

This project was developed as part of the COSC 4P02 Software Engineering course at Brock University using an **Agile Scrum** methodology across three sprints.

## Table of Contents
- [Overview](#overview)  
- [Problem Statement](#problem-statement)  
- [Key Features](#key-features)  
- [Technical Stack](#technical-stack)  
- [System Architecture](#system-architecture)  
- [Development Methodology](#development-methodology)  
- [Installation Guide](#installation-guide)  
- [User Manual](#user-manual)  
- [Testing Summary](#testing-summary)  
- [Team Members](#team-members)  
- [Contributions](#contributions)  
- [Repository & Links](#repository--links)

## Problem Statement
Small business owners often face three difficult options for accounting:  
1. **Hire an accountant** – expensive and not always scalable.  
2. **Manual Excel/Sheets tracking** – time-consuming and error-prone.  
3. **Use commercial software** (e.g., QuickBooks/Salesforce) – complex and costly.

**AccuTrack** was built to solve this by providing a simple, centralized, and cost-effective web application with built-in **bookkeeping, inventory, and compliance capabilities**, and optional **AI insights** for premium users.

## Key Features

### Core Functionalities
- **Expense Management** – Track and categorize business expenses.
- **Income & Sales Tracking** – Record income manually or from sales; integrates with inventory.
- **Inventory Management** – Auto-updates with income/expenses; tracks stock value.
- **Sales Tax Compliance** – Support for Ontario tax rates with optional overrides.
- **Financial Reports** – Generate income, expense, inventory, and tax reports.
- **Dashboard** – View real-time summaries and visual analytics.

### Advanced (Pro) Features
- **AI Insights Panel** – Powered by Anthropic Claude API for business analysis.
- **Chat-Based Financial Assistance** – Pre-written prompts for forecasting and strategy.
- **Subscription-Based Access** – Gated features for subscribed users only.

## Technical Stack

### Frontend
- **React 19 + Next.js 13** (App Router)
- **Tailwind CSS**, **ShadCN UI**, **Lucide React**, **Chart.js/Recharts**
- **Zustand** for state management

### Backend
- **Node.js + Prisma ORM**
- **PostgreSQL** hosted on Hetzner VPS (CPX21)
- **Clerk** for authentication
- **Anthropic Claude 3.5** for AI functionality (Pro plan)

### Testing & Tooling
- **Jest**, **React Testing Library**, **Playwright**
- **jsPDF**, **PapaParse**, **SWR**, **Clsx**, **ESLint**, **PostCSS**, **Geist Font**

## System Architecture

- **Pages** are structured using Next.js App Router
- **API routes** handle backend logic
- **Prisma ORM** connects securely to a self-hosted Postgres database
- **Frontend modules** include components for expenses, income, inventory, dashboard, reports, and AI panel
- **AI Assistant** lives in a gated UI with dedicated endpoints
- **Testing modules** span unit, integration, E2E, and UI behavior tests

## Development Methodology

### Sprints
- **Sprint 1:** Expense & income management (MVP functionality)
- **Sprint 2:** Inventory, tax compliance, and reporting integration
- **Sprint 3:** AI functionality, paywall, system testing, and deployment

### Scrum Practices
- Weekly stand-ups and retrospectives
- Jira-managed backlog with story points, tasks, and sprint boards
- Teamwide adherence to agile roles (Scrum Master, PO, Devs)

## Installation Guide

Access the application through the deployed Vercel prototype:  
[🌐 View Online Prototype](https://4-p02-group-10-tpmg.vercel.app/)

## User Manual
A detailed manual covering all user-facing functions is available here:  
📘 [AccuTrack User Manual (PDF)](https://github.com/tm21cy/4P02-Group-10/blob/main/COSC%204P02%20%26%20SE%20Process/AccuTrack%20User%20Manual.pdf)

## Testing Summary

### Types of Tests Conducted
| Type              | Examples |
|-------------------|----------|
| **Unit Tests**    | Dashboard, charts, auth UI |
| **Integration**   | Clerk auth, form behavior |
| **Backend**       | Prisma DB integrity checks |
| **End-to-End**    | Full user flows (forms, reports) |
| **UI Testing**    | Button/input behavior, nav links |

### Tools Used
- Jest + Testing Library
- Playwright for E2E
- jsdom for rendering components
- Prisma Client + node-fetch for mocking

🧪 [View Full Testing Reports](https://github.com/tm21cy/4P02-Group-10/tree/main/Accutrack/ctrf/jest-report)

## Team Members

| Name                  | Role(s)                                |
|-----------------------|----------------------------------------|
| **Anthony Colosimo**  | Frontend Developer, AI Integration     |
| **Jacob Drobena**     | Frontend Developer                     |
| **Rouvin Rebello**    | Product Owner, Backend Dev             |
| **Sangmitra Madhusudan** | Software Engineer in Test           |
| **Skye Reid**         | Scrum Master, Frontend Dev, Testing    |
| **Tyler McDonald**    | Backend Developer                      |

## Contributions
- 📊 All contributions were tracked using GitHub and JIRA.
- 📄 [Contribution Tracker Document](https://github.com/tm21cy/4P02-Group-10/blob/main/COSC%204P02%20%26%20SE%20Process/Contribution%20Tracker.docx)
- 🌐 [GitHub Contributor Graphs](https://github.com/tm21cy/4P02-Group-10/graphs/contributors)

## Repository & Links

- 🔗 **GitHub:** [https://github.com/tm21cy/4P02-Group-10](https://github.com/tm21cy/4P02-Group-10)
- 🔗 **Live Site:** [https://4-p02-group-10-tpmg.vercel.app/](https://4-p02-group-10-tpmg.vercel.app/)
- 📝 **Final Report:** Included in course submission
