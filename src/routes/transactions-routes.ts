import { FastifyInstance } from "fastify";
import { TransactionsController } from "../controllers/transactions-controller";
import { createTransactionSchema, deleteTransactionSchema, listTransactionsSchema, updateTransactionSchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { CategoriesRepository } from "../repository/categories-repository";
import { TransactionsRepository } from "../repository/transactions-repository";
import { TransactionsService } from "../services/transactions-service";

export async function transactionsRoutes(app: FastifyInstance) {
    const transactionController = new TransactionsController(
        new TransactionsService(
            new TransactionsRepository(),
            new CategoriesRepository(),
        ),
    )

    app.addHook("preHandler", AuthMiddleware)
    app.get("/", { schema: listTransactionsSchema }, transactionController.getAll.bind(transactionController))
    app.post("/", { schema: createTransactionSchema }, transactionController.create.bind(transactionController))
    app.put("/", { schema: updateTransactionSchema }, transactionController.update.bind(transactionController))
    app.delete("/", { schema: deleteTransactionSchema }, transactionController.delete.bind(transactionController))
}
