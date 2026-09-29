import { prisma } from "../../config/prisma";
import { CategoriesGetAllOutput } from "./categories.contracts";

export class CategoriesRepository {
    async findAll(): Promise<CategoriesGetAllOutput> {
        return prisma.category.findMany({
            orderBy: { name: "asc" },
        })
    }

    async findById(id: number) {
        return prisma.category.findUnique({
            where: { id },
        })
    }
}
