import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { TransactionsController } from "../controllers/transactions-controller";
import { TransactionStatsController } from "../controllers/transaction-stats-controller";

export async function transactionsRoutes(app: FastifyInstance) {
    const transactionController = new TransactionsController()
    const transactionStatsController = new TransactionStatsController()

    app.addHook("preHandler", AuthMiddleware)
    app.get("/", transactionController.getAll.bind(transactionController))
    app.post("/", transactionController.create.bind(transactionController))
    app.put("/", transactionController.update.bind(transactionController))
    app.delete("/", transactionController.delete.bind(transactionController))

    app.get("/summary", transactionStatsController.getTransactionsSummary.bind(transactionStatsController))
}