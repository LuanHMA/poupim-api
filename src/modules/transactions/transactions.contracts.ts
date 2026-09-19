import { Prisma, Transaction } from "../../config/generated/prisma/client"

export type { Transaction }

export type TransactionsGetAllInput = Pick<Transaction, "user_id">

export type TransactionsGetAllOutput = {
    id: Transaction["id"]
    description: Transaction["description"]
    amount: number
    type: Transaction["type"]
    category_name: string | null
    created_at: Transaction["created_at"]
}[]

export type TransactionsCreateInput = Pick<
    Prisma.TransactionUncheckedCreateInput,
    "amount" | "category_id" | "description" | "type" | "user_id"
>

export type TransactionsCreateOutput = void

export type TransactionsUpdateInput = {
    user_id: Transaction["user_id"]
    id: Transaction["id"]
    transaction: Pick<
        Prisma.TransactionUncheckedCreateInput,
        "amount" | "category_id" | "description" | "type"
    >
}

export type TransactionsUpdateOutput = void

export type TransactionsDeleteInput = Pick<Transaction, "id" | "user_id">

export type TransactionsDeleteOutput = void
