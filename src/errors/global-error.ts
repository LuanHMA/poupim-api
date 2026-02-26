import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { DomainError } from "./domain-errors.js";
import { JsonWebTokenError } from "jsonwebtoken";

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

    else if (error instanceof JsonWebTokenError) {
        let jwtMessage = "Token inválido.";
        let jwtStatus = 401;

        switch (error.message) {
            case "invalid signature":
                jwtMessage = "Assinatura do token inválida.";
                break;
            case "jwt expired":
                jwtMessage = "Token expirado.";
                break;
            case "jwt malformed":
                jwtMessage = "Token malformado.";
                break;
            case "invalid token":
                jwtMessage = "Token inválido.";
                break;
            default:
                jwtMessage = error.message || "Token inválido.";
        }
        statusCode = jwtStatus;
        responseBody = {
            message: jwtMessage,
        };
        request.log.warn(`[JWT ERROR] ${error.message}`);
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