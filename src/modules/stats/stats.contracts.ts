import { Transaction } from "../../config/generated/prisma/client"

export type StatsGetCashPerDayInput = {
    month: Transaction["month"]
    year: Transaction["year"]
    user_id: Transaction["user_id"]
}

export type StatsGetCashPerDayOutput = number

export type GetCashFlowInput = {
    month: Transaction["month"]
    year: Transaction["year"]
    user_id: Transaction["user_id"]
}

export type StatsFindByPeriodData = Pick<Transaction, "month" | "year" | "user_id">

export type StatsPeriod = Pick<Transaction, "month" | "year">

export type GetCashFlowOutput = {
    month: Transaction["month"]
    year: Transaction["year"]
    total_income: number
    total_expense: number
    balance: number
}

export type StatsGetCategoryStatsInput = StatsFindByPeriodData

export type StatsGetCategoryStatsOutput = {
    category: string
    total_amount: number
    percentage: number
}[]

export type StatsGetPeriodsInput = Pick<Transaction, "user_id">

export type StatsGetPeriodsOutput = {
    month: Transaction["month"]
    year: Transaction["year"]
}[]

export type StatsMonthTotals = {
    total_income: number
    total_expense: number
    balance: number
}

export type StatsMonthSnapshot = StatsPeriod & StatsMonthTotals

export type StatsVerdictState = "tranquilo" | "apertado" | "no_vermelho"

export type StatsGetMonthlyInput = StatsFindByPeriodData

export type StatsGetMonthlyOutput = {
    in_progress: boolean
    has_transactions: boolean
    versus_previous: {
        current: StatsMonthSnapshot
        previous: StatsMonthSnapshot
        difference: StatsMonthTotals
    }
    same_day: {
        day: number
        current_expense: number
        previous_expense: number
        difference: number
    } | null
    top_categories: {
        category: string
        total_amount: number
        previous_amount: number
        difference: number
    }[]
    income_used_percentage: {
        current: number | null
        previous: number | null
    }
    last_three_months: (StatsMonthSnapshot & { in_progress: boolean })[]
    verdict: {
        state: StatsVerdictState
        balance: number
        income_used_percentage: number | null
    } | null
}
