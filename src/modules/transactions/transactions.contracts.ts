import { Prisma, Transaction } from "../../config/generated/prisma/client"

export type { Transaction }

export type TransactionCreate = Pick<
    Prisma.TransactionUncheckedCreateInput,
    "amount" | "category_id" | "description" | "type" | "user_id"
>

export type TransactionUpdate = Pick<
    Prisma.TransactionUncheckedCreateInput,
    "amount" | "category_id" | "description" | "type"
>

export type TransactionDelete = Pick<Transaction, "id" | "user_id">
