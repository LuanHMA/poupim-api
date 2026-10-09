import { AppDate } from "../../utils/app-date"
import {
    ReportsCategoryStats,
    ReportsGenerateInsightsInput,
    ReportsGetBasesStatsOutput,
    ReportsMonthInsightsOutput,
    ReportsPeriodInput,
} from "./reports.contracts"
import { ReportsRepository } from "./reports.repository"

export class ReportsService {
    constructor(private reportsRepository: ReportsRepository) {}

    async getBasesStats({ month, year, user_id }: ReportsPeriodInput): Promise<ReportsGetBasesStatsOutput> {
        const transactions = await this.reportsRepository.findAmountsByPeriod({ month, year, user_id })

        const total_income = await this.reportsRepository.findTotalIncomeByPeriod({ month, year, user_id })
        const total_expense = await this.reportsRepository.findTotalExpenseByPeriod({ month, year, user_id })

        const expenses = transactions
            .filter((item) => item.type === "EXPENSE")
            .map((item) => item.amount)

        const daysInMonth = AppDate.daysInMonth({ month, year })
        const average_daily_expense = daysInMonth > 0 ? Number((total_expense / daysInMonth).toFixed(2)) : 0

        return {
            total_income,
            total_expense,
            balance: total_income - total_expense,
            transactions_total: transactions.length,
            highest_expense: expenses.length > 0 ? Math.max(...expenses) : 0,
            average_daily_expense,
        }
    }

    async getMonthInsights({ month, year, user_id }: ReportsPeriodInput): Promise<ReportsMonthInsightsOutput> {
        const [basesStats, categoryStats] = await Promise.all([
            this.getBasesStats({ month, year, user_id }),
            this.getCategoryStats({ month, year, user_id }),
        ])

        return this.generateInsights({
            basesStats,
            categoryStats,
            year,
            month,
        })
    }

    private async getCategoryStats({ month, year, user_id }: ReportsPeriodInput): Promise<ReportsCategoryStats> {
        const transactions = await this.reportsRepository.findAmountsByCategoryAndPeriod({ month, year, user_id })

        const totalsByCategory = new Map<string, number>()

        for (const item of transactions) {
            const current = totalsByCategory.get(item.category) ?? 0
            totalsByCategory.set(item.category, current + item.amount)
        }

        const totalExpense = [...totalsByCategory.values()].reduce((acc, amount) => acc + amount, 0)

        return [...totalsByCategory.entries()].map(([category, total_amount]) => ({
            category,
            total_amount,
            percentage: totalExpense > 0
                ? Number(((total_amount / totalExpense) * 100).toFixed(2))
                : 0,
        }))
    }

    private generateInsights({
        basesStats,
        categoryStats,
        year,
        month,
    }: ReportsGenerateInsightsInput): ReportsMonthInsightsOutput {
        const { average_daily_expense, transactions_total, balance, total_expense, total_income } = basesStats

        const daysInMonth = AppDate.daysInMonth({ month, year })

        const expenseRatio =
            total_income > 0
                ? Number(((total_expense / total_income) * 100).toFixed(2))
                : 0

        const expenseRatioType =
            expenseRatio <= 70
                ? "positive"
                : expenseRatio <= 90
                    ? "neutral"
                    : "warning"

        const savingsType =
            balance > 0 ? "positive" : balance < 0 ? "warning" : "neutral"

        const topCategory =
            categoryStats.length > 0
                ? categoryStats.reduce((prev, current) =>
                    current.total_amount > prev.total_amount ? current : prev
                )
                : null

        const transactionsPerDay =
            daysInMonth > 0
                ? Number((transactions_total / daysInMonth).toFixed(2))
                : 0

        const spendingFrequencyType =
            transactionsPerDay > 1.5
                ? "warning"
                : transactionsPerDay < 0.5
                    ? "positive"
                    : "neutral"

        const averageDailySpending = Number(
            average_daily_expense.toFixed(2)
        )

        return {
            savingsPerformance: {
                id: "savingsPerformance",
                question: "Eu economizei ou gastei mais do que ganhei? (R$)",
                type: savingsType,
                value: balance
            },

            expenseRatio: {
                id: "expenseRatio",
                question: "Quanto da minha renda eu utilizei este mês? (%)",
                type: expenseRatioType,
                value: expenseRatio
            },

            topExpenseCategory: topCategory
                ? {
                    id: "topExpenseCategory",
                    question: "Onde eu mais gastei dinheiro este mês?",
                    type: "info",
                    category: topCategory.category,
                    value: topCategory.total_amount
                }
                : null,

            spendingFrequency: {
                id: "spendingFrequency",
                question: "Com que frequência eu movimentei dinheiro este mês? (Dias)",
                type: spendingFrequencyType,
                total_transactions: transactions_total,
                transactions_per_day: transactionsPerDay
            },

            averageDailySpending: {
                id: "averageDailySpending",
                question: "Quanto eu gasto por dia, em média? (R$)",
                type: "info",
                value: averageDailySpending
            },
        }
    }
}
