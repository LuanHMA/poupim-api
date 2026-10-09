import { AppDate } from "../../utils/app-date"
import { toAmount } from "../../utils/to-amount"
import {
    GetCashFlowInput,
    GetCashFlowOutput,
    StatsGetCashPerDayInput,
    StatsGetCashPerDayOutput,
    StatsGetCategoryStatsInput,
    StatsGetCategoryStatsOutput,
    StatsGetMonthlyInput,
    StatsGetMonthlyOutput,
    StatsGetPeriodsInput,
    StatsGetPeriodsOutput,
} from "./stats.contracts"
import { StatsRepository } from "./stats.repository"

export class StatsService {
    constructor(private statsRepository: StatsRepository) { }

    async getCashFlow({ month, year, user_id }: GetCashFlowInput): Promise<GetCashFlowOutput> {
        const total_income = await this.statsRepository.findTotalIncomeByPeriod({ month, year, user_id })
        const total_expense = await this.statsRepository.findTotalExpensByPeriod({ month, year, user_id })

        return {
            total_income,
            total_expense,
            balance: total_income - total_expense,
            month,
            year
        }
    }

    async getPeriods({ user_id }: StatsGetPeriodsInput): Promise<StatsGetPeriodsOutput> {
        return this.statsRepository.findPeriodsByUser({ user_id })
    }

    async getMonthly({ month, year, user_id }: StatsGetMonthlyInput): Promise<StatsGetMonthlyOutput> {
        const periods = AppDate.periodsUntil({ month, year }, 3) // 2 meses antes + o mês atual
        const [beforePrevious, previous, requested] = periods // desestruturação dos periodos
        const today = AppDate.calendar() // data atual (mes, dia, ano)
        const in_progress = AppDate.isCurrentPeriod({ month, year }) // verifica se o mês e ano enviado é o atual

        const TIGHT_EXPENSE_RATIO = 0.7

        const [totals, expenses] = await Promise.all([
            this.statsRepository.findTotalsByPeriods({ user_id, periods }),
            this.statsRepository.findExpensesByPeriods({ user_id, periods: [previous, requested] }),
        ])

        const totalsByPeriod = new Map<string, { total_income: number, total_expense: number }>()

        for (const item of totals) {
            const key = `${item.year}-${item.month}`
            const periodTotals = totalsByPeriod.get(key) ?? { total_income: 0, total_expense: 0 }

            if (item.type === "INCOME") {
                periodTotals.total_income = item.amount
            } else {
                periodTotals.total_expense = item.amount
            }

            totalsByPeriod.set(key, periodTotals)
        }

        const snapshots = periods.map((period) => {
            const periodTotals = totalsByPeriod.get(`${period.year}-${period.month}`)
                ?? { total_income: 0, total_expense: 0 }

            return {
                ...period,
                ...periodTotals,
                balance: Number((periodTotals.total_income - periodTotals.total_expense).toFixed(2)),
            }
        })
        const [beforePreviousSnapshot, previousSnapshot, current] = snapshots
        const has_transactions = current.total_income > 0 || current.total_expense > 0

        const currentCategories = new Map<string, number>()
        const previousCategories = new Map<string, number>()
        let currentExpenseUntilToday = 0
        let previousExpenseUntilToday = 0

        for (const expense of expenses) {
            const isCurrent = expense.month === month && expense.year === year
            const categories = isCurrent ? currentCategories : previousCategories
            categories.set(expense.category, (categories.get(expense.category) ?? 0) + expense.amount)

            if (in_progress && AppDate.day(expense.transaction_date) <= today.day) {
                if (isCurrent) {
                    currentExpenseUntilToday += expense.amount
                } else {
                    previousExpenseUntilToday += expense.amount
                }
            }
        }

        const top_categories = [...currentCategories.entries()]
            .map(([category, total]) => {
                const total_amount = Number(total.toFixed(2))
                const previous_amount = Number((previousCategories.get(category) ?? 0).toFixed(2))

                return {
                    category,
                    total_amount,
                    previous_amount,
                    difference: Number((total_amount - previous_amount).toFixed(2)),
                }
            })
            .sort((a, b) => b.total_amount - a.total_amount)
            .slice(0, 5)

        const currentIncomeUsedPercentage = current.total_income > 0
            ? Number(((current.total_expense / current.total_income) * 100).toFixed(2))
            : null
        const previousIncomeUsedPercentage = previousSnapshot.total_income > 0
            ? Number(((previousSnapshot.total_expense / previousSnapshot.total_income) * 100).toFixed(2))
            : null

        let verdict: StatsGetMonthlyOutput["verdict"] = null

        if (has_transactions) {
            verdict = {
                state: current.balance < 0
                    ? "no_vermelho"
                    : current.total_expense / current.total_income > TIGHT_EXPENSE_RATIO
                        ? "apertado"
                        : "tranquilo",
                balance: current.balance,
                income_used_percentage: currentIncomeUsedPercentage,
            }
        }

        return {
            in_progress,
            has_transactions,
            versus_previous: {
                current,
                previous: previousSnapshot,
                difference: {
                    total_income: Number((current.total_income - previousSnapshot.total_income).toFixed(2)),
                    total_expense: Number((current.total_expense - previousSnapshot.total_expense).toFixed(2)),
                    balance: Number((current.balance - previousSnapshot.balance).toFixed(2)),
                },
            },
            same_day: in_progress
                ? {
                    day: today.day,
                    current_expense: Number(currentExpenseUntilToday.toFixed(2)),
                    previous_expense: Number(previousExpenseUntilToday.toFixed(2)),
                    difference: Number((currentExpenseUntilToday - previousExpenseUntilToday).toFixed(2)),
                }
                : null,
            top_categories,
            income_used_percentage: {
                current: currentIncomeUsedPercentage,
                previous: previousIncomeUsedPercentage,
            },
            last_three_months: [
                beforePreviousSnapshot,
                previousSnapshot,
                current,
            ].map((snapshot) => ({
                ...snapshot,
                in_progress: today.month === snapshot.month && today.year === snapshot.year,
            })),
            verdict,
        }
    }

    async getTopExpenseCategories({ month, year, user_id }: StatsGetCategoryStatsInput): Promise<StatsGetCategoryStatsOutput> {
        const categoryStats = await this.getCategoryStats({ month, year, user_id })

        return categoryStats
            .sort((a, b) => b.total_amount - a.total_amount)
            .slice(0, 5)
    }

    async getCashPerDay({ month, year, user_id }: StatsGetCashPerDayInput): Promise<StatsGetCashPerDayOutput> {
        const balance = await this.statsRepository.findBalanceByPeriod({ month, year, user_id })

        const daysInMonth = AppDate.daysInMonth({ month, year })
        const currentDay = AppDate.day()
        const daysRemaining = daysInMonth - currentDay
        const cashPerDay = balance / daysRemaining

        return toAmount(cashPerDay.toFixed(2))
    }

    private async getCategoryStats({ month, year, user_id }: StatsGetCategoryStatsInput): Promise<StatsGetCategoryStatsOutput> {
        const transactions = await this.statsRepository.findAmountsByCategoryAndPeriod({ month, year, user_id })

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
}
