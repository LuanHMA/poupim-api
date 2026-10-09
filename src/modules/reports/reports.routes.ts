import { FastifyInstance } from "fastify";
import { basesStatsSchemaDoc, monthInsightsSchemaDoc } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { ReportsController } from "./reports.controller";
import { ReportsRepository } from "./reports.repository";
import { ReportsService } from "./reports.service";

export async function reportsRoutes(app: FastifyInstance) {
    const reportsController = new ReportsController(
        new ReportsService(new ReportsRepository()),
    )

    app.addHook("preHandler", AuthMiddleware)

    app.get("/bases-stats", { schema: basesStatsSchemaDoc }, reportsController.getBasesStats.bind(reportsController))
    app.get("/month-insights", { schema: monthInsightsSchemaDoc }, reportsController.getMonthInsights.bind(reportsController))
}
