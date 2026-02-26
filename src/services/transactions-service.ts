import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database";
import { TransactionCreate, TransactionDelete, Transactions, TransactionUpdate } from "../models/transactions";
import { NotFoundError } from "../errors/domain-errors";

export class TransactionsService {
    async getAll(userId: Transactions["userId"]) {
        const query = `
            SELECT 
                t.id,
                t.description,
                t.amount,
                t.type,
                c.name AS category_name,
                t.created_at
            FROM transactions t
            INNER JOIN categories c ON c.id = t.category_id
            WHERE t.user_id = ?
        `

        const [transactions] = await db.execute<RowDataPacket[]>(query, [userId])

        return transactions
    }

    async create({ amount, category_id, description, type, userId }: TransactionCreate) {
        await db.execute<ResultSetHeader>(
            "INSERT INTO transactions (amount, category_id, description, type, user_id) VALUES(?,?,?,?,?)",
            [amount, category_id, description, type, userId]
        )
    }

    async update({ userId, id, transaction }: { userId: Transactions["userId"], id: Transactions["id"], transaction: TransactionUpdate }) {
        const [transacations] = await db.execute<RowDataPacket[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, userId])

        if (transacations.length === 0) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        const fields = Object.keys(transaction).map(key => `${key} = ?`).join(', ');
        const values = Object.values(transaction);

        await db.execute<ResultSetHeader>(`UPDATE transactions SET ${fields} WHERE id = ?`, [...values, id])
    }

    async delete({ id, userId }: TransactionDelete) {
        const [transactions] = await db.execute<RowDataPacket[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, userId])

        if (transactions.length === 0) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        await db.execute<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [id])
    }
}