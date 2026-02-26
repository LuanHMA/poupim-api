import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionsService } from "../services/transactions-service";
import z from "zod";

export class TransactionsController {
    private transactionService = new TransactionsService()

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

        const transactions = await this.transactionService.getAll(user_id)

        return reply.status(200).send({ message: "Transações buscadas com sucesso", success: true, transactions })
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

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
            category_id: category_id,
            description,
            type,
            user_id
        })

        return reply.status(201).send({ message: "Transação criada com sucesso", success: true })
    }

    async update(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

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
            transactionId: z
                .number("Insira um id válido")
                .min(1, "O id é obrigatório")
        })

        const { description, category_id, amount, type, transactionId } = bodySchema.parse(request.body)

        await this.transactionService.update({
            id: transactionId,
            user_id,
            transaction: {
                amount,
                category_id: category_id,
                description,
                type
            }
        })

        return reply.status(200).send({ message: "Transação atualizada com sucesso", success: true })
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

        const bodySchema = z.object({
            transactionId: z
                .number("Insira um ID válido")
                .min(1, "O ID é obrigátorio"),
        })

        const { transactionId } = bodySchema.parse(request.body)

        await this.transactionService.delete({ id: transactionId, user_id })

        return reply.status(200).send({ message: "Transação deletada com sucesso!" })
    }
}