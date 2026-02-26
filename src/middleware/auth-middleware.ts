import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../errors/domain-errors";
import { verifyToken } from "../utils/jwt";

declare module "fastify" {
    export interface FastifyRequest {
        user_id: number
    }
}

export async function AuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
    const { authorization } = request.headers

    if (!authorization) {
        throw new UnauthorizedError("Token de autenticação não fornecido");
    }

    const parts = authorization.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new UnauthorizedError("Formato do token inválido");
    }

    const token = parts[1]

    if (!token) {
        throw new UnauthorizedError("Token de autenticação não segue o formato Bearer");
    }

    const { user_id } = verifyToken(token)

    request.user_id = user_id
}