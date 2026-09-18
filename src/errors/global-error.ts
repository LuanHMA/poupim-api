import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { Prisma } from "../config/generated/prisma/client";
import { DomainError } from "./domain-errors.js";

interface ErrorResponse {
    message: string;
    details?: unknown;
}

export function globalErrorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
    let statusCode: number;
    let responseBody: ErrorResponse;

    // Erros de Domínio
    if (error instanceof DomainError) {
        statusCode = error.status;
        responseBody = {
            message: error.message,
            details: error.details,
        };
        request.log.warn(`[DOMAIN ERROR] ${error.name}: ${error.message}`);
    }

    // Erros de Validação (ZOD)
    else if (error instanceof ZodError) {
        statusCode = 400;
        const zodDetails = error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));

        responseBody = {
            message: "Dados de entrada inválidos. Verifique os detalhes.",
            details: zodDetails,
        };

        request.log.info(`[VALIDATION ERROR] Zod: ${JSON.stringify(zodDetails)}`);
    }

    else if (typeof (error as Error & { code?: string }).code === "string" && (error as Error & { code: string }).code.startsWith("FST_JWT_")) {
        const jwtCode = (error as Error & { code: string }).code;
        let jwtMessage = "Token inválido.";

        switch (jwtCode) {
            case "FST_JWT_NO_AUTHORIZATION_IN_HEADER":
            case "FST_JWT_NO_AUTHORIZATION_IN_COOKIE":
                jwtMessage = "Token de autenticação não fornecido";
                break;
            case "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED":
                jwtMessage = "Token expirado.";
                break;
            case "FST_JWT_AUTHORIZATION_TOKEN_INVALID":
                jwtMessage = "Token inválido.";
                break;
            default:
                jwtMessage = error.message || "Token inválido.";
        }

        statusCode = 401;
        responseBody = {
            message: jwtMessage,
        };
        request.log.warn(`[JWT ERROR] ${jwtCode}: ${error.message}`);
    }

    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        let prismaMessage = "Erro de banco de dados.";
        let prismaStatus = 400;

        switch (error.code) {
            case "P2002":
                prismaMessage = "Já existe um registro com esse valor";
                prismaStatus = 409;
                break;
            case "P2003":
            case "P2014":
                prismaMessage = "Violação de chave estrangeira.";
                prismaStatus = 409;
                break;
            case "P2025":
                prismaMessage = "Registro não encontrado.";
                prismaStatus = 404;
                break;
            default:
                prismaMessage = error.message || "Erro de banco de dados.";
        }

        statusCode = prismaStatus;
        responseBody = {
            message: prismaMessage,
        };
        request.log.error(`[PRISMA ERROR] ${error.code}: ${error.message}`);
    }

    // Validação de erros SQL do mysql2
    else if (typeof (error as any).code === 'string' && typeof (error as any).errno === 'number') {
        const sqlCode = (error as any).code;
        let sqlMessage = 'Erro de banco de dados.';
        let sqlStatus = 400;

        switch (sqlCode) {
            case 'ER_DUP_ENTRY':
                sqlMessage = 'Já existe um registro com esse valor';
                break;
            case 'ER_BAD_FIELD_ERROR':
                sqlMessage = 'Campo inválido na consulta.';
                break;
            case 'ER_NO_REFERENCED_ROW_2':
                sqlMessage = 'Chave estrangeira não encontrada.';
                sqlStatus = 409;
                break;
            case 'ER_ROW_IS_REFERENCED_2':
                sqlMessage = 'Violação de chave estrangeira: registro referenciado.';
                sqlStatus = 409;
                break;
            case 'ER_PARSE_ERROR':
                sqlMessage = 'Erro de sintaxe SQL.';
                break;
            default:
                sqlMessage = error.message || 'Erro de banco de dados.';
        }

        statusCode = sqlStatus;
        responseBody = {
            message: sqlMessage,
        };
        request.log.error(`[MYSQL ERROR] ${sqlCode}: ${error.message}`);
    }

    else {
        statusCode = 500;
        responseBody = {
            message: "Ocorreu um erro interno inesperado no servidor.",
        };
        request.log.error(`[UNEXPECTED ERROR] ${error}`);
    }

    console.log(error)

    return reply.status(statusCode).send({ ...responseBody, success: false });
}