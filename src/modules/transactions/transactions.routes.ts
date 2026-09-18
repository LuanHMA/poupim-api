import { FastifyInstance } from "fastify";
import { createTransactionSchema, deleteTransactionSchema, listTransactionsSchema, updateTransactionSchema } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { CategoriesRepository } from "../categories/categories.repository";
import { TransactionsController } from "./transactions.controller";
import { TransactionsRepository } from "./transactions.repository";
import { TransactionsService } from "./transactions.service";

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
