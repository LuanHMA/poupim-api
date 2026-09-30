import { Prisma, Transaction } from "../../config/generated/prisma/client"

export type { Transaction }

export type TransactionsGetAllInput = {
    user_id: Transaction["user_id"]
    month: Transaction["month"]
    year: Transaction["year"]
    page: number
    limit: number
    type?: Transaction["type"]
    category_id?: Transaction["category_id"]
    status?: Transaction["status"]
    search?: string
}

export type TransactionsGetAllOutput = {
    transactions: {
        id: Transaction["id"]
        description: Transaction["description"]
        amount: number
        type: Transaction["type"]
        category: {
            id: number | null
            name: string | null
            color: string | null
            icon: string | null
        }
        created_at: Transaction["created_at"]
        month: Transaction["month"]
        year: Transaction["year"]
        status: Transaction["status"]
        ignore: Transaction["ignore"]
        fixed: Transaction["fixed"]
        observation: Transaction["observation"]
    }[]
    pagination: {
        page: number
        limit: number
        total: number
        total_pages: number
    }
}

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
