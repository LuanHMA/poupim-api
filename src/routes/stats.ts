import { FastifyInstance } from "fastify";
import { StatsController } from "../controllers/stats-controller";
import { overviewSchemaDoc, transactionsSummarySchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";

export async function statsRoutes(app: FastifyInstance) {
    const statsController = new StatsController()

    app.addHook("preHandler", AuthMiddleware)

    app.get("/summary", { schema: transactionsSummarySchema }, statsController.getTransactionsSummary.bind(statsController))
    app.get("/overview", { schema: overviewSchemaDoc }, statsController.getOverview.bind(statsController))
}
