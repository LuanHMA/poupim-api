import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { StatsController } from "../controllers/stats-controller";

export async function statsRoutes(app: FastifyInstance) {
    const statsController = new StatsController()

    app.addHook("preHandler", AuthMiddleware)

    app.get("/summary", statsController.getTransactionsSummary.bind(statsController))
    app.get("/overview", statsController.getOverview.bind(statsController))

}