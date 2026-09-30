import { prisma } from "../../config/prisma";
import { toAmount } from "../../utils/to-amount";
import {
    Transaction,
    TransactionsCreateData,
    TransactionsDeleteInput,
    TransactionsGetAllInput,
    TransactionsGetAllOutput,
    TransactionsUpdateData,
} from "./transactions.contracts";

export class TransactionsRepository {
    async findManyByMonthAndYear({ user_id, month, year, page, limit, type, category_id, status, search }: TransactionsGetAllInput): Promise<TransactionsGetAllOutput> {
        const where = {
            month,
            year,
            user_id,
            type,
            category_id,
            status,
            ...(search
                ? {
                    OR: [
                        { description: { contains: search, mode: "insensitive" as const } },
                        { observation: { contains: search, mode: "insensitive" as const } },
                    ],
                }
                : {}),
        }

        const [total, rows] = await prisma.$transaction([
            prisma.transaction.count({ where }),
            prisma.transaction.findMany({
                where,
                skip: (page - 1) * limit,
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
                        select: { id: true, name: true, color: true, icon: true },
                    },
                    month: true,
                    year: true,
                    status: true,
                    ignore: true,
                    fixed: true,
                    observation: true,
                },
            }),
        ])

        const transactions = rows.map((transaction) => ({
            id: transaction.id,
            description: transaction.description,
            amount: toAmount(transaction.amount),
            type: transaction.type,
            category: {
                id: transaction.category?.id ?? null,
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

        return {
            transactions,
            pagination: {
                page,
                limit,
                total,
                total_pages: total === 0 ? 0 : Math.ceil(total / limit),
            },
        }
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
