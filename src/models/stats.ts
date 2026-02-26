export interface TransactionSummary {
    total_income: number
    total_expense: number
    balance: number
}

export interface BasesStats {
    total_income: number,
    total_expense: number,
    balance: number,
    transactions_total: number,
    highest_expense: number,
    average_daily_expense: number
}

export interface CategoryStats {
    category: string,
    total_amount: number,
    percentage: number
}

export interface CreateStats {
    month: number
    year: number
    user_id: number
}