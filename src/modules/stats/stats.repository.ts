import { prisma } from "../../config/prisma"
import { toAmount } from "../../utils/to-amount"
import { StatsFindByPeriodData } from "./stats.contracts"

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
}
