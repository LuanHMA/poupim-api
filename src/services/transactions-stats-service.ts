import { RowDataPacket } from "mysql2/promise"
import { db } from "../config/database"
import { CreateTransactionSummary } from "../models/transactions-stats"

export class TransactionsStatsService {
    async getTransactionsSummary({ month, year, user_id }: CreateTransactionSummary) {
        const query = `
            SELECT 
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_income,
                SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS total_expense,
                SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) AS balance
            FROM transactions
            WHERE user_id = ? AND MONTH(created_at) = ? AND YEAR (created_at) = ?
        `

        const [transactionsSummary] = await db.execute<RowDataPacket[]>(query, [user_id, month, year])
        return transactionsSummary[0]
    }
}