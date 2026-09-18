import { prisma } from "../config/prisma";
import { Prisma } from "../config/generated/prisma/client";
import { ConflictError } from "../errors/domain-errors";
import { User, UserCreate } from "../models/users";

export class AuthRepository {
    async create({ email, name, password }: UserCreate) {
        try {
            return await prisma.user.create({
                data: { email, name, password },
                select: { id: true },
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new ConflictError("Já existe um usuário cadastrado com esse e-mail!")
            }

            throw error
        }
    }

    async findByEmail(email: User["email"]) {
        return prisma.user.findUnique({
            where: { email },
        })
    }

    async findById(id: User["id"]) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                created_at: true,
            },
        })
    }
}
