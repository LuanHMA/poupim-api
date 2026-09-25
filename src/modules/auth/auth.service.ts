import { compare, hash } from "bcrypt";
import { BadRequestError, NotFoundError } from "../../errors/domain-errors";
import {
    AuthGetUserInput,
    AuthGetUserOutput,
    AuthLoginInput,
    AuthLoginOutput,
    AuthRegisterInput,
    AuthRegisterOutput,
} from "./auth.contracts";
import { AuthRepository } from "./auth.repository";

export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    async register({ email, name, password }: AuthRegisterInput): Promise<AuthRegisterOutput> {
        const passwordHash = await hash(password, 10)
        const user = await this.authRepository.create({ email, name, password: passwordHash })

        return { id: user.id }
    }

    async login({ email, password }: AuthLoginInput): Promise<AuthLoginOutput> {
        const user = await this.authRepository.findByEmail({ email })

        if (!user) {
            throw new NotFoundError("Nenhum usuário cadastrado com essas credenciais!")
        }

        const passwordIsCorrect = await compare(password, user.password)

        if (!passwordIsCorrect) {
            throw new BadRequestError("Credenciais Inválidas")
        }

        const { password: _, ...userWithoutPassword } = user

        return userWithoutPassword
    }

    async getUser({ id }: AuthGetUserInput): Promise<AuthGetUserOutput> {
        const user = await this.authRepository.findById({ id })

        if (!user) {
            throw new NotFoundError("Usuário não encontrado")
        }

        return user
    }
}
