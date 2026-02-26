import { db } from './../config/database';
import { Categories, CategoryCreate, CategoryDelete, CategoryUpdate } from "../models/categories"
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NotFoundError } from '../errors/domain-errors';

export class CategoriesService {
    async getAll(userId: Categories["userId"]) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE user_id = ?", [userId])
        return categories
    }

    async create({ name, userId }: CategoryCreate) {
        await db.execute<ResultSetHeader>("INSERT INTO categories (name, user_id) VALUES (?, ?)", [name, userId])
    }

    async update({ name, id, userId }: CategoryUpdate) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE id = ? AND user_id = ?", [id, userId])

        if (categories.length === 0) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await db.execute<ResultSetHeader>("UPDATE categories SET name = ? WHERE id = ?", [name, id])
    }

    async delete({ id, userId }: CategoryDelete) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE id = ? AND user_id = ?", [id, userId])

        if (categories.length === 0) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await db.execute<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id])
    }
}