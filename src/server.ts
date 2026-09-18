import fastifyJwt from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import "dotenv/config"
import fastify from "fastify"
import { env } from "./config/env"
import { prisma } from "./config/prisma"
import { healthSchema } from "./docs/route-schemas"
import { swaggerOptions, swaggerUiOptions } from "./docs/swagger"
import { globalErrorHandler } from "./errors/global-error"
import { authRoutes } from "./routes/auth-routes"
import { categoriesRoutes } from "./routes/categories-routes"
import { statsRoutes } from "./routes/stats"
import { transactionsRoutes } from "./routes/transactions-routes"

const app = fastify()

app.setErrorHandler(globalErrorHandler)

app.setValidatorCompiler(() => (data) => ({ value: data }))
app.setSerializerCompiler(() => (data) => JSON.stringify(data))

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
        expiresIn: "7d",
    },
})
app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, swaggerUiOptions)

app.register(async (app) => {
    app.get("/", { schema: healthSchema }, (_, res) => {
        return res.send("Api is running")
    })
})

app.register(categoriesRoutes, { prefix: "/api/category" })
app.register(transactionsRoutes, { prefix: "/api/transactions" })
app.register(authRoutes, { prefix: "/api/auth" })
app.register(statsRoutes, { prefix: "/api/stats" })

app.addHook("onClose", async () => {
    await prisma.$disconnect()
})

app.listen({
    port: 3000,
}).then(() => console.log("Server is running on port 3000"))
