import { FastifyInstance } from "fastify";
import { StatsController } from "../controllers/stats-controller";
import { overviewSchemaDoc, transactionsSummarySchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { StatsRepository } from "../repository/stats-repository";
import { StatsService } from "../services/stats-service";

export async function statsRoutes(app: FastifyInstance) {
    const statsController = new StatsController(
        new StatsService(new StatsRepository()),
    )

    app.addHook("preHandler", AuthMiddleware)

    app.get("/summary", { schema: transactionsSummarySchema }, statsController.getTransactionsSummary.bind(statsController))
    app.get("/overview", { schema: overviewSchemaDoc }, statsController.getOverview.bind(statsController))
}
