import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth/auth.routes";
import { categoriesRoutes } from "./categories/categories.routes";
import { statsRoutes } from "./stats/stats.routes";
import { transactionsRoutes } from "./transactions/transactions.routes";

export function routes(app: FastifyInstance) {
    app.register(fastifySwaggerUi, {
        routePrefix: "/docs"
    })

    app.register(categoriesRoutes, { prefix: "/categories" })
    app.register(transactionsRoutes, { prefix: "/transactions" })
    app.register(authRoutes, { prefix: "/auth" })
    app.register(statsRoutes, { prefix: "/stats" })
}
