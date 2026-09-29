import type { FastifySchema } from "fastify"
import {
    bearerSecurity,
    categorySchema,
    conflictErrorResponse,
    internalErrorResponse,
    notFoundErrorResponse,
    overviewSchema,
    periodSchema,
    statsQuerySchema,
    categoryStatsSchema,
    transactionSchema,
    cashFlowSchema,
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
    description: "Autentica o usuário e retorna o token JWT junto com os dados da conta. E-mail inexistente responde 404; senha incorreta responde 400.",
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
        404: notFoundErrorResponse,
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
    description: "Retorna as transações do usuário no mês e ano informados, da mais recente para a mais antiga. Cada item inclui o nome da categoria. Os filtros type, category_id, status e search são opcionais e se combinam.",
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
            limit: {
                type: "integer",
                minimum: 1,
                description: "Quantidade máxima de transações. Sem este parâmetro, retorna todas do período.",
                example: 20,
            },
            type: transactionTypeSchema,
            category_id: {
                type: "integer",
                minimum: 1,
                description: "ID de uma categoria pré-definida do sistema",
                example: 1,
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

export const overviewSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Overview financeiro",
    description: "Retorna estatísticas base, gastos por categoria de despesa e insights do mês/ano informados. Sem query params, usa o mês e o ano atuais. Transações marcadas como ignoradas entram nos totais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Overview encontrado",
            type: "object",
            properties: {
                message: { type: "string", example: "Overview das transações buscadas com sucesso" },
                success: { type: "boolean", example: true },
                overview: overviewSchema,
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
