import { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../config/database";
import { UserCreate, UserLogin, Users } from "../models/users";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/domain-errors";
import { hash, compare } from "bcrypt"

export class AuthService {
    async register({ email, name, password }: UserCreate) {
        const [users] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email])

        if (users.length > 0) {
            throw new ConflictError("Já existe um usuário cadastrado com esse e-mail!")
        }

        const passwordHash = await hash(password, 10)

        const result = await db.execute<ResultSetHeader>("INSERT INTO users (email, name, password) VALUES (?,?,?)", [email, name, passwordHash])

        return {
            id: result[0].insertId
        }
    }

    async login({ email, password }: UserLogin) {
        const [users] = await db.execute<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email])

        if (users.length === 0) {
            throw new NotFoundError("Nenhum usuário cadastrado com essas credenciais!")
        }

        const user = users[0] as Users

        const passwordIsCorrect = await compare(password, user.password)

        if (!passwordIsCorrect) {
            throw new BadRequestError("Credenciais Inválidas")
        }

        return {
            id: user.id
        }
    }

    async getUser(id: Users["id"]) {
        const [users] = await db.execute<RowDataPacket[]>("SELECT id, name, created_at, email FROM users WHERE id = ?", [id])

        if (users.length === 0) {
            throw new NotFoundError("Usuário não encontrado")
        }

        return users[0] as Users
    }
}