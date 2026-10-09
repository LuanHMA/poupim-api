import type { FastifySchema } from "fastify"
import {
    bearerSecurity,
    basesStatsSchema,
    cashFlowSchema,
    monthlyStatsSchema,
    categorySchema,
    categoryStatsSchema,
    conflictErrorResponse,
    internalErrorResponse,
    monthInsightsSchema,
    notFoundErrorResponse,
    periodSchema,
    statsQuerySchema,
    transactionSchema,
    transactionStatusSchema,
    transactionTypeSchema,
    unauthorizedErrorResponse,
    userSchema,
    validationErrorResponse,
} from "./common-schemas"

export const healthSchema: FastifySchema = {
    tags: ["Health"],
    summary: "Health check",
    description: "Verifica se a API está em execução.",
    security: [],
    response: {
        200: {
            description: "API em execução",
            type: "string",
            example: "Api is running",
        },
    },
}

export const registerSchema: FastifySchema = {
    tags: ["Auth"],
    summary: "Registrar usuário",
    description: "Cria uma nova conta e retorna um token JWT.",
    security: [],
    body: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
            name: {
                type: "string",
                minLength: 1,
                description: "Nome do usuário",
                example: "Luan Silva",
            },
            email: {
                type: "string",
                format: "email",
                description: "E-mail único do usuário",
                example: "luan@email.com",
            },
            password: {
                type: "string",
                minLength: 6,
                description: "Senha com no mínimo 6 caracteres",
                example: "123456",
            },
        },
    },
    response: {
        201: {
            description: "Usuário criado com sucesso",
            type: "object",
            properties: {
                message: { type: "string", example: "Usuário criado com sucesso!" },
                success: { type: "boolean", example: true },
                accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            },
        },
        400: validationErrorResponse,
        409: conflictErrorResponse,
        500: internalErrorResponse,
    },
}

