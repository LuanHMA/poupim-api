import { Category } from "../config/generated/prisma/client"

export type { Category }

export type CategoryCreate = Omit<Category, "id" | "created_at">

export type CategoryDelete = Pick<Category, "id" | "user_id">

export type CategoryUpdate = Pick<Category, "id" | "name" | "user_id" | "type">
