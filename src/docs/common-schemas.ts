export const transactionTypeSchema = {
    type: "string",
    enum: ["INCOME", "EXPENSE"] as string[],
    description: "Tipo da movimentação: receita (INCOME) ou despesa (EXPENSE)",
}

export const errorResponseSchema = {
    type: "object",
    properties: {
        success: { type: "boolean", example: false },
        message: { type: "string", example: "Dados de entrada inválidos. Verifique os detalhes." },
        details: {
            description: "Detalhes extras do erro, quando disponíveis",
            nullable: true,
            example: [{ field: "email", message: "Email inválido" }],
        },
    },
}

export const validationErrorResponse = {
    description: "Dados de entrada inválidos",
    ...errorResponseSchema,
}

export const unauthorizedErrorResponse = {
    description: "Token ausente, malformado ou inválido",
    ...errorResponseSchema,
}

export const notFoundErrorResponse = {
    description: "Recurso não encontrado",
    ...errorResponseSchema,
}

export const conflictErrorResponse = {
    description: "Conflito com um recurso já existente",
    ...errorResponseSchema,
}

export const internalErrorResponse = {
    description: "Erro interno do servidor",
    ...errorResponseSchema,
}

export const bearerSecurity = [{ bearerAuth: [] }]

export const userSchema = {
    type: "object",
    properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Luan Silva" },
        email: { type: "string", format: "email", example: "luan@email.com" },
        created_at: { type: "string", format: "date-time", example: "2026-03-18T12:00:00.000Z" },
    },
}

export const categorySchema = {
    type: "object",
    properties: {
        id: { type: "integer", example: 1 },
        name: { type: "string", example: "Alimentação" },
        type: transactionTypeSchema,
        user_id: { type: "integer", example: 1 },
        created_at: { type: "string", format: "date-time", example: "2026-03-18T12:00:00.000Z" },
    },
}

export const transactionSchema = {
    type: "object",
    properties: {
        id: { type: "integer", example: 10 },
        description: { type: "string", example: "Supermercado" },
        amount: { type: "number", example: 150.9 },
        type: transactionTypeSchema,
        category_name: { type: "string", example: "Alimentação" },
        created_at: { type: "string", format: "date-time", example: "2026-03-18T12:00:00.000Z" },
    },
}

export const cashFlowSchema = {
    type: "object",
    properties: {
        total_income: { type: "number", example: 5000 },
        total_expense: { type: "number", example: 2300.5 },
        balance: { type: "number", example: 2699.5 },
    },
}

export const basesStatsSchema = {
    type: "object",
    properties: {
        total_income: { type: "number", example: 5000 },
        total_expense: { type: "number", example: 2300.5 },
        balance: { type: "number", example: 2699.5 },
        transactions_total: { type: "integer", example: 18 },
        highest_expense: { type: "number", example: 890 },
        average_daily_expense: { type: "number", example: 76.68 },
    },
}

export const categoryStatsSchema = {
    type: "object",
    properties: {
        category: { type: "string", example: "Alimentação" },
        total_amount: { type: "number", example: 890.5 },
        percentage: { type: "number", example: 38.71 },
    },
}

const insightTypeSchema = {
    type: "string",
    enum: ["positive", "neutral", "warning", "info"] as string[],
}

export const monthInsightsSchema = {
    type: "object",
    properties: {
        savingsPerformance: {
            type: "object",
            properties: {
                id: { type: "string", example: "savingsPerformance" },
                question: { type: "string", example: "Eu economizei ou gastei mais do que ganhei? (R$)" },
                type: insightTypeSchema,
                value: { type: "number", example: 2699.5 },
            },
        },
        expenseRatio: {
            type: "object",
            properties: {
                id: { type: "string", example: "expenseRatio" },
                question: { type: "string", example: "Quanto da minha renda eu utilizei este mês? (%)" },
                type: insightTypeSchema,
                value: { type: "number", example: 46.01 },
            },
        },
        topExpenseCategory: {
            type: "object",
            nullable: true,
            properties: {
                id: { type: "string", example: "topExpenseCategory" },
                question: { type: "string", example: "Onde eu mais gastei dinheiro este mês?" },
                type: { type: "string", example: "info" },
                category: { type: "string", example: "Alimentação" },
                value: { type: "number", example: 890.5 },
            },
        },
        spendingFrequency: {
            type: "object",
            properties: {
                id: { type: "string", example: "spendingFrequency" },
                question: { type: "string", example: "Com que frequência eu movimentei dinheiro este mês? (Dias)" },
                type: insightTypeSchema,
                total_transactions: { type: "integer", example: 18 },
                transactions_per_day: { type: "number", example: 0.58 },
            },
        },
        averageDailySpending: {
            type: "object",
            properties: {
                id: { type: "string", example: "averageDailySpending" },
                question: { type: "string", example: "Quanto eu gasto por dia, em média? (R$)" },
                type: { type: "string", example: "info" },
                value: { type: "number", example: 76.68 },
            },
        },
    },
}

export const overviewSchema = {
    type: "object",
    properties: {
        basesStats: basesStatsSchema,
        categoryStats: {
            type: "array",
            items: categoryStatsSchema,
        },
        month_insights: monthInsightsSchema,
    },
}

export const periodSchema = {
    type: "object",
    properties: {
        month: { type: "integer", minimum: 1, maximum: 12, example: 3 },
        year: { type: "integer", example: 2026 },
    },
}

export const statsQuerySchema = {
    type: "object",
    properties: {
        month: {
            type: "integer",
            minimum: 1,
            maximum: 12,
            description: "Mês de referência (1-12). Se omitido, usa o mês atual.",
            example: 3,
        },
        year: {
            type: "integer",
            description: "Ano de referência. Se omitido, usa o ano atual.",
            example: 2026,
        },
    },
}
