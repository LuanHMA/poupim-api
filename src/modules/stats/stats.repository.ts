import { prisma } from "../../config/prisma"
import { monthRange } from "../../utils/month-range"
import { toAmount } from "../../utils/to-amount"
import { StatsGetTransactionsSummaryInput } from "./stats.contracts"

export class StatsRepository {
    async findAmountsByPeriod({ month, year, user_id }: StatsGetTransactionsSummaryInput) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                created_at: monthRange(year, month),
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

    async findAmountsByCategoryAndPeriod({ month, year, user_id }: StatsGetTransactionsSummaryInput) {
        const transactions = await prisma.transaction.findMany({
            where: {
                user_id,
                created_at: monthRange(year, month),
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
