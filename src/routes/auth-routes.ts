import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth-controller";
import { loginSchema, meSchema, registerSchema } from "../docs/route-schemas";
import { AuthMiddleware } from "../middleware/auth-middleware";

export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController()

    app.post("/register", { schema: registerSchema }, authController.register.bind(authController))
    app.post("/login", { schema: loginSchema }, authController.login.bind(authController))
    app.get("/me", { schema: meSchema, preHandler: [AuthMiddleware] }, authController.me.bind(authController))
}
