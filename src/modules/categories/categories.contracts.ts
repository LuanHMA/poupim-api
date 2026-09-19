import { Category } from "../../config/generated/prisma/client"

export type { Category }

export type CategoriesGetAllInput = Pick<Category, "user_id">

export type CategoriesGetAllOutput = Category[]

export type CategoriesCreateInput = Omit<Category, "id" | "created_at">

export type CategoriesCreateOutput = void

export type CategoriesUpdateInput = Pick<Category, "id" | "name" | "user_id" | "type">

export type CategoriesUpdateOutput = void

export type CategoriesDeleteInput = Pick<Category, "id" | "user_id">

export type CategoriesDeleteOutput = void