export const loginSchema: FastifySchema = {
    tags: ["Auth"],
    summary: "Login",
    description: "Autentica o usuário e retorna o token JWT junto com os dados da conta. E-mail inexistente ou senha incorreta responde 401.",
    security: [],
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: {
                type: "string",
                format: "email",
                description: "E-mail cadastrado",
                example: "luan@email.com",
            },
            password: {
                type: "string",
                minLength: 6,
                description: "Senha da conta",
                example: "123456",
            },
        },
    },
    response: {
        200: {
            description: "Login realizado com sucesso",
            type: "object",
            properties: {
                message: { type: "string", example: "Usuário logado com sucesso" },
                success: { type: "boolean", example: true },
                accessToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                user: userSchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const meSchema: FastifySchema = {
    tags: ["Auth"],
    summary: "Usuário autenticado",
    description: "Retorna os dados do usuário vinculado ao token JWT.",
    security: bearerSecurity,
    response: {
        200: {
            description: "Usuário encontrado",
            type: "object",
            properties: {
                message: { type: "string", example: "Usuário encontrado com sucesso" },
                success: { type: "boolean", example: true },
                user: userSchema,
            },
        },
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        500: internalErrorResponse,
    },
}

export const listCategoriesSchema: FastifySchema = {
    tags: ["Categories"],
    summary: "Listar categorias",
    description: "Retorna as categorias pré-definidas do sistema para o usuário escolher na transação.",
    security: bearerSecurity,
    response: {
        200: {
            description: "Categorias encontradas",
            type: "object",
            properties: {
                message: { type: "string", example: "Categorias buscadas com sucesso!" },
                categories: {
                    type: "array",
                    items: categorySchema,
                },
            },
        },
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

const transactionWriteBody = {
    type: "object",
    required: ["description", "category_id", "amount", "type", "status", "ignore", "fixed", "date"],
    properties: {
        description: {
            type: "string",
            minLength: 1,
            description: "Descrição da transação",
            example: "Supermercado",
        },
        observation: {
            type: "string",
            description: "Observação opcional. Quando omitida, é gravada como texto vazio.",
            example: "Compra da semana",
        },
        category_id: {
            type: "integer",
            minimum: 1,
            description: "ID de uma categoria pré-definida do sistema",
            example: 1,
        },
        amount: {
            type: "number",
            minimum: 0,
            exclusiveMinimum: true,
            description: "Valor da transação. Deve ser maior que zero.",
            example: 150.9,
        },
        type: transactionTypeSchema,
        status: transactionStatusSchema,
        ignore: {
            type: "boolean",
            description: "Marca a transação como ignorada",
            example: false,
        },
        fixed: {
            type: "boolean",
            description: "Marca a transação como fixa",
            example: false,
        },
        date: {
            type: "string",
            format: "date-time",
            description: "Data da transação. O mês e o ano persistidos vêm deste valor.",
            example: "2026-03-18T12:00:00.000Z",
        },
    },
}

export const listTransactionsSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Listar transações",
    description: "Retorna as transações do usuário no mês e ano informados, da mais recente para a mais antiga, paginadas. Sem page e limit, usa a página 1 com 20 itens. Cada item inclui a categoria com id, nome, cor e ícone. Os filtros type, category_id, status e search são opcionais e se combinam. category_id aceita um ou mais IDs separados por vírgula. A resposta traz pagination com page, limit, total e total_pages.",
    security: bearerSecurity,
    querystring: {
        type: "object",
        required: ["month", "year"],
        properties: {
            month: {
                type: "integer",
                minimum: 1,
                maximum: 12,
                description: "Mês de referência (1-12)",
                example: 3,
            },
            year: {
                type: "integer",
                minimum: 1,
                description: "Ano de referência",
                example: 2026,
            },
            page: {
                type: "integer",
                minimum: 1,
                default: 1,
                description: "Página da listagem. Começa em 1.",
                example: 1,
            },
            limit: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 20,
                description: "Quantidade de transações por página.",
                example: 20,
            },
            type: transactionTypeSchema,
            category_id: {
                type: "string",
                description: "IDs de categorias separados por vírgula. Um único ID também é aceito.",
                example: "1,2",
            },
            status: transactionStatusSchema,
            search: {
                type: "string",
                minLength: 1,
                description: "Trecho buscado na descrição ou na observação",
                example: "supermercado",
            },
        },
    },
    response: {
        200: {
            description: "Transações encontradas",
            type: "object",
            properties: {
                message: { type: "string", example: "Transações buscadas com sucesso" },
                success: { type: "boolean", example: true },
                transactions: {
                    type: "array",
                    items: transactionSchema,
                },
                pagination: {
                    type: "object",
                    properties: {
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 20 },
                        total: { type: "integer", description: "Total de transações que batem com os filtros", example: 42 },
                        total_pages: { type: "integer", example: 3 },
                    },
                },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const createTransactionSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Criar transação",
    description: "Registra uma nova receita ou despesa. O mês e o ano são derivados do campo date. A categoria precisa existir no catálogo do sistema.",
    security: bearerSecurity,
    body: transactionWriteBody,
    response: {
        201: {
            description: "Transação criada",
            type: "object",
            properties: {
                message: { type: "string", example: "Transação criada com sucesso" },
                success: { type: "boolean", example: true },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        500: internalErrorResponse,
    },
}

export const updateTransactionSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Atualizar transação",
    description: "Atualiza os dados de uma transação existente. O mês e o ano são derivados do campo date. A categoria precisa existir no catálogo do sistema.",
    security: bearerSecurity,
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "integer",
                minimum: 1,
                description: "ID da transação",
                example: 10,
            },
        },
    },
    body: transactionWriteBody,
    response: {
        200: {
            description: "Transação atualizada",
            type: "object",
            properties: {
                message: { type: "string", example: "Transação atualizada com sucesso" },
                success: { type: "boolean", example: true },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        500: internalErrorResponse,
    },
}

export const deleteTransactionSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Deletar transação",
    description: "Remove uma transação do usuário autenticado.",
    security: bearerSecurity,
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "integer",
                minimum: 1,
                description: "ID da transação",
                example: 10,
            },
        },
    },
    response: {
        200: {
            description: "Transação deletada",
            type: "object",
            properties: {
                message: { type: "string", example: "Transação deletada com sucesso!" },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        500: internalErrorResponse,
    },
}

export const cashFlowSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Fluxo de caixa",
    description: "Retorna o mês, o ano e os totais de receita, despesa e saldo. Sem query params, usa o mês e o ano atuais. Transações marcadas como ignoradas entram nos totais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Fluxo de caixa encontrado",
            type: "object",
            properties: {
                message: { type: "string", example: "Fluxo de saldo buscado com sucesso" },
                success: { type: "boolean", example: true },
                cashFlow: cashFlowSchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const periodsSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Períodos com registros",
    description: "Retorna os meses e anos em que o usuário autenticado possui transações, do mais recente para o mais antigo.",
    security: bearerSecurity,
    response: {
        200: {
            description: "Períodos encontrados",
            type: "object",
            properties: {
                message: { type: "string", example: "Períodos buscados com sucesso" },
                success: { type: "boolean", example: true },
                periods: {
                    type: "array",
                    items: periodSchema,
                },
            },
        },
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const basesStatsSchemaDoc: FastifySchema = {
    tags: ["Reports"],
    summary: "Estatísticas base do relatório",
    description: "Retorna totais de receita, despesa, saldo, quantidade de transações, maior despesa e média diária de gasto do mês/ano informados. Sem query params, usa o mês e o ano atuais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Estatísticas base encontradas",
            type: "object",
            properties: {
                message: { type: "string", example: "Estatísticas base buscadas com sucesso" },
                success: { type: "boolean", example: true },
                basesStats: basesStatsSchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const monthInsightsSchemaDoc: FastifySchema = {
    tags: ["Reports"],
    summary: "Insights do relatório mensal",
    description: "Retorna os insights do mês/ano informados: desempenho da economia, proporção de gastos, categoria com maior despesa, frequência e média diária. Sem query params, usa o mês e o ano atuais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Insights do mês encontrados",
            type: "object",
            properties: {
                message: { type: "string", example: "Insights do mês buscados com sucesso" },
                success: { type: "boolean", example: true },
                monthInsights: monthInsightsSchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const monthlyStatsSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Estatísticas do mês",
    description: "Compara o mês pedido com o anterior: entrou, saiu e o que sobrou, a diferença em reais, o gasto até o mesmo dia, as 5 categorias que mais saíram, o percentual do dinheiro recebido que foi gasto, os últimos 3 meses e o veredito. Sem query params, usa o mês e o ano atuais. Mês sem lançamentos devolve veredito nulo.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Estatísticas do mês encontradas",
            type: "object",
            properties: {
                message: { type: "string", example: "Estatísticas do mês buscadas com sucesso" },
                success: { type: "boolean", example: true },
                monthly: monthlyStatsSchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const topExpenseCategoriesSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Top categorias de despesa",
    description: "Retorna até 5 categorias de despesa com maior gasto do mês/ano informados, já com o percentual sobre o total de despesas. Sem query params, usa o mês e o ano atuais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Top categorias de despesa encontradas",
            type: "object",
            properties: {
                message: { type: "string", example: "Top categorias de despesa buscadas com sucesso" },
                success: { type: "boolean", example: true },
                topExpenseCategories: {
                    type: "array",
                    items: categoryStatsSchema,
                },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}
