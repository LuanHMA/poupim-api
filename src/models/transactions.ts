export interface Transactions {
    id: number;
    description: string
    amount: number;
    type: "INCOME" | "EXPENSE";
    category_id: number;
    userId: number;
    createdAt: string
}

export type TransactionCreate = Omit<Transactions, "id" | "createdAt">

export type TransactionUpdate = Omit<Transactions, "createdAt" | "id" | "userId">

export type TransactionDelete = Pick<Transactions, "id" | "userId">