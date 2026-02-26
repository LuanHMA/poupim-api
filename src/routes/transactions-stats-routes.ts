import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middleware/auth-middleware";

export async function transactionStatsRoutes(app: FastifyInstance) {
    app.addHook("preHandler", AuthMiddleware)

}