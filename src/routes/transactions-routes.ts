import { FastifyInstance } from "fastify";
import { TransactionsController } from "../controllers/transactions-controller";
import { createTransactionSchema, deleteTransactionSchema, listTransactionsSchema, updateTransactionSchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";

export async function transactionsRoutes(app: FastifyInstance) {
    const transactionController = new TransactionsController()

    app.addHook("preHandler", AuthMiddleware)
    app.get("/", { schema: listTransactionsSchema }, transactionController.getAll.bind(transactionController))
    app.post("/", { schema: createTransactionSchema }, transactionController.create.bind(transactionController))
    app.put("/", { schema: updateTransactionSchema }, transactionController.update.bind(transactionController))
    app.delete("/", { schema: deleteTransactionSchema }, transactionController.delete.bind(transactionController))
}
