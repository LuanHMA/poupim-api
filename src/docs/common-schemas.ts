export const transactionTypeSchema = {
    type: "string",
    enum: ["INCOME", "EXPENSE"] as string[],
    description: "Tipo da movimentação: receita (INCOME) ou despesa (EXPENSE)",
}

export const transactionStatusSchema = {
    type: "string",
    enum: ["PAID", "PENDING", "RECEIVED"] as string[],
    description: "Status da transação: pago (PAID), pendente (PENDING) ou recebido (RECEIVED)",
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
        icon: {
            type: "string",
            description: "Nome do ícone no Lucide",
            example: "utensils",
        },
        color: {
            type: "string",
            description: "Cor hexadecimal da categoria",
            example: "#F59E0B",
        },
        created_at: { type: "string", format: "date-time", example: "2026-03-18T12:00:00.000Z" },
    },
}

export const transactionSchema = {
    type: "object",
    properties: {
        id: { type: "integer", example: 10 },
        description: { type: "string", example: "Supermercado" },
        observation: { type: "string", example: "Compra da semana" },
        amount: { type: "number", example: 150.9 },
        type: transactionTypeSchema,
        status: transactionStatusSchema,
        ignore: {
            type: "boolean",
            description: "Marca a transação como ignorada. Os totais de estatísticas continuam incluindo essas transações.",
            example: false,
        },
        fixed: {
            type: "boolean",
            description: "Indica se a transação é fixa.",
            example: false,
        },
        transaction_date: {
            type: "string",
            format: "date-time",
            description: "Data e hora informadas pelo usuário para a transação. O month e o year são derivados dela no fuso da aplicação.",
            example: "2026-03-03T14:35:00.000Z",
        },
        month: { type: "integer", minimum: 1, maximum: 12, example: 3 },
        year: { type: "integer", example: 2026 },
        category: {
            type: "object",
            description: "Categoria da transação. Os campos ficam nulos quando a categoria não existe.",
            properties: {
                id: { type: "integer", nullable: true, example: 1 },
                name: { type: "string", nullable: true, example: "Alimentação" },
                color: {
                    type: "string",
                    nullable: true,
                    description: "Cor hexadecimal da categoria",
                    example: "#F59E0B",
                },
                icon: {
                    type: "string",
                    nullable: true,
                    description: "Nome do ícone no Lucide",
                    example: "utensils",
                },
            },
        },
        created_at: { type: "string", format: "date-time", example: "2026-03-18T12:00:00.000Z" },
    },
}

export const cashFlowSchema = {
    type: "object",
    properties: {
        month: { type: "integer", minimum: 1, maximum: 12, example: 3 },
        year: { type: "integer", example: 2026 },
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
    description: "Gasto de uma categoria de despesa no período. O percentual é a fatia sobre o total de despesas.",
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

const monthTotalsSchema = {
    type: "object",
    properties: {
        total_income: { type: "number", example: 5000 },
        total_expense: { type: "number", example: 2300.5 },
        balance: { type: "number", example: 2699.5 },
    },
}

const monthSnapshotSchema = {
    type: "object",
    properties: {
        month: { type: "integer", minimum: 1, maximum: 12, example: 3 },
        year: { type: "integer", example: 2026 },
        ...monthTotalsSchema.properties,
    },
}

export const monthlyStatsSchema = {
    type: "object",
    properties: {
        in_progress: {
            type: "boolean",
            description: "Verdadeiro quando o mês pedido ainda não terminou.",
            example: true,
        },
        has_transactions: {
            type: "boolean",
            description: "Falso quando o mês não tem lançamentos considerados. Nesse caso o veredito vem nulo.",
            example: true,
        },
        versus_previous: {
            type: "object",
            properties: {
                current: monthSnapshotSchema,
                previous: monthSnapshotSchema,
                difference: monthTotalsSchema,
            },
        },
        same_day: {
            type: "object",
            nullable: true,
            description: "Comparação de gastos até o dia de hoje. Só existe enquanto o mês está em andamento.",
            properties: {
                day: { type: "integer", example: 15 },
                current_expense: { type: "number", example: 1100 },
                previous_expense: { type: "number", example: 1380 },
                difference: { type: "number", example: -280 },
            },
        },
        top_categories: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    category: { type: "string", example: "Alimentação" },
                    total_amount: { type: "number", example: 890.5 },
                    previous_amount: { type: "number", example: 640 },
                    difference: { type: "number", example: 250.5 },
                },
            },
        },
        income_used_percentage: {
            type: "object",
            description: "Percentual do dinheiro que entrou que já foi gasto. Nulo quando não entrou dinheiro.",
            properties: {
                current: { type: "number", nullable: true, example: 46.01 },
                previous: { type: "number", nullable: true, example: 58.8 },
            },
        },
        last_three_months: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    ...monthSnapshotSchema.properties,
                    in_progress: { type: "boolean", example: false },
                },
            },
        },
        verdict: {
            type: "object",
            nullable: true,
            properties: {
                state: { type: "string", enum: ["tranquilo", "apertado", "no_vermelho"] as string[], example: "tranquilo" },
                balance: { type: "number", example: 2699.5 },
                income_used_percentage: { type: "number", nullable: true, example: 46.01 },
            },
        },
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
