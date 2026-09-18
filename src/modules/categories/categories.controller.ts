import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const categories = await this.categoriesService.getAll({ user_id: id })

        return reply.status(200).send({ message: 'Categorias buscadas com sucesso!', categories })
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .max(100, "Máximo de caracteres excedido")
                .min(1, "O nome da categoria é obrigatório"),
            type: z
                .enum(["INCOME", "EXPENSE"], "Insira um type válido")
        })

        const { name, type } = bodySchema.parse(request.body)

        await this.categoriesService.create({ name, user_id: id, type })

        return reply.status(201).send({ message: "Categoria criada com sucesso!" })
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .max(100, "Máximo de caracteres excedido")
                .min(1, "O nome da categoria é obrigatório"),
            category_id: z
                .number("Insira um ID válido")
                .min(1, "O ID é obrigátorio"),
            type: z
                .enum(["INCOME", "EXPENSE"], "Insira um type válido")
        })

        const { name, category_id, type } = bodySchema.parse(request.body)

        await this.categoriesService.update({ name, id: category_id, user_id: id, type })

        return reply.status(200).send({ message: "Categoria atualizada com sucesso!" })
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const bodySchema = z.object({
            category_id: z
                .number("Insira um ID válido")
                .min(1, "O ID é obrigátorio"),
        })

        const { category_id } = bodySchema.parse(request.body)

        await this.categoriesService.delete({ id: category_id, user_id: id })

        return reply.status(200).send({ message: "Categoria deletada com sucesso!" })
    }
}
