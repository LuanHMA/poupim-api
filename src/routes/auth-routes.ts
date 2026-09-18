import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth-controller";
import { loginSchema, meSchema, registerSchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { AuthRepository } from "../repository/auth-repository";
import { AuthService } from "../services/auth-service";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController(
        new AuthService(new AuthRepository()),
    )

    app.post("/register", { schema: registerSchema }, authController.register.bind(authController))
    app.post("/login", { schema: loginSchema }, authController.login.bind(authController))
    app.get("/me", { schema: meSchema, preHandler: [AuthMiddleware] }, authController.me.bind(authController))
}
