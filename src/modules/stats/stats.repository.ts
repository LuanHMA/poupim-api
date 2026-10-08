import { prisma } from "../../config/prisma"
import { toAmount } from "../../utils/to-amount"
import { StatsFindByPeriodData, StatsGetPeriodsInput } from "./stats.contracts"

export class StatsRepository {
    async findAmountsByPeriod({ month, year, user_id }: StatsFindByPeriodData) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                month,
                year,
            },
            select: {
                type: true,
                amount: true,
            },
        })

        return transactions.map((transaction) => ({
            type: transaction.type,
            amount: toAmount(transaction.amount),
        }))
    }

    async findAmountsByCategoryAndPeriod({ month, year, user_id }: StatsFindByPeriodData) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                month,
                year,
                type: "EXPENSE",
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
}
