import { User } from "../../config/generated/prisma/client"

export type { User }

export type AuthRegisterInput = Omit<User, "id" | "created_at">

export type AuthRegisterOutput = Pick<User, "id">

export type AuthLoginInput = Pick<User, "email" | "password">

export type AuthLoginOutput = Pick<User, "id">

export type AuthGetUserInput = Pick<User, "id">

export type AuthGetUserOutput = Pick<User, "id" | "name" | "email" | "created_at">
