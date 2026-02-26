import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { TransactionsStatsService } from "../services/transactions-stats-service"

export class TransactionStatsController {
    private transactionStatsService = new TransactionsStatsService()

    async getTransactionsSummary(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

        const querySchema = z.object({
            month: z
                .coerce.number("Insira um mês válido")
                .optional()
                .refine((value) => value && value >= 1 && value <= 12, "O mês deve estar entre 1 e 12"),
            year: z
                .coerce.number("Insira um ano valido")
                .optional()
        })

        const { month, year } = querySchema.parse(request.query)

        console.log(month, year)

        const summary = await this.transactionStatsService.getTransactionsSummary({
            month: month ?? new Date().getMonth() + 1,
            year: year ?? new Date().getFullYear(),
            user_id
        })

        return reply.status(200).send({ message: "Resumo das transações buscadas com sucesso", success: true, summary })

    }
}