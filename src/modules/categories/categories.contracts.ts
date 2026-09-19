import { Category, Prisma } from "../../config/generated/prisma/client"

export type { Category }

export type CategoriesGetAllInput = Pick<Category, "user_id">

export type CategoriesGetAllOutput = Category[]

export type CategoriesCreateInput = {
    user_id: Category["user_id"]
    name: Category["name"]
    icon: Category["icon"]
    color: Category["color"]
}

export type CategoriesCreateOutput = void

export type CategoriesUpdateInput = CategoriesCreateInput & Pick<Category, "id">

export type CategoriesUpdateOutput = void

export type CategoriesDeleteInput = Pick<Category, "id" | "user_id">

export type CategoriesDeleteOutput = void

export type CategoriesCreateData = Omit<Prisma.CategoryUncheckedCreateInput, "id" | "created_at">

export type CategoriesUpdateData = Prisma.CategoryUncheckedUpdateInput
