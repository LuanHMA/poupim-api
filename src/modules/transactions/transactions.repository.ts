import { prisma } from "../../config/prisma";
import { toAmount } from "../../utils/to-amount";
import { Transaction, TransactionsCreateInput, TransactionsDeleteInput, TransactionsUpdateInput } from "./transactions.contracts";

export class TransactionsRepository {
    async findAllByUserId({ user_id }: Pick<Transaction, "user_id">) {
        const transactions = await prisma.transaction.findMany({
            where: { user_id },
            select: {
                id: true,
                description: true,
                amount: true,
                type: true,
                created_at: true,
                category: {
                    select: { name: true },
                },
            },
        })

        return transactions.map((transaction) => ({
            id: transaction.id,
            description: transaction.description,
            amount: toAmount(transaction.amount),
            type: transaction.type,
            category_name: transaction.category?.name ?? null,
            created_at: transaction.created_at,
        }))
    }

    async findByIdAndUserId({ id, user_id }: TransactionsDeleteInput) {
        return prisma.transaction.findFirst({
            where: { id, user_id },
        })
    }

    async create({ amount, category_id, description, type, user_id }: TransactionsCreateInput) {
        await prisma.transaction.create({
            data: {
                amount,
                category_id,
                description,
                type,
                user_id,
            },
        })
    }

    async update({ id, data }: { id: Transaction["id"], data: TransactionsUpdateInput["transaction"] }) {
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
