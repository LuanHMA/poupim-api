import { CategoriesController } from '../controllers/categories-controller';
import { FastifyInstance } from "fastify";
import { AuthMiddleware } from '../middleware/auth-middleware';

export async function categoriesRoutes(app: FastifyInstance) {
    const categoriesController = new CategoriesController()

    app.addHook(`preHandler`, AuthMiddleware)
    app.post("/", categoriesController.create.bind(categoriesController))
    app.get("/", categoriesController.getAll.bind(categoriesController))
    app.delete("/", categoriesController.delete.bind(categoriesController))
    app.put("/", categoriesController.update.bind(categoriesController))
}