import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { TransactionsService } from "./transactions.service";

export class TransactionsController {
    constructor(private transactionService: TransactionsService) {}

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const querySchema = z.object({
            date: z.date("Insira uma data válida")
        })

        const { date } = querySchema.parse(request.query)

        const transactions = await this.transactionService.getAll({ user_id: id, date })

        return reply.status(200).send({ message: "Transações buscadas com sucesso", success: true, transactions })
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const bodySchema = z.object({
            description: z
                .string("Insira uma descrição válida")
                .min(1, "A descrição é obrigatória"),
            category_id: z
                .number("Insira um category_id válido")
                .min(1, "A categoria é obrigatória"),
            amount: z
                .number("Insira um amount válido")
                .refine((value) => value > 0, "O amount deve ser maior que zero"),
            type: z
                .enum(["INCOME", "EXPENSE"], "Insira um type válido")
        })

        const { description, category_id, amount, type } = bodySchema.parse(request.body)

        await this.transactionService.create({
            amount,
            category_id,
            description,
            type,
            user_id: id
        })

        return reply.status(201).send({ message: "Transação criada com sucesso", success: true })
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { id: user_id } = request.user

        const paramsSchema = z.object({
            id: z.coerce.number("Insira um ID válido").min(1, "O ID é obrigatório"),
        })

        const bodySchema = z.object({
            description: z
                .string("Insira uma descrição válida")
                .min(1, "A descrição é obrigatória"),
            category_id: z
                .number("Insira um category_id válido")
                .min(1, "A categoria é obrigatória"),
            amount: z
                .number("Insira um amount válido")
                .refine((value) => value > 0, "O amount deve ser maior que zero"),
            type: z
                .enum(["INCOME", "EXPENSE"], "Insira um type válido"),
        })

        const { id } = paramsSchema.parse(request.params)
        const { description, category_id, amount, type } = bodySchema.parse(request.body)

        await this.transactionService.update({
            id,
            user_id,
            transaction: {
                amount,
                category_id,
                description,
                type
            }
        })

        return reply.status(200).send({ message: "Transação atualizada com sucesso", success: true })
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id: user_id } = request.user

        const paramsSchema = z.object({
            id: z.coerce.number("Insira um ID válido").min(1, "O ID é obrigatório"),
        })

        const { id } = paramsSchema.parse(request.params)

        await this.transactionService.delete({ id, user_id })

        return reply.status(200).send({ message: "Transação deletada com sucesso!" })
    }
}
