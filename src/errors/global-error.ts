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

    else if (typeof (error as unknown as { code?: string }).code === "string" && /^[0-9A-Z]{5}$/.test((error as unknown as { code: string }).code)) {
        const sqlCode = (error as unknown as { code: string }).code;
        let sqlMessage = "Erro de banco de dados.";
        let sqlStatus = 400;

        switch (sqlCode) {
            case "23505":
                sqlMessage = "Já existe um registro com esse valor";
                sqlStatus = 409;
                break;
            case "23503":
                sqlMessage = "Violação de chave estrangeira.";
                sqlStatus = 409;
                break;
            case "42703":
                sqlMessage = "Campo inválido na consulta.";
                break;
            case "42601":
                sqlMessage = "Erro de sintaxe SQL.";
                break;
            default:
                sqlMessage = error.message || "Erro de banco de dados.";
        }

        statusCode = sqlStatus;
        responseBody = {
            message: sqlMessage,
        };
        request.log.error(`[POSTGRES ERROR] ${sqlCode}: ${error.message}`);
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