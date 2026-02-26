import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriesService } from "../services/categories-service";
import { UnauthorizedError } from "../errors/domain-errors";

export class CategoriesController {
    private categoriesService = new CategoriesService()

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request

        if (!userId) {
            throw new UnauthorizedError()
        }

        const categories = await this.categoriesService.getAll(userId)

        return reply.status(200).send({ message: 'Categorias buscadas com sucesso!', categories })
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request

        if (!userId) {
            throw new UnauthorizedError()
        }

        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .max(100, "Máximo de caracteres excedido")
                .min(1, "O nome da categoria é obrigatório")
        })

        const { name } = bodySchema.parse(request.body)

        await this.categoriesService.create({ name, userId })

        return reply.status(201).send({ message: "Categoria criada com sucesso!" })
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request

        if (!userId) {
            throw new UnauthorizedError()
        }

        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .max(100, "Máximo de caracteres excedido")
                .min(1, "O nome da categoria é obrigatório"),
            categoryId: z
                .number("Insira um ID válido")
                .min(1, "O ID é obrigátorio"),
        })

        const { name, categoryId } = bodySchema.parse(request.body)

        await this.categoriesService.update({ name, userId, id: categoryId })

        return reply.status(200).send({ message: "Categoria atualizada com sucesso!" })
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request

        if (!userId) {
            throw new UnauthorizedError()
        }

        const bodySchema = z.object({
            categoryId: z
                .number("Insira um ID válido")
                .min(1, "O ID é obrigátorio"),
        })

        const { categoryId } = bodySchema.parse(request.body)

        await this.categoriesService.delete({ id: categoryId, userId })

        return reply.status(200).send({ message: "Categoria deletada com sucesso!" })
    }
}