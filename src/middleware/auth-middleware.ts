import { FastifyReply, FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { id: number }
        user: { id: number }
    }
}

export async function AuthMiddleware(request: FastifyRequest, _reply: FastifyReply) {
    await request.jwtVerify()
}
