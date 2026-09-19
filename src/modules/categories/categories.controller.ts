import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { }

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
            icon: z
                .string("Insira um ícone válido")
                .max(64, "Máximo de caracteres excedido")
                .min(1, "O ícone da categoria é obrigatório"),
            color: z
                .string("Insira uma cor válida")
                .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve estar no formato hexadecimal (#RRGGBB)"),
        })

        const { name, icon, color } = bodySchema.parse(request.body)

        await this.categoriesService.create({ name, icon, color, user_id: id })

        return reply.status(201).send({ message: "Categoria criada com sucesso!" })
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id: user_id } = request.user

        const paramsSchema = z.object({
            id: z.coerce.number("Insira um ID válido").min(1, "O ID é obrigatório"),
        })

        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .max(100, "Máximo de caracteres excedido")
                .min(1, "O nome da categoria é obrigatório"),
            icon: z
                .string("Insira um ícone válido")
                .max(64, "Máximo de caracteres excedido")
                .min(1, "O ícone da categoria é obrigatório"),
            color: z
                .string("Insira uma cor válida")
                .regex(/^#[0-9A-Fa-f]{6}$/, "A cor deve estar no formato hexadecimal (#RRGGBB)"),
        })

        const { id } = paramsSchema.parse(request.params)
        const { name, icon, color } = bodySchema.parse(request.body)

        await this.categoriesService.update({ name, icon, color, id, user_id })

        return reply.status(200).send({ message: "Categoria atualizada com sucesso!" })
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id: user_id } = request.user

        const paramsSchema = z.object({
            id: z.coerce.number("Insira um ID válido").min(1, "O ID é obrigatório"),
        })

        const { id } = paramsSchema.parse(request.params)

        await this.categoriesService.delete({ id, user_id })

        return reply.status(200).send({ message: "Categoria deletada com sucesso!" })
    }
}
