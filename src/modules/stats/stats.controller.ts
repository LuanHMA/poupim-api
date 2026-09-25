import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { StatsService } from "./stats.service"

export class StatsController {
    constructor(private statsService: StatsService) {}

    async getCashFlow(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

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

        const cashFlow = await this.statsService.getCashFlow({
            month: month ?? new Date().getMonth() + 1,
            year: year ?? new Date().getFullYear(),
            user_id: id
        })

        return reply.status(200).send({ message: "Fluxo de saldo buscado com sucesso", success: true, cashFlow })

    }

    async getPeriods(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const periods = await this.statsService.getPeriods({ user_id: id })

        return reply.status(200).send({ message: "Períodos buscados com sucesso", success: true, periods })
    }

    async getOverview(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

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

        const overview = await this.statsService.getOverview({
            month: month ?? new Date().getMonth() + 1,
            year: year ?? new Date().getFullYear(),
            user_id: id
        })

        return reply.status(200).send({ message: "Overview das transações buscadas com sucesso", success: true, overview })
    }

    async getTopCategories(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

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

        const topCategories = await this.statsService.getTopCategories({
            month: month ?? new Date().getMonth() + 1,
            year: year ?? new Date().getFullYear(),
            user_id: id
        })

        return reply.status(200).send({ message: "Top categorias buscadas com sucesso", success: true, topCategories })
    }
}
