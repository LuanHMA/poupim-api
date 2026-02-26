export interface TransactionSummary {
    total_income: number
    total_expense: number
    balance: number
}

export interface CreateTransactionSummary {
    month: number
    year: number
    user_id: number
}