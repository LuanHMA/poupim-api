import fastifyCors from "@fastify/cors"
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
import { routes } from "./modules"

const app = fastify()
const port = env.PORT ?? 3333

app.setErrorHandler(globalErrorHandler)

app.setValidatorCompiler(() => (data) => ({ value: data }))
app.setSerializerCompiler(() => (data) => JSON.stringify(data))

app.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
})

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

app.register(routes, { prefix: "/api" })

app.addHook("onClose", async () => {
    await prisma.$disconnect()
})

app.listen({
    port,
    host: "0.0.0.0",
}).then(() => console.log("Server is running on port " + port))
