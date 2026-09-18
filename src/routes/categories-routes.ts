import { FastifyInstance } from "fastify";
import { CategoriesController } from '../controllers/categories-controller';
import { createCategorySchema, deleteCategorySchema, listCategoriesSchema, updateCategorySchema } from "../docs/route-schemas";
import { AuthMiddleware } from '../middleware/auth-middleware';

export async function categoriesRoutes(app: FastifyInstance) {
    const categoriesController = new CategoriesController()

    app.addHook(`preHandler`, AuthMiddleware)
    app.post("/", { schema: createCategorySchema }, categoriesController.create.bind(categoriesController))
    app.get("/", { schema: listCategoriesSchema }, categoriesController.getAll.bind(categoriesController))
    app.delete("/", { schema: deleteCategorySchema }, categoriesController.delete.bind(categoriesController))
    app.put("/", { schema: updateCategorySchema }, categoriesController.update.bind(categoriesController))
}
