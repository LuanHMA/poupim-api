import { Prisma, User } from "../../config/generated/prisma/client"

export type { User }

export type AuthRegisterInput = {
    name: User["name"]
    email: User["email"]
    password: string
}

export type AuthRegisterOutput = Pick<User, "id">

export type AuthLoginInput = {
    email: User["email"]
    password: string
}

export type AuthLoginOutput = Omit<User, "password">

export type AuthGetUserInput = Pick<User, "id">

export type AuthGetUserOutput = Pick<User, "id" | "name" | "email" | "created_at">

export type AuthCreateData = Omit<Prisma.UserUncheckedCreateInput, "id" | "created_at">
