import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth-controller";
import { AuthMiddleware } from "../middleware/auth-middleware";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController()

    app.post("/register", authController.register.bind(authController))
    app.post("/login", authController.login.bind(authController))
    app.get("/me", { preHandler: [AuthMiddleware] }, authController.me.bind(authController))
}