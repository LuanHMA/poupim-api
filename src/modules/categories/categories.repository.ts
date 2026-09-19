import { Prisma } from "../../config/generated/prisma/client";
import { prisma } from "../../config/prisma";
import { ConflictError } from "../../errors/domain-errors";
import {
    Category,
    CategoriesCreateData,
    CategoriesDeleteInput,
    CategoriesGetAllInput,
    CategoriesUpdateData,
} from "./categories.contracts";

export class CategoriesRepository {
    async findAllByUserId({ user_id }: CategoriesGetAllInput) {
        return prisma.category.findMany({
            where: { user_id },
        })
    }

    async findByIdAndUserId({ id, user_id }: CategoriesDeleteInput) {
        return prisma.category.findFirst({
            where: { id, user_id },
        })
    }

    async create(data: CategoriesCreateData) {
        await prisma.category.create({ data })
    }

    async update({ id, data }: { id: Category["id"], data: CategoriesUpdateData }) {
        await prisma.category.update({
            where: { id },
            data,
        })
    }

    async delete({ id }: Pick<Category, "id">) {
        try {
            await prisma.category.delete({
                where: { id },
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2003" || error.code === "P2014")) {
                throw new ConflictError("Não é possível excluir uma categoria que possui transações")
            }

            throw error
        }
    }
}
