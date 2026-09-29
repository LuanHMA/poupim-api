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
    async findManyByMonthAndYear({ user_id, month, year, limit }: TransactionsGetAllInput) {
        const transactions = await prisma.transaction.findMany({
            where: {
                month,
                year,
                user_id,
            },
            take: limit,
            orderBy: {
                created_at: "desc",
            },
            select: {
                id: true,
                description: true,
                amount: true,
                type: true,
                created_at: true,
                category: {
                    select: { name: true, color: true, icon: true },
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
            category: {
                name: transaction.category?.name ?? null,
                color: transaction.category?.color ?? null,
                icon: transaction.category?.icon ?? null,
            },
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
