import { prisma } from "../../config/prisma";
import { toAmount } from "../../utils/to-amount";
import {
    Transaction,
    TransactionsCreateData,
    TransactionsDeleteInput,
    TransactionsGetAllInput,
    TransactionsUpdateData,
} from "./transactions.contracts";

export class TransactionsRepository {
    async findAllByUserId({ user_id, date }: TransactionsGetAllInput) {
        const where = {
            ...(date ? { created_at: { gte: date, lte: new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1) } } : {}),
            user_id,
        }

        const transactions = await prisma.transaction.findMany({
            where,
            select: {
                id: true,
                description: true,
                amount: true,
                type: true,
                created_at: true,
                category: {
                    select: { name: true },
                },
                month: true,
                year: true,
                status: true,
                ignore: true,
                fixed: true,
                observation: true,
            },
        })

        return transactions.map((transaction) => ({
            id: transaction.id,
            description: transaction.description,
            amount: toAmount(transaction.amount),
            type: transaction.type,
            category_name: transaction.category?.name ?? null,
            created_at: transaction.created_at,
            month: transaction.month,
            year: transaction.year,
            status: transaction.status,
            ignore: transaction.ignore,
            fixed: transaction.fixed,
            observation: transaction.observation,
        }))
    }

    async findByIdAndUserId({ id, user_id }: TransactionsDeleteInput) {
        return prisma.transaction.findFirst({
            where: { id, user_id },
        })
    }

    async create(data: TransactionsCreateData) {
        await prisma.transaction.create({ data })
    }

    async update({ id, data }: { id: Transaction["id"], data: TransactionsUpdateData }) {
        await prisma.transaction.update({
            where: { id },
            data,
        })
    }

    async delete({ id }: Pick<Transaction, "id">) {
        await prisma.transaction.delete({
            where: { id },
        })
    }
}
