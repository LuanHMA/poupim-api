import { FastifyInstance } from "fastify";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { TransactionsController } from "../controllers/transactions-controller";

export async function transactionsRoutes(app: FastifyInstance) {
    const transactionController = new TransactionsController()

    app.addHook("preHandler", AuthMiddleware)
    app.get("/", transactionController.getAll.bind(transactionController))
    app.post("/", transactionController.create.bind(transactionController))
    app.put("/", transactionController.update.bind(transactionController))
    app.delete("/", transactionController.delete.bind(transactionController))
}