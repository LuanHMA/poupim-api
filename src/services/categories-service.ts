import { NotFoundError } from "../errors/domain-errors";
import { Category, CategoryCreate, CategoryDelete, CategoryUpdate } from "../models/categories";
import { CategoriesRepository } from "../repository/categories-repository";

export class CategoriesService {
    constructor(private categoriesRepository: CategoriesRepository) {}

    async getAll(user_id: Category["user_id"]) {
        return this.categoriesRepository.findAllByUserId(user_id)
    }

    async create({ name, user_id, type }: CategoryCreate) {
        await this.categoriesRepository.create({ name, user_id, type })
    }

    async update({ name, id, user_id, type }: CategoryUpdate) {
        const category = await this.categoriesRepository.findByIdAndUserId({ id, user_id })

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await this.categoriesRepository.update({ id, name, type })
    }

    async delete({ id, user_id }: CategoryDelete) {
        const category = await this.categoriesRepository.findByIdAndUserId({ id, user_id })

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await this.categoriesRepository.delete(id)
    }
}
