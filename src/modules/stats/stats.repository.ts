import { prisma } from "../../config/prisma"
import { toAmount } from "../../utils/to-amount"
import { StatsFindByPeriodData, StatsGetPeriodsInput, StatsPeriod } from "./stats.contracts"

export class StatsRepository {
    async findTotalsByPeriods({ user_id, periods }: { user_id: number, periods: StatsPeriod[] }) {
        const rows = await prisma.transaction.groupBy({
            by: ["month", "year", "type"],
            where: {
                user_id,
                ignore: false,
                OR: periods.map(({ month, year }) => ({ month, year })),
            },
            _sum: {
                amount: true,
            },
        })

        return rows.map((row) => ({
            month: row.month,
            year: row.year,
            type: row.type,
            amount: toAmount(row._sum.amount ?? 0),
        }))
    }

    async findExpensesByPeriods({ user_id, periods }: { user_id: number, periods: StatsPeriod[] }) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                type: "EXPENSE",
                ignore: false,
                OR: periods.map(({ month, year }) => ({ month, year })),
            },
            select: {
                month: true,
                year: true,
                amount: true,
                transaction_date: true,
                category: {
                    select: { name: true },
                },
            },
        })

        return transactions.map((transaction) => ({
            month: transaction.month,
            year: transaction.year,
            amount: toAmount(transaction.amount),
            transaction_date: transaction.transaction_date,
            category: transaction.category.name,
        }))
    }

    async findAmountsByCategoryAndPeriod({ month, year, user_id }: StatsFindByPeriodData) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                month,
                year,
                type: "EXPENSE",
                ignore: false,
            },
            select: {
                amount: true,
                category: {
                    select: { name: true },
                },
            },
        })

        return transactions.map((transaction) => ({
            amount: toAmount(transaction.amount),
            category: transaction.category.name,
        }))
    }

    async findPeriodsByUser({ user_id }: StatsGetPeriodsInput) {
        const periods = await prisma.transaction.groupBy({
            by: ["year", "month"],
            where: { user_id },
            orderBy: [
                { year: "desc" },
                { month: "desc" },
            ],
        })

        return periods.map(({ month, year }) => ({ month, year }))
    }

    async findTotalExpensByPeriod({ month, year, user_id }: StatsFindByPeriodData) {
        const totalExpense = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id,
                month,
                year,
                ignore: false,
                type: "EXPENSE",
            },
        })

        return toAmount(totalExpense._sum.amount ?? 0)
    }

    async findTotalIncomeByPeriod({ month, year, user_id }: StatsFindByPeriodData) {
        const totalIncome = await prisma.transaction.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                user_id,
                month,
                year,
                ignore: false,
                type: "INCOME",
            },
        })

        return toAmount(totalIncome._sum.amount ?? 0)
    }

    async findBalanceByPeriod({ month, year, user_id }: StatsFindByPeriodData) {
       const totalIncome = await this.findTotalIncomeByPeriod({ month, year, user_id })
       const totalExpense = await this.findTotalExpensByPeriod({ month, year, user_id })

       if(!totalIncome || !totalExpense) {
        return 0
       }

       const balance = totalIncome - totalExpense
       return balance
    }
}
