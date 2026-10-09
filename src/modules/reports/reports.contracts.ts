import { Transaction } from "../../config/generated/prisma/client"

export type ReportsPeriodInput = {
    month: Transaction["month"]
    year: Transaction["year"]
    user_id: Transaction["user_id"]
}

export type ReportsGetBasesStatsOutput = {
    total_income: number
    total_expense: number
    balance: number
    transactions_total: number
    highest_expense: number
    average_daily_expense: number
}

export type ReportsCategoryStats = {
    category: string
    total_amount: number
    percentage: number
}[]

export type ReportsGenerateInsightsInput = {
    basesStats: ReportsGetBasesStatsOutput
    categoryStats: ReportsCategoryStats
    year: number
    month: number
}

export type ReportsMonthInsightsOutput = {
    savingsPerformance: {
        id: "savingsPerformance"
        question: string
        type: "positive" | "warning" | "neutral"
        value: number
    }
    expenseRatio: {
        id: "expenseRatio"
        question: string
        type: "positive" | "neutral" | "warning"
        value: number
    }
    topExpenseCategory: {
        id: "topExpenseCategory"
        question: string
        type: "info"
        category: string
        value: number
    } | null
    spendingFrequency: {
        id: "spendingFrequency"
        question: string
        type: "warning" | "positive" | "neutral"
        total_transactions: number
        transactions_per_day: number
    }
    averageDailySpending: {
        id: "averageDailySpending"
        question: string
        type: "info"
        value: number
    }
}
