import { Transaction } from "../../config/generated/prisma/client"

export type StatsGetTransactionsSummaryInput = {
    month: Transaction["month"]
    year: Transaction["year"]
    user_id: Transaction["user_id"]
}

export type StatsFindByPeriodData = Pick<Transaction, "month" | "year" | "user_id">

export type StatsGetTransactionsSummaryOutput = {
    total_income: number
    total_expense: number
    balance: number
}

export type StatsGetOverviewInput = {
    month: Transaction["month"]
    year: Transaction["year"]
    user_id: Transaction["user_id"]
}

export type StatsGetBasesStatsInput = StatsGetOverviewInput

export type StatsGetBasesStatsOutput = {
    total_income: number
    total_expense: number
    balance: number
    transactions_total: number
    highest_expense: number
    average_daily_expense: number
}

export type StatsGetCategoryStatsInput = StatsGetOverviewInput

export type StatsGetCategoryStatsOutput = {
    category: string
    total_amount: number
    percentage: number
}[]

export type StatsGenerateInsightsInput = {
    basesStats: StatsGetBasesStatsOutput
    categoryStats: StatsGetCategoryStatsOutput
    year: number
    month: number
}

export type StatsGenerateInsightsOutput = {
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

export type StatsGetOverviewOutput = {
    basesStats: StatsGetBasesStatsOutput
    categoryStats: StatsGetCategoryStatsOutput
    month_insights: StatsGenerateInsightsOutput
}
