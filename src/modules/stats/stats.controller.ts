import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { AppDate } from "../../utils/app-date"
import { StatsService } from "./stats.service"

const monthYearQuerySchema = z.object({
    month: z
        .coerce.number("Insira um mês válido")
        .optional()
        .refine((value) => value && value >= 1 && value <= 12, "O mês deve estar entre 1 e 12"),
    year: z
        .coerce.number("Insira um ano valido")
        .optional()
})

export class StatsController {
    constructor(private statsService: StatsService) { }

    async getCashFlow(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)
        const currentPeriod = AppDate.currentPeriod()

        const cashFlow = await this.statsService.getCashFlow({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Fluxo de saldo buscado com sucesso", success: true, cashFlow })

    }

    async getPeriods(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const periods = await this.statsService.getPeriods({ user_id: id })

        return reply.status(200).send({ message: "Períodos buscados com sucesso", success: true, periods })
    }

    async getMonthly(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)

        const currentPeriod = AppDate.currentPeriod()

        const monthly = await this.statsService.getMonthly({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Estatísticas do mês buscadas com sucesso", success: true, monthly })
    }

    async getTopExpenseCategories(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)
        const currentPeriod = AppDate.currentPeriod()

        const topExpenseCategories = await this.statsService.getTopExpenseCategories({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Top categorias de despesa buscadas com sucesso", success: true, topExpenseCategories })
    }

    async getCashPerDay(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)
        const currentPeriod = AppDate.currentPeriod()

        const cashPerDay = await this.statsService.getCashPerDay({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Caixa por dia buscado com sucesso", success: true, cashPerDay })
    }

}
