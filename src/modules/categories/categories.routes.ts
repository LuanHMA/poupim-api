import { FastifyInstance } from "fastify";
import { listCategoriesSchema } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";

export async function categoriesRoutes(app: FastifyInstance) {
    const categoriesController = new CategoriesController(
        new CategoriesService(new CategoriesRepository()),
    )

    app.addHook(`preHandler`, AuthMiddleware)
    app.get("/", { schema: listCategoriesSchema }, categoriesController.getAll.bind(categoriesController))
}
