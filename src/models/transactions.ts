export interface Transactions {
    id: number;
    description: string
    amount: number;
    type: "INCOME" | "EXPENSE";
    category_id: number;
    user_id: number;
    created_at: string
}

export type TransactionCreate = Omit<Transactions, "id" | "created_at">

export type TransactionUpdate = Omit<Transactions, "created_at" | "id" | "user_id">

export type TransactionDelete = Pick<Transactions, "id" | "user_id">