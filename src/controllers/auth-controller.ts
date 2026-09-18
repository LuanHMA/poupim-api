import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AuthService } from "../services/auth-service";

export class AuthController {
    constructor(private authService: AuthService) {}

    async register(request: FastifyRequest, reply: FastifyReply) {
        const bodySchema = z.object({
            name: z
                .string("Insira um nome válido")
                .min(1, "O nome é obrigatório"),
            email: z
                .string("Insira um e-mail válido")
                .min(1, "O e-mail é obrigatório")
                .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
            password: z
                .string("Insira uma senha válida")
                .min(6, "Sua senha deve ter no mínimo 6 caracteres")
        })

        const body = bodySchema.parse(request.body)

        const { id } = await this.authService.register(body)
        const token = await reply.jwtSign({ id })

        return reply.status(201).send({ message: "Usuário criado com sucesso!", success: true, token })
    }

    async login(request: FastifyRequest, reply: FastifyReply) {
        const bodySchema = z.object({
            email: z
                .string("Insira um e-mail válido")
                .min(1, "O e-mail é obrigatório")
                .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
            password: z
                .string("Insira uma senha válida")
                .min(6, "Sua senha deve ter no mínimo 6 caracteres")
        })

        const body = bodySchema.parse(request.body)

        const { id } = await this.authService.login(body)
        const token = await reply.jwtSign({ id })

        return reply.status(200).send({ message: "Usuário logado com sucesso", success: true, token })
    }

    async me(request: FastifyRequest, reply: FastifyReply) {
        const { user_id } = request

        const user = await this.authService.getUser(user_id)

        return reply.status(200).send({ message: "Usuário encontrado com sucesso", success: true, user })
    }

}