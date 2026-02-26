import jwt from "jsonwebtoken"
import { env } from "../config/env"
import { UnauthorizedError } from "../errors/domain-errors"

export function generateToken(id: number) {
    return {
        token: jwt.sign({ id }, env.JWT_SECRET, { expiresIn: "30d" })
    }

}
export function verifyToken(token: string) {
    const { id } = jwt.verify(token, env.JWT_SECRET) as { id: number }

    return {
        userId: id
    }

}
