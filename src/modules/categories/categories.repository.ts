import { Prisma } from "../../config/generated/prisma/client";
import { prisma } from "../../config/prisma";
import { ConflictError } from "../../errors/domain-errors";
import { Category, CategoriesCreateInput, CategoriesDeleteInput, CategoriesUpdateInput } from "./categories.contracts";

export class CategoriesRepository {
    async findAllByUserId({ user_id }: Pick<Category, "user_id">) {
        return prisma.category.findMany({
            where: { user_id },
        })
    }

    async findByIdAndUserId({ id, user_id }: CategoriesDeleteInput) {
        return prisma.category.findFirst({
            where: { id, user_id },
        })
    }

    async create({ name, user_id, icon, color }: CategoriesCreateInput) {
        await prisma.category.create({
            data: { name, user_id, icon, color },
        })
    }

    async update({ id, name, icon, color }: Pick<CategoriesUpdateInput, "id" | "name" | "icon" | "color">) {
        await prisma.category.update({
            where: { id },
            data: { name, icon, color },
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
