import type { FastifySchema } from "fastify"
import {
    bearerSecurity,
    categorySchema,
    conflictErrorResponse,
    internalErrorResponse,
    notFoundErrorResponse,
    overviewSchema,
    statsQuerySchema,
    transactionSchema,
    transactionSummarySchema,
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
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
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
    description: "Autentica o usuário e retorna um token JWT.",
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
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
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
    description: "Retorna todas as categorias do usuário autenticado.",
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

export const createCategorySchema: FastifySchema = {
    tags: ["Categories"],
    summary: "Criar categoria",
    description: "Cria uma nova categoria de receita ou despesa.",
    security: bearerSecurity,
    body: {
        type: "object",
        required: ["name", "type"],
        properties: {
            name: {
                type: "string",
                minLength: 1,
                maxLength: 100,
                description: "Nome da categoria",
                example: "Alimentação",
            },
            type: transactionTypeSchema,
        },
    },
    response: {
        201: {
            description: "Categoria criada",
            type: "object",
            properties: {
                message: { type: "string", example: "Categoria criada com sucesso!" },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const updateCategorySchema: FastifySchema = {
    tags: ["Categories"],
    summary: "Atualizar categoria",
    description: "Atualiza o nome, ícone e cor de uma categoria existente.",
    security: bearerSecurity,
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "integer",
                minimum: 1,
                description: "ID da categoria",
                example: 1,
            },
        },
    },
    body: {
        type: "object",
        required: ["name", "icon", "color"],
        properties: {
            name: {
                type: "string",
                minLength: 1,
                maxLength: 100,
                description: "Novo nome da categoria",
                example: "Moradia",
            },
            icon: {
                type: "string",
                minLength: 1,
                maxLength: 64,
                description: "Ícone da categoria",
                example: "tag",
            },
            color: {
                type: "string",
                minLength: 7,
                maxLength: 7,
                description: "Cor hexadecimal da categoria",
                example: "#6366F1",
            },
        },
    },
    response: {
        200: {
            description: "Categoria atualizada",
            type: "object",
            properties: {
                message: { type: "string", example: "Categoria atualizada com sucesso!" },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        500: internalErrorResponse,
    },
}

export const deleteCategorySchema: FastifySchema = {
    tags: ["Categories"],
    summary: "Deletar categoria",
    description: "Remove uma categoria do usuário autenticado.",
    security: bearerSecurity,
    params: {
        type: "object",
        required: ["id"],
        properties: {
            id: {
                type: "integer",
                minimum: 1,
                description: "ID da categoria",
                example: 1,
            },
        },
    },
    response: {
        200: {
            description: "Categoria deletada",
            type: "object",
            properties: {
                message: { type: "string", example: "Categoria deletada com sucesso!" },
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        404: notFoundErrorResponse,
        409: conflictErrorResponse,
        500: internalErrorResponse,
    },
}

export const listTransactionsSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Listar transações",
    description: "Retorna todas as transações do usuário autenticado, incluindo o nome da categoria.",
    security: bearerSecurity,
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
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const createTransactionSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Criar transação",
    description: "Registra uma nova receita ou despesa.",
    security: bearerSecurity,
    body: {
        type: "object",
        required: ["description", "category_id", "amount", "type"],
        properties: {
            description: {
                type: "string",
                minLength: 1,
                description: "Descrição da transação",
                example: "Supermercado",
            },
            category_id: {
                type: "integer",
                minimum: 1,
                description: "ID da categoria vinculada",
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
        },
    },
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
        409: conflictErrorResponse,
        500: internalErrorResponse,
    },
}

export const updateTransactionSchema: FastifySchema = {
    tags: ["Transactions"],
    summary: "Atualizar transação",
    description: "Atualiza os dados de uma transação existente.",
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
    body: {
        type: "object",
        required: ["description", "category_id", "amount", "type"],
        properties: {
            description: {
                type: "string",
                minLength: 1,
                description: "Nova descrição da transação",
                example: "Farmácia",
            },
            category_id: {
                type: "integer",
                minimum: 1,
                description: "ID da categoria vinculada",
                example: 2,
            },
            amount: {
                type: "number",
                minimum: 0,
                exclusiveMinimum: true,
                description: "Novo valor da transação. Deve ser maior que zero.",
                example: 89.9,
            },
            type: transactionTypeSchema,
        },
    },
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

export const transactionsSummarySchema: FastifySchema = {
    tags: ["Stats"],
    summary: "Resumo das transações",
    description: "Retorna totais de receita, despesa e saldo do mês/ano informados. Sem query params, usa o mês e o ano atuais.",
    security: bearerSecurity,
    querystring: statsQuerySchema,
    response: {
        200: {
            description: "Resumo encontrado",
            type: "object",
            properties: {
                message: { type: "string", example: "Resumo das transações buscadas com sucesso" },
                success: { type: "boolean", example: true },
                summary: transactionSummarySchema,
            },
        },
        400: validationErrorResponse,
        401: unauthorizedErrorResponse,
        500: internalErrorResponse,
    },
}

export const overviewSchemaDoc: FastifySchema = {
    tags: ["Stats"],
    summary: "Overview financeiro",
    description: "Retorna estatísticas base, gastos por categoria e insights do mês/ano informados. Sem query params, usa o mês e o ano atuais.",
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
