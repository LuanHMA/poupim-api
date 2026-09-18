import type { SwaggerOptions } from "@fastify/swagger"
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui"
import {
    basesStatsSchema,
    categorySchema,
    categoryStatsSchema,
    errorResponseSchema,
    monthInsightsSchema,
    overviewSchema,
    transactionSchema,
    transactionSummarySchema,
    userSchema,
} from "./common-schemas"

export const swaggerOptions = {
    openapi: {
        info: {
            title: "Gerenciador de Despesas API",
            description: "API para gerenciamento de despesas pessoais. Endpoints autenticados exigem Bearer JWT.",
            version: "1.0.0",
        },
        tags: [
            { name: "Health", description: "Status da API" },
            { name: "Auth", description: "Cadastro, login e dados do usuário autenticado" },
            { name: "Categories", description: "Categorias de receitas e despesas" },
            { name: "Transactions", description: "Lançamentos financeiros" },
            { name: "Stats", description: "Resumos, overview e insights do período" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http" as const,
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Informe o token JWT no formato: Bearer {token}",
                },
            },
            schemas: {
                ErrorResponse: errorResponseSchema,
                User: userSchema,
                Category: categorySchema,
                Transaction: transactionSchema,
                TransactionSummary: transactionSummarySchema,
                BasesStats: basesStatsSchema,
                CategoryStats: categoryStatsSchema,
                MonthInsights: monthInsightsSchema,
                Overview: overviewSchema,
            },
        },
    },
} as SwaggerOptions

export const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list" as const,
        persistAuthorization: true,
        tagsSorter: "alpha" as const,
    },
}
