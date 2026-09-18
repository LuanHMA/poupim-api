import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
	schema: "src/config/schema.prisma",
	migrations: {
		path: "src/config/migrations",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
