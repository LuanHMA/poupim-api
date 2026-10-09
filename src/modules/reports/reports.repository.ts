import { prisma } from "../../config/prisma"
import { toAmount } from "../../utils/to-amount"
import { ReportsPeriodInput } from "./reports.contracts"

export class ReportsRepository {
    async findAmountsByPeriod({ month, year, user_id }: ReportsPeriodInput) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                month,
                year,
                ignore: false,
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

    async findAmountsByCategoryAndPeriod({ month, year, user_id }: ReportsPeriodInput) {
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

    async findTotalExpenseByPeriod({ month, year, user_id }: ReportsPeriodInput) {
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

    async findTotalIncomeByPeriod({ month, year, user_id }: ReportsPeriodInput) {
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
