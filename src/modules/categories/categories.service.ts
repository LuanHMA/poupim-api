import { CategoriesGetAllOutput } from "./categories.contracts";
import { CategoriesRepository } from "./categories.repository";

export class CategoriesService {
    constructor(private categoriesRepository: CategoriesRepository) { }

    async getAll(): Promise<CategoriesGetAllOutput> {
        return this.categoriesRepository.findAll()
    }
}
