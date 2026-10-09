import { FastifyInstance } from "fastify";
import { cashFlowSchemaDoc, monthlyStatsSchemaDoc, periodsSchemaDoc, topExpenseCategoriesSchemaDoc } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { StatsController } from "./stats.controller";
import { StatsRepository } from "./stats.repository";
import { StatsService } from "./stats.service";

export async function statsRoutes(app: FastifyInstance) {
    const statsController = new StatsController(
        new StatsService(new StatsRepository()),
    )

    app.addHook("preHandler", AuthMiddleware)

    app.get("/cash-flow", { schema: cashFlowSchemaDoc }, statsController.getCashFlow.bind(statsController))
    app.get("/cash-per-day-rest", statsController.getCashPerDay.bind(statsController))
    app.get("/monthly", { schema: monthlyStatsSchemaDoc }, statsController.getMonthly.bind(statsController))
    app.get("/periods", { schema: periodsSchemaDoc }, statsController.getPeriods.bind(statsController))
    app.get("/top-expense-categories", { schema: topExpenseCategoriesSchemaDoc }, statsController.getTopExpenseCategories.bind(statsController))
}
