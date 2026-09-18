import { prisma } from "../config/prisma";
import { Transaction, TransactionCreate, TransactionDelete, TransactionUpdate } from "../models/transactions";
import { toAmount } from "../utils/to-amount";

export class TransactionsRepository {
    async findAllByUserId(user_id: Transaction["user_id"]) {
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
            category_name: transaction.category.name,
            created_at: transaction.created_at,
        }))
    }

    async findByIdAndUserId({ id, user_id }: TransactionDelete) {
        return prisma.transaction.findFirst({
            where: { id, user_id },
        })
    }

    async create({ amount, category_id, description, type, user_id }: TransactionCreate) {
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

    async update({ id, data }: { id: Transaction["id"], data: TransactionUpdate }) {
        await prisma.transaction.update({
            where: { id },
            data,
        })
    }

    async delete(id: Transaction["id"]) {
        await prisma.transaction.delete({
            where: { id },
        })
    }
}
