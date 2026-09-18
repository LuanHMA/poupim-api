import { FastifyInstance } from "fastify";
import { loginSchema, meSchema, registerSchema } from "../../docs/route-schemas";
import { AuthMiddleware } from "../../middleware/auth-middleware";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController(
        new AuthService(new AuthRepository()),
    )

    app.post("/register", { schema: registerSchema }, authController.register.bind(authController))
    app.post("/login", { schema: loginSchema }, authController.login.bind(authController))
    app.get("/me", { schema: meSchema, preHandler: [AuthMiddleware] }, authController.me.bind(authController))
}
