import { Prisma, Transaction } from "../../config/generated/prisma/client"

export type { Transaction }

export type TransactionsGetAllInput = {
    user_id: Transaction["user_id"]
    month: Transaction["month"]
    year: Transaction["year"]
    limit?: number
}

export type TransactionsGetAllOutput = {
    id: Transaction["id"]
    description: Transaction["description"]
    amount: number
    type: Transaction["type"]
    category_name: string | null
    created_at: Transaction["created_at"]
}[]

export type TransactionsCreateInput = {
    user_id: Transaction["user_id"]
    description: Transaction["description"]
    observation?: Transaction["observation"]
    category_id: Transaction["category_id"]
    amount: number
    type: Transaction["type"]
    status: Transaction["status"]
    ignore: Transaction["ignore"]
    fixed: Transaction["fixed"]
    date: Date
}

export type TransactionsCreateOutput = void

export type TransactionsUpdateInput = TransactionsCreateInput & Pick<Transaction, "id">

export type TransactionsUpdateOutput = void

export type TransactionsDeleteInput = Pick<Transaction, "id" | "user_id">

export type TransactionsDeleteOutput = void

export type TransactionsCreateData = Omit<Prisma.TransactionUncheckedCreateInput, "id" | "created_at">

export type TransactionsUpdateData = Prisma.TransactionUncheckedUpdateInput
