import { hash, compare } from "bcrypt"
import { BadRequestError, NotFoundError } from "../errors/domain-errors";
import { User, UserCreate, UserLogin } from "../models/users";
import { AuthRepository } from "../repository/auth-repository";

export class AuthService {
    constructor(private authRepository: AuthRepository) {}

    async register({ email, name, password }: UserCreate) {
        const passwordHash = await hash(password, 10)
        const user = await this.authRepository.create({ email, name, password: passwordHash })

        return { id: user.id }
    }

    async login({ email, password }: UserLogin) {
        const user = await this.authRepository.findByEmail(email)

        if (!user) {
            throw new NotFoundError("Nenhum usuário cadastrado com essas credenciais!")
        }

        const passwordIsCorrect = await compare(password, user.password)

        if (!passwordIsCorrect) {
            throw new BadRequestError("Credenciais Inválidas")
        }

        return {
            id: user.id
        }
    }

    async getUser(id: User["id"]) {
        const user = await this.authRepository.findById(id)

        if (!user) {
            throw new NotFoundError("Usuário não encontrado")
        }

        return user
    }
}
