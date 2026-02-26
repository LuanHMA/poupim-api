import "dotenv/config"
import fastify from "fastify"
import { categoriesRoutes } from "./routes/categories-routes"
import { transactionsRoutes } from "./routes/transactions-routes"
import { globalErrorHandler } from "./errors/global-error"
import { authRoutes } from "./routes/auth-routes"
import { statsRoutes } from "./routes/stats"

const app = fastify()
app.setErrorHandler(globalErrorHandler)

app.get("/", (_, res) => {
    return res.send("Api is running")
})

app.register(categoriesRoutes, { prefix: "/api/category" })
app.register(transactionsRoutes, { prefix: "/api/transactions" })
app.register(authRoutes, { prefix: "/api/auth" })
app.register(statsRoutes, { prefix: "/api/stats" })

app.listen({
    port: 3000,
}).then(() => console.log("Server is running on port 3000"))