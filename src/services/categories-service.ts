import { db } from './../config/database';
import { Categories, CategoryCreate, CategoryDelete, CategoryUpdate } from "../models/categories"
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { NotFoundError } from '../errors/domain-errors';

export class CategoriesService {
    async getAll(user_id: Categories["user_id"]) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE user_id = ?", [user_id])
        return categories
    }

    async create({ name, user_id, type }: CategoryCreate) {
        await db.execute<ResultSetHeader>("INSERT INTO categories (name, user_id, type) VALUES (?, ?, ?)", [name, user_id, type])
    }

    async update({ name, id, user_id, type }: CategoryUpdate) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE id = ? AND user_id = ?", [id, user_id])

        if (categories.length === 0) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await db.execute<ResultSetHeader>("UPDATE categories SET name = ?, type = ? WHERE id = ?", [name, type, id])
    }

    async delete({ id, user_id }: CategoryDelete) {
        const [categories] = await db.execute<RowDataPacket[]>("SELECT * FROM categories WHERE id = ? AND user_id = ?", [id, user_id])

        if (categories.length === 0) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await db.execute<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id])
    }
}