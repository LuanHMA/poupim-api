import { FastifyReply, FastifyRequest } from "fastify"
import z from "zod"
import { AppDate } from "../../utils/app-date"
import { ReportsService } from "./reports.service"

const monthYearQuerySchema = z.object({
    month: z
        .coerce.number("Insira um mês válido")
        .optional()
        .refine((value) => value && value >= 1 && value <= 12, "O mês deve estar entre 1 e 12"),
    year: z
        .coerce.number("Insira um ano valido")
        .optional()
})

export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    async getBasesStats(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)
        const currentPeriod = AppDate.currentPeriod()

        const basesStats = await this.reportsService.getBasesStats({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Estatísticas base buscadas com sucesso", success: true, basesStats })
    }

    async getMonthInsights(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.user

        const { month, year } = monthYearQuerySchema.parse(request.query)
        const currentPeriod = AppDate.currentPeriod()

        const monthInsights = await this.reportsService.getMonthInsights({
            month: month ?? currentPeriod.month,
            year: year ?? currentPeriod.year,
            user_id: id
        })

        return reply.status(200).send({ message: "Insights do mês buscados com sucesso", success: true, monthInsights })
    }
}
