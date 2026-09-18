import { User } from "../config/generated/prisma/client"

export type { User }

export type UserCreate = Omit<User, "id" | "created_at">

export type UserLogin = Pick<User, "email" | "password">
