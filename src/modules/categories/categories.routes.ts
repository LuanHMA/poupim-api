import { FastifyInstance } from "fastify";
import { createCategorySchema, deleteCategorySchema, listCategoriesSchema, updateCategorySchema } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { CategoriesController } from "./categories.controller";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";

export async function categoriesRoutes(app: FastifyInstance) {
    const categoriesController = new CategoriesController(
        new CategoriesService(new CategoriesRepository()),
    )

    app.addHook(`preHandler`, AuthMiddleware)
    app.post("/", { schema: createCategorySchema }, categoriesController.create.bind(categoriesController))
    app.get("/", { schema: listCategoriesSchema }, categoriesController.getAll.bind(categoriesController))
    app.delete("/:id", { schema: deleteCategorySchema }, categoriesController.delete.bind(categoriesController))
    app.put("/:id", { schema: updateCategorySchema }, categoriesController.update.bind(categoriesController))
}
