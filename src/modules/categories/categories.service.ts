import { NotFoundError } from "../../errors/domain-errors";
import {
    CategoriesCreateInput,
    CategoriesCreateOutput,
    CategoriesDeleteInput,
    CategoriesDeleteOutput,
    CategoriesGetAllInput,
    CategoriesGetAllOutput,
    CategoriesUpdateInput,
    CategoriesUpdateOutput,
} from "./categories.contracts";
import { CategoriesRepository } from "./categories.repository";

export class CategoriesService {
    constructor(private categoriesRepository: CategoriesRepository) {}

    async getAll({ user_id }: CategoriesGetAllInput): Promise<CategoriesGetAllOutput> {
        return this.categoriesRepository.findAllByUserId({ user_id })
    }

    async create({ name, user_id, type }: CategoriesCreateInput): Promise<CategoriesCreateOutput> {
        await this.categoriesRepository.create({ name, user_id, type })
    }

    async update({ name, id, user_id, type }: CategoriesUpdateInput): Promise<CategoriesUpdateOutput> {
        const category = await this.categoriesRepository.findByIdAndUserId({ id, user_id })

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await this.categoriesRepository.update({ id, name, type })
    }

    async delete({ id, user_id }: CategoriesDeleteInput): Promise<CategoriesDeleteOutput> {
        const category = await this.categoriesRepository.findByIdAndUserId({ id, user_id })

        if (!category) {
            throw new NotFoundError("Não existe nenhuma categoria com esse ID")
        }

        await this.categoriesRepository.delete({ id })
    }
}
