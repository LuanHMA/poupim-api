import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database";
import { TransactionCreate, TransactionDelete, Transactions, TransactionUpdate } from "../models/transactions";
import { NotFoundError } from "../errors/domain-errors";

export class TransactionsService {
    async getAll(user_id: Transactions["user_id"]) {
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

        const [transactions] = await db.execute<RowDataPacket[]>(query, [user_id])

        return transactions
    }

    async create({ amount, category_id, description, type, user_id }: TransactionCreate) {
        await db.execute<ResultSetHeader>(
            "INSERT INTO transactions (amount, category_id, description, type, user_id) VALUES(?,?,?,?,?)",
            [amount, category_id, description, type, user_id]
        )
    }

    async update({ user_id, id, transaction }: { user_id: Transactions["user_id"], id: Transactions["id"], transaction: TransactionUpdate }) {
        const [transacations] = await db.execute<RowDataPacket[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, user_id])

        if (transacations.length === 0) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        const fields = Object.keys(transaction).map(key => `${key} = ?`).join(', ');
        const values = Object.values(transaction);

        await db.execute<ResultSetHeader>(`UPDATE transactions SET ${fields} WHERE id = ?`, [...values, id])
    }

    async delete({ id, user_id }: TransactionDelete) {
        const [transactions] = await db.execute<RowDataPacket[]>("SELECT * FROM transactions WHERE id = ? AND user_id = ?", [id, user_id])

        if (transactions.length === 0) {
            throw new NotFoundError("Não existe nenhuma transação com esse ID")
        }

        await db.execute<ResultSetHeader>('DELETE FROM transactions WHERE id = ?', [id])
    }
}