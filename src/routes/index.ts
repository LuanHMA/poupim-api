import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth-routes";
import { categoriesRoutes } from "./categories-routes";
import { statsRoutes } from "./stats";
import { transactionsRoutes } from "./transactions-routes";

export function routes(app: FastifyInstance) {
    app.register(fastifySwaggerUi, {
        routePrefix: "/docs"
    })

    app.register(categoriesRoutes, { prefix: "/api/category" })
    app.register(transactionsRoutes, { prefix: "/api/transactions" })
    app.register(authRoutes, { prefix: "/api/auth" })
    app.register(statsRoutes, { prefix: "/api/stats" })

}