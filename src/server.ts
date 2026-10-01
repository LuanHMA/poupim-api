import { app } from "./app"
import { env } from "./config/env"

const port = env.PORT ?? 3333

app.listen({
    port,
    host: "0.0.0.0",
}).then(() => console.log("Server is running on port " + port))
